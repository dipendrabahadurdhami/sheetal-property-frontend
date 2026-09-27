import React, { useState } from "react";
import { FaCheckCircle, FaChartBar, FaHandshake, FaCertificate } from "react-icons/fa";

const BENEFITS = [
  { icon: <FaChartBar />, text: "Get pre-approved Home Loan Assistance" },
  { icon: <FaHandshake />, text: "Sell / Buy at maximum or minimum price" },
  { icon: <FaCertificate />, text: "Valuation Certificate to negotiate better" },
];

const ExtraValue = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      borderTop: "2px solid #e5e7eb",
      paddingTop: "2rem",
      marginBottom: "2rem",
    }}>
      <div
        style={{
          background: "var(--d)",
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "0",
        }}
      >
        {/* subtle background texture */}
        <div style={{
          position: "absolute", inset: 0,
          background: "repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(255,255,255,0.015) 40px,rgba(255,255,255,0.015) 80px)",
          pointerEvents: "none",
        }} />

        {/* Red left accent bar */}
        <div style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: "4px",
          background: "var(--r)",
        }} />

        {/* ── Main content ── */}
        <div style={{ padding: "28px 28px 28px 36px", position: "relative" }}>

          {/* Free badge + heading */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <span style={{
              background: "#16a34a",
              color: "#fff",
              fontSize: "9px",
              fontWeight: "800",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "3px 10px",
              borderRadius: "20px",
            }}>
              Free
            </span>
            <span style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.45)",
              fontWeight: "600",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              Property Valuation
            </span>
          </div>

          <h3 style={{
            fontSize: "clamp(18px,2.5vw,24px)",
            fontWeight: "800",
            color: "#fff",
            lineHeight: 1.2,
            marginBottom: "20px",
            letterSpacing: "-0.3px",
          }}>
            Know the{" "}
            <span style={{ color: "var(--r)" }}>exact value</span>
            {" "}of this property
          </h3>

          {/* Benefits list */}
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 24px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
            {BENEFITS.map((b, i) => (
              <li key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "13px",
                color: "rgba(255,255,255,0.75)",
              }}>
                <span style={{
                  color: "var(--r)",
                  fontSize: "14px",
                  flexShrink: 0,
                }}>
                  <FaCheckCircle />
                </span>
                {b.text}
              </li>
            ))}
          </ul>

          {/* CTA button */}
          <button
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 28px",
              background: hovered ? "#c81e1e" : "var(--r)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              letterSpacing: "0.03em",
              transition: "background 0.2s, transform 0.15s",
              transform: hovered ? "translateY(-2px)" : "translateY(0)",
              boxShadow: hovered ? "0 8px 24px rgba(224,36,36,0.4)" : "none",
            }}
          >
            Request Valuation →
          </button>
        </div>

        {/* ── Right decorative panel — hidden on small ── */}
        <div
          className="hidden md:flex"
          style={{
            width: "160px",
            background: "rgba(255,255,255,0.04)",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "16px",
            padding: "24px 20px",
          }}
        >
          {[
            { num: "100%", label: "Accurate" },
            { num: "Free", label: "Always" },
            { num: "24hr", label: "Report" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "var(--r)",
                lineHeight: 1,
              }}>{s.num}</div>
              <div style={{
                fontSize: "9px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginTop: "3px",
              }}>{s.label}</div>
              {i < 2 && (
                <div style={{
                  width: "24px",
                  height: "1px",
                  background: "rgba(255,255,255,0.1)",
                  margin: "12px auto 0",
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExtraValue;