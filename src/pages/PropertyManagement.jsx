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
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  map: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7v.01",
  phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.7A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.94a16 16 0 006.15 6.15l1.31-1.31a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  check: "M20 6L9 17l-5-5",
  arrow: "M5 12h14M12 5l7 7-7 7",
  userCheck: "M9 11a4 4 0 100-8 4 4 0 000 8z M2 21v-2a4 4 0 014-4h3 M16 11l2 2 4-4",
  cash: "M2 7h20v10H2z M12 9a3 3 0 100 6 3 3 0 000-6z M5.5 12h.01 M18.5 12h.01",
  tool: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.77z",
  clipboardCheck: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 4a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1h-4a1 1 0 01-1-1z M9 14l2 2 4-4",
  fileText: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M9 13h6 M9 17h6 M9 9h1",
  shieldCheck: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",
  chart: "M18 20V10M12 20V4M6 20v-6",
  calendar: "M8 2v4M16 2v4M3 9h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
};

/* ══ DATA ════════════════════════════════════════════════════════════ */
const SERVICES = [
  { icon: I.userCheck, title: "Tenant Sourcing & Screening", desc: "We market your vacancy, vet every applicant, and place reliable tenants with verified income, identity, and rental history." },
  { icon: I.cash, title: "Rent Collection & Accounting", desc: "On-time collection, digital records, and a clear monthly statement — no awkward conversations, no chasing payments." },
  { icon: I.tool, title: "Maintenance & Repairs", desc: "A trusted network of plumbers, electricians, and contractors handles repairs quickly, with costs approved by you in advance." },
  { icon: I.clipboardCheck, title: "Routine Inspections", desc: "Scheduled property walkthroughs with photo reports, so you always know the condition of your investment." },
  { icon: I.fileText, title: "Lease Management & Renewals", desc: "Drafting, renewing, and enforcing lease agreements that protect your interests and stay compliant with local norms." },
  { icon: I.shieldCheck, title: "Legal & Compliance Support", desc: "From rental agreements to tenant disputes, we coordinate with legal partners so your property stays protected." },
];

const PROCESS = [
  { n: "01", t: "Property Assessment", d: "A free walkthrough and rental market valuation so you know exactly what your property can earn." },
  { n: "02", t: "Onboarding & Listing", d: "Professional photos, pricing strategy, and listing across our network to minimise vacancy time." },
  { n: "03", t: "Tenant Placement", d: "Screening, lease signing, and move-in coordination — handled start to finish on your behalf." },
  { n: "04", t: "Ongoing Management", d: "Rent collection, maintenance, inspections, and monthly reporting, for as long as we manage your property." },
];

const VALUES = [
  { n: "01", t: "Transparent Monthly Reports", d: "Every rupee in and out is recorded and shared with you — no surprises, no hidden deductions." },
  { n: "02", t: "Faster Vacancy Filling", d: "Our buyer and tenant network means your property spends less time sitting empty between tenants." },
  { n: "03", t: "Verified, Screened Tenants", d: "Every tenant is checked before move-in, reducing the risk of late payments or property misuse." },
  { n: "04", t: "Built for Absentee & NRN Owners", d: "Living abroad or in another city? We act as your eyes, ears, and hands on the ground in Nepal." },
];

