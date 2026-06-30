import React, { useState } from "react";
import {
  IoLocationOutline, IoCashOutline, IoCarOutline,
  IoHomeOutline, IoChevronDownOutline, IoChevronUpOutline,
  IoPeopleOutline,
} from "react-icons/io5";

const PAGE_SIZE = 12;

// ── Budget: 5000000 → Rs. 50 Lakh, 15000000 → Rs. 1.5 Cr ───────────────────
function fmt(val) {
  const n = parseInt(String(val || "").replace(/,/g, ""), 10);
  if (!n || isNaN(n)) return null;
  if (n >= 10000000) return "Rs. " + (n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 1).replace(/\.0$/, "") + " Cr";
  if (n >= 100000)   return "Rs. " + (n / 100000).toFixed(n % 100000 === 0 ? 0 : 1).replace(/\.0$/, "") + " L";
  return "Rs. " + n.toLocaleString("en-IN");
}

function budgetRange(min, max) {
  const a = fmt(min), b = fmt(max);
  if (a && b) return a + " – " + b;
  return b || a || null;
}

function purposeColor(t) {
  if (!t) return null;
  const l = t.toLowerCase();
  if (l === "sale") return { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" };
  if (l === "rent") return { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" };
  return { bg: "var(--r06)", color: "var(--r)", border: "rgba(224,36,36,0.2)" };
}

// ── Single demand card ────────────────────────────────────────────────────────
const DemandCard = ({ d }) => {
  const [expanded, setExpanded] = useState(false);
  const pc = purposeColor(d.tenant_option);
  const budget = budgetRange(d.minimum_budget, d.maximum_budget);
  const facs = Array.isArray(d.facilities) ? d.facilities : [];
  const facNames = facs.map(f => f?.name || f).filter(Boolean);
  const vehicles = typeof d.vehicles === "string" ? (() => { try { return JSON.parse(d.vehicles); } catch { return {}; } })() : (d.vehicles || {});
  const vehicleEntries = Object.entries(vehicles).filter(([, v]) => v > 0);

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #eaecef",
      borderRadius: "6px",
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      transition: "box-shadow 0.18s, border-color 0.18s, transform 0.18s",
      cursor: "default",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)";
      e.currentTarget.style.borderColor = "rgba(224,36,36,0.25)";
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "#eaecef";
      e.currentTarget.style.transform = "translateY(0)";
    }}
    >
      {/* Top row: type badge + purpose */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        {d.requirement ? (
          <span style={{
            fontSize: "11px", fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.08em",
            color: "var(--r)",
          }}>
            {d.requirement}
          </span>
        ) : <span />}
        {pc && d.tenant_option && (
          <span style={{
            fontSize: "10px", fontWeight: 700,
            padding: "3px 8px", borderRadius: "3px",
            background: pc.bg, color: pc.color,
            border: `1px solid ${pc.border}`,
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>
            {d.tenant_option}
          </span>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "#f1f3f5" }} />

      {/* Meta pills row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {d.prefered_location && (
          <span style={{
            display: "flex", alignItems: "center", gap: "5px",
            fontSize: "12px", color: "#374151", fontWeight: 500,
          }}>
            <IoLocationOutline style={{ width: "13px", height: "13px", color: "#9ca3af", flexShrink: 0 }} />
            {d.prefered_location}
          </span>
        )}
        {budget && (
          <span style={{
            display: "flex", alignItems: "center", gap: "5px",
            fontSize: "12px", color: "#15803d", fontWeight: 700,
            marginLeft: d.prefered_location ? "auto" : 0,
          }}>
            <IoCashOutline style={{ width: "13px", height: "13px", color: "#86efac", flexShrink: 0 }} />
            {budget}
          </span>
        )}
      </div>

      {/* Secondary info: vehicles + facilities */}
      {(vehicleEntries.length > 0 || facNames.length > 0) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
          {vehicleEntries.map(([type, qty]) => (
            <span key={type} style={{
              display: "flex", alignItems: "center", gap: "4px",
              padding: "3px 8px", borderRadius: "3px",
              background: "#f8fafc", border: "1px solid #e2e8f0",
              fontSize: "11px", color: "#475569",
            }}>
              <IoCarOutline style={{ width: "11px", height: "11px" }} />
              {type}{qty > 1 ? ` ×${qty}` : ""}
            </span>
          ))}
          {facNames.slice(0, expanded ? facNames.length : 3).map((f, i) => (
            <span key={i} style={{
              padding: "3px 8px", borderRadius: "3px",
              background: "#f8fafc", border: "1px solid #e2e8f0",
              fontSize: "11px", color: "#475569",
            }}>{f}</span>
          ))}
          {!expanded && facNames.length > 3 && (
            <button
              onClick={() => setExpanded(true)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "11px", fontWeight: 700, color: "var(--r)",
                padding: "3px 0", display: "flex", alignItems: "center", gap: "3px",
              }}
            >
              <IoChevronDownOutline style={{ width: "11px", height: "11px" }} />
              +{facNames.length - 3}
            </button>
          )}
          {expanded && facNames.length > 3 && (
            <button
              onClick={() => setExpanded(false)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "11px", fontWeight: 700, color: "var(--r)",
                padding: "3px 0", display: "flex", alignItems: "center", gap: "3px",
              }}
            >
              <IoChevronUpOutline style={{ width: "11px", height: "11px" }} />
              Less
            </button>
          )}
        </div>
      )}

      {/* Description — only if present */}
      {d.description && (
        <p style={{
          fontSize: "12px", color: "#6b7280", lineHeight: 1.6,
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {d.description}
        </p>
      )}
    </div>
  );
};

