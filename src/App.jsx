import React, { useState, useRef, useEffect } from "react";

// ── LocalStorage Helpers ───────────────────────────────────────────────────────
const LS = {
  get: (key, def) => { try { const v = localStorage.getItem(`ds_${key}`); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (key, val) => { try { localStorage.setItem(`ds_${key}`, JSON.stringify(val)); } catch {} },
  del: (key) => { try { localStorage.removeItem(`ds_${key}`); } catch {} },
};

const C = {
  bg:'#0D1B2A', surface:'#1A2A3A', border:'#2A3D50',
  accent:'#FF6B35', accentSoft:'rgba(255,107,53,0.12)',
  teal:'#4ECDC4', text:'#F0EDE8', muted:'#7A8B9A',
  success:'#4CAF50', danger:'#FF4757', yellow:'#FFE66D',
};
const todayDate = new Date();
const DAY_KEYS = ['So','Mo','Di','Mi','Do','Fr','Sa'];
const WEEKDAYS = ['Mo','Di','Mi','Do','Fr','Sa','So'];
const todayDay = DAY_KEYS[todayDate.getDay()];
const fmt = (d) => d.toLocaleDateString('de-AT');

const INITIAL_DOG = { name:'Bello', breed:'Golden Retriever', age:3, weight:28.5, emoji:'🐕‍🦺', birthday:'15.03.2022', chip:'AT123456789' };
const INITIAL_APPTS = [
  { id:1, date:'28.06.2026', time:'10:00', reason:'Jährliche Untersuchung', vet:'Dr. Huber', done:false },
  { id:2, date:'10.07.2026', time:'14:30', reason:'Impfauffrischung Tollwut', vet:'Dr. Huber', done:false },
];
const INITIAL_MEALS = [
  { id:1, name:'Morgenmahlzeit', time:'07:30', food:'Trockenfutter', amount:'200g', days:[...WEEKDAYS] },
  { id:2, name:'Abendmahlzeit', time:'17:00', food:'Nassfutter', amount:'150g', days:[...WEEKDAYS] },
];
const INITIAL_MEDS = [
  { id:1, name:'Zeckenprophylaxe', dose:'1 Tablette', time:'08:00', days:['Mo'], notes:'Monatlich' },
];
const INITIAL_WEIGHT = [
  { id:1, date:'01.04.2026', weight:27.8 },
  { id:2, date:'01.05.2026', weight:28.2 },
  { id:3, date:'01.06.2026', weight:28.5 },
];
const PLACES_DATA = [
  { id:1, cat:'swim', name:'Wörthersee – Hundestrand Krumpendorf', emoji:'🏊', region:'Kärnten', rating:4.9, tags:['Leinen frei','Flach','Parkplatz'], note:'Österreichs schönster Hundestrand!' },
  { id:2, cat:'swim', name:'Neusiedler See – Podersdorf', emoji:'🌊', region:'Burgenland', rating:4.6, tags:['Naturstrand','Ruhig','Weitläufig'], note:'Traumhafter Schilf-Naturstrand.' },
  { id:3, cat:'swim', name:'Attersee – Weyregg', emoji:'💧', region:'Oberösterreich', rating:4.7, tags:['Kristallklar','Schatten','Natur'], note:'Klarste Wasser Österreichs!' },
  { id:4, cat:'swim', name:'Wolfgangsee – Strobl', emoji:'🌅', region:'Salzburg', rating:4.5, tags:['Bergpanorama','Flach','Familiär'], note:'Mit Blick auf den Schafberg.' },
  { id:5, cat:'swim', name:'Millstätter See', emoji:'🏖️', region:'Kärnten', rating:4.7, tags:['Warm','Sauber','Hundezone'], note:'Extra Hundezone am Westufer.' },
  { id:6, cat:'swim', name:'Faaker See', emoji:'🐕', region:'Kärnten', rating:4.5, tags:['Leinen frei','Naturufer','Ruhig'], note:'Tolles Wasser, wenig Betrieb.' },
  { id:7, cat:'swim', name:'Mondsee – Loibichl', emoji:'🌙', region:'Oberösterreich', rating:4.6, tags:['Alpenblick','Flach','Parkplatz'], note:'Bergpanorama und ruhiger Strand.' },
  { id:8, cat:'park', name:'Prater Hundezone Wien', emoji:'🌿', region:'Wien', rating:4.7, tags:['Eingezäunt','Groß','Beleuchtung'], note:'Riesige Freilauffläche im Prater.' },
  { id:9, cat:'park', name:'Lainzer Tiergarten', emoji:'🦌', region:'Wien', rating:4.8, tags:['Wildgehege','Weitläufig','Natur'], note:'Ehemaliges Kaiserrevier, Naturschutzgebiet.' },
  { id:10, cat:'park', name:'Schlosspark Schönbrunn', emoji:'👑', region:'Wien', rating:4.5, tags:['Historisch','Weitläufig','Zentral'], note:'Hunde an der Leine erlaubt.' },
  { id:11, cat:'park', name:'Stadtpark Graz', emoji:'🌳', region:'Steiermark', rating:4.5, tags:['Eingezäunt','Spielwiese','Wasser'], note:'Eingezäunte Hundewiese mit Napf.' },
  { id:12, cat:'trail', name:'Kahlenberg Rundweg', emoji:'🥾', region:'Wien / NÖ', rating:4.8, tags:['Aussicht','8 km','Wald'], note:'Traumhafter Blick auf Wien.' },
  { id:13, cat:'trail', name:'Wienerwald Wanderweg', emoji:'🌲', region:'Niederösterreich', rating:4.9, tags:['Weitläufig','Bach','Schattig'], note:'Unendliches Wandergebiet vor Wien.' },
  { id:14, cat:'trail', name:'Schneeberg', emoji:'❄️', region:'Niederösterreich', rating:4.8, tags:['Alpin','Aussicht','Anspruchsvoll'], note:'Höchster Berg NÖs im Sommer!' },
  { id:15, cat:'trail', name:'Leopoldsberg', emoji:'🏰', region:'Wien', rating:4.7, tags:['3 km','Aussicht','Leicht'], note:'Kurze Tour, fantastischer Blick.' },
  { id:16, cat:'cafe', name:'Café Schwarzenberg Wien', emoji:'☕', region:'Wien', rating:4.8, tags:['Hunde erlaubt','Hundenapf','Terrasse'], note:'Wiener Kaffeehauskultur mit Hund!' },
  { id:17, cat:'cafe', name:'Heuriger Mayer am Pfarrplatz', emoji:'🍷', region:'Wien', rating:4.7, tags:['Garten','Heuriger','Entspannt'], note:'Traditioneller Wiener Heuriger.' },
  { id:18, cat:'cafe', name:'Berggasthof Rax', emoji:'🍺', region:'Niederösterreich', rating:4.7, tags:['Nach Wanderung','Hunde','Gemütlich'], note:'Perfekt nach der Rax-Tour!' },
];
const POSTS_DATA = []; // Community startet leer - Nutzer erstellen eigene Beiträge


// ── UI helpers ─────────────────────────────────────────────────────────────────
const card = { background:C.surface, borderRadius:'16px', padding:'16px', marginBottom:'12px', border:`1px solid ${C.border}` };
const cTitle = { fontSize:'10px', fontWeight:'800', letterSpacing:'1.5px', color:C.muted, textTransform:'uppercase', marginBottom:'12px' };
const row = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}` };
const inp = (extra={}) => ({ background:C.bg, border:`1px solid ${C.border}`, borderRadius:'10px', padding:'11px 14px', color:C.text, fontSize:'16px', width:'100%', outline:'none', boxSizing:'border-box', marginBottom:'10px', WebkitAppearance:'none', ...extra });
const bdg = (color) => ({ background:`${color}22`, color, borderRadius:'6px', padding:'3px 8px', fontSize:'10px', fontWeight:'800', whiteSpace:'nowrap' });

const exportICS = (appt) => {
  try {
    const [d,m,y] = appt.date.split('.');
    const [h,min] = (appt.time||'10:00').split(':');
    const endH = String(Math.min(23,parseInt(h)+1)).padStart(2,'0');
    const now = new Date().toISOString().replace(/[-:.]/g,'').slice(0,15)+'Z';
    const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Dogstyle 2.0//AT','BEGIN:VEVENT',
      `UID:${Date.now()}@dogstyle.at`,`DTSTAMP:${now}`,
      `DTSTART:${y}${m}${d}T${h}${min}00`,`DTEND:${y}${m}${d}T${endH}${min}00`,
      `SUMMARY:🐾 ${appt.reason}`,`DESCRIPTION:${appt.vet}\\nDogstyle 2.0`,
      'END:VEVENT','END:VCALENDAR'].join('\r\n');
    const blob = new Blob([ics],{type:'text/calendar;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='termin.ics';
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  } catch { alert('Export nicht verfügbar'); }
};

// ── Shared components ──────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',zIndex:999,display:'flex',alignItems:'flex-end',justifyContent:'center' }}>
      <div style={{ background:C.surface,borderRadius:'20px 20px 0 0',width:'100%',maxWidth:'430px',maxHeight:'88vh',display:'flex',flexDirection:'column',border:`1px solid ${C.border}` }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 20px',borderBottom:`1px solid ${C.border}`,flexShrink:0 }}>
          <span style={{ fontSize:'16px',fontWeight:'800' }}>{title}</span>
          <span style={{ cursor:'pointer',fontSize:'22px',color:C.muted }} onClick={onClose}>✕</span>
        </div>
        <div style={{ overflowY:'auto',padding:'16px 20px 32px' }}>{children}</div>
      </div>
    </div>
  );
}

function StarPicker({ value, onChange }) {
  return (
    <div style={{ display:'flex',gap:'8px',marginBottom:'14px' }}>
      {[1,2,3,4,5].map(s=>(
        <span key={s} onClick={()=>onChange(s)} style={{ fontSize:'30px',cursor:'pointer',opacity:s<=value?1:0.2 }}>⭐</span>
      ))}
    </div>
  );
}

// ── ConsentScreen ──────────────────────────────────────────────────────────────
function ConsentScreen({ onAccept }) {
  const [age,setAge]=useState(false);
  const [priv,setPriv]=useState(false);
  const [terms,setTerms]=useState(false);
  const ok=age&&priv&&terms;
  return (
    <div style={{ background:C.bg,minHeight:'100vh',maxWidth:'430px',margin:'0 auto',display:'flex',flexDirection:'column',justifyContent:'center',padding:'24px',fontFamily:'system-ui,sans-serif',color:C.text }}>
      <div style={{ textAlign:'center',marginBottom:'28px' }}>
        <div style={{ fontSize:'58px',marginBottom:'10px' }}>🐾</div>
        <div style={{ display:'inline-block',background:`${C.success}22`,color:C.success,borderRadius:'20px',padding:'4px 14px',fontSize:'11px',fontWeight:'800',marginBottom:'10px' }}>100% KOSTENLOS</div>
        <div style={{ fontSize:'10px',fontWeight:'800',letterSpacing:'2px',color:C.accent,marginBottom:'4px' }}>WILLKOMMEN BEI</div>
        <div style={{ fontSize:'32px',fontWeight:'800',letterSpacing:'-1px' }}>Dogstyle 2.0</div>
        <div style={{ fontSize:'13px',color:C.muted,marginTop:'6px' }}>🇦🇹 Die Hunde-App für Österreich</div>
      </div>
      <div style={{ ...card,marginBottom:'14px' }}>
        {[{val:age,set:setAge,text:'Ich bin mindestens 16 Jahre alt (DSGVO Art. 8).'},{val:priv,set:setPriv,text:'Ich habe die Datenschutzerklärung gelesen und akzeptiere sie.'},{val:terms,set:setTerms,text:'Ich akzeptiere die Nutzungsbedingungen inkl. KI-Disclaimer.'}].map((item,i)=>(
          <div key={i} onClick={()=>item.set(!item.val)} style={{ display:'flex',gap:'12px',alignItems:'flex-start',marginBottom:'14px',cursor:'pointer' }}>
            <div style={{ width:'22px',height:'22px',borderRadius:'6px',border:`2px solid ${item.val?C.accent:C.border}`,background:item.val?C.accent:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'12px',color:'#fff',fontWeight:'bold' }}>{item.val?'✓':''}</div>
            <span style={{ fontSize:'13px',color:C.muted,lineHeight:1.5,marginTop:'1px' }}>{item.text}</span>
          </div>
        ))}
      </div>
      <div style={{ ...card,border:`1px solid ${C.teal}44`,marginBottom:'20px',fontSize:'12px',color:C.muted,lineHeight:1.6 }}>
        ℹ️ Daten bleiben lokal. KI-Chat → <strong style={{ color:C.text }}>Anthropic, Inc.</strong> (USA). Community für alle sichtbar.
      </div>
      <button onClick={()=>ok&&onAccept()} style={{ background:ok?C.accent:C.border,color:ok?'#fff':C.muted,border:'none',borderRadius:'14px',padding:'16px',fontSize:'16px',fontWeight:'800',cursor:ok?'pointer':'not-allowed',width:'100%' }}>
        Kostenlos starten →
      </button>
    </div>
  );
}

// ── RouteRecorder ──────────────────────────────────────────────────────────────
function RouteRecorder({ onSave }) {
  const cvRef=useRef(null),pathRef=useRef([]),progRef=useRef(0),statusRef=useRef('idle'),animRef=useRef(null),timerRef=useRef(null);
  const [status,setStatus]=useState('idle'),[elapsed,setElapsed]=useState(0),[name,setName]=useState('');
  const fmtT=(s)=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const dist=(elapsed*4.5/3600).toFixed(2);
  const gen=(w,h)=>{ const pts=[];let x=w*0.45,y=h*0.5,dx=2,dy=1;for(let i=0;i<280;i++){dx+=(Math.random()-0.5)*2.2;dy+=(Math.random()-0.5)*1.8;dx*=0.93;dy*=0.93;x+=dx;y+=dy;if(x<14){x=14;dx=Math.abs(dx)*1.3;}if(x>w-14){x=w-14;dx=-Math.abs(dx)*1.3;}if(y<14){y=14;dy=Math.abs(dy)*1.3;}if(y>h-14){y=h-14;dy=-Math.abs(dy)*1.3;}pts.push({x:Math.round(x),y:Math.round(y)});}return pts;};
  const draw=(prog)=>{ const cv=cvRef.current;if(!cv)return;const ctx=cv.getContext('2d'),w=cv.width,h=cv.height;ctx.fillStyle='#0A1520';ctx.fillRect(0,0,w,h);ctx.strokeStyle='rgba(42,61,80,0.55)';ctx.lineWidth=0.5;for(let gx=0;gx<w;gx+=24){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,h);ctx.stroke();}for(let gy=0;gy<h;gy+=24){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(w,gy);ctx.stroke();}const pts=pathRef.current;if(!pts.length)return;const end=Math.max(1,Math.floor(prog*pts.length));ctx.beginPath();ctx.strokeStyle='rgba(255,107,53,0.22)';ctx.lineWidth=8;ctx.lineCap='round';ctx.lineJoin='round';ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<end;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.stroke();ctx.beginPath();ctx.strokeStyle='#FF6B35';ctx.lineWidth=3;ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<end;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.stroke();ctx.beginPath();ctx.fillStyle='#4ECDC4';ctx.arc(pts[0].x,pts[0].y,6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#0A1520';ctx.font='bold 8px sans-serif';ctx.textAlign='center';ctx.fillText('S',pts[0].x,pts[0].y+3);const cur=pts[end-1];if(prog<1){ctx.beginPath();ctx.strokeStyle='rgba(255,107,53,0.3)';ctx.lineWidth=2;ctx.arc(cur.x,cur.y,11,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.fillStyle='#FF6B35';ctx.arc(cur.x,cur.y,5,0,Math.PI*2);ctx.fill();}else{ctx.beginPath();ctx.fillStyle=C.danger;ctx.arc(cur.x,cur.y,6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 8px sans-serif';ctx.textAlign='center';ctx.fillText('Z',cur.x,cur.y+3);}};
  useEffect(()=>{ const cv=cvRef.current;if(!cv)return;setTimeout(()=>{cv.width=cv.offsetWidth||340;cv.height=200;draw(0);},80);return()=>{clearInterval(animRef.current);clearInterval(timerRef.current);};},[]);
  const start=()=>{ const cv=cvRef.current;cv.width=cv.offsetWidth||340;cv.height=200;pathRef.current=gen(cv.width,cv.height);progRef.current=0;statusRef.current='recording';setStatus('recording');setElapsed(0);draw(0);animRef.current=setInterval(()=>{if(statusRef.current!=='recording')return;progRef.current=Math.min(1,progRef.current+0.0045);draw(progRef.current);if(progRef.current>=1)clearInterval(animRef.current);},50);timerRef.current=setInterval(()=>{if(statusRef.current==='recording')setElapsed(e=>e+1);},1000);};
  const stop=()=>{ clearInterval(animRef.current);clearInterval(timerRef.current);statusRef.current='done';setStatus('done');draw(progRef.current);};
  const save=()=>{ onSave({id:Date.now(),name:name||'Meine Route',duration:elapsed,distance:dist,date:fmt(todayDate),time:new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})});progRef.current=0;statusRef.current='idle';setStatus('idle');setElapsed(0);setName('');setTimeout(()=>{const cv=cvRef.current;if(cv){cv.width=cv.offsetWidth||340;cv.height=200;draw(0);}},50);};
  const discard=()=>{ progRef.current=0;statusRef.current='idle';setStatus('idle');setElapsed(0);setTimeout(()=>{const cv=cvRef.current;if(cv){cv.width=cv.offsetWidth||340;cv.height=200;draw(0);}},50);};
  return (
    <div style={{ ...card,padding:0,overflow:'hidden' }}>
      <canvas ref={cvRef} style={{ width:'100%',height:'200px',display:'block' }}/>
      <div style={{ padding:'14px 16px' }}>
        {status==='idle'&&<button onClick={start} style={{ background:C.accent,color:'#fff',border:'none',borderRadius:'12px',padding:'13px',fontSize:'15px',fontWeight:'800',cursor:'pointer',width:'100%' }}>▶ Route aufzeichnen</button>}
        {status==='recording'&&<><div style={{ display:'flex',justifyContent:'space-around',marginBottom:'12px' }}><div style={{ textAlign:'center' }}><div style={{ fontSize:'26px',fontWeight:'800',color:C.teal }}>{fmtT(elapsed)}</div><div style={{ fontSize:'10px',color:C.muted }}>Zeit</div></div><div style={{ textAlign:'center' }}><div style={{ fontSize:'26px',fontWeight:'800',color:C.accent }}>{dist}<span style={{ fontSize:'12px',color:C.muted }}> km</span></div><div style={{ fontSize:'10px',color:C.muted }}>Distanz</div></div><div style={{ textAlign:'center' }}><div style={{ fontSize:'20px' }}>🔴</div><div style={{ fontSize:'10px',color:C.danger,fontWeight:'800' }}>LIVE</div></div></div><button onClick={stop} style={{ background:C.danger,color:'#fff',border:'none',borderRadius:'12px',padding:'13px',fontSize:'15px',fontWeight:'800',cursor:'pointer',width:'100%' }}>⏹ Stoppen</button></>}
        {status==='done'&&<><div style={{ display:'flex',justifyContent:'space-around',marginBottom:'12px' }}><div style={{ textAlign:'center' }}><div style={{ fontSize:'22px',fontWeight:'800',color:C.teal }}>{fmtT(elapsed)}</div><div style={{ fontSize:'10px',color:C.muted }}>Zeit</div></div><div style={{ textAlign:'center' }}><div style={{ fontSize:'22px',fontWeight:'800',color:C.accent }}>{dist} km</div><div style={{ fontSize:'10px',color:C.muted }}>Distanz</div></div><div style={{ textAlign:'center' }}><div style={{ fontSize:'22px',fontWeight:'800',color:C.success }}>✓</div><div style={{ fontSize:'10px',color:C.muted }}>Fertig</div></div></div><input style={inp()} placeholder="Routenname" value={name} onChange={e=>setName(e.target.value)}/><div style={{ display:'flex',gap:'8px' }}><button onClick={save} style={{ flex:1,background:C.accent,color:'#fff',border:'none',borderRadius:'12px',padding:'12px',fontSize:'14px',fontWeight:'700',cursor:'pointer' }}>💾 Speichern</button><button onClick={discard} style={{ flex:1,background:'transparent',color:C.muted,border:`1px solid ${C.border}`,borderRadius:'12px',padding:'12px',fontSize:'14px',cursor:'pointer' }}>Verwerfen</button></div></>}
      </div>
    </div>
  );
}

// ── KI Chat ────────────────────────────────────────────────────────────────────
function KIChatTab({ dog, aiMsgs, setAiMsgs }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => LS.get('geminiKey', ''));
  const [tempKey, setTempKey] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const chatEnd = useRef(null);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiMsgs]);

  const saveKey = () => {
    if (!tempKey.trim()) return;
    const k = tempKey.trim();
    LS.set('geminiKey', k);
    setApiKey(k);
    setTempKey('');
    setShowSetup(false);
  };

  const send = async () => {
    if (!input.trim() || loading || !apiKey) return;
    const msg = input.replace(/[<>]/g, '').trim().slice(0, 500);
    setInput('');
    const updated = [...aiMsgs, { role: 'user', content: msg }];
    setAiMsgs(updated); setLoading(true);
    try {
      const system = `Hundeassistent Dogstyle2.0 Österreich. Hund: ${dog.name||'unbekannt'}, ${dog.breed||'Rasse unbekannt'}, ${dog.age||'?'}J., ${dog.weight||'?'}kg. Antworte auf Österreichisch-Deutsch (gerne "Servus"), kurz und freundlich. Bei Gesundheitsfragen immer Tierarzt empfehlen.`;
      const contents = updated.slice(-12).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: system }] },
            contents,
            generationConfig: { maxOutputTokens: 1000 }
          })
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Keine Antwort erhalten.';
      setAiMsgs(p => [...p, { role: 'assistant', content: text }]);
    } catch (e) {
      setAiMsgs(p => [...p, { role: 'assistant', content: `⚠️ Fehler: ${e.message || 'Verbindungsfehler'}. API-Key überprüfen.` }]);
    }
    setLoading(false);
  };

  // Kein API Key → Setup anzeigen
  if (!apiKey || showSetup) return (
    <div>
      <div style={{ ...card, border: `2px solid ${C.teal}55`, textAlign: 'center', padding: '24px 16px' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🤖</div>
        <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>KI-Assistent einrichten</div>
        <div style={{ fontSize: '13px', color: C.muted, lineHeight: 1.7, marginBottom: '20px' }}>
          Du brauchst einen <strong style={{ color: C.text }}>kostenlosen</strong> Google Gemini API-Key.{'\n\n'}
          Geh auf <strong style={{ color: C.teal }}>aistudio.google.com/apikey</strong> → "Create API key" → Key hier einfügen.
        </div>
        <input
          type="text"
          value={tempKey}
          onChange={e => setTempKey(e.target.value)}
          placeholder="AIza... (Key hier einfügen)"
          autoComplete="off"
          style={{ ...inp({ marginBottom: '10px' }), fontSize: '14px', textAlign: 'center' }}
        />
        <button onClick={saveKey} disabled={!tempKey.trim()} style={{ background: tempKey.trim() ? C.teal : C.border, color: tempKey.trim() ? '#0D1B2A' : C.muted, border: 'none', borderRadius: '12px', padding: '13px', fontSize: '15px', fontWeight: '800', cursor: tempKey.trim() ? 'pointer' : 'not-allowed', width: '100%' }}>
          ✓ Key speichern & starten
        </button>
        <div style={{ fontSize: '11px', color: C.muted, marginTop: '12px', lineHeight: 1.5 }}>
          🔒 Key wird nur lokal in deinem Browser gespeichert.<br/>Kostenlos – kein Kreditkarte nötig.
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 240px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ background: `${C.danger}15`, border: `1px solid ${C.danger}33`, borderRadius: '8px', padding: '6px 10px', fontSize: '11px', color: C.danger, fontWeight: '600' }}>
          ⚕️ Kein Ersatz für Tierarzt
        </div>
        <button onClick={() => { setShowSetup(true); setTempKey(apiKey); }} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '8px', padding: '5px 10px', fontSize: '11px', color: C.muted, cursor: 'pointer' }}>⚙️ Key</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '8px' }}>
        {aiMsgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '82%', background: m.role === 'user' ? C.accent : C.surface, border: m.role === 'assistant' ? `1px solid ${C.border}` : 'none', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '11px 14px', fontSize: '14px', lineHeight: 1.55, color: C.text, whiteSpace: 'pre-wrap' }}>
              {m.role === 'assistant' && <span style={{ marginRight: '6px' }}>🐾</span>}{m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ display: 'flex' }}><div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px 16px 16px 4px', padding: '12px 18px', fontSize: '20px', letterSpacing: '4px', color: C.accent }}>···</div></div>}
        <div ref={chatEnd} />
      </div>
      <div style={{ flexShrink: 0, borderTop: `1px solid ${C.border}`, paddingTop: '12px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
          {['Was darf er nicht essen?', 'Wie viel Schlaf?', 'Tipps gegen Zecken?'].map(q => (
            <button key={q} onClick={() => setInput(q)} style={{ background: C.accentSoft, color: C.accent, border: `1px solid ${C.accent}33`, borderRadius: '20px', padding: '5px 10px', fontSize: '11px', cursor: 'pointer', fontWeight: '700' }}>{q}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={`Frage zu ${dog.name || 'deinem Hund'}...`} maxLength={500} autoComplete="off"
            style={{ flex: 1, background: C.bg, border: `2px solid ${C.accent}55`, borderRadius: '12px', padding: '13px 16px', color: C.text, fontSize: '16px', outline: 'none' }} />
          <button onClick={send} disabled={loading || !input.trim()} style={{ background: input.trim() ? C.accent : C.border, color: '#fff', border: 'none', borderRadius: '12px', width: '50px', height: '50px', fontSize: '22px', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>→</button>
        </div>
      </div>
    </div>
  );
}

// ── HomeTab ────────────────────────────────────────────────────────────────────
function HomeTab({ dog, meals, mealDone, toggleMealDone, appts, meds, routes, showInstall, onInstall, onDismissInstall, onNavigate, isGuest }) {
  const todayMeals=meals.filter(m=>m.days.includes(todayDay));
  const totalMin=routes.filter(r=>r.date===fmt(todayDate)).reduce((s,r)=>s+(r.duration||0),0);
  const fedCount=todayMeals.filter(m=>mealDone[m.id]).length;
  const upcomingAppt=appts.find(a=>!a.done);
  const todayMeds=meds.filter(m=>m.days.includes(todayDay));
  const isEmpty = !dog.breed && !dog.weight && meals.length===0 && appts.length===0;

  return (
    <div>
      {showInstall&&(
        <div style={{ background:`${C.teal}15`,border:`1px solid ${C.teal}44`,borderRadius:'14px',padding:'12px 14px',marginBottom:'12px',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div><div style={{ fontSize:'13px',fontWeight:'700',color:C.teal }}>📱 App installieren</div><div style={{ fontSize:'11px',color:C.muted }}>Zum Homescreen hinzufügen</div></div>
          <div style={{ display:'flex',gap:'8px' }}>
            <button onClick={onInstall} style={{ background:C.teal,color:'#0D1B2A',border:'none',borderRadius:'8px',padding:'6px 12px',fontSize:'12px',fontWeight:'800',cursor:'pointer' }}>Installieren</button>
            <button onClick={onDismissInstall} style={{ background:'transparent',color:C.muted,border:'none',fontSize:'18px',cursor:'pointer' }}>✕</button>
          </div>
        </div>
      )}

      {/* Onboarding für neue Nutzer */}
      {isEmpty && !isGuest && (
        <div style={{ ...card, border:`2px solid ${C.accent}55`, background:`${C.accent}08`, marginBottom:'16px' }}>
          <div style={{ textAlign:'center', padding:'8px 0' }}>
            <div style={{ fontSize:'44px', marginBottom:'10px' }}>🐕</div>
            <div style={{ fontSize:'18px', fontWeight:'800', marginBottom:'6px' }}>Willkommen bei Dogstyle 2.0!</div>
            <div style={{ fontSize:'13px', color:C.muted, lineHeight:1.6, marginBottom:'16px' }}>
              Leg jetzt dein Hundeprofil an um alle Features zu nutzen.
            </div>
            <button onClick={()=>onNavigate('meinHund')} style={{ background:C.accent, color:'#fff', border:'none', borderRadius:'12px', padding:'12px 24px', fontSize:'15px', fontWeight:'800', cursor:'pointer' }}>
              🐾 Hund anlegen →
            </button>
          </div>
          <div style={{ marginTop:'16px', borderTop:`1px solid ${C.border}`, paddingTop:'14px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            {[{icon:'📅', label:'Termine', action:'meinHund'},{icon:'🍖', label:'Fütterung', action:'meinHund'},{icon:'🗺️', label:'Routen', action:'routes'},{icon:'🏊', label:'Orte', action:'places'}].map(item=>(
              <button key={item.label} onClick={()=>onNavigate(item.action)} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'10px', padding:'10px', fontSize:'12px', fontWeight:'700', color:C.muted, cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', justifyContent:'center' }}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {!isEmpty && <>
        <div style={{ fontSize:'20px',fontWeight:'800',marginBottom:'16px' }}>Heute 📅</div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'12px' }}>
          {[{val:totalMin>0?`${totalMin}m`:'–',label:'Gassi',color:C.teal},{val:todayMeals.length>0?`${fedCount}/${todayMeals.length}`:'–',label:'Mahlzeiten',color:C.accent},{val:dog.weight?`${dog.weight}kg`:'–',label:'Gewicht',color:C.yellow}].map(s=>(
            <div key={s.label} style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:'14px',padding:'14px 8px',textAlign:'center' }}>
              <div style={{ fontSize:'20px',fontWeight:'800',color:s.color,lineHeight:1,marginBottom:'4px' }}>{s.val}</div>
              <div style={{ fontSize:'10px',color:C.muted,fontWeight:'600' }}>{s.label}</div>
            </div>
          ))}
        </div>
        {upcomingAppt&&(
          <div style={{ ...card,borderLeft:`3px solid ${C.teal}`,cursor:'pointer' }} onClick={()=>onNavigate('meinHund')}>
            <div style={cTitle}>Nächster Termin</div>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
              <div><div style={{ fontSize:'15px',fontWeight:'700' }}>{upcomingAppt.reason}</div><div style={{ fontSize:'12px',color:C.muted }}>📅 {upcomingAppt.date} {upcomingAppt.time} · {upcomingAppt.vet}</div></div>
              <span style={bdg(C.teal)}>BALD</span>
            </div>
          </div>
        )}
        {todayMeals.length>0&&(
          <div style={card}>
            <div style={cTitle}>Fütterung heute – {todayDay}</div>
            {todayMeals.map(m=>(
              <div key={m.id} style={{ ...row,cursor:'pointer' }} onClick={()=>toggleMealDone(m.id)}>
                <div style={{ display:'flex',alignItems:'center',gap:'12px' }}>
                  <div style={{ width:'22px',height:'22px',borderRadius:'50%',background:mealDone[m.id]?C.accent:'transparent',border:`2px solid ${mealDone[m.id]?C.accent:C.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'11px',color:'#fff',fontWeight:'bold' }}>{mealDone[m.id]?'✓':''}</div>
                  <div><div style={{ fontSize:'14px',fontWeight:'600',textDecoration:mealDone[m.id]?'line-through':'none',color:mealDone[m.id]?C.muted:C.text }}>{m.name}</div><div style={{ fontSize:'11px',color:C.muted }}>{m.time} · {m.food} · {m.amount}</div></div>
                </div>
              </div>
            ))}
          </div>
        )}
        {todayMeds.length>0&&(
          <div style={{ ...card,borderLeft:`3px solid ${C.danger}` }}>
            <div style={cTitle}>Medikamente heute 💊</div>
            {todayMeds.map(med=>(
              <div key={med.id} style={{ fontSize:'13px',color:C.text,paddingBottom:'6px' }}>💊 <strong>{med.name}</strong> – {med.dose} um {med.time}</div>
            ))}
          </div>
        )}
        {meals.length===0&&!isEmpty&&(
          <div style={{ ...card, cursor:'pointer', border:`1px solid ${C.border}` }} onClick={()=>onNavigate('meinHund')}>
            <div style={{ fontSize:'13px', color:C.muted, textAlign:'center', padding:'4px 0' }}>🍖 Noch kein Fütterungsplan → <strong style={{ color:C.accent }}>Jetzt anlegen</strong></div>
          </div>
        )}
      </>}

      <div style={{ ...card,border:`1px solid ${C.teal}44`,fontSize:'13px',color:C.muted,lineHeight:1.7,cursor:'pointer' }} onClick={()=>onNavigate('places')}>
        🌤️ Schönes Wetter heute! <strong style={{ color:C.teal }}>Zum Wörthersee oder Neusiedler See? → 🏊</strong>
      </div>
    </div>
  );
}

