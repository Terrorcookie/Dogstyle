import { useState, useRef, useEffect } from "react";

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
  { id:1, name:'Morgenmahlzeit', time:'07:30', food:'Trockenfutter', amount:'200g', days:['Mo','Di','Mi','Do','Fr','Sa','So'] },
  { id:2, name:'Abendmahlzeit', time:'17:00', food:'Nassfutter', amount:'150g', days:['Mo','Di','Mi','Do','Fr','Sa','So'] },
];

const INITIAL_MEDS = [
  { id:1, name:'Zeckenprophylaxe', dose:'1 Tablette', time:'08:00', days:['Mo'], notes:'Monatlich am ersten Montag' },
];

const INITIAL_WEIGHT = [
  { id:1, date:'01.04.2026', weight:27.8 },
  { id:2, date:'01.05.2026', weight:28.2 },
  { id:3, date:'01.06.2026', weight:28.5 },
];

const PLACES = [
  { id:1, cat:'swim', name:'Wörthersee – Hundestrand Krumpendorf', emoji:'🏊', region:'Kärnten', rating:4.9, tags:['Leinen frei','Flacher Einstieg','Parkplatz'], note:'Österreichs schönster Hundestrand!' },
  { id:2, cat:'swim', name:'Neusiedler See – Podersdorf', emoji:'🌊', region:'Burgenland', rating:4.6, tags:['Naturstrand','Ruhig','Weitläufig'], note:'Traumhafter Schilf-Naturstrand.' },
  { id:3, cat:'swim', name:'Attersee – Weyregg', emoji:'💧', region:'Oberösterreich', rating:4.7, tags:['Kristallklar','Schatten','Naturufer'], note:'Klarste Wasser Österreichs!' },
  { id:4, cat:'swim', name:'Wolfgangsee – Hundestrand Strobl', emoji:'🌅', region:'Salzburg', rating:4.5, tags:['Bergpanorama','Flach','Familiär'], note:'Mit Blick auf den Schafberg.' },
  { id:5, cat:'swim', name:'Millstätter See – Hundestrand', emoji:'🏖️', region:'Kärnten', rating:4.7, tags:['Warm','Sauber','Flach'], note:'Traumhaftes Kärntner Wasser, extra Hundezone.' },
  { id:6, cat:'swim', name:'Faaker See – Hundebadewiese', emoji:'🐕', region:'Kärnten', rating:4.5, tags:['Leinen frei','Naturufer','Ruhig'], note:'Wenig Betrieb, tolles Wasser.' },
  { id:7, cat:'swim', name:'Mondsee – Hundestrand Loibichl', emoji:'🌙', region:'Oberösterreich', rating:4.6, tags:['Alpenblick','Flach','Parkplatz'], note:'Wunderschöne Kulisse mit Bergpanorama.' },
  { id:8, cat:'park', name:'Prater Hundezone Wien', emoji:'🌿', region:'Wien', rating:4.7, tags:['Eingezäunt','Groß','Beleuchtung'], note:'Riesige Freilauffläche. Täglich gut besucht.' },
  { id:9, cat:'park', name:'Lainzer Tiergarten', emoji:'🦌', region:'Wien', rating:4.8, tags:['Wildgehege','Weitläufig','Natur'], note:'Ehemaliges Kaiserrevier.' },
  { id:10, cat:'park', name:'Schlosspark Schönbrunn', emoji:'👑', region:'Wien', rating:4.5, tags:['Historisch','Weitläufig','Zentral'], note:'Hunde an der Leine erlaubt.' },
  { id:11, cat:'park', name:'Stadtpark Graz – Hundewiese', emoji:'🌳', region:'Steiermark', rating:4.5, tags:['Eingezäunt','Spielwiese','Wasserquelle'], note:'Eingezäunte Wiese mit Wassernapf.' },
  { id:12, cat:'trail', name:'Kahlenberg Rundweg', emoji:'🥾', region:'Wien / NÖ', rating:4.8, tags:['Aussicht','8 km','Waldboden'], note:'Klassiker! Traumhafter Blick auf Wien.' },
  { id:13, cat:'trail', name:'Wienerwald Wanderweg', emoji:'🌲', region:'Niederösterreich', rating:4.9, tags:['Weitläufig','Bach','Schattig'], note:'Unendliches Wandergebiet vor Wien.' },
  { id:14, cat:'trail', name:'Schneeberg Wanderweg', emoji:'❄️', region:'Niederösterreich', rating:4.8, tags:['Alpin','Aussicht','Anspruchsvoll'], note:'Höchster Berg NÖs. Im Sommer traumhaft!' },
  { id:15, cat:'trail', name:'Leopoldsberg Rundweg', emoji:'🏰', region:'Wien', rating:4.7, tags:['Kurz','Aussicht','Leicht'], note:'3 km, fantastischer Ausblick über Wien.' },
  { id:16, cat:'cafe', name:'Café Schwarzenberg Wien', emoji:'☕', region:'Wien', rating:4.8, tags:['Hunde erlaubt','Hundenapf','Terrasse'], note:'Wiener Kaffeehauskultur mit Hund!' },
  { id:17, cat:'cafe', name:'Heuriger Mayer am Pfarrplatz', emoji:'🍷', region:'Wien', rating:4.7, tags:['Garten','Heuriger','Entspannt'], note:'Traditioneller Wiener Heuriger.' },
  { id:18, cat:'cafe', name:'Berggasthof Rax', emoji:'🍺', region:'Niederösterreich', rating:4.7, tags:['Nach Wanderung','Hunde willkommen','Gemütlich'], note:'Perfekt nach der Rax-Tour!' },
];

const POSTS = [
  { id:1, author:'Steffi & Layla', avatar:'🐩', cat:'tip', title:'Wörthersee Geheimtipp: Früh morgens 🏊', body:'Vor 8 Uhr habt ihr den Hundestrand für euch! Das Wasser ist traumhaft warm.', likes:54, liked:false, time:'vor 2h', comments:11 },
  { id:2, author:'Markus & Rex', avatar:'🐕', cat:'question', title:'Hundefriseur Empfehlung Wien 1020?', body:'Rex braucht dringend eine Sommerschur 😅 Danke für Tipps!', likes:9, liked:false, time:'vor 4h', comments:17 },
  { id:3, author:'Vroni & Balu', avatar:'🐾', cat:'event', title:'📅 Hundetreffen Prater – Sa. 09:00', body:'Wie jeden Samstag beim Lusthaus. Alle Rassen willkommen 🐾', likes:71, liked:false, time:'vor 1 Tag', comments:28 },
  { id:4, author:'Hannes & Rudi', avatar:'🦮', cat:'tip', title:'Pfoten schützen auf Pflastersteinen 🐾', body:'Vaseline auf die Pfoten – schützt perfekt vor heißem Asphalt!', likes:93, liked:false, time:'vor 2 Tagen', comments:35 },
];

// ── UI helpers ─────────────────────────────────────────────────────────────────
const card = { background:C.surface, borderRadius:'16px', padding:'16px', marginBottom:'12px', border:`1px solid ${C.border}` };
const cTitle = { fontSize:'10px', fontWeight:'800', letterSpacing:'1.5px', color:C.muted, textTransform:'uppercase', marginBottom:'12px' };
const row = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}` };
const inp = { background:C.bg, border:`1px solid ${C.border}`, borderRadius:'10px', padding:'10px 14px', color:C.text, fontSize:'14px', width:'100%', outline:'none', boxSizing:'border-box', marginBottom:'10px' };
const bdg = (color) => ({ background:`${color}22`, color, borderRadius:'6px', padding:'3px 8px', fontSize:'10px', fontWeight:'800', whiteSpace:'nowrap' });

// ── ICS Calendar Export ────────────────────────────────────────────────────────
const exportICS = (appt) => {
  try {
    const [d,m,y] = appt.date.split('.');
    const [h,min] = (appt.time||'10:00').split(':');
    const endH = String(Math.min(23, parseInt(h)+1)).padStart(2,'0');
    const start = `${y}${m}${d}T${h}${min}00`;
    const end = `${y}${m}${d}T${endH}${min}00`;
    const now = new Date().toISOString().replace(/[-:.]/g,'').slice(0,15)+'Z';
    const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Dogstyle 2.0//AT',
      'BEGIN:VEVENT',`UID:${Date.now()}@dogstyle.at`,`DTSTAMP:${now}`,
      `DTSTART:${start}`,`DTEND:${end}`,`SUMMARY:🐾 ${appt.reason}`,
      `DESCRIPTION:Tierarzt: ${appt.vet}\\nDogstyle 2.0`,
      'END:VEVENT','END:VCALENDAR'].join('\r\n');
    const blob = new Blob([ics], {type:'text/calendar;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'termin.ics';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  } catch(e) { alert('Kalender-Export nicht verfügbar'); }
};

// ── Shared Modal ──────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.88)', zIndex:999, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
      <div style={{ background:C.surface, borderRadius:'20px 20px 0 0', width:'100%', maxWidth:'430px', maxHeight:'88vh', display:'flex', flexDirection:'column', border:`1px solid ${C.border}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <span style={{ fontSize:'16px', fontWeight:'800' }}>{title}</span>
          <span style={{ cursor:'pointer', fontSize:'22px', color:C.muted }} onClick={onClose}>✕</span>
        </div>
        <div style={{ overflowY:'auto', padding:'16px 20px 32px' }}>{children}</div>
      </div>
    </div>
  );
}

