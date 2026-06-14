import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import "../index.css";

/* ══ HOOKS ════════════════════════════════════════════════════════════ */
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

/* ══ ATOMS ═══════════════════════════════════════════════════════════ */
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

/* ══ ICONS ═══════════════════════════════════════════════════════════ */
const I = {
  search: "M19 11a8 8 0 11-16 0 8 8 0 0116 0z M21 21l-4.35-4.35",
  shieldCheck: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",
  cash: "M2 7h20v10H2z M12 9a3 3 0 100 6 3 3 0 000-6z M5.5 12h.01 M18.5 12h.01",
  brush: "M9.06 11.9l8.07-8.06a2.85 2.85 0 114.03 4.03l-8.06 8.08 M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 00-3-3.02z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  chart: "M18 20V10M12 20V4M6 20v-6",
  globe: "M12 2a10 10 0 100 20A10 10 0 0012 2z M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.7A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.94a16 16 0 006.15 6.15l1.31-1.31a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  arrow: "M5 12h14M12 5l7 7-7 7",
};

/* ══ DATA ════════════════════════════════════════════════════════════ */
const SERVICES = [
  {
    icon: I.search,
    title: "Property Valuation",
    desc: "Fair, data-backed market valuations for residential, commercial, and land properties — so you price with confidence.",
    cta: "Request a Valuation",
    link: "/requirementForm",
  },
  {
    icon: I.shieldCheck,
    title: "Legal & Documentation",
    desc: "Title verification, deed transfer, and registration support — handled with full transparency and care.",
    cta: "Explore Legal Services",
    link: "/LegalHelp",
  },
  {
    icon: I.cash,
    title: "Home Loan Assistance",
    desc: "Bank tie-ups, EMI planning, and end-to-end support to get your financing approved faster.",
    cta: "Explore Loan Options",
    link: "/homeLone",
  },
  {
    icon: I.brush,
    title: "Interior Design",
    desc: "End-to-end interior design for new and existing properties — from concept to finished space.",
    cta: "Get in Touch",
    link: "/requirementForm",
  },
  {
    icon: I.shield,
    title: "Property Management",
    desc: "Tenant screening, rent collection, maintenance, and reporting — hands-off ownership for busy and NRN owners.",
    cta: "View Management Services",
    link: "/services/management",
  },
  {
    icon: I.chart,
    title: "Investment Advisory",
    desc: "Expert guidance on high-return zones, emerging projects, and portfolio strategy across Nepal.",
    cta: "Explore Investments",
    link: "/investment",
  },
  {
    icon: I.globe,
    title: "NRN / Foreign Buyers",
    desc: "Clear guidance on regulations, documentation, and the buying process for Nepali citizens abroad and foreign investors.",
    cta: "Get in Touch",
    link: "/requirementForm",
  },
];

/* ══ COLOURS ═════════════════════════════════════════════════════════ */
const C = {
  white: "#fff",
  gray: "#F5F6F8",
  navy: "#0F172A",
  red: "#E02424",
  border: "#E9EAEC",
  muted: "#64748B",
};

/* ══ CHIP ════════════════════════════════════════════════════════════ */
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

/* ══ SEC ═════════════════════════════════════════════════════════════ */
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

/* ══ SHEAD ═══════════════════════════════════════════════════════════ */
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
          maxWidth: 460, margin: center ? "0 auto" : 0,
        }}>{sub}</p>
      )}
    </div>
  );
}

/* ══ MAIN ════════════════════════════════════════════════════════════ */
export default function Services() {
  const [hero, setHero] = useState(false);
  const [prog, setProg] = useState(0);
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

  const px = mob ? "20px" : tab ? "32px" : "48px";
  const py = mob ? "36px" : "52px";

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
        <title>Our Services — Sheetal Real Estate Nepal</title>
        <meta name="description" content="Full-service real estate solutions in Nepal — property valuation, legal & documentation, home loan assistance, property management, investment advisory, and more." />
        <meta name="keywords" content="real estate services Nepal, property valuation Nepal, legal documentation property, home loan assistance Nepal, property management Nepal, investment advisory Nepal, NRN property services" />
        <link rel="canonical" href="https://sheetalproperty.com/services" />
        <meta property="og:title" content="Our Services — Sheetal Real Estate Nepal" />
        <meta property="og:description" content="From valuation to legal documentation — Shetal Real Estate handles every step of your property journey." />
        <meta property="og:url" content="https://sheetalproperty.com/services" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sheetal Property Nepal" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Our Services — Sheetal Real Estate Nepal" />
      </Helmet>
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
                <Chip>Full-Service Real Estate Solutions</Chip>
              </div>
              <h1 className="serif" style={{
                fontSize: mob ? 30 : tab ? 38 : 52,
                fontWeight: 900, lineHeight: 1.05,
                letterSpacing: mob ? "-1px" : "-1.5px",
                color: C.navy, marginBottom: 14, fontStyle: "normal",
                ...fade(hero, 0.12),
              }}>
                Everything Your Property Needs, <span style={{ color: C.red }}>Under One Roof</span>
              </h1>
              <p style={{
                fontSize: 13, lineHeight: 1.8, color: C.muted,
                maxWidth: 440, marginBottom: 22,
                ...fade(hero, 0.22),
              }}>
                From valuation to legal documentation, financing, management, and
                investment strategy — Shetal Real Estate handles every step of
                your property journey, so you don't have to coordinate it yourself.
              </p>
              <div style={{
                display: "flex", gap: 10, flexWrap: "wrap",
                marginBottom: mob ? 20 : 24,
                ...fade(hero, 0.30),
              }}>
                <Link to="/requirementForm" className="btn-p">Submit a Requirement</Link>
                <a href="tel:+9779801000434" className="btn-g">+977 9801000434</a>
              </div>
              <div style={{
                display: "flex", gap: 22, flexWrap: "wrap",
                opacity: hero ? 0.45 : 0,
                transition: "opacity 1s ease 0.5s",
              }}>
                {["7 Service Categories", "15+ Years", "One Point of Contact"].map(t => (
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
                  { v: "5,000+", l: "Families Served" },
                  { v: "15+", l: "Years of Expertise" },
                  { v: "2,400+", l: "Active Listings" },
                  { v: "7", l: "Service Categories" },
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
                <Ic d={I.phone} s={13} stroke={C.red} />
                <span style={{ fontSize: 11, color: C.muted }}>
                  Not sure where to start? Talk to our team — we'll guide you.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ═══════════════════════════════════════════════════ */}
      <div style={{ background: C.red, padding: "9px 0", overflow: "hidden" }}>
        <div className="mq">
          {Array(10).fill(0).map((_, i) => (
            <span key={i} style={{
              fontSize: 9, fontWeight: 800, letterSpacing: "0.28em",
              color: "#fff", paddingRight: 48, textTransform: "uppercase",
            }}>
              Property Valuation · Legal & Documentation · Home Loan Assistance · Interior Design · Property Management · Investment Advisory · NRN / Foreign Buyers ·
            </span>
          ))}
        </div>
      </div>

      {/* ══ SERVICES GRID ═════════════════════════════════════════════ */}
      <Sec bg={C.gray} py={py} px={px}>
        <SHead
          label="What We Offer"
          title="Pick a Service, We'll Take It From There"
          sub="Each service is run by a dedicated team — but coordinated through one point of contact, so nothing falls through the cracks."
          mob={mob} tab={tab}
        />
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr",
          gap: 14,
        }}>
          {SERVICES.map((s, i) => (
            <SR key={s.title} delay={i * 0.05}>
              <div className="svc" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div className="svc-icon">
                  <Ic d={s.icon} s={18} stroke="var(--r)" />
                </div>
                <h3 className="serif" style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 8 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 12.5, lineHeight: 1.7, color: C.muted, flex: 1, marginBottom: 14 }}>
                  {s.desc}
                </p>
                <Link
                  to={s.link}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 11, fontWeight: 800, letterSpacing: "0.04em",
                    color: C.red, textDecoration: "none",
                  }}
                >
                  {s.cta}
                  <Ic d={I.arrow} s={12} stroke={C.red} sw={2} />
                </Link>
              </div>
            </SR>
          ))}
        </div>
      </Sec>

      {/* ══ FINAL CTA ═════════════════════════════════════════════════ */}
      <section style={{ background: C.navy, padding: mob ? "44px 20px" : "60px 48px" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", flexDirection: mob ? "column" : "row",
          alignItems: mob ? "flex-start" : "center",
          justifyContent: "space-between", gap: 20,
        }}>
          <SR>
            <h2 className="serif" style={{
              fontSize: mob ? 22 : 30, fontWeight: 900, color: "#fff",
              lineHeight: 1.15, letterSpacing: "-0.4px", marginBottom: 6,
            }}>
              Not Sure Which Service You Need?
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", maxWidth: 460 }}>
              Tell us what you're trying to do, and we'll point you to the right team — no obligation.
            </p>
          </SR>
          <SR delay={0.1}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/requirementForm" className="btn-p">Submit a Requirement</Link>
              <a href="tel:+9779801000434" className="btn-g" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.25)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Ic d={I.phone} s={12} stroke="#fff" /> +977 9801000434
                </span>
              </a>
            </div>
          </SR>
        </div>
      </section>
    </div>
  );
}