// ── RoutesTab ──────────────────────────────────────────────────────────────────
function RoutesTab({ routes, onAddRoute }) {
  return (
    <div>
      <div style={{ fontSize:'20px',fontWeight:'800',marginBottom:'16px' }}>Routen 🗺️</div>
      <RouteRecorder onSave={onAddRoute}/>
      <div style={card}>
        <div style={cTitle}>Gespeicherte Routen ({routes.length})</div>
        {routes.map(r=>(
          <div key={r.id} style={row}>
            <div><div style={{ fontSize:'14px',fontWeight:'700' }}>{r.name}</div><div style={{ fontSize:'11px',color:C.muted }}>{r.date} · {r.time}</div></div>
            <div style={{ textAlign:'right' }}><div style={{ fontSize:'13px',fontWeight:'800',color:C.teal }}>{r.duration} min</div><div style={{ fontSize:'11px',color:C.muted }}>{r.distance} km</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PlacesTab ──────────────────────────────────────────────────────────────────
function PlacesTab({ places, onAddPlace, placeRatings, onAddRating, isGuest }) {
  const [placeCat,setPlaceCat]=useState('all');
  const [showAdd,setShowAdd]=useState(false);
  const [newName,setNewName]=useState('');
  const [newNote,setNewNote]=useState('');
  const [newCat,setNewCat]=useState('park');
  const [newBL,setNewBL]=useState('');
  const [newLeinen,setNewLeinen]=useState('');
  const [newEintritt,setNewEintritt]=useState('Kostenlos');
  const [newBeschaffenheit,setNewBeschaffenheit]=useState([]);
  const [newEinrichtungen,setNewEinrichtungen]=useState([]);
  const [rateTarget,setRateTarget]=useState(null);
  const [rateStars,setRateStars]=useState(0);
  const [rateComment,setRateComment]=useState('');
  const [expanded,setExpanded]=useState(null);

  const BUNDESLAENDER = ['Wien','Niederösterreich','Oberösterreich','Steiermark','Kärnten','Salzburg','Tirol','Vorarlberg','Burgenland'];
  const BESCHAFFENHEIT_OPT = ['Flach','Bergig','Waldboden','Sand','Gras','Asphalt','Wasser/See','Bachlauf'];
  const EINRICHTUNGEN_OPT = ['Parkplatz','WC','Gastronomie','Schatten','Wasserquelle','Sitzgelegenheit','Beleuchtung'];

  const toggleArr = (arr, setArr, val) => setArr(p => p.includes(val) ? p.filter(x=>x!==val) : [...p,val]);

  const pCats=[{key:'all',emoji:'🗺️',label:'Alle'},{key:'swim',emoji:'🏊',label:'Schwimmen'},{key:'park',emoji:'🌿',label:'Parks'},{key:'trail',emoji:'🥾',label:'Trails'},{key:'cafe',emoji:'☕',label:'Cafés'}];
  const filtered=placeCat==='all'?places:places.filter(p=>p.cat===placeCat);
  const avgR=(id)=>{ const r=placeRatings[id];if(!r?.length)return null;return(r.reduce((s,x)=>s+x.stars,0)/r.length).toFixed(1);};

  const submitPlace=()=>{
    if(!newName||!newBL){return;}
    const emo={swim:'🏊',park:'🌿',trail:'🥾',cafe:'☕'};
    const tags=[
      newLeinen, newEintritt,
      ...newBeschaffenheit,
      ...newEinrichtungen
    ].filter(Boolean);
    onAddPlace({id:Date.now(),cat:newCat,name:newName,emoji:emo[newCat]||'📍',region:newBL,rating:0,tags:tags.length?tags:['Neu'],note:newNote||'Von der Community hinzugefügt 🐾'});
    setNewName('');setNewNote('');setNewBL('');setNewLeinen('');setNewEintritt('Kostenlos');setNewBeschaffenheit([]);setNewEinrichtungen([]);setShowAdd(false);
  };
  const submitRating=()=>{ if(!rateStars||!rateTarget)return;onAddRating(rateTarget.id,rateStars,rateComment);setRateTarget(null);setRateStars(0);setRateComment('');};

  const ChipBtn = ({val, active, onToggle, color=C.teal}) => (
    <button onClick={()=>onToggle(val)} style={{ background:active?`${color}22`:C.bg, color:active?color:C.muted, border:`1px solid ${active?color:C.border}`, borderRadius:'20px', padding:'5px 10px', fontSize:'12px', cursor:'pointer', fontWeight:'700', marginBottom:'4px' }}>{val}</button>
  );

  const selStyle = { ...inp({marginBottom:'10px'}), appearance:'none', WebkitAppearance:'none' };

  return (
    <div>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px' }}>
        <div style={{ fontSize:'20px',fontWeight:'800' }}>Entdecken 🏊</div>
        <button onClick={() => { if (!isGuest) setShowAdd(true); }} style={{ background: isGuest ? C.surface : C.teal, color: isGuest ? C.muted : '#0D1B2A', border: isGuest ? `1px solid ${C.border}` : 'none', borderRadius: '10px', padding: '7px 12px', fontSize: '12px', fontWeight: '800', cursor: isGuest ? 'not-allowed' : 'pointer', opacity: isGuest ? 0.6 : 1 }}>{isGuest ? '🔒 Ort' : '+ Ort'}</button>
      </div>
      <div style={{ display:'flex',gap:'6px',overflowX:'auto',marginBottom:'14px',paddingBottom:'4px' }}>
        {pCats.map(c=>(
          <button key={c.key} onClick={()=>setPlaceCat(c.key)} style={{ background:placeCat===c.key?C.teal:C.surface,color:placeCat===c.key?'#0D1B2A':C.muted,border:`1px solid ${placeCat===c.key?C.teal:C.border}`,borderRadius:'20px',padding:'6px 12px',fontSize:'12px',fontWeight:'700',cursor:'pointer',whiteSpace:'nowrap',flexShrink:0 }}>{c.emoji} {c.label}</button>
        ))}
      </div>
      {showAdd&&(
        <div style={{ ...card,border:`1px solid ${C.teal}44`,marginBottom:'14px' }}>
          <div style={cTitle}>Ort hinzufügen</div>

          {/* Kategorie */}
          <div style={{ fontSize:'11px',color:C.muted,marginBottom:'6px' }}>Kategorie *</div>
          <div style={{ display:'flex',gap:'6px',marginBottom:'12px',flexWrap:'wrap' }}>
            {[{k:'swim',l:'🏊 Schwimmen'},{k:'park',l:'🌿 Park'},{k:'trail',l:'🥾 Trail'},{k:'cafe',l:'☕ Café/Restaurant'}].map(c=>(
              <button key={c.k} onClick={()=>setNewCat(c.k)} style={{ background:newCat===c.k?C.teal:C.surface,color:newCat===c.k?'#0D1B2A':C.muted,border:`1px solid ${newCat===c.k?C.teal:C.border}`,borderRadius:'20px',padding:'6px 12px',fontSize:'13px',cursor:'pointer',fontWeight:'700' }}>{c.l}</button>
            ))}
          </div>

          {/* Name & Bundesland */}
          <input style={inp()} placeholder="Name des Ortes *" value={newName} onChange={e=>setNewName(e.target.value)}/>
          <div style={{ fontSize:'11px',color:C.muted,marginBottom:'6px' }}>Bundesland *</div>
          <select style={selStyle} value={newBL} onChange={e=>setNewBL(e.target.value)}>
            <option value="">Bundesland wählen...</option>
            {BUNDESLAENDER.map(bl=><option key={bl} value={bl}>{bl}</option>)}
          </select>

          {/* Beschreibung */}
          <input style={inp()} placeholder="Kurzbeschreibung & Tipps" value={newNote} onChange={e=>setNewNote(e.target.value)}/>

          {/* Leinen */}
          <div style={{ fontSize:'11px',color:C.muted,marginBottom:'6px' }}>Leinenpflicht</div>
          <select style={selStyle} value={newLeinen} onChange={e=>setNewLeinen(e.target.value)}>
            <option value="">Nicht bekannt</option>
            <option>Leinen frei</option>
            <option>Leinen Pflicht</option>
            <option>Bereich mit Leinen frei</option>
          </select>

          {/* Eintritt */}
          <div style={{ fontSize:'11px',color:C.muted,marginBottom:'6px' }}>Eintritt</div>
          <select style={selStyle} value={newEintritt} onChange={e=>setNewEintritt(e.target.value)}>
            <option>Kostenlos</option>
            <option>Kostenpflichtig</option>
          </select>

          {/* Beschaffenheit */}
          <div style={{ fontSize:'11px',color:C.muted,marginBottom:'6px' }}>Beschaffenheit (mehrere möglich)</div>
          <div style={{ display:'flex',flexWrap:'wrap',gap:'5px',marginBottom:'12px' }}>
            {BESCHAFFENHEIT_OPT.map(b=><ChipBtn key={b} val={b} active={newBeschaffenheit.includes(b)} onToggle={v=>toggleArr(newBeschaffenheit,setNewBeschaffenheit,v)}/>)}
          </div>

          {/* Einrichtungen */}
          <div style={{ fontSize:'11px',color:C.muted,marginBottom:'6px' }}>Einrichtungen vor Ort</div>
          <div style={{ display:'flex',flexWrap:'wrap',gap:'5px',marginBottom:'14px' }}>
            {EINRICHTUNGEN_OPT.map(e=><ChipBtn key={e} val={e} active={newEinrichtungen.includes(e)} onToggle={v=>toggleArr(newEinrichtungen,setNewEinrichtungen,v)} color={C.accent}/>)}
          </div>

          <div style={{ display:'flex',gap:'8px' }}>
            <button onClick={submitPlace} style={{ flex:1,background:C.teal,color:'#0D1B2A',border:'none',borderRadius:'12px',padding:'12px',fontSize:'14px',fontWeight:'700',cursor:'pointer' }}>Hinzufügen ✓</button>
            <button onClick={()=>setShowAdd(false)} style={{ flex:1,background:'transparent',color:C.muted,border:`1px solid ${C.border}`,borderRadius:'12px',padding:'12px',fontSize:'14px',cursor:'pointer' }}>Abbrechen</button>
          </div>
        </div>
      )}
      {filtered.map(p=>{ const ratings=placeRatings[p.id]||[],avg=avgR(p.id),shown=expanded===p.id; return (
        <div key={p.id} style={card}>
          <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'8px' }}>
            <div><div style={{ fontSize:'16px',fontWeight:'800' }}>{p.emoji} {p.name}</div><div style={{ fontSize:'11px',color:C.muted }}>📍 {p.region}</div></div>
            <div style={{ textAlign:'right' }}><div style={{ fontSize:'14px',fontWeight:'800',color:C.yellow }}>★ {avg||p.rating}</div>{ratings.length>0&&<div style={{ fontSize:'10px',color:C.muted }}>{ratings.length} Bew.</div>}</div>
          </div>
          <div style={{ fontSize:'13px',color:C.muted,lineHeight:1.5,marginBottom:'10px' }}>{p.note}</div>
          <div style={{ display:'flex',flexWrap:'wrap',gap:'5px',marginBottom:'10px' }}>{p.tags.map(t=><span key={t} style={bdg(C.teal)}>{t}</span>)}</div>
          <div style={{ display:'flex',gap:'8px' }}>
            <button onClick={()=>setRateTarget(p)} style={{ flex:1,background:C.accentSoft,color:C.accent,border:`1px solid ${C.accent}33`,borderRadius:'8px',padding:'7px',fontSize:'12px',fontWeight:'700',cursor:'pointer' }}>⭐ Bewerten</button>
            {ratings.length>0&&<button onClick={()=>setExpanded(shown?null:p.id)} style={{ background:'transparent',color:C.muted,border:`1px solid ${C.border}`,borderRadius:'8px',padding:'7px 12px',fontSize:'12px',cursor:'pointer' }}>💬 {ratings.length} {shown?'▲':'▼'}</button>}
          </div>
          {shown&&ratings.map((r,i)=>(
            <div key={i} style={{ marginTop:'8px',paddingTop:'8px',borderTop:`1px solid ${C.border}` }}>
              <div style={{ display:'flex',gap:'4px',alignItems:'center',marginBottom:'2px' }}><span style={{ fontSize:'11px' }}>{'⭐'.repeat(r.stars)}</span><span style={{ fontSize:'10px',color:C.muted }}>{r.author} · {r.time}</span></div>
              {r.comment&&<div style={{ fontSize:'12px',color:C.muted }}>{r.comment}</div>}
            </div>
          ))}
        </div>
      );})}
      {rateTarget&&(
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',zIndex:999,display:'flex',alignItems:'flex-end',justifyContent:'center' }}>
          <div style={{ background:C.surface,borderRadius:'20px 20px 0 0',width:'100%',maxWidth:'430px',padding:'24px',border:`1px solid ${C.border}` }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px' }}>
              <div style={{ fontSize:'16px',fontWeight:'800' }}>{rateTarget.emoji} {rateTarget.name}</div>
              <span style={{ cursor:'pointer',fontSize:'22px',color:C.muted }} onClick={()=>setRateTarget(null)}>✕</span>
            </div>
            <div style={{ fontSize:'12px',color:C.muted,marginBottom:'8px' }}>Deine Bewertung *</div>
            <StarPicker value={rateStars} onChange={setRateStars}/>
            <textarea style={{ ...inp(),height:'80px',resize:'none' }} placeholder="Kommentar (optional)..." value={rateComment} onChange={e=>setRateComment(e.target.value)} maxLength={200}/>
            <div style={{ display:'flex',gap:'8px' }}>
              <button onClick={submitRating} style={{ flex:1,background:rateStars>0?C.accent:C.border,color:rateStars>0?'#fff':C.muted,border:'none',borderRadius:'12px',padding:'13px',fontSize:'14px',fontWeight:'800',cursor:rateStars>0?'pointer':'not-allowed' }}>Bewertung abgeben</button>
              <button onClick={()=>setRateTarget(null)} style={{ flex:1,background:'transparent',color:C.muted,border:`1px solid ${C.border}`,borderRadius:'12px',padding:'13px',fontSize:'14px',cursor:'pointer' }}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CommunityTab ───────────────────────────────────────────────────────────────
function CommunityTab({ posts, onAddPost, onLikePost, onAddComment, user, dog }) {
  const [postCat, setPostCat] = useState('all');
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [cat, setCat] = useState('tip');
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [showGuestHint, setShowGuestHint] = useState(false);
  const isGuest = user?.isGuest;

  const oCats = [{ key: 'all', label: 'Alle' }, { key: 'tip', label: '💡 Tipps' }, { key: 'question', label: '❓ Fragen' }, { key: 'event', label: '📅 Events' }];
  const filtered = postCat === 'all' ? posts : posts.filter(p => p.cat === postCat);

  const submit = () => {
    if (!title) return;
    onAddPost({ id: Date.now(), author: `${user?.name || 'Du'} & ${dog.name}`, avatar: dog.emoji, cat, title, body, likes: 0, liked: false, time: 'gerade eben', comments: [] });
    setTitle(''); setBody(''); setShowNew(false);
  };

  const submitComment = (postId) => {
    if (!commentText.trim()) return;
    onAddComment(postId, { id: Date.now(), author: user?.name || 'Du', avatar: dog.emoji, text: commentText.trim(), time: 'gerade eben' });
    setCommentText('');
  };

  return (
    <div>
      {showGuestHint && (
        <div style={{ background: `${C.accent}15`, border: `1px solid ${C.accent}44`, borderRadius: '14px', padding: '14px', marginBottom: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '16px', marginBottom: '6px' }}>🔒</div>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Nur für Mitglieder</div>
          <div style={{ fontSize: '12px', color: C.muted, marginBottom: '12px' }}>Kostenlos registrieren um zu posten & zu kommentieren.</div>
          <button onClick={() => setShowGuestHint(false)} style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Verstanden</button>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: '800' }}>Community 💬</div>
          <div style={{ fontSize: '11px', color: C.muted }}>{posts.length} Posts · {posts.reduce((s, p) => s + p.likes, 0)} Likes</div>
        </div>
        <button onClick={() => { if (isGuest) { setShowGuestHint(true); return; } setShowNew(true); }}
          style={{ background: isGuest ? C.surface : C.accent, color: isGuest ? C.muted : '#fff', border: isGuest ? `1px solid ${C.border}` : 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
          {isGuest ? '🔒 Post' : '+ Post'}
        </button>
      </div>
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '14px', paddingBottom: '4px' }}>
        {oCats.map(c => (
          <button key={c.key} onClick={() => setPostCat(c.key)} style={{ background: postCat === c.key ? C.accent : C.surface, color: postCat === c.key ? '#fff' : C.muted, border: `1px solid ${postCat === c.key ? C.accent : C.border}`, borderRadius: '20px', padding: '6px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{c.label}</button>
        ))}
      </div>
      {showNew && !isGuest && (
        <div style={{ ...card, border: `1px solid ${C.accent}44`, marginBottom: '14px' }}>
          <div style={cTitle}>Neuer Post</div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            {[{ k: 'tip', l: '💡 Tipp' }, { k: 'question', l: '❓ Frage' }, { k: 'event', l: '📅 Event' }].map(c => (
              <button key={c.k} onClick={() => setCat(c.k)} style={{ background: cat === c.k ? C.accent : C.surface, color: cat === c.k ? '#fff' : C.muted, border: `1px solid ${cat === c.k ? C.accent : C.border}`, borderRadius: '20px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '700' }}>{c.l}</button>
            ))}
          </div>
          <input style={inp()} placeholder="Titel *" value={title} onChange={e => setTitle(e.target.value)} maxLength={80} />
          <textarea style={{ ...inp(), height: '70px', resize: 'none' }} placeholder="Was möchtest du teilen?" value={body} onChange={e => setBody(e.target.value)} maxLength={300} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={submit} style={{ flex: 1, background: C.accent, color: '#fff', border: 'none', borderRadius: '12px', padding: '11px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Veröffentlichen</button>
            <button onClick={() => setShowNew(false)} style={{ flex: 1, background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '11px', fontSize: '14px', cursor: 'pointer' }}>Abbrechen</button>
          </div>
        </div>
      )}
      {filtered.map(p => {
        const expanded = expandedPost === p.id;
        const commentList = Array.isArray(p.comments) ? p.comments : [];
        return (
          <div key={p.id} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>{p.avatar}</span>
                <div><div style={{ fontSize: '12px', fontWeight: '700' }}>{p.author}</div><div style={{ fontSize: '10px', color: C.muted }}>{p.time}</div></div>
              </div>
              <span style={bdg(p.cat === 'tip' ? C.teal : p.cat === 'event' ? C.accent : C.muted)}>{p.cat === 'tip' ? '💡 Tipp' : p.cat === 'event' ? '📅 Event' : '❓ Frage'}</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>{p.title}</div>
            {p.body && <div style={{ fontSize: '13px', color: C.muted, lineHeight: 1.5, marginBottom: '10px' }}>{p.body}</div>}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button onClick={() => onLikePost(p.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: p.liked ? C.accent : C.muted, fontWeight: '600', padding: 0 }}>{p.liked ? '❤️' : '🤍'} {p.likes}</button>
              <button onClick={() => setExpandedPost(expanded ? null : p.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: C.muted, fontWeight: '600', padding: 0 }}>
                💬 {commentList.length} {expanded ? '▲' : '▼'}
              </button>
            </div>
            {expanded && (
              <div style={{ marginTop: '12px', borderTop: `1px solid ${C.border}`, paddingTop: '12px' }}>
                {commentList.map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>{c.avatar}</span>
                    <div style={{ background: C.bg, borderRadius: '10px', padding: '8px 12px', flex: 1 }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: C.teal, marginBottom: '3px' }}>{c.author} · {c.time}</div>
                      <div style={{ fontSize: '13px', color: C.text, lineHeight: 1.4 }}>{c.text}</div>
                    </div>
                  </div>
                ))}
                {!isGuest ? (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key === 'Enter' && submitComment(p.id)} placeholder="Kommentar schreiben..." maxLength={200} autoComplete="off"
                      style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '10px 14px', color: C.text, fontSize: '14px', outline: 'none' }} />
                    <button onClick={() => submitComment(p.id)} disabled={!commentText.trim()}
                      style={{ background: commentText.trim() ? C.accent : C.border, color: '#fff', border: 'none', borderRadius: '10px', width: '42px', height: '42px', fontSize: '18px', cursor: 'pointer', flexShrink: 0 }}>→</button>
                  </div>
                ) : (
                  <div style={{ background: `${C.accent}12`, border: `1px solid ${C.accent}33`, borderRadius: '10px', padding: '10px 14px', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: C.muted }}>🔒 </span>
                    <span style={{ fontSize: '12px', color: C.accent, fontWeight: '600' }}>Registrieren um zu kommentieren</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── MeinHundTab ────────────────────────────────────────────────────────────────
function MeinHundTab({ dog, onUpdateDog, dogPhoto, onUpdatePhoto, photoRef, appts, onAddAppt, onToggleAppt, meals, onAddMeal, onDeleteMeal, meds, onAddMed, onDeleteMed, weightLog, onAddWeight, aiMsgs, setAiMsgs }) {
  const [sub,setSub]=useState('profil');
  const [editing,setEditing]=useState(false);
  const [edit,setEdit]=useState({...dog});
  const [apptReason,setApptReason]=useState('');
  const [apptVet,setApptVet]=useState('');
  const [apptDate,setApptDate]=useState('');
  const [apptTime,setApptTime]=useState('10:00');
  const [showAddAppt,setShowAddAppt]=useState(false);
  const [mealName,setMealName]=useState('');
  const [mealTime,setMealTime]=useState('');
  const [mealFood,setMealFood]=useState('');
  const [mealAmt,setMealAmt]=useState('');
  const [mealDays,setMealDays]=useState([...WEEKDAYS]);
  const [showAddMeal,setShowAddMeal]=useState(false);
  const [medName,setMedName]=useState('');
  const [medDose,setMedDose]=useState('');
  const [medTime,setMedTime]=useState('');
  const [medDays,setMedDays]=useState(['Mo']);
  const [medNotes,setMedNotes]=useState('');
  const [showAddMed,setShowAddMed]=useState(false);
  const [newW,setNewW]=useState('');
  const [showAddW,setShowAddW]=useState(false);

  const subs=[{key:'profil',label:'Profil'},{key:'termine',label:'Termine'},{key:'futterung',label:'Fütterung'},{key:'gewicht',label:'Gewicht'},{key:'ki',label:'KI-Chat'}];
  const wtTrend=weightLog.length>=2?(weightLog[0].weight-weightLog[1].weight).toFixed(1):null;

  const submitAppt=()=>{ if(!apptReason||!apptDate)return;onAddAppt({id:Date.now(),reason:apptReason,vet:apptVet,date:apptDate,time:apptTime,done:false});setApptReason('');setApptVet('');setApptDate('');setApptTime('10:00');setShowAddAppt(false);};
  const submitMeal=()=>{ if(!mealName||!mealTime)return;onAddMeal({id:Date.now(),name:mealName,time:mealTime,food:mealFood,amount:mealAmt,days:mealDays});setMealName('');setMealTime('');setMealFood('');setMealAmt('');setMealDays([...WEEKDAYS]);setShowAddMeal(false);};
  const submitMed=()=>{ if(!medName)return;onAddMed({id:Date.now(),name:medName,dose:medDose,time:medTime,days:medDays,notes:medNotes});setMedName('');setMedDose('');setMedTime('');setMedDays(['Mo']);setMedNotes('');setShowAddMed(false);};
  const submitW=()=>{ if(!newW)return;onAddWeight({id:Date.now(),date:fmt(todayDate),weight:parseFloat(newW)});setNewW('');setShowAddW(false);};

  return (
    <div>
      <div style={{ fontSize:'20px',fontWeight:'800',marginBottom:'14px' }}>🐕 {dog.name}</div>
      <div style={{ display:'flex',gap:'6px',overflowX:'auto',marginBottom:'16px',paddingBottom:'4px' }}>
        {subs.map(s=>(
          <button key={s.key} onClick={()=>setSub(s.key)} style={{ background:sub===s.key?C.accent:C.surface,color:sub===s.key?'#fff':C.muted,border:`1px solid ${sub===s.key?C.accent:C.border}`,borderRadius:'20px',padding:'7px 14px',fontSize:'12px',fontWeight:'700',cursor:'pointer',whiteSpace:'nowrap',flexShrink:0 }}>{s.label}</button>
        ))}
      </div>

      {sub==='profil'&&(
        <div>
          <div style={card}>
            <div style={{ display:'flex',gap:'16px',alignItems:'center',marginBottom:'14px' }}>
              <div onClick={()=>photoRef.current?.click()} style={{ width:'80px',height:'80px',borderRadius:'50%',background:C.bg,border:`2px dashed ${C.border}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',overflow:'hidden',flexShrink:0 }}>
                {dogPhoto?<img src={dogPhoto} style={{ width:'100%',height:'100%',objectFit:'cover' }} alt="Hund"/>:<div style={{ textAlign:'center' }}><div style={{ fontSize:'28px' }}>{dog.emoji}</div><div style={{ fontSize:'9px',color:C.muted }}>Foto</div></div>}
              </div>
              <div style={{ flex:1 }}>
                {!editing?<><div style={{ fontSize:'22px',fontWeight:'800' }}>{dog.name}</div><div style={{ fontSize:'13px',color:C.muted }}>{dog.breed}</div><div style={{ fontSize:'12px',color:C.muted }}>{dog.age} Jahre · {dog.weight} kg</div></>
                :<><input style={inp({marginBottom:'6px'})} placeholder="Name" value={edit.name} onChange={e=>setEdit(p=>({...p,name:e.target.value}))}/><input style={inp()} placeholder="Rasse" value={edit.breed} onChange={e=>setEdit(p=>({...p,breed:e.target.value}))}/></>}
              </div>
            </div>
            {!editing?<>
              {[['Geburtstag',dog.birthday],['Alter',`${dog.age} Jahre`],['Gewicht',`${dog.weight} kg`],['Chip-Nr.',dog.chip||'–']].map(([l,v])=>(
                <div key={l} style={row}><span style={{ fontSize:'13px',color:C.muted }}>{l}</span><span style={{ fontSize:'13px',fontWeight:'600' }}>{v}</span></div>
              ))}
              <button onClick={()=>{setEdit({...dog});setEditing(true);}} style={{ background:C.surface,color:C.accent,border:`1px solid ${C.accent}44`,borderRadius:'10px',padding:'10px',fontSize:'13px',fontWeight:'700',cursor:'pointer',width:'100%',marginTop:'12px' }}>✏️ Profil bearbeiten</button>
              <button onClick={()=>photoRef.current?.click()} style={{ background:C.surface,color:C.muted,border:`1px solid ${C.border}`,borderRadius:'10px',padding:'10px',fontSize:'13px',fontWeight:'700',cursor:'pointer',width:'100%',marginTop:'8px' }}>📷 Foto ändern</button>
            </>:<>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'10px' }}>
                {[{l:'Alter',k:'age'},{l:'Gewicht kg',k:'weight'},{l:'Geburtstag',k:'birthday'},{l:'Chip-Nr.',k:'chip'}].map(f=>(
                  <div key={f.k}><div style={{ fontSize:'11px',color:C.muted,marginBottom:'4px' }}>{f.l}</div><input style={inp({margin:0,padding:'8px 10px'})} value={edit[f.k]||''} onChange={e=>setEdit(p=>({...p,[f.k]:e.target.value}))}/></div>
                ))}
              </div>
              <div style={{ display:'flex',gap:'8px' }}>
                <button onClick={()=>{onUpdateDog({...edit});setEditing(false);}} style={{ flex:1,background:C.accent,color:'#fff',border:'none',borderRadius:'12px',padding:'11px',fontSize:'14px',fontWeight:'700',cursor:'pointer' }}>Speichern ✓</button>
                <button onClick={()=>setEditing(false)} style={{ flex:1,background:'transparent',color:C.muted,border:`1px solid ${C.border}`,borderRadius:'12px',padding:'11px',fontSize:'14px',cursor:'pointer' }}>Abbrechen</button>
              </div>
            </>}
          </div>
        </div>
      )}

      {sub==='termine'&&(
        <div>
          <button onClick={()=>setShowAddAppt(!showAddAppt)} style={{ background:C.accent,color:'#fff',border:'none',borderRadius:'14px',padding:'13px',fontSize:'14px',fontWeight:'800',cursor:'pointer',width:'100%',marginBottom:'12px' }}>+ Termin erstellen</button>
          {showAddAppt&&(
            <div style={{ ...card,border:`1px solid ${C.accent}44`,marginBottom:'12px' }}>
              <div style={cTitle}>Neuer Termin</div>
              <input style={inp()} placeholder="Grund (z.B. Impfung) *" value={apptReason} onChange={e=>setApptReason(e.target.value)}/>
              <input style={inp()} placeholder="Tierarzt / Ort" value={apptVet} onChange={e=>setApptVet(e.target.value)}/>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px' }}>
                <div><div style={{ fontSize:'11px',color:C.muted,marginBottom:'4px' }}>Datum *</div><input style={inp({margin:0})} placeholder="28.06.2026" value={apptDate} onChange={e=>setApptDate(e.target.value)}/></div>
                <div><div style={{ fontSize:'11px',color:C.muted,marginBottom:'4px' }}>Uhrzeit</div><input style={inp({margin:0})} placeholder="10:00" value={apptTime} onChange={e=>setApptTime(e.target.value)}/></div>
              </div>
              <div style={{ display:'flex',gap:'8px',marginTop:'10px' }}>
                <button onClick={submitAppt} style={{ flex:1,background:C.accent,color:'#fff',border:'none',borderRadius:'12px',padding:'11px',fontSize:'14px',fontWeight:'700',cursor:'pointer' }}>Speichern ✓</button>
                <button onClick={()=>setShowAddAppt(false)} style={{ flex:1,background:'transparent',color:C.muted,border:`1px solid ${C.border}`,borderRadius:'12px',padding:'11px',fontSize:'14px',cursor:'pointer' }}>Abbrechen</button>
              </div>
            </div>
          )}
          <div style={card}>
            <div style={cTitle}>Alle Termine ({appts.length})</div>
            {appts.map(a=>(
              <div key={a.id} style={{ ...row,flexDirection:'column',alignItems:'flex-start',gap:'8px' }}>
                <div style={{ display:'flex',justifyContent:'space-between',width:'100%',alignItems:'center' }}>
                  <div><div style={{ fontSize:'14px',fontWeight:'700' }}>{a.reason}</div><div style={{ fontSize:'11px',color:C.muted }}>📅 {a.date} {a.time} · {a.vet}</div></div>
                  <span style={bdg(a.done?C.muted:C.teal)}>{a.done?'ERLEDIGT':'OFFEN'}</span>
                </div>
                <div style={{ display:'flex',gap:'8px',width:'100%' }}>
                  <button onClick={()=>exportICS(a)} style={{ flex:1,background:`${C.teal}15`,color:C.teal,border:`1px solid ${C.teal}33`,borderRadius:'8px',padding:'7px',fontSize:'12px',fontWeight:'700',cursor:'pointer' }}>📅 In Kalender</button>
                  <button onClick={()=>onToggleAppt(a.id)} style={{ flex:1,background:`${C.muted}15`,color:C.muted,border:`1px solid ${C.border}`,borderRadius:'8px',padding:'7px',fontSize:'12px',cursor:'pointer' }}>{a.done?'Wieder öffnen':'✓ Erledigt'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sub==='futterung'&&(
        <div>
          <div style={card}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px' }}>
              <div style={cTitle}>Mahlzeiten</div>
              <button onClick={()=>setShowAddMeal(!showAddMeal)} style={{ background:C.accent,color:'#fff',border:'none',borderRadius:'8px',padding:'5px 10px',fontSize:'12px',fontWeight:'700',cursor:'pointer' }}>+ Neu</button>
            </div>
            {showAddMeal&&(
              <div style={{ background:C.bg,borderRadius:'12px',padding:'14px',marginBottom:'14px',border:`1px solid ${C.border}` }}>
                <input style={inp()} placeholder="Name *" value={mealName} onChange={e=>setMealName(e.target.value)}/>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px' }}>
                  <input style={inp({margin:0})} placeholder="Uhrzeit *" value={mealTime} onChange={e=>setMealTime(e.target.value)}/>
                  <input style={inp({margin:0})} placeholder="Futter" value={mealFood} onChange={e=>setMealFood(e.target.value)}/>
                </div>
                <input style={inp({marginTop:'8px'})} placeholder="Menge (z.B. 200g)" value={mealAmt} onChange={e=>setMealAmt(e.target.value)}/>
                <div style={{ fontSize:'11px',color:C.muted,marginBottom:'8px' }}>Wochentage:</div>
                <div style={{ display:'flex',gap:'5px',flexWrap:'wrap',marginBottom:'12px' }}>
                  {WEEKDAYS.map(d=>(
                    <button key={d} onClick={()=>setMealDays(p=>p.includes(d)?p.filter(x=>x!==d):[...p,d])} style={{ background:mealDays.includes(d)?C.accent:C.surface,color:mealDays.includes(d)?'#fff':C.muted,border:`1px solid ${mealDays.includes(d)?C.accent:C.border}`,borderRadius:'8px',padding:'5px 9px',fontSize:'12px',cursor:'pointer',fontWeight:'700' }}>{d}</button>
                  ))}
                </div>
                <div style={{ display:'flex',gap:'8px' }}>
                  <button onClick={submitMeal} style={{ flex:1,background:C.accent,color:'#fff',border:'none',borderRadius:'10px',padding:'10px',fontSize:'13px',fontWeight:'700',cursor:'pointer' }}>Speichern</button>
                  <button onClick={()=>setShowAddMeal(false)} style={{ flex:1,background:'transparent',color:C.muted,border:`1px solid ${C.border}`,borderRadius:'10px',padding:'10px',fontSize:'13px',cursor:'pointer' }}>Abbrechen</button>
                </div>
              </div>
            )}
            {meals.map(m=>(
              <div key={m.id} style={{ ...row,flexDirection:'column',alignItems:'flex-start',gap:'6px' }}>
                <div style={{ display:'flex',justifyContent:'space-between',width:'100%' }}>
                  <div><div style={{ fontSize:'14px',fontWeight:'700' }}>{m.name}</div><div style={{ fontSize:'11px',color:C.muted }}>{m.time} · {m.food} · {m.amount}</div></div>
                  <button onClick={()=>onDeleteMeal(m.id)} style={{ background:'transparent',border:'none',color:C.danger,fontSize:'16px',cursor:'pointer',padding:'4px' }}>✕</button>
                </div>
                <div style={{ display:'flex',gap:'4px',flexWrap:'wrap' }}>
                  {WEEKDAYS.map(d=><span key={d} style={{ background:m.days.includes(d)?`${C.teal}22`:C.bg,color:m.days.includes(d)?C.teal:C.muted,borderRadius:'5px',padding:'2px 6px',fontSize:'10px',fontWeight:'700',border:`1px solid ${m.days.includes(d)?C.teal:C.border}` }}>{d}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={card}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px' }}>
              <div style={cTitle}>Medikamente 💊</div>
              <button onClick={()=>setShowAddMed(!showAddMed)} style={{ background:C.danger,color:'#fff',border:'none',borderRadius:'8px',padding:'5px 10px',fontSize:'12px',fontWeight:'700',cursor:'pointer' }}>+ Neu</button>
            </div>
            {showAddMed&&(
              <div style={{ background:C.bg,borderRadius:'12px',padding:'14px',marginBottom:'14px',border:`1px solid ${C.border}` }}>
                <input style={inp()} placeholder="Medikament *" value={medName} onChange={e=>setMedName(e.target.value)}/>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px' }}>
                  <input style={inp({margin:0})} placeholder="Dosis" value={medDose} onChange={e=>setMedDose(e.target.value)}/>
                  <input style={inp({margin:0})} placeholder="Uhrzeit" value={medTime} onChange={e=>setMedTime(e.target.value)}/>
                </div>
                <input style={inp({marginTop:'8px'})} placeholder="Notiz" value={medNotes} onChange={e=>setMedNotes(e.target.value)}/>
                <div style={{ fontSize:'11px',color:C.muted,marginBottom:'8px',marginTop:'4px' }}>Wochentage:</div>
                <div style={{ display:'flex',gap:'5px',flexWrap:'wrap',marginBottom:'12px' }}>
                  {WEEKDAYS.map(d=>(
                    <button key={d} onClick={()=>setMedDays(p=>p.includes(d)?p.filter(x=>x!==d):[...p,d])} style={{ background:medDays.includes(d)?C.danger:C.surface,color:medDays.includes(d)?'#fff':C.muted,border:`1px solid ${medDays.includes(d)?C.danger:C.border}`,borderRadius:'8px',padding:'5px 9px',fontSize:'12px',cursor:'pointer',fontWeight:'700' }}>{d}</button>
                  ))}
                </div>
                <div style={{ display:'flex',gap:'8px' }}>
                  <button onClick={submitMed} style={{ flex:1,background:C.danger,color:'#fff',border:'none',borderRadius:'10px',padding:'10px',fontSize:'13px',fontWeight:'700',cursor:'pointer' }}>Speichern</button>
                  <button onClick={()=>setShowAddMed(false)} style={{ flex:1,background:'transparent',color:C.muted,border:`1px solid ${C.border}`,borderRadius:'10px',padding:'10px',fontSize:'13px',cursor:'pointer' }}>Abbrechen</button>
                </div>
              </div>
            )}
            {meds.length===0?<div style={{ color:C.muted,fontSize:'13px' }}>Noch keine Medikamente</div>
            :meds.map(m=>(
              <div key={m.id} style={{ ...row,flexDirection:'column',alignItems:'flex-start',gap:'6px' }}>
                <div style={{ display:'flex',justifyContent:'space-between',width:'100%' }}>
                  <div><div style={{ fontSize:'14px',fontWeight:'700' }}>💊 {m.name}</div><div style={{ fontSize:'11px',color:C.muted }}>{m.dose} · {m.time}{m.notes&&` · ${m.notes}`}</div></div>
                  <button onClick={()=>onDeleteMed(m.id)} style={{ background:'transparent',border:'none',color:C.danger,fontSize:'16px',cursor:'pointer',padding:'4px' }}>✕</button>
                </div>
                <div style={{ display:'flex',gap:'4px',flexWrap:'wrap' }}>
                  {WEEKDAYS.map(d=><span key={d} style={{ background:m.days.includes(d)?`${C.danger}22`:C.bg,color:m.days.includes(d)?C.danger:C.muted,borderRadius:'5px',padding:'2px 6px',fontSize:'10px',fontWeight:'700',border:`1px solid ${m.days.includes(d)?C.danger:C.border}` }}>{d}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sub==='gewicht'&&(
        <div>
          <div style={card}>
            <div style={cTitle}>Aktuelles Gewicht</div>
            <div style={{ fontSize:'48px',fontWeight:'800',color:C.teal }}>{dog.weight}<span style={{ fontSize:'18px',color:C.muted }}> kg</span></div>
            {wtTrend!==null&&<div style={{ fontSize:'13px',color:parseFloat(wtTrend)>0?C.danger:parseFloat(wtTrend)<0?C.success:C.muted,marginTop:'4px' }}>
              {parseFloat(wtTrend)>0?`▲ +${wtTrend} kg seit letzter Messung`:parseFloat(wtTrend)<0?`▼ ${wtTrend} kg seit letzter Messung`:'→ Gleichgewicht'}
            </div>}
            {!showAddW
              ?<button onClick={()=>setShowAddW(true)} style={{ background:C.teal,color:'#0D1B2A',border:'none',borderRadius:'12px',padding:'11px',fontSize:'14px',fontWeight:'800',cursor:'pointer',width:'100%',marginTop:'14px' }}>+ Gewicht eintragen</button>
              :<div style={{ marginTop:'12px',display:'flex',gap:'8px' }}>
                <input type="number" step="0.1" placeholder="z.B. 28.5" value={newW} onChange={e=>setNewW(e.target.value)} style={{ flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:'10px',padding:'11px 14px',color:C.text,fontSize:'16px',outline:'none' }}/>
                <button onClick={submitW} style={{ background:C.teal,color:'#0D1B2A',border:'none',borderRadius:'10px',padding:'10px 16px',fontSize:'14px',fontWeight:'800',cursor:'pointer',flexShrink:0 }}>✓</button>
              </div>
            }
          </div>
          <div style={card}>
            <div style={cTitle}>Verlauf</div>
            {weightLog.map((w,i)=>(
              <div key={w.id} style={row}>
                <div style={{ fontSize:'14px',fontWeight:'600' }}>{w.date}</div>
                <div style={{ display:'flex',alignItems:'center',gap:'8px' }}>
                  {i>0&&<span style={{ fontSize:'11px',color:w.weight>weightLog[i-1].weight?C.danger:C.success }}>{w.weight>weightLog[i-1].weight?'▲':'▼'}</span>}
                  <div style={{ fontSize:'16px',fontWeight:'800',color:C.teal }}>{w.weight} kg</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sub==='ki'&&<KIChatTab dog={dog} aiMsgs={aiMsgs} setAiMsgs={setAiMsgs}/>}
    </div>
  );
}

// ── Crypto helpers (PBKDF2 – Web Crypto API) ──────────────────────────────────
const randomHex = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n))).map(b => b.toString(16).padStart(2, '0')).join('');

const hashPassword = async (password, saltHex) => {
  const enc = new TextEncoder();
  const saltBytes = new Uint8Array(saltHex.match(/.{2}/g).map(b => parseInt(b, 16)));
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations: 100000 }, key, 256);
  return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
};

const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const checkPasswordStrength = (p) => {
  const checks = [p.length >= 8, /[A-Z]/.test(p), /[a-z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)];
  const score = checks.filter(Boolean).length;
  return { score, checks, label: ['', 'Sehr schwach', 'Schwach', 'Mittel', 'Stark', 'Sehr stark'][score], color: ['', C.danger, C.danger, '#F59E0B', C.success, C.teal][score] };
};

// ── AuthScreen (sicher) ────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('welcome');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [dogName, setDogName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(() => LS.get('registeredUsers', []));
  const [failedAttempts, setFailedAttempts] = useState({});

  const pwStrength = checkPasswordStrength(password);

  const register = async () => {
    setError('');
    if (!name.trim() || !email.trim() || !password) { setError('Bitte alle Pflichtfelder ausfüllen.'); return; }
    if (!validateEmail(email)) { setError('Bitte eine gültige E-Mail-Adresse eingeben.'); return; }
    if (pwStrength.score < 3) { setError('Passwort zu schwach. Mindestens 8 Zeichen, Groß-/Kleinbuchstaben und Zahlen.'); return; }
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) { setError('Diese E-Mail-Adresse ist bereits registriert.'); return; }

    setLoading(true);
    try {
      const salt = randomHex(16);
      const hash = await hashPassword(password, salt);
      const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: hash,
        passwordSalt: salt,
        dogName: dogName.trim() || 'Mein Hund',
        isGuest: false,
        createdAt: new Date().toISOString()
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      LS.set('registeredUsers', updatedUsers);
      onAuth(newUser);
    } catch (e) {
      setError('Fehler beim Verschlüsseln. Bitte erneut versuchen.');
    }
    setLoading(false);
  };

  const login = async () => {
    setError('');
    if (!email.trim() || !password) { setError('Bitte E-Mail und Passwort eingeben.'); return; }
    const emailKey = email.toLowerCase().trim();
    const attempts = failedAttempts[emailKey] || 0;
    if (attempts >= 5) { setError('Zu viele Fehlversuche. Bitte starte die App neu.'); return; }

    const found = users.find(u => u.email === emailKey);
    if (!found) {
      setFailedAttempts(p => ({ ...p, [emailKey]: (p[emailKey] || 0) + 1 }));
      setError(`E-Mail oder Passwort falsch. (${5 - attempts - 1} Versuche übrig)`);
      return;
    }

    setLoading(true);
    try {
      const hash = await hashPassword(password, found.passwordSalt);
      if (hash !== found.passwordHash) {
        setFailedAttempts(p => ({ ...p, [emailKey]: (p[emailKey] || 0) + 1 }));
        setError(`Passwort falsch. (${4 - attempts} Versuche übrig)`);
        setLoading(false); return;
      }
      setFailedAttempts(p => ({ ...p, [emailKey]: 0 }));
      onAuth(found);
    } catch {
      setError('Fehler beim Überprüfen. Bitte erneut versuchen.');
    }
    setLoading(false);
  };

  const btnPrimary = { background: loading ? C.border : C.accent, color: '#fff', border: 'none', borderRadius: '14px', padding: '15px', fontSize: '16px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer', width: '100%', marginBottom: '10px' };
  const btnSecondary = { background: 'transparent', color: C.accent, border: `2px solid ${C.accent}`, borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', width: '100%', marginBottom: '10px' };

  const go = (m) => { setMode(m); setError(''); setPassword(''); setEmail(''); };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', maxWidth: '430px', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '28px', fontFamily: 'system-ui,sans-serif', color: C.text }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ fontSize: '52px', marginBottom: '8px' }}>🐾</div>
        <div style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '2px', color: C.accent, marginBottom: '4px' }}>DOGSTYLE 2.0 🇦🇹</div>
        <div style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }}>
          {mode === 'welcome' ? 'Willkommen!' : mode === 'register' ? 'Konto erstellen' : 'Anmelden'}
        </div>
        <div style={{ fontSize: '13px', color: C.muted, marginTop: '4px' }}>
          {mode === 'welcome' ? 'Wie möchtest du starten?' : mode === 'register' ? 'Kostenlos & sicher' : 'Schön, dich wiederzusehen!'}
        </div>
      </div>

      {mode === 'welcome' && (
        <div>
          <button style={btnPrimary} onClick={() => go('register')}>🐕 Kostenlos registrieren</button>
          <button style={btnSecondary} onClick={() => go('login')}>Bereits registriert? Anmelden</button>
          <button onClick={() => onAuth({ id: 0, name: 'Gast', email: '', isGuest: true, dogName: 'Bello' })}
            style={{ background: 'transparent', color: C.muted, border: 'none', width: '100%', padding: '12px', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}>
            Als Gast fortfahren (eingeschränkter Zugang)
          </button>
          <div style={{ marginTop: '16px', background: `${C.teal}12`, borderRadius: '12px', padding: '14px', border: `1px solid ${C.teal}33` }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: C.teal, marginBottom: '8px' }}>✅ Registrierte Nutzer können:</div>
            {['Im Forum posten & kommentieren', 'Eigenes Hundeprofil anlegen', 'Neue Orte hinzufügen', 'Unbegrenzter KI-Chat'].map(f => (
              <div key={f} style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>• {f}</div>
            ))}
          </div>
        </div>
      )}

      {mode === 'register' && (
        <div>
          {error && <div style={{ background: `${C.danger}18`, color: C.danger, borderRadius: '10px', padding: '10px 14px', marginBottom: '12px', fontSize: '13px', fontWeight: '600' }}>⚠️ {error}</div>}
          <input style={inp()} placeholder="Dein Name *" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
          <input style={inp()} placeholder="E-Mail *" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          <div style={{ position: 'relative', marginBottom: '4px' }}>
            <input style={{ ...inp({ marginBottom: '6px' }), paddingRight: '48px' }} placeholder="Passwort * (min. 8 Zeichen)" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
            <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '11px', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: '16px' }}>{showPw ? '🙈' : '👁️'}</button>
          </div>
          {password.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= pwStrength.score ? pwStrength.color : C.border, transition: 'background 0.2s' }} />
                ))}
              </div>
              <div style={{ fontSize: '11px', color: pwStrength.color, fontWeight: '700' }}>{pwStrength.label}</div>
              <div style={{ fontSize: '11px', color: C.muted, marginTop: '4px' }}>
                {[['≥8 Zeichen', pwStrength.checks[0]], ['Großbuchstabe', pwStrength.checks[1]], ['Kleinbuchstabe', pwStrength.checks[2]], ['Zahl', pwStrength.checks[3]], ['Sonderzeichen', pwStrength.checks[4]]].map(([l, ok]) => (
                  <span key={l} style={{ marginRight: '10px', color: ok ? C.success : C.muted }}>{ok ? '✓' : '○'} {l}</span>
                ))}
              </div>
            </div>
          )}
          <input style={inp()} placeholder="Name deines Hundes" value={dogName} onChange={e => setDogName(e.target.value)} autoComplete="off" />
          <button style={btnPrimary} onClick={register} disabled={loading}>
            {loading ? '🔐 Verschlüssele...' : 'Jetzt registrieren →'}
          </button>
          <div style={{ background: `${C.success}12`, border: `1px solid ${C.success}33`, borderRadius: '10px', padding: '10px 14px', marginBottom: '10px', fontSize: '11px', color: C.muted, lineHeight: 1.6 }}>
            🔐 Dein Passwort wird mit <strong style={{ color: C.text }}>PBKDF2 + SHA-256</strong> (100.000 Iterationen) gehasht und niemals im Klartext gespeichert.
          </div>
          <button onClick={() => go('welcome')} style={{ background: 'transparent', color: C.muted, border: 'none', width: '100%', padding: '10px', fontSize: '13px', cursor: 'pointer' }}>← Zurück</button>
        </div>
      )}

      {mode === 'login' && (
        <div>
          {error && <div style={{ background: `${C.danger}18`, color: C.danger, borderRadius: '10px', padding: '10px 14px', marginBottom: '12px', fontSize: '13px', fontWeight: '600' }}>⚠️ {error}</div>}
          <input style={inp()} placeholder="E-Mail" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          <div style={{ position: 'relative' }}>
            <input style={{ ...inp(), paddingRight: '48px' }} placeholder="Passwort" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" onKeyDown={e => e.key === 'Enter' && login()} />
            <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '11px', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: '16px' }}>{showPw ? '🙈' : '👁️'}</button>
          </div>
          <button style={btnPrimary} onClick={login} disabled={loading}>
            {loading ? '🔐 Prüfe...' : 'Anmelden →'}
          </button>
          <button onClick={() => go('welcome')} style={{ background: 'transparent', color: C.muted, border: 'none', width: '100%', padding: '10px', fontSize: '13px', cursor: 'pointer' }}>← Zurück</button>
        </div>
      )}

      <div style={{ marginTop: '16px', background: `${C.muted}10`, borderRadius: '10px', padding: '12px 14px', fontSize: '11px', color: C.muted, lineHeight: 1.6 }}>
        <strong style={{ color: C.text }}>ℹ️ Transparenz:</strong> Daten werden sicher in deinem Browser gespeichert (localStorage) und bleiben nach Reload erhalten. Für geräteübergreifende Synchronisation → Supabase-Backend.
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [consented, setConsented] = useState(() => LS.get('consented', false));
  const [user, setUser] = useState(() => LS.get('user', null));
  const isGuest = user?.isGuest === true;
  const [activeTab, setActiveTab] = useState('home');
  const [dog, setDog] = useState(() => LS.get('dog', { name:'', breed:'', age:'', weight:'', emoji:'🐕‍🦺', birthday:'', chip:'' }));
  const [dogPhoto, setDogPhoto] = useState(() => LS.get('dogPhoto', null));
  const photoRef = useRef(null);
  const [meals, setMeals] = useState(() => LS.get('meals', []));
  const [mealDone, setMealDone] = useState({});
  const [meds, setMeds] = useState(() => LS.get('meds', []));
  const [appts, setAppts] = useState(() => LS.get('appts', []));
  const [weightLog, setWeightLog] = useState(() => LS.get('weightLog', []));
  const [routes, setRoutes] = useState(() => LS.get('routes', []));
  const [places, setPlaces] = useState(() => LS.get('places', PLACES_DATA));
  const [placeRatings, setPlaceRatings] = useState(() => LS.get('placeRatings', {}));
  const [posts, setPosts] = useState(() => LS.get('posts', POSTS_DATA));
  const [aiMsgs, setAiMsgs] = useState([{role:'assistant',content:`Servus! Ich bin dein KI-Assistent 🐾\n\nLeg zuerst deinen Hund an!\n\n⚕️ Kein Ersatz für den Tierarzt.`}]);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => LS.set('consented', consented), [consented]);
  useEffect(() => { if (user) LS.set('user', user); else LS.del('user'); }, [user]);
  useEffect(() => LS.set('dog', dog), [dog]);
  useEffect(() => { try { LS.set('dogPhoto', dogPhoto); } catch {} }, [dogPhoto]);
  useEffect(() => LS.set('meals', meals), [meals]);
  useEffect(() => LS.set('meds', meds), [meds]);
  useEffect(() => LS.set('appts', appts), [appts]);
  useEffect(() => LS.set('weightLog', weightLog), [weightLog]);
  useEffect(() => LS.set('routes', routes), [routes]);
  useEffect(() => LS.set('places', places), [places]);
  useEffect(() => LS.set('placeRatings', placeRatings), [placeRatings]);
  useEffect(() => LS.set('posts', posts), [posts]);
  useEffect(()=>{ const h=(e)=>{e.preventDefault();setInstallPrompt(e);setShowInstall(true);};window.addEventListener('beforeinstallprompt',h);return()=>window.removeEventListener('beforeinstallprompt',h);},[]);

  if (!consented) return <ConsentScreen onAccept={() => setConsented(true)} />;
  if (!user) return <AuthScreen onAuth={(u) => {
    setUser(u);
    if (u.isGuest) {
      setDog(INITIAL_DOG); setMeals(INITIAL_MEALS); setMeds(INITIAL_MEDS);
      setAppts(INITIAL_APPTS); setWeightLog(INITIAL_WEIGHT);
      setRoutes([
        {id:1,name:'Morgenrunde Prater',duration:30,distance:'2.10',date:fmt(todayDate),time:'07:30'},
        {id:2,name:'Kahlenberg Tour',duration:45,distance:'3.20',date:fmt(new Date(todayDate-86400000)),time:'17:00'},
      ]);
    } else {
      const savedDog = LS.get('dog', null);
      if (!savedDog || !savedDog.breed) {
        setDog({ name: u.dogName || '', breed:'', age:'', weight:'', emoji:'🐕‍🦺', birthday:'', chip:'' });
        setMeals([]); setMeds([]); setAppts([]); setWeightLog([]); setRoutes([]);
      }
      setAiMsgs([{role:'assistant',content:`Servus ${u.name}! 🐾\n\nLeg jetzt deinen Hund an!\n\n⚕️ Kein Ersatz für den Tierarzt.`}]);
    }
  }} />;

  const handlePhoto=(e)=>{ const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=(ev)=>{setDogPhoto(ev.target.result);setDog(d=>({...d,emoji:'📷'}));};r.readAsDataURL(f);};

  const tabs=[{id:'home',label:'Home',icon:'🏠'},{id:'routes',label:'Routen',icon:'🗺️'},{id:'places',label:'Entdecken',icon:'🏊'},{id:'community',label:'Community',icon:'💬'},{id:'meinHund',label:'Mein Hund',icon:'🐕'}];

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif",backgroundColor:C.bg,color:C.text,minHeight:'100vh',maxWidth:'430px',margin:'0 auto',display:'flex',flexDirection:'column' }}>
      <div style={{ background:'linear-gradient(135deg,#1A2A3A 0%,#1E3545 100%)',padding:'16px 20px',borderBottom:`1px solid ${C.border}`,flexShrink:0 }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div>
            <div style={{ display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px' }}>
              <span style={{ fontSize:'10px',fontWeight:'800',letterSpacing:'2px',color:C.accent }}>DOGSTYLE 2.0</span>
              <span style={{ background:'rgba(236,0,0,0.15)',color:'#EC0000',borderRadius:'6px',padding:'2px 7px',fontSize:'9px',fontWeight:'800' }}>🇦🇹 AT</span>
              {isGuest && <span style={{ background:`${C.muted}22`,color:C.muted,borderRadius:'6px',padding:'2px 7px',fontSize:'9px',fontWeight:'800' }}>GAST</span>}
            </div>
            <div style={{ fontSize:'26px',fontWeight:'800',letterSpacing:'-0.5px',lineHeight:1 }}>{dog.name||'Mein Hund'} 🐾</div>
            <div style={{ fontSize:'12px',color:C.muted,marginTop:'3px' }}>{dog.breed||'Rasse noch nicht angegeben'} {dog.weight?`· ${dog.weight} kg`:''}</div>
          </div>
          <div onClick={()=>photoRef.current?.click()} style={{ width:'56px',height:'56px',borderRadius:'50%',overflow:'hidden',border:`2px solid ${C.border}`,cursor:'pointer',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',background:C.bg,fontSize:'36px' }}>
            {dogPhoto?<img src={dogPhoto} style={{ width:'100%',height:'100%',objectFit:'cover' }} alt="Hund"/>:dog.emoji}
          </div>
        </div>
      </div>
      <input ref={photoRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhoto}/>
      <div style={{ flex:1,overflowY:'auto',padding:'16px',paddingBottom:'90px' }}>
        {activeTab==='home'&&<HomeTab dog={dog} meals={meals} mealDone={mealDone} toggleMealDone={(id)=>setMealDone(p=>({...p,[id]:!p[id]}))} appts={appts} meds={meds} routes={routes} showInstall={showInstall} onInstall={async()=>{if(installPrompt){await installPrompt.prompt();setShowInstall(false);}}} onDismissInstall={()=>setShowInstall(false)} onNavigate={(tab)=>setActiveTab(tab)} isGuest={isGuest}/>}
        {activeTab==='routes'&&<RoutesTab routes={routes} onAddRoute={(r)=>setRoutes(p=>[r,...p])}/>}
        {activeTab==='places'&&<PlacesTab places={places} onAddPlace={(p)=>setPlaces(prev=>[p,...prev])} placeRatings={placeRatings} onAddRating={(id,stars,comment)=>setPlaceRatings(p=>({...p,[id]:[{stars,comment,time:'gerade eben',author:'Du'},...(p[id]||[])]}))} isGuest={isGuest}/>}
        {activeTab==='community'&&<CommunityTab posts={posts} onAddPost={(p)=>setPosts(prev=>[p,...prev])} onLikePost={(id)=>setPosts(p=>p.map(post=>post.id===id?{...post,likes:post.liked?post.likes-1:post.likes+1,liked:!post.liked}:post))} onAddComment={(postId,comment)=>setPosts(p=>p.map(post=>post.id===postId?{...post,comments:[...(Array.isArray(post.comments)?post.comments:[]),comment]}:post))} user={user} dog={dog}/>}
        {activeTab==='meinHund'&&<MeinHundTab dog={dog} onUpdateDog={(d)=>setDog(d)} dogPhoto={dogPhoto} onUpdatePhoto={setDogPhoto} photoRef={photoRef} appts={appts} onAddAppt={(a)=>setAppts(p=>[a,...p])} onToggleAppt={(id)=>setAppts(p=>p.map(a=>a.id===id?{...a,done:!a.done}:a))} meals={meals} onAddMeal={(m)=>setMeals(p=>[m,...p])} onDeleteMeal={(id)=>setMeals(p=>p.filter(m=>m.id!==id))} meds={meds} onAddMed={(m)=>setMeds(p=>[m,...p])} onDeleteMed={(id)=>setMeds(p=>p.filter(m=>m.id!==id))} weightLog={weightLog} onAddWeight={(w)=>{setWeightLog(p=>[w,...p]);setDog(d=>({...d,weight:w.weight}));}} aiMsgs={aiMsgs} setAiMsgs={setAiMsgs}/>}
      </div>
      <div style={{ position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:'430px',background:C.surface,borderTop:`1px solid ${C.border}`,display:'flex',padding:'6px 0 12px',zIndex:100 }}>
        {tabs.map(t=>(
          <div key={t.id} onClick={()=>setActiveTab(t.id)} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',cursor:'pointer',padding:'4px 0' }}>
            <span style={{ fontSize:'20px',opacity:activeTab===t.id?1:0.4 }}>{t.icon}</span>
            <span style={{ fontSize:'9px',fontWeight:activeTab===t.id?'800':'500',color:activeTab===t.id?C.accent:C.muted }}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
      }