// ── Star Picker ───────────────────────────────────────────────────────────────
function StarPicker({ value, onChange }) {
  return (
    <div style={{ display:'flex', gap:'8px', marginBottom:'14px' }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} onClick={() => onChange(s)} style={{ fontSize:'30px', cursor:'pointer', opacity:s<=value?1:0.2 }}>⭐</span>
      ))}
    </div>
  );
}

// ── Consent Screen ────────────────────────────────────────────────────────────
function ConsentScreen({ onAccept }) {
  const [age, setAge] = useState(false);
  const [priv, setPriv] = useState(false);
  const [terms, setTerms] = useState(false);
  const ok = age && priv && terms;
  return (
    <div style={{ background:C.bg, minHeight:'100vh', maxWidth:'430px', margin:'0 auto', display:'flex', flexDirection:'column', justifyContent:'center', padding:'24px', fontFamily:'system-ui,sans-serif', color:C.text }}>
      <div style={{ textAlign:'center', marginBottom:'28px' }}>
        <div style={{ fontSize:'58px', marginBottom:'10px' }}>🐾</div>
        <div style={{ display:'inline-block', background:`${C.success}22`, color:C.success, borderRadius:'20px', padding:'4px 14px', fontSize:'11px', fontWeight:'800', marginBottom:'10px' }}>100% KOSTENLOS</div>
        <div style={{ fontSize:'10px', fontWeight:'800', letterSpacing:'2px', color:C.accent, marginBottom:'4px' }}>WILLKOMMEN BEI</div>
        <div style={{ fontSize:'32px', fontWeight:'800', letterSpacing:'-1px' }}>Dogstyle 2.0</div>
        <div style={{ fontSize:'13px', color:C.muted, marginTop:'6px' }}>🇦🇹 Die Hunde-App für Österreich</div>
      </div>
      <div style={{ ...card, marginBottom:'14px' }}>
        {[
          {val:age, set:setAge, text:'Ich bin mindestens 16 Jahre alt (DSGVO Art. 8).'},
          {val:priv, set:setPriv, text:'Ich habe die Datenschutzerklärung gelesen und akzeptiere sie.'},
          {val:terms, set:setTerms, text:'Ich akzeptiere die Nutzungsbedingungen inkl. KI-Disclaimer.'},
        ].map((item,i) => (
          <div key={i} onClick={() => item.set(!item.val)} style={{ display:'flex', gap:'12px', alignItems:'flex-start', marginBottom:'14px', cursor:'pointer' }}>
            <div style={{ width:'22px', height:'22px', borderRadius:'6px', border:`2px solid ${item.val?C.accent:C.border}`, background:item.val?C.accent:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'12px', color:'#fff', fontWeight:'bold' }}>{item.val?'✓':''}</div>
            <span style={{ fontSize:'13px', color:C.muted, lineHeight:1.5, marginTop:'1px' }}>{item.text}</span>
          </div>
        ))}
      </div>
      <div style={{ ...card, border:`1px solid ${C.teal}44`, marginBottom:'20px', fontSize:'12px', color:C.muted, lineHeight:1.6 }}>
        ℹ️ Daten bleiben lokal. KI-Chat → <strong style={{ color:C.text }}>Anthropic, Inc.</strong> (USA). Community sichtbar für alle.
      </div>
      <button onClick={() => ok && onAccept()} style={{ background:ok?C.accent:C.border, color:ok?'#fff':C.muted, border:'none', borderRadius:'14px', padding:'16px', fontSize:'16px', fontWeight:'800', cursor:ok?'pointer':'not-allowed', width:'100%' }}>
        Kostenlos starten →
      </button>
    </div>
  );
}

// ── Route Recorder ────────────────────────────────────────────────────────────
function RouteRecorder({ onSave }) {
  const canvasRef = useRef(null);
  const pathRef = useRef([]); const progRef = useRef(0);
  const statusRef = useRef('idle'); const animRef = useRef(null); const timerRef = useRef(null);
  const [status, setStatus] = useState('idle'); const [elapsed, setElapsed] = useState(0); const [name, setName] = useState('');
  const fmtT = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const dist = (elapsed*4.5/3600).toFixed(2);
  const genPath = (w,h) => { const pts=[]; let x=w*0.45,y=h*0.5,dx=2,dy=1; for(let i=0;i<280;i++){dx+=(Math.random()-0.5)*2.2;dy+=(Math.random()-0.5)*1.8;dx*=0.93;dy*=0.93;x+=dx;y+=dy;if(x<14){x=14;dx=Math.abs(dx)*1.3;}if(x>w-14){x=w-14;dx=-Math.abs(dx)*1.3;}if(y<14){y=14;dy=Math.abs(dy)*1.3;}if(y>h-14){y=h-14;dy=-Math.abs(dy)*1.3;}pts.push({x:Math.round(x),y:Math.round(y)});}return pts; };
  const draw = (prog) => { const cv=canvasRef.current;if(!cv)return;const ctx=cv.getContext('2d'),w=cv.width,h=cv.height;ctx.fillStyle='#0A1520';ctx.fillRect(0,0,w,h);ctx.strokeStyle='rgba(42,61,80,0.55)';ctx.lineWidth=0.5;for(let gx=0;gx<w;gx+=24){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,h);ctx.stroke();}for(let gy=0;gy<h;gy+=24){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(w,gy);ctx.stroke();}const pts=pathRef.current;if(!pts.length)return;const end=Math.max(1,Math.floor(prog*pts.length));ctx.beginPath();ctx.strokeStyle='rgba(255,107,53,0.22)';ctx.lineWidth=8;ctx.lineCap='round';ctx.lineJoin='round';ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<end;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.stroke();ctx.beginPath();ctx.strokeStyle='#FF6B35';ctx.lineWidth=3;ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<end;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.stroke();ctx.beginPath();ctx.fillStyle='#4ECDC4';ctx.arc(pts[0].x,pts[0].y,6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#0A1520';ctx.font='bold 8px sans-serif';ctx.textAlign='center';ctx.fillText('S',pts[0].x,pts[0].y+3);const cur=pts[end-1];if(prog<1){ctx.beginPath();ctx.strokeStyle='rgba(255,107,53,0.3)';ctx.lineWidth=2;ctx.arc(cur.x,cur.y,11,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.fillStyle='#FF6B35';ctx.arc(cur.x,cur.y,5,0,Math.PI*2);ctx.fill();}else{ctx.beginPath();ctx.fillStyle=C.danger;ctx.arc(cur.x,cur.y,6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 8px sans-serif';ctx.textAlign='center';ctx.fillText('Z',cur.x,cur.y+3);}};
  useEffect(() => { const cv=canvasRef.current;if(!cv)return;setTimeout(()=>{cv.width=cv.offsetWidth||340;cv.height=200;draw(0);},80);return()=>{clearInterval(animRef.current);clearInterval(timerRef.current);}; },[]);
  const start = () => { const cv=canvasRef.current;cv.width=cv.offsetWidth||340;cv.height=200;pathRef.current=genPath(cv.width,cv.height);progRef.current=0;statusRef.current='recording';setStatus('recording');setElapsed(0);draw(0);animRef.current=setInterval(()=>{if(statusRef.current!=='recording')return;progRef.current=Math.min(1,progRef.current+0.0045);draw(progRef.current);if(progRef.current>=1)clearInterval(animRef.current);},50);timerRef.current=setInterval(()=>{if(statusRef.current==='recording')setElapsed(e=>e+1);},1000); };
  const stop = () => { clearInterval(animRef.current);clearInterval(timerRef.current);statusRef.current='done';setStatus('done');draw(progRef.current); };
  const save = () => { onSave({id:Date.now(),name:name||'Meine Route',duration:elapsed,distance:dist,date:fmt(todayDate),time:new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})});progRef.current=0;statusRef.current='idle';setStatus('idle');setElapsed(0);setName('');setTimeout(()=>{const cv=canvasRef.current;if(cv){cv.width=cv.offsetWidth||340;cv.height=200;draw(0);}},50); };
  const discard = () => { progRef.current=0;statusRef.current='idle';setStatus('idle');setElapsed(0);setTimeout(()=>{const cv=canvasRef.current;if(cv){cv.width=cv.offsetWidth||340;cv.height=200;draw(0);}},50); };
  return (
    <div style={{ ...card, padding:0, overflow:'hidden' }}>
      <canvas ref={canvasRef} style={{ width:'100%', height:'200px', display:'block' }} />
      <div style={{ padding:'14px 16px' }}>
        {status==='idle'&&<button onClick={start} style={{ background:C.accent, color:'#fff', border:'none', borderRadius:'12px', padding:'13px', fontSize:'15px', fontWeight:'800', cursor:'pointer', width:'100%' }}>▶ Route aufzeichnen</button>}
        {status==='recording'&&<><div style={{ display:'flex', justifyContent:'space-around', marginBottom:'12px' }}><div style={{ textAlign:'center' }}><div style={{ fontSize:'26px', fontWeight:'800', color:C.teal }}>{fmtT(elapsed)}</div><div style={{ fontSize:'10px', color:C.muted }}>Zeit</div></div><div style={{ textAlign:'center' }}><div style={{ fontSize:'26px', fontWeight:'800', color:C.accent }}>{dist}<span style={{ fontSize:'12px', color:C.muted }}> km</span></div><div style={{ fontSize:'10px', color:C.muted }}>Distanz</div></div><div style={{ textAlign:'center' }}><div style={{ fontSize:'20px' }}>🔴</div><div style={{ fontSize:'10px', color:C.danger, fontWeight:'800' }}>LIVE</div></div></div><button onClick={stop} style={{ background:C.danger, color:'#fff', border:'none', borderRadius:'12px', padding:'13px', fontSize:'15px', fontWeight:'800', cursor:'pointer', width:'100%' }}>⏹ Stoppen</button></>}
        {status==='done'&&<><div style={{ display:'flex', justifyContent:'space-around', marginBottom:'12px' }}><div style={{ textAlign:'center' }}><div style={{ fontSize:'22px', fontWeight:'800', color:C.teal }}>{fmtT(elapsed)}</div><div style={{ fontSize:'10px', color:C.muted }}>Zeit</div></div><div style={{ textAlign:'center' }}><div style={{ fontSize:'22px', fontWeight:'800', color:C.accent }}>{dist} km</div><div style={{ fontSize:'10px', color:C.muted }}>Distanz</div></div><div style={{ textAlign:'center' }}><div style={{ fontSize:'22px', fontWeight:'800', color:C.success }}>✓</div><div style={{ fontSize:'10px', color:C.muted }}>Fertig</div></div></div><input style={inp} placeholder="Routenname (z.B. Kahlenberg)" value={name} onChange={e=>setName(e.target.value)} /><div style={{ display:'flex', gap:'8px' }}><button onClick={save} style={{ flex:1, background:C.accent, color:'#fff', border:'none', borderRadius:'12px', padding:'12px', fontSize:'14px', fontWeight:'700', cursor:'pointer' }}>💾 Speichern</button><button onClick={discard} style={{ flex:1, background:'transparent', color:C.muted, border:`1px solid ${C.border}`, borderRadius:'12px', padding:'12px', fontSize:'14px', cursor:'pointer' }}>Verwerfen</button></div></>}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [consented, setConsented] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [dogSubTab, setDogSubTab] = useState('profil');

  // Dog
  const [dog, setDog] = useState(INITIAL_DOG);
  const [dogPhoto, setDogPhoto] = useState(null);
  const [editingDog, setEditingDog] = useState(false);
  const [dogEdit, setDogEdit] = useState({...INITIAL_DOG});
  const photoRef = useRef(null);

  // Appointments
  const [appts, setAppts] = useState(INITIAL_APPTS);
  const [showAddAppt, setShowAddAppt] = useState(false);
  const [newAppt, setNewAppt] = useState({reason:'',vet:'',date:'',time:'10:00'});

  // Meals & Meds
  const [meals, setMeals] = useState(INITIAL_MEALS);
  const [mealDone, setMealDone] = useState({});
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({name:'',time:'',food:'',amount:'',days:[...WEEKDAYS]});
  const [meds, setMeds] = useState(INITIAL_MEDS);
  const [showAddMed, setShowAddMed] = useState(false);
  const [newMed, setNewMed] = useState({name:'',dose:'',time:'',days:['Mo'],notes:''});

  // Weight
  const [weightLog, setWeightLog] = useState(INITIAL_WEIGHT);
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  // Places
  const [places, setPlaces] = useState(PLACES);
  const [placeRatings, setPlaceRatings] = useState({});
  const [rateTarget, setRateTarget] = useState(null);
  const [rateStars, setRateStars] = useState(0);
  const [rateComment, setRateComment] = useState('');
  const [expandedPlace, setExpandedPlace] = useState(null);
  const [placeCat, setPlaceCat] = useState('all');
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [newPlace, setNewPlace] = useState({name:'',note:'',cat:'park'});

  // Routes
  const [routes, setRoutes] = useState([
    {id:1,name:'Morgenrunde Prater',duration:30,distance:'2.10',date:fmt(todayDate),time:'07:30'},
    {id:2,name:'Kahlenberg Tour',duration:45,distance:'3.20',date:fmt(new Date(todayDate-86400000)),time:'17:00'},
  ]);

  // Community
  const [posts, setPosts] = useState(POSTS);
  const [postCat, setPostCat] = useState('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({title:'',body:'',cat:'tip'});

  // AI
  const [aiMsgs, setAiMsgs] = useState([{role:'assistant',content:`Servus! Ich bin dein KI-Assistent für ${INITIAL_DOG.name} 🐾\n\nStell mir Fragen zu Gesundheit, Ernährung oder Training!\n\n⚕️ Kein Ersatz für den Tierarzt.`}]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoad, setAiLoad] = useState(false);
  const chatEnd = useRef(null);
  useEffect(() => { chatEnd.current?.scrollIntoView({behavior:'smooth'}); }, [aiMsgs]);

  // PWA install
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  useEffect(() => {
    const h = (e) => { e.preventDefault(); setInstallPrompt(e); setShowInstall(true); };
    window.addEventListener('beforeinstallprompt', h);
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);

  if (!consented) return <ConsentScreen onAccept={() => setConsented(true)} />;

  // Helpers
  const todayMeals = meals.filter(m => m.days.includes(todayDay));
  const todayRoutes = routes.filter(r => r.date===fmt(todayDate));
  const totalMin = todayRoutes.reduce((s,r)=>s+(r.duration||0),0);
  const upcomingAppt = appts.find(a => !a.done);
  const weightTrend = weightLog.length>=2 ? (weightLog[0].weight-weightLog[1].weight).toFixed(1) : null;

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setDogPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const saveDog = () => { setDog({...dogEdit}); setEditingDog(false); };

  const toggleMealDone = (id) => setMealDone(p => ({...p, [id]:!p[id]}));
  const fedCount = todayMeals.filter(m => mealDone[m.id]).length;

  const addAppt = () => {
    if (!newAppt.reason || !newAppt.date) return;
    setAppts(p => [{id:Date.now(),...newAppt,done:false}, ...p]);
    setNewAppt({reason:'',vet:'',date:'',time:'10:00'}); setShowAddAppt(false);
  };

  const addMeal = () => {
    if (!newMeal.name || !newMeal.time) return;
    setMeals(p => [{id:Date.now(),...newMeal}, ...p]);
    setNewMeal({name:'',time:'',food:'',amount:'',days:[...WEEKDAYS]}); setShowAddMeal(false);
  };

  const addMed = () => {
    if (!newMed.name) return;
    setMeds(p => [{id:Date.now(),...newMed}, ...p]);
    setNewMed({name:'',dose:'',time:'',days:['Mo'],notes:''}); setShowAddMed(false);
  };

  const addWeight = () => {
    if (!newWeight) return;
    const entry = {id:Date.now(), date:fmt(todayDate), weight:parseFloat(newWeight)};
    setWeightLog(p => [entry, ...p]);
    setDog(d => ({...d, weight:parseFloat(newWeight)}));
    setNewWeight(''); setShowAddWeight(false);
  };

  const likePost = (id) => setPosts(p => p.map(post => post.id===id ? {...post, likes:post.liked?post.likes-1:post.likes+1, liked:!post.liked} : post));

  const submitPost = () => {
    if (!newPost.title) return;
    setPosts(p => [{id:Date.now(), author:`Du & ${dog.name}`, avatar:dog.emoji, ...newPost, likes:0, liked:false, time:'gerade eben', comments:0}, ...p]);
    setNewPost({title:'',body:'',cat:'tip'}); setShowNewPost(false);
  };

  const submitRating = () => {
    if (!rateStars || !rateTarget) return;
    setPlaceRatings(p => ({...p, [rateTarget.id]:[{stars:rateStars, comment:rateComment, time:'gerade eben', author:'Du'}, ...(p[rateTarget.id]||[])]}));
    setRateTarget(null); setRateStars(0); setRateComment('');
  };

  const avgRating = (id) => {
    const r = placeRatings[id]; if (!r?.length) return null;
    return (r.reduce((s,x)=>s+x.stars,0)/r.length).toFixed(1);
  };

  const sendAI = async () => {
    if (!aiInput.trim() || aiLoad) return;
    const msg = aiInput.replace(/[<>]/g,'').trim().slice(0,500);
    setAiInput('');
    const updated = [...aiMsgs, {role:'user',content:msg}];
    setAiMsgs(updated); setAiLoad(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({model:'claude-sonnet-4-6', max_tokens:1000, system:`Hundeassistent für Dogstyle2.0 (Österreich). Hund: ${dog.name}, ${dog.breed}, ${dog.age} J., ${dog.weight}kg. Antworte auf Österreichisch-Deutsch (gerne "Servus"), kurz, freundlich. Bei Gesundheitsfragen IMMER Tierarzt empfehlen.`, messages:updated.slice(-12).map(m=>({role:m.role,content:m.content}))})});
      const data = await res.json();
      setAiMsgs(p => [...p, {role:'assistant', content:data.content?.[0]?.text||'Bitte erneut versuchen.'}]);
    } catch { setAiMsgs(p => [...p, {role:'assistant', content:'⚠️ Verbindungsfehler. Bitte erneut versuchen.'}]); }
    setAiLoad(false);
  };

  const pCats = [{key:'all',emoji:'🗺️',label:'Alle'},{key:'swim',emoji:'🏊',label:'Schwimmen'},{key:'park',emoji:'🌿',label:'Parks'},{key:'trail',emoji:'🥾',label:'Trails'},{key:'cafe',emoji:'☕',label:'Cafés'}];
  const filtPlaces = placeCat==='all' ? places : places.filter(p=>p.cat===placeCat);
  const oCats = [{key:'all',label:'Alle'},{key:'tip',label:'💡 Tipps'},{key:'question',label:'❓ Fragen'},{key:'event',label:'📅 Events'}];
  const filtPosts = postCat==='all' ? posts : posts.filter(p=>p.cat===postCat);
  const dogSubs = [{key:'profil',label:'Profil'},{key:'termine',label:'Termine'},{key:'futterung',label:'Fütterung'},{key:'gewicht',label:'Gewicht'},{key:'ki',label:'KI-Chat'}];

  // ── TAB: HOME ──
  const Home = () => (
    <div>
      {showInstall && (
        <div style={{ background:`${C.teal}15`, border:`1px solid ${C.teal}44`, borderRadius:'14px', padding:'12px 14px', marginBottom:'12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div><div style={{ fontSize:'13px', fontWeight:'700', color:C.teal }}>📱 App installieren</div><div style={{ fontSize:'11px', color:C.muted }}>Zum Homescreen hinzufügen</div></div>
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={async()=>{if(installPrompt){await installPrompt.prompt();setShowInstall(false);}}} style={{ background:C.teal, color:'#0D1B2A', border:'none', borderRadius:'8px', padding:'6px 12px', fontSize:'12px', fontWeight:'800', cursor:'pointer' }}>Installieren</button>
            <button onClick={()=>setShowInstall(false)} style={{ background:'transparent', color:C.muted, border:'none', fontSize:'18px', cursor:'pointer' }}>✕</button>
          </div>
        </div>
      )}
      <div style={{ fontSize:'20px', fontWeight:'800', marginBottom:'16px' }}>Heute 📅</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginBottom:'12px' }}>
        {[{val:`${totalMin}m`,label:'Gassi',color:C.teal},{val:`${fedCount}/${todayMeals.length}`,label:'Mahlzeiten',color:C.accent},{val:dog.weight+'kg',label:'Gewicht',color:C.yellow}].map(s=>(
          <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'14px', padding:'14px 8px', textAlign:'center' }}>
            <div style={{ fontSize:'20px', fontWeight:'800', color:s.color, lineHeight:1, marginBottom:'4px' }}>{s.val}</div>
            <div style={{ fontSize:'10px', color:C.muted, fontWeight:'600' }}>{s.label}</div>
          </div>
        ))}
      </div>
      {upcomingAppt && (
        <div style={{ ...card, borderLeft:`3px solid ${C.teal}`, cursor:'pointer' }} onClick={()=>{setActiveTab('meinHund');setDogSubTab('termine');}}>
          <div style={cTitle}>Nächster Termin</div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div><div style={{ fontSize:'15px', fontWeight:'700' }}>{upcomingAppt.reason}</div><div style={{ fontSize:'12px', color:C.muted }}>📅 {upcomingAppt.date} {upcomingAppt.time} · {upcomingAppt.vet}</div></div>
            <span style={bdg(C.teal)}>BALD</span>
          </div>
        </div>
      )}
      <div style={card}>
        <div style={cTitle}>Fütterung heute – {todayDay}</div>
        {todayMeals.length === 0 ? <div style={{ color:C.muted, fontSize:'13px' }}>Keine Mahlzeiten für heute geplant</div>
        : todayMeals.map(m=>(
          <div key={m.id} style={{ ...row, cursor:'pointer' }} onClick={()=>toggleMealDone(m.id)}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'22px', height:'22px', borderRadius:'50%', background:mealDone[m.id]?C.accent:'transparent', border:`2px solid ${mealDone[m.id]?C.accent:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'11px', color:'#fff', fontWeight:'bold' }}>{mealDone[m.id]?'✓':''}</div>
              <div><div style={{ fontSize:'14px', fontWeight:'600', textDecoration:mealDone[m.id]?'line-through':'none', color:mealDone[m.id]?C.muted:C.text }}>{m.name}</div><div style={{ fontSize:'11px', color:C.muted }}>{m.time} · {m.food} · {m.amount}</div></div>
            </div>
          </div>
        ))}
      </div>
      {meds.filter(med=>med.days.includes(todayDay)).length>0&&(
        <div style={{ ...card, borderLeft:`3px solid ${C.danger}` }}>
          <div style={cTitle}>Medikamente heute</div>
          {meds.filter(med=>med.days.includes(todayDay)).map(med=>(
            <div key={med.id} style={{ fontSize:'13px', color:C.text, paddingBottom:'6px' }}>
              💊 <strong>{med.name}</strong> – {med.dose} um {med.time}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── TAB: ROUTEN ──
  const RoutesTab = () => (
    <div>
      <div style={{ fontSize:'20px', fontWeight:'800', marginBottom:'16px' }}>Routen 🗺️</div>
      <RouteRecorder onSave={(r)=>setRoutes(p=>[r,...p])} />
      <div style={card}>
        <div style={cTitle}>Gespeicherte Routen ({routes.length})</div>
        {routes.map(r=>(
          <div key={r.id} style={row}>
            <div><div style={{ fontSize:'14px', fontWeight:'700' }}>{r.name}</div><div style={{ fontSize:'11px', color:C.muted }}>{r.date} · {r.time}</div></div>
            <div style={{ textAlign:'right' }}><div style={{ fontSize:'13px', fontWeight:'800', color:C.teal }}>{r.duration} min</div><div style={{ fontSize:'11px', color:C.muted }}>{r.distance} km</div></div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── TAB: ENTDECKEN ──
  const PlacesTab = () => (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
        <div style={{ fontSize:'20px', fontWeight:'800' }}>Entdecken 🏊</div>
        <button onClick={()=>setShowAddPlace(true)} style={{ background:C.teal, color:'#0D1B2A', border:'none', borderRadius:'10px', padding:'7px 12px', fontSize:'12px', fontWeight:'800', cursor:'pointer' }}>+ Ort</button>
      </div>
      <div style={{ display:'flex', gap:'6px', overflowX:'auto', marginBottom:'14px', paddingBottom:'4px' }}>
        {pCats.map(c=>(
          <button key={c.key} onClick={()=>setPlaceCat(c.key)} style={{ background:placeCat===c.key?C.teal:C.surface, color:placeCat===c.key?'#0D1B2A':C.muted, border:`1px solid ${placeCat===c.key?C.teal:C.border}`, borderRadius:'20px', padding:'6px 12px', fontSize:'12px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>
      {showAddPlace&&(
        <div style={{ ...card, border:`1px solid ${C.teal}44`, marginBottom:'14px' }}>
          <div style={cTitle}>Ort hinzufügen</div>
          <div style={{ display:'flex', gap:'6px', marginBottom:'10px', flexWrap:'wrap' }}>
            {[{k:'swim',l:'🏊'},{k:'park',l:'🌿'},{k:'trail',l:'🥾'},{k:'cafe',l:'☕'}].map(c=>(
              <button key={c.k} onClick={()=>setNewPlace(p=>({...p,cat:c.k}))} style={{ background:newPlace.cat===c.k?C.teal:C.surface, color:newPlace.cat===c.k?'#0D1B2A':C.muted, border:`1px solid ${newPlace.cat===c.k?C.teal:C.border}`, borderRadius:'20px', padding:'5px 12px', fontSize:'13px', cursor:'pointer', fontWeight:'700' }}>{c.l}</button>
            ))}
          </div>
          <input style={inp} placeholder="Name des Ortes *" value={newPlace.name} onChange={e=>setNewPlace(p=>({...p,name:e.target.value}))} />
          <input style={inp} placeholder="Tipps & Beschreibung" value={newPlace.note} onChange={e=>setNewPlace(p=>({...p,note:e.target.value}))} />
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={()=>{if(!newPlace.name)return;const emo={swim:'🏊',park:'🌿',trail:'🥾',cafe:'☕'};setPlaces(p=>[{id:Date.now(),cat:newPlace.cat,name:newPlace.name,emoji:emo[newPlace.cat]||'📍',region:'Österreich',rating:0,tags:['Neu'],note:newPlace.note||'Von der Community'}, ...p]);setNewPlace({name:'',note:'',cat:'park'});setShowAddPlace(false);}} style={{ flex:1, background:C.teal, color:'#0D1B2A', border:'none', borderRadius:'12px', padding:'12px', fontSize:'14px', fontWeight:'700', cursor:'pointer' }}>Hinzufügen ✓</button>
            <button onClick={()=>setShowAddPlace(false)} style={{ flex:1, background:'transparent', color:C.muted, border:`1px solid ${C.border}`, borderRadius:'12px', padding:'12px', fontSize:'14px', cursor:'pointer' }}>Abbrechen</button>
          </div>
        </div>
      )}
      {filtPlaces.map(p=>{
        const ratings = placeRatings[p.id]||[]; const avg = avgRating(p.id); const shown = expandedPlace===p.id;
        return (
          <div key={p.id} style={card}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
              <div><div style={{ fontSize:'16px', fontWeight:'800' }}>{p.emoji} {p.name}</div><div style={{ fontSize:'11px', color:C.muted }}>📍 {p.region}</div></div>
              <div style={{ textAlign:'right' }}><div style={{ fontSize:'14px', fontWeight:'800', color:C.yellow }}>★ {avg||p.rating}</div>{ratings.length>0&&<div style={{ fontSize:'10px', color:C.muted }}>{ratings.length} Bew.</div>}</div>
            </div>
            <div style={{ fontSize:'13px', color:C.muted, lineHeight:1.5, marginBottom:'10px' }}>{p.note}</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'5px', marginBottom:'10px' }}>{p.tags.map(t=><span key={t} style={bdg(C.teal)}>{t}</span>)}</div>
            <div style={{ display:'flex', gap:'8px' }}>
              <button onClick={()=>setRateTarget(p)} style={{ flex:1, background:C.accentSoft, color:C.accent, border:`1px solid ${C.accent}33`, borderRadius:'8px', padding:'7px', fontSize:'12px', fontWeight:'700', cursor:'pointer' }}>⭐ Bewerten</button>
              {ratings.length>0&&<button onClick={()=>setExpandedPlace(shown?null:p.id)} style={{ background:'transparent', color:C.muted, border:`1px solid ${C.border}`, borderRadius:'8px', padding:'7px 12px', fontSize:'12px', cursor:'pointer' }}>💬 {ratings.length} {shown?'▲':'▼'}</button>}
            </div>
            {shown&&ratings.map((r,i)=>(
              <div key={i} style={{ marginTop:'8px', paddingTop:'8px', borderTop:`1px solid ${C.border}` }}>
                <div style={{ display:'flex', gap:'4px', alignItems:'center', marginBottom:'2px' }}><span style={{ fontSize:'11px' }}>{'⭐'.repeat(r.stars)}</span><span style={{ fontSize:'10px', color:C.muted }}>{r.author} · {r.time}</span></div>
                {r.comment&&<div style={{ fontSize:'12px', color:C.muted }}>{r.comment}</div>}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );

  // ── TAB: COMMUNITY ──
  const CommunityTab = () => (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
        <div><div style={{ fontSize:'20px', fontWeight:'800' }}>Community 💬</div><div style={{ fontSize:'11px', color:C.muted }}>{posts.length} Posts · {posts.reduce((s,p)=>s+p.likes,0)} Likes</div></div>
        <button onClick={()=>setShowNewPost(true)} style={{ background:C.accent, color:'#fff', border:'none', borderRadius:'10px', padding:'8px 14px', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>+ Post</button>
      </div>
      <div style={{ display:'flex', gap:'6px', overflowX:'auto', marginBottom:'14px', paddingBottom:'4px' }}>
        {oCats.map(c=>(
          <button key={c.key} onClick={()=>setPostCat(c.key)} style={{ background:postCat===c.key?C.accent:C.surface, color:postCat===c.key?'#fff':C.muted, border:`1px solid ${postCat===c.key?C.accent:C.border}`, borderRadius:'20px', padding:'6px 12px', fontSize:'12px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>{c.label}</button>
        ))}
      </div>
      {showNewPost&&(
        <div style={{ ...card, border:`1px solid ${C.accent}44`, marginBottom:'14px' }}>
          <div style={cTitle}>Neuer Post</div>
          <div style={{ display:'flex', gap:'6px', marginBottom:'10px' }}>
            {[{k:'tip',l:'💡 Tipp'},{k:'question',l:'❓ Frage'},{k:'event',l:'📅 Event'}].map(c=>(
              <button key={c.k} onClick={()=>setNewPost(p=>({...p,cat:c.k}))} style={{ background:newPost.cat===c.k?C.accent:C.surface, color:newPost.cat===c.k?'#fff':C.muted, border:`1px solid ${newPost.cat===c.k?C.accent:C.border}`, borderRadius:'20px', padding:'5px 12px', fontSize:'12px', cursor:'pointer', fontWeight:'700' }}>{c.l}</button>
            ))}
          </div>
          <input style={inp} placeholder="Titel *" value={newPost.title} onChange={e=>setNewPost(p=>({...p,title:e.target.value}))} maxLength={80}/>
          <textarea style={{ ...inp, height:'70px', resize:'none' }} placeholder="Was möchtest du teilen?" value={newPost.body} onChange={e=>setNewPost(p=>({...p,body:e.target.value}))} maxLength={300}/>
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={submitPost} style={{ flex:1, background:C.accent, color:'#fff', border:'none', borderRadius:'12px', padding:'11px', fontSize:'14px', fontWeight:'700', cursor:'pointer' }}>Veröffentlichen</button>
            <button onClick={()=>setShowNewPost(false)} style={{ flex:1, background:'transparent', color:C.muted, border:`1px solid ${C.border}`, borderRadius:'12px', padding:'11px', fontSize:'14px', cursor:'pointer' }}>Abbrechen</button>
          </div>
        </div>
      )}
      {filtPosts.map(p=>(
        <div key={p.id} style={card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <span style={{ fontSize:'20px' }}>{p.avatar}</span>
              <div><div style={{ fontSize:'12px', fontWeight:'700' }}>{p.author}</div><div style={{ fontSize:'10px', color:C.muted }}>{p.time}</div></div>
            </div>
            <span style={bdg(p.cat==='tip'?C.teal:p.cat==='event'?C.accent:C.muted)}>{p.cat==='tip'?'💡 Tipp':p.cat==='event'?'📅 Event':'❓ Frage'}</span>
          </div>
          <div style={{ fontSize:'14px', fontWeight:'700', marginBottom:'6px' }}>{p.title}</div>
          {p.body&&<div style={{ fontSize:'13px', color:C.muted, lineHeight:1.5, marginBottom:'10px' }}>{p.body}</div>}
          <div style={{ display:'flex', gap:'16px' }}>
            <button onClick={()=>likePost(p.id)} style={{ background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', fontSize:'13px', color:p.liked?C.accent:C.muted, fontWeight:'600', padding:0 }}>{p.liked?'❤️':'🤍'} {p.likes}</button>
            <span style={{ fontSize:'13px', color:C.muted }}>💬 {p.comments}</span>
          </div>
        </div>
      ))}
    </div>
  );

  // ── TAB: MEIN HUND ──
  const MeinHundTab = () => (
    <div>
      <div style={{ fontSize:'20px', fontWeight:'800', marginBottom:'14px' }}>🐕 {dog.name}</div>
      <div style={{ display:'flex', gap:'6px', overflowX:'auto', marginBottom:'16px', paddingBottom:'4px' }}>
        {dogSubs.map(s=>(
          <button key={s.key} onClick={()=>setDogSubTab(s.key)} style={{ background:dogSubTab===s.key?C.accent:C.surface, color:dogSubTab===s.key?'#fff':C.muted, border:`1px solid ${dogSubTab===s.key?C.accent:C.border}`, borderRadius:'20px', padding:'7px 14px', fontSize:'12px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>{s.label}</button>
        ))}
      </div>

      {/* PROFIL */}
      {dogSubTab==='profil'&&(
        <div>
          <div style={card}>
            <input ref={photoRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhoto}/>
            <div style={{ display:'flex', gap:'16px', alignItems:'center', marginBottom:'14px' }}>
              <div onClick={()=>photoRef.current?.click()} style={{ width:'80px', height:'80px', borderRadius:'50%', background:C.bg, border:`2px dashed ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', overflow:'hidden', flexShrink:0 }}>
                {dogPhoto ? <img src={dogPhoto} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="Hund"/> : <div style={{ textAlign:'center' }}><div style={{ fontSize:'28px' }}>{dog.emoji}</div><div style={{ fontSize:'9px', color:C.muted, marginTop:'2px' }}>Foto</div></div>}
              </div>
              <div style={{ flex:1 }}>
                {!editingDog ? <>
                  <div style={{ fontSize:'22px', fontWeight:'800' }}>{dog.name}</div>
                  <div style={{ fontSize:'13px', color:C.muted }}>{dog.breed}</div>
                  <div style={{ fontSize:'12px', color:C.muted }}>{dog.age} Jahre · {dog.weight} kg</div>
                </> : <>
                  <input style={{ ...inp, margin:0, marginBottom:'6px', fontSize:'14px', padding:'8px 12px' }} placeholder="Name" value={dogEdit.name} onChange={e=>setDogEdit(p=>({...p,name:e.target.value}))}/>
                  <input style={{ ...inp, margin:0, fontSize:'14px', padding:'8px 12px' }} placeholder="Rasse" value={dogEdit.breed} onChange={e=>setDogEdit(p=>({...p,breed:e.target.value}))}/>
                </>}
              </div>
            </div>
            {!editingDog ? <>
              {[['Geburtstag',dog.birthday],['Alter',`${dog.age} Jahre`],['Gewicht',`${dog.weight} kg`],['Chip-Nr.',dog.chip||'–']].map(([l,v])=>(
                <div key={l} style={row}><span style={{ fontSize:'13px', color:C.muted }}>{l}</span><span style={{ fontSize:'13px', fontWeight:'600' }}>{v}</span></div>
              ))}
              <button onClick={()=>{setDogEdit({...dog});setEditingDog(true);}} style={{ background:C.surface, color:C.accent, border:`1px solid ${C.accent}44`, borderRadius:'10px', padding:'10px', fontSize:'13px', fontWeight:'700', cursor:'pointer', width:'100%', marginTop:'12px' }}>✏️ Profil bearbeiten</button>
              <button onClick={()=>photoRef.current?.click()} style={{ background:C.surface, color:C.muted, border:`1px solid ${C.border}`, borderRadius:'10px', padding:'10px', fontSize:'13px', fontWeight:'700', cursor:'pointer', width:'100%', marginTop:'8px' }}>📷 Foto ändern</button>
            </> : <>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'10px' }}>
                {[{l:'Alter',k:'age',t:'number'},{l:'Gewicht (kg)',k:'weight',t:'number'},{l:'Geburtstag',k:'birthday',t:'text'},{l:'Chip-Nr.',k:'chip',t:'text'}].map(f=>(
                  <div key={f.k}><div style={{ fontSize:'11px', color:C.muted, marginBottom:'4px' }}>{f.l}</div><input style={{ ...inp, margin:0, fontSize:'13px', padding:'8px 10px' }} type={f.t} value={dogEdit[f.k]||''} onChange={e=>setDogEdit(p=>({...p,[f.k]:e.target.value}))}/></div>
                ))}
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <button onClick={saveDog} style={{ flex:1, background:C.accent, color:'#fff', border:'none', borderRadius:'12px', padding:'11px', fontSize:'14px', fontWeight:'700', cursor:'pointer' }}>Speichern ✓</button>
                <button onClick={()=>setEditingDog(false)} style={{ flex:1, background:'transparent', color:C.muted, border:`1px solid ${C.border}`, borderRadius:'12px', padding:'11px', fontSize:'14px', cursor:'pointer' }}>Abbrechen</button>
              </div>
            </>}
          </div>
        </div>
      )}

      {/* TERMINE */}
      {dogSubTab==='termine'&&(
        <div>
          <button onClick={()=>setShowAddAppt(true)} style={{ background:C.accent, color:'#fff', border:'none', borderRadius:'14px', padding:'13px', fontSize:'14px', fontWeight:'800', cursor:'pointer', width:'100%', marginBottom:'12px' }}>+ Termin erstellen</button>
          {showAddAppt&&(
            <div style={{ ...card, border:`1px solid ${C.accent}44`, marginBottom:'12px' }}>
              <div style={cTitle}>Neuer Termin</div>
              <input style={inp} placeholder="Grund (z.B. Impfung) *" value={newAppt.reason} onChange={e=>setNewAppt(p=>({...p,reason:e.target.value}))}/>
              <input style={inp} placeholder="Tierarzt / Ort" value={newAppt.vet} onChange={e=>setNewAppt(p=>({...p,vet:e.target.value}))}/>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                <div><div style={{ fontSize:'11px', color:C.muted, marginBottom:'4px' }}>Datum *</div><input style={{ ...inp, margin:0 }} type="text" placeholder="28.06.2026" value={newAppt.date} onChange={e=>setNewAppt(p=>({...p,date:e.target.value}))}/></div>
                <div><div style={{ fontSize:'11px', color:C.muted, marginBottom:'4px' }}>Uhrzeit</div><input style={{ ...inp, margin:0 }} type="text" placeholder="10:00" value={newAppt.time} onChange={e=>setNewAppt(p=>({...p,time:e.target.value}))}/></div>
              </div>
              <div style={{ display:'flex', gap:'8px', marginTop:'10px' }}>
                <button onClick={addAppt} style={{ flex:1, background:C.accent, color:'#fff', border:'none', borderRadius:'12px', padding:'11px', fontSize:'14px', fontWeight:'700', cursor:'pointer' }}>Speichern ✓</button>
                <button onClick={()=>setShowAddAppt(false)} style={{ flex:1, background:'transparent', color:C.muted, border:`1px solid ${C.border}`, borderRadius:'12px', padding:'11px', fontSize:'14px', cursor:'pointer' }}>Abbrechen</button>
              </div>
            </div>
          )}
          <div style={card}>
            <div style={cTitle}>Alle Termine ({appts.length})</div>
            {appts.map(a=>(
              <div key={a.id} style={{ ...row, flexDirection:'column', alignItems:'flex-start', gap:'8px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:'14px', fontWeight:'700' }}>{a.reason}</div>
                    <div style={{ fontSize:'11px', color:C.muted }}>📅 {a.date} {a.time} · {a.vet}</div>
                  </div>
                  <span style={bdg(a.done?C.muted:C.teal)}>{a.done?'ERLEDIGT':'OFFEN'}</span>
                </div>
                <div style={{ display:'flex', gap:'8px', width:'100%' }}>
                  <button onClick={()=>exportICS(a)} style={{ flex:1, background:`${C.teal}15`, color:C.teal, border:`1px solid ${C.teal}33`, borderRadius:'8px', padding:'7px', fontSize:'12px', fontWeight:'700', cursor:'pointer' }}>📅 In Kalender</button>
                  <button onClick={()=>setAppts(p=>p.map(x=>x.id===a.id?{...x,done:!x.done}:x))} style={{ flex:1, background:`${C.muted}15`, color:C.muted, border:`1px solid ${C.border}`, borderRadius:'8px', padding:'7px', fontSize:'12px', cursor:'pointer' }}>{a.done?'Wieder öffnen':'✓ Erledigt'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FÜTTERUNG */}
      {dogSubTab==='futterung'&&(
        <div>
          <div style={card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
              <div style={cTitle}>Mahlzeiten</div>
              <button onClick={()=>setShowAddMeal(true)} style={{ background:C.accent, color:'#fff', border:'none', borderRadius:'8px', padding:'5px 10px', fontSize:'12px', fontWeight:'700', cursor:'pointer' }}>+ Neu</button>
            </div>
            {showAddMeal&&(
              <div style={{ background:C.bg, borderRadius:'12px', padding:'14px', marginBottom:'14px', border:`1px solid ${C.border}` }}>
                <input style={inp} placeholder="Name (z.B. Morgenmahlzeit) *" value={newMeal.name} onChange={e=>setNewMeal(p=>({...p,name:e.target.value}))}/>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                  <input style={{ ...inp, margin:0 }} placeholder="Uhrzeit *" value={newMeal.time} onChange={e=>setNewMeal(p=>({...p,time:e.target.value}))}/>
                  <input style={{ ...inp, margin:0 }} placeholder="Futter" value={newMeal.food} onChange={e=>setNewMeal(p=>({...p,food:e.target.value}))}/>
                </div>
                <input style={{ ...inp, marginTop:'8px' }} placeholder="Menge (z.B. 200g)" value={newMeal.amount} onChange={e=>setNewMeal(p=>({...p,amount:e.target.value}))}/>
                <div style={{ fontSize:'11px', color:C.muted, marginBottom:'8px' }}>Wochentage:</div>
                <div style={{ display:'flex', gap:'5px', flexWrap:'wrap', marginBottom:'12px' }}>
                  {WEEKDAYS.map(d=>(
                    <button key={d} onClick={()=>setNewMeal(p=>({...p,days:p.days.includes(d)?p.days.filter(x=>x!==d):[...p.days,d]}))} style={{ background:newMeal.days.includes(d)?C.accent:C.surface, color:newMeal.days.includes(d)?'#fff':C.muted, border:`1px solid ${newMeal.days.includes(d)?C.accent:C.border}`, borderRadius:'8px', padding:'4px 8px', fontSize:'12px', cursor:'pointer', fontWeight:'700' }}>{d}</button>
                  ))}
                </div>
                <div style={{ display:'flex', gap:'8px' }}>
                  <button onClick={addMeal} style={{ flex:1, background:C.accent, color:'#fff', border:'none', borderRadius:'10px', padding:'10px', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>Speichern</button>
                  <button onClick={()=>setShowAddMeal(false)} style={{ flex:1, background:'transparent', color:C.muted, border:`1px solid ${C.border}`, borderRadius:'10px', padding:'10px', fontSize:'13px', cursor:'pointer' }}>Abbrechen</button>
                </div>
              </div>
            )}
            {meals.map(m=>(
              <div key={m.id} style={{ ...row, flexDirection:'column', alignItems:'flex-start', gap:'6px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', width:'100%' }}>
                  <div><div style={{ fontSize:'14px', fontWeight:'700' }}>{m.name}</div><div style={{ fontSize:'11px', color:C.muted }}>{m.time} · {m.food} · {m.amount}</div></div>
                  <button onClick={()=>setMeals(p=>p.filter(x=>x.id!==m.id))} style={{ background:'transparent', border:'none', color:C.danger, fontSize:'16px', cursor:'pointer', padding:'4px' }}>✕</button>
                </div>
                <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
                  {WEEKDAYS.map(d=><span key={d} style={{ background:m.days.includes(d)?`${C.teal}22`:C.bg, color:m.days.includes(d)?C.teal:C.muted, borderRadius:'5px', padding:'2px 6px', fontSize:'10px', fontWeight:'700', border:`1px solid ${m.days.includes(d)?C.teal:C.border}` }}>{d}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
              <div style={cTitle}>Medikamente 💊</div>
              <button onClick={()=>setShowAddMed(true)} style={{ background:C.danger, color:'#fff', border:'none', borderRadius:'8px', padding:'5px 10px', fontSize:'12px', fontWeight:'700', cursor:'pointer' }}>+ Neu</button>
            </div>
            {showAddMed&&(
              <div style={{ background:C.bg, borderRadius:'12px', padding:'14px', marginBottom:'14px', border:`1px solid ${C.border}` }}>
                <input style={inp} placeholder="Medikament *" value={newMed.name} onChange={e=>setNewMed(p=>({...p,name:e.target.value}))}/>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                  <input style={{ ...inp, margin:0 }} placeholder="Dosis" value={newMed.dose} onChange={e=>setNewMed(p=>({...p,dose:e.target.value}))}/>
                  <input style={{ ...inp, margin:0 }} placeholder="Uhrzeit" value={newMed.time} onChange={e=>setNewMed(p=>({...p,time:e.target.value}))}/>
                </div>
                <input style={{ ...inp, marginTop:'8px' }} placeholder="Notiz" value={newMed.notes} onChange={e=>setNewMed(p=>({...p,notes:e.target.value}))}/>
                <div style={{ fontSize:'11px', color:C.muted, marginBottom:'8px', marginTop:'4px' }}>Wochentage:</div>
                <div style={{ display:'flex', gap:'5px', flexWrap:'wrap', marginBottom:'12px' }}>
                  {WEEKDAYS.map(d=>(
                    <button key={d} onClick={()=>setNewMed(p=>({...p,days:p.days.includes(d)?p.days.filter(x=>x!==d):[...p.days,d]}))} style={{ background:newMed.days.includes(d)?C.danger:C.surface, color:newMed.days.includes(d)?'#fff':C.muted, border:`1px solid ${newMed.days.includes(d)?C.danger:C.border}`, borderRadius:'8px', padding:'4px 8px', fontSize:'12px', cursor:'pointer', fontWeight:'700' }}>{d}</button>
                  ))}
                </div>
                <div style={{ display:'flex', gap:'8px' }}>
                  <button onClick={addMed} style={{ flex:1, background:C.danger, color:'#fff', border:'none', borderRadius:'10px', padding:'10px', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>Speichern</button>
                  <button onClick={()=>setShowAddMed(false)} style={{ flex:1, background:'transparent', color:C.muted, border:`1px solid ${C.border}`, borderRadius:'10px', padding:'10px', fontSize:'13px', cursor:'pointer' }}>Abbrechen</button>
                </div>
              </div>
            )}
            {meds.length===0 ? <div style={{ color:C.muted, fontSize:'13px' }}>Noch keine Medikamente eingetragen</div>
            : meds.map(m=>(
              <div key={m.id} style={{ ...row, flexDirection:'column', alignItems:'flex-start', gap:'6px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', width:'100%' }}>
                  <div><div style={{ fontSize:'14px', fontWeight:'700' }}>💊 {m.name}</div><div style={{ fontSize:'11px', color:C.muted }}>{m.dose} · {m.time}{m.notes&&` · ${m.notes}`}</div></div>
                  <button onClick={()=>setMeds(p=>p.filter(x=>x.id!==m.id))} style={{ background:'transparent', border:'none', color:C.danger, fontSize:'16px', cursor:'pointer', padding:'4px' }}>✕</button>
                </div>
                <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
                  {WEEKDAYS.map(d=><span key={d} style={{ background:m.days.includes(d)?`${C.danger}22`:C.bg, color:m.days.includes(d)?C.danger:C.muted, borderRadius:'5px', padding:'2px 6px', fontSize:'10px', fontWeight:'700', border:`1px solid ${m.days.includes(d)?C.danger:C.border}` }}>{d}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GEWICHT */}
      {dogSubTab==='gewicht'&&(
        <div>
          <div style={card}>
            <div style={cTitle}>Aktuelles Gewicht</div>
            <div style={{ fontSize:'48px', fontWeight:'800', color:C.teal }}>{dog.weight}<span style={{ fontSize:'18px', color:C.muted }}> kg</span></div>
            {weightTrend!==null&&<div style={{ fontSize:'13px', color:parseFloat(weightTrend)>0?C.danger:parseFloat(weightTrend)<0?C.success:C.muted, marginTop:'4px' }}>
              {parseFloat(weightTrend)>0?`▲ +${weightTrend} kg seit letzter Messung`:parseFloat(weightTrend)<0?`▼ ${weightTrend} kg seit letzter Messung`:'→ Gleichgewicht'}
            </div>}
            {!showAddWeight
              ? <button onClick={()=>setShowAddWeight(true)} style={{ background:C.teal, color:'#0D1B2A', border:'none', borderRadius:'12px', padding:'11px', fontSize:'14px', fontWeight:'800', cursor:'pointer', width:'100%', marginTop:'14px' }}>+ Gewicht eintragen</button>
              : <div style={{ marginTop:'12px' }}>
                  <div style={{ display:'flex', gap:'8px' }}>
                    <input style={{ ...inp, flex:1, margin:0 }} type="number" step="0.1" placeholder="z.B. 28.5" value={newWeight} onChange={e=>setNewWeight(e.target.value)}/>
                    <button onClick={addWeight} style={{ background:C.teal, color:'#0D1B2A', border:'none', borderRadius:'10px', padding:'10px 16px', fontSize:'14px', fontWeight:'800', cursor:'pointer', flexShrink:0 }}>✓</button>
                  </div>
                </div>
            }
          </div>
          <div style={card}>
            <div style={cTitle}>Verlauf</div>
            {weightLog.map((w,i)=>(
              <div key={w.id} style={row}>
                <div><div style={{ fontSize:'14px', fontWeight:'600' }}>{w.date}</div></div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  {i>0&&<span style={{ fontSize:'11px', color:w.weight>weightLog[i-1].weight?C.danger:w.weight<weightLog[i-1].weight?C.success:C.muted }}>
                    {w.weight>weightLog[i-1].weight?'▲':'▼'}
                  </span>}
                  <div style={{ fontSize:'16px', fontWeight:'800', color:C.teal }}>{w.weight} kg</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KI-CHAT */}
      {dogSubTab==='ki'&&(
        <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 240px)' }}>
          <div style={{ background:`${C.danger}15`, border:`1px solid ${C.danger}33`, borderRadius:'10px', padding:'8px 12px', marginBottom:'12px', fontSize:'11px', color:C.danger, fontWeight:'600' }}>
            ⚕️ KI-Antworten ersetzen keine tierärztliche Beratung
          </div>
          <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:'10px', paddingBottom:'8px' }}>
            {aiMsgs.map((m,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start' }}>
                <div style={{ maxWidth:'82%', background:m.role==='user'?C.accent:C.surface, border:m.role==='assistant'?`1px solid ${C.border}`:'none', borderRadius:m.role==='user'?'16px 16px 4px 16px':'16px 16px 16px 4px', padding:'11px 14px', fontSize:'14px', lineHeight:1.55, color:C.text, whiteSpace:'pre-wrap' }}>
                  {m.role==='assistant'&&<span style={{ marginRight:'6px' }}>🐾</span>}{m.content}
                </div>
              </div>
            ))}
            {aiLoad&&<div style={{ display:'flex' }}><div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'16px 16px 16px 4px', padding:'12px 18px', fontSize:'20px', letterSpacing:'4px', color:C.accent }}>···</div></div>}
            <div ref={chatEnd}/>
          </div>
          <div style={{ flexShrink:0, borderTop:`1px solid ${C.border}`, paddingTop:'12px' }}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'10px' }}>
              {['Was darf er nicht essen?','Wie viel Schlaf braucht er?','Tipps gegen Zecken?'].map(q=>(
                <button key={q} onClick={()=>setAiInput(q)} style={{ background:C.accentSoft, color:C.accent, border:`1px solid ${C.accent}33`, borderRadius:'20px', padding:'5px 10px', fontSize:'11px', cursor:'pointer', fontWeight:'700' }}>{q}</button>
              ))}
            </div>
            <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
              <input
                type="text"
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => e.key==='Enter' && !e.shiftKey && sendAI()}
                placeholder={`Frage zu ${dog.name}...`}
                maxLength={500}
                style={{ flex:1, background:C.bg, border:`2px solid ${C.border}`, borderRadius:'12px', padding:'12px 16px', color:C.text, fontSize:'15px', outline:'none' }}
              />
              <button
                onClick={sendAI}
                disabled={aiLoad || !aiInput.trim()}
                style={{ background:aiInput.trim()?C.accent:C.border, color:'#fff', border:'none', borderRadius:'12px', width:'48px', height:'48px', fontSize:'20px', cursor:aiInput.trim()?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background 0.2s' }}
              >→</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const tabs = [
    {id:'home',label:'Home',icon:'🏠'},
    {id:'routes',label:'Routen',icon:'🗺️'},
    {id:'places',label:'Entdecken',icon:'🏊'},
    {id:'community',label:'Community',icon:'💬'},
    {id:'meinHund',label:'Mein Hund',icon:'🐕'},
  ];

  const views = { home:<Home/>, routes:<RoutesTab/>, places:<PlacesTab/>, community:<CommunityTab/>, meinHund:<MeinHundTab/> };

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", backgroundColor:C.bg, color:C.text, minHeight:'100vh', maxWidth:'430px', margin:'0 auto', display:'flex', flexDirection:'column' }}>
      <div style={{ background:'linear-gradient(135deg,#1A2A3A 0%,#1E3545 100%)', padding:'16px 20px', borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
              <span style={{ fontSize:'10px', fontWeight:'800', letterSpacing:'2px', color:C.accent }}>DOGSTYLE 2.0</span>
              <span style={{ background:'rgba(236,0,0,0.15)', color:'#EC0000', borderRadius:'6px', padding:'2px 7px', fontSize:'9px', fontWeight:'800' }}>🇦🇹 AT</span>
            </div>
            <div style={{ fontSize:'26px', fontWeight:'800', letterSpacing:'-0.5px', lineHeight:1 }}>{dog.name} 🐾</div>
            <div style={{ fontSize:'12px', color:C.muted, marginTop:'3px' }}>{dog.breed} · {dog.age} Jahre · {dog.weight} kg</div>
          </div>
          <div onClick={()=>photoRef.current?.click()} style={{ width:'56px', height:'56px', borderRadius:'50%', overflow:'hidden', border:`2px solid ${C.border}`, cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:C.bg, fontSize:'36px' }}>
            {dogPhoto ? <img src={dogPhoto} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="Hund"/> : dog.emoji}
          </div>
        </div>
      </div>
      <input ref={photoRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhoto}/>
      <div style={{ flex:1, overflowY:'auto', padding:'16px', paddingBottom:'90px' }}>
        {views[activeTab]||views.home}
      </div>
      <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:'430px', background:C.surface, borderTop:`1px solid ${C.border}`, display:'flex', padding:'6px 0 12px', zIndex:100 }}>
        {tabs.map(t=>(
          <div key={t.id} onClick={()=>setActiveTab(t.id)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'2px', cursor:'pointer', padding:'4px 0' }}>
            <span style={{ fontSize:'20px', opacity:activeTab===t.id?1:0.4 }}>{t.icon}</span>
            <span style={{ fontSize:'9px', fontWeight:activeTab===t.id?'800':'500', color:activeTab===t.id?C.accent:C.muted }}>{t.label}</span>
          </div>
        ))}
      </div>
      {rateTarget&&(
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.88)', zIndex:999, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
          <div style={{ background:C.surface, borderRadius:'20px 20px 0 0', width:'100%', maxWidth:'430px', padding:'24px', border:`1px solid ${C.border}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <div style={{ fontSize:'16px', fontWeight:'800' }}>{rateTarget.emoji} {rateTarget.name}</div>
              <span style={{ cursor:'pointer', fontSize:'22px', color:C.muted }} onClick={()=>setRateTarget(null)}>✕</span>
            </div>
            <div style={{ fontSize:'12px', color:C.muted, marginBottom:'8px' }}>Deine Bewertung *</div>
            <StarPicker value={rateStars} onChange={setRateStars}/>
            <textarea style={{ ...inp, height:'80px', resize:'none' }} placeholder="Kommentar (optional)..." value={rateComment} onChange={e=>setRateComment(e.target.value)} maxLength={200}/>
            <div style={{ display:'flex', gap:'8px' }}>
              <button onClick={submitRating} style={{ flex:1, background:rateStars>0?C.accent:C.border, color:rateStars>0?'#fff':C.muted, border:'none', borderRadius:'12px', padding:'13px', fontSize:'14px', fontWeight:'800', cursor:rateStars>0?'pointer':'not-allowed' }}>Bewertung abgeben</button>
              <button onClick={()=>setRateTarget(null)} style={{ flex:1, background:'transparent', color:C.muted, border:`1px solid ${C.border}`, borderRadius:'12px', padding:'13px', fontSize:'14px', cursor:'pointer' }}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
