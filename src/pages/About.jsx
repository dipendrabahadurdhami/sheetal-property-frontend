import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import '../index.css';

/* ═══ HOOKS ══════════════════════════════════════════════════════════ */
function useInView(t = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setV(true); },
      { threshold: t }
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [t]);
  return [ref, v];
}

function useWindowWidth() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h, { passive: true });
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

/* ═══ ATOMS ══════════════════════════════════════════════════════════ */
function Lbl({ text, center = false }) {
  return (
    <div className="lbl" style={center ? { justifyContent: "center" } : {}}>
      <div className="lbl-line" />
      <span className="lbl-txt">{text}</span>
      <div className="lbl-line" />
    </div>
  );
}

function SR({ children, cls = "sr", delay = 0, style = {} }) {
  const [ref, v] = useInView();
  return (
    <div
      ref={ref}
      className={`${cls}${v ? " in" : ""}`}
      style={{ transitionDelay: v ? `${delay}s` : "0s", ...style }}
    >
      {children}
    </div>
  );
}

function Ic({ d, s = 18, stroke = "var(--r)", sw = 1.5, fill = "none" }) {
  return (
    <svg
      width={s} height={s} viewBox="0 0 24 24"
      fill={fill} stroke={stroke} strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

/* Photo frame used everywhere so every image block feels consistent */
function Photo({ src, alt, ratio = "4/3", radius = 8, fallback, style = {} }) {
  return (
    <div style={{
      position: "relative", overflow: "hidden",
      width: "100%", aspectRatio: ratio, borderRadius: radius,
      background: "var(--r06)", ...style,
    }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        onError={e => { if (fallback) e.target.src = fallback; }}
      />
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
  crown: "M3 17L7 3l5 5 5-5 4 14H3z",
  leaf: "M17 8C8 10 5.9 16.17 3.82 19.67a.84.84 0 001.38.96C7 18 11 17 15 17c5 0 6-3 6-6 0-3.5-3-7-4-3z",
  hotel: "M2 20h20M6 20V8M18 20V8M2 8h20M6 4h12M9 8v4M15 8v4M9 16v4M15 16v4",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  globe: "M12 2a10 10 0 100 20A10 10 0 0012 2z M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  cut: "M6 3l6 9m0 0l6-9m-6 9l-6 9m12-9l-6 9",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  wellness: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  external: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3",
  quote: "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h1v1c0 1-1 2-2 2s-1 .008-1 1.031C2 20.612 2.5 21 3 21zM14 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h1v1c0 1-1 2-2 2s-1 .008-1 1.031C13 20.612 13.5 21 14 21z",
  play: "M5 3l14 9-14 9V3z",
  arrow: "M5 12h14M12 5l7 7-7 7",
  award: "M12 15a7 7 0 100-14 7 7 0 000 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
};

/* ═══ DATA ════════════════════════════════════════════════════════════ */
const SERVICES = [
  { icon: I.home, title: "Exclusive Property Sales", desc: "We help property owners sell strategically through branding, digital marketing, professional presentations, and our wide buyer and broker network.", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80&auto=format&fit=crop" },
  { icon: I.shield, title: "Property Management", desc: "From tenant handling to operational coordination, we manage properties with full professionalism, accountability, and long-term care.", img: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80&auto=format&fit=crop" },
  { icon: I.bld, title: "Real Estate Development", desc: "We develop and market our own plotting, housing, hospitality, and tourism-focused projects designed for modern Nepal.", img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80&auto=format&fit=crop" },
  { icon: I.hotel, title: "Investment & Hospitality", desc: "Our expansion into hospitality and wellness-driven destinations creates high-potential investment ecosystems tied to tourism and lifestyle growth.", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&auto=format&fit=crop" },
  { icon: I.chart, title: "Strategic Asset Advisory", desc: "We work as strategic partners for property owners and investors — combining market intelligence, branding, and sales systems to maximise project value.", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&auto=format&fit=crop" },
  { icon: I.globe, title: "Digital-First Marketing", desc: "Modern branding, digital campaigns, and online presence strategies that position your property for maximum reach and premium buyers.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop" },
];

/* Turns a brand's full name into a .com domain, e.g.
   "Munal & Mayur Resort Pvt.Ltd" -> munalmayurresortpvtltd.com
   Update BRAND_DOMAIN_OVERRIDES below for any brand whose real
   domain doesn't follow this exact pattern. */
const BRAND_DOMAIN_OVERRIDES = {
  // "Queens by Shetal": "https://queensbyshetal.com",
};
function brandDomain(name) {
  if (BRAND_DOMAIN_OVERRIDES[name]) return BRAND_DOMAIN_OVERRIDES[name];
  const slug = name
    .replace(/pvt\.?\s*ltd\.?/gi, "pvtltd")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  return `https://www.${slug}.com`;
}

const BRANDS = [
  { name: "Queens by Shetal", tag: "Luxury Salon & Beauty", icon: I.cut, bg: "url('queen.png')" },
  { name: "Shetal Technologies", tag: "Digital Innovation & IT Solutions", icon: I.code, bg: "url('technology.png')" },
  { name: "Shetal Sanshee Agro Farm Pvt.Ltd", tag: "Sustainable Agriculture & Farming", icon: I.leaf, bg: "url('Farm.png')" },
  { name: "Shetal Sanshee Multipurpose", tag: "Diversified Services & Solutions", icon: I.layers, bg: "url('multi.png')" },
  { name: "Sheemai Holdings", tag: "Strategic Investment & Holdings", icon: I.crown, bg: "url('holding.png')" },
  { name: "Munal & Mayur Resort Pvt.Ltd", tag: "Luxury Eco Resort · Chitwan", icon: I.hotel, bg: "url('munal.png')" },
];

const TIMELINE = [
  { yr: "2015", t: "Foundation", d: "Shetal Real Estate was founded with a vision to modernise and professionalise Nepal's property industry.", icon: I.star },
  { yr: "2017", t: "First Major Projects", d: "Successfully launched our first residential colony and plotting development projects across Kathmandu Valley.", icon: I.home },
  { yr: "2019", t: "Hospitality Expansion", d: "Entered the hospitality and wellness sector — Munal & Mayur Resort established, creating investment ecosystems tied to Nepal's tourism growth.", icon: I.hotel },
  { yr: "2021", t: "Digital Transformation", d: "Launched a digital-first marketing approach — professional presentations, online networks, and verified buyer pipelines.", icon: I.code },
  { yr: "2023", t: "Shetal Group Vision", d: "Expanded toward the broader Shetal Group ecosystem, merging real estate, beauty, technology, agriculture, and investment.", icon: I.crown },
  { yr: "2025", t: "7 Brands & Growing", d: "Today, Shetal Group operates 7 sister brands across Nepal — building destinations and long-term value for generations.", icon: I.globe },
];

const VALUES = [
  { n: "01", t: "Transparency Above All", d: "No hidden agendas, no inflated figures. Every decision and recommendation is clear, honest, and independently verifiable." },
  { n: "02", t: "Strategic Partnership", d: "We are not a traditional brokerage. We act as dedicated partners who combine market expertise, branding, and sales systems for your benefit." },
  { n: "03", t: "Professionalism & Results", d: "Modern systems, skilled teams, and a digital-first approach that sets a new benchmark for Nepal's real estate industry." },
  { n: "04", t: "Long-Term Relationships", d: "Our commitment extends well beyond a single transaction — we build lasting partnerships focused on trust, growth, and shared success." },
];

/* Real team members. NOTE: Manil's role wasn't specified — using
   "Team Member" as a placeholder until you confirm the exact title. */
const TEAM = [
  { name: "Govinda Shrestha", role: "CEO", ini: "GS", photo: "/member/gobind.jpeg" },
  { name: "Nikesh Kumar Ojha", role: "Sales Executive", ini: "NKO", photo: "/member/nikesh.jpeg" },
  { name: "Manil Krishna Vaidhya", role: "Sales Executive", ini: "MKV", photo: "/member/manil.jpeg" },
  { name: "Astha Karki", role: "CSR", ini: "AK", photo: "/member/astha.jpeg" },
  { name: "Deepmala Gupta", role: "CSR", ini: "DG", photo: "/member/deepmala.jpeg" },
  { name: "Dipendra Dhami", role: "Technical  Expert", ini: "DD", photo: "/member/dipendra.png" },
  { name: "Sunil Raj Karki", role: "Operations Manager", ini: "SRK", photo: "/member/sunil.jpeg" },
  { name: "Prakriti Gautam", role: "CSR", ini: "PG", photo: "/member/prakriti.jpeg" },
  { name: "Suraj Kumar Sardar", role: "Video Editor", ini: "SKS", photo: "/member/suraj.jpeg" },
  { name: "Aditya Rai", role: "Digital Marketing Executive", ini: "ARS", photo: "/member/aditya.jpeg" },
  { name: "Parkash Karki", role: "Accountant", ini: "PK", photo: "/member/parkash.jpeg" },
  
];

const CITIES = [
  { name: "Kathmandu", img: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=600&q=80&auto=format&fit=crop" },
  { name: "Lalitpur", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Patan_Durbar_Square_(114).JPG?width=600" },
  { name: "Bhaktapur", img: "https://commons.wikimedia.org/wiki/Special:FilePath/55_Window_Palace%2C_Bhaktapur_Durbar_Square.jpg?width=600" },
  { name: "Chitwan", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Greater_one-horned_rhinoceros_at_Chitwan.jpg?width=600" },
  { name: "Nepal", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80&auto=format&fit=crop" },
];

const PROCESS = [
  { n: "01", t: "Discovery", d: "We understand your goals, timeline, and investment vision before making any recommendation.", img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=700&q=80&auto=format&fit=crop" },
  { n: "02", t: "Strategic Match", d: "Hand-selected projects and properties from our verified network — no filler, no wasted visits.", img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=700&q=80&auto=format&fit=crop" },
  { n: "03", t: "Expert Guidance", d: "Valuations, branding, negotiation, and marketing — every detail handled by dedicated specialists.", img: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=700&q=80&auto=format&fit=crop" },
  { n: "04", t: "Seamless Close", d: "Legal review, documentation, and registration. A smooth, transparent closing every single time.", img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=700&q=80&auto=format&fit=crop" },
];

const GALLERY = [
  { src: "/property/11.jpeg", size: "big" },
  { src: "/property/17.jpeg", size: "normal" },
  { src: "/property/23.jpeg", size: "normal" },
  { src: "/property/9.png", size: "tall" },
  { src: "/property/8.png", size: "normal" },
  { src: "/property/18.jpeg", size: "normal" },
   { src: "/property/19.jpeg", size: "normal" },
  { src: "/property/12.jpeg", size: "normal" },
  { src: "/property/16.jpeg", size: "normal" },
  { src: "/property/24.jpeg", size: "normal" },
  { src: "/property/20.jpeg", size: "normal" },
  { src: "/property/21.jpeg", size: "normal" },
];

const STATS_BAND = [
  { v: "500+", l: "Families Served", icon: I.users },
  { v: "10+", l: "Years of Vision", icon: I.award },
  { v: "2000+", l: "Active Listings", icon: I.home },
  { v: "7", l: "Sister Brands", icon: I.crown },
];

/* ═══ CHIP ════════════════════════════════════════════════════════════ */
const Chip = ({ children }) => (
  <span style={{
    display: "inline-block",
    fontSize: 9, fontWeight: 800,
    letterSpacing: "0.12em", textTransform: "uppercase",
    color: "#E02424", background: "#FEF2F2",
    border: "1px solid #FECACA",
    padding: "3px 8px", borderRadius: 4,
  }}>
    {children}
  </span>
);

/* ═══ COLOURS ════════════════════════════════════════════════════════ */
const C = {
  white: "#fff",
  gray: "#F5F6F8",
  navy: "#0F172A",
  red: "#E02424",
  border: "#E9EAEC",
  muted: "#64748B",
};

/* ═══ SEC ════════════════════════════════════════════════════════════
   Every section in the page (bands included) now pulls its vertical
   padding from THIS one component, so the rhythm between sections
   stays consistent instead of some being hand-tuned to a different
   pixel value than the rest. */
function Sec({ children, bg = C.white, style: sx = {}, id, py, px }) {
  return (
    <section id={id} style={{
      background: bg, padding: `${py} ${px}`,
      borderBottom: `1px solid ${C.border}`, ...sx,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

/* ═══ SHEAD ══════════════════════════════════════════════════════════ */
function SHead({ label, title, sub, center = false, mob, tab }) {
  const [ref, v] = useInView();
  return (
    <div
      ref={ref}
      className={`sr${v ? " in" : ""}`}
      style={{ marginBottom: mob ? 26 : 40, textAlign: center ? "center" : "left" }}
    >
      <Lbl text={label} center={center} />
      <h2 className="serif" style={{
        fontSize: mob ? 22 : tab ? 30 : 38, fontWeight: 900,
        color: C.navy, lineHeight: 1.15, letterSpacing: "-0.4px",
        fontStyle: "normal", marginBottom: sub ? 10 : 0,
      }}>{title}</h2>
      {sub && (
        <p style={{
          fontSize: 13.5, lineHeight: 1.8,
          color: C.muted, maxWidth: 460,
          margin: center ? "0 auto" : 0,
        }}>{sub}</p>
      )}
    </div>
  );
}

/* Hero background slideshow — mix of real Nepal/Kathmandu shots and
   real-estate architecture. Swap any of these for your own property
   photography whenever it's ready. */
const HERO_SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1800&q=80&auto=format&fit=crop",
    caption: "Kathmandu Valley, Nepal",
  },
  {
    src: "https://images.unsplash.com/photo-1757359056339-22968344cce6?w=1800&q=80&auto=format&fit=crop",
    caption: "Modern residential development",
  },
  {
    src: "https://images.unsplash.com/photo-1680471818128-b85e28f34edd?w=1800&q=80&auto=format&fit=crop",
    caption: "Swayambhunath, Kathmandu",
  },
  {
    src: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=1800&q=80&auto=format&fit=crop",
    caption: "Contemporary architecture",
  },
];

/* ═══ MAIN ════════════════════════════════════════════════════════════ */
export default function About() {
  const [hero, setHero] = useState(false);
  const [prog, setProg] = useState(0);
  const [slide, setSlide] = useState(0);
  const w = useWindowWidth();
  const mob = w < 768;
  const tab = w < 1024;

  useEffect(() => {
    setTimeout(() => setHero(true), 60);
    const onScroll = () => {
      const el = document.documentElement;
      setProg((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setSlide(s => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  /* ── Layout tokens — every section (Sec + the few raw <section>s below)
     now reads padding from these two values, and "band" is a slightly
     tighter version used only for slim accent strips, scaled the same
     way across breakpoints so nothing feels randomly sized next to
     its neighbours. ── */
  const px = mob ? "20px" : tab ? "36px" : "64px";
  const py = mob ? "48px" : tab ? "64px" : "88px";
  const bandPy = mob ? "26px" : tab ? "32px" : "40px";

  const fade = (on, delay = 0, dir = "up") => ({
    opacity: on ? 1 : 0,
    transform: on ? "none"
      : dir === "right" ? "translateX(20px)"
        : "translateY(18px)",
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s,
                 transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  return (
    <div className="ab">
      <Helmet>
        <title>About Us — Sheetal Real Estate Nepal | Nepal's Trusted Property Company</title>
        <meta name="description" content="Learn about Sheetal Real Estate Nepal — Nepal's modern real estate company offering exclusive property sales, property management, real estate development and investment solutions since 2015." />
        <meta name="keywords" content="about Sheetal Property Nepal, Shetal Real Estate Nepal, real estate company Nepal, property company Kathmandu, Shetal Group Nepal" />
        <link rel="canonical" href="https://sheetalproperty.com/about" />
        <meta property="og:title" content="About Sheetal Real Estate Nepal | Nepal's Trusted Property Company" />
        <meta property="og:description" content="Nepal's modern real estate company offering exclusive property sales, property management and real estate development since 2015." />
        <meta property="og:url" content="https://sheetalproperty.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sheetal Property Nepal" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="About Sheetal Real Estate Nepal" />
      </Helmet>
      <div className="prog" style={{ width: `${prog}%` }} />

      {/* ══ HERO — fully re-balanced, centered, symmetric ══════════════ */}
      <section style={{
        position: "relative",
        minHeight: mob ? 560 : tab ? 700 : 820,
        overflow: "hidden",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
      }}>
        {/* slideshow */}
        {HERO_SLIDES.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.caption}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%", objectFit: "cover",
              opacity: i === slide ? 1 : 0,
              transform: i === slide ? "scale(1.04)" : "scale(1)",
              transition: "opacity 1.4s ease, transform 7s ease",
            }}
          />
        ))}

        {/* legibility scrim — symmetric top-down, no lopsided diagonal */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(15,23,42,0.78) 0%, rgba(15,23,42,0.55) 32%, rgba(15,23,42,0.62) 68%, rgba(15,23,42,0.88) 100%)",
        }} />

        {/* content — centered column, everything symmetric on the X axis */}
        <div style={{
          position: "relative", zIndex: 1, flex: 1,
          width: "100%", maxWidth: 900, margin: "0 auto",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", boxSizing: "border-box",
          padding: `${mob ? 48 : 90}px ${px} ${mob ? 28 : 48}px`,
        }}>
          <div style={{ marginBottom: mob ? 14 : 20, ...fade(hero, 0.05) }}>
            <span style={{
              display: "inline-block", fontSize: mob ? 9 : 10, fontWeight: 800,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#fff", background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: mob ? "5px 11px" : "6px 14px", borderRadius: 30, backdropFilter: "blur(6px)",
            }}>
              Nepal's Future-Ready Real Estate Company
            </span>
          </div>
          <h1 className="serif" style={{
            fontSize: mob ? 28 : tab ? 44 : 64,
            fontWeight: 900, lineHeight: 1.12,
            letterSpacing: mob ? "-0.5px" : "-2px",
            color: "#fff", marginBottom: mob ? 14 : 22, fontStyle: "normal",
            maxWidth: 820, margin: mob ? "0 auto 14px" : "0 auto 22px",
            textShadow: "0 4px 24px rgba(0,0,0,0.3)",
            ...fade(hero, 0.12),
          }}>
            Building Nepal's{" "}
            <span style={{ color: "#FF6B6B" }}>Future, Property</span> by Property.
          </h1>
          <p style={{
            fontSize: mob ? 13 : 16, lineHeight: 1.85, color: "rgba(255,255,255,0.82)",
            maxWidth: 580, margin: mob ? "0 auto 22px" : "0 auto 34px",
            ...fade(hero, 0.22),
          }}>
            We're not a traditional brokerage — we're strategic partners for
            owners, investors, and developers, combining market insight,
            branding, and a verified network to build lasting value across
            Kathmandu Valley and beyond.
          </p>
          <div style={{
            display: "flex", gap: mob ? 10 : 12, flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: mob ? 32 : 56,
            ...fade(hero, 0.30),
          }}>
            <a href="#brands" className="btn-p">Our Ecosystem</a>
            <a href="tel:+9779801000434" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: mob ? "10px 16px" : "11px 20px", borderRadius: 6,
              fontSize: mob ? 11.5 : 12.5, fontWeight: 700,
              color: "#fff", background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.35)", backdropFilter: "blur(6px)",
              textDecoration: "none", whiteSpace: "nowrap",
            }}>+977 9801000434</a>
          </div>

          {/* stat strip — perfectly centered, equal-width symmetric cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: mob ? 4 : 0,
            width: "100%",
            maxWidth: 720,
            ...fade(hero, 0.38),
          }}>
            {STATS_BAND.map((s, i) => (
              <div key={s.l} style={{
                textAlign: "center",
                padding: mob ? "8px 2px" : "0 20px",
                borderRight: i < STATS_BAND.length - 1 ? "1px solid rgba(255,255,255,0.2)" : "none",
              }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: mob ? 5 : 8 }}>
                  <Ic d={s.icon} s={mob ? 13 : 16} stroke="rgba(255,255,255,0.75)" />
                </div>
                <div className="serif" style={{
                  fontSize: mob ? 14 : 24, fontWeight: 900, color: "#fff", lineHeight: 1,
                }}>{s.v}</div>
                <div style={{
                  marginTop: mob ? 4 : 6, fontSize: mob ? 7.5 : 9.5, fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.3,
                }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* slide dots — centered under content, symmetric */}
        <div style={{
          position: "relative", zIndex: 2, paddingBottom: mob ? 16 : 28,
          display: "flex", justifyContent: "center", gap: 7,
        }}>
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.src}
              aria-label={`Show slide ${i + 1}: ${s.caption}`}
              onClick={() => setSlide(i)}
              style={{
                width: i === slide ? 24 : 7, height: 7, borderRadius: 4,
                background: i === slide ? C.red : "rgba(255,255,255,0.4)",
                border: "none", padding: 0, cursor: "pointer",
                transition: "width 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>
      </section>

      {/* ══ MARQUEE ════════════════════════════════════════════════════ */}
      <div style={{ background: C.red, padding: mob ? "9px 0" : "11px 0", overflow: "hidden" }}>
        <div className="mq">
          {Array(10).fill(0).map((_, i) => (
            <span key={i} style={{
              fontSize: mob ? 8.5 : 9.5, fontWeight: 800, letterSpacing: "0.28em",
              color: "#fff", paddingRight: 48, textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}>
              Real Estate · Salon & Beauty · Technology · Agro Farm · Multipurpose · Holdings · Hospitality ·
            </span>
          ))}
        </div>
      </div>

      {/* ══ STORY ══════════════════════════════════════════════════════ */}
      <Sec bg={C.white} py={py} px={px}>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
          gap: mob ? 28 : 60, alignItems: "center",
        }}>
          <SR cls="sr-l">
            <Lbl text="Our Story" />
            <h2 className="serif" style={{
              fontSize: mob ? 22 : tab ? 28 : 34, fontWeight: 900,
              color: C.navy, lineHeight: 1.2, letterSpacing: "-0.4px",
              fontStyle: "normal", marginBottom: 16,
            }}>
              Building Trust. Shaping Nepal's Future.
            </h2>
            {[
              "At Shetal Real Estate, we are not just selling land, homes, or projects — we are building trust, long-term value, and future-ready communities across Nepal.",
              "Founded with a vision to modernise Nepal's real estate industry, Shetal operates as an exclusive real estate service and development company across three core pillars: Exclusive Property Sales, Property Management, and Real Estate Development.",
              "What makes Shetal different is our approach. We do not operate as a traditional brokerage. We work as strategic partners for property owners, investors, and developers — combining market insight, branding, digital marketing, and on-ground networks to maximise every project's value.",
            ].map((p, i) => (
              <p key={i} style={{ fontSize: 13.5, lineHeight: 1.9, color: C.muted, marginBottom: 12 }}>{p}</p>
            ))}
            <div style={{ display: "flex", gap: mob ? 20 : 28, marginTop: 24, flexWrap: "wrap" }}>
              <div>
                <div className="serif" style={{ fontSize: 26, fontWeight: 900, color: C.red }}>10+</div>
                <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Years Active</div>
              </div>
              <div>
                <div className="serif" style={{ fontSize: 26, fontWeight: 900, color: C.red }}>3</div>
                <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Core Pillars</div>
              </div>
              <div>
                <div className="serif" style={{ fontSize: 26, fontWeight: 900, color: C.red }}>7</div>
                <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Sister Brands</div>
              </div>
            </div>
          </SR>

          <SR cls="sr-r" delay={0.1}>
            <div style={{ position: "relative" }}>
              {/* photo collage — a single strong photo up top on mobile,
                  the two supporting shots stacked side by side beneath it,
                  rather than squeezing all three into two cramped columns */}
              <div style={{
                display: "grid",
                gridTemplateColumns: mob ? "1fr" : "1.2fr 1fr",
                gap: 10,
                height: mob ? "auto" : 550,
              }}>
                <Photo
                  src="/property/9.png"
                  alt="Modern Kathmandu residence"
                  ratio={mob ? "16/10" : "auto"}
                  radius={10}
                  style={{ height: mob ? "auto" : "100%" }}
                />
                <div style={{
                  display: "grid",
                  gridTemplateColumns: mob ? "1fr 1fr" : "1fr",
                  gap: 10, height: mob ? "auto" : "100%",
                }}>
                  <Photo
                    src="/property/12.jpeg"
                    alt="Interior design"
                    ratio={mob ? "1/1" : "auto"}
                    radius={10}
                    style={{ flex: 1 }}
                  />
                  <Photo
                    src="/property/11.jpeg"
                    alt="Property exterior"
                    ratio={mob ? "1/1" : "auto"}
                    radius={10}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div style={{
                position: "absolute", bottom: mob ? -10 : -16, left: mob ? -8 : -16,
                background: C.red, color: "#fff",
                padding: mob ? "10px 14px" : "14px 18px",
                boxShadow: "0 14px 32px rgba(224,36,36,0.28)", borderRadius: 6,
              }}>
                <div className="serif" style={{ fontSize: mob ? 19 : 26, fontWeight: 900, lineHeight: 1 }}>10+</div>
                <div style={{ fontSize: mob ? 8 : 9.5, fontWeight: 800, letterSpacing: "0.1em", marginTop: 2, textTransform: "uppercase" }}>
                  Years of Vision
                </div>
              </div>
            </div>
          </SR>
        </div>
      </Sec>

      {/* ══ SERVICES ═══════════════════════════════════════════════════ */}
      <Sec bg={C.gray} py={py} px={px}>
        <SHead
          label="What We Do"
          title="Three Core Sectors. One Trusted Partner."
          sub="From exclusive sales to development and hospitality — every need served under one roof."
          center
          mob={mob} tab={tab}
        />
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3,1fr)",
          gap: 18,
        }}>
          {SERVICES.map((s, i) => (
            <SR key={s.title} delay={i * 0.05}>
              <div
                style={{
                  position: "relative", overflow: "hidden",
                  background: C.white, border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  height: "100%", boxSizing: "border-box",
                  transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s, border-color 0.25s",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 24px 40px rgba(15,23,42,0.10)";
                  e.currentTarget.style.borderColor = "var(--r14)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = C.border;
                }}
              >
                <Photo src={s.img} alt={s.title} ratio="16/10" radius={0} />
                <div style={{ padding: mob ? "20px 18px 22px" : "26px 24px 30px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 9,
                      background: "var(--r06)", border: "1px solid var(--r14)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Ic d={s.icon} s={19} stroke={C.red} />
                    </div>
                    <span className="serif" style={{ fontSize: 24, fontWeight: 900, color: C.border }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="serif" style={{
                    fontSize: 16, fontWeight: 800, color: C.navy,
                    marginBottom: 9, fontStyle: "normal",
                  }}>{s.title}</h3>
                  <p style={{ fontSize: 12.5, lineHeight: 1.8, color: C.muted, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            </SR>
          ))}
        </div>
      </Sec>

      {/* ══ SISTER BRANDS ══════════════════════════════════════════════ */}
      <Sec id="brands" bg={C.white} py={py} px={px}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: mob ? "flex-start" : "flex-end",
          flexDirection: mob ? "column" : "row",
          gap: 14, marginBottom: mob ? 24 : 34,
        }}>
          <div>
            <Lbl text="Our Ecosystem" />
            <h2 className="serif" style={{
              fontSize: mob ? 22 : tab ? 28 : 36, fontWeight: 900,
              color: C.navy, lineHeight: 1.15, letterSpacing: "-0.4px", fontStyle: "normal",
            }}>
              The Shetal <span style={{ color: C.red }}>Group Empire</span>
            </h2>
          </div>
          {!mob && (
            <p style={{ fontSize: 13, lineHeight: 1.9, color: C.muted, maxWidth: 300, textAlign: "right" }}>
              Seven distinct brands across real estate, beauty, technology, agriculture, and hospitality.
            </p>
          )}
        </div>

        {/* Flagship — clickable, links back to the home page */}
        <SR delay={0}>
          <a
            href="/"
            style={{
              background: "var(--r06)", border: "0.5px solid var(--r14)",
              padding: mob ? "18px" : "24px 28px",
              marginBottom: 14, borderRadius: 8,
              display: "flex", alignItems: "center", gap: mob ? 14 : 22, flexWrap: "wrap",
              textDecoration: "none", cursor: "pointer",
              transition: "border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--r14)"; e.currentTarget.style.borderColor = C.red; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--r06)"; e.currentTarget.style.borderColor = "var(--r14)"; }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 8,
              background: "#fff", border: `1px solid ${C.red}`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              overflow: "hidden", padding: 6,
            }}>
              <img src="/shetallogo.png" alt="Shetal Real Estate" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <Chip>Flagship Brand</Chip>
              <div className="serif" style={{
                fontSize: mob ? 15.5 : 22, fontWeight: 900,
                color: C.navy, lineHeight: 1.1, marginTop: 6, fontStyle: "normal",
              }}>
                Shetal Real Estate
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                Nepal's Modern Real Estate Service & Development Company
              </div>
            </div>
            {!mob && (
              <div style={{ display: "flex", gap: 22, flexShrink: 0 }}>
                {[["7", "Sister Brands"], ["2000+", "Listings"], ["Nepal", "Presence"]].map(([v, l]) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <div className="serif" style={{ fontSize: 19, fontWeight: 900, color: C.red }}>{v}</div>
                    <div style={{ fontSize: 9.5, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2, fontWeight: 700 }}>{l}</div>
                  </div>
                ))}
              </div>
            )}
          </a>
        </SR>

        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4,1fr)",
          gridTemplateRows: mob ? "auto" : "220px 220px",
          gap: mob ? 10 : 14,
        }}>
          {BRANDS.map((b, i) => {
            const placement = mob
              ? {}
              : [
                  { gridColumn: "1 / 3", gridRow: "1 / 2" },
                  { gridColumn: "3 / 4", gridRow: "1 / 2" },
                  { gridColumn: "4 / 5", gridRow: "1 / 2" },
                  { gridColumn: "1 / 2", gridRow: "2 / 3" },
                  { gridColumn: "2 / 3", gridRow: "2 / 3" },
                  { gridColumn: "3 / 5", gridRow: "2 / 3" },
                ][i];
            const isWide = !mob && (i === 0 || i === 5);
            return (
              <SR key={b.name} delay={i * 0.05 + 0.06} style={placement}>
                <a
                  href={brandDomain(b.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${b.name}`}
                  style={{
                    display: "flex", flexDirection: "column",
                    textDecoration: "none", cursor: "pointer",
                    height: mob ? 220 : "100%",
                    borderRadius: 10, overflow: "hidden",
                    border: `1px solid ${C.border}`, background: C.white,
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 28px rgba(15,23,42,0.10)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{
                    position: "relative", flex: 1, minHeight: 0,
                    background: "#F5F6F8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: isWide ? "16px 32px" : 16,
                    overflow: "hidden",
                  }}>
                    <img
                      src={b.bg.replace(/^url\(['"]?/, "").replace(/['"]?\)$/, "")}
                      alt={b.name}
                      style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain" }}
                    />
                    <div style={{
                      position: "absolute", top: 10, left: 10,
                      width: 28, height: 28, borderRadius: 6, background: C.red,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Ic d={b.icon} s={13} stroke="#fff" />
                    </div>
                    <div style={{
                      position: "absolute", top: 10, right: 10,
                      width: 24, height: 24, borderRadius: "50%",
                      background: "rgba(15,23,42,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Ic d={I.external} s={11} stroke={C.navy} sw={2} />
                    </div>
                  </div>
                  <div style={{ padding: mob ? "12px 14px" : "14px 16px", borderTop: `1px solid ${C.border}` }}>
                    <div className="serif" style={{
                      fontSize: mob ? 12 : 14, fontWeight: 800,
                      color: C.navy, lineHeight: 1.25, fontStyle: "normal",
                    }}>{b.name}</div>
                    <div style={{ fontSize: mob ? 9.5 : 10.5, color: C.muted, marginTop: 3 }}>{b.tag}</div>
                  </div>
                </a>
              </SR>
            );
          })}
        </div>
      </Sec>

      {/* ══ GALLERY STRIP ══════════════════════════════════════════════ */}
      <Sec bg={C.gray} py={py} px={px}>
        <SHead label="Our Work" title="A Glimpse Into What We Build" center mob={mob} tab={tab} />
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "repeat(2,1fr)" : "repeat(4,1fr)",
          gridAutoRows: mob ? "130px" : "150px",
          gridAutoFlow: "dense",
          gap: mob ? 8 : 14,
        }}>
          {GALLERY.map((g, i) => {
            const span = mob
              ? { gridColumn: "span 1", gridRow: "span 1" }
              : g.size === "big" ? { gridColumn: "span 2", gridRow: "span 2" }
              : g.size === "wide" ? { gridColumn: "span 2", gridRow: "span 1" }
              : g.size === "tall" ? { gridColumn: "span 1", gridRow: "span 2" }
              : { gridColumn: "span 1", gridRow: "span 1" };
            return (
              <SR key={g.src} delay={i * 0.04} style={span}>
                <Photo
                  src={g.src}
                  alt={`Shetal project ${i + 1}`}
                  ratio="auto"
                  radius={10}
                  style={{
                    height: "100%",
                    transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
              </SR>
            );
          })}
        </div>
      </Sec>

      {/* ══ TIMELINE ═══════════════════════════════════════════════════ */}
      <Sec bg={C.white} py={py} px={px}>
        <SHead label="Our Journey" title="Milestones That Define Us" center mob={mob} tab={tab} />
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
          gap: mob ? 0 : "0 52px",
        }}>
          {TIMELINE.map((t, i) => (
            <SR key={t.yr} delay={i * 0.06}>
              <div style={{ display: "flex", gap: 15, marginBottom: mob ? 20 : 26 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div className="tl-dot"><Ic d={t.icon} s={13} stroke={C.navy} /></div>
                  {i < TIMELINE.length - (mob ? 1 : 2) && (
                    <div style={{ width: 1, flex: 1, minHeight: 28, background: C.border, marginTop: 4 }} />
                  )}
                </div>
                <div style={{ paddingBottom: mob ? 20 : 26 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5, flexWrap: "wrap" }}>
                    <span className="serif" style={{ fontSize: 18, fontWeight: 900, color: C.red }}>{t.yr}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{t.t}</span>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.85, color: C.muted, margin: 0 }}>{t.d}</p>
                </div>
              </div>
            </SR>
          ))}
        </div>
      </Sec>

      {/* ══ VALUES ══════════════════════════════════════════════════════ */}
      <Sec bg={C.gray} py={py} px={px}>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
          gap: mob ? 28 : 56, alignItems: "stretch",
        }}>
          <SR cls="sr-l" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Lbl text="Why Choose Us" />
            <h2 className="serif" style={{
              fontSize: mob ? 22 : tab ? 28 : 34, fontWeight: 900,
              color: C.navy, lineHeight: 1.2, letterSpacing: "-0.4px",
              fontStyle: "normal", marginBottom: 10,
            }}>
              The Shetal Difference
            </h2>
            <p style={{ fontSize: 13.5, lineHeight: 1.9, color: C.muted, marginBottom: 28 }}>
              What separates us from every other real estate firm in Nepal.
            </p>
            {VALUES.map((val, i) => (
              <SR key={val.n} delay={i * 0.06}>
                <div className="vi" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div className="vi-num">{val.n}</div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{val.t}</h4>
                    <p style={{ fontSize: 12.5, lineHeight: 1.85, color: C.muted, margin: 0 }}>{val.d}</p>
                  </div>
                </div>
              </SR>
            ))}
          </SR>

          <SR cls="sr-r" delay={0.1} style={{ display: "flex" }}>
            <div style={{
              flex: 1, position: "relative", overflow: "hidden",
              borderRadius: 12, minHeight: mob ? 340 : "100%",
            }}>
              <Photo
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900&q=80&auto=format&fit=crop"
                alt="Shetal building"
                ratio="auto"
                radius={0}
                style={{ height: "100%" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(0deg, rgba(15,23,42,0.94) 10%, rgba(15,23,42,0.5) 55%, rgba(15,23,42,0.15) 100%)",
              }} />
              <div style={{
                position: "absolute", left: 0, top: 0, width: 3, height: "100%", background: C.red,
              }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: mob ? "22px 18px" : "32px 28px",
              }}>
                <div className="serif" style={{ fontSize: 26, color: C.red, lineHeight: 1, marginBottom: 10, fontWeight: 900 }}>★</div>
                <h3 className="serif" style={{
                  fontSize: mob ? 15 : 17, fontWeight: 800,
                  color: "#fff", marginBottom: 10, lineHeight: 1.3, fontStyle: "normal",
                }}>
                  Nepal's Most Trusted Real Estate Partner
                </h3>
                <p style={{ fontSize: 12.5, lineHeight: 1.85, color: "rgba(255,255,255,0.55)", marginBottom: 20 }}>
                  Years of consistent excellence have made Shetal synonymous with integrity,
                  professionalism, and results across Nepal's growing real estate landscape.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {[
                    "Strong Market Understanding & Local Network",
                    "Modern Branding & Digital-First Marketing",
                    "Transparent, Relationship-Focused Model",
                    "Residential, Plotting & Hospitality Expertise",
                    "Dedicated Sales & Operational Support",
                    "Vision-Driven Leadership for Long-Term Growth",
                  ].map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 3, background: C.red, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Ic d={I.check} s={9} stroke="#fff" sw={2.5} />
                      </div>
                      <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.68)", fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SR>
        </div>
      </Sec>

      {/* ══ VISION & MISSION ════════════════════════════════════════════
          This is intentionally a slim accent band, not a full content
          section — but its padding now comes from bandPy so it scales
          with the same proportions as every other section instead of a
          hand-picked pixel value. */}
      <section style={{ background: C.red, padding: `${bandPy} ${px}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4,1fr)",
            gap: mob ? 10 : 12,
          }}>
            {[
              { sym: "◆", text: "Transparent & Profitable Real Estate" },
              { sym: "▲", text: "Professional Property Management" },
              { sym: "★", text: "Future-Focused Developments" },
              { sym: "●", text: "World-Class Client Experience" },
            ].map((a, i) => (
              <SR key={a.text} delay={i * 0.05}>
                <div style={{
                  padding: mob ? "16px 10px" : "22px 16px",
                  background: "rgba(0,0,0,0.10)", textAlign: "center",
                  borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                  transition: "background 0.2s", cursor: "default",
                  height: "100%", boxSizing: "border-box",
                  display: "flex", flexDirection: "column", justifyContent: "center",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.22)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.10)"}
                >
                  <div style={{ fontSize: 16, color: "#fff", marginBottom: 8, opacity: 0.8 }}>{a.sym}</div>
                  <div style={{ fontSize: mob ? 10 : 12, fontWeight: 600, color: "#fff", lineHeight: 1.6 }}>{a.text}</div>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TEAM ════════════════════════════════════════════════════════ */}
      <Sec bg={C.white} py={py} px={px}>
        <SHead
          label="Our People"
          title="The Minds Behind Shetal"
          sub="Experienced professionals combining deep local market knowledge with world-class service standards."
          center
          mob={mob} tab={tab}
        />
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "repeat(2,1fr)" : tab ? "repeat(3,1fr)" : "repeat(5,1fr)",
          gap: mob ? 14 : 22,
        }}>
          {TEAM.map((m, i) => {
            // on a 2-column mobile grid, an odd member count leaves one
            // card stranded alone — center it full-width instead of
            // letting it hang off to one side
            const isOrphan = mob && TEAM.length % 2 === 1 && i === TEAM.length - 1;
            return (
              <SR
                key={m.name}
                delay={i * 0.05}
                style={isOrphan ? { gridColumn: "1 / -1", maxWidth: 200, margin: "0 auto", width: "100%" } : {}}
              >
                <div
                  className="team-card"
                  style={{
                    background: C.white, border: `1px solid ${C.border}`,
                    borderRadius: 12, padding: mob ? "14px 12px 16px" : "20px 18px 22px",
                    textAlign: "center", transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s, border-color 0.25s",
                    boxShadow: "0 1px 2px rgba(15,23,42,0.04)", cursor: "default",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 20px 34px rgba(15,23,42,0.12)";
                    e.currentTarget.style.borderColor = "var(--r14)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 1px 2px rgba(15,23,42,0.04)";
                    e.currentTarget.style.borderColor = C.border;
                  }}
                >
                  <div style={{
                    position: "relative", overflow: "hidden",
                    width: "100%", aspectRatio: "4 / 5",
                    borderRadius: 10, marginBottom: 14,
                    background: "var(--r06)",
                  }}>
                    <img
                      src={m.photo}
                      alt={m.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={e => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div style={{
                      display: "none", position: "absolute", inset: 0,
                      background: "var(--r06)",
                      alignItems: "center", justifyContent: "center",
                      fontSize: mob ? 24 : 32, fontWeight: 900, color: C.red,
                      fontFamily: "'Outfit',sans-serif",
                    }}>{m.ini}</div>
                  </div>
                  <div className="serif" style={{
                    fontSize: mob ? 12.5 : 15.5, fontWeight: 800, color: C.navy,
                    lineHeight: 1.3, marginBottom: 7, fontStyle: "normal",
                  }}>{m.name}</div>
                  <span style={{
                    display: "inline-block",
                    fontSize: 9.5, fontWeight: 800, color: C.red,
                    background: "#FEF2F2", border: "1px solid #FECACA",
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    padding: "4px 10px", borderRadius: 20,
                  }}>{m.role}</span>
                </div>
              </SR>
            );
          })}
        </div>
      </Sec>

      {/* ══ CITIES ══════════════════════════════════════════════════════ */}
      <Sec bg={C.gray} py={py} px={px}>
        <SHead label="Market Presence" title="Nepal's Growing Property Network" center mob={mob} tab={tab} />
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "repeat(2,1fr)" : "repeat(5,1fr)",
          gap: mob ? 10 : 14,
        }}>
          {CITIES.map((c, i) => {
            const isOrphan = mob && CITIES.length % 2 === 1 && i === CITIES.length - 1;
            return (
              <SR
                key={c.name}
                delay={i * 0.03}
                style={isOrphan ? { gridColumn: "1 / -1", maxWidth: 200, margin: "0 auto", width: "100%" } : {}}
              >
                <div
                  style={{
                    position: "relative", overflow: "hidden",
                    borderRadius: 10, height: mob ? 120 : 170,
                    border: `1px solid ${C.border}`,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 16px 28px rgba(15,23,42,0.10)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <img
                    src={c.img}
                    alt={c.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(15,23,42,0.75) 0%, rgba(15,23,42,0.1) 60%)" }} />
                  <div style={{
                    position: "absolute", bottom: 10, left: 0, right: 0,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                    <Ic d={I.map} s={12} stroke="#fff" />
                    <span style={{ fontSize: mob ? 11 : 12.5, fontWeight: 700, color: "#fff" }}>{c.name}</span>
                  </div>
                </div>
              </SR>
            );
          })}
        </div>
      </Sec>

      {/* ══ PROCESS ═════════════════════════════════════════════════════ */}
      <Sec bg={C.white} py={py} px={px}>
        <SHead label="How We Work" title="A Process Built Around You" center mob={mob} tab={tab} />
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4,1fr)",
          gap: mob ? 12 : 18,
        }}>
          {PROCESS.map((p, i) => (
            <SR key={p.n} delay={i * 0.06}>
              <div style={{
                background: C.gray, borderRadius: 12,
                border: `1px solid ${C.border}`, height: "100%",
              }}>
                <Photo src={p.img} alt={p.t} ratio="4/3" radius={0}
                  style={{ borderRadius: "12px 12px 0 0" }}
                />
                <div style={{ padding: mob ? "14px 12px 16px" : "20px 18px 24px" }}>
                  <div style={{
                    position: "relative", zIndex: 2,
                    width: mob ? 34 : 42, height: mob ? 34 : 42, borderRadius: "50%",
                    background: C.navy, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 14, marginTop: mob ? -20 : -24,
                    boxShadow: "0 4px 12px rgba(15,23,42,0.35)",
                    fontFamily: "'Outfit',sans-serif", fontSize: mob ? 12 : 14, fontWeight: 900,
                    border: `3px solid ${C.white}`,
                  }}>{p.n}</div>
                  <h4 className="serif" style={{
                    fontSize: mob ? 13 : 14.5, fontWeight: 800,
                    color: C.navy, margin: "0 0 8px", fontStyle: "normal",
                  }}>{p.t}</h4>
                  <p style={{ fontSize: mob ? 11.5 : 12.5, lineHeight: 1.8, color: C.muted, margin: 0 }}>{p.d}</p>
                </div>
              </div>
            </SR>
          ))}
        </div>
      </Sec>

      {/* ══ MAP + CONTACT ════════════════════════════════════════════════ */}
      <section style={{ background: C.navy, padding: `${py} ${px}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SR style={{ marginBottom: mob ? 22 : 32, textAlign: "center" }}>
            <Lbl text="Find Us" center />
            <h2 className="serif" style={{
              fontSize: mob ? 22 : tab ? 28 : 36, fontWeight: 900,
              color: "#fff", lineHeight: 1.15, letterSpacing: "-0.4px", fontStyle: "normal",
            }}>
              Visit Our <span style={{ color: C.red }}>Office</span>
            </h2>
          </SR>

          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
            gap: 14, marginBottom: 14,
          }}>
            <SR cls="sr-l">
              <iframe
                title="Shetal Real Estate Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.06245053072!2d85.33873427514332!3d27.71534012513476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQ0JzM4LjkiTiA4NcKwMjAnMjguMiJF!5e0!3m2!1sen!2snp!4v1713540000000!5m2!1sen!2snp"
                width="100%" height={mob ? 200 : 340}
                style={{ border: 0, display: "block", borderRadius: 8 }}
                allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </SR>

            <SR cls="sr-r" delay={0.08}>
              <div style={{
                background: "var(--r06)", border: "0.5px solid var(--r14)",
                minHeight: mob ? "auto" : 340,
                padding: mob ? "20px 16px" : "26px 24px",
                borderRadius: 8, display: "flex",
                flexDirection: "column", justifyContent: "space-between", gap: 16,
              }}>
                <div>
                  <div className="serif" style={{
                    fontSize: 24, fontWeight: 900, color: C.red, lineHeight: 1, marginBottom: 6,
                  }}>HQ</div>
                  <h3 className="serif" style={{
                    fontSize: 15, fontWeight: 800, color: "#fff",
                    marginBottom: 16, fontStyle: "normal",
                  }}>
                    Shetal Real Estate Pvt. Ltd.
                  </h3>
                  {[
                    { icon: I.map, text: "Kathmandu, Nepal" },
                    { icon: I.phone, text: "+977 9801000434 / 9705250833" },
                    { icon: I.mail, text: "shetalrealestate@gmail.com" },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                      <div style={{ marginTop: 1, flexShrink: 0 }}><Ic d={item.icon} s={13} stroke={C.red} /></div>
                      <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.56)", lineHeight: 1.7, wordBreak: "break-word" }}>{item.text}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.1)", marginBottom: 14 }} />
                  <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                    <a href="tel:+9779801000434" className="btn-p" style={{ flex: "1 1 120px", textAlign: "center", fontSize: 11.5 }}>Call Now</a>
                    <a href="mailto:shetalrealestate@gmail.com" className="btn-g"
                      style={{ flex: "1 1 120px", textAlign: "center", fontSize: 11.5, color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}>
                      Email Us
                    </a>
                  </div>
                  <p style={{
                    fontSize: 9.5, color: "rgba(255,255,255,0.27)", marginTop: 12,
                    letterSpacing: "0.1em", textAlign: "center", fontWeight: 700, textTransform: "uppercase",
                  }}>
                    SUN – FRI · 9:00 AM – 6:00 PM
                  </p>
                </div>
              </div>
            </SR>
          </div>

          {/* Branch / Sister brand locations */}
          <SR delay={0.1}>
            <div style={{
              display: "grid",
              gridTemplateColumns: mob ? "1fr" : "repeat(3,1fr)",
              gap: 10,
            }}>
              {[
                { brand: "Munal & Mayur Resort Pvt.Ltd", loc: "Chitwan, Nepal", icon: I.hotel },
                { brand: "Queens by Shetal", loc: "Kathmandu, Nepal", icon: I.cut },
                { brand: "Shetal Sanshee Agro Farm", loc: "Nepal", icon: I.leaf },
              ].map(o => (
                <div key={o.brand} style={{
                  background: "var(--r06)", border: "0.5px solid var(--r14)",
                  padding: "15px 17px", display: "flex", gap: 12, alignItems: "center",
                  transition: "background 0.2s, border-color 0.2s",
                  cursor: "default", borderRadius: 8,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--r14)"; e.currentTarget.style.borderColor = C.red; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--r06)"; e.currentTarget.style.borderColor = "var(--r14)"; }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 6, background: C.red, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Ic d={o.icon} s={13} stroke="#fff" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>{o.brand}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", marginTop: 2 }}>{o.loc}</div>
                  </div>
                </div>
              ))}
            </div>
          </SR>
        </div>
      </section>

      {/* ══ FOUNDER'S MESSAGE ═══════════════════════════════════════════ */}
      <section style={{ background: C.white, padding: `${py} ${px}` }}>
        <div style={{
          maxWidth: 1000, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "0.8fr 1.2fr",
          gap: mob ? 24 : 48, alignItems: "center",
        }}>
          {!mob && (
            <SR cls="sr-l">
              <Photo
                src="/member/gobind.jpeg"
                alt="Shetal leadership"
                ratio="3/4"
                radius={12}
              />
            </SR>
          )}
          <SR cls="sr-r" delay={0.08} style={{ textAlign: mob ? "center" : "left" }}>
            <div style={{ display: "flex", justifyContent: mob ? "center" : "flex-start" }}>
              <Ic d={I.quote} s={mob ? 30 : 38} stroke={C.red} fill={C.red} />
            </div>
            <p className="serif" style={{
              fontSize: mob ? 15 : 20, fontWeight: 700,
              color: C.navy, lineHeight: 1.65,
              margin: "16px 0 18px", letterSpacing: "-0.2px", fontStyle: "normal",
            }}>
              We believe real estate is more than buying and selling property. It is about creating opportunities, building trust, and shaping lifestyles for the future.
            </p>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>Govinda Shrestha</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Chief Executive Officer, Shetal Real Estate</div>
          </SR>
        </div>
      </section>

    </div>
  );
}