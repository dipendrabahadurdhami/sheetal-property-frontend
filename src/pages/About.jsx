import React, { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   SHEETAL REAL ESTATE — ABOUT PAGE
   Aesthetic: Luxury property firm · Savills / Knight Frank register
   Tight spacing · Editorial typography · Zero bloat
═══════════════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');

:root{
  --r:#f80203;
  --ink:#0e0e0e;
  --d:#4b4b4b;
  --l:#e8e8e8;
  --ow:#f7f6f4;
  --w:#ffffff;
  --r06:rgba(248,2,3,0.06);
  --r14:rgba(248,2,3,0.14);
  --r28:rgba(248,2,3,0.28);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
body{overflow-x:hidden}

.ab{
  font-family:'DM Sans',sans-serif;
  color:var(--d);
  background:var(--w);
  overflow-x:hidden;
}

.serif{font-family:'Cormorant Garamond',serif}

/* ── PROGRESS ── */
.prog{position:fixed;top:0;left:0;height:2px;background:var(--r);z-index:9999;pointer-events:none;transition:width 0.08s linear}

/* ── SECTION REVEAL ── */
.sr{opacity:0;transform:translateY(28px);will-change:opacity,transform}
.sr.in{opacity:1;transform:translateY(0);transition:opacity 0.75s cubic-bezier(0.16,1,0.3,1),transform 0.75s cubic-bezier(0.16,1,0.3,1)}
.sr-l{opacity:0;transform:translateX(-28px)}
.sr-l.in{opacity:1;transform:translateX(0);transition:opacity 0.75s cubic-bezier(0.16,1,0.3,1),transform 0.75s cubic-bezier(0.16,1,0.3,1)}
.sr-r{opacity:0;transform:translateX(28px)}
.sr-r.in{opacity:1;transform:translateX(0);transition:opacity 0.75s cubic-bezier(0.16,1,0.3,1),transform 0.75s cubic-bezier(0.16,1,0.3,1)}

/* ── LABEL ── */
.lbl{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.lbl-line{width:22px;height:1px;background:var(--r)}
.lbl-txt{font-size:10px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:var(--r)}

/* ── HEADING ── */
.h-xl{font-size:clamp(34px,4vw,62px);font-weight:600;line-height:1.02;letter-spacing:-1.5px;color:var(--ink)}
.h-lg{font-size:clamp(26px,3vw,44px);font-weight:600;line-height:1.05;letter-spacing:-0.8px;color:var(--ink)}
.h-md{font-size:clamp(22px,2.5vw,34px);font-weight:600;line-height:1.1;letter-spacing:-0.5px;color:var(--ink)}

/* ── MARQUEE ── */
@keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.mq{display:inline-flex;animation:mq 28s linear infinite;white-space:nowrap}
.mq:hover{animation-play-state:paused}

/* ── SERVICE CARD ── */
.svc{padding:28px 24px;border:0.5px solid var(--l);background:var(--w);position:relative;overflow:hidden;transition:border-color 0.3s,transform 0.4s cubic-bezier(0.16,1,0.3,1),box-shadow 0.4s}
.svc::after{content:'';position:absolute;left:0;top:0;width:2px;height:0;background:var(--r);transition:height 0.4s cubic-bezier(0.16,1,0.3,1)}
.svc:hover{border-color:rgba(248,2,3,0.2);transform:translateY(-4px);box-shadow:0 20px 48px rgba(248,2,3,0.07)}
.svc:hover::after{height:100%}
.svc-icon{width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:var(--r06);margin-bottom:18px;transition:background 0.3s}
.svc:hover .svc-icon{background:var(--r)}
.svc:hover .svc-icon svg{stroke:#fff}

/* ── BRAND CARD ── */
.bc{position:relative;overflow:hidden;cursor:pointer;transition:transform 0.45s cubic-bezier(0.16,1,0.3,1)}
.bc:hover{transform:scale(1.02)}
.bc::after{content:'';position:absolute;inset:0;background:rgba(0,0,0,0.12);opacity:0;transition:opacity 0.3s}
.bc:hover::after{opacity:1}

/* ── VAL ITEM ── */
.vi{padding:20px 0 20px 0;border-bottom:0.5px solid var(--l);transition:padding-left 0.3s ease}
.vi:hover{padding-left:8px}
.vi:last-child{border-bottom:none}
.vi-num{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:700;color:var(--r);line-height:1;flex-shrink:0;width:44px}

/* ── PROCESS ── */
.pc{padding:28px 24px;border:0.5px solid var(--l);position:relative;overflow:hidden;transition:border-color 0.3s,box-shadow 0.35s}
.pc::before{content:'';position:absolute;top:0;left:0;height:2px;width:0;background:var(--r);transition:width 0.45s cubic-bezier(0.16,1,0.3,1)}
.pc:hover::before{width:100%}
.pc:hover{border-color:rgba(248,2,3,0.2);box-shadow:0 16px 40px rgba(248,2,3,0.06)}
.pc-n{font-family:'Cormorant Garamond',serif;font-size:44px;font-weight:700;color:var(--l);line-height:1;transition:color 0.3s}
.pc:hover .pc-n{color:var(--r)}

/* ── CITY ── */
.ct{padding:12px 10px;border:0.5px solid var(--l);text-align:center;transition:background 0.25s,border-color 0.25s;cursor:default;position:relative;overflow:hidden}
.ct::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1.5px;background:var(--r);transition:width 0.35s ease}
.ct:hover{background:var(--r06);border-color:rgba(248,2,3,0.2)}
.ct:hover::after{width:100%}

/* ── TL DOT ── */
.tl-dot{width:32px;height:32px;border-radius:50%;border:1.5px solid var(--l);background:var(--w);display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;z-index:2;transition:border-color 0.3s,background 0.3s}
.tl-item:hover .tl-dot{border-color:var(--r);background:var(--r)}
.tl-item:hover .tl-dot svg{stroke:#fff}

/* ── BUTTONS ── */
.btn-p{background:var(--r);color:#fff;border:none;padding:13px 30px;font-family:'DM Sans',sans-serif;font-weight:500;font-size:13px;letter-spacing:0.04em;cursor:pointer;transition:background 0.2s,transform 0.2s,box-shadow 0.2s;text-decoration:none;display:inline-block}
.btn-p:hover{background:#c00002;transform:translateY(-2px);box-shadow:0 12px 32px var(--r28)}
.btn-g{background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.25);padding:13px 30px;font-family:'DM Sans',sans-serif;font-weight:400;font-size:13px;letter-spacing:0.04em;cursor:pointer;transition:all 0.2s;text-decoration:none;display:inline-block}
.btn-g:hover{border-color:var(--r);color:var(--r)}

/* ── STAT BOX ── */
.sb{padding:28px 22px;border:0.5px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.03);transition:background 0.3s,border-color 0.3s;cursor:default}
.sb:hover{background:var(--r06);border-color:rgba(248,2,3,0.2)}

/* ── MAP ── */
iframe{display:block;filter:grayscale(15%)}

/* ── TEAM ── */
.tm{text-align:center;cursor:default}
.tm-av{width:88px;height:88px;border-radius:50%;margin:0 auto 12px;border:1.5px solid var(--l);overflow:hidden;transition:border-color 0.3s,transform 0.4s cubic-bezier(0.16,1,0.3,1)}
.tm:hover .tm-av{border-color:var(--r);transform:translateY(-3px)}

/* ── NOISE ── */
.noise{position:absolute;inset:0;opacity:0.025;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* ── PING ── */
@keyframes ping{0%{transform:scale(1);opacity:0.8}100%{transform:scale(2.2);opacity:0}}
.ping{animation:ping 2s cubic-bezier(0,0,0.2,1) infinite}

/* ── RESPONSIVE ── */
@media(max-width:1024px){
  .g2{grid-template-columns:1fr!important}
  .g3{grid-template-columns:1fr 1fr!important}
  .g-brand{grid-template-columns:1fr 1fr!important}
  .g-tl{grid-template-columns:1fr!important}
}
@media(max-width:768px){
  .pad{padding:64px 20px!important}
  .hero-pad{padding:80px 20px 64px!important}
  .g3{grid-template-columns:1fr!important}
  .g4{grid-template-columns:1fr 1fr!important}
  .g5{grid-template-columns:1fr 1fr!important}
  .g-stat{grid-template-columns:1fr 1fr!important}
  .g-award{grid-template-columns:1fr 1fr!important}
  .g-proc{grid-template-columns:1fr 1fr!important}
  .hero-actions{flex-direction:column!important;align-items:flex-start!important}
  .hero-pills{display:none!important}
}
@media(max-width:480px){
  .g-proc{grid-template-columns:1fr!important}
  .g5{grid-template-columns:1fr 1fr!important}
}
`;

/* ═══ HOOKS ══════════════════════════════════════════════════════════ */
function useInView(t = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [t]);
  return [ref, v];
}

function useCountUp(target, dur = 2000, active = false) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let t0 = null;
    const f = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }, [active, target, dur]);
  return n;
}

/* ═══ ATOMS ══════════════════════════════════════════════════════════ */
function Lbl({ text, light = false }) {
  return (
    <div className="lbl">
      <div className="lbl-line" style={light ? { background: "rgba(255,255,255,0.35)" } : {}} />
      <span className="lbl-txt" style={light ? { color: "rgba(255,255,255,0.45)" } : {}}>{text}</span>
    </div>
  );
}

function SR({ children, cls = "sr", delay = 0, style = {} }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} className={`${cls}${v ? " in" : ""}`}
      style={{ transitionDelay: v ? `${delay}s` : "0s", ...style }}>
      {children}
    </div>
  );
}

function Ic({ d, s = 18, stroke = "var(--r)", sw = 1.5, fill = "none" }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function Stat({ val, suf, label, active, delay }) {
  const n = useCountUp(val, 2200, active);
  return (
    <div className="sb">
      <div style={{ opacity: active ? 1 : 0, transform: active ? "none" : "translateY(10px)", transition: `all 0.6s ease ${delay}s` }}>
        <div className="serif" style={{ fontSize: "clamp(30px,4vw,48px)", fontWeight: 700, color: "var(--r)", lineHeight: 1, letterSpacing: "-1px" }}>
          {n.toLocaleString()}{suf}
        </div>
        <div style={{ marginTop: 6, fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{label}</div>
      </div>
    </div>
  );
}

/* ═══ ICONS ══════════════════════════════════════════════════════════ */
const I = {
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  key: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  bld: "M6 2h12v20H6zM12 6v4M12 14v4",
  chart: "M18 20V10M12 20V4M6 20v-6",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  map: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7v.01",
  phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.7A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.94a16 16 0 006.15 6.15l1.31-1.31a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  check: "M20 6L9 17l-5-5",
  arr: "M5 12h14M12 5l7 7-7 7",
  crown: "M3 17L7 3l5 5 5-5 4 14H3z",
  leaf: "M17 8C8 10 5.9 16.17 3.82 19.67a.84.84 0 001.38.96C7 18 11 17 15 17c5 0 6-3 6-6 0-3.5-3-7-4-3z",
  hotel: "M2 20h20M6 20V8M18 20V8M2 8h20M6 4h12M9 8v4M15 8v4M9 16v4M15 16v4",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  globe: "M12 2a10 10 0 100 20A10 10 0 0012 2z M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  cut: "M6 3l6 9m0 0l6-9m-6 9l-6 9m12-9l-6 9",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
};

/* ═══ DATA ════════════════════════════════════════════════════════════ */
const SERVICES = [
  { icon: I.home, title: "Residential Sales", desc: "Curated homes, apartments and villas across Nepal's most desirable neighbourhoods — every listing personally verified." },
  { icon: I.key, title: "Luxury Rentals", desc: "Premium rental solutions for discerning clients. Flexible leases, full tenant vetting, zero compromise." },
  { icon: I.bld, title: "Commercial Property", desc: "Offices, retail and industrial spaces across 20+ cities in Nepal's fastest-growing corridors." },
  { icon: I.chart, title: "Investment Advisory", desc: "Data-backed strategies and proprietary market intelligence to maximise ROI in Nepal's expanding market." },
  { icon: I.shield, title: "Property Management", desc: "End-to-end asset management — maintenance, tenant relations, accounts. Your investment, our responsibility." },
  { icon: I.globe, title: "Legal & Compliance", desc: "In-house legal consultants handle due diligence, documentation and land registration with full transparency." },
];

const BRANDS = [
  { name: "Queens by Sheetal", tag: "Luxury Salon & Beauty", icon: I.cut, accent: "#e879a0", bg: "url('home-banner1.gif')" },
  { name: "Sheetal Technologies", tag: "Digital Innovation & IT Solutions", icon: I.code, accent: "#60aaff", bg: "url(home-banner1.gif" },
  { name: "Sheetal Sanshee Agro Farm", tag: "Sustainable Agriculture & Farming", icon: I.leaf, accent: "#56c26a", bg: "url('home-banner1.gif')" },
  { name: "Sheetal Sanshee Multipurpose", tag: "Diversified Services & Solutions", icon: I.layers, accent: "#f0b429", bg: "url('home-banner1.gif')" },
  { name: "Sheemai Holdings", tag: "Strategic Investment & Holdings", icon: I.crown, accent: "#f80203", bg: "url('home-banner1.gif')" },
  { name: "Munal & Mayur Resort", tag: "Luxury Eco Resort · Chitwan", icon: I.hotel, accent: "#6ee7b7", bg: "url('home-banner1.gif')" },
];
const TIMELINE = [
  { yr: "2009", t: "Foundation", d: "Established in Bansbari, Kathmandu — Nepal's first dedicated property management firm.", icon: I.star },
  { yr: "2012", t: "Regional Expansion", d: "Extended to Pokhara, Chitwan, Butwal and Dharan — Nepal's most comprehensive real estate network.", icon: I.map },
  { yr: "2016", t: "10,000 Families", d: "A landmark milestone: 10,000 successful transactions. Nepal's most trusted name in property.", icon: I.home },
  { yr: "2019", t: "Brand Diversification", d: "Launched Queens by Sheetal, Sheetal Technologies and Munal & Mayur Resort.", icon: I.crown },
  { yr: "2021", t: "Digital Platform", d: "Launched Nepal's most comprehensive digital property portal with verified listings.", icon: I.code },
  { yr: "2024", t: "20+ Cities", d: "Operating across 20+ cities with 2,400+ active listings, 7 sister brands, and 80+ professionals.", icon: I.globe },
];

const VALUES = [
  { n: "01", t: "Absolute Transparency", d: "No hidden charges, no inflated valuations. Every figure is independently verifiable — always." },
  { n: "02", t: "Client Sovereignty", d: "Your ambitions drive every recommendation. We are advisors, never salespeople." },
  { n: "03", t: "Proprietary Intelligence", d: "15 years of transaction data gives us insight no newcomer can replicate in Nepal's market." },
  { n: "04", t: "Lifetime Partnership", d: "Our relationship doesn't end at closing — we support your entire property portfolio for decades." },
];

const TEAM = [
  { name: "Sheetal Shah", role: "Managing Director", ini: "SS" },
  { name: "Anil Sharma", role: "Head of Sales", ini: "AS" },
  { name: "Priya Thapa", role: "Investment Lead", ini: "PT" },
  { name: "Rajan K.C.", role: "Legal & Compliance", ini: "RK" },
  { name: "Sunita Rai", role: "Client Relations", ini: "SR" },
  { name: "Bikash Paudel", role: "Property Manager", ini: "BP" },
];

const CITIES = ["Kathmandu", "Pokhara", "Chitwan", "Butwal", "Biratnagar", "Dharan", "Hetauda", "Birgunj", "Bhaktapur", "Lalitpur", "Itahari", "Janakpur", "Nepalgunj", "Dhangadhi", "Butwal"];

const PROCESS = [
  { n: "01", t: "Discovery", d: "We listen intently — your goals, timeline, and budget guide every recommendation." },
  { n: "02", t: "Curated Match", d: "Hand-selected verified properties from our exclusive database. No filler. No wasted visits." },
  { n: "03", t: "Expert Guidance", d: "Site visits, valuations, negotiation — every detail handled with precision by our specialists." },
  { n: "04", t: "Seamless Close", d: "Legal review, documentation, registration. A smooth, stress-free closing every time." },
];

/* ═══ MAIN ════════════════════════════════════════════════════════════ */
export default function About() {
  const [hero, setHero] = useState(false);
  const [prog, setProg] = useState(0);
  const [statRef, statIn] = useInView(0.2);

  useEffect(() => {
    document.title = "About | Sheetal Real Estate Nepal";
    setTimeout(() => setHero(true), 60);
    const onScroll = () => {
      const el = document.documentElement;
      setProg((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="ab">
      <style>{CSS}</style>
      <div className="prog" style={{ width: `${prog}%` }} />

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section style={{ background: "#080808", minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div className="noise" />

        {/* Grid lines */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none" }} />

        {/* Glow */}
        <div style={{ position: "absolute", top: "-20%", right: "-8%", width: "55vw", height: "55vw", maxWidth: 800, borderRadius: "50%", background: "radial-gradient(circle,rgba(248,2,3,0.11) 0%,transparent 65%)", pointerEvents: "none" }} />

        {/* Corner accent — top right */}
        <div style={{ position: "absolute", top: 0, right: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: 28, right: 0, width: 100, height: 1, background: "rgba(248,2,3,0.35)" }} />
          <div style={{ position: "absolute", top: 0, right: 28, width: 1, height: 100, background: "rgba(248,2,3,0.35)" }} />
        </div>
        {/* Corner accent — bottom left */}
        <div style={{ position: "absolute", bottom: 0, left: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", bottom: 28, left: 0, width: 100, height: 1, background: "rgba(248,2,3,0.35)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 28, width: 1, height: 100, background: "rgba(248,2,3,0.35)" }} />
        </div>

        <div className="hero-pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 48px 80px", width: "100%" }}>
          <div className="g2" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 64, alignItems: "center" }}>

            {/* LEFT */}
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: 10, marginBottom: 28,
                opacity: hero ? 1 : 0, transform: hero ? "none" : "translateY(16px)",
                transition: "all 0.7s ease 0.05s"
              }}>
                <div style={{ width: 18, height: 1, background: "var(--r)" }} />
                <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Nepal's First Property Management Company</span>
              </div>

              <h1 className="serif" style={{
                fontSize: "clamp(38px,5.5vw,76px)", fontWeight: 600,
                lineHeight: 0.95, letterSpacing: "-2px", color: "#fff",
                opacity: hero ? 1 : 0, transform: hero ? "none" : "translateY(40px)",
                transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.12s"
              }}>
                Sheetal <em style={{ color: "var(--r)", fontStyle: "italic" }}>Real Estate</em>
              </h1>

              <p style={{
                fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.38)",
                maxWidth: 420, marginTop: 24, marginBottom: 36,
                opacity: hero ? 1 : 0, transform: hero ? "none" : "translateY(20px)",
                transition: "all 0.85s ease 0.28s"
              }}>
                शितलता प्रदान गर्दै — Since 2009, setting the standard for professional, transparent, and client-first property services across Nepal.
              </p>

              <div className="hero-actions" style={{
                display: "flex", gap: 12,
                opacity: hero ? 1 : 0, transform: hero ? "none" : "translateY(16px)",
                transition: "all 0.8s ease 0.42s"
              }}>
                <a href="#brands" className="btn-p">Our Brands</a>
                <a href="tel:+9779801000434" className="btn-g">+977 9801000434</a>
              </div>

              {/* Pills */}
              <div className="hero-pills" style={{
                display: "flex", gap: 24, marginTop: 44,
                opacity: hero ? 0.38 : 0, transition: "opacity 1s ease 0.7s"
              }}>
                {["7 Brands", "20+ Cities", "Est. 2009"].map(t => (
                  <span key={t} style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>{t}</span>
                ))}
              </div>
            </div>

            {/* RIGHT — stat grid */}
            <div style={{
              opacity: hero ? 1 : 0, transform: hero ? "none" : "translateX(32px)",
              transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.22s"
            }}>
              <div className="g-stat" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                {[
                  { v: "10,000+", l: "Families Served" },
                  { v: "15+", l: "Years Excellence" },
                  { v: "2,400+", l: "Active Listings" },
                  { v: "20+", l: "Cities in Nepal" },
                ].map(s => (
                  <div key={s.l} className="sb">
                    <div className="serif" style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 700, color: "var(--r)", lineHeight: 1 }}>{s.v}</div>
                    <div style={{ marginTop: 5, fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 1, padding: "14px 18px", background: "rgba(248,2,3,0.07)", border: "0.5px solid rgba(248,2,3,0.18)", display: "flex", alignItems: "center", gap: 10 }}>
                <Ic d={I.map} s={13} stroke="var(--r)" />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>Bansbari, Kathmandu · Serving Nepal since 2009</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          opacity: hero ? 0.28 : 0, transition: "opacity 1.2s ease 1s"
        }}>
          <span style={{ fontSize: 8, letterSpacing: "0.26em", color: "#fff", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom,#fff,transparent)" }} />
        </div>
      </section>

      {/* ══ MARQUEE ════════════════════════════════════════════════════ */}
      <div style={{ background: "var(--r)", padding: "11px 0", overflow: "hidden" }}>
        <div className="mq">
          {Array(10).fill(0).map((_, i) => (
            <span key={i} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: "rgba(255,255,255,0.85)", paddingRight: 56, textTransform: "uppercase" }}>
              Real Estate · Salon · Technology · Agro Farm · Holdings · Hospitality · Multipurpose ·
            </span>
          ))}
        </div>
      </div>



      {/* ══ STORY ══════════════════════════════════════════════════════ */}
      <section className="pad" style={{ background: "var(--ow)", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <SR cls="sr-l">
              <Lbl text="Our Story" />
              <h2 className="serif h-lg" style={{ marginBottom: 22 }}>Built on Trust.<br /><em>Driven by Excellence.</em></h2>
              {[
                "Founded in 2009 and headquartered in Bansbari, Kathmandu, Sheetal Real Estate was born from one conviction — that Nepali families deserve professional, honest, and expert property guidance.",
                "As Nepal's first dedicated property management firm, we didn't just enter a market. We built one. While competitors listed properties, we built relationships that endure for decades.",
                "Today, under Managing Director Sheetal Shah, we operate across 20+ cities with 7 sister brands and 80+ professionals — the most trusted real estate enterprise in Nepal.",
              ].map((p, i) => (
                <p key={i} style={{ fontSize: 14, lineHeight: 1.8, color: "var(--d)", marginBottom: 14, opacity: 0.8 }}>{p}</p>
              ))}
              <div style={{ marginTop: 24, padding: "16px 20px", background: "#fff", borderLeft: "3px solid var(--r)", display: "flex", alignItems: "center", gap: 14 }}>
                <Ic d={I.map} s={16} stroke="var(--r)" />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>Sheetal Real Estate Pvt. Ltd.</div>
                  <div style={{ fontSize: 11, color: "var(--d)", opacity: 0.6, marginTop: 2 }}>Bansbari, Opp. Namuna Fashion College, Kathmandu</div>
                </div>
              </div>
            </SR>

            <SR cls="sr-r" delay={0.1}>
              <div style={{ position: "relative" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <img src="/home-banner1.gif" alt="" style={{ width: "100%", height: 180, objectFit: "cover" }}
                    onError={e => { e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80"; }} />
                  <img src="/home-banner2.gif" alt="" style={{ width: "100%", height: 180, objectFit: "cover", marginTop: 28 }}
                    onError={e => { e.target.src = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80"; }} />
                </div>
                <div style={{ position: "absolute", bottom: -16, left: -16, background: "var(--r)", color: "#fff", padding: "18px 22px", boxShadow: "0 16px 40px var(--r28)" }}>
                  <div className="serif" style={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>15+</div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", marginTop: 5, opacity: 0.85, textTransform: "uppercase" }}>Years of Excellence</div>
                </div>
              </div>
            </SR>
          </div>
        </div>
      </section>

      {/* ══ SERVICES ═══════════════════════════════════════════════════ */}
      <section className="pad" style={{ background: "#fff", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SR>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
              <div>
                <Lbl text="What We Do" />
                <h2 className="serif h-lg">Full-Spectrum<br /><em>Real Estate Services</em></h2>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "var(--d)", opacity: 0.6, maxWidth: 320 }}>
                Every need managed under one roof by Nepal's most experienced professionals.
              </p>
            </div>
          </SR>
          <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1 }}>
            {SERVICES.map((s, i) => (
              <SR key={s.title} delay={i * 0.06}>
                <div className="svc">
                  <div className="svc-icon"><Ic d={s.icon} s={18} stroke="var(--r)" /></div>
                  <h3 className="serif" style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: "var(--d)", opacity: 0.65 }}>{s.desc}</p>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SISTER BRANDS ══════════════════════════════════════════════ */}
      <section id="brands" className="pad" style={{ background: "var(--ink)", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SR>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
              <div>
                <Lbl text="Our Brands" light />
                <h2 className="serif" style={{ fontSize: "clamp(24px,3vw,42px)", fontWeight: 600, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.8px" }}>
                  The Sheetal<br /><em style={{ color: "var(--r)" }}>Business Empire</em>
                </h2>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.35)", maxWidth: 300 }}>
                Seven distinct brands across real estate, hospitality, technology, agriculture and beauty.
              </p>
            </div>
          </SR>

          {/* Flagship */}
          <SR cls="sr" delay={0}>
            <div className="bc" style={{ background: "#111", height: 180, marginBottom: 1, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 50%,rgba(248,2,3,0.14) 0%,transparent 55%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "32px 40px", gap: 36 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(248,2,3,0.1)", border: "1px solid rgba(248,2,3,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Ic d={I.bld} s={22} stroke="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(248,2,3,0.65)", textTransform: "uppercase", marginBottom: 6 }}>Flagship Brand</div>
                  <div className="serif" style={{ fontSize: "clamp(20px,2.8vw,34px)", fontWeight: 700, color: "#fff", lineHeight: 1 }}>Sheetal Real Estate</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginTop: 5 }}>Nepal's First & Most Trusted Property Management Company</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 28, flexShrink: 0 }}>
                  {[["10,000+", "Families"], ["2,400+", "Listings"], ["20+", "Cities"]].map(([v, l]) => (
                    <div key={l} style={{ textAlign: "center" }}>
                      <div className="serif" style={{ fontSize: 24, fontWeight: 700, color: "var(--r)" }}>{v}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 3 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SR>

          {/* Other 6 */}
          <div className="g-brand" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1 }}>
            {BRANDS.map((b, i) => (
              <SR key={b.name} delay={i * 0.05 + 0.08}>
                <div
                  className="bc"
                  style={{
                    backgroundImage: b.bg,           // Changed to backgroundImage
                    backgroundSize: 'cover',        // Ensures photo fills the box
                    backgroundPosition: 'center',    // Centers the photo
                    height: 160,
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {/* Dark overlay to ensure text is visible over the photo */}
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />

                  {/* Your existing accent gradient */}
                  <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 75% 25%,${b.accent}18 0%,transparent 55%)` }} />

                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "20px 22px" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                      <Ic d={b.icon} s={16} stroke={b.accent} />
                    </div>
                    <div className="serif" style={{ fontSize: 16, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 3 }}>{b.tag}</div>
                  </div>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TIMELINE ═══════════════════════════════════════════════════ */}
      <section className="pad" style={{ background: "var(--ow)", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SR style={{ marginBottom: 48 }}>
            <Lbl text="Our Journey" />
            <h2 className="serif h-lg"><em>Milestones</em> That Define Us</h2>
          </SR>
          <div className="g-tl" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 56px" }}>
            {TIMELINE.map((t, i) => (
              <SR key={t.yr} delay={i * 0.07}>
                <div className="tl-item" style={{ display: "flex", gap: 16, marginBottom: 28 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div className="tl-dot"><Ic d={t.icon} s={13} stroke="var(--d)" /></div>
                    {i < TIMELINE.length - 2 && <div style={{ width: 1, flex: 1, minHeight: 32, background: "var(--l)", marginTop: 4 }} />}
                  </div>
                  <div style={{ paddingBottom: 28 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span className="serif" style={{ fontSize: 19, fontWeight: 700, color: "var(--r)" }}>{t.yr}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{t.t}</span>
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.75, color: "var(--d)", opacity: 0.65 }}>{t.d}</p>
                  </div>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VALUES ══════════════════════════════════════════════════════ */}
      <section className="pad" style={{ background: "#fff", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "stretch" }}>

            {/* Left */}
            <SR cls="sr-l" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Lbl text="Why Choose Us" />
              <h2 className="serif h-lg" style={{ marginBottom: 12 }}>The Sheetal<br /><em>Standard</em></h2>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "var(--d)", opacity: 0.6, marginBottom: 32 }}>
                What separates us from every other real estate firm in Nepal.
              </p>
              {VALUES.map((v, i) => (
                <SR key={v.n} delay={i * 0.07}>
                  <div className="vi" style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                    <div className="vi-num">{v.n}</div>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{v.t}</h4>
                      <p style={{ fontSize: 12, lineHeight: 1.75, color: "var(--d)", opacity: 0.6, margin: 0 }}>{v.d}</p>
                    </div>
                  </div>
                </SR>
              ))}
            </SR>

            {/* Right — trust panel */}
            <SR cls="sr-r" delay={0.12} style={{ display: "flex" }}>
              <div style={{ flex: 1, background: "var(--ink)", padding: "44px 38px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 180, height: 180, background: "radial-gradient(circle,rgba(248,2,3,0.15) 0%,transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", left: 0, top: 0, width: 2, height: "100%", background: "var(--r)" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div className="serif" style={{ fontSize: 40, color: "var(--r)", lineHeight: 1, marginBottom: 16 }}>★</div>
                  <h3 className="serif" style={{ fontSize: 22, fontWeight: 600, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>
                    Nepal's Most Trusted <em>Real Estate Brand</em>
                  </h3>
                  <p style={{ fontSize: 12, lineHeight: 1.8, color: "rgba(255,255,255,0.35)", marginBottom: 28 }}>
                    Fifteen years of consistent excellence has made Sheetal synonymous with integrity, professionalism, and results.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {["10,000+ Families Served", "Nepal's First Property Management Firm", "7 Sister Brands & Growing", "20+ Cities Across Nepal", "Verified Listings Only", "In-House Legal & Compliance"].map(item => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--r)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Ic d={I.check} s={9} stroke="#fff" sw={2.5} />
                        </div>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SR>
          </div>
        </div>
      </section>

      {/* ══ AWARDS ══════════════════════════════════════════════════════ */}
      <section style={{ background: "var(--r)", padding: "40px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="g-award" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1 }}>
            {[
              { sym: "★", text: "Nepal's #1 Property Management" },
              { sym: "◆", text: "Best Real Estate Brand 2023" },
              { sym: "▲", text: "Excellence in Client Service" },
              { sym: "●", text: "Most Trusted Brand 2024" },
            ].map((a, i) => (
              <SR key={a.text} delay={i * 0.06}>
                <div style={{ padding: "22px 16px", background: "rgba(255,255,255,0.08)", textAlign: "center", borderTop: "1.5px solid rgba(255,255,255,0.18)", transition: "background 0.25s", cursor: "default" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>
                  <div style={{ fontSize: 18, color: "#fff", marginBottom: 8, opacity: 0.65 }}>{a.sym}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#fff", lineHeight: 1.5 }}>{a.text}</div>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TEAM ════════════════════════════════════════════════════════ */}
      <section className="pad" style={{ background: "#fff", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SR style={{ textAlign: "center", marginBottom: 48 }}>
            <Lbl text="Our People" />
            <h2 className="serif h-lg">The Minds Behind <em>Sheetal</em></h2>
            <p style={{ fontSize: 13, color: "var(--d)", opacity: 0.55, marginTop: 10, maxWidth: 380, margin: "10px auto 0" }}>
              Experienced professionals combining deep local knowledge with world-class service standards.
            </p>
          </SR>
          <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 24 }}>
            {TEAM.map((m, i) => (
              <SR key={m.name} delay={i * 0.06}>
                <div className="tm">
                  <div className="tm-av">
                    <div style={{ width: "100%", height: "100%", background: "var(--r06)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: "var(--r)" }}>{m.ini}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: "var(--r)", marginTop: 2, letterSpacing: "0.04em" }}>{m.role}</div>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CITIES ══════════════════════════════════════════════════════ */}
      <section className="pad" style={{ background: "var(--ow)", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SR style={{ textAlign: "center", marginBottom: 40 }}>
            <Lbl text="Market Presence" />
            <h2 className="serif h-lg">Nepal's Widest <em>Property Network</em></h2>
          </SR>
          <div className="g5" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 1 }}>
            {CITIES.map((c, i) => (
              <SR key={c} delay={i * 0.03}>
                <div className="ct">
                  <div style={{ fontSize: 11, marginBottom: 5, color: "var(--r)", opacity: 0.6 }}>◉</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>{c}</div>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROCESS ═════════════════════════════════════════════════════ */}
      <section className="pad" style={{ background: "#fff", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SR style={{ textAlign: "center", marginBottom: 48 }}>
            <Lbl text="How We Work" />
            <h2 className="serif h-lg">A Process Built <em>Around You</em></h2>
          </SR>
          <div className="g-proc" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1 }}>
            {PROCESS.map((p, i) => (
              <SR key={p.n} delay={i * 0.07}>
                <div className="pc">
                  <div className="pc-n">{p.n}</div>
                  <h4 className="serif" style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)", margin: "8px 0 10px" }}>{p.t}</h4>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: "var(--d)", opacity: 0.6 }}>{p.d}</p>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MAP + CONTACT ════════════════════════════════════════════════ */}
      <section className="pad" style={{ background: "var(--ink)", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SR style={{ marginBottom: 40 }}>
            <Lbl text="Find Us" light />
            <h2 className="serif" style={{ fontSize: "clamp(24px,3vw,42px)", fontWeight: 600, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.8px" }}>
              Visit Our <em style={{ color: "var(--r)" }}>Office</em>
            </h2>
          </SR>

          <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            <SR cls="sr-l">
              <iframe
                title="Sheetal Real Estate Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.4887065906547!2d85.33117!3d27.73978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19f6d5c2f48f%3A0x4dfff5a7e7399fb8!2sBansbari%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1699000000000!5m2!1sen!2snp"
                width="100%" height="380" style={{ border: 0, display: "block" }}
                allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </SR>

            <SR cls="sr-r" delay={0.08}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)", height: 380, padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div className="serif" style={{ fontSize: 36, fontWeight: 700, color: "var(--r)", lineHeight: 1, marginBottom: 6 }}>HQ</div>
                  <h3 className="serif" style={{ fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 20 }}>Sheetal Real Estate Pvt. Ltd.</h3>
                  {[
                    { icon: I.map, text: "Bansbari, Opposite Namuna Fashion College, Kathmandu, Nepal" },
                    { icon: I.phone, text: "+977 9801000434 / 9801000435" },
                    { icon: I.mail, text: "info@sheetalproperty.com" },
                  ].map((c, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
                      <div style={{ marginTop: 1, flexShrink: 0 }}><Ic d={c.icon} s={13} stroke="var(--r)" /></div>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{c.text}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ width: "100%", height: 0.5, background: "rgba(255,255,255,0.07)", marginBottom: 20 }} />
                  <div style={{ display: "flex", gap: 10 }}>
                    <a href="tel:+9779801000434" className="btn-p" style={{ flex: 1, textAlign: "center", fontSize: 12 }}>Call Now</a>
                    <a href="mailto:info@sheetalproperty.com" className="btn-g" style={{ flex: 1, textAlign: "center", fontSize: 12 }}>Email Us</a>
                  </div>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 12, letterSpacing: "0.06em", textAlign: "center" }}>SUN – FRI · 9:00 AM – 6:00 PM</p>
                </div>
              </div>
            </SR>
          </div>

          {/* Branch offices */}
          <SR delay={0.14} style={{ marginTop: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1 }}>
              {[
                { brand: "Munal & Mayur Resort", loc: "Patrenesh, Chitwan, Nepal", icon: I.hotel },
                { brand: "Queens by Sheetal", loc: "Kathmandu, Nepal", icon: I.cut },
                { brand: "Chitwan Tourism Village", loc: "Chitwan National Park Area, Nepal", icon: I.map },
              ].map(o => (
                <div key={o.brand} style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.05)", padding: "20px 20px", display: "flex", gap: 14, alignItems: "center", transition: "background 0.25s,border-color 0.25s", cursor: "default" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,2,3,0.05)"; e.currentTarget.style.borderColor = "rgba(248,2,3,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(248,2,3,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Ic d={o.icon} s={14} stroke="var(--r)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{o.brand}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", marginTop: 2 }}>{o.loc}</div>
                  </div>
                </div>
              ))}
            </div>
          </SR>
        </div>
      </section>

      {/* ══ TESTIMONIAL ═════════════════════════════════════════════════ */}
      <section className="pad" style={{ background: "var(--ow)", padding: "72px 48px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <SR>
            <div className="serif" style={{ fontSize: 56, color: "var(--r)", lineHeight: 1, marginBottom: 16, opacity: 0.4, fontStyle: "italic" }}>"</div>
            <p className="serif" style={{ fontSize: "clamp(18px,2.2vw,26px)", fontWeight: 400, color: "var(--ink)", lineHeight: 1.6, marginBottom: 28, letterSpacing: "-0.3px", fontStyle: "italic" }}>
              Listen To Your Real Estate Agent Not Your Friend's Uncle Who Bought A House 7 Years Ago 
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--r06)", border: "1px solid rgba(248,2,3,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: 13, fontWeight: 700, color: "var(--r)" }}>ST</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Sanit Tamang </div>
                <div style={{ fontSize: 10, color: "var(--d)", opacity: 0.45, letterSpacing: "0.1em", textTransform: "uppercase" }}>CEO, Sheetal Real Estate</div>
              </div>
            </div>
          </SR>
        </div>
      </section>

    </div>
  );
}