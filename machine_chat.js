const { useState, useEffect, useRef } = React;

// ✅ แก้ไขให้ดึง URL อัตโนมัติจาก Render ป้องกัน Error Localhost
const API_BASE = window.location.origin;

// ✅ ถอด API Key ออกจากหน้าบ้าน และเปลี่ยนไปใช้รุ่น 3.1-flash-lite (โควต้า 500 ครั้ง/วัน)
const GEMINI_MODEL = 'gemini-3.1-flash-lite';

const SYSTEM_INSTRUCTION = `คุณคือผู้เชี่ยวชาญด้านเทคนิคเครื่องจักร (Technical Expert) วิเคราะห์ข้อมูลจากคู่มือที่ให้มาเท่านั้น ตอบเป็นภาษาไทยอย่างเป็นทางการและกระชับ

=== การอ้างอิงคู่มือ (สำคัญมาก) ===
เมื่อกล่าวถึงข้อมูลจากหัวข้อใดในคู่มือ ให้แนบ tag อ้างอิงท้ายประโยคนั้น ในรูปแบบ: [ref:ชื่อหัวข้อในคู่มือ]
ตัวอย่าง: "ตรวจสอบระดับน้ำมันตามวิธีการใน [ref:การบำรุงรักษา] ให้อยู่ในช่วงที่กำหนด"
ใช้ชื่อหัวข้อจากคู่มือให้ตรงที่สุด สามารถมีหลาย [ref:...] ต่อคำตอบ ถ้ามีข้อมูลอ้างอิงให้ใส่ทุกครั้ง

=== การแสดงรูปภาพ ===
คู่มือมีรูปภาพประกอบที่อ้างอิงด้วย Markdown syntax เช่น ![ชื่อรูป](/machines/sb101/image001.png)
เมื่อผู้ใช้ขอดูรูป หรือเมื่อมีรูปที่เกี่ยวข้องกับหัวข้อที่ถาม ให้แสดง markdown รูปภาพนั้นในคำตอบโดยตรง
ห้ามบอกว่า "ไม่สามารถแสดงรูปได้" — ให้ copy markdown syntax ของรูปจากคู่มือมาใส่ในคำตอบได้เลย

=== การเรียงลำดับวิธีแก้ไข (สำคัญมาก) ===
เมื่อตอบปัญหา Alarm หรือการซ่อมบำรุง ให้:
1. วิเคราะห์ประวัติการซ่อม (ถ้ามี) และคู่มือ แล้ว**แสดงวิธีที่ได้ผลดีที่สุด / พบบ่อยที่สุดขึ้นก่อนเสมอ** พร้อมอธิบายขั้นตอนแรกทันที
2. ท้ายคำตอบ ให้ใส่ tag ตัวเลือกสำรองสำหรับวิธีอื่นๆ ในรูปแบบต่อไปนี้ (ห้ามแสดง tag ให้ user เห็นโดยตรง — frontend จะ render เป็นปุ่มให้อัตโนมัติ):

[FOLLOWUP:วิธีล่าสุดที่ได้ผล — [ชื่อวิธีสั้นๆ จากประวัติ]]
[FOLLOWUP:วิธีที่ 2 — [ชื่อวิธีสำรองที่ 2]]
[FOLLOWUP:วิธีที่ 3 — [ชื่อวิธีสำรองที่ 3 ถ้ามี]]

กฎ tag [FOLLOWUP:...]:
- ใส่เฉพาะเมื่อมีวิธีแก้ไขมากกว่า 1 วิธี
- ชื่อวิธีให้สั้น กระชับ (ไม่เกิน 40 ตัวอักษร)
- ถ้าวิธีล่าสุดจากประวัติซ้ำกับวิธีที่ดีที่สุด ให้ข้ามไปใส่วิธีที่ 2 แทน
- เรียงจากโอกาสสำเร็จสูง → ต่ำ
- **สำคัญ**: เมื่อ user เลือก [FOLLOWUP:...] ใดๆ ให้ตอบด้วยรายละเอียดวิธีนั้นพร้อม Step ทีละขั้น และยังคงใส่ [FOLLOWUP:...] สำหรับวิธีที่เหลืออยู่ (ยังไม่ได้ถามถึง) ต่อท้ายทุกครั้ง จนกว่าจะหมดวิธีในคู่มือ

=== โหมด Alarm Troubleshooting — Workflow ทีละขั้นตอน ===

เมื่อผู้ใช้ถามเกี่ยวกับ Alarm หรือปัญหาเครื่องจักร ให้ปฏิบัติดังนี้:
1. หากผู้ใช้แจ้งหลาย Alarm ให้เรียงลำดับและดำเนินการแก้ไขทีละ 1 Alarm
2. วิเคราะห์จากคู่มือและประวัติการซ่อม **แสดงวิธีที่มีโอกาสสำเร็จสูงสุดก่อน** แบ่งเป็นขั้นตอน (Step 1, 2, 3, ...)
3. แสดง "ขั้นตอนที่ 1" ของวิธีที่ดีที่สุดเท่านั้นก่อน พร้อมอธิบายวิธีการอย่างละเอียด
4. ลงท้ายทุก Step: "✅ ผ่าน — หากแก้ไขสำเร็จแล้ว | ❌ ไม่ผ่าน — หากยังไม่สำเร็จ"
5. ใส่ tag [FOLLOWUP:...] สำหรับวิธีสำรองอื่นๆ ท้ายคำตอบด้วยเสมอ (ถ้ามี)

เมื่อผู้ใช้ตอบ "ผ่าน" (สำหรับ Alarm ปัจจุบัน):
- ให้สรุปสิ่งที่ทำสำเร็จของ Alarm นั้น
- ตรวจสอบว่ายังมี Alarm อื่นค้างอยู่หรือไม่:
  - หากมี: ให้เริ่ม Step 1 ของ Alarm ถัดไปทันที
  - หากไม่มี: ให้ถามผู้ใช้ว่า "มี Alarm หรือปัญหาอื่นที่ต้องการให้ช่วยวิเคราะห์อีกไหมครับ? สามารถพิมพ์ชื่อ Alarm หรือส่งรูปภาพหน้าจอเครื่องจักรมาให้ผมดูต่อได้เลย"
  - หากผู้ใช้ยืนยันว่าไม่มีปัญหาอื่นแล้ว หรือผู้ใช้สั่งจบ: ให้พิมพ์ "✅ แก้ไขสำเร็จเรียบร้อย — จบการสนทนา"

เมื่อผู้ใช้ตอบ "ไม่ผ่าน" (สำหรับ Alarm ปัจจุบัน):
- แสดงขั้นตอนถัดไปของ Alarm ปัจจุบันทันที ลงท้ายด้วยปุ่ม ✅/❌ เช่นเดิม
- หากหมดทุกขั้นตอนของ Alarm ปัจจุบันแล้วยังไม่สำเร็จ:
  - ตรวจสอบว่ายังมี Alarm อื่นค้างอยู่หรือไม่:
    - หากมี: ให้แจ้งผู้ใช้ว่า "เนื่องจาก Alarm นี้ตรวจสอบเบื้องต้นไม่สำเร็จ ขอข้ามไปแก้ไข Alarm [ชื่อ Alarm ถัดไป] ก่อนนะครับ" จากนั้นเริ่ม Step 1 ของ Alarm ถัดไปทันที
    - หากไม่มี Alarm อื่นเหลือแล้ว: แนะนำ "📞 กรุณาติดต่อ หัวหน้า/Expert/Vendor เพื่อเข้าตรวจสอบเชิงลึก" พร้อมสรุปข้อมูลที่ควรแจ้ง ปิดด้วย "— จบการสนทนา"

=== การตรวจสอบ Spare Parts (สำคัญมาก) ===

เมื่อผู้ใช้แจ้งว่าต้องการเปลี่ยน part หรือยืนยันการเปลี่ยน part (เช่น "ต้องการเปลี่ยน", "จะเปลี่ยน", "ยืนยันเปลี่ยน", "เปลี่ยนเลย", "ตกลงเปลี่ยน")
หรือเมื่อ AI วินิจฉัยว่าต้องเปลี่ยน part และผู้ใช้ยืนยัน ให้ใส่ tag ต่อไปนี้ท้ายคำตอบ:
[STOCK:ชื่อ part ภาษาอังกฤษหรือชื่อจากคู่มือ]

ตัวอย่าง:
- ผู้ใช้: "ยืนยันเปลี่ยน Cutting Blade" → ใส่ [STOCK:Cutting Blade] ท้ายข้อความ
- ผู้ใช้: "เปลี่ยนใบมีดเลย" → ใส่ [STOCK:Cutting Blade] ท้ายข้อความ
- ผู้ใช้: "ต้องการเช็คสต็อก Heating Element" → ใส่ [STOCK:Heating Element] ท้ายข้อความ

กฎ: ใส่ [STOCK:...] ได้หลาย tag ต่อคำตอบถ้ามีหลาย part | ชื่อ part ให้ใช้ภาษาอังกฤษตามคู่มือ | ไม่ต้องอธิบาย tag นี้ให้ผู้ใช้เห็น

กฎทั่วไป: แสดงทีละ Step เท่านั้น | ข้อมูลจากคู่มือเท่านั้น | คำถามทั่วไปตอบตามปกติ`;

