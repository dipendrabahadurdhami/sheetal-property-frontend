// src/pages/UnitConverter.jsx
// FULLY STATIC — no API, no install needed
// Converts between Nepal hill units, Terai units, and metric/imperial

import { useState } from "react";
import ToolLayout from "../components/Common/Tools/ToolLayout";

// ── Conversion factors (all relative to sq meters) ──
const UNITS = [
  { key: "sqm",     label: "Square Meter",   labelNp: "वर्ग मिटर",  toSqM: 1 },
  { key: "sqft",    label: "Square Feet",    labelNp: "वर्ग फिट",   toSqM: 0.092903 },
  { key: "ropani",  label: "Ropani",         labelNp: "रोपनी",      toSqM: 508.72 },
  { key: "aana",    label: "Aana",           labelNp: "आना",        toSqM: 31.795 },
  { key: "paisa",   label: "Paisa",          labelNp: "पैसा",       toSqM: 7.9488 },
  { key: "daam",    label: "Daam",           labelNp: "दाम",        toSqM: 1.9872 },
  { key: "bigha",   label: "Bigha",          labelNp: "बिघा",       toSqM: 6772.63 },
  { key: "kattha",  label: "Kattha",         labelNp: "कठ्ठा",      toSqM: 338.63 },
  { key: "dhur",    label: "Dhur",           labelNp: "धुर",        toSqM: 16.93 },
  { key: "acre",    label: "Acre",           labelNp: "एकड",        toSqM: 4046.86 },
];

// ── Quick reference table data ──
const REFERENCE = [
  { label: "1 Ropani",  equals: "16 Aana = 64 Paisa = 256 Daam = 508.72 sq m = 5,476 sq ft" },
  { label: "1 Aana",    equals: "4 Paisa = 16 Daam = 31.80 sq m = 342.25 sq ft" },
  { label: "1 Paisa",   equals: "4 Daam = 7.95 sq m = 85.56 sq ft" },
  { label: "1 Bigha",   equals: "20 Kattha = 400 Dhur = 6,772.63 sq m = 1.67 acres" },
  { label: "1 Kattha",  equals: "20 Dhur = 338.63 sq m = 3,645 sq ft" },
  { label: "1 Dhur",    equals: "16.93 sq m = 182.25 sq ft" },
  { label: "1 Acre",    equals: "4,046.86 sq m = 43,560 sq ft ≈ 7.95 Ropani" },
];

function fmt(n) {
  if (n === "" || isNaN(n)) return "";
  if (n >= 1000) return Number(n.toFixed(4)).toLocaleString();
  return Number(n.toPrecision(6)).toString();
}

