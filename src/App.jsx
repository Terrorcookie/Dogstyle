import { useState, useRef, useEffect } from "react";

const C = {
  bg: '#0D1B2A', surface: '#1A2A3A', border: '#2A3D50',
  accent: '#FF6B35', accentSoft: 'rgba(255,107,53,0.12)',
  teal: '#4ECDC4', text: '#F0EDE8', muted: '#7A8B9A',
  success: '#4CAF50', danger: '#FF4757',
  premium: '#FFE66D', premiumSoft: 'rgba(255,230,109,0.08)',
  yellow: '#FFE66D',
};

const todayDate = new Date();
const fmt = (d) => d.toLocaleDateString('de-AT');
const DOG = { name: 'Bello', breed: 'Golden Retriever', age: 3, weight: 28.5, emoji: '🐕‍🦺' };

const FEEDINGS = [
  { id: 1, time: '08:00', type: 'Morgen', food: 'Trockenfutter', amount: '200g', done: true },
  { id: 2, time: '17:00', type: 'Abend', food: 'Nassfutter', amount: '150g', done: false },
];
const VACC = [
  { id: 1, name: 'Tollwut', nextDue: '12.01.2026', status: 'fällig' },
  { id: 2, name: 'DHPP', nextDue: '15.03.2026', status: 'aktuell' },
];
const VET = [{ date: '28.06.2026', reason: 'Jährliche Untersuchung', vet: 'Dr. Huber' }];

const PLACES = [
  // Schwimmen
  { id:1, cat:'swim', name:'Wörthersee – Hundestrand Krumpendorf', emoji:'🏊', region:'Kärnten', rating:4.9, tags:['Leinen frei','Flacher Einstieg','Parkplatz'], note:'Österreichs schönster Hundestrand! Extra abgesperrter Bereich, super flacher Einstieg – ideal für alle Hunde.' },
  { id:2, cat:'swim', name:'Neusiedler See – Podersdorf', emoji:'🌊', region:'Burgenland', rating:4.6, tags:['Naturstrand','Ruhig','Weitläufig'], note:'Traumhafter Schilf-Naturstrand. Hunde dürfen im Abschnitt hinter dem Campingplatz ohne Leine.' },
  { id:3, cat:'swim', name:'Attersee – Weyregg', emoji:'💧', region:'Oberösterreich', rating:4.7, tags:['Kristallklares Wasser','Schatten','Naturufer'], note:'Das klarste Wasser Österreichs! Ruhiger Naturstrand, morgens fast menschenleer.' },
  { id:4, cat:'swim', name:'Wolfgangsee – Hundestrand Strobl', emoji:'🌅', region:'Salzburg', rating:4.5, tags:['Bergpanorama','Flach','Familiär'], note:'Mit Blick auf den Schafberg. Sehr entspannte Atmosphäre, viele Hunde regelmäßig hier.' },
  // Parks
  { id:5, cat:'park', name:'Prater Hundezone Wien', emoji:'🌿', region:'Wien', rating:4.7, tags:['Eingezäunt','Groß','Beleuchtung'], note:'Riesige eingezäunte Freilauffläche im Grünen Prater. Täglich gut besucht, tolle Hundegemeinschaft.' },
  { id:6, cat:'park', name:'Lainzer Tiergarten', emoji:'🦌', region:'Wien', rating:4.8, tags:['Wildgehege','Weitläufig','Naturbelassen'], note:'Ehemaliges Kaiserrevier, jetzt Naturschutzgebiet. Hunde erlaubt auf gekennzeichneten Wegen.' },
  { id:7, cat:'park', name:'Stadtpark Graz – Hundewiese', emoji:'🌳', region:'Steiermark', rating:4.5, tags:['Zentral','Spielwiese','Wasserquelle'], note:'Ideal für Stadtmenschen. Eingezäunte Wiese mit Wassernapf-Station.' },
  // Trails
  { id:8, cat:'trail', name:'Kahlenberg Rundweg', emoji:'🥾', region:'Wien / NÖ', rating:4.8, tags:['Aussicht','8 km','Waldboden'], note:'Klassiker! Atemberaubender Blick auf Wien. Gut ausgeschildert, Hunde können schnuppern.' },
  { id:9, cat:'trail', name:'Wienerwald Wanderweg', emoji:'🌲', region:'Niederösterreich', rating:4.9, tags:['Weitläufig','Bach','Schattig'], note:'Unendliches Wandergebiet direkt vor Wien. Mehrere Bachläufe zum Abkühlen unterwegs.' },
  { id:10, cat:'trail', name:'Raxalpe Hundetour', emoji:'⛰️', region:'Niederösterreich', rating:4.6, tags:['Bergwandern','Aussicht','Anspruchsvoll'], note:'Für sportliche Hundehalter! Wunderschöne Alpenwelt, Hunde müssen fit sein.' },
  // Hundefreundlich
  { id:11, cat:'cafe', name:'Café Schwarzenberg Wien', emoji:'☕', region:'Wien', rating:4.8, tags:['Hunde erlaubt','Hundenapf','Terrasse'], note:'Wiener Kaffeehauskultur mit Hund! Personal liebt Tiere, Wassernapf wird automatisch gebracht.' },
  { id:12, cat:'cafe', name:'Heuriger Mayer am Pfarrplatz', emoji:'🍷', region:'Wien', rating:4.7, tags:['Garten','Wiener Heuriger','Entspannt'], note:'Traditioneller Wiener Heuriger mit großem Garten. Hunde herzlich willkommen!' },
  { id:13, cat:'cafe', name:'Gasthof Berghof Semmering', emoji:'🏔️', region:'Niederösterreich', rating:4.6, tags:['Hunde erlaubt','Bergluft','Gemütlich'], note:'Urgemütlich nach der Wanderung. Hundedecke vorhanden, sehr tierfreundliches Personal.' },
];

const POSTS = [
  { id:1, author:'Steffi & Layla', avatar:'🐩', cat:'tip', title:'Wörthersee Geheimtipp: Früh morgens 🏊', body:'Vor 8 Uhr habt ihr den Hundestrand bei Krumpendorf für euch! Layla ist dann immer voll aufgedreht. Das Wasser ist traumhaft warm im Sommer.', likes:54, liked:false, time:'vor 2h', comments:11 },
  { id:2, author:'Markus & Rex', avatar:'🐕', cat:'question', title:'Hundefriseur Empfehlung Wien 1020?', body:'Suche einen guten Hundefriseur im 2. Bezirk oder Nähe Prater. Rex braucht dringend eine Sommerschur 😅 Danke für Tipps!', likes:9, liked:false, time:'vor 4h', comments:17 },
  { id:3, author:'Vroni & Balu', avatar:'🐾', cat:'event', title:'📅 Hundetreffen Prater – Sa. 09:00 Uhr', body:'Wie jeden Samstag treffen wir uns beim Lusthaus im Prater. Einfach vorbeikommen! Balu freut sich immer über neue Spielkameraden. Alle Rassen willkommen 🐾', likes:71, liked:false, time:'vor 1 Tag', comments:28 },
  { id:4, author:'Hannes & Rudi', avatar:'🦮', cat:'tip', title:'Pfoten schützen auf Wiener Pflastersteinen 🐾', body:'Im Sommer werden die Pflastersteine in der Innenstadt extrem heiß! Einfach Vaseline auf die Pfoten – schützt perfekt. Rudi läuft seitdem viel entspannter durch die Stadt.', likes:93, liked:false, time:'vor 2 Tagen', comments:35 },
  { id:5, author:'Lisa & Mochi', avatar:'🦊', cat:'tip', title:'Neusiedler See – bester Abschnitt für Hunde', body:'Tipp: Hinter dem Campingplatz Podersdorf gibt\'s einen ruhigen Naturabschnitt ohne Badegäste. Mochi schwimmt da stundenlang. Früh anreisen wegen Parkplatz!', likes:42, liked:false, time:'vor 3 Tagen', comments:19 },
];

// ── UI helpers ─────────────────────────────────────────────────────────────────
const card = { background: C.surface, borderRadius: '16px', padding: '16px', marginBottom: '12px', border: `1px solid ${C.border}` };
const cTitle = { fontSize: '10px', fontWeight: '800', letterSpacing: '1.5px', color: C.muted, textTransform: 'uppercase', marginBottom: '12px' };
const row = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}` };
const inp = { background: C.bg, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '10px 14px', color: C.text, fontSize: '14px', width: '100%', outline: 'none', boxSizing: 'border-box', marginBottom: '10px' };
const bdg = (color) => ({ background: `${color}22`, color, borderRadius: '6px', padding: '3px 8px', fontSize: '10px', fontWeight: '800', whiteSpace: 'nowrap' });

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.88)', zIndex:999, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
      <div style={{ background:C.surface, borderRadius:'20px 20px 0 0', width:'100%', maxWidth:'430px', maxHeight:'85vh', display:'flex', flexDirection:'column', border:`1px solid ${C.border}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <span style={{ fontSize:'16px', fontWeight:'800' }}>{title}</span>
          <span style={{ cursor:'pointer', fontSize:'20px', color:C.muted }} onClick={onClose}>✕</span>
        </div>
        <div style={{ overflowY:'auto', padding:'16px 20px 28px', fontSize:'13px', color:C.muted, lineHeight:1.7 }}>{children}</div>
      </div>
    </div>
  );
}

function PremiumTeaser({ features, onWaitlist }) {
  return (
    <div style={{ background:C.premiumSoft, borderRadius:'16px', padding:'16px', marginBottom:'12px', border:`1px solid ${C.premium}44` }}>
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
        <span>⭐</span><span style={{ fontSize:'11px', fontWeight:'800', letterSpacing:'1px', color:C.premium, textTransform:'uppercase' }}>Premium – Bald verfügbar</span>
      </div>
      {features.map((f,i) => <div key={i} style={{ display:'flex', gap:'8px', marginBottom:'6px', opacity:0.7 }}><span>🔒</span><span style={{ fontSize:'13px', color:C.text }}>{f}</span></div>)}
      <button onClick={onWaitlist} style={{ background:C.premium, color:'#0D1B2A', border:'none', borderRadius:'10px', padding:'10px', fontSize:'13px', fontWeight:'800', cursor:'pointer', width:'100%', marginTop:'8px' }}>🔔 Benachrichtigen wenn verfügbar</button>
    </div>
  );
}

function WaitlistModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.88)', zIndex:999, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
      <div style={{ background:C.surface, borderRadius:'20px 20px 0 0', width:'100%', maxWidth:'430px', padding:'24px', border:`1px solid ${C.border}` }}>
        {!sent ? <>
          <div style={{ textAlign:'center', marginBottom:'20px' }}>
            <div style={{ fontSize:'40px', marginBottom:'8px' }}>⭐</div>
            <div style={{ fontSize:'20px', fontWeight:'800' }}>Premium Warteliste</div>
            <div style={{ fontSize:'13px', color:C.muted, marginTop:'6px' }}>Als Early-Bird bekommst du <strong style={{ color:C.premium }}>30% Rabatt</strong>!</div>
          </div>
          <input style={inp} type="email" placeholder="deine@email.de" value={email} onChange={e => setEmail(e.target.value)} />
          <button onClick={() => email.includes('@') && setSent(true)} style={{ background:C.premium, color:'#0D1B2A', border:'none', borderRadius:'12px', padding:'14px', fontSize:'15px', fontWeight:'800', cursor:'pointer', width:'100%' }}>Eintragen →</button>
          <button onClick={onClose} style={{ background:'transparent', color:C.muted, border:'none', width:'100%', padding:'12px', cursor:'pointer', fontSize:'13px' }}>Abbrechen</button>
        </> : <div style={{ textAlign:'center', padding:'16px 0' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}>🎉</div>
          <div style={{ fontSize:'20px', fontWeight:'800', marginBottom:'8px' }}>Du bist dabei!</div>
          <button onClick={onClose} style={{ background:C.accent, color:'#fff', border:'none', borderRadius:'12px', padding:'14px', fontSize:'15px', fontWeight:'800', cursor:'pointer', width:'100%' }}>Super! 🐾</button>
        </div>}
      </div>
    </div>
  );
}

// ── Consent Screen ─────────────────────────────────────────────────────────────
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
        <div style={{ fontSize:'13px', color:C.muted, marginTop:'6px' }}>Routen · Orte · Community · KI-Assistent<br/><span style={{ fontSize:'11px' }}>🇦🇹 Nur für Österreich</span></div>
      </div>
      <div style={{ ...card, marginBottom:'14px' }}>
        {[
          { val:age, set:setAge, text:'Ich bin mindestens 16 Jahre alt (DSGVO Art. 8).' },
          { val:priv, set:setPriv, text:'Ich habe die Datenschutzerklärung gelesen und akzeptiere sie.' },
          { val:terms, set:setTerms, text:'Ich akzeptiere die Nutzungsbedingungen inkl. KI-Disclaimer.' },
        ].map((item,i) => (
          <div key={i} onClick={() => item.set(!item.val)} style={{ display:'flex', gap:'12px', alignItems:'flex-start', marginBottom:'14px', cursor:'pointer' }}>
            <div style={{ width:'22px', height:'22px', borderRadius:'6px', border:`2px solid ${item.val ? C.accent : C.border}`, background:item.val ? C.accent : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'12px', color:'#fff', fontWeight:'bold' }}>{item.val ? '✓' : ''}</div>
            <span style={{ fontSize:'13px', color:C.muted, lineHeight:1.5, marginTop:'1px' }}>{item.text}</span>
          </div>
        ))}
      </div>
      <div style={{ ...card, border:`1px solid ${C.teal}44`, marginBottom:'20px', fontSize:'12px', color:C.muted, lineHeight:1.6 }}>
        ℹ️ App-Daten bleiben lokal. KI-Chat-Nachrichten werden an <strong style={{ color:C.text }}>Anthropic, Inc.</strong> (USA) übermittelt. Community-Posts sind für alle sichtbar.
      </div>
      <button onClick={() => ok && onAccept()} style={{ background:ok ? C.accent : C.border, color:ok ? '#fff' : C.muted, border:'none', borderRadius:'14px', padding:'16px', fontSize:'16px', fontWeight:'800', cursor:ok ? 'pointer' : 'not-allowed', width:'100%' }}>
        Kostenlos starten →
      </button>
    </div>
  );
}

// ── Route Recorder (Canvas) ────────────────────────────────────────────────────
function RouteRecorder({ onSave }) {
  const canvasRef = useRef(null);
  const pathRef = useRef([]);
  const progRef = useRef(0);
  const statusRef = useRef('idle');
  const animRef = useRef(null);
  const timerRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [elapsed, setElapsed] = useState(0);
  const [name, setName] = useState('');

  const fmtT = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const dist = (elapsed * 4.5 / 3600).toFixed(2);

  const genPath = (w, h) => {
    const pts = []; let x = w*0.45, y = h*0.5, dx = 2, dy = 1;
    for (let i = 0; i < 280; i++) {
      dx += (Math.random()-0.5)*2.2; dy += (Math.random()-0.5)*1.8;
      dx *= 0.93; dy *= 0.93;
      x += dx; y += dy;
      if (x < 14) { x = 14; dx = Math.abs(dx)*1.3; }
      if (x > w-14) { x = w-14; dx = -Math.abs(dx)*1.3; }
      if (y < 14) { y = 14; dy = Math.abs(dy)*1.3; }
      if (y > h-14) { y = h-14; dy = -Math.abs(dy)*1.3; }
      pts.push({ x:Math.round(x), y:Math.round(y) });
    }
    return pts;
  };

  const draw = (prog) => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d'), w = cv.width, h = cv.height;
    ctx.fillStyle = '#0A1520'; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle = 'rgba(42,61,80,0.55)'; ctx.lineWidth = 0.5;
    for (let gx=0; gx<w; gx+=24) { ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,h); ctx.stroke(); }
    for (let gy=0; gy<h; gy+=24) { ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(w,gy); ctx.stroke(); }
    const pts = pathRef.current; if (!pts.length) return;
    const end = Math.max(1, Math.floor(prog * pts.length));
    ctx.beginPath(); ctx.strokeStyle = 'rgba(255,107,53,0.22)'; ctx.lineWidth = 8;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i=1; i<end; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
    ctx.beginPath(); ctx.strokeStyle = '#FF6B35'; ctx.lineWidth = 3;
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i=1; i<end; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
    ctx.beginPath(); ctx.fillStyle = '#4ECDC4'; ctx.arc(pts[0].x, pts[0].y, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#0A1520'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('S', pts[0].x, pts[0].y+3);
    const cur = pts[end-1];
    if (prog < 1) {
      ctx.beginPath(); ctx.strokeStyle = 'rgba(255,107,53,0.3)'; ctx.lineWidth = 2;
      ctx.arc(cur.x, cur.y, 11, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.fillStyle = '#FF6B35'; ctx.arc(cur.x, cur.y, 5, 0, Math.PI*2); ctx.fill();
    } else {
      ctx.beginPath(); ctx.fillStyle = C.danger; ctx.arc(cur.x, cur.y, 6, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Z', cur.x, cur.y+3);
    }
  };

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const init = () => { cv.width = cv.offsetWidth || 340; cv.height = 200; draw(0); };
    setTimeout(init, 80);
    return () => { clearInterval(animRef.current); clearInterval(timerRef.current); };
  }, []);

  const start = () => {
    const cv = canvasRef.current;
    cv.width = cv.offsetWidth || 340; cv.height = 200;
    pathRef.current = genPath(cv.width, cv.height);
    progRef.current = 0; statusRef.current = 'recording';
    setStatus('recording'); setElapsed(0); draw(0);
    animRef.current = setInterval(() => {
      if (statusRef.current !== 'recording') return;
      progRef.current = Math.min(1, progRef.current + 0.0045);
      draw(progRef.current);
      if (progRef.current >= 1) { clearInterval(animRef.current); }
    }, 50);
    timerRef.current = setInterval(() => {
      if (statusRef.current === 'recording') setElapsed(e => e+1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(animRef.current); clearInterval(timerRef.current);
    statusRef.current = 'done'; setStatus('done'); draw(progRef.current);
  };

  const save = () => {
    onSave({ id:Date.now(), name:name||'Meine Route', duration:elapsed, distance:dist, date:fmt(todayDate), time:new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}) });
    progRef.current = 0; statusRef.current = 'idle'; setStatus('idle'); setElapsed(0); setName('');
    setTimeout(() => { const cv = canvasRef.current; if(cv){cv.width=cv.offsetWidth||340;cv.height=200;draw(0);} }, 50);
  };

  const discard = () => {
    progRef.current = 0; statusRef.current = 'idle'; setStatus('idle'); setElapsed(0);
    setTimeout(() => { const cv = canvasRef.current; if(cv){cv.width=cv.offsetWidth||340;cv.height=200;draw(0);} }, 50);
  };

  return (
    <div style={{ ...card, padding:0, overflow:'hidden' }}>
      <canvas ref={canvasRef} style={{ width:'100%', height:'200px', display:'block' }} />
      <div style={{ padding:'14px 16px' }}>
        {status==='idle' && <button onClick={start} style={{ background:C.accent, color:'#fff', border:'none', borderRadius:'12px', padding:'13px', fontSize:'15px', fontWeight:'800', cursor:'pointer', width:'100%' }}>▶ Route aufzeichnen</button>}
        {status==='recording' && <>
          <div style={{ display:'flex', justifyContent:'space-around', marginBottom:'12px' }}>
            <div style={{ textAlign:'center' }}><div style={{ fontSize:'26px', fontWeight:'800', color:C.teal }}>{fmtT(elapsed)}</div><div style={{ fontSize:'10px', color:C.muted }}>Zeit</div></div>
            <div style={{ textAlign:'center' }}><div style={{ fontSize:'26px', fontWeight:'800', color:C.accent }}>{dist}<span style={{ fontSize:'12px', color:C.muted }}> km</span></div><div style={{ fontSize:'10px', color:C.muted }}>Distanz</div></div>
            <div style={{ textAlign:'center' }}><div style={{ fontSize:'20px' }}>🔴</div><div style={{ fontSize:'10px', color:C.danger, fontWeight:'800' }}>LIVE</div></div>
          </div>
          <button onClick={stop} style={{ background:C.danger, color:'#fff', border:'none', borderRadius:'12px', padding:'13px', fontSize:'15px', fontWeight:'800', cursor:'pointer', width:'100%' }}>⏹ Stoppen</button>
        </>}
        {status==='done' && <>
          <div style={{ display:'flex', justifyContent:'space-around', marginBottom:'12px' }}>
            <div style={{ textAlign:'center' }}><div style={{ fontSize:'22px', fontWeight:'800', color:C.teal }}>{fmtT(elapsed)}</div><div style={{ fontSize:'10px', color:C.muted }}>Zeit</div></div>
            <div style={{ textAlign:'center' }}><div style={{ fontSize:'22px', fontWeight:'800', color:C.accent }}>{dist} km</div><div style={{ fontSize:'10px', color:C.muted }}>Distanz</div></div>
            <div style={{ textAlign:'center' }}><div style={{ fontSize:'22px', fontWeight:'800', color:C.success }}>✓</div><div style={{ fontSize:'10px', color:C.muted }}>Fertig</div></div>
          </div>
          <input style={inp} placeholder="Routenname (z.B. Waldspaziergang)" value={name} onChange={e => setName(e.target.value)} />
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={save} style={{ flex:1, background:C.accent, color:'#fff', border:'none', borderRadius:'12px', padding:'12px', fontSize:'14px', fontWeight:'700', cursor:'pointer' }}>💾 Speichern</button>
            <button onClick={discard} style={{ flex:1, background:'transparent', color:C.muted, border:`1px solid ${C.border}`, borderRadius:'12px', padding:'12px', fontSize:'14px', cursor:'pointer' }}>Verwerfen</button>
          </div>
        </>}
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [consented, setConsented] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [feedings, setFeedings] = useState(FEEDINGS);
  const [routes, setRoutes] = useState([
    { id:1, name:'Morgenrunde', duration:30, distance:'2.10', date:fmt(todayDate), time:'07:30' },
    { id:2, name:'Waldspaziergang', duration:45, distance:'3.20', date:fmt(new Date(todayDate-86400000)), time:'17:00' },
  ]);
  const [places, setPlaces] = useState(PLACES);
  const [posts, setPosts] = useState(POSTS);
  const [placeCat, setPlaceCat] = useState('all');
  const [postCat, setPostCat] = useState('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title:'', body:'', cat:'tip' });
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [newPlace, setNewPlace] = useState({ name:'', note:'' });
  const [aiMsgs, setAiMsgs] = useState([{ role:'assistant', content:`Hallo! Ich bin dein KI-Assistent für ${DOG.name} 🐾\n\nIch helfe bei Gesundheit, Ernährung und Training.\n\n⚕️ Kein Ersatz für den Tierarzt.` }]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoad, setAiLoad] = useState(false);
  const [aiCount, setAiCount] = useState(0);
  const chatEnd = useRef(null);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior:'smooth' }); }, [aiMsgs]);

  if (!consented) return <ConsentScreen onAccept={() => setConsented(true)} />;

  const toggleFeed = (id) => setFeedings(p => p.map(f => f.id===id ? {...f,done:!f.done} : f));
  const likePost = (id) => setPosts(p => p.map(post => post.id===id ? {...post, likes:post.liked?post.likes-1:post.likes+1, liked:!post.liked} : post));

  const submitPost = () => {
    if (!newPost.title) return;
    setPosts(p => [{ id:Date.now(), author:`Du & ${DOG.name}`, avatar:DOG.emoji, ...newPost, likes:0, liked:false, time:'gerade eben', comments:0 }, ...p]);
    setNewPost({ title:'', body:'', cat:'tip' }); setShowNewPost(false);
  };

  const submitPlace = () => {
    if (!newPlace.name) return;
    setPlaces(p => [{ id:Date.now(), cat:'park', name:newPlace.name, emoji:'📍', dist:'?', rating:5.0, tags:['Neu hinzugefügt'], note:newPlace.note||'Von der Community hinzugefügt' }, ...p]);
    setNewPlace({ name:'', note:'' }); setShowAddPlace(false);
  };

  const sendAI = async () => {
    if (!aiInput.trim() || aiLoad || aiCount>=10) return;
    const msg = aiInput.replace(/[<>]/g,'').trim().slice(0,500);
    setAiInput(''); setAiCount(c=>c+1);
    const updated = [...aiMsgs, { role:'user', content:msg }];
    setAiMsgs(updated); setAiLoad(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ model:'claude-sonnet-4-6', max_tokens:1000, system:`Hundeassistent für Dogstyle2.0 (Österreich). Hund: ${DOG.name}, ${DOG.breed}, ${DOG.age} J., ${DOG.weight}kg. Antworte auf Österreichisch-Deutsch (du, gerne "Servus"), kurz und freundlich. Bei Gesundheitsfragen Tierarzt empfehlen. Österreichische Orte, Gesetze und Gewohnheiten bevorzugen.`, messages:updated.slice(-10).map(m=>({role:m.role,content:m.content})) }) });
      const data = await res.json();
      setAiMsgs(p => [...p, { role:'assistant', content:data.content?.[0]?.text||'Bitte erneut versuchen.' }]);
    } catch { setAiMsgs(p => [...p, { role:'assistant', content:'⚠️ Verbindungsfehler.' }]); }
    setAiLoad(false);
  };

  const todayRoutes = routes.filter(r => r.date===fmt(todayDate));
  const totalMin = todayRoutes.reduce((s,r)=>s+(r.duration||0),0);
  const fedCount = feedings.filter(f=>f.done).length;
  const filtPlaces = placeCat==='all' ? places : places.filter(p=>p.cat===placeCat);
  const filtPosts = postCat==='all' ? posts : posts.filter(p=>p.cat===postCat);

  const pCats = [
    {key:'all',emoji:'🗺️',label:'Alle'},
    {key:'swim',emoji:'🏊',label:'Schwimmen'},
    {key:'park',emoji:'🌿',label:'Parks'},
    {key:'trail',emoji:'🥾',label:'Trails'},
    {key:'cafe',emoji:'☕',label:'Hundefreundlich'},
  ];
  const oCats = [{key:'all',label:'Alle'},{key:'tip',label:'💡 Tipps'},{key:'question',label:'❓ Fragen'},{key:'event',label:'📅 Events'}];

  const Home = () => (
    <div>
      <div style={{ fontSize:'20px', fontWeight:'800', marginBottom:'16px' }}>Heute 📅</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginBottom:'12px' }}>
        {[{val:`${totalMin}m`,label:'Gassi',color:C.teal},{val:`${fedCount}/${feedings.length}`,label:'Mahlzeiten',color:C.accent},{val:VACC.find(v=>v.status==='fällig')?'!':'✓',label:'Impfungen',color:VACC.find(v=>v.status==='fällig')?C.danger:C.success}].map(s=>(
          <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'14px', padding:'14px 8px', textAlign:'center' }}>
            <div style={{ fontSize:'22px', fontWeight:'800', color:s.color, lineHeight:1, marginBottom:'4px' }}>{s.val}</div>
            <div style={{ fontSize:'10px', color:C.muted, fontWeight:'600' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ ...card, borderLeft:`3px solid ${C.teal}` }}>
        <div style={cTitle}>Nächster Termin</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div><div style={{ fontSize:'15px', fontWeight:'700' }}>{VET[0].reason}</div><div style={{ fontSize:'12px', color:C.muted }}>📅 {VET[0].date} · {VET[0].vet}</div></div>
          <span style={bdg(C.teal)}>BALD</span>
        </div>
      </div>
      <div style={card}>
        <div style={cTitle}>Fütterung heute</div>
        {feedings.map(f=>(
          <div key={f.id} style={{ ...row, cursor:'pointer' }} onClick={()=>toggleFeed(f.id)}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'22px', height:'22px', borderRadius:'50%', background:f.done?C.accent:'transparent', border:`2px solid ${f.done?C.accent:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'11px', color:'#fff', fontWeight:'bold' }}>{f.done?'✓':''}</div>
              <div><div style={{ fontSize:'14px', fontWeight:'600', textDecoration:f.done?'line-through':'none', color:f.done?C.muted:C.text }}>{f.type} · {f.food}</div><div style={{ fontSize:'11px', color:C.muted }}>{f.time} · {f.amount}</div></div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...card, border:`1px solid ${C.teal}44`, fontSize:'13px', color:C.muted, lineHeight:1.7, cursor:'pointer' }} onClick={()=>setActiveTab('places')}>
        🌤️ Schönes Wetter heute! Wie wäre ein Ausflug zum <strong style={{ color:C.teal }}>Wörthersee oder Neusiedler See? → 🏊</strong>
      </div>
    </div>
  );

  const RoutesTab = () => (
    <div>
      <div style={{ fontSize:'20px', fontWeight:'800', marginBottom:'16px' }}>Routen 🗺️</div>
      <RouteRecorder onSave={(r)=>setRoutes(p=>[r,...p])} />
      <div style={card}>
        <div style={cTitle}>Gespeicherte Routen ({routes.length})</div>
        {routes.length===0
          ? <div style={{ textAlign:'center', color:C.muted, padding:'12px 0', fontSize:'13px' }}>Noch keine Routen 🐾</div>
          : routes.map(r=>(
            <div key={r.id} style={row}>
              <div>
                <div style={{ fontSize:'14px', fontWeight:'700' }}>{r.name}</div>
                <div style={{ fontSize:'11px', color:C.muted }}>{r.date} · {r.time}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'13px', fontWeight:'800', color:C.teal }}>{r.duration} min</div>
                <div style={{ fontSize:'11px', color:C.muted }}>{r.distance} km</div>
              </div>
            </div>
          ))}
      </div>
      <PremiumTeaser features={['Echtes GPS-Tracking','Routen mit Community teilen','Höhenprofil & Pace-Analyse']} onWaitlist={()=>setShowWaitlist(true)} />
    </div>
  );

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
      {showAddPlace && (
        <div style={{ ...card, border:`1px solid ${C.teal}44`, marginBottom:'14px' }}>
          <div style={cTitle}>Ort hinzufügen</div>
          <input style={inp} placeholder="Name des Ortes *" value={newPlace.name} onChange={e=>setNewPlace(p=>({...p,name:e.target.value}))} />
          <input style={inp} placeholder="Kurze Beschreibung" value={newPlace.note} onChange={e=>setNewPlace(p=>({...p,note:e.target.value}))} />
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={submitPlace} style={{ flex:1, background:C.teal, color:'#0D1B2A', border:'none', borderRadius:'12px', padding:'12px', fontSize:'14px', fontWeight:'700', cursor:'pointer' }}>Hinzufügen</button>
            <button onClick={()=>setShowAddPlace(false)} style={{ flex:1, background:'transparent', color:C.muted, border:`1px solid ${C.border}`, borderRadius:'12px', padding:'12px', fontSize:'14px', cursor:'pointer' }}>Abbrechen</button>
          </div>
        </div>
      )}
      {filtPlaces.map(p=>(
        <div key={p.id} style={card}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
            <div>
              <div style={{ fontSize:'16px', fontWeight:'800' }}>{p.emoji} {p.name}</div>
              <div style={{ fontSize:'11px', color:C.muted, marginTop:'2px' }}>📍 {p.region}</div>
            </div>
            <div style={{ fontSize:'14px', fontWeight:'800', color:C.yellow }}>★ {p.rating}</div>
          </div>
          <div style={{ fontSize:'13px', color:C.muted, lineHeight:1.5, marginBottom:'10px' }}>{p.note}</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
            {p.tags.map(t=><span key={t} style={bdg(C.teal)}>{t}</span>)}
          </div>
        </div>
      ))}
      <PremiumTeaser features={['Orte auf Karte anzeigen','Community-Bewertungen abgeben','Favoriten speichern & teilen']} onWaitlist={()=>setShowWaitlist(true)} />
    </div>
  );

  const CommunityTab = () => (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
        <div>
          <div style={{ fontSize:'20px', fontWeight:'800' }}>Community 💬</div>
          <div style={{ fontSize:'11px', color:C.muted }}>{posts.length} Posts · {posts.reduce((s,p)=>s+p.likes,0)} Likes</div>
        </div>
        <button onClick={()=>setShowNewPost(true)} style={{ background:C.accent, color:'#fff', border:'none', borderRadius:'10px', padding:'8px 14px', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>+ Post</button>
      </div>
      <div style={{ display:'flex', gap:'6px', overflowX:'auto', marginBottom:'14px', paddingBottom:'4px' }}>
        {oCats.map(c=>(
          <button key={c.key} onClick={()=>setPostCat(c.key)} style={{ background:postCat===c.key?C.accent:C.surface, color:postCat===c.key?'#fff':C.muted, border:`1px solid ${postCat===c.key?C.accent:C.border}`, borderRadius:'20px', padding:'6px 12px', fontSize:'12px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
            {c.label}
          </button>
        ))}
      </div>
      {showNewPost && (
        <div style={{ ...card, border:`1px solid ${C.accent}44`, marginBottom:'14px' }}>
          <div style={cTitle}>Neuer Post</div>
          <div style={{ display:'flex', gap:'6px', marginBottom:'10px' }}>
            {[{k:'tip',l:'💡 Tipp'},{k:'question',l:'❓ Frage'},{k:'event',l:'📅 Event'}].map(c=>(
              <button key={c.k} onClick={()=>setNewPost(p=>({...p,cat:c.k}))} style={{ background:newPost.cat===c.k?C.accent:C.surface, color:newPost.cat===c.k?'#fff':C.muted, border:`1px solid ${newPost.cat===c.k?C.accent:C.border}`, borderRadius:'20px', padding:'5px 12px', fontSize:'12px', cursor:'pointer', fontWeight:'700' }}>{c.l}</button>
            ))}
          </div>
          <input style={inp} placeholder="Titel *" value={newPost.title} onChange={e=>setNewPost(p=>({...p,title:e.target.value}))} maxLength={80} />
          <textarea style={{ ...inp, height:'70px', resize:'none' }} placeholder="Was möchtest du teilen?" value={newPost.body} onChange={e=>setNewPost(p=>({...p,body:e.target.value}))} maxLength={300} />
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
            <span style={bdg(p.cat==='tip'?C.teal:p.cat==='event'?C.accent:C.muted)}>
              {p.cat==='tip'?'💡 Tipp':p.cat==='event'?'📅 Event':'❓ Frage'}
            </span>
          </div>
          <div style={{ fontSize:'14px', fontWeight:'700', marginBottom:'6px' }}>{p.title}</div>
          {p.body && <div style={{ fontSize:'13px', color:C.muted, lineHeight:1.5, marginBottom:'10px' }}>{p.body}</div>}
          <div style={{ display:'flex', gap:'16px' }}>
            <button onClick={()=>likePost(p.id)} style={{ background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', fontSize:'13px', color:p.liked?C.accent:C.muted, fontWeight:'600', padding:0 }}>
              {p.liked?'❤️':'🤍'} {p.likes}
            </button>
            <span style={{ fontSize:'13px', color:C.muted }}>💬 {p.comments}</span>
          </div>
        </div>
      ))}
      <PremiumTeaser features={['Kommentare & Antworten','Private Nachrichten','Lokale Hundegruppen']} onWaitlist={()=>setShowWaitlist(true)} />
    </div>
  );

  const MehrTab = () => (
    <div>
      <div style={{ fontSize:'20px', fontWeight:'800', marginBottom:'16px' }}>Mehr ⚙️</div>
      <div style={card}>
        <div style={cTitle}>Gesundheit 🏥</div>
        {VACC.map(v=>(<div key={v.id} style={row}><div><div style={{ fontSize:'13px', fontWeight:'600' }}>{v.name}</div><div style={{ fontSize:'11px', color:C.muted }}>Fällig: {v.nextDue}</div></div><span style={bdg(v.status==='aktuell'?C.success:C.danger)}>{v.status==='aktuell'?'✓':'FÄLLIG'}</span></div>))}
      </div>
      <div style={card}>
        <div style={cTitle}>KI-Assistent 🤖</div>
        <div style={{ background:`${C.danger}15`, borderRadius:'8px', padding:'6px 10px', marginBottom:'10px', fontSize:'11px', color:C.danger, fontWeight:'600' }}>⚕️ Kein Ersatz für tierärztliche Beratung</div>
        <div style={{ maxHeight:'180px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'8px', marginBottom:'10px' }}>
          {aiMsgs.map((m,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start' }}>
              <div style={{ maxWidth:'85%', background:m.role==='user'?C.accent:C.bg, border:m.role==='assistant'?`1px solid ${C.border}`:'none', borderRadius:'12px', padding:'8px 12px', fontSize:'12px', lineHeight:1.5, color:C.text, whiteSpace:'pre-wrap' }}>
                {m.role==='assistant'&&'🐾 '}{m.content}
              </div>
            </div>
          ))}
          {aiLoad&&<div style={{ display:'flex' }}><div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:'12px', padding:'8px 14px', color:C.accent, letterSpacing:'3px' }}>···</div></div>}
          <div ref={chatEnd} />
        </div>
        {aiCount<10 ? (
          <div style={{ display:'flex', gap:'6px' }}>
            <input style={{ ...inp, flex:1, margin:0, fontSize:'13px', padding:'8px 12px' }} placeholder={`Frage zu ${DOG.name}...`} value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendAI()} maxLength={400} />
            <button onClick={sendAI} disabled={aiLoad} style={{ background:C.accent, border:'none', borderRadius:'10px', width:'38px', height:'38px', fontSize:'16px', cursor:'pointer', flexShrink:0, opacity:aiLoad?0.5:1 }}>→</button>
          </div>
        ) : <button onClick={()=>setShowWaitlist(true)} style={{ background:C.premium, color:'#0D1B2A', border:'none', borderRadius:'10px', padding:'11px', fontSize:'13px', fontWeight:'800', cursor:'pointer', width:'100%' }}>⭐ Premium für unlimitierten Chat</button>}
        <div style={{ fontSize:'10px', color:C.muted, marginTop:'6px', textAlign:'center' }}>{10-aiCount} freie Nachrichten · <span onClick={()=>setShowPrivacy(true)} style={{ color:C.accent, cursor:'pointer' }}>Datenschutz</span></div>
      </div>
      <div style={{ ...card, border:`1px solid ${C.premium}44`, background:C.premiumSoft }}>
        <div style={{ fontSize:'11px', fontWeight:'800', color:C.premium, letterSpacing:'1px', marginBottom:'10px' }}>⭐ PREMIUM – BALD VERFÜGBAR</div>
        <div style={{ fontSize:'13px', color:C.muted, marginBottom:'12px' }}>Sicher dir jetzt 30% Early-Bird Rabatt.</div>
        <button onClick={()=>setShowWaitlist(true)} style={{ background:C.premium, color:'#0D1B2A', border:'none', borderRadius:'10px', padding:'12px', fontSize:'14px', fontWeight:'800', cursor:'pointer', width:'100%' }}>🔔 Warteliste beitreten</button>
      </div>
      <div style={card}>
        <div style={cTitle}>Rechtliches</div>
        <div style={{ ...row, cursor:'pointer' }} onClick={()=>setShowPrivacy(true)}><span style={{ fontSize:'13px', fontWeight:'600' }}>📄 Datenschutzerklärung</span><span style={{ color:C.muted }}>›</span></div>
        <div style={{ ...row, opacity:0.5 }}><span style={{ fontSize:'13px', fontWeight:'600' }}>📋 Nutzungsbedingungen</span><span style={{ color:C.muted }}>›</span></div>
        <div style={{ ...row, opacity:0.5, borderBottom:'none' }}><span style={{ fontSize:'13px', fontWeight:'600' }}>🏢 Impressum</span><span style={{ color:C.muted }}>›</span></div>
      </div>
      <div style={{ textAlign:'center', padding:'12px 0', fontSize:'11px', color:C.muted }}>Dogstyle 2.0 · v1.0.0 · 🇦🇹 Österreich · 100% Kostenlos 🐾</div>
    </div>
  );

  const tabs = [
    {id:'home',label:'Home',icon:'🏠'},
    {id:'routes',label:'Routen',icon:'🗺️'},
    {id:'places',label:'Entdecken',icon:'🏊'},
    {id:'community',label:'Community',icon:'💬'},
    {id:'mehr',label:'Mehr',icon:'⚙️'},
  ];

  const views = { home:<Home/>, routes:<RoutesTab/>, places:<PlacesTab/>, community:<CommunityTab/>, mehr:<MehrTab/> };

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", backgroundColor:C.bg, color:C.text, minHeight:'100vh', maxWidth:'430px', margin:'0 auto', display:'flex', flexDirection:'column' }}>
      <div style={{ background:'linear-gradient(135deg,#1A2A3A 0%,#1E3545 100%)', padding:'20px 20px 16px', borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
              <span style={{ fontSize:'10px', fontWeight:'800', letterSpacing:'2px', color:C.accent }}>DOGSTYLE 2.0</span>
              <span style={{ background:`${C.success}22`, color:C.success, borderRadius:'6px', padding:'2px 7px', fontSize:'9px', fontWeight:'800' }}>KOSTENLOS</span>
              <span style={{ background:'rgba(236,0,0,0.15)', color:'#EC0000', borderRadius:'6px', padding:'2px 7px', fontSize:'9px', fontWeight:'800' }}>🇦🇹 AT</span>
            </div>
            <div style={{ fontSize:'28px', fontWeight:'800', letterSpacing:'-0.5px', lineHeight:1 }}>{DOG.name} 🐾</div>
            <div style={{ fontSize:'13px', color:C.muted, marginTop:'4px' }}>{DOG.breed} · {DOG.age} Jahre</div>
          </div>
          <div style={{ fontSize:'52px', lineHeight:1 }}>{DOG.emoji}</div>
        </div>
      </div>
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
      {showWaitlist && <WaitlistModal onClose={()=>setShowWaitlist(false)} />}
      {showPrivacy && <Modal title="Datenschutz" onClose={()=>setShowPrivacy(false)}>
        <p><strong style={{color:C.text}}>App-Daten:</strong> Lokal auf deinem Gerät. <strong style={{color:C.text}}>KI-Chat:</strong> Nachrichten → Anthropic, Inc. (USA). <strong style={{color:C.text}}>Community-Posts:</strong> Für alle Nutzer sichtbar. Kein Tracking, keine Werbung.</p>
        <p>Kontakt: [deine-email@example.com]</p>
      </Modal>}
    </div>
  );
}