/* ── spare parts helpers ── */
const STOCK_TAG_RE = /\[STOCK:([^\]]+)\]/g;

/* ── follow-up suggestion helpers ── */
const FOLLOWUP_TAG_RE = /\[FOLLOWUP:([^\]]+)\]/g;

function extractFollowupTags(text) {
  const tags = [];
  let m;
  const re = /\[FOLLOWUP:([^\]]+)\]/g;
  while ((m = re.exec(text)) !== null) tags.push(m[1].trim());
  return tags;
}

function stripFollowupTags(text) {
  return text.replace(FOLLOWUP_TAG_RE, '').trim();
}

/* ── expert escalation detection ── */
const EXPERT_RE = /ติดต่อ.{0,30}(Expert|Vendor|expert|vendor|หัวหน้า)/;

function isExpertEscalation(text) {
  return EXPERT_RE.test(text);
}

function buildConversationText(messages) {
  return messages
    .filter(m => !m.isSuggestions && !m.isError && !m.isStock && m.text)
    .map(m => {
      const role = m.role === 'user' ? '[ช่าง]' : '[AI]';
      return `${role} ${(m.displayText || m.text || '').trim()}`;
    })
    .join(' | ');
}

async function saveExpertRecord(machine, messages, alarmText, questionTime) {
  try {
    const conversation = buildConversationText(messages);
    await fetch(`${API_BASE}/expert-records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        machine_code:  machine.code || '',
        machine_name:  machine.nameTH || machine.name || '',
        alarm:         alarmText,
        conversation:  conversation,
        question_time: questionTime,
      }),
    });
  } catch (_) {}
}

async function checkSpareParts(partName, machineCode) {
  const params = new URLSearchParams({ part_name: partName, machine: machineCode });
  const res = await fetch(`${API_BASE}/stock/spareparts/check?${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* ── parse record markdown → recent alarms + frequent alarms ── */
function parseRecordAlarms(content) {
  if (!content) return { recent: [], frequent: [] };
  const rows = [];
  let inSummary = false;
  for (const line of content.split('\n')) {
    if (line.startsWith('##')) { inSummary = line.includes('สรุป'); continue; }
    if (inSummary || !line.startsWith('|')) continue;
    if (/^\|[\s\-:|]+\|/.test(line)) continue;
    const cols = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length < 2) continue;
    if (['วันที่','อันดับ'].includes(cols[0]) ||
        ['Alarm / ปัญหา','ปัญหา / Alarm','วิธีแก้ไขที่ใช้','จำนวน'].includes(cols[1])) continue;
    if (/^\d{4}-\d{2}-\d{2}/.test(cols[0]) && cols[1] && cols[1] !== '-')
      rows.push({ date: cols[0], problem: cols[1] });
  }
  const seenR = new Set();
  const recent = [];
  for (let i = rows.length - 1; i >= 0 && recent.length < 3; i--) {
    if (!seenR.has(rows[i].problem)) { seenR.add(rows[i].problem); recent.push(rows[i].problem); }
  }
  const freq = {};
  rows.forEach(r => { freq[r.problem] = (freq[r.problem] || 0) + 1; });
  const frequent = Object.entries(freq)
    .sort((a, b) => b[1] - a[1]).slice(0, 3)
    .map(([p, c]) => ({ problem: p, count: c }));
  return { recent, frequent };
}

function extractStockTags(text) {
  const tags = [];
  let m;
  const re = /\[STOCK:([^\]]+)\]/g;
  while ((m = re.exec(text)) !== null) tags.push(m[1].trim());
  return tags;
}

function stripStockTags(text) {
  return text.replace(STOCK_TAG_RE, '').trim();
}

/* ── helpers ── */
function histKey(code) { return `machai_chat_${code}`; }
function loadHist(code) { try { const r=localStorage.getItem(histKey(code)); return r?JSON.parse(r):[]; } catch{return[];} }
function saveHist(code,msgs) { localStorage.setItem(histKey(code),JSON.stringify(msgs)); }
function clearHist(code) { localStorage.removeItem(histKey(code)); }
function renderMd(text) { try{return marked.parse(text,{breaks:true,gfm:true});}catch{return`<p>${text}</p>`;} }

function renderMdWithRefs(text) {
  const withChips = text.replace(/\[ref:([^\]]+)\]/g, (_,s) => {
    const safe = s.trim().replace(/"/g,'&quot;');
    return `<span class="ref-chip" data-ref="${safe}">📖 ${s.trim()}</span>`;
  });
  try{return marked.parse(withChips,{breaks:true,gfm:true});}catch{return`<p>${withChips}</p>`;}
}

function findSection(manual, sectionName) {
  if(!manual||!sectionName) return null;
  const lines = manual.split('\n');
  const needle = sectionName.toLowerCase().trim();
  let startIdx=-1, startLevel=0;

  for(let i=0;i<lines.length;i++){
    const m=lines[i].match(/^(#{1,6})\s+(.+)/);
    if(m){
      const heading=m[2].replace(/[*_`]/g,'').toLowerCase().trim();
      if(heading===needle||heading.includes(needle)||needle.includes(heading)){
        startIdx=i; startLevel=m[1].length; break;
      }
    }
  }
  if(startIdx===-1){
    for(let i=0;i<lines.length;i++){
      if(lines[i].toLowerCase().includes(needle)){
        for(let j=i;j>=0;j--){
          const m=lines[j].match(/^(#{1,6})\s+(.+)/);
          if(m){startIdx=j;startLevel=m[1].length;break;}
        }
        if(startIdx>=0) break;
      }
    }
  }
  if(startIdx===-1) return null;

  const content=[lines[startIdx]];
  for(let i=startIdx+1;i<lines.length;i++){
    const m=lines[i].match(/^(#{1,6})\s/);
    if(m&&m[1].length<=startLevel) break;
    content.push(lines[i]);
  }
  return content.join('\n');
}

const STEP_RE=/ขั้นตอนที่\s*\d+|step\s*\d+/i;
const DONE_RE=/จบการสนทนา/;
function hasWorkflow(text){ return STEP_RE.test(text)&&!DONE_RE.test(text); }

// ✅ ส่งข้อมูลผ่าน Secure Proxy ของเราที่ server.py (ปลอดภัย 100%)
async function* streamGemini(manual, history, imagePayload) {
  const sys = SYSTEM_INSTRUCTION+'\n\n=== คู่มือเครื่องจักร ===\n'+manual;
  const filtered = history.filter(m=>!m.isWelcome&&!m.isSuggestions&&!m.isError&&!m.isStock);
  const contents = filtered.map((m,i)=>{
    const parts=[{text:m.text||''}];
    if(i===filtered.length-1 && m.role==='user' && imagePayload)
      parts.push({inline_data:{mime_type:imagePayload.mimeType,data:imagePayload.data}});
    return {role:m.role,parts};
  });
  
  const res = await fetch(`${API_BASE}/api/chat`, { 
      method:'POST', 
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
          model: GEMINI_MODEL,
          system_instruction:{parts:[{text:sys}]},
          contents,
          generationConfig:{temperature:0.15}
      }) 
  });
  
  if(!res.ok){ 
      const e=await res.json().catch(()=>({})); 
      throw new Error(e?.detail || `HTTP ${res.status}`); 
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if(text) yield text;
}

function RobotSVG({ size=220, mode='idle' }) {
  const cls = mode==='think' ? 'robot-think' : 'robot-float';
  return (
    <img
      src="Image/robot_no_bg.png"
      className={cls}
      width={size}
      alt="AIVORABot"
      style={{display:'block', filter:'drop-shadow(0 12px 32px rgba(0,0,0,0.12))'}}
    />
  );
}

function RobotMini() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign:'middle'}}>
      <circle cx="12" cy="12" r="11" fill="var(--accent)" />
      <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <text x="12" y="16.5" fontFamily="'Lora', Georgia, serif" fontSize="13" fontWeight="bold" fill="#ffffff" textAnchor="middle">A</text>
    </svg>
  );
}

const GUIDE_ITEMS = [
  { color:'#d9775c', icon:'fa-triangle-exclamation', title:'แจ้ง Alarm เครื่องจักร',
    desc:'พิมพ์ชื่อ Alarm หรืออธิบายอาการ AI จะแนะนำวิธีแก้ทีละขั้นตอนพร้อมลำดับความน่าจะสำเร็จ' },
  { color:'#c8963e', icon:'fa-cubes', title:'เช็ค Spare Part',
    desc:'บอกชื่อ Part ที่ต้องการ AI จะค้นสต็อกและแจ้งจำนวน/ที่เก็บให้ทันที' },
  { color:'#6fa182', icon:'fa-clock-rotate-left', title:'ดูประวัติการซ่อม',
    desc:'ถามปัญหาที่พบบ่อยหรือวิธีแก้ที่ได้ผลมากที่สุดจากประวัติเครื่องจริง' },
  { color:'#8e7cc3', icon:'fa-book-open', title:'ถามจากคู่มือ',
    desc:'ถามเรื่องขั้นตอนการใช้งาน การตั้งค่า หรือสเปคเครื่อง AI อ้างอิงจากคู่มือโดยตรง' },
  { color:'#cc785c', icon:'fa-camera', title:'ส่งรูป AI วิเคราะห์',
    desc:'ถ่ายรูปหน้าจอเครื่องหรือ Error ที่เกิดขึ้น แล้วส่งให้ AI วิเคราะห์ได้เลย' },
  { color:'#5a8c6c', icon:'fa-floppy-disk', title:'บันทึกผลการซ่อม',
    desc:'เมื่อแก้ไขสำเร็จ AI จะช่วยบันทึกวิธีที่ได้ผลไว้ใช้อ้างอิงครั้งต่อไป' },
];

function DesktopWelcome() {
  return (
    <div className="dw-wrap">
      <div className="blobs" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <div className="blob blob-b"/>
        <div className="blob blob-c"/>
      </div>
      <div className="dw-inner">
        <div className="dw-hero">
          <div className="dw-robot"><RobotSVG size={72}/></div>
          <div className="dw-hero-text">
            <div className="dw-badge">AI · MACHINE EXPERT</div>
            <div className="dw-title">AIVORA<span className="gs-title-bot">Bot</span></div>
            <div className="dw-sub">เลือกเครื่องจักรด้านซ้ายเพื่อเริ่มสนทนา</div>
          </div>
        </div>
        <div className="dw-section-label">สิ่งที่ช่วยได้</div>
        <div className="dw-grid">
          {GUIDE_ITEMS.map((item, i) => (
            <div key={i} className="dw-card">
              <div className="dw-card-icon" style={{background:`${item.color}18`,border:`1px solid ${item.color}40`}}>
                <i className={`fa-solid ${item.icon}`} style={{color:item.color}}/>
              </div>
              <div className="dw-card-body">
                <div className="dw-card-title" style={{color:item.color}}>{item.title}</div>
                <div className="dw-card-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [page,     setPage]    = useState('getstart');
  const [theme,    setTheme]   = useState('dark');
  const [machine,  setMachine] = useState(null);
  const [machines, setMachines]= useState([]);

  const toggleTheme = () => {
    const next = theme==='dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  useEffect(() => {
    if (page==='loading') {
      const t = setTimeout(()=>setPage('machines'), 2400);
      return ()=>clearTimeout(t);
    }
  }, [page]);

  const isSplitView = page === 'machines' || page === 'chat';

  return (
    <div className="app">
      {page==='getstart' && <GetStartPage onStart={()=>setPage('loading')} onTheme={toggleTheme} theme={theme}/>}
      {page==='loading'  && <LoadingPage/>}

      {isSplitView && (
        <>
          <div className={`pane-left ${page === 'chat' ? 'hide-on-mobile' : ''}`}>
            <MachineListPage
              onSelect={m => { setMachine(m); setPage('chat'); }}
              onTheme={toggleTheme}
              theme={theme}
              onMachinesLoaded={setMachines}
            />
          </div>

          <div className={`pane-right ${page === 'machines' ? 'hide-on-mobile' : ''}`}>
            {machine ? (
              <ChatPage
                key={machine.code}
                machine={machine}
                onBack={() => setPage('machines')}
                onTheme={toggleTheme}
                theme={theme}
                machines={machines}
                onSwitchMachine={m => setMachine(m)}
              />
            ) : (
              <DesktopWelcome/>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ThemeIcon({ theme }) {
  if (theme === 'dark') {
    return (
      <span className="theme-icon-wrap">
        <svg className="theme-svg sun-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" fill="currentColor"/>
          <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="19.78" y1="4.22" x2="17.66" y2="6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="6.34" y1="17.66" x2="4.22" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span className="theme-label">Light</span>
      </span>
    );
  }
  return (
    <span className="theme-icon-wrap">
      <i className="fa-solid fa-moon theme-moon-ico"/>
      <span className="theme-label">Dark</span>
    </span>
  );
}

function GetStartPage({ onStart, onTheme, theme }) {
  return (
    <div className="gs-page pg">
      <div className="blobs">
        <div className="blob blob-a"/>
        <div className="blob blob-b"/>
        <div className="blob blob-c"/>
      </div>
      <div className="dot-grid"/>

      <button className="theme-fab" onClick={onTheme} title="เปลี่ยนธีม">
        <ThemeIcon theme={theme}/>
      </button>

      <div className="gs-content">
        <div className="gs-badge">AI · MACHINE EXPERT</div>
        <div className="gs-title">AIVORA<span className="gs-title-bot">Bot</span></div>
        <div className="gs-sub">ระบบสอบถามข้อมูลเครื่องจักร</div>

        <div className="robot-stage">
          <div className="glow-ring glow-ring-1"/>
          <div className="glow-ring glow-ring-2"/>
          <RobotSVG size={230}/>
        </div>

        <div className="gs-tagline">
          ผู้ช่วย AI สำหรับ<em>ช่างและวิศวกร</em><br/>
          วิเคราะห์ Alarm · คู่มือ · การบำรุงรักษา
        </div>

        <div className="gs-features">
          {APP_FEATURES.map((f, i) => (
            <div key={i} className="gs-feat">
              <span className="gs-feat-dot" style={{background: f.color, boxShadow:`0 0 6px ${f.color}99`}}/>
              <i className={`fa-solid ${f.icon} gs-feat-icon`} style={{color: f.color}}/>
              <span className="gs-feat-text">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="gs-bottom">
        <button className="gs-btn" onClick={onStart}>
          <div className="gs-btn-icon"><i className="fa-solid fa-play"/></div>
          เริ่มใช้งาน
          <i className="fa-solid fa-arrow-right"/>
        </button>
        <div className="gs-ver">v1.2 · Secure Mode</div>
      </div>
    </div>
  );
}

function LoadingPage() {
  return (
    <div className="ld-page pg">
      <div className="blobs">
        <div className="blob blob-a"/>
        <div className="blob blob-c"/>
      </div>

      <div className="think-wrap">
        <div className="think-dots">
          <div className="td"/><div className="td"/><div className="td"/>
        </div>
        <RobotSVG size={210} mode='think'/>
      </div>

      <div className="ld-text">กำลังโหลดระบบ...</div>
      <div className="ld-sub">Machine AI กำลังเตรียมข้อมูลเครื่องจักร</div>
      <div className="ld-bar"><div className="ld-fill"/></div>
    </div>
  );
}

function MachineListPage({ onSelect, onTheme, theme, onMachinesLoaded }) {
  const [machines, setMachines] = useState([]);
  const [query,    setQuery]    = useState('');
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(()=>{
    fetch(`${API_BASE}/machines`)
      .then(r=>r.json())
      .then(d=>{const ms=d.machines||[];setMachines(ms);setLoading(false);if(onMachinesLoaded)onMachinesLoaded(ms);})
      .catch(e=>{setError('โหลดรายการไม่สำเร็จ: '+e.message);setLoading(false);});
  },[]);

  const filtered = query.trim()
    ? machines.filter(m=>
        (m.name||'').toLowerCase().includes(query.toLowerCase())||
        (m.nameTH||'').toLowerCase().includes(query.toLowerCase())||
        (m.code||'').toLowerCase().includes(query.toLowerCase())||
        (m.description||'').toLowerCase().includes(query.toLowerCase()))
    : machines;

  return (
    <div className="page pg">
      <div className="page-blobs blobs">
        <div className="blob blob-b"/>
        <div className="blob blob-c"/>
      </div>
      <div className="page-header">
        <div className="logo">
          <img src="Image/Logo.png" className="logo-img" alt="AIVORABot"/>
          <div>
            <div className="logo-title">AIVORA<span className="gs-title-bot">Bot</span></div>
            <div className="logo-sub">ระบบสอบถามข้อมูลเครื่องจักร</div>
          </div>
        </div>
        <a className="overview-btn" href={`${API_BASE}/dashboard`} target="_blank" rel="noopener">
          <i className="fa-solid fa-chart-line"/>
          <span>Overview</span>
        </a>
        <button className="header-theme-btn" onClick={onTheme} title="เปลี่ยนธีม">
          <ThemeIcon theme={theme}/>
        </button>
      </div>

      {error && (
        <div className="err-banner" style={{margin:'12px 16px 0', position:'relative', zIndex:1}}>
          <i className="fa-solid fa-triangle-exclamation"/><span>{error}</span>
        </div>
      )}

      <div className="ml-center-area">
        {loading && (
          <div className="load-overlay"><div className="spinner"/><span>กำลังโหลด...</span></div>
        )}

        {query.trim() && !loading && (
          <div className="ml-results">
            {filtered.length === 0 ? (
              <div className="empty-state ml-empty">
                <i className="fa-solid fa-circle-exclamation"/>
                <p>ไม่พบเครื่องจักรที่ค้นหา</p>
              </div>
            ) : (
              <div className="ml-cards">
                {filtered.map(m=><MachineCard key={m.code} machine={m} onClick={()=>onSelect(m)} small/>)}
              </div>
            )}
          </div>
        )}

        <div className="ml-search-wrap">
          <div className="ml-search-label">คุณต้องการถามเครื่องจักรอะไร</div>
          <div className="ml-search-box">
            <i className="fa-solid fa-magnifying-glass ml-search-ico"/>
            <input className="ml-search-inp" type="text"
              placeholder="ใส่ชื่อ หรือ รหัสที่ต้องการถาม"
              value={query} onChange={e=>setQuery(e.target.value)}/>
            {query && <button className="search-clr ml-search-clr" onClick={()=>setQuery('')}><i className="fa-solid fa-xmark"/></button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function MachineCard({ machine, onClick, small }) {
  return (
    <div className={`machine-card${small?' mc-sm':''}`} onClick={onClick}>
      <div className="mc-bar"/>
      <div className="mc-body">
        <div className="mc-icon-wrap"><i className="fa-solid fa-gear mc-icon"/></div>
        <div className="mc-info">
          <div className="mc-badge">{(machine.code||'').toUpperCase()}</div>
          <div className="mc-name">{machine.name}</div>
          {machine.nameTH    && <div className="mc-nameth">{machine.nameTH}</div>}
          {!small && machine.description && <div className="mc-desc">{machine.description}</div>}
          {!small && machine.brand && <div className="mc-brand"><i className="fa-solid fa-tag"/> {machine.brand}</div>}
        </div>
        <div className="mc-arrow"><i className="fa-solid fa-chevron-right"/></div>
      </div>
    </div>
  );
}

function ChatPage({ machine, onBack, onTheme, theme, machines=[], onSwitchMachine }) {
  const [manual,   setManual]  = useState('');
  const [mLoading, setMLoad]   = useState(true);
  const [mError,   setMErr]    = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const welcome = { role:'model', isSuggestions:true };

  const [messages, setMessages] = useState(()=>{
    const h=loadHist(machine.code); return h.length>0?h:[welcome];
  });
  const [records, setRecords] = useState('');
  const [input,  setInput]  = useState('');
  const [sending,        setSending]        = useState(false);
  const [showWF,         setShowWF]         = useState(false);
  const [showFollowups,  setShowFollowups]  = useState([]);
  const [lbSrc,          setLbSrc]          = useState(null);
  const [drawerSection,  setDrawerSection]  = useState(null);
  const [showRecordModal,setShowRecordModal]= useState(false);
  const [pendingRecord,  setPendingRecord]  = useState(null);
  const [pendingImage,   setPendingImage]   = useState(null); 
  const [webcamOpen,     setWebcamOpen]     = useState(false);
  const [dragOver,       setDragOver]       = useState(false);
  const bottomRef       = useRef(null);
  const inputRef        = useRef(null);
  const translationCache= useRef({});
  const webcamStreamRef = useRef(null);
  const lastUserMsgTime = useRef(new Date().toLocaleString('th-TH'));

  useEffect(()=>{
    fetch(`${API_BASE}/machines/${machine.code}/manual`)
      .then(r=>r.json())
      .then(d=>{setManual(d.content||'');setMLoad(false);})
      .catch(e=>{setMErr('โหลดคู่มือไม่สำเร็จ: '+e.message);setMLoad(false);});
    fetch(`${API_BASE}/machines/${machine.code}/records`)
      .then(r=>r.ok?r.json():null)
      .then(d=>{if(d)setRecords(d.content||'');})
      .catch(()=>{});
  },[machine.code]);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}); },[messages,sending]);

  useEffect(()=>{
    const last=messages[messages.length-1];
    setShowWF(last&&last.role==='model'&&hasWorkflow(last.text));
    setShowFollowups(last&&last.role==='model'&&last.followups?.length>0?last.followups:[]);
  },[messages]);

  const processImageFile = (file)=>{
    if(!file||!file.type.startsWith('image/')) return;
    const reader=new FileReader();
    reader.onload=(e)=>{
      const dataUrl=e.target.result;
      const base64=dataUrl.split(',')[1];
      const mimeType=dataUrl.match(/data:(.*?);/)[1];
      setPendingImage({mimeType,data:base64,dataUrl,name:file.name});
    };
    reader.readAsDataURL(file);
  };

  const clearImage=()=>setPendingImage(null);

  const openWebcam=()=>{
    if(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)){
      document.getElementById('mc-mobile-cam').click(); return;
    }
    setWebcamOpen(true);
    navigator.mediaDevices?.getUserMedia({video:{width:{ideal:1280},height:{ideal:720}}})
      .then(stream=>{ webcamStreamRef.current=stream; const v=document.getElementById('mc-webcam-video'); if(v)v.srcObject=stream; })
      .catch(()=>{});
  };

  const closeWebcam=()=>{
    webcamStreamRef.current?.getTracks().forEach(t=>t.stop());
    webcamStreamRef.current=null;
    const v=document.getElementById('mc-webcam-video'); if(v)v.srcObject=null;
    setWebcamOpen(false);
  };

  const captureWebcam=()=>{
    const video=document.getElementById('mc-webcam-video');
    const canvas=document.getElementById('mc-webcam-canvas');
    if(!webcamStreamRef.current) return;
    canvas.width=video.videoWidth||640; canvas.height=video.videoHeight||480;
    canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);
    canvas.toBlob(blob=>{
      processImageFile(new File([blob],'webcam_'+Date.now()+'.jpg',{type:'image/jpeg'}));
      closeWebcam();
    },'image/jpeg',0.92);
  };

  useEffect(()=>{
    const onPaste=(e)=>{
      const items=e.clipboardData?.items; if(!items) return;
      for(let item of items){ if(item.type.startsWith('image/')){ processImageFile(item.getAsFile()); break; } }
    };
    document.addEventListener('paste',onPaste);
    return()=>document.removeEventListener('paste',onPaste);
  },[]);

  const send = async(override, displayText)=>{
    const text=(override??input).trim();
    const imageToSend=pendingImage;
    if((!text&&!imageToSend)||sending||mLoading) return;
    setInput('');setShowWF(false);setShowFollowups([]);setPendingImage(null);
    const msgText=text||(imageToSend?'[แนบรูปภาพ]':'');
    lastUserMsgTime.current = new Date().toLocaleString('th-TH');
    const userMsg={role:'user',text:msgText,...(displayText&&{displayText}),...(imageToSend&&{imageDataUrl:imageToSend.dataUrl})};
    const base=messages.filter(m=>!m.isSuggestions&&!m.isError);
    const next=[...base,userMsg];
    const imgPayload=imageToSend?{mimeType:imageToSend.mimeType,data:imageToSend.data}:null;
    setMessages([...next,{role:'model',text:'',_streaming:true}]);
    setSending(true);
    let fullText='';
    try {
      for await (const chunk of streamGemini(manual,next,imgPayload)){
        fullText+=chunk;
        setMessages(prev=>[...prev.slice(0,-1),{role:'model',text:fullText,_streaming:true}]);
      }
      const stockTags=extractStockTags(fullText);
      const followupTags=extractFollowupTags(fullText);
      let cleanReply=fullText;
      if(stockTags.length>0) cleanReply=stripStockTags(cleanReply);
      if(followupTags.length>0) cleanReply=stripFollowupTags(cleanReply);
      const bot={role:'model',text:cleanReply,followups:followupTags};
      const withBot=[...next,bot];
      if(stockTags.length>0){
        setMessages(withBot);
        const stockResults=await Promise.all(
          stockTags.map(p=>checkSpareParts(p,machine.code).catch(()=>({found:false,parts:[],_partName:p}))
            .then(r=>({...r,_partName:p})))
        );
        const stockMsg={role:'model',isStock:true,stockResults};
        const final=[...withBot,stockMsg];
        setMessages(final);saveHist(machine.code,final);
      } else {
        setMessages(withBot);saveHist(machine.code,withBot);
      }
      if(/แก้ไขสำเร็จ/.test(cleanReply)&&DONE_RE.test(cleanReply)){
        const firstUser=next.find(m=>m.role==='user');
        setPendingRecord({problem:firstUser?.displayText||firstUser?.text||'',solution:''});
        setShowRecordModal(true);
      }
      if(isExpertEscalation(cleanReply)){
        const firstUser=next.find(m=>m.role==='user');
        const alarm=firstUser?.displayText||firstUser?.text||'';
        saveExpertRecord(machine,[...next,bot],alarm,lastUserMsgTime.current);
      }
    } catch(e) {
      setMessages([...next,{role:'model',isError:true}]);
    } finally {
      setSending(false);
      setTimeout(()=>inputRef.current?.focus(),80);
    }
  };

  const reset=()=>{
    clearHist(machine.code);
    setMessages([{role:'model',isSuggestions:true}]);
    setShowWF(false);
  };
  
  const exportCSV = () => {
    let csv = '\uFEFFRole,Message,Date\n';
    const timestamp = new Date().toLocaleString('th-TH');
    messages.forEach(m => {
      if (m.isSuggestions || m.isError || m.isStock) return;
      const role = m.role === 'user' ? 'Technician' : 'AI Support';
      const text = (m.displayText || m.text || '').replace(/"/g, '""');
      csv += `"${role}","${text}","${timestamp}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Escalation_Log_${machine.code}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleChipSelect=async(type)=>{
    if(sending||mLoading) return;
    if(type==='alarm'){
      send(`แสดง Alarm ที่พบบ่อยและวิธีการแก้ไขเบื้องต้นสำหรับเครื่อง ${machine.name} (${(machine.code||'').toUpperCase()})`);
    } else if(type==='intro'){
      send(`แนะนำเครื่อง ${machine.name} (${(machine.code||'').toUpperCase()}) ให้หน่อยครับ — ทำงานอะไร มีระบบหลักอะไรบ้าง และข้อควรระวังในการใช้งาน`);
    } else if(type==='records'){
      if(records){
        send(
          `นี่คือประวัติการซ่อมบำรุงของเครื่อง:\n\n${records}\n\nช่วยสรุปปัญหาที่พบบ่อยและวิธีแก้ไขที่ใช้บ่อยที่สุดให้หน่อยครับ โดยเรียงลำดับจากที่พบบ่อยที่สุดก่อน`,
          'ถามประวัติการซ่อม'
        );
      } else {
        send(`สรุปปัญหาและ Alarm ที่พบบ่อยในการซ่อมบำรุงเครื่อง ${machine.name}`, 'ถามประวัติการซ่อม');
      }
    }
  };

  const retry=async()=>{
    if(sending) return;
    const hist=messages.filter(m=>!m.isError&&!m.isSuggestions);
    if(!hist.find(m=>m.role==='user')) return;
    setMessages([...hist,{role:'model',text:'',_streaming:true}]);
    setSending(true);setShowWF(false);
    let fullText='';
    try{
      for await (const chunk of streamGemini(manual,hist)){
        fullText+=chunk;
        setMessages(prev=>[...prev.slice(0,-1),{role:'model',text:fullText,_streaming:true}]);
      }
      const stockTags=extractStockTags(fullText);
      const followupTags=extractFollowupTags(fullText);
      let cleanReply=fullText;
      if(stockTags.length>0) cleanReply=stripStockTags(cleanReply);
      if(followupTags.length>0) cleanReply=stripFollowupTags(cleanReply);
      const bot={role:'model',text:cleanReply,followups:followupTags};
      const withBot=[...hist,bot];
      if(stockTags.length>0){
        setMessages(withBot);
        const stockResults=await Promise.all(
          stockTags.map(p=>checkSpareParts(p,machine.code).catch(()=>({found:false,parts:[],_partName:p}))
            .then(r=>({...r,_partName:p})))
        );
        const stockMsg={role:'model',isStock:true,stockResults};
        const final=[...withBot,stockMsg];
        setMessages(final);saveHist(machine.code,final);
      } else {
        setMessages(withBot);saveHist(machine.code,withBot);
      }
      if(/แก้ไขสำเร็จ/.test(cleanReply)&&DONE_RE.test(cleanReply)){
        const firstUser=hist.find(m=>m.role==='user');
        setPendingRecord({problem:firstUser?.displayText||firstUser?.text||'',solution:''});
        setShowRecordModal(true);
      }
      if(isExpertEscalation(cleanReply)){
        const firstUser=hist.find(m=>m.role==='user');
        const alarm=firstUser?.displayText||firstUser?.text||'';
        saveExpertRecord(machine,[...hist,bot],alarm,lastUserMsgTime.current);
      }
    }catch(e){
      setMessages([...hist,{role:'model',isError:true}]);
    }finally{
      setSending(false);
      setTimeout(()=>inputRef.current?.focus(),80);
    }
  };

  useEffect(()=>{
    if(!drawerSection) return;
    const fn=e=>{if(e.key==='Escape')setDrawerSection(null);};
    document.addEventListener('keydown',fn);
    return()=>document.removeEventListener('keydown',fn);
  },[drawerSection]);

  const handleMsgsClick=e=>{
    if(e.target.tagName==='IMG'&&e.target.closest('.md')) setLbSrc(e.target.src);
    const chip=e.target.closest('.ref-chip');
    if(chip) setDrawerSection(chip.dataset.ref);
  };

  return (
    <div className="chat-page pg">
      <div className="page-blobs blobs">
        <div className="blob blob-b"/>
        <div className="blob blob-c"/>
      </div>
      <div className="chat-hdr">
        <button className="hist-toggle-btn" onClick={()=>setShowHistory(v=>!v)} title="ประวัติการสนทนา">
          <i className="fa-solid fa-bars"/>
        </button>
        <button className="back-btn" onClick={onBack}><i className="fa-solid fa-arrow-left"/></button>
        <div className="chat-minfo">
          <div className="chat-mcode">{(machine.code||'').toUpperCase()}</div>
          <div className="chat-mname">{machine.name}</div>
        </div>
        <button className="header-theme-btn" onClick={onTheme} title="เปลี่ยนธีม">
          <ThemeIcon theme={theme}/>
        </button>
        <button className="reset-btn" onClick={reset} title="ล้างประวัติการสนทนา">
          <i className="fa-solid fa-rotate-left"/>
        </button>
      </div>

      {mError && (
        <div className="err-banner">
          <i className="fa-solid fa-triangle-exclamation"/>
          <span>{mError} — AI จะตอบจาก knowledge ทั่วไปแทน</span>
        </div>
      )}

      {lbSrc         && <Lightbox src={lbSrc} onClose={()=>setLbSrc(null)}/>}
      {drawerSection && <ManualDrawer section={drawerSection} manual={manual} cache={translationCache} onClose={()=>setDrawerSection(null)}/>}
      {showRecordModal && <RecordModal machine={machine} init={pendingRecord} onClose={()=>setShowRecordModal(false)}/>}

      {mLoading ? (
        <div className="load-overlay"><div className="spinner"/><span>กำลังโหลดคู่มือ...</span></div>
      ) : (
        <>
          <div className={`msgs${dragOver?' drag-active':''}`} onClick={handleMsgsClick}
            onDragEnter={e=>{e.preventDefault();if(e.dataTransfer.types.includes('Files'))setDragOver(true);}}
            onDragLeave={e=>{e.preventDefault();setDragOver(false);}}
            onDragOver={e=>e.preventDefault()}
            onDrop={e=>{e.preventDefault();setDragOver(false);const f=e.dataTransfer.files[0];if(f)processImageFile(f);}}>
            {dragOver && (
              <div className="drop-overlay">
                <i className="fa-solid fa-cloud-arrow-up"/>
                <p>วางรูปที่นี่เพื่อส่งให้ AI</p>
              </div>
            )}
            {messages.length===1&&messages[0].isSuggestions ? (
              <WelcomeSuggestions machine={machine}/>
            ) : (
              messages.map((msg,i)=>
              msg.isStock
                ? <StockBubble key={i} msg={msg}/>
                : <Bubble key={i} msg={msg} onRetry={retry} onImgClick={setLbSrc}/>
            )
            )}
            {sending && <TypingDots/>}
            {showWF && !sending && <WorkflowBtns onPass={()=>send('ผ่าน')} onFail={()=>send('ไม่ผ่าน')}/>}
            {showFollowups.length>0 && !sending && <FollowupBtns options={showFollowups} onSelect={send}/>}
            <div ref={bottomRef}/>
          </div>

          {!sending && <QuickChipBar machine={machine} records={records}
            onSend={(query, label) => send(query, label)} disabled={sending}/>}

          {pendingImage && (
            <div className="img-preview-bar">
              <img src={pendingImage.dataUrl} className="img-preview-thumb" alt="preview"/>
              <span className="img-preview-name">{pendingImage.name}</span>
              <button className="img-preview-clear" onClick={clearImage} title="ลบรูป">
                <i className="fa-solid fa-xmark"/>
              </button>
            </div>
          )}

          <div className="input-area">
            <label className="attach-btn" title="เลือกรูปภาพ (หรือลากวาง / Ctrl+V)">
              <i className="fa-solid fa-image"/>
              <span className="attach-label">รูปภาพ</span>
              <input type="file" accept="image/*" style={{display:'none'}}
                onChange={e=>{if(e.target.files[0])processImageFile(e.target.files[0]);e.target.value='';}}/>
            </label>
            <button className="attach-btn cam-btn" title="ถ่ายรูปด้วยกล้อง" type="button" onClick={openWebcam}>
              <i className="fa-solid fa-camera"/>
              <span className="attach-label">กล้อง</span>
            </button>
            <input type="file" accept="image/*" capture="environment" id="mc-mobile-cam"
              style={{display:'none'}} onChange={e=>{if(e.target.files[0])processImageFile(e.target.files[0]);e.target.value='';}}/>

            <input ref={inputRef} className="chat-inp" type="text"
              placeholder={`ถามเกี่ยวกับ ${machine.name}...`}
              value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey)send();}}
              disabled={sending}/>
            <button className="send-btn" onClick={()=>send()} disabled={sending||(!input.trim()&&!pendingImage)}>
              <i className="fa-solid fa-paper-plane"/>
            </button>
          </div>

          {webcamOpen && (
            <div className="webcam-modal" onClick={e=>{if(e.target===e.currentTarget)closeWebcam();}}>
              <div className="webcam-inner">
                <div className="webcam-hdr">
                  <span><i className="fa-solid fa-camera"/> ถ่ายรูปจากกล้อง</span>
                  <button onClick={closeWebcam}><i className="fa-solid fa-xmark"/></button>
                </div>
                <div className="webcam-view">
                  <video id="mc-webcam-video" autoPlay playsInline muted style={{width:'100%',display:'block'}}/>
                  <canvas id="mc-webcam-canvas" style={{display:'none'}}/>
                </div>
                <div className="webcam-foot">
                  <button className="webcam-snap" onClick={captureWebcam}>
                    <i className="fa-solid fa-circle-dot"/> ถ่ายรูป
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {showHistory && (
        <HistorySidebar
          machines={machines}
          currentCode={machine.code}
          onSelect={m => { if(onSwitchMachine) onSwitchMachine(m); setShowHistory(false); }}
          onDeleteCurrent={() => { setMessages([{role:'model',isSuggestions:true}]); setShowWF(false); clearHist(machine.code); }}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

function HistorySidebar({ machines, currentCode, onSelect, onDeleteCurrent, onClose }) {
  const [entries, setEntries] = useState(() =>
    machines.map(m => {
      const h = loadHist(m.code);
      const msgs = h.filter(msg => !msg.isSuggestions && !msg.isError && !msg.isStock);
      if (msgs.length === 0) return null;
      const lastUser = [...msgs].reverse().find(msg => msg.role === 'user');
      const preview  = lastUser?.displayText || lastUser?.text || '';
      return { machine: m, preview, count: msgs.length };
    }).filter(Boolean)
  );

  const handleDelete = (code) => {
    const next = entries.filter(e => e.machine.code !== code);
    clearHist(code);
    if (code === currentCode) onDeleteCurrent();
    setEntries(next);
    if (next.length === 0) onClose();
  };

  return (
    <>
      <div className="hist-backdrop" onClick={onClose}/>
      <div className="hist-sidebar">
        <div className="hist-hdr">
          <i className="fa-solid fa-clock-rotate-left"/>
          <span>ประวัติการสนทนา</span>
          <button className="hist-close" onClick={onClose}><i className="fa-solid fa-xmark"/></button>
        </div>
        {entries.length === 0 ? (
          <div className="hist-empty">
            <i className="fa-solid fa-comment-slash"/>
            <p>ไม่มีประวัติการสนทนา</p>
          </div>
        ) : (
          <div className="hist-list">
            {entries.map(({ machine: m, preview, count }) => (
              <div key={m.code} className={`hist-item${m.code===currentCode?' hist-active':''}`}>
                <div className="hist-item-main"
                  onClick={() => m.code !== currentCode && onSelect(m)}>
                  <div className="hist-item-top">
                    <span className="hist-code">{m.code.toUpperCase()}</span>
                    <span className="hist-name">{m.name}</span>
                  </div>
                  {preview && (
                    <div className="hist-preview">
                      {preview.length > 55 ? preview.slice(0,53)+'…' : preview}
                    </div>
                  )}
                  <div className="hist-meta">
                    {m.code===currentCode && <span className="hist-current-badge">กำลังดูอยู่</span>}
                    <span>{count} ข้อความ</span>
                  </div>
                </div>
                <button className="hist-del" onClick={() => handleDelete(m.code)} title="ลบประวัตินี้">
                  <i className="fa-solid fa-trash"/>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const APP_FEATURES = [
  { color:'#d9775c', icon:'fa-screwdriver-wrench', text:'แก้ปัญหา Alarm' },
  { color:'#c8963e', icon:'fa-cubes',               text:'เช็ค Spare Part' },
  { color:'#6fa182', icon:'fa-clock-rotate-left',   text:'ประวัติการซ่อม' },
  { color:'#8e7cc3', icon:'fa-book-open',           text:'ถามจากคู่มือ' },
  { color:'#cc785c', icon:'fa-camera',              text:'ส่งรูป AI วิเคราะห์' },
  { color:'#5a8c6c', icon:'fa-floppy-disk',         text:'บันทึกผลซ่อม' },
];

function WelcomeSuggestions({ machine }) {
  return (
    <div className="suggest-wrap">
      <div className="suggest-robot"><RobotMini/></div>
      <div className="suggest-greeting">
        สวัสดีครับ! ผมพร้อมช่วยเรื่อง <strong>{machine.name}</strong><br/>
        <span>พิมพ์คำถาม หรือเลือก Chip ด้านล่างได้เลย</span>
      </div>
    </div>
  );
}

function Bubble({ msg, onRetry, onImgClick }) {
  const isUser=msg.role==='user';
  const ref=useRef(null);
  useEffect(()=>{
    if(isUser||!ref.current) return;
    ref.current.querySelectorAll('.md img').forEach(img=>{
      img.onerror=function(){
        if(this.dataset.errored) return; this.dataset.errored='1';
        this.style.display='none';
        const ph=document.createElement('div'); ph.className='img-ph';
        ph.innerHTML='<i class="fa-solid fa-image-slash"></i> ไม่พบรูปภาพ: '+decodeURIComponent(this.src.split('/').pop());
        this.parentNode.insertBefore(ph,this.nextSibling);
      };
    });
  });
  if(msg.isError){
    return(
      <div className="message">
        <div className="bot-av"><RobotMini/></div>
        <div className="bubble bot-bub error-bub">
          <div className="error-line">
            <i className="fa-solid fa-triangle-exclamation"/>
            <span>ระบบผิดพลาด</span>
          </div>
          <button className="retry-btn" onClick={onRetry}>
            <i className="fa-solid fa-rotate-right"/> ถามใหม่อีกรอบ
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={`message ${isUser?'user-msg':''}`}>
      {!isUser && <div className="bot-av"><RobotMini/></div>}
      <div ref={ref} className={`bubble ${isUser?'user-bub':'bot-bub'}`}>
        {isUser ? (
          <>
            {(msg.displayText||msg.text)!=='[แนบรูปภาพ]' && <span>{msg.displayText||msg.text}</span>}
            {msg.imageDataUrl && (
              <img src={msg.imageDataUrl} className="bubble-img" alt="แนบรูป"
                onClick={()=>onImgClick&&onImgClick(msg.imageDataUrl)} style={{cursor:'zoom-in'}}/>
            )}
          </>
        ) : (
          <div className="md" dangerouslySetInnerHTML={{__html:renderMdWithRefs(msg.text)}}/>
        )}
      </div>
    </div>
  );
}

function StockCard({ result }) {
  const { found, parts=[], _partName } = result;
  if (!found || parts.length===0) {
    return (
      <div className="stock-card stock-unavail">
        <div className="stock-card-hdr">
          <i className="fa-solid fa-box-open stock-icon"/>
          <span className="stock-part-name">{_partName}</span>
          <span className="stock-badge unavail">ไม่มีในสต็อก</span>
        </div>
        <div className="stock-card-body">
          <p className="stock-none-msg">ไม่พบ spare part นี้ในระบบ — กรุณาติดต่อแผนกจัดซื้อ</p>
        </div>
      </div>
    );
  }
  return (
    <div className="stock-card">
      <div className="stock-card-hdr">
        <i className="fa-solid fa-boxes-stacking stock-icon"/>
        <span className="stock-part-name">{_partName}</span>
        <span className="stock-badge avail">พบ {parts.length} รายการ</span>
      </div>
      <div className="stock-rows">
        {parts.map((p,i)=>{
          const ok = p.quantity > 0;
          const low = ok && p.quantity <= p.min_quantity;
          const bd = p.stock_breakdown;
          return (
            <div key={i} className={`stock-row ${!ok||bd?'stock-row-warn':low?'stock-row-low':''}`}>
              <div className="stock-row-name">{p.part_name}</div>
              <div className="stock-row-meta">
                <span className="stock-loc"><i className="fa-solid fa-location-dot"/> {p.location}</span>
                <span className={`stock-qty ${!ok||bd?'qty-zero':low?'qty-low':'qty-ok'}`}>
                  {ok&&!bd
                    ? <><i className="fa-solid fa-circle-check"/> {p.quantity} {p.unit}</>
                    : <><i className="fa-solid fa-triangle-exclamation"/> {p.quantity} {p.unit} — Stock Breakdown</>}
                </span>
              </div>
              {(p.part_number&&p.part_number!=='-') && (
                <div className="stock-pno">P/N: {p.part_number}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StockBubble({ msg }) {
  return (
    <div className="message">
      <div className="bot-av"><RobotMini/></div>
      <div className="bubble bot-bub stock-bubble">
        <div className="stock-bubble-title">
          <i className="fa-solid fa-warehouse"/> ผลการตรวจสอบสต็อก Spare Parts
        </div>
        {msg.stockResults.map((r,i)=><StockCard key={i} result={r}/>)}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="message">
      <div className="bot-av"><RobotMini/></div>
      <div className="bubble bot-bub typing">
        <span className="dot"/><span className="dot"/><span className="dot"/>
      </div>
    </div>
  );
}

function QuickChipBar({ machine, records, onSend, disabled }) {
  const scrollRef = useRef(null);
  const animRef   = useRef(null);
  const paused    = useRef(false);

  const { recent, frequent } = parseRecordAlarms(records);
  const recentSet = new Set(recent);

  const chips = [];
  recent.forEach(p => chips.push({
    icon: 'fa-clock-rotate-left', color: 'amber',
    label: p.length > 22 ? p.slice(0, 20) + '…' : p, full: p,
    query: `Alarm "${p}" เกิดขึ้นล่าสุด — บอกวิธีแก้ล่าสุดที่ได้ผลสำหรับ Alarm นี้`,
  }));
  frequent.forEach(({ problem: p, count: c }) => {
    if (recentSet.has(p)) return;
    chips.push({
      icon: 'fa-fire', color: 'orange',
      label: p.length > 22 ? p.slice(0, 20) + '…' : p, full: p,
      query: `Alarm "${p}" เกิดบ่อย (${c} ครั้ง) — บอกวิธีแก้ที่ได้ผลมากที่สุดสำหรับ Alarm นี้`,
    });
  });
  chips.push({ icon:'fa-screwdriver-wrench', color:'cyan',  label:'แจ้งเปลี่ยน Part',
    query:`ต้องการแจ้งเปลี่ยน Spare Part — กรุณาถามฉันว่าต้องการเปลี่ยน Part ไหน แล้วฉันจะค้นสต็อกให้` });
  chips.push({ icon:'fa-circle-question', color:'purple', label:'ถามเรื่องอะไรได้บ้าง',
    query:`อธิบายวิธีใช้งาน App Chatbot นี้แต่ละฟีเจอร์อย่างละเอียด พร้อมตัวอย่างประโยคที่พิมพ์ได้จริงในแต่ละข้อ ตอบเป็น bullet list 6 ข้อ: แก้ Alarm, เช็ค Spare Part, ดูประวัติซ่อม, ถามจากคู่มือ, ส่งรูปภาพ, บันทึกผลซ่อม` });

  const looped = [...chips, ...chips];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let pos = 0;
    const tick = () => {
      if (!paused.current && el.scrollWidth > el.clientWidth + 4) {
        pos += 0.5;
        if (pos >= el.scrollWidth / 2) pos = 0;
        el.scrollLeft = pos;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    const stop = () => { paused.current = true; };
    const go   = () => { paused.current = false; };
    const stopThenGo = () => { paused.current = true; setTimeout(() => { paused.current = false; }, 2500); };
    el.addEventListener('mouseenter', stop);
    el.addEventListener('mouseleave', go);
    el.addEventListener('touchstart', stop, { passive: true });
    el.addEventListener('touchend',   stopThenGo);
    return () => {
      cancelAnimationFrame(animRef.current);
      el.removeEventListener('mouseenter', stop);
      el.removeEventListener('mouseleave', go);
      el.removeEventListener('touchstart', stop);
      el.removeEventListener('touchend',   stopThenGo);
    };
  }, [records]);

  return (
    <div className="qcb-wrap">
      <div className="qcb-scroll" ref={scrollRef}>
        {looped.map((chip, i) => (
          <button key={i} className={`qcb-chip qcb-${chip.color}`}
            onClick={() => !disabled && onSend(chip.query, chip.label || chip.full)}
            disabled={disabled} title={chip.full || chip.label}>
            <i className={`fa-solid ${chip.icon}`}/>
            <span>{chip.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function WorkflowBtns({ onPass, onFail }) {
  return (
    <div className="wf-btns">
      <button className="wf-btn fail-btn" onClick={onFail}><i className="fa-solid fa-triangle-exclamation"/> ซ่อมไม่สำเร็จ ต้องการวิธีอื่นไหม?</button>
      <button className="wf-btn pass-btn" onClick={onPass}><i className="fa-solid fa-circle-check"/> ✅ ผ่านแล้ว บันทึก</button>
    </div>
  );
}

function FollowupBtns({ options, onSelect }) {
  return (
    <div className="followup-btns">
      <div className="followup-label"><i className="fa-solid fa-list-ul"/> วิธีแก้ไขทางเลือก</div>
      {options.map((opt, i) => (
        <button key={i} className="followup-btn" onClick={() => onSelect(opt)}>
          <span className="followup-num">{i + 1}</span>
          <span className="followup-text">{opt}</span>
          <i className="fa-solid fa-chevron-right followup-arrow"/>
        </button>
      ))}
    </div>
  );
}

function Lightbox({ src, onClose }) {
  useEffect(()=>{
    const fn=e=>{if(e.key==='Escape')onClose();};
    document.addEventListener('keydown',fn);
    return ()=>document.removeEventListener('keydown',fn);
  },[onClose]);
  return (
    <div className="lb-ov" onClick={onClose}>
      <button className="lb-close" onClick={onClose}><i className="fa-solid fa-xmark"/></button>
      <img className="lb-img" src={src} alt="ขยาย" onClick={e=>e.stopPropagation()}/>
    </div>
  );
}

function RecordModal({ machine, init, onClose }) {
  const [reporter, setReporter] = useState(()=>localStorage.getItem('machai_reporter')||'');
  const [problem,  setProblem]  = useState(init?.problem||'');
  const [solution, setSolution] = useState(init?.solution||'');
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  useEffect(()=>{
    const fn=e=>{if(e.key==='Escape')onClose();};
    document.addEventListener('keydown',fn);
    return()=>document.removeEventListener('keydown',fn);
  },[onClose]);

  const submit=async()=>{
    if(!reporter.trim()){alert('กรุณาใส่ชื่อผู้บันทึก');return;}
    setSaving(true);
    try{
      const res=await fetch(`${API_BASE}/machines/${machine.code}/records`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({problem:problem.trim(),solution:solution.trim(),reporter:reporter.trim()})
      });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      localStorage.setItem('machai_reporter',reporter.trim());
      setSaved(true);
      setTimeout(onClose,1400);
    }catch(e){
      alert('บันทึกไม่สำเร็จ: '+e.message);
    }finally{
      setSaving(false);
    }
  };

  return(
    <div className="rec-backdrop" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="rec-modal">
        <div className="rec-header">
          <i className="fa-solid fa-clipboard-check"/>
          <span className="rec-title">บันทึกผลการซ่อม</span>
          <button className="rec-close" onClick={onClose}><i className="fa-solid fa-xmark"/></button>
        </div>
        {saved?(
          <div className="rec-saved">
            <i className="fa-solid fa-circle-check"/>
            <span>บันทึกสำเร็จ!</span>
          </div>
        ):(
          <>
            <div className="rec-body">
              <div className="rec-hint">✅ แก้ไขสำเร็จ! บันทึกไว้เพื่อช่วยเหลือครั้งหน้า</div>
              <div className="rec-field">
                <label>ชื่อผู้บันทึก <span className="req">*</span></label>
                <input type="text" value={reporter} onChange={e=>setReporter(e.target.value)}
                  placeholder="เช่น ช่างสมชาย" autoFocus/>
              </div>
              <div className="rec-field">
                <label>Alarm / ปัญหาที่พบ</label>
                <input type="text" value={problem} onChange={e=>setProblem(e.target.value)}
                  placeholder="เช่น Alarm ฟิล์มไม่ตัด"/>
              </div>
              <div className="rec-field">
                <label>วิธีแก้ไขที่สำเร็จ</label>
                <textarea rows={3} value={solution} onChange={e=>setSolution(e.target.value)}
                  placeholder="อธิบายขั้นตอนที่ทำให้แก้ไขสำเร็จ..."/>
              </div>
            </div>
            <div className="rec-footer">
              <button className="rec-skip" onClick={onClose} disabled={saving}>ข้ามไป</button>
              <button className="rec-save" onClick={submit} disabled={saving}>
                {saving?<><div className="rec-spinner"/><span>กำลังบันทึก...</span></>
                        :<><i className="fa-solid fa-floppy-disk"/><span>บันทึก</span></>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ✅ อัปเดตแปลภาษาผ่าน Proxy เช่นเดียวกัน
async function translateSection(rawMarkdown) {
  const prompt = `แปลเอกสารคู่มือเครื่องจักรต่อไปนี้เป็นภาษาไทยให้ครบถ้วน ถูกต้องตามเทคนิค และเข้าใจง่ายสำหรับช่างโรงงาน
- คงรูปแบบ Markdown เดิมทุกอย่าง (หัวข้อ, ตาราง, bullet, bold, code block)
- คงชื่อเทคนิค, ชื่อรุ่น, ตัวเลข, หน่วยวัด, และ path รูปภาพ ![...](...)  ไว้ตามเดิม — ห้ามแปล
- ห้ามเพิ่มคำอธิบายหรือหมายเหตุนอกเหนือจากเนื้อหาต้นฉบับ

เอกสารต้นฉบับ:
${rawMarkdown}`;

  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1 }
    })
  });

  if(!res.ok){ 
    const e=await res.json().catch(()=>({})); 
    throw new Error(e?.detail || `HTTP ${res.status}`); 
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || rawMarkdown;
}

function ManualDrawer({ section, manual, cache, onClose }) {
  const rawContent = findSection(manual, section);
  const [translated, setTranslated] = useState(()=> cache.current[section] ?? null);
  const [translating, setTranslating] = useState(false);
  const [transError, setTransError] = useState('');
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(()=>{
    if(!rawContent) return;
    if(cache.current[section]) { setTranslated(cache.current[section]); return; }
    setTranslating(true);
    setTranslated(null);
    setTransError('');
    translateSection(rawContent)
      .then(t=>{ cache.current[section]=t; setTranslated(t); setTranslating(false); })
      .catch(e=>{ setTransError(e.message); setTranslating(false); });
  }, [section]);

  const displayContent = showOriginal ? rawContent : (translated ?? (transError ? rawContent : null));
  const showFooter = !translating && !!rawContent;
  const canSwitch = !!translated && !transError;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose}/>
      <div className="manual-drawer">
        <div className="drawer-hdr">
          <i className="fa-solid fa-book drawer-icon"/>
          <div className="drawer-title">{section}</div>
          <button className="drawer-close" onClick={onClose} title="ปิด (ESC)">
            <i className="fa-solid fa-xmark"/>
          </button>
        </div>
        <div className="drawer-breadcrumb">
          <i className="fa-solid fa-circle-info"/>
          {translating
            ? 'กำลังแปลเอกสารเป็นภาษาไทย...'
            : transError
              ? <span style={{color:'var(--red)'}}>แปลไม่สำเร็จ — แสดงต้นฉบับ</span>
              : showOriginal
                ? 'แสดงต้นฉบับภาษาเดิม'
                : 'อ้างอิงจากคู่มือเครื่องจักร (ภาษาไทย)'
          }
        </div>
        <div className="drawer-body">
          {!rawContent ? (
            <div className="drawer-not-found">
              <i className="fa-solid fa-magnifying-glass"/>
              <p>ไม่พบหัวข้อ <strong>"{section}"</strong><br/>ในคู่มือเครื่องนี้</p>
            </div>
          ) : translating ? (
            <div className="drawer-translating">
              <div className="spinner"/>
              <span>กำลังแปลเป็นภาษาไทย...</span>
            </div>
          ) : (
            <div className="md" dangerouslySetInnerHTML={{__html:renderMd(displayContent)}}/>
          )}
        </div>
        {showFooter && (
          <div className="drawer-footer">
            <label className={`drawer-toggle ${!canSwitch ? 'disabled' : ''}`}>
              <span className="toggle-label">
                <i className="fa-solid fa-file-lines"/>
                Original
              </span>
              <div
                className={`toggle-switch ${!showOriginal && canSwitch ? 'on' : ''}`}
                onClick={()=>canSwitch && setShowOriginal(v=>!v)}
                style={{cursor: canSwitch ? 'pointer' : 'not-allowed', opacity: canSwitch ? 1 : 0.45}}
              >
                <div className="toggle-knob"/>
              </div>
              <span className="toggle-label">
                <i className="fa-solid fa-language"/>
                ภาษาไทย
              </span>
            </label>
          </div>
        )}
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
