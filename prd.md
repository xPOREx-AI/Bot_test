# PRD: Machine AI Chat Application
**เวอร์ชัน:** 1.7 | **วันที่:** 2026-05-28 | **สถานะ:** อนุมัติ

---

## 1. ภาพรวม

Web application แบบ mobile-first สำหรับให้ช่างในโรงงานสอบถามข้อมูลเครื่องจักรผ่าน AI
ประกอบด้วย:
- **Backend:** FastAPI (Python) — serve ไฟล์ static และ API ข้อมูลเครื่องจักร, Record, Spare Parts
- **Frontend:** React 18 (CDN + Babel) ใน `machine_chat.html` — fetch ข้อมูลจาก FastAPI
- **Dashboard:** Standalone HTML (`OverviewDashboard/index.html`) — ภาพรวม Chart.js พร้อม auto-refresh

---

## 2. Architecture

```
Browser (machine_chat.html + React)
    ↕ fetch  http://localhost:8000
FastAPI Server (server.py)
    ↕ อ่านไฟล์ local
    ├── machines/{code}/manual.md
    ├── machine.json
    ├── Record/{code}.md
    └── StockSparePart/spare_parts_stock.csv
    ↕ Gemini REST API (direct from browser)
Gemini API (gemini-2.5-flash)

Browser (OverviewDashboard/index.html)
    ↕ fetch  http://localhost:8000/dashboard/stats
FastAPI Server (server.py)
```

---

## 3. หน้าจอ (4 หน้า)

### หน้า 1: Get Started
- หน้า Welcome แบบ Full-screen
- Robot image mascot (`Image/Robot.png`) แสดงกลางจอ พร้อม animation float (ขึ้น-ลง)
- Animated blob background (cyan/purple/blue) + dot-grid texture
- ชื่อแอป "LaBuBuBot" พร้อม badge และ tagline
- ปุ่ม "เริ่มใช้งาน" อยู่ด้านล่าง (full-width, rounded)
- ปุ่ม Light/Dark theme toggle มุมบนขวา
- Logo จาก `Image/Logo.png`

### หน้า 2: Loading
- Robot image แสดง animation คิด (thinking — tilt)
- Thought dots 3 จุดโต้ขึ้นลงเหนือหัว
- Orbit ring หมุนรอบ Robot
- ข้อความ "กำลังโหลดระบบ..." + progress bar sweep animation
- Auto-transition ไปหน้า 3 หลัง 2.4 วินาที

### หน้า 3: รายการเครื่องจักร (Machine List)
- fetch `GET /machines` → แสดง list card
- แต่ละ card: code badge, ชื่อเครื่อง (EN + TH), brand, คำอธิบาย, ลูกศรขวา
- มี search bar กรองตาม ชื่อ / code / คำอธิบาย
- ปุ่ม **"Overview"** ใน header → เปิด Overview Dashboard ที่ `/dashboard` (new tab)
- ปุ่ม Light/Dark theme toggle ใน header
- กดเลือกเครื่อง → ไปหน้า Chat ของเครื่องนั้น

### หน้า 4: Chat สอบถามเครื่องจักร
- fetch `GET /machines/{code}/manual` เมื่อเปิดหน้า
- fetch `GET /machines/{code}/records` เพื่อโหลด repair history ใช้ใน AI context
- แสดงชื่อเครื่องที่เลือกใน header; ปุ่มย้อนกลับ, Reset, theme toggle
- กล่อง chat แบบ responsive (full screen mobile)
- แสดง markdown (ตาราง, bullet, bold, code block, รูปภาพ)
- Workflow buttons (✅ ผ่าน / ❌ ไม่ผ่าน) เมื่อ AI แสดงขั้นตอน
- Bot avatar เป็น Robot mini SVG inline
- **[v1.4] Manual Reference Chips:** AI แนบ `[ref:ชื่อหัวข้อ]` → แสดงเป็น amber chip 📖 → กดเปิด Manual Drawer
- **[v1.5] Manual Drawer auto-translate:** slide-in จากขวา, auto-แปล Gemini, toggle Original/ไทย
- **[v1.6] Welcome Suggestion Chips:** 3 choice cards — "Alarm ที่เจอบ่อย", "แนะนำเครื่องจักร", "ประวัติการซ่อม"
- **[v1.6] Spare Parts Check:** AI ใส่ `[STOCK:ชื่อ part]` → fetch `/stock/spareparts/check` → แสดง StockCard
- **[v1.6] Record Modal:** บันทึกผลการซ่อมเมื่อ AI สรุป "แก้ไขสำเร็จ" → `POST /machines/{code}/records`
- **[v1.6] Image / Camera:** แนบรูปภาพ (gallery), ถ่ายรูปจากกล้อง (webcam/mobile), วางจาก clipboard, ลากวาง (drag & drop)
- **[v1.7] ปุ่ม Overview ใน header หน้า Machine List** → เปิด Dashboard

