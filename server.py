import csv
import json
import os
import re
from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import Any

from fastapi import Body, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).parent

# ──────────────────────────────────────────────
# RECORD HELPERS
# ──────────────────────────────────────────────

def _extract_section(content: str, header: str) -> str:
    """ดึง text ใต้ header จนถึง ## ถัดไป"""
    m = re.search(rf'{re.escape(header)}(.*?)(?=^##\s|\Z)', content, re.DOTALL | re.MULTILINE)
    return m.group(1) if m else ''


def _parse_table(section_text: str) -> list[dict]:
    """Parse markdown table rows → list of dicts with keys: problem, solution
    รองรับทั้ง format เดิม (4-5 col) และ format ใหม่ AI Chat (7 col)
    """
    rows = []
    for line in section_text.splitlines():
        if not line.startswith('|'):
            continue
        if re.match(r'^\|[\s\-:|]+\|$', line.replace(' ', '')):
            continue
        parts = [p.strip() for p in line.split('|')]
        parts = [p for p in parts if p != '']
        if len(parts) < 2:
            continue
        # skip header row by first column
        if parts[0] in ('วันที่', 'อันดับ', '---'):
            continue
        if len(parts) >= 7:
            # New AI Chat format: date | time | problem | solution | duration | result | reporter
            problem  = parts[2]
            solution = parts[3]
        else:
            # Manual format: date | problem | cause | solution | reporter
            # Old AI format: date | problem | solution | reporter
            problem  = parts[1]
            solution = parts[3] if len(parts) > 3 else (parts[2] if len(parts) > 2 else '—')
        rows.append({'problem': problem, 'solution': solution})
    return rows


def _rebuild_summary(content: str, machine_name: str = '') -> str:
    """
    นับความถี่ปัญหาจากทั้ง 2 section แล้ว rebuild ส่วนสรุป
    คืนค่า content ใหม่ที่มีส่วนสรุปอัปเดตแล้ว
    """
    manual_rows = _parse_table(_extract_section(content, '## บันทึกการแจ้งซ่อม'))
    ai_rows     = _parse_table(_extract_section(content, '## บันทึกจาก AI Chat'))
    all_rows    = manual_rows + ai_rows

    if not all_rows:
        return content

    # นับความถี่แต่ละปัญหา
    freq = Counter(r['problem'] for r in all_rows)

    # เก็บ solution ล่าสุดของแต่ละปัญหา
    solutions: dict[str, str] = {}
    for r in all_rows:
        if r['solution'] and r['solution'] != '—':
            solutions[r['problem']] = r['solution']

    now = datetime.now().strftime('%Y-%m-%d %H:%M')
    total = len(all_rows)

    lines = [
        '## ปัญหาที่พบบ่อยที่สุด (สรุปอัตโนมัติ)',
        '',
        f'> อัปเดตล่าสุด: **{now}** — รวมข้อมูลทั้งหมด **{total} รายการ** '
        f'(แจ้งซ่อมด้วยตนเอง {len(manual_rows)} + จาก AI Chat {len(ai_rows)})',
        '',
        '| อันดับ | ปัญหา / Alarm | จำนวน | วิธีแก้ไขที่ใช้ |',
        '|--------|-------------|:-----:|--------------|',
    ]
    for rank, (problem, count) in enumerate(freq.most_common(), 1):
        sol = solutions.get(problem, '—')
        lines.append(f'| {rank} | {problem} | **{count}** ครั้ง | {sol} |')

    new_section = '\n'.join(lines)

    # แทนที่ section เดิม หรือ แทรกก่อน ## หมายเหตุ / ## บันทึกจาก AI Chat / ---
    summary_re = re.compile(
        r'## ปัญหาที่พบบ่อยที่สุด.*?(?=^##\s|\Z)',
        re.DOTALL | re.MULTILINE
    )
    if summary_re.search(content):
        return summary_re.sub(new_section + '\n', content)

    # ไม่มี section เดิม → แทรกก่อน marker แรกที่พบ
    for marker in ('## หมายเหตุ', '## บันทึกจาก AI Chat', '\n---'):
        if marker in content:
            idx = content.index(marker)
            return content[:idx].rstrip() + '\n\n' + new_section + '\n\n' + content[idx:]

    return content.rstrip() + '\n\n' + new_section + '\n'