export default function UnitConverter() {
  const [fromUnit, setFromUnit] = useState("ropani");
  const [toUnit,   setToUnit]   = useState("sqft");
  const [value,    setValue]    = useState("");

  const fromDef = UNITS.find((u) => u.key === fromUnit);
  const toDef   = UNITS.find((u) => u.key === toUnit);

  const sqm    = parseFloat(value) * fromDef.toSqM;
  const result = sqm / toDef.toSqM;

  // swap units
  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <ToolLayout
      title="Unit Converter"
      subtitle="Convert between Nepal land measurement units — Ropani, Aana, Bigha, Kattha and more — instantly."
      icon="📐"
      badge="Property Tool"
    >
      {/* ── CONVERTER CARD ── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(17,24,39,0.08)",
          padding: "40px",
          marginBottom: "32px",
        }}
      >
        <div className="lbl" style={{ marginBottom: "28px" }}>
          <div className="lbl-line" />
          <span className="lbl-txt">Convert</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "16px",
            alignItems: "end",
            marginBottom: "32px",
          }}
          className="converter-grid"
        >
          {/* FROM */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--d)", opacity: 0.5, marginBottom: "8px", fontFamily: "'Inter', sans-serif" }}>
              From
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              style={{ marginBottom: "10px" }}
            >
              {UNITS.map((u) => (
                <option key={u.key} value={u.key}>
                  {u.label} ({u.labelNp})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              placeholder="Enter value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          {/* SWAP BUTTON */}
          <button
            onClick={handleSwap}
            className="btn-g"
            style={{
              padding: "10px 16px",
              fontSize: "18px",
              marginBottom: "0px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Swap units"
          >
            ⇄
          </button>

          {/* TO */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--d)", opacity: 0.5, marginBottom: "8px", fontFamily: "'Inter', sans-serif" }}>
              To
            </label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              style={{ marginBottom: "10px" }}
            >
              {UNITS.map((u) => (
                <option key={u.key} value={u.key}>
                  {u.label} ({u.labelNp})
                </option>
              ))}
            </select>

            {/* RESULT */}
            <div
              style={{
                height: "44px",
                background: "var(--r06)",
                border: "1px solid var(--r28)",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                fontFamily: "'Inter', serif",
                fontSize: "20px",
                fontWeight: 700,
                color: value && !isNaN(result) ? "var(--r)" : "rgba(17,24,39,0.25)",
              }}
            >
              {value && !isNaN(result) ? fmt(result) : "—"}
            </div>
          </div>
        </div>

        {/* RESULT STATEMENT */}
        {value && !isNaN(result) && parseFloat(value) > 0 && (
          <div
            style={{
              background: "var(--d)",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontFamily: "'Inter', serif", fontSize: "22px", fontWeight: 700, color: "var(--l)" }}>
              {parseFloat(value).toLocaleString()} {fromDef.label}
            </span>
            <span style={{ color: "var(--r)", fontSize: "18px" }}>=</span>
            <span style={{ fontFamily: "'Inter', serif", fontSize: "22px", fontWeight: 700, color: "var(--r)" }}>
              {fmt(result)} {toDef.label}
            </span>
            <span style={{ fontSize: "12px", color: "rgba(249,250,251,0.4)", fontFamily: "'Inter', sans-serif", marginLeft: "auto" }}>
              via {fmt(sqm)} sq m
            </span>
          </div>
        )}
      </div>

      {/* ── ALL CONVERSIONS TABLE ── */}
      {value && !isNaN(sqm) && parseFloat(value) > 0 && (
        <div
          style={{
            background: "#fff",
            border: "1px solid rgba(17,24,39,0.08)",
            padding: "32px 40px",
            marginBottom: "32px",
          }}
        >
          <div className="lbl" style={{ marginBottom: "20px" }}>
            <div className="lbl-line" />
            <span className="lbl-txt">All Equivalents for {parseFloat(value).toLocaleString()} {fromDef.label}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
            {UNITS.filter((u) => u.key !== fromUnit).map((u) => {
              const val = sqm / u.toSqM;
              return (
                <div
                  key={u.key}
                  className="svc"
                  style={{ padding: "16px 18px", cursor: "default" }}
                >
                  <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--d)", opacity: 0.45, fontFamily: "'Inter', sans-serif", marginBottom: "6px" }}>
                    {u.label}
                  </div>
                  <div style={{ fontFamily: "'Inter', serif", fontSize: "20px", fontWeight: 700, color: "var(--d)" }}>
                    {fmt(val)}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--d)", opacity: 0.35, fontFamily: "'Inter', sans-serif" }}>
                    {u.labelNp}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── QUICK REFERENCE ── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(17,24,39,0.08)",
          padding: "32px 40px",
        }}
      >
        <div className="lbl" style={{ marginBottom: "20px" }}>
          <div className="lbl-line" />
          <span className="lbl-txt">Quick Reference</span>
        </div>
        <div style={{ display: "grid", gap: "0" }}>
          {REFERENCE.map((r, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "160px 1fr",
                gap: "16px",
                padding: "14px 0",
                borderBottom: i < REFERENCE.length - 1 ? "1px solid rgba(17,24,39,0.06)" : "none",
                alignItems: "center",
              }}
            >
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--r)" }}>
                {r.label}
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "var(--d)", opacity: 0.7 }}>
                {r.equals}
              </span>
            </div>
          ))}
        </div>

        {/* Hill vs Terai note */}
        <div style={{ marginTop: "24px", padding: "16px 20px", background: "var(--r06)", borderLeft: "3px solid var(--r)" }}>
          <p style={{ fontSize: "12px", fontFamily: "'Inter', sans-serif", color: "var(--d)", opacity: 0.7, margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: "var(--r)" }}>Hill Region</strong> (Kathmandu Valley & hilly areas) uses <strong>Ropani → Aana → Paisa → Daam</strong>.
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <strong style={{ color: "var(--r)" }}>Terai Region</strong> (Madhesh, lowlands) uses <strong>Bigha → Kattha → Dhur</strong>.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .converter-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </ToolLayout>
  );
}