// ── Main table / grid component ───────────────────────────────────────────────
const PropertyDemandTable = ({ demands }) => {
  const [page, setPage] = useState(1);

  if (!demands || demands.length === 0) return null;

  const totalPages = Math.ceil(demands.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const paginated = demands.slice(start, start + PAGE_SIZE);

  function goTo(p) {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 300, behavior: "smooth" });
  }

  function pages() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const p = [];
    p.push(1);
    if (page > 3) p.push("…");
    for (let j = Math.max(2, page - 1); j <= Math.min(totalPages - 1, page + 1); j++) p.push(j);
    if (page < totalPages - 2) p.push("…");
    p.push(totalPages);
    return p;
  }

  return (
    <div>
      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "14px",
        marginBottom: "28px",
      }}>
        {paginated.map((d, i) => <DemandCard key={i} d={d} />)}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px",
          background: "#fff", border: "1px solid #eaecef", borderRadius: "6px",
          flexWrap: "wrap", gap: "12px",
        }}>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
            {start + 1}–{Math.min(start + PAGE_SIZE, demands.length)} of <strong>{demands.length}</strong> demands
          </p>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <button
              onClick={() => goTo(page - 1)} disabled={page === 1}
              style={{
                padding: "6px 12px", borderRadius: "4px",
                border: "1px solid #e5e7eb", background: "#fff",
                fontSize: "12px", fontWeight: 600, color: "#374151",
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.4 : 1,
              }}
            >←</button>
            {pages().map((p, i) =>
              p === "…"
                ? <span key={i} style={{ padding: "0 4px", color: "#9ca3af", fontSize: "12px" }}>…</span>
                : <button key={p} onClick={() => goTo(p)} style={{
                    width: "32px", height: "32px", borderRadius: "4px",
                    border: p === page ? "1px solid var(--r)" : "1px solid #e5e7eb",
                    background: p === page ? "var(--r)" : "#fff",
                    color: p === page ? "#fff" : "#374151",
                    fontSize: "12px", fontWeight: 700, cursor: "pointer",
                  }}>{p}</button>
            )}
            <button
              onClick={() => goTo(page + 1)} disabled={page === totalPages}
              style={{
                padding: "6px 12px", borderRadius: "4px",
                border: "1px solid #e5e7eb", background: "#fff",
                fontSize: "12px", fontWeight: 600, color: "#374151",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.4 : 1,
              }}
            >→</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDemandTable;