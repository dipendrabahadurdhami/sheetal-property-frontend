import React, { useState } from "react";
import Parser from "html-react-parser";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const PropertyHighlight = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  if (!data) return null;

  return (
    <div style={{
      borderTop: "2px solid #e5e7eb",
      paddingTop: "2rem",
      marginBottom: "2rem",
    }}>
      {/* Section Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            width: "4px", height: "22px",
            background: "var(--r)",
            borderRadius: "2px",
            display: "inline-block",
          }} />
          <span style={{
            fontSize: "clamp(18px,2.5vw,22px)",
            fontWeight: "700",
            color: "var(--d)",
          }}>
            Property Highlights
          </span>
        </div>

        {/* Expand / Collapse toggle */}
        <button
          onClick={() => setExpanded(p => !p)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            background: "var(--r06)",
            border: "1px solid var(--r14)",
            borderRadius: "8px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: "700",
            color: "var(--r)",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          {expanded ? (
            <><FaChevronUp style={{ fontSize: "10px" }} /> Show Less</>
          ) : (
            <><FaChevronDown style={{ fontSize: "10px" }} /> Show More</>
          )}
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          maxHeight: expanded ? "none" : "220px",
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div
          className="ph-content"
          style={{
            fontSize: "14px",
            lineHeight: "1.85",
            color: "var(--d)",
          }}
        >
          {data ? Parser(data) : <p style={{ color: "#9ca3af" }}>Coming soon…</p>}
        </div>

        {/* fade-out gradient when collapsed */}
        {!expanded && (
          <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "80px",
            background: "linear-gradient(transparent, var(--l, #f9fafb))",
            pointerEvents: "none",
          }} />
        )}
      </div>

      {/* Inline styles for parsed HTML content */}
      <style>{`
        .ph-content h1,.ph-content h2,.ph-content h3,.ph-content h4 {
          font-weight: 700;
          color: var(--d);
          margin: 16px 0 8px;
          line-height: 1.3;
        }
        .ph-content h2 { font-size: 17px; }
        .ph-content h3 { font-size: 15px; }
        .ph-content p  { margin-bottom: 10px; opacity: 0.82; }
        .ph-content ul,.ph-content ol {
          padding-left: 20px;
          margin-bottom: 10px;
        }
        .ph-content li { margin-bottom: 5px; opacity: 0.82; }
        .ph-content strong { font-weight: 700; color: var(--d); opacity: 1; }
        .ph-content a { color: var(--r); }
        .ph-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 12px;
          font-size: 13px;
        }
        .ph-content th, .ph-content td {
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          text-align: left;
        }
        .ph-content th { background: var(--r06); font-weight: 700; color: var(--d); }
      `}</style>
    </div>
  );
};

export default PropertyHighlight;