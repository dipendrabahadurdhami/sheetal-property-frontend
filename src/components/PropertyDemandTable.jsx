import React, { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import {
  IoLocationOutline, IoCashOutline, IoCarOutline,
  IoHomeOutline, IoChevronDownOutline, IoChevronUpOutline,
  IoPeopleOutline, IoCloseOutline,
} from "react-icons/io5";
import apiClient from "../utils/apiClient";

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

// ── Property Selector Modal ───────────────────────────────────────────────────
const PropertySelectorModal = ({ isOpen, onClose, demandId, onMatchComplete }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedProperty(null);
    setMessage("");
    setResult(null);
    setLoading(true);
    apiClient.get("user-property")
      .then(res => setProperties(res.data?.data || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedProperty) return;
    setSubmitting(true);
    try {
      const res = await apiClient.post("demand-match", {
        requirement_form_id: demandId,
        property_id: selectedProperty,
        message: message || undefined,
      });
      if (res.data?.status === 200) {
        setResult({ type: "success", text: "Match submitted! The demand poster will be notified." });
        setTimeout(() => { onMatchComplete(); onClose(); }, 2000);
      } else {
        setResult({ type: "error", text: res.data?.message || "Something went wrong." });
      }
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;
      if (status === 409) setResult({ type: "error", text: msg || "You already submitted this property for this demand." });
      else if (status === 403) setResult({ type: "error", text: msg || "You can only match properties you own." });
      else setResult({ type: "error", text: msg || "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed z-[99999] inset-0" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
            <Dialog.Panel style={{ background: "#fff", borderRadius: "8px", padding: "24px", width: "100%", maxWidth: "480px", maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <Dialog.Title style={{ fontSize: "16px", fontWeight: 800, color: "#111827", margin: 0 }}>Select Your Property</Dialog.Title>
                <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: "4px" }}>
                  <IoCloseOutline style={{ width: "20px", height: "20px" }} />
                </button>
              </div>

              {loading && <p style={{ fontSize: "13px", color: "#6b7280", textAlign: "center", padding: "24px 0" }}>Loading your properties...</p>}

              {!loading && properties.length === 0 && (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 12px" }}>You don't have any properties yet.</p>
                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>Post a property first to match with demands.</p>
                </div>
              )}

              {!loading && properties.length > 0 && (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px", maxHeight: "300px", overflowY: "auto" }}>
                    {properties.map(prop => (
                      <div
                        key={prop.id}
                        onClick={() => setSelectedProperty(prop.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: "12px", padding: "12px",
                          border: selectedProperty === prop.id ? "2px solid var(--r)" : "1px solid #e5e7eb",
                          borderRadius: "6px", cursor: "pointer",
                          background: selectedProperty === prop.id ? "var(--r06)" : "#fff",
                          transition: "all 0.15s",
                        }}
                      >
                        {prop.feature_image && (
                          <img src={prop.feature_image} alt={prop.name} style={{ width: "48px", height: "48px", borderRadius: "4px", objectFit: "cover" }} />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {prop.name || "Untitled Property"}
                          </p>
                          <p style={{ fontSize: "11px", color: "#6b7280", margin: "2px 0 0" }}>
                            {prop.property_code || "N/A"}
                            {prop.total_price ? ` · Rs. ${Number(prop.total_price).toLocaleString("en-IN")}` : ""}
                          </p>
                        </div>
                        <div style={{
                          width: "18px", height: "18px", borderRadius: "50%",
                          border: selectedProperty === prop.id ? "2px solid var(--r)" : "2px solid #d1d5db",
                          background: selectedProperty === prop.id ? "var(--r)" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          {selectedProperty === prop.id && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Message (optional)</label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Add a note for the demand poster..."
                      rows={3}
                      maxLength={500}
                      style={{ width: "100%", padding: "10px", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "13px", resize: "vertical", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  {result && (
                    <div style={{
                      padding: "10px 14px", borderRadius: "6px", marginBottom: "16px", fontSize: "13px", fontWeight: 600,
                      background: result.type === "success" ? "#f0fdf4" : "#fef2f2",
                      color: result.type === "success" ? "#15803d" : "#dc2626",
                      border: `1px solid ${result.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                    }}>
                      {result.text}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!selectedProperty || submitting}
                    style={{
                      width: "100%", padding: "11px 18px", border: "none", borderRadius: "6px",
                      fontSize: "14px", fontWeight: 700, cursor: !selectedProperty || submitting ? "not-allowed" : "pointer",
                      background: !selectedProperty || submitting ? "#d1d5db" : "#107c10",
                      color: "#fff", transition: "background 0.15s",
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit Match"}
                  </button>
                </>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

// ── Single demand card ────────────────────────────────────────────────────────
const DemandCard = ({ d }) => {
  const [expanded, setExpanded] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [matchStatus, setMatchStatus] = useState(null); // null | "loading" | "matched"
  const pc = purposeColor(d.tenant_option);
  const budget = budgetRange(d.minimum_budget, d.maximum_budget);
  const facs = Array.isArray(d.facilities) ? d.facilities : [];
  const facNames = facs.map(f => f?.name || f).filter(Boolean);
  const vehicles = typeof d.vehicles === "string" ? (() => { try { return JSON.parse(d.vehicles); } catch { return {}; } })() : (d.vehicles || {});
  const vehicleEntries = Object.entries(vehicles).filter(([, v]) => v > 0);

  const user = useSelector(state => state.user?.data);
  const navigate = useNavigate();

  const handleIHareClick = () => {
    if (!user) {
      navigate("/?login=1");
      return;
    }
    setShowSelector(true);
  };

  const handleMatchComplete = () => {
    setMatchStatus("matched");
  };

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

      {/* "I Have" button row */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
        {matchStatus === "matched" ? (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            padding: "7px 14px", borderRadius: "4px",
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            fontSize: "12px", fontWeight: 700, color: "#15803d",
          }}>
            Matched ✓
          </span>
        ) : (
          <button
            onClick={handleIHareClick}
            style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              padding: "7px 14px", borderRadius: "4px",
              background: "#107c10", border: "none",
              fontSize: "12px", fontWeight: 700, color: "#fff",
              cursor: "pointer", transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#0e6e0e"}
            onMouseLeave={e => e.currentTarget.style.background = "#107c10"}
          >
            <IoHomeOutline style={{ width: "13px", height: "13px" }} />
            I Have
          </button>
        )}
      </div>

      {/* Property Selector Modal */}
      <PropertySelectorModal
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        demandId={d.id}
        onMatchComplete={handleMatchComplete}
      />
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