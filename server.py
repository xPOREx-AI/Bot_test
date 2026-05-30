import csv
import json
import os
import re
import math
import hashlib
from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import Any

from fastapi import Body, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import httpx

BASE_DIR = Path(__file__).parent

# ──────────────────────────────────────────────
# RECORD HELPERS
# ──────────────────────────────────────────────

def _extract_section(content: str, header: str) -> str:
    m = re.search(rf'{re.escape(header)}(.*?)(?=^##\s|\Z)', content, re.DOTALL | re.MULTILINE)
    return m.group(1) if m else ''

def _parse_table(section_text: str) -> list[dict]:
    rows = []
    for line in section_text.splitlines():
        if not line.startswith('|'): continue
        if re.match(r'^\|[\s\-:|]+\|$', line.replace(' ', '')): continue
        parts = [p.strip() for p in line.split('|')]
        parts = [p for p in parts if p != '']
        if len(parts) < 2: continue
        if parts[0] in ('วันที่', 'อันดับ', '---'): continue
        
        if len(parts) >= 7:
            problem, solution = parts[2], parts[3]
        else:
            problem = parts[1]
            solution = parts[3] if len(parts) > 3 else (parts[2] if len(parts) > 2 else '—')
        rows.append({'problem': problem, 'solution': solution})
    return rows

def _rebuild_summary(content: str, machine_name: str = '') -> str:
    manual_rows = _parse_table(_extract_section(content, '## บันทึกการแจ้งซ่อม'))
    ai_rows     = _parse_table(_extract_section(content, '## บันทึกจาก AI Chat'))
    all_rows    = manual_rows + ai_rows

    if not all_rows: return content

    freq = Counter(r['problem'] for r in all_rows)
    solutions: dict[str, str] = {}
    for r in all_rows:
        if r['solution'] and r['solution'] != '—':
            solutions[r['problem']] = r['solution']

    now = datetime.now().strftime('%Y-%m-%d %H:%M')
    total = len(all_rows)

    lines = [
        '## ปัญหาที่พบบ่อยที่สุด (สรุปอัตโนมัติ)', '',
        f'> อัปเดตล่าสุด: **{now}** — รวมข้อมูลทั้งหมด **{total} รายการ** '
        f'(แจ้งซ่อมด้วยตนเอง {len(manual_rows)} + จาก AI Chat {len(ai_rows)})', '',
        '| อันดับ | ปัญหา / Alarm | จำนวน | วิธีแก้ไขที่ใช้ |',
        '|--------|-------------|:-----:|--------------|',
    ]
    for rank, (problem, count) in enumerate(freq.most_common(), 1):
        sol = solutions.get(problem, '—')
        lines.append(f'| {rank} | {problem} | **{count}** ครั้ง | {sol} |')

    new_section = '\n'.join(lines)

    summary_re = re.compile(r'## ปัญหาที่พบบ่อยที่สุด.*?(?=^##\s|\Z)', re.DOTALL | re.MULTILINE)
    if summary_re.search(content):
        return summary_re.sub(new_section + '\n', content)

    for marker in ('## หมายเหตุ', '## บันทึกจาก AI Chat', '\n---'):
        if marker in content:
            idx = content.index(marker)
            return content[:idx].rstrip() + '\n\n' + new_section + '\n\n' + content[idx:]

    return content.rstrip() + '\n\n' + new_section + '\n'

# ──────────────────────────────────────────────
# RAG EMBEDDING HELPERS
# ──────────────────────────────────────────────
MANUAL_EMBEDDINGS_CACHE = {}

async def get_embedding(client: httpx.AsyncClient, text: str, api_key: str):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={api_key}"
    res = await client.post(url, json={"model": "models/text-embedding-004", "content": {"parts": [{"text": text}]}})
    if res.status_code == 200:
        return res.json()["embedding"]["values"]
    return None

def cosine_similarity(v1, v2):
    dot_product = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    return dot_product / (mag1 * mag2) if mag1 and mag2 else 0

def chunk_text(text: str) -> list[str]:
    chunks = text.split('\n## ')
    return [("## " + c if i > 0 else c).strip() for i, c in enumerate(chunks) if len(c.strip()) > 10]

# ──────────────────────────────────────────────
# FASTAPI APP
# ──────────────────────────────────────────────
app = FastAPI(title="Machine AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

@app.post("/api/chat")
async def secure_gemini_chat(payload: dict = Body(...)):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="ไม่พบ API Key ในตู้เซฟของ Render")
    
    gemini_model = payload.get("model", "gemini-3.1-flash-lite")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{gemini_model}:generateContent?key={GEMINI_API_KEY}"
    
    contents = payload.get("contents", [])
    text_content = str(contents).lower()
    
    banned_keywords = ["ignore previous instructions", "system override", "hack", "ขโมยคีย์"]
    if any(word in text_content for word in banned_keywords):
        raise HTTPException(status_code=400, detail="การร้องขอถูกบล็อกเนื่องจากความปลอดภัย")

    sys_parts = payload.get("system_instruction", {}).get("parts", [{}])
    sys_text = sys_parts[0].get("text", "") if sys_parts else ""
    
    async with httpx.AsyncClient() as client:
        # === RAG Processing ===
        if "=== คู่มือเครื่องจักร ===" in sys_text and contents:
            base_sys, manual_text = sys_text.split("=== คู่มือเครื่องจักร ===", 1)
            manual_text = manual_text.strip()
            manual_hash = hashlib.md5(manual_text.encode('utf-8')).hexdigest()
            
            if manual_hash not in MANUAL_EMBEDDINGS_CACHE:
                chunks = chunk_text(manual_text)
                embedded_chunks = []
                for c in chunks:
                    vec = await get_embedding(client, c, GEMINI_API_KEY)
                    if vec: embedded_chunks.append({"text": c, "vector": vec})
                MANUAL_EMBEDDINGS_CACHE[manual_hash] = embedded_chunks
            
            user_query = ""
            for part in contents[-1].get("parts", []):
                if "text" in part: user_query += part["text"] + " "
            
            relevant_text = manual_text 
            if user_query.strip() and MANUAL_EMBEDDINGS_CACHE.get(manual_hash):
                query_vec = await get_embedding(client, user_query, GEMINI_API_KEY)
                if query_vec:
                    scored = [(cosine_similarity(query_vec, item["vector"]), item["text"]) 
                              for item in MANUAL_EMBEDDINGS_CACHE[manual_hash]]
                    scored.sort(key=lambda x: x[0], reverse=True)
                    top_chunks = [x[1] for x in scored[:3]]
                    relevant_text = "\n\n...\n\n".join(top_chunks)
            
            payload["system_instruction"] = {
                "parts": [{"text": base_sys + "\n\n=== ข้อมูลอ้างอิง ===\n" + relevant_text}]
            }

        try:
            response = await client.post(
                url,
                json={
                    "system_instruction": payload.get("system_instruction"),
                    "contents": contents,
                    "generationConfig": payload.get("generationConfig", {"temperature": 0.15})
                },
                timeout=45.0
            )
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=f"API Error: {response.text}")
            return response.json()
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Server Error: {str(e)}")

# ──────────────────────────────────────────────
# OTHER ENDPOINTS
# ──────────────────────────────────────────────
@app.get("/machines")
def get_machines():
    machine_file = BASE_DIR / "machine.json"
    if not machine_file.exists():
        raise HTTPException(status_code=404, detail="machine.json not found")
    return JSONResponse(json.loads(machine_file.read_text(encoding="utf-8")))

def _load_spare_parts() -> list[dict]:
    stock_dir = BASE_DIR / "StockSparePart"
    parts: list[dict] = []
    if not stock_dir.exists(): return parts
    for csv_file in stock_dir.glob("*.csv"):
        with open(csv_file, encoding="utf-8", newline="") as f:
            for row in csv.DictReader(f):
                row["stock_breakdown"] = row.get("stock_breakdown", "False").strip().lower() == "true"
                row["quantity"] = int(row.get("quantity", 0))
                row["min_quantity"] = int(row.get("min_quantity", 0))
                parts.append(row)
    return parts

@app.get("/stock/spareparts/check")
def check_spare_part(part_name: str = Query(...), machine: str = Query(default="")):
    parts = _load_spare_parts()
    q_lower = part_name.lower()
    matched = [p for p in parts if q_lower in p["part_name"].lower() or q_lower in p["part_number"].lower()]
    if machine: matched = [p for p in matched if p["machine_code"].lower() in (machine.lower(), "all")]
    if not matched: return JSONResponse({"found": False, "message": f"ไม่พบ part: {part_name}", "parts": []})
    return JSONResponse({"found": True, "total": len(matched), "parts": matched})

