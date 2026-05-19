import React, { useEffect, useRef, useState } from "react";
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
function Lbl({ text }) {
  return (
    <div className="lbl">
      <div className="lbl-line" />
      <span className="lbl-txt">{text}</span>
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

/* ═══ ICONS ══════════════════════════════════════════════════════════ */
const I = {
  home:   "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  key:    "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  bld:    "M6 2h12v20H6zM12 6v4M12 14v4",
  chart:  "M18 20V10M12 20V4M6 20v-6",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  map:    "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7v.01",
  phone:  "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.7A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.94a16 16 0 006.15 6.15l1.31-1.31a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  mail:   "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  check:  "M20 6L9 17l-5-5",
  crown:  "M3 17L7 3l5 5 5-5 4 14H3z",
  leaf:   "M17 8C8 10 5.9 16.17 3.82 19.67a.84.84 0 001.38.96C7 18 11 17 15 17c5 0 6-3 6-6 0-3.5-3-7-4-3z",
  hotel:  "M2 20h20M6 20V8M18 20V8M2 8h20M6 4h12M9 8v4M15 8v4M9 16v4M15 16v4",
  code:   "M16 18l6-6-6-6M8 6l-6 6 6 6",
  globe:  "M12 2a10 10 0 100 20A10 10 0 0012 2z M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  cut:    "M6 3l6 9m0 0l6-9m-6 9l-6 9m12-9l-6 9",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  star:   "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
};

/* ═══ DATA ════════════════════════════════════════════════════════════ */
const SERVICES = [
  { icon: I.home,   title: "Residential Sales",    desc: "Curated homes, apartments and villas across Nepal's most desirable neighbourhoods." },
  { icon: I.key,    title: "Luxury Rentals",        desc: "Premium rental solutions for discerning clients. Flexible leases, full tenant vetting, zero compromise." },
  { icon: I.bld,    title: "Commercial Property",   desc: "Offices, retail and industrial spaces across 20+ cities in Nepal's fastest-growing corridors." },
  { icon: I.chart,  title: "Investment Advisory",   desc: "Data-backed strategies and proprietary market intelligence to maximise ROI in Nepal's expanding market." },
  { icon: I.shield, title: "Property Management",   desc: "End-to-end asset management — maintenance, tenant relations, accounts. Your investment, our responsibility." },
  { icon: I.globe,  title: "Legal & Compliance",    desc: "In-house legal consultants handle due diligence, documentation and land registration." },
];

const BRANDS = [
  { name: "Queens by Sheetal",            tag: "Luxury Salon & Beauty",             icon: I.cut,    bg: "url('shetallogo.png')" },
  { name: "Sheetal Technologies",          tag: "Digital Innovation & IT Solutions", icon: I.code,   bg: "url('technology.png')" },
  { name: "Sheetal Sanshee Agro Farm",     tag: "Sustainable Agriculture & Farming", icon: I.leaf,   bg: "url('Farm.png')" },
  { name: "Sheetal Sanshee Multipurpose",  tag: "Diversified Services & Solutions",  icon: I.layers, bg: "url('Multipurpose.png')" },
  { name: "Sheemai Holdings",              tag: "Strategic Investment & Holdings",    icon: I.crown,  bg: "url('shetallogo.png')" },
  { name: "Munal & Mayur Resort",          tag: "Luxury Eco Resort · Chitwan",        icon: I.hotel,  bg: "url('shetallogo.png')" },
];

const TIMELINE = [
  { yr: "2009", t: "Foundation",            d: "Established in Bansbari, Kathmandu — Nepal's first dedicated property management firm.",       icon: I.star  },
  { yr: "2012", t: "Regional Expansion",    d: "Extended to Pokhara, Chitwan, Butwal and Dharan — Nepal's most comprehensive network.",        icon: I.map   },
  { yr: "2016", t: "10,000 Families",       d: "A landmark milestone: 10,000 successful transactions. Nepal's most trusted name in property.", icon: I.home  },
  { yr: "2019", t: "Brand Diversification", d: "Launched Queens by Sheetal, Sheetal Technologies and Munal & Mayur Resort.",                   icon: I.crown },
  { yr: "2021", t: "Digital Platform",      d: "Launched Nepal's most comprehensive digital property portal with verified listings.",           icon: I.code  },
  { yr: "2024", t: "20+ Cities",            d: "Operating across 20+ cities with 2,400+ active listings, 7 sister brands, 80+ professionals.", icon: I.globe },
];

const VALUES = [
  { n: "01", t: "Absolute Transparency",    d: "No hidden charges, no inflated valuations. Every figure is independently verifiable — always." },
  { n: "02", t: "Client Sovereignty",       d: "Your ambitions drive every recommendation. We are advisors, never salespeople." },
  { n: "03", t: "Proprietary Intelligence", d: "15 years of transaction data gives us insight no newcomer can replicate in Nepal's market." },
  { n: "04", t: "Lifetime Partnership",     d: "Our relationship doesn't end at closing — we support your entire property portfolio for decades." },
];

const TEAM = [
  { name: "Sheetal Shah",  role: "Managing Director", ini: "SS" },
  { name: "Anil Sharma",   role: "Head of Sales",      ini: "AS" },
  { name: "Priya Thapa",   role: "Investment Lead",    ini: "PT" },
  { name: "Rajan K.C.",    role: "Legal & Compliance", ini: "RK" },
  { name: "Sunita Rai",    role: "Client Relations",   ini: "SR" },
  { name: "Bikash Paudel", role: "Property Manager",   ini: "BP" },
];

const CITIES = [
  "Kathmandu","Chitwan",
  "Bhaktapur","Lalitpur",
];

const PROCESS = [
  { n: "01", t: "Discovery",       d: "We listen intently — your goals, timeline, and budget guide every recommendation." },
  { n: "02", t: "Curated Match",   d: "Hand-selected verified properties from our exclusive database. No filler. No wasted visits." },
  { n: "03", t: "Expert Guidance", d: "Site visits, valuations, negotiation — every detail handled with precision by our specialists." },
  { n: "04", t: "Seamless Close",  d: "Legal review, documentation, registration. A smooth, stress-free closing every time." },
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
  white:  "#fff",
  gray:   "#F5F6F8",
  navy:   "#0F172A",
  red:    "#E02424",
  border: "#E9EAEC",
  muted:  "#64748B",
};

/* ═══ SEC — moved outside About so its reference is stable ══════════ */
// FIX: was defined as arrow fn inside About — new ref every render caused
// IntersectionObserver state inside children to reset on every scroll tick.
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

/* ═══ SHEAD — moved outside About + replaced inner SR with useInView ═ */
// FIX 1: was defined inside About — same stable-reference issue as Sec.
// FIX 2: was wrapping content in <SR> which itself uses useInView, causing
// a nested observer that could fire at a different time from sibling SRs
// and produce a layout jump. Now calls useInView directly.
function SHead({ label, title, sub, center = false, mob, tab }) {
  const [ref, v] = useInView();
  return (
    <div
      ref={ref}
      className={`sr${v ? " in" : ""}`}
      style={{ marginBottom: mob ? 20 : 28, textAlign: center ? "center" : "left" }}
    >
      <Lbl text={label} />
      <h2 className="serif" style={{
        fontSize: mob ? 22 : tab ? 26 : 32, fontWeight: 900,
        color: C.navy, lineHeight: 1.1, letterSpacing: "-0.4px",
        fontStyle: "normal", marginBottom: sub ? 7 : 0,
      }}>{title}</h2>
      {sub && (
        <p style={{
          fontSize: 13, color: C.muted, lineHeight: 1.7,
          maxWidth: 360, margin: center ? "0 auto" : 0,
        }}>{sub}</p>
      )}
    </div>
  );
}

/* ═══ MAIN ════════════════════════════════════════════════════════════ */
export default function About() {
  const [hero, setHero] = useState(false);
  const [prog, setProg] = useState(0);
  const w = useWindowWidth();
  const mob = w < 768;
  const tab = w < 1024;

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

  /* ── Layout tokens ── */
  const px  = mob ? "20px" : tab ? "32px" : "48px";
  const py  = mob ? "36px" : "52px";
  const col = mob ? "1fr" : tab ? "1fr 1fr" : null;

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
      <div className="prog" style={{ width: `${prog}%` }} />

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section style={{
        borderBottom: `1px solid ${C.border}`,
        padding: mob ? "90px 20px 36px" : tab ? "90px 32px 44px" : "120px 48px 48px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : "1.1fr 0.9fr",
            gap: mob ? 28 : 52,
            alignItems: "center",
          }}>
            {/* LEFT */}
            <div>
              <div style={{ marginBottom: 14, ...fade(hero, 0.05) }}>
                <Chip>Nepal's First Property Management Company</Chip>
              </div>
              <h1 className="serif" style={{
                fontSize: mob ? 30 : tab ? 38 : 52,
                fontWeight: 900, lineHeight: 1.0,
                letterSpacing: mob ? "-1px" : "-1.5px",
                color: C.navy, marginBottom: 14, fontStyle: "normal",
                ...fade(hero, 0.12),
              }}>
                Sheetal <span style={{ color: C.red }}>Real Estate</span>
              </h1>
              <p style={{
                fontSize: 13, lineHeight: 1.8, color: C.muted,
                maxWidth: 400, marginBottom: 22,
                ...fade(hero, 0.22),
              }}>
                Since 2009, setting the standard for professional, transparent, and
                client-first property services across Nepal.
              </p>
              <div style={{
                display: "flex", gap: 10, flexWrap: "wrap",
                marginBottom: mob ? 20 : 24,
                ...fade(hero, 0.30),
              }}>
                <a href="#brands" className="btn-p">Our Brands</a>
                <a href="tel:+9779801000434" className="btn-g">+977 9801000434</a>
              </div>
              <div style={{
                display: "flex", gap: 22, flexWrap: "wrap",
                opacity: hero ? 0.45 : 0,
                transition: "opacity 1s ease 0.5s",
              }}>
                {["7 Brands", "20+ Cities", "Est. 2009"].map(t => (
                  <span key={t} style={{
                    fontSize: 9, fontWeight: 800,
                    letterSpacing: "0.18em", textTransform: "uppercase", color: C.navy,
                  }}>{t}</span>
                ))}
              </div>
            </div>

            {/* RIGHT — stats */}
            <div style={fade(hero, 0.18, "right")}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                {[
                  { v: "10,000+", l: "Families Served" },
                  { v: "15+",     l: "Years Excellence" },
                  { v: "2,400+",  l: "Active Listings" },
                  { v: "20+",     l: "Cities in Nepal" },
                ].map(s => (
                  <div key={s.l} className="sb">
                    <div className="serif" style={{
                      fontSize: mob ? 20 : 28, fontWeight: 900, color: C.red, lineHeight: 1,
                    }}>{s.v}</div>
                    <div style={{
                      marginTop: 4, fontSize: 9, fontWeight: 700,
                      letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted,
                    }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 1, padding: "10px 14px",
                background: "var(--r06)", border: "0.5px solid var(--r14)",
                display: "flex", alignItems: "center", gap: 10, borderRadius: 4,
              }}>
                <Ic d={I.map} s={13} stroke={C.red} />
                <span style={{ fontSize: 11, color: C.muted }}>
                  Bansbari, Kathmandu · Serving Nepal since 2009
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ════════════════════════════════════════════════════ */}
      <div style={{ background: C.red, padding: "9px 0", overflow: "hidden" }}>
        <div className="mq">
          {Array(10).fill(0).map((_, i) => (
            <span key={i} style={{
              fontSize: 9, fontWeight: 800, letterSpacing: "0.28em",
              color: "#fff", paddingRight: 48, textTransform: "uppercase",
            }}>
              Real Estate · Salon · Technology · Agro Farm · Holdings · Hospitality · Multipurpose ·
            </span>
          ))}
        </div>
      </div>

      {/* ══ STORY ══════════════════════════════════════════════════════ */}
      <Sec bg={C.white} py={py} px={px}>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
          gap: mob ? 28 : 48, alignItems: "center",
        }}>
          <SR cls="sr-l">
            <Lbl text="Our Story" />
            <h2 className="serif" style={{
              fontSize: mob ? 22 : tab ? 26 : 30, fontWeight: 900,
              color: C.navy, lineHeight: 1.1, letterSpacing: "-0.4px",
              fontStyle: "normal", marginBottom: 14,
            }}>
              Built on Trust. Driven by Excellence.
            </h2>
            {[
              "Founded in 2009 in Bansbari, Kathmandu, Sheetal Real Estate was built on one conviction — that Nepali families deserve professional, honest, and expert property guidance.",
              "As Nepal's first dedicated property management firm, we didn't just enter a market. We built one. While competitors listed properties, we built relationships that last decades.",
              "Today, under Managing Director Sheetal Shah, we operate across 20+ cities with 7 sister brands and 80+ professionals — Nepal's most trusted real estate enterprise.",
            ].map((p, i) => (
              <p key={i} style={{ fontSize: 13, lineHeight: 1.8, color: C.muted, marginBottom: 10 }}>{p}</p>
            ))}
            <div style={{
              marginTop: 14, padding: "11px 14px",
              background: "var(--r06)", borderLeft: `3px solid ${C.red}`,
              display: "flex", alignItems: "flex-start", gap: 12, borderRadius: 4,
            }}>
              <div style={{ marginTop: 1, flexShrink: 0 }}><Ic d={I.map} s={14} stroke={C.red} /></div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>Sheetal Real Estate Pvt. Ltd.</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                  Bansbari, Opp. Namuna Fashion College, Kathmandu
                </div>
              </div>
            </div>
          </SR>

          {!mob && (
            <SR cls="sr-r" delay={0.1}>
              <div style={{ position: "relative" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <img src="/shetallogo.png" alt="Property"
                    style={{ width: "100%", height: 148, objectFit: "cover", borderRadius: 4 }}
                    onError={e => { e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80"; }} />
                  <img src="/home-banner2.gif" alt="Property"
                    style={{ width: "100%", height: 148, objectFit: "cover", marginTop: 22, borderRadius: 4 }}
                    onError={e => { e.target.src = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80"; }} />
                </div>
                <div style={{
                  position: "absolute", bottom: -12, left: -12,
                  background: C.red, color: "#fff", padding: "12px 16px",
                  boxShadow: "0 10px 26px rgba(224,36,36,0.22)", borderRadius: 4,
                }}>
                  <div className="serif" style={{ fontSize: 24, fontWeight: 900, lineHeight: 1 }}>15+</div>
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", marginTop: 0, textTransform: "uppercase" }}>
                    Years of Excellence
                  </div>
                </div>
              </div>
            </SR>
          )}
        </div>
      </Sec>

      {/* ══ SERVICES ═══════════════════════════════════════════════════ */}
      <Sec bg={C.gray} py={py} px={px}>
        <SHead
          label="What We Do"
          title="Full-Spectrum Real Estate Services"
          sub="Every need managed under one roof by Nepal's most experienced professionals."
          mob={mob} tab={tab}
        />
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3,1fr)",
          gap: 10,
        }}>
          {SERVICES.map((s, i) => (
            <SR key={s.title} delay={i * 0.05}>
              <div className="svc">
                <div className="svc-icon"><Ic d={s.icon} s={17} stroke={C.red} /></div>
                <h3 className="serif" style={{
                  fontSize: 14, fontWeight: 700, color: C.navy,
                  marginBottom: 6, fontStyle: "normal",
                }}>{s.title}</h3>
                <p style={{ fontSize: 12.5, lineHeight: 1.75, color: C.muted, margin: 0 }}>{s.desc}</p>
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
          gap: 10, marginBottom: mob ? 18 : 24,
        }}>
          <div>
            <Lbl text="Our Brands" />
            <h2 className="serif" style={{
              fontSize: mob ? 22 : tab ? 26 : 32, fontWeight: 900,
              color: C.navy, lineHeight: 1.1, letterSpacing: "-0.4px", fontStyle: "normal",
            }}>
              The Sheetal <span style={{ color: C.red }}>Business Empire</span>
            </h2>
          </div>
          {!mob && (
            <p style={{ fontSize: 12.5, lineHeight: 1.8, color: C.muted, maxWidth: 250, textAlign: "right" }}>
              Seven distinct brands across real estate, hospitality, technology, agriculture and beauty.
            </p>
          )}
        </div>

        {/* Flagship */}
        <SR delay={0}>
          <div style={{
            background: "var(--r06)", border: "0.5px solid var(--r14)",
            padding: mob ? "16px" : "18px 24px",
            marginBottom: 10, borderRadius: 4,
            display: "flex", alignItems: "center", gap: mob ? 14 : 22, flexWrap: "wrap",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 4,
              background: "var(--r14)", border: `1px solid ${C.red}`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Ic d={I.bld} s={18} stroke={C.red} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Chip>Flagship Brand</Chip>
              <div className="serif" style={{
                fontSize: mob ? 15 : 20, fontWeight: 900,
                color: C.navy, lineHeight: 1.1, marginTop: 5, fontStyle: "normal",
              }}>
                Sheetal Real Estate
              </div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3 }}>
                Nepal's First & Most Trusted Property Management Company
              </div>
            </div>
            {!mob && (
              <div style={{ display: "flex", gap: 18, flexShrink: 0 }}>
                {[["10,000+","Families"],["2,400+","Listings"],["20+","Cities"]].map(([v,l]) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <div className="serif" style={{ fontSize: 17, fontWeight: 900, color: C.red }}>{v}</div>
                    <div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2, fontWeight: 700 }}>{l}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SR>

        {/* Other 6 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr" : "repeat(3,1fr)",
          gap: 10,
        }}>
          {BRANDS.map((b, i) => (
            <SR key={b.name} delay={i * 0.05 + 0.06}>
              <div style={{
                backgroundImage: b.bg, backgroundSize: "contain",
                backgroundRepeat: "no-repeat", backgroundPosition: "center",
                height: mob ? 110 : 130, position: "relative",
                overflow: "hidden", borderRadius: 4,
                border: `1px solid ${C.border}`,
              }}>
                <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.63)" }} />
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  justifyContent: "flex-end", padding: mob ? "10px" : "13px 15px",
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 4, background: C.red,
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6,
                  }}>
                    <Ic d={b.icon} s={11} stroke="#fff" />
                  </div>
                  <div className="serif" style={{
                    fontSize: mob ? 11.5 : 13, fontWeight: 700,
                    color: "#fff", lineHeight: 1.2, fontStyle: "normal",
                  }}>{b.name}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.58)", marginTop: 2 }}>{b.tag}</div>
                </div>
              </div>
            </SR>
          ))}
        </div>
      </Sec>

      {/* ══ TIMELINE ═══════════════════════════════════════════════════ */}
      <Sec bg={C.gray} py={py} px={px}>
        <SHead label="Our Journey" title="Milestones That Define Us" mob={mob} tab={tab} />
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
          gap: mob ? 0 : "0 44px",
        }}>
          {TIMELINE.map((t, i) => (
            <SR key={t.yr} delay={i * 0.06}>
              <div style={{ display: "flex", gap: 13, marginBottom: mob ? 16 : 20 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div className="tl-dot"><Ic d={t.icon} s={12} stroke={C.navy} /></div>
                  {i < TIMELINE.length - (mob ? 1 : 2) && (
                    <div style={{ width: 1, flex: 1, minHeight: 22, background: C.border, marginTop: 4 }} />
                  )}
                </div>
                <div style={{ paddingBottom: mob ? 16 : 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span className="serif" style={{ fontSize: 16, fontWeight: 900, color: C.red }}>{t.yr}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{t.t}</span>
                  </div>
                  <p style={{ fontSize: 12.5, lineHeight: 1.75, color: C.muted, margin: 0 }}>{t.d}</p>
                </div>
              </div>
            </SR>
          ))}
        </div>
      </Sec>

      {/* ══ VALUES ══════════════════════════════════════════════════════ */}
      <Sec bg={C.white} py={py} px={px}>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
          gap: mob ? 28 : 48, alignItems: "stretch",
        }}>
          <SR cls="sr-l" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Lbl text="Why Choose Us" />
            <h2 className="serif" style={{
              fontSize: mob ? 22 : tab ? 26 : 30, fontWeight: 900,
              color: C.navy, lineHeight: 1.1, letterSpacing: "-0.4px",
              fontStyle: "normal", marginBottom: 8,
            }}>
              The Sheetal Standard
            </h2>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: C.muted, marginBottom: 22 }}>
              What separates us from every other real estate firm in Nepal.
            </p>
            {/* FIX: renamed map variable v → val to avoid shadowing useInView's v boolean */}
            {VALUES.map((val, i) => (
              <SR key={val.n} delay={i * 0.06}>
                <div className="vi" style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div className="vi-num">{val.n}</div>
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 3 }}>{val.t}</h4>
                    <p style={{ fontSize: 12, lineHeight: 1.75, color: C.muted, margin: 0 }}>{val.d}</p>
                  </div>
                </div>
              </SR>
            ))}
          </SR>

          <SR cls="sr-r" delay={0.1} style={{ display: "flex" }}>
            <div style={{
              flex: 1, background: C.navy,
              padding: mob ? "24px 18px" : "32px 26px",
              borderRadius: 4, position: "relative", overflow: "hidden",
              display: "flex", flexDirection: "column", justifyContent: "center",
            }}>
              <div style={{
                position: "absolute", top: 0, right: 0, width: 140, height: 140,
                background: "radial-gradient(circle,rgba(224,36,36,0.14) 0%,transparent 70%)",
                pointerEvents: "none",
              }} />
              <div style={{ position: "absolute", left: 0, top: 0, width: 3, height: "100%", background: C.red }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div className="serif" style={{ fontSize: 26, color: C.red, lineHeight: 1, marginBottom: 10, fontWeight: 900 }}>★</div>
                <h3 className="serif" style={{
                  fontSize: mob ? 14 : 16, fontWeight: 800,
                  color: "#fff", marginBottom: 8, lineHeight: 1.3, fontStyle: "normal",
                }}>
                  Nepal's Most Trusted Real Estate Brand
                </h3>
                <p style={{ fontSize: 12, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", marginBottom: 18 }}>
                  Fifteen years of consistent excellence has made Sheetal synonymous with integrity,
                  professionalism, and results across Nepal.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    "10,000+ Families Served",
                    "Nepal's First Property Management Firm",
                    "7 Sister Brands & Growing",
                    "20+ Cities Across Nepal",
                    "Verified Listings Only",
                    "In-House Legal & Compliance",
                  ].map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 15, height: 15, borderRadius: 3, background: C.red, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Ic d={I.check} s={8} stroke="#fff" sw={2.5} />
                      </div>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SR>
        </div>
      </Sec>

      {/* ══ AWARDS ══════════════════════════════════════════════════════ */}
      <section style={{ background: C.red, padding: `26px ${px}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4,1fr)",
            gap: 8,
          }}>
            {[
              { sym: "★", text: "Nepal's #1 Property Management" },
              { sym: "◆", text: "Best Real Estate Brand 2023" },
              { sym: "▲", text: "Excellence in Client Service" },
              { sym: "●", text: "Most Trusted Brand 2024" },
            ].map((a, i) => (
              <SR key={a.text} delay={i * 0.05}>
                <div style={{
                  padding: mob ? "14px 10px" : "15px 12px",
                  background: "rgba(0,0,0,0.10)", textAlign: "center",
                  borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)",
                  transition: "background 0.2s", cursor: "default",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.22)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.10)"}
                >
                  <div style={{ fontSize: 14, color: "#fff", marginBottom: 6, opacity: 0.8 }}>{a.sym}</div>
                  <div style={{ fontSize: mob ? 10 : 11, fontWeight: 600, color: "#fff", lineHeight: 1.5 }}>{a.text}</div>
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
          title="The Minds Behind Sheetal"
          sub="Experienced professionals combining deep local knowledge with world-class service standards."
          center
          mob={mob} tab={tab}
        />
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "repeat(3,1fr)" : "repeat(6,1fr)",
          gap: mob ? 10 : 14,
        }}>
          {TEAM.map((m, i) => (
            <SR key={m.name} delay={i * 0.05}>
              <div className="tm">
                <div className="tm-av">
                  <div style={{
                    width: "100%", height: "100%", background: "var(--r06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: mob ? 14 : 18, fontWeight: 900, color: C.red,
                    fontFamily: "'Outfit',sans-serif",
                  }}>{m.ini}</div>
                </div>
                <div style={{ fontSize: mob ? 10 : 12, fontWeight: 700, color: C.navy }}>{m.name}</div>
                <div style={{
                  fontSize: 9, color: C.red, marginTop: 2,
                  letterSpacing: "0.04em", fontWeight: 600, textTransform: "uppercase",
                }}>{m.role}</div>
              </div>
            </SR>
          ))}
        </div>
      </Sec>

      {/* ══ CITIES ══════════════════════════════════════════════════════ */}
      <Sec bg={C.gray} py={py} px={px}>
        <SHead label="Market Presence" title="Nepal's Widest Property Network" center mob={mob} tab={tab} />
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "repeat(3,1fr)" : tab ? "repeat(4,1fr)" : "repeat(5,1fr)",
          gap: 8,
        }}>
          {CITIES.map((c, i) => (
            <SR key={c + i} delay={i * 0.02}>
              <div className="ct">
                <div style={{ fontSize: 9, marginBottom: 3, color: C.red, fontWeight: 700 }}>◉</div>
                <div style={{ fontSize: mob ? 11 : 12, fontWeight: 600, color: C.navy }}>{c}</div>
              </div>
            </SR>
          ))}
        </div>
      </Sec>

      {/* ══ PROCESS ═════════════════════════════════════════════════════ */}
      <Sec bg={C.white} py={py} px={px}>
        <SHead label="How We Work" title="A Process Built Around You" center mob={mob} tab={tab} />
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4,1fr)",
          gap: 10,
        }}>
          {PROCESS.map((p, i) => (
            <SR key={p.n} delay={i * 0.06}>
              <div className="pc">
                <div className="pc-n">{p.n}</div>
                <h4 className="serif" style={{
                  fontSize: 14, fontWeight: 800,
                  color: C.navy, margin: "7px 0 7px", fontStyle: "normal",
                }}>{p.t}</h4>
                <p style={{ fontSize: 12.5, lineHeight: 1.75, color: C.muted, margin: 0 }}>{p.d}</p>
              </div>
            </SR>
          ))}
        </div>
      </Sec>

      {/* ══ MAP + CONTACT ════════════════════════════════════════════════ */}
      <section style={{ background: C.navy, padding: `${py} ${px}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SR style={{ marginBottom: mob ? 18 : 24 }}>
            <Lbl text="Find Us" />
            <h2 className="serif" style={{
              fontSize: mob ? 22 : tab ? 26 : 32, fontWeight: 900,
              color: "#fff", lineHeight: 1.1, letterSpacing: "-0.4px", fontStyle: "normal",
            }}>
              Visit Our <span style={{ color: C.red }}>Office</span>
            </h2>
          </SR>

          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
            gap: 10, marginBottom: 10,
          }}>
            <SR cls="sr-l">
              <iframe
                title="Sheetal Real Estate Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.06245053072!2d85.33873427514332!3d27.71534012513476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQ0JzM4LjkiTiA4NcKwMjAnMjguMiJF!5e0!3m2!1sen!2snp!4v1713540000000!5m2!1sen!2snp"
                width="100%" height={mob ? 200 : 300}
                style={{ border: 0, display: "block", borderRadius: 4 }}
                allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </SR>

            <SR cls="sr-r" delay={0.08}>
              <div style={{
                background: "var(--r06)", border: "0.5px solid var(--r14)",
                minHeight: mob ? "auto" : 300,
                padding: mob ? "18px 16px" : "22px 20px",
                borderRadius: 4, display: "flex",
                flexDirection: "column", justifyContent: "space-between", gap: 14,
              }}>
                <div>
                  <div className="serif" style={{
                    fontSize: 22, fontWeight: 900, color: C.red, lineHeight: 1, marginBottom: 4,
                  }}>HQ</div>
                  <h3 className="serif" style={{
                    fontSize: 14, fontWeight: 800, color: "#fff",
                    marginBottom: 14, fontStyle: "normal",
                  }}>
                    Sheetal Real Estate Pvt. Ltd.
                  </h3>
                  {[
                    { icon: I.map,   text: "Bansbari, Opposite Namuna Fashion College, Kathmandu, Nepal" },
                    { icon: I.phone, text: "+977 9801000434 / 9801000435" },
                    { icon: I.mail,  text: "info@sheetalproperty.com" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 9, marginBottom: 10, alignItems: "flex-start" }}>
                      <div style={{ marginTop: 1, flexShrink: 0 }}><Ic d={item.icon} s={12} stroke={C.red} /></div>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.56)", lineHeight: 1.65 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.1)", marginBottom: 12 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <a href="tel:+9779801000434" className="btn-p" style={{ flex: 1, textAlign: "center", fontSize: 11 }}>Call Now</a>
                    <a href="mailto:info@sheetalproperty.com" className="btn-g"
                      style={{ flex: 1, textAlign: "center", fontSize: 11, color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}>
                      Email Us
                    </a>
                  </div>
                  <p style={{
                    fontSize: 9, color: "rgba(255,255,255,0.27)", marginTop: 10,
                    letterSpacing: "0.1em", textAlign: "center", fontWeight: 700, textTransform: "uppercase",
                  }}>
                    SUN – FRI · 9:00 AM – 6:00 PM
                  </p>
                </div>
              </div>
            </SR>
          </div>

          {/* Branch offices */}
          <SR delay={0.1}>
            <div style={{
              display: "grid",
              gridTemplateColumns: mob ? "1fr" : "repeat(3,1fr)",
              gap: 8,
            }}>
              {[
                { brand: "Munal & Mayur Resort",   loc: "Patrenesh, Chitwan, Nepal",         icon: I.hotel },
                { brand: "Queens by Sheetal",       loc: "Kathmandu, Nepal",                  icon: I.cut   },
                { brand: "Chitwan Tourism Village", loc: "Chitwan National Park Area, Nepal", icon: I.map   },
              ].map(o => (
                <div key={o.brand} style={{
                  background: "var(--r06)", border: "0.5px solid var(--r14)",
                  padding: "13px 15px", display: "flex", gap: 11, alignItems: "center",
                  transition: "background 0.2s, border-color 0.2s",
                  cursor: "default", borderRadius: 4,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--r14)"; e.currentTarget.style.borderColor = C.red; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--r06)"; e.currentTarget.style.borderColor = "var(--r14)"; }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 4, background: C.red, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Ic d={o.icon} s={12} stroke="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{o.brand}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", marginTop: 2 }}>{o.loc}</div>
                  </div>
                </div>
              ))}
            </div>
          </SR>
        </div>
      </section>

      {/* ══ TESTIMONIAL ═════════════════════════════════════════════════ */}
      <section style={{ background: C.white, padding: `${py} ${px}` }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <SR>
            <div className="serif" style={{
              fontSize: 40, color: C.red, lineHeight: 1,
              marginBottom: 10, opacity: 0.28, fontWeight: 900,
            }}>"</div>
            <p className="serif" style={{
              fontSize: mob ? 15 : 18, fontWeight: 700,
              color: C.navy, lineHeight: 1.6,
              marginBottom: 18, letterSpacing: "-0.2px", fontStyle: "normal",
            }}>
              Listen To Your Real Estate Agent Not Your Friend's Uncle Who Bought A House 7 Years Ago
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 4,
                background: "var(--r06)", border: "1px solid var(--r14)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 900, color: C.red,
                fontFamily: "'Outfit',sans-serif",
              }}>ST</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>Sanit Tamang</div>
                <div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
                  CEO, Sheetal Real Estate
                </div>
              </div>
            </div>
          </SR>
        </div>
      </section>

    </div>
  );
}