const FAQS = [
  { q: "What types of properties do you manage?", a: "Residential houses, apartments and flats, commercial spaces, and land — anywhere across the Kathmandu Valley and beyond." },
  { q: "How much does property management cost?", a: "Fees depend on property type, location, and the scope of services you need. Request a free assessment and we'll give you a clear, written quote — no hidden charges." },
  { q: "How are maintenance issues handled?", a: "Tenants report issues through us, we get quotes from our vetted contractor network, and nothing above an agreed threshold is spent without your approval." },
  { q: "I live abroad — can I still manage my property with you?", a: "Yes. Many of our clients are NRN owners. We handle everything locally and send you regular updates and reports, wherever you are." },
  { q: "How do I get started?", a: "Submit a quick requirement form or call us directly. We'll schedule a free property assessment within a few days." },
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
export default function PropertyManagement() {
  const [hero, setHero] = useState(false);
  const [prog, setProg] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
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
        <title>Property Management Services — Sheetal Real Estate Nepal</title>
        <meta name="description" content="Full-service property management in Nepal — tenant screening, rent collection, maintenance, inspections, and legal compliance. Built for local and NRN property owners." />
        <meta name="keywords" content="property management Nepal, rental management Kathmandu, NRN property management, tenant screening Nepal, rent collection service" />
        <link rel="canonical" href="https://sheetalproperty.com/services/management" />
        <meta property="og:title" content="Property Management Services — Sheetal Real Estate Nepal" />
        <meta property="og:description" content="Tenant screening, rent collection, maintenance, inspections, and legal compliance — full-service property management for owners in Nepal." />
        <meta property="og:url" content="https://sheetalproperty.com/services/management" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sheetal Property Nepal" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Property Management Services — Sheetal Real Estate Nepal" />
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
                <Chip>Full-Service Property Management</Chip>
              </div>
              <h1 className="serif" style={{
                fontSize: mob ? 30 : tab ? 38 : 52,
                fontWeight: 900, lineHeight: 1.05,
                letterSpacing: mob ? "-1px" : "-1.5px",
                color: C.navy, marginBottom: 14, fontStyle: "normal",
                ...fade(hero, 0.12),
              }}>
                Property Management, <span style={{ color: C.red }}>Done Right</span>
              </h1>
              <p style={{
                fontSize: 13, lineHeight: 1.8, color: C.muted,
                maxWidth: 440, marginBottom: 22,
                ...fade(hero, 0.22),
              }}>
                Hand over the day-to-day. From tenant screening and rent collection
                to maintenance, inspections, and legal compliance — Shetal Real
                Estate manages your property with the same care we'd give our own.
              </p>
              <div style={{
                display: "flex", gap: 10, flexWrap: "wrap",
                marginBottom: mob ? 20 : 24,
                ...fade(hero, 0.30),
              }}>
                <Link to="/requirementForm?agent_id=1" className="btn-p">Request a Free Assessment</Link>
                <a href="tel:+9779801000434" className="btn-g">+977 9801000434</a>
              </div>
              <div style={{
                display: "flex", gap: 22, flexWrap: "wrap",
                opacity: hero ? 0.45 : 0,
                transition: "opacity 1s ease 0.5s",
              }}>
                {["Residential", "Commercial", "Land", "NRN Owners"].map(t => (
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
                  { v: "250+", l: "Properties Managed" },
                  { v: "98%", l: "On-Time Rent Collection" },
                  { v: "<48h", l: "Maintenance Response" },
                  { v: "15+", l: "Years of Experience" },
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
                  Trusted by property owners across the Kathmandu Valley
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
              Tenant Screening · Rent Collection · Maintenance Coordination · Property Inspections · Lease Renewals · Financial Reporting · Legal Compliance ·
            </span>
          ))}
        </div>
      </div>

      {/* ══ WHY US ════════════════════════════════════════════════════ */}
      <Sec bg={C.white} py={py} px={px}>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
          gap: mob ? 28 : 48, alignItems: "center",
        }}>
          <SR cls="sr-l">
            <Lbl text="Why Owners Choose Us" />
            <h2 className="serif" style={{
              fontSize: mob ? 22 : tab ? 26 : 30, fontWeight: 900,
              color: C.navy, lineHeight: 1.1, letterSpacing: "-0.4px",
              fontStyle: "normal", marginBottom: 14,
            }}>
              Your Property, Managed Like Our Own
            </h2>
            {[
              "Owning rental property should build wealth, not consume your weekends. Late-night tenant calls, unpaid rent, and unverified repair bills are the reality for most self-managed owners in Nepal.",
              "Shetal Real Estate takes that burden off your plate. We screen tenants properly, collect rent on schedule, coordinate repairs through a vetted contractor network, and send you a clear monthly report — every month, without exception.",
              "Whether you're based in Kathmandu, elsewhere in Nepal, or living abroad as an NRN owner, we act as your local team on the ground — protecting your investment and your time.",
            ].map((p, i) => (
              <p key={i} style={{ fontSize: 13, lineHeight: 1.8, color: C.muted, marginBottom: 10 }}>{p}</p>
            ))}
          </SR>

          {!mob && (
            <SR cls="sr-r" delay={0.1}>
              <div style={{ position: "relative" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&q=80"
                    alt="Managed apartment building"
                    style={{ width: "100%", height: 148, objectFit: "cover", borderRadius: 4 }}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&q=80"
                    alt="Modern residential property"
                    style={{ width: "100%", height: 148, objectFit: "cover", marginTop: 22, borderRadius: 4 }}
                  />
                </div>
                <div style={{
                  position: "absolute", bottom: -12, left: -12,
                  background: C.red, color: "#fff", padding: "12px 16px",
                  boxShadow: "0 10px 26px rgba(224,36,36,0.22)", borderRadius: 4,
                }}>
                  <div className="serif" style={{ fontSize: 24, fontWeight: 900, lineHeight: 1 }}>98%</div>
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", marginTop: 0, textTransform: "uppercase" }}>
                    Occupancy Rate
                  </div>
                </div>
              </div>
            </SR>
          )}
        </div>
      </Sec>

      {/* ══ WHAT'S INCLUDED ═══════════════════════════════════════════ */}
      <Sec bg={C.gray} py={py} px={px}>
        <SHead
          label="What's Included"
          title="Everything Your Property Needs, Handled."
          sub="A single point of contact for every part of running a rental property — so you don't have to juggle five different people."
          mob={mob} tab={tab}
        />
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr",
          gap: 14,
        }}>
          {SERVICES.map((s, i) => (
            <SR key={s.title} delay={i * 0.05}>
              <div className="svc">
                <div className="svc-icon">
                  <Ic d={s.icon} s={18} stroke="var(--r)" />
                </div>
                <h3 className="serif" style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 8 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 12.5, lineHeight: 1.7, color: C.muted }}>{s.desc}</p>
              </div>
            </SR>
          ))}
        </div>
      </Sec>

      {/* ══ HOW IT WORKS ══════════════════════════════════════════════ */}
      <Sec bg={C.white} py={py} px={px}>
        <SHead
          label="How It Works"
          title="From First Call to Ongoing Management"
          sub="A simple, transparent process designed to get your property earning with minimal effort on your part."
          mob={mob} tab={tab}
        />
        <div className="g-proc" style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
          gap: 14,
        }}>
          {PROCESS.map((p, i) => (
            <SR key={p.n} delay={i * 0.06}>
              <div className="pc">
                <div className="pc-n" style={{ marginBottom: 14 }}>{p.n}</div>
                <h3 className="serif" style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 8 }}>{p.t}</h3>
                <p style={{ fontSize: 12.5, lineHeight: 1.7, color: C.muted }}>{p.d}</p>
              </div>
            </SR>
          ))}
        </div>
      </Sec>

      {/* ══ OWNER BENEFITS ════════════════════════════════════════════ */}
      <Sec bg={C.gray} py={py} px={px}>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "1fr 1.3fr",
          gap: mob ? 24 : 48,
        }}>
          <SR cls="sr-l">
            <Lbl text="Owner Benefits" />
            <h2 className="serif" style={{
              fontSize: mob ? 22 : tab ? 26 : 30, fontWeight: 900,
              color: C.navy, lineHeight: 1.15, letterSpacing: "-0.4px",
              fontStyle: "normal",
            }}>
              Built Around What Owners Actually Care About
            </h2>
          </SR>
          <div>
            {VALUES.map((v, i) => (
              <SR key={v.n} delay={i * 0.05}>
                <div className="vi" style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                  <div className="vi-num">{v.n}</div>
                  <div>
                    <h3 className="serif" style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 4 }}>{v.t}</h3>
                    <p style={{ fontSize: 12.5, lineHeight: 1.7, color: C.muted }}>{v.d}</p>
                  </div>
                </div>
              </SR>
            ))}
          </div>
        </div>
      </Sec>

      {/* ══ FAQ ═══════════════════════════════════════════════════════ */}
      <Sec bg={C.white} py={py} px={px}>
        <SHead
          label="Common Questions"
          title="Property Management FAQs"
          mob={mob} tab={tab}
        />
        <div style={{ maxWidth: 760 }}>
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <SR key={f.q} delay={i * 0.04}>
                <div
                  className="pc"
                  style={{ marginBottom: 10, cursor: "pointer" }}
                  onClick={() => setOpenFaq(open ? -1 : i)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <h3 className="serif" style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>{f.q}</h3>
                    <span style={{ flexShrink: 0, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.25s" }}>
                      <Ic d={I.arrow} s={14} stroke="var(--r)" sw={2} />
                    </span>
                  </div>
                  {open && (
                    <p style={{ fontSize: 12.5, lineHeight: 1.7, color: C.muted, marginTop: 10 }}>{f.a}</p>
                  )}
                </div>
              </SR>
            );
          })}
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
              Ready to Make Property Ownership Effortless?
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", maxWidth: 460 }}>
              Get a free property assessment and a clear, written quote — no obligation.
            </p>
          </SR>
          <SR delay={0.1}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/requirementForm?agent_id=1" className="btn-p">Request a Free Assessment</Link>
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