def _parse_records_full(content: str, machine_code: str, machine_name: str) -> list[dict]:
    records: list[dict] = []
    for section_header, source in [('## บันทึกการแจ้งซ่อม', 'manual'), ('## บันทึกจาก AI Chat', 'ai')]:
        section_text = _extract_section(content, section_header)
        if not section_text: continue
        for line in section_text.splitlines():
            if not line.startswith('|') or re.match(r'^\|[\s\-:|]+\|$', line.replace(' ', '')): continue
            cols = [c.strip() for c in line.split('|') if c.strip()]
            if len(cols) < 2 or cols[0] in ('วันที่', 'อันดับ', '---') or cols[1] in ('Alarm / ปัญหา', 'ปัญหา / Alarm', '---') or cols[-1] in ('ผู้แจ้ง', 'ผู้บันทึก', 'วิธีแก้ไขที่ใช้'): continue
            if source == 'ai' and len(cols) >= 7:
                records.append({'date':cols[0], 'time':cols[1], 'problem':cols[2], 'solution':cols[3], 'duration':cols[4], 'result':cols[5], 'reporter':cols[6], 'machine_code':machine_code, 'machine_name':machine_name, 'source':source})
            else:
                records.append({'date':cols[0], 'problem':cols[1], 'solution':cols[-2] if len(cols)>2 else '', 'reporter':cols[-1], 'machine_code':machine_code, 'machine_name':machine_name, 'source':source})
    return records

@app.get("/dashboard/stats")
def get_dashboard_stats():
    machine_file = BASE_DIR / "machine.json"
    machines_list = json.loads(machine_file.read_text(encoding="utf-8")).get("machines", []) if machine_file.exists() else []
    machine_map = {m["code"]: m for m in machines_list}

    all_repairs = []
    record_dir = BASE_DIR / "Record"
    if record_dir.exists():
        for rf in sorted(record_dir.glob("*.md")):
            code = rf.stem
            minfo = machine_map.get(code, {})
            all_repairs.extend(_parse_records_full(rf.read_text(encoding="utf-8"), code, minfo.get("name", code.upper())))

    all_repairs.sort(key=lambda r: r.get("date", ""), reverse=True)
    repairs_by_machine = {m["code"]: {"name": m["name"], "nameTH": m.get("nameTH", ""), "count": 0} for m in machines_list}
    technicians = {}
    now_month = datetime.now().strftime("%Y-%m")
    repairs_this_month = 0
    
    for r in all_repairs:
        mc = r.get("machine_code", "")
        if mc in repairs_by_machine: repairs_by_machine[mc]["count"] += 1
        rep = r.get("reporter", "").strip()
        if rep and rep not in ("-", "ไม่ระบุ"):
            if rep not in technicians: technicians[rep] = {"count": 0, "machines": set(), "recent": ""}
            technicians[rep]["count"] += 1
            if mc: technicians[rep]["machines"].add(mc.upper())
            if r.get("date", "") > technicians[rep]["recent"]: technicians[rep]["recent"] = r["date"]
        if r.get("date", "").startswith(now_month): repairs_this_month += 1

    for t in technicians.values(): t["machines"] = list(t["machines"])
    parts = _load_spare_parts()

    return JSONResponse({
        "last_updated": datetime.now().isoformat(),
        "machines": machines_list,
        "repairs_total": len(all_repairs),
        "repairs_this_month": repairs_this_month,
        "repairs_by_machine": repairs_by_machine,
        "repairs_recent": all_repairs[:30],
        "technicians": technicians,
        "spare_parts": {
            "total": len(parts),
            "ok": sum(1 for p in parts if p["quantity"] > p["min_quantity"] and not p["stock_breakdown"]),
            "low": sum(1 for p in parts if 0 < p["quantity"] <= p["min_quantity"] and not p["stock_breakdown"]),
            "zero": sum(1 for p in parts if p["quantity"] == 0),
            "breakdown": sum(1 for p in parts if p["stock_breakdown"] and p["quantity"] > 0),
            "parts": parts,
        },
    })