---

## 4. FastAPI Endpoints

| Method | Path | Response | หมายเหตุ |
|--------|------|----------|---------|
| GET | `/` | serve `machine_chat.html` | static file |
| GET | `/machines` | `{ machines: [...] }` | อ่านจาก `machine.json` |
| GET | `/machines/{code}/manual` | `{ content: "..." }` | อ่านจาก `machines/{code}/manual.md` |
| GET | `/machines/{code}/records` | `{ content: "..." }` | อ่านจาก `Record/{code}.md` |
| POST | `/machines/{code}/records` | `{ success: true }` | เพิ่ม row + rebuild summary อัตโนมัติ |
| GET | `/machines/{code}/{filepath}` | FileResponse | serve รูปภาพ/PDF ใน machines/{code}/ |
| GET | `/stock/spareparts` | `{ total, parts: [...] }` | กรองด้วย `?machine=&q=` |
| GET | `/stock/spareparts/check` | `{ found, parts: [...] }` | ค้นหา part ตามชื่อ/เลขชิ้นส่วน |
| GET | `/dashboard` | serve `OverviewDashboard/index.html` | Dashboard HTML |
| GET | `/dashboard/stats` | JSON stats รวม | ข้อมูลครบสำหรับ Dashboard |
| GET | `/machine_chat.css` | CSS file | static |
| GET | `/machine_chat.js` | JS file | static |
| MOUNT | `/Image/` | StaticFiles | `Image/` directory |

**CORS:** เปิด allow-all สำหรับ development localhost

---

## 5. Overview Dashboard (`/dashboard`)

ไฟล์: `OverviewDashboard/index.html` — Standalone HTML พร้อม Chart.js (CDN)

### 5.1 API ที่ใช้
- `GET /dashboard/stats` — คืน JSON รวม: repairs, technicians, spare_parts, machines

### 5.2 หน้าจอ Dashboard

| Section | รายละเอียด |
|---------|-----------|
| **Header** | Logo · Title · สถานะ live · Countdown อีก X วิ · ปุ่มรีเฟรช |
| **KPI Cards** (4 ใบ) | งานแจ้งซ่อมทั้งหมด · ซ่อมเดือนนี้ · Spare Parts รวม · Parts ต้องดูแล |
| **Bar Chart** | จำนวนงานซ่อมแยกตามเครื่อง (lb101/sb101/sw101) |
| **Horizontal Bar Chart** | Manpower — จำนวนงานต่อช่าง |
| **Doughnut Chart** | สถานะ Spare Parts (ปกติ / ต่ำกว่า Min / หมด / Breakdown) |
| **ประวัติซ่อมล่าสุด** | 20 รายการล่าสุดทุกเครื่อง พร้อม badge เครื่อง + ผู้บันทึก |
| **Parts ที่ต้องดูแล** | เรียงจากวิกฤตสุด (หมด → Breakdown → ต่ำกว่า Min) |
| **Manpower Table** | ชื่อช่าง · จำนวนงาน · Progress bar · เครื่องที่รับผิดชอบ · งานล่าสุด |
| **Spare Parts Table** | รายการครบ พร้อม Filter Tab (ทั้งหมด/หมด/Breakdown/ต่ำกว่า Min/ปกติ) + Search |

### 5.3 Auto-refresh
- รีเฟรชอัตโนมัติทุก **30 วินาที** (countdown แสดงใน header)
- กดปุ่ม "รีเฟรช" ได้ทันทีโดยไม่ต้องรอ

### 5.4 Machine Color Coding
| Machine | Color |
|---------|-------|
| lb101 (Krones) | #3b82f6 (blue) |
| sb101 (Weber) | #22c55e (green) |
| sw101 (SMIPACK) | #f97316 (orange) |

---

## 6. Spare Parts System

ไฟล์ข้อมูล: `StockSparePart/spare_parts_stock.csv`

### 6.1 CSV Schema
```
part_name, part_number, machine_code, category, location, quantity, unit, min_quantity, stock_breakdown
```