# ──────────────────────────────────────────────

app = FastAPI(title="Machine AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/machines")
def get_machines():
    machine_file = BASE_DIR / "machine.json"
    if not machine_file.exists():
        raise HTTPException(status_code=404, detail="machine.json not found")
    return JSONResponse(json.loads(machine_file.read_text(encoding="utf-8")))


def _load_spare_parts() -> list[dict]:
    """โหลด spare parts ทั้งหมดจาก CSV ใน StockSparePart/"""
    stock_dir = BASE_DIR / "StockSparePart"
    parts: list[dict] = []
    for csv_file in stock_dir.glob("*.csv"):
        with open(csv_file, encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                row["stock_breakdown"] = row.get("stock_breakdown", "False").strip().lower() == "true"
                row["quantity"] = int(row.get("quantity", 0))
                row["min_quantity"] = int(row.get("min_quantity", 0))
                parts.append(row)
    return parts


@app.get("/stock/spareparts")
def get_all_spare_parts(
    machine: str = Query(default="", description="กรองตาม machine_code เช่น lb101"),
    q: str = Query(default="", description="คำค้นหา part name หรือ part number"),
):
    """ดึงรายการ spare parts ทั้งหมด หรือกรองตาม machine / คำค้น"""
    parts = _load_spare_parts()
    if machine:
        parts = [p for p in parts if p["machine_code"].lower() in (machine.lower(), "all")]
    if q:
        q_lower = q.lower()
        parts = [
            p for p in parts
            if q_lower in p["part_name"].lower() or q_lower in p["part_number"].lower()
        ]
    return JSONResponse({"total": len(parts), "parts": parts})


@app.get("/stock/spareparts/check")
def check_spare_part(
    part_name: str = Query(..., description="ชื่อ part ที่ต้องการค้นหา"),
    machine: str = Query(default="", description="กรองตาม machine_code"),
):
    """ตรวจสอบสถานะ spare part — คืน part ที่ตรงกันพร้อมข้อมูลสต็อก"""
    parts = _load_spare_parts()
    q_lower = part_name.lower()

    matched = [
        p for p in parts
        if q_lower in p["part_name"].lower() or q_lower in p["part_number"].lower()
    ]
    if machine:
        matched = [p for p in matched if p["machine_code"].lower() in (machine.lower(), "all")]

    if not matched:
        return JSONResponse({"found": False, "message": f"ไม่พบ spare part: {part_name}", "parts": []})

    return JSONResponse({"found": True, "total": len(matched), "parts": matched})


def _parse_records_full(content: str, machine_code: str, machine_name: str) -> list[dict]:
    """Parse บันทึกการแจ้งซ่อม + บันทึกจาก AI Chat → list of record dicts"""
    records: list[dict] = []
    for section_header, source in [
        ('## บันทึกการแจ้งซ่อม', 'manual'),
        ('## บันทึกจาก AI Chat', 'ai'),
    ]:
        section_text = _extract_section(content, section_header)
        if not section_text:
            continue
        for line in section_text.splitlines():
            if not line.startswith('|'):
                continue
            if re.match(r'^\|[\s\-:|]+\|$', line.replace(' ', '')):
                continue
            cols = [c.strip() for c in line.split('|') if c.strip()]
            if len(cols) < 2:
                continue
            if cols[0] in ('วันที่', 'อันดับ', '---') or cols[1] in ('Alarm / ปัญหา', 'ปัญหา / Alarm', '---'):
                continue
            if cols[-1] in ('ผู้แจ้ง', 'ผู้บันทึก', 'วิธีแก้ไขที่ใช้', 'จำนวน'):
                continue
            if source == 'ai' and len(cols) >= 7:
                # New AI format: date | time | problem | solution | duration | result | reporter
                records.append({
                    'date':         cols[0],
                    'time':         cols[1],
                    'problem':      cols[2],
                    'solution':     cols[3],
                    'duration':     cols[4],
                    'result':       cols[5],
                    'reporter':     cols[6],
                    'machine_code': machine_code,
                    'machine_name': machine_name,
                    'source':       source,
                })
            else:
                records.append({
                    'date':         cols[0],
                    'problem':      cols[1],
                    'solution':     cols[-2] if len(cols) > 2 else '',
                    'reporter':     cols[-1],
                    'machine_code': machine_code,
                    'machine_name': machine_name,
                    'source':       source,
                })
    return records


@app.get("/dashboard/stats")
def get_dashboard_stats():
    """สถิติรวมสำหรับ Overview Dashboard"""
    machine_file = BASE_DIR / "machine.json"
    machines_list: list[dict] = []
    if machine_file.exists():
        machines_list = json.loads(machine_file.read_text(encoding="utf-8")).get("machines", [])
    machine_map = {m["code"]: m for m in machines_list}

    all_repairs: list[dict] = []
    record_dir = BASE_DIR / "Record"
    if record_dir.exists():
        for rf in sorted(record_dir.glob("*.md")):
            code  = rf.stem
            minfo = machine_map.get(code, {})
            name  = minfo.get("name", code.upper())
            all_repairs.extend(_parse_records_full(rf.read_text(encoding="utf-8"), code, name))

    all_repairs.sort(key=lambda r: r.get("date", ""), reverse=True)

    repairs_by_machine: dict[str, Any] = {
        m["code"]: {"name": m["name"], "nameTH": m.get("nameTH", ""), "count": 0}
        for m in machines_list
    }
    for r in all_repairs:
        mc = r.get("machine_code", "")
        if mc in repairs_by_machine:
            repairs_by_machine[mc]["count"] += 1

    technicians: dict[str, Any] = {}
    for r in all_repairs:
        rep = r.get("reporter", "").strip()
        if not rep or rep in ("-", "ไม่ระบุ", "ผู้แจ้ง", "ผู้บันทึก"):
            continue
        if rep not in technicians:
            technicians[rep] = {"count": 0, "machines": [], "recent": ""}
        technicians[rep]["count"] += 1
        mc = r.get("machine_code", "")
        if mc and mc not in technicians[rep]["machines"]:
            technicians[rep]["machines"].append(mc)
        if r.get("date", "") > technicians[rep]["recent"]:
            technicians[rep]["recent"] = r["date"]

    parts            = _load_spare_parts()
    now_month        = datetime.now().strftime("%Y-%m")
    parts_ok         = sum(1 for p in parts if p["quantity"] > p["min_quantity"] and not p["stock_breakdown"])
    parts_low        = sum(1 for p in parts if 0 < p["quantity"] <= p["min_quantity"] and not p["stock_breakdown"])
    parts_zero       = sum(1 for p in parts if p["quantity"] == 0)
    parts_breakdown  = sum(1 for p in parts if p["stock_breakdown"] and p["quantity"] > 0)

    return JSONResponse({
        "last_updated":        datetime.now().isoformat(),
        "machines":            machines_list,
        "repairs_total":       len(all_repairs),
        "repairs_this_month":  sum(1 for r in all_repairs if r.get("date", "").startswith(now_month)),
        "repairs_by_machine":  repairs_by_machine,
        "repairs_recent":      all_repairs[:30],
        "technicians":         technicians,
        "spare_parts": {
            "total":     len(parts),
            "ok":        parts_ok,
            "low":       parts_low,
            "zero":      parts_zero,
            "breakdown": parts_breakdown,
            "parts":     parts,
        },
    })


@app.get("/dashboard")
def serve_dashboard():
    html_file = BASE_DIR / "OverviewDashboard" / "index.html"
    if not html_file.exists():
        raise HTTPException(status_code=404, detail="Dashboard not found")
    return FileResponse(html_file, media_type="text/html")


@app.post("/expert-records")
def save_expert_record(data: dict = Body(...)):
    """บันทึกกรณีที่ AI แนะนำให้ติดต่อ Expert/Vendor ลง ExpertRecord/expert_escalations.csv"""
    expert_dir = BASE_DIR / "ExpertRecord"
    expert_dir.mkdir(exist_ok=True)
    csv_path = expert_dir / "expert_escalations.csv"

    escalation_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    machine_code    = str(data.get("machine_code", "")).strip()
    machine_name    = str(data.get("machine_name", "")).strip()
    alarm           = str(data.get("alarm", "")).replace("\n", " ").strip()
    conversation    = str(data.get("conversation", "")).replace("\n", " | ").strip()
    question_time   = str(data.get("question_time", escalation_time)).strip()

    write_header = not csv_path.exists()
    with open(csv_path, "a", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        if write_header:
            writer.writerow([
                "escalation_time", "question_time",
                "machine_code", "machine_name",
                "alarm", "conversation",
            ])
        writer.writerow([
            escalation_time, question_time,
            machine_code, machine_name,
            alarm, conversation,
        ])

    return JSONResponse({"success": True, "message": "บันทึก Expert Record สำเร็จ"})


@app.get("/machines/{code}/manual")
def get_manual(code: str):
    manual_file = BASE_DIR / "machines" / code / "manual.md"
    if not manual_file.exists():
        raise HTTPException(status_code=404, detail=f"Manual not found for machine: {code}")
    content = manual_file.read_text(encoding="utf-8")
    return JSONResponse({"code": code, "content": content})


@app.get("/machines/{code}/records")
def get_records(code: str):
    record_file = BASE_DIR / "Record" / f"{code}.md"
    if not record_file.exists():
        raise HTTPException(status_code=404, detail=f"Records not found for machine: {code}")
    content = record_file.read_text(encoding="utf-8")
    return JSONResponse({"code": code, "content": content})


@app.post("/machines/{code}/records")
def add_record(code: str, data: dict = Body(...)):
    record_file = BASE_DIR / "Record" / f"{code}.md"
    date_str = datetime.now().strftime("%Y-%m-%d")
    time_str = datetime.now().strftime("%H:%M")
    problem  = str(data.get("problem",  "")).replace("|", "/").strip() or "-"
    solution = str(data.get("solution", "")).replace("|", "/").strip() or "-"
    reporter = str(data.get("reporter", "ไม่ระบุ")).replace("|", "/").strip()
    duration = str(data.get("duration", "-")).replace("|", "/").strip()
    result   = str(data.get("result",   "✅ ผ่าน")).replace("|", "/").strip()

    new_row        = f"| {date_str} | {time_str} | {problem} | {solution} | {duration} | {result} | {reporter} |"
    section_header = "## บันทึกจาก AI Chat"
    table_header   = "| วันที่ | เวลา | Alarm / ปัญหา | วิธีแก้ไขที่ใช้ | ระยะเวลา | ผล | ผู้บันทึก |\n|--------|-------|--------------|-----------------|----------|-----|---------|"

    # 1. เพิ่ม row ใหม่
    if record_file.exists():
        content = record_file.read_text(encoding="utf-8")
        if section_header in content:
            content = content.rstrip() + "\n" + new_row + "\n"
        else:
            content = content.rstrip() + f"\n\n---\n\n{section_header}\n\n{table_header}\n{new_row}\n"
    else:
        record_file.parent.mkdir(parents=True, exist_ok=True)
        content = f"# ประวัติการซ่อมบำรุง — {code.upper()}\n\n{section_header}\n\n{table_header}\n{new_row}\n"

    # 2. Rebuild summary อัตโนมัติจากข้อมูลทั้งหมด
    content = _rebuild_summary(content)

    record_file.write_text(content, encoding="utf-8")
    return JSONResponse({"success": True, "message": "บันทึกสำเร็จ"})


@app.get("/machines/{code}/{filepath:path}")
def get_machine_file(code: str, filepath: str):
    # serve any static file (images, pdf, etc.) under machines/{code}/
    file_path = BASE_DIR / "machines" / code / filepath
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail=f"File not found: {code}/{filepath}")
    return FileResponse(file_path)


app.mount("/Image", StaticFiles(directory=str(BASE_DIR / "Image")), name="images")


@app.get("/")
def serve_frontend():
    html_file = BASE_DIR / "machine_chat.html"
    if not html_file.exists():
        raise HTTPException(status_code=404, detail="machine_chat.html not found")
    return FileResponse(html_file, media_type="text/html")


@app.get("/machine_chat.css")
def serve_css():
    f = BASE_DIR / "machine_chat.css"
    if not f.exists():
        raise HTTPException(status_code=404, detail="machine_chat.css not found")
    return FileResponse(f, media_type="text/css")


@app.get("/machine_chat.js")
def serve_js():
    f = BASE_DIR / "machine_chat.js"
    if not f.exists():
        raise HTTPException(status_code=404, detail="machine_chat.js not found")
    return FileResponse(f, media_type="application/javascript")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