@app.post("/expert-records")
def save_expert_record(data: dict = Body(...)):
    expert_dir = BASE_DIR / "ExpertRecord"
    expert_dir.mkdir(exist_ok=True)
    csv_path = expert_dir / "expert_escalations.csv"
    write_header = not csv_path.exists()
    
    with open(csv_path, "a", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        if write_header: writer.writerow(["escalation_time", "question_time", "machine_code", "machine_name", "alarm", "conversation"])
        writer.writerow([
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"), data.get("question_time", ""),
            str(data.get("machine_code", "")).strip(), str(data.get("machine_name", "")).strip(),
            str(data.get("alarm", "")).replace("\n", " ").strip(), str(data.get("conversation", "")).replace("\n", " | ").strip()
        ])
    return JSONResponse({"success": True})

@app.get("/machines/{code}/manual")
def get_manual(code: str):
    manual_file = BASE_DIR / "machines" / code / "manual.md"
    if not manual_file.exists(): raise HTTPException(status_code=404, detail="Manual not found")
    return JSONResponse({"code": code, "content": manual_file.read_text(encoding="utf-8")})

@app.get("/machines/{code}/records")
def get_records(code: str):
    record_file = BASE_DIR / "Record" / f"{code}.md"
    if not record_file.exists(): raise HTTPException(status_code=404, detail="Records not found")
    return JSONResponse({"code": code, "content": record_file.read_text(encoding="utf-8")})

@app.post("/machines/{code}/records")
def add_record(code: str, data: dict = Body(...)):
    record_file = BASE_DIR / "Record" / f"{code}.md"
    new_row = f"| {datetime.now().strftime('%Y-%m-%d')} | {datetime.now().strftime('%H:%M')} | {str(data.get('problem', '')).replace('|', '/').strip() or '-'} | {str(data.get('solution', '')).replace('|', '/').strip() or '-'} | {str(data.get('duration', '-')).replace('|', '/').strip()} | {str(data.get('result', '✅ ผ่าน')).replace('|', '/').strip()} | {str(data.get('reporter', 'ไม่ระบุ')).replace('|', '/').strip()} |"
    
    if record_file.exists():
        content = record_file.read_text(encoding="utf-8")
        if "## บันทึกจาก AI Chat" in content: content = content.rstrip() + "\n" + new_row + "\n"
        else: content = content.rstrip() + f"\n\n---\n\n## บันทึกจาก AI Chat\n\n| วันที่ | เวลา | Alarm / ปัญหา | วิธีแก้ไขที่ใช้ | ระยะเวลา | ผล | ผู้บันทึก |\n|--------|-------|--------------|-----------------|----------|-----|---------|\n{new_row}\n"
    else:
        record_file.parent.mkdir(parents=True, exist_ok=True)
        content = f"# ประวัติการซ่อมบำรุง — {code.upper()}\n\n## บันทึกจาก AI Chat\n\n| วันที่ | เวลา | Alarm / ปัญหา | วิธีแก้ไขที่ใช้ | ระยะเวลา | ผล | ผู้บันทึก |\n|--------|-------|--------------|-----------------|----------|-----|---------|\n{new_row}\n"

    record_file.write_text(_rebuild_summary(content), encoding="utf-8")
    return JSONResponse({"success": True})

@app.get("/machines/{code}/{filepath:path}")
def get_machine_file(code: str, filepath: str):
    file_path = BASE_DIR / "machines" / code / filepath
    if not file_path.exists() or not file_path.is_file(): raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

app.mount("/Image", StaticFiles(directory=str(BASE_DIR / "Image")), name="images")

@app.get("/dashboard")
def serve_dashboard():
    html_file = BASE_DIR / "OverviewDashboard" / "index.html"
    if not html_file.exists(): raise HTTPException(status_code=404, detail="Dashboard not found")
    return FileResponse(html_file, media_type="text/html")

@app.get("/")
def serve_frontend():
    return FileResponse(BASE_DIR / "machine_chat.html", media_type="text/html")

@app.get("/machine_chat.css")
def serve_css():
    return FileResponse(BASE_DIR / "machine_chat.css", media_type="text/css")

@app.get("/machine_chat.js")
def serve_js():
    return FileResponse(BASE_DIR / "machine_chat.js", media_type="application/javascript")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=False)