| ฟิลด์ | รายละเอียด |
|-------|-----------|
| `machine_code` | lb101 / sb101 / sw101 / **all** (ใช้กับทุกเครื่อง) |
| `stock_breakdown` | true/false — สต็อกแตก (แยกเก็บหลายที่) |
| `min_quantity` | ปริมาณขั้นต่ำ — ต่ำกว่านี้ = แสดง low stock warning |

### 6.2 สถานะ Stock
| สถานะ | เงื่อนไข | สี |
|-------|---------|---|
| ปกติ | qty > min_quantity && !breakdown | เขียว |
| ต่ำกว่า Min | 0 < qty ≤ min_quantity && !breakdown | เหลือง |
| หมดสต็อก | qty == 0 | แดง |
| Stock Breakdown | stock_breakdown == true | ส้ม |

### 6.3 AI Integration (STOCK Tag)
- AI ใส่ `[STOCK:ชื่อ part]` ท้าย response เมื่อยืนยันเปลี่ยน part
- Frontend parse tag → call `GET /stock/spareparts/check?part_name=...&machine=...`
- แสดง `StockCard` ใน chat bubble ผลลัพธ์แยกต่างหาก

---

## 7. Repair Record System

### 7.1 ไฟล์ Record
- ตำแหน่ง: `Record/{code}.md` (เช่น `Record/lb101.md`)
- Section แจ้งซ่อมด้วยตนเอง: `## บันทึกการแจ้งซ่อม`
- Section จาก AI Chat: `## บันทึกจาก AI Chat`
- Section สรุปอัตโนมัติ: `## ปัญหาที่พบบ่อยที่สุด (สรุปอัตโนมัติ)` — rebuild ทุกครั้งที่เพิ่ม record

### 7.2 Table Schema
**บันทึกการแจ้งซ่อม:**
`| วันที่ | Alarm / ปัญหา | สาเหตุที่พบ | วิธีแก้ไข | ผู้แจ้ง |`

**บันทึกจาก AI Chat:**
`| วันที่ | Alarm / ปัญหา | วิธีแก้ไขที่สำเร็จ | ผู้บันทึก |`

### 7.3 RecordModal
- เปิดอัตโนมัติเมื่อ AI ตอบ "แก้ไขสำเร็จ — จบการสนทนา"
- Fields: ชื่อผู้บันทึก (required) · Alarm/ปัญหาที่พบ · วิธีแก้ไข
- บันทึกชื่อผู้บันทึกใน `localStorage` (machai_reporter) เพื่อ pre-fill ครั้งต่อไป
- `POST /machines/{code}/records` → server เพิ่ม row + rebuild summary

### 7.4 AI Context
- ข้อมูล Record ถูก inject เข้า prompt เมื่อ user กด "ถามประวัติการซ่อม"
- ช่วยให้ AI สรุปปัญหาที่พบบ่อยได้จากข้อมูลจริง

---

## 8. Image / Camera Feature

| Feature | รายละเอียด |
|---------|-----------|
| Gallery picker | เลือกไฟล์รูปจากอุปกรณ์ |
| Camera — Desktop | เปิด modal webcam ผ่าน `getUserMedia`, canvas capture |
| Camera — Mobile | `<input capture="environment">` เปิดกล้องโดยตรง |
| Clipboard paste | `document.addEventListener('paste', ...)` — Ctrl+V วางรูป |
| Drag & Drop | `onDrop` บน chat area — ลากรูปมาวาง |
| Preview bar | แสดง thumbnail + ชื่อไฟล์ก่อนส่ง; กด X เพื่อยกเลิก |
| ส่ง Gemini | `inline_data: { mime_type, data: base64 }` แนบกับ message ล่าสุด |

---

## 9. เทคโนโลยี

| รายการ | เทคโนโลยี | หมายเหตุ |
|--------|-----------|---------|
| Backend | FastAPI + Uvicorn (Python 3.12) | `server.py` |
| Frontend | React 18 via CDN + Babel Standalone | `machine_chat.html / .js / .css` |
| Dashboard | Vanilla JS + Chart.js 4 (CDN) | `OverviewDashboard/index.html` |
| Markdown render | marked.js via CDN | render AI response |
| AI Engine | Gemini API (gemini-2.5-flash) | direct browser call |
| Styling | CSS custom properties | Deep Navy + Robot Blue theme |
| Icon | Font Awesome 6 | via CDN |
| Font | Sarabun (Google Fonts) | ทั้ง main app และ Dashboard |
| Spare Parts DB | CSV (`StockSparePart/spare_parts_stock.csv`) | อ่านตรง Python csv |
| Chat history | localStorage | per machine code |
| Reporter name | localStorage (`machai_reporter`) | pre-fill RecordModal |
| Theme | CSS data-theme attribute | Light / Dark toggle |

