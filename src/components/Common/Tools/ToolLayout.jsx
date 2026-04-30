// src/components/Common/Tools/ToolLayout.jsx
// Shared wrapper used by ALL tool pages — hero, breadcrumb, disclaimer, consistent padding
// Usage: <ToolLayout title="..." subtitle="..." icon="..." badge="...">  ...your tool JSX... </ToolLayout>

import { Link } from "react-router-dom";

const TOOLS_NAV = [
  { label: "Unit Converter",      path: "/tools/unit-converter" },
  { label: "EMI Calculator",      path: "/tools/emi-calculator" },
  { label: "ROI Calculator",      path: "/tools/roi-calculator" },
  { label: "Land Estimator",      path: "/tools/land-estimator" },
  { label: "Property Tax",        path: "/tools/property-tax"   },
  { label: "Rent vs Buy",         path: "/tools/rent-vs-buy"    },
];

export default function ToolLayout({ title, subtitle, icon, badge, children }) {
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <div className="ab" style={{ minHeight: "100vh", background: "var(--l)" }}>

      {/* ── HERO BANNER ── */}
      <section
        style={{
          background: "var(--d)",
          marginTop: "50px",
          padding: "72px 24px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* subtle grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(249,250,251,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(249,250,251,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />
        {/* red accent line top */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "3px",
            background: "var(--r)",
          }}
        />

        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
          {/* breadcrumb */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "28px",
              fontSize: "12px",
              color: "rgba(249,250,251,0.45)",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              Home
            </Link>
            <span>/</span>
            <span style={{ color: "rgba(249,250,251,0.45)" }}>Tools</span>
            <span>/</span>
            <span style={{ color: "var(--r)" }}>{title}</span>
          </div>

          {/* badge */}
          {badge && (
            <div className="lbl" style={{ marginBottom: "16px" }}>
              <div className="lbl-line" style={{ background: "var(--r)" }} />
              <span className="lbl-txt">{badge}</span>
            </div>
          )}

          {/* title row */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
            {icon && (
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  background: "var(--r)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "4px",
                  fontSize: "22px",
                }}
              >
                {icon}
              </div>
            )}
            <div>
              <h1
                className="serif"
                style={{
                  fontSize: "clamp(28px, 4vw, 52px)",
                  fontWeight: 700,
                  color: "var(--l)",
                  lineHeight: 1.05,
                  letterSpacing: "-1px",
                  margin: 0,
                }}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  style={{
                    marginTop: "12px",
                    fontSize: "14px",
                    color: "rgba(249,250,251,0.55)",
                    fontFamily: "'DM Sans', sans-serif",
                    lineHeight: 1.7,
                    maxWidth: "560px",
                    opacity: 1,
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOL NAV TABS ── */}
      <div
        style={{
          borderBottom: "1px solid rgba(17,24,39,0.08)",
          background: "#fff",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            gap: "0",
            padding: "0 24px",
          }}
        >
          {TOOLS_NAV.map((t) => {
            const active = currentPath === t.path;
            return (
              <Link
                key={t.path}
                to={t.path}
                style={{
                  display: "inline-block",
                  padding: "14px 18px",
                  fontSize: "12px",
                  fontWeight: active ? 600 : 400,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.04em",
                  color: active ? "var(--r)" : "var(--d)",
                  textDecoration: "none",
                  borderBottom: active ? "2px solid var(--r)" : "2px solid transparent",
                  whiteSpace: "nowrap",
                  transition: "color 0.2s, border-color 0.2s",
                  opacity: active ? 1 : 0.65,
                }}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px 80px" }}>
        {children}
      </main>

      {/* ── DISCLAIMER ── */}
      <div
        style={{
          background: "rgba(224,36,36,0.04)",
          borderTop: "1px solid rgba(224,36,36,0.12)",
          padding: "20px 24px",
        }}
      >
        <p
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            fontSize: "11px",
            color: "var(--d)",
            opacity: 0.45,
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          ⚠️ All calculations are indicative only and based on general Nepal real estate benchmarks.
          Results do not constitute financial, legal, or investment advice.
          Consult a qualified professional before making property decisions.
          Interest rates are approximate as per Nepal Rastra Bank guidelines.
        </p>
      </div>
    </div>
  );
}