---

## 10. AI Integration

- **API Key:** `AIzaSyCAr26eAv9HqxUbSIhS43A40DA0rfT2kgk` (hardcode ใน JS)
- **Model:** `gemini-2.5-flash`
- **Temperature:** 0.15 (chat), 0.1 (translation)
- **Call flow:** browser → Gemini REST API โดยตรง (ไม่ผ่าน FastAPI)

### System Instruction Sections
1. **การอ้างอิงคู่มือ** — ให้แนบ `[ref:ชื่อหัวข้อ]` ท้ายประโยคที่ดึงข้อมูลจากคู่มือ
2. **การแสดงรูปภาพ** — copy markdown syntax รูปจากคู่มือมาแสดงโดยตรง
3. **Alarm Troubleshooting Workflow** — แสดงทีละ step, ปุ่ม ✅/❌, จบด้วย "จบการสนทนา"
4. **Spare Parts** — ใส่ `[STOCK:ชื่อ part]` เมื่อยืนยันเปลี่ยน part

### Manual Reference System (v1.4)
- AI แนบ `[ref:ชื่อหัวข้อ]` → render เป็น `<span class="ref-chip">📖</span>` (amber chip)
- กดที่ chip → เปิด Manual Drawer (slide-in จากขวา)
- `findSection()`: ค้น heading match ก่อน, fallback ค้น keyword ในเนื้อหา
- `translateSection()`: call Gemini (temp 0.1) แปล section เป็นภาษาไทย, คง Markdown + ชื่อเทคนิค + image path

### Alarm Troubleshooting Workflow
1. AI แสดงทีละขั้นตอน (ขั้นตอนที่ 1, 2, 3...)
2. แสดงปุ่ม ✅ ผ่าน / ❌ ไม่ผ่าน หลัง response ที่มีขั้นตอน
3. "ผ่าน" → AI สรุปและจบ → เปิด RecordModal
4. "ไม่ผ่าน" → AI แสดงขั้นตอนถัดไป
5. หมดทุก step แล้วไม่สำเร็จ → แนะนำติดต่อ Expert/Vendor

---

## 11. Chat History

- เก็บใน `localStorage` key: `machai_chat_{machineCode}`
- โหลดประวัติเมื่อเปิด chat ของเครื่องนั้น
- กรอง message ประเภท `isWelcome`, `isSuggestions`, `isError` ออกก่อนส่ง Gemini
- ปุ่ม Reset: ยืนยัน confirm dialog → ลบ localStorage key นั้น

---

## 12. Design System — Deep Navy + Robot Blue Theme

### 12.1 Dark Theme (Default)

| Token | Value | ใช้กับ |
|-------|-------|--------|
| --bg | #060d1e | background หลัก |
| --surface | #0f1f3d | card, panel, header |
| --surface-2 | #162040 | input bg |
| --surface-3 | #1e3058 | hover states |
| --accent | #f59e0b | amber — badge, border, button หลัก |
| --text | #f1f5f9 | text หลัก |
| --text-2 | #94a3b8 | text รอง |
| --text-3 | #64748b | placeholder, hint |
| --border | #1e3058 | border ทั่วไป |
| --green | #10b981 | ✅ ผ่าน |
| --red | #ef4444 | ❌ ไม่ผ่าน |
| Robot blue | #38bdf8 | glow, dot-grid, robot eyes |

### 12.2 Light Theme

| Token | Value |
|-------|-------|
| --bg | #eef4ff |
| --surface | #ffffff |
| --text | #0f172a |
| --border | #c7d2fe |

### 12.3 Background Texture
- **Blobs:** radial gradient circles (blur 70px) animate ช้าๆ — cyan / indigo / sky
- **Dot grid:** `radial-gradient` 1px dots, 28×28px grid, opacity 0.35–0.45
- หน้า 3&4 ใช้ blob opacity 0.28 (subtle กว่าหน้า 1&2)

---

## 13. Robot SVG Mascot

| ส่วน | รายละเอียด |
|------|-----------|
| ขนาด | 230px (หน้า 1), 210px (หน้า 2) — ใช้รูป `Image/Robot.png` |
| Animation: idle | float ขึ้น-ลง 16px, 3.6s loop |
| Animation: think | tilt ซ้าย-ขวา + float, 0.9s alternate |
| Bot avatar | mini SVG face 22×18px ใน chat bubble — `RobotMini()` |
| SVG defs | `GlobalDefs` component — render ครั้งเดียวใน App |

---

## 14. โครงสร้างไฟล์

```
d:\T-Ai\
├── server.py                     ← FastAPI backend (API + static serving)
├── machine_chat.html             ← React frontend entry point
├── machine_chat.js               ← React components + logic
├── machine_chat.css              ← Styles + design tokens
├── machine.json                  ← รายชื่อเครื่องจักร (sw101, sb101, lb101)
├── prd.md                        ← ไฟล์นี้
├── Image/
│   ├── Robot.png                 ← Robot mascot
│   └── Logo.png                  ← App logo
├── machines/
│   ├── sw101/
│   │   ├── manual.md             ← Smipack BP600/800/1102
│   │   └── image001.png
│   ├── sb101/
│   │   ├── manual.md             ← Weber Alpha Compact
│   │   └── image001.png
│   └── lb101/
│       └── manual.md             ← Krones ErgoBlocL (+ PDF manuals)
├── Record/
│   ├── sw101.md                  ← ประวัติการซ่อม Shrink Wrap
│   ├── sb101.md                  ← ประวัติการซ่อม Sticker Labeler
│   └── lb101.md                  ← ประวัติการซ่อม Inline Labeler
├── StockSparePart/
│   └── spare_parts_stock.csv     ← รายการ Spare Parts ทุกเครื่อง
└── OverviewDashboard/
    └── index.html                ← Overview Dashboard (Chart.js)
```

---

## 15. Responsive Design

| Screen | Layout |
|--------|--------|
| Mobile (<640px) | Single column cards, full-screen chat |
| Tablet (640-1024px) | 2-column machine cards, full-screen chat |
| Desktop (>1024px) | max-width 540px centered (mobile-like) สำหรับ chat; Dashboard ใช้ grid ขยายเต็ม |

---

## 16. วิธีรัน

```bash
pip install fastapi uvicorn
py server.py
# เปิด http://localhost:8000          ← Main App
# เปิด http://localhost:8000/dashboard ← Overview Dashboard
```

---

## 17. Changelog

| เวอร์ชัน | วันที่ | การเปลี่ยนแปลง |
|---------|-------|--------------|
| 1.0 | 2026-05-27 | Initial — 2 หน้า, Industrial dark theme |
| 1.1 | 2026-05-27 | เพิ่มเครื่องจักร sb101 (Weber Alpha Compact) |
| 1.2 | 2026-05-27 | เพิ่ม lb101 (Krones ErgoBlocL) + manual.md |
| 1.3 | 2026-05-27 | Redesign UI — 4 หน้า, Robot mascot, Light/Dark theme, Deep Navy theme ครบทุกหน้า |
| 1.4 | 2026-05-27 | Manual Reference Chips — AI แนบ [ref:หัวข้อ] → Manual Drawer slide-in + findSection() |
| 1.5 | 2026-05-27 | Manual Drawer auto-translate — Gemini แปล section ภาษาไทย, spinner, toggle Original/ไทย |
| 1.6 | 2026-05-27 | Welcome Suggestion Chips · Spare Parts system ([STOCK:] tag, StockCard, CSV) · RecordModal (บันทึกผลซ่อม, POST /records, rebuild summary) · Image/Camera (webcam modal, drag&drop, clipboard paste) · Record/{code}.md endpoints |
| 1.7 | 2026-05-28 | **Overview Dashboard** — `OverviewDashboard/index.html` (Chart.js) · ปุ่ม Overview บน page 3 · API `GET /dashboard/stats` รวมข้อมูล Repairs+Manpower+Spare Parts · `_parse_records_full()` parser · auto-refresh 30 วินาที · Manpower table · Parts filter+search |
| 1.8 | 2026-05-28 | **Expert Escalation Log** — บันทึกอัตโนมัติเมื่อ AI แนะนำติดต่อ Expert/Vendor → `POST /expert-records` → `ExpertRecord/expert_escalations.csv` (escalation_time, question_time, machine_code, machine_name, alarm, conversation) |
