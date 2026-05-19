// src/pages/LandPriceEstimator.jsx
// Estimates land price based on Nepal location zones and land type
// Fully static — hardcoded Nepal real estate benchmarks

import { useState } from "react";
import ToolLayout from "../components/Common/Tools/ToolLayout";

const ZONES = [
  {
    region: "Kathmandu Valley",
    areas: [
      { label: "Naxal / Lazimpat / Baluwatar",   minAana: 3000000, maxAana: 12000000, type: "Hill (Aana)" },
      { label: "Maharajgunj / Bansbari",          minAana: 2000000, maxAana: 6000000,  type: "Hill (Aana)" },
      { label: "Koteshwor / Tinkune",             minAana: 1200000, maxAana: 3500000,  type: "Hill (Aana)" },
      { label: "Imadol / Bhaisepati / Thasikhel", minAana: 800000,  maxAana: 2500000,  type: "Hill (Aana)" },
      { label: "Budhanilkantha / Tokha",          minAana: 600000,  maxAana: 1800000,  type: "Hill (Aana)" },
      { label: "Godawari / Lubhu",               minAana: 400000,  maxAana: 1200000,  type: "Hill (Aana)" },
    ],
  },
  {
    region: "Lalitpur / Patan",
    areas: [
      { label: "Patan Core / Mangalbazar",       minAana: 1500000, maxAana: 5000000,  type: "Hill (Aana)" },
      { label: "Ekantakuna / Sanepa",            minAana: 1000000, maxAana: 3000000,  type: "Hill (Aana)" },
      { label: "Tikathali / Harisiddhi",         minAana: 500000,  maxAana: 1500000,  type: "Hill (Aana)" },
    ],
  },
  {
    region: "Bhaktapur",
    areas: [
      { label: "Bhaktapur Core",                 minAana: 600000,  maxAana: 2000000,  type: "Hill (Aana)" },
      { label: "Suryabinayak / Balkot",          minAana: 400000,  maxAana: 1000000,  type: "Hill (Aana)" },
    ],
  },
  {
    region: "Pokhara",
    areas: [
      { label: "Lakeside / Birauta",             minAana: 800000,  maxAana: 3000000,  type: "Hill (Aana)" },
      { label: "Pokhara Urban Outskirts",        minAana: 400000,  maxAana: 1200000,  type: "Hill (Aana)" },
    ],
  },
  {
    region: "Terai Cities",
    areas: [
      { label: "Birgunj City Core",              minKattha: 800000,  maxKattha: 3000000,  type: "Terai (Kattha)" },
      { label: "Butwal / Siddharthanagar",       minKattha: 600000,  maxKattha: 2000000,  type: "Terai (Kattha)" },
      { label: "Bharatpur / Chitwan",            minKattha: 500000,  maxKattha: 1800000,  type: "Terai (Kattha)" },
      { label: "Dhangadhi / Nepalgunj",          minKattha: 300000,  maxKattha: 1000000,  type: "Terai (Kattha)" },
      { label: "Terai Agricultural Land",        minKattha: 100000,  maxKattha: 400000,   type: "Terai (Kattha)" },
    ],
  },
];

// Nepal unit conversions (all to sq meters)
const AREA_UNITS = [
  { key: "aana",   label: "Aana",   toSqM: 31.795  },
  { key: "ropani", label: "Ropani", toSqM: 508.72  },
  { key: "kattha", label: "Kattha", toSqM: 338.63  },
  { key: "sqft",   label: "Sq Ft",  toSqM: 0.0929  },
];

const LAND_TYPES = [
  { key: "residential", label: "Residential", multiplier: 1.0 },
  { key: "commercial",  label: "Commercial",   multiplier: 1.35 },
  { key: "mixed",       label: "Mixed Use",    multiplier: 1.15 },
  { key: "agricultural",label: "Agricultural", multiplier: 0.45 },
];

function fmt(n) { return Math.round(n).toLocaleString("en-NP"); }

export default function LandPriceEstimator() {
  const [regionIdx,   setRegionIdx]   = useState(0);
  const [areaIdx,     setAreaIdx]     = useState(0);
  const [landTypeKey, setLandTypeKey] = useState("residential");
  const [areaValue,   setAreaValue]   = useState("");
  const [areaUnit,    setAreaUnit]    = useState("aana");

  const region   = ZONES[regionIdx];
  const area     = region.areas[areaIdx];
  const landType = LAND_TYPES.find(l => l.key === landTypeKey);
  const unitDef  = AREA_UNITS.find(u => u.key === areaUnit);

  // Price per Aana/Kattha from selected area
  const isTerai = area.type.includes("Terai");
  const baseMin = isTerai ? area.minKattha : area.minAana;
  const baseMax = isTerai ? area.maxKattha : area.maxAana;
  const baseUnit = isTerai ? "Kattha" : "Aana";
  const baseSqM  = isTerai ? 338.63 : 31.795; // sq m per unit

  const adjMin = baseMin * landType.multiplier;
  const adjMax = baseMax * landType.multiplier;

  // Per sq meter
  const minPerSqM = adjMin / baseSqM;
  const maxPerSqM = adjMax / baseSqM;

  // If area entered — total estimate
  const inputSqM = parseFloat(areaValue) * unitDef.toSqM || 0;
  const totalMin = minPerSqM * inputSqM;
  const totalMax = maxPerSqM * inputSqM;

  // In base Nepal unit
  const inputInBase = inputSqM / baseSqM;

  return (
    <ToolLayout
      title="Land Price Estimator"
      subtitle="Get an indicative land price range based on Nepal location benchmarks. Based on current market data for major cities and regions."
      icon="🗺️"
      badge="Valuation Tool"
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="land-grid">

        {/* ── INPUTS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "32px" }}>
            <div className="lbl" style={{ marginBottom: "24px" }}>
              <div className="lbl-line" />
              <span className="lbl-txt">Location & Land Details</span>
            </div>

            {/* Region */}
            <div style={{ marginBottom: "18px" }}>
              <label style={lbl}>Region</label>
              <select value={regionIdx} onChange={e => { setRegionIdx(Number(e.target.value)); setAreaIdx(0); }}>
                {ZONES.map((z, i) => <option key={i} value={i}>{z.region}</option>)}
              </select>
            </div>

            {/* Area */}
            <div style={{ marginBottom: "18px" }}>
              <label style={lbl}>Specific Area / VDC</label>
              <select value={areaIdx} onChange={e => setAreaIdx(Number(e.target.value))}>
                {region.areas.map((a, i) => <option key={i} value={i}>{a.label}</option>)}
              </select>
            </div>

            {/* Land type */}
            <div style={{ marginBottom: "18px" }}>
              <label style={lbl}>Land Use Type</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "4px" }}>
                {LAND_TYPES.map(lt => (
                  <button
                    key={lt.key}
                    onClick={() => setLandTypeKey(lt.key)}
                    style={{
                      padding: "10px 12px",
                      border: landTypeKey === lt.key ? "1.5px solid var(--r)" : "1px solid rgba(17,24,39,0.12)",
                      background: landTypeKey === lt.key ? "var(--r06)" : "#fff",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "12px",
                      fontWeight: landTypeKey === lt.key ? 600 : 400,
                      color: landTypeKey === lt.key ? "var(--r)" : "var(--d)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textAlign: "left",
                    }}
                  >
                    {lt.label}
                    <span style={{ display: "block", fontSize: "10px", opacity: 0.55, marginTop: "2px" }}>
                      {lt.multiplier > 1 ? `+${Math.round((lt.multiplier-1)*100)}%` : lt.multiplier < 1 ? `-${Math.round((1-lt.multiplier)*100)}%` : "base rate"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Area size */}
            <div style={{ marginBottom: "0" }}>
              <label style={lbl}>Land Area (optional — for total estimate)</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px" }}>
                <input type="number" min="0" step="0.1" placeholder="e.g. 4" value={areaValue} onChange={e => setAreaValue(e.target.value)} />
                <select value={areaUnit} onChange={e => setAreaUnit(e.target.value)} style={{ width: "100px" }}>
                  {AREA_UNITS.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div style={{ padding: "20px 24px", background: "var(--r06)", borderLeft: "3px solid var(--r)" }}>
            <p style={{ fontSize: "12px", fontFamily: "'Inter', sans-serif", color: "var(--d)", opacity: 0.7, margin: 0, lineHeight: 1.7 }}>
              <strong>How to use:</strong> Select your location and land type to get a price range per {baseUnit}.
              Enter your land area to see total estimated value. All prices are in <strong>Nepali Rupees (NPR)</strong>.
            </p>
          </div>
        </div>

        {/* ── RESULTS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Price per unit */}
          <div style={{ background: "var(--d)", padding: "32px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(249,250,251,0.4)", fontFamily: "'Inter', sans-serif", marginBottom: "16px" }}>
              Estimated Price per {baseUnit} — {landType.label}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: "11px", color: "rgba(249,250,251,0.35)", fontFamily: "'Inter', sans-serif" }}>From</div>
                <div style={{ fontFamily: "'Inter', serif", fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700, color: "var(--l)" }}>
                  NPR {fmt(adjMin)}
                </div>
              </div>
              <div style={{ color: "var(--r)", fontSize: "24px", fontWeight: 300 }}>—</div>
              <div>
                <div style={{ fontSize: "11px", color: "rgba(249,250,251,0.35)", fontFamily: "'Inter', sans-serif" }}>To</div>
                <div style={{ fontFamily: "'Inter', serif", fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700, color: "var(--r)" }}>
                  NPR {fmt(adjMax)}
                </div>
              </div>
            </div>
            <div style={{ marginTop: "12px", fontSize: "12px", color: "rgba(249,250,251,0.3)", fontFamily: "'Inter', sans-serif" }}>
              NPR {fmt(minPerSqM)} – {fmt(maxPerSqM)} per sq meter
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="sb">
              <div style={statLbl}>Location</div>
              <div style={statVal}>{area.label}</div>
            </div>
            <div className="sb">
              <div style={statLbl}>Land Type</div>
              <div style={statVal}>{landType.label}</div>
            </div>
            <div className="sb">
              <div style={statLbl}>Price System</div>
              <div style={statVal}>{area.type}</div>
            </div>
            <div className="sb">
              <div style={statLbl}>Type Premium</div>
              <div style={{ ...statVal, color: "var(--r)" }}>
                {landType.multiplier > 1 ? `+${Math.round((landType.multiplier-1)*100)}%` : landType.multiplier < 1 ? `-${Math.round((1-landType.multiplier)*100)}%` : "—"}
              </div>
            </div>
          </div>

          {/* Total if area entered */}
          {inputSqM > 0 && (
            <div style={{ background: "#fff", border: "2px solid var(--r)", padding: "28px" }}>
              <div className="lbl" style={{ marginBottom: "16px" }}>
                <div className="lbl-line" />
                <span className="lbl-txt">Total Estimated Value</span>
              </div>
              <div style={{ marginBottom: "8px", fontSize: "13px", fontFamily: "'Inter', sans-serif", color: "var(--d)", opacity: 0.55 }}>
                For {parseFloat(areaValue)} {unitDef.label} ({inputInBase.toFixed(2)} {baseUnit} / {Math.round(inputSqM).toLocaleString()} sq m)
              </div>
              <div style={{ fontFamily: "'Inter', serif", fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, color: "var(--r)" }}>
                NPR {fmt(totalMin)} – {fmt(totalMax)}
              </div>
              <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--d)", opacity: 0.4, fontFamily: "'Inter', sans-serif" }}>
                Midpoint estimate: NPR {fmt((totalMin + totalMax) / 2)}
              </div>
            </div>
          )}

          {/* Disclaimer for this tool */}
          <div style={{ padding: "16px 20px", background: "rgba(17,24,39,0.03)", border: "1px solid rgba(17,24,39,0.06)" }}>
            <p style={{ fontSize: "11px", fontFamily: "'Inter', sans-serif", color: "var(--d)", opacity: 0.5, margin: 0, lineHeight: 1.6 }}>
              Prices are based on general Nepal market benchmarks and may vary significantly based on road access, floor area ratio, shape of land, and current market conditions. Government valuation (मूल्यांकन) may differ from market rate.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .land-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </ToolLayout>
  );
}

const lbl = {
  display: "block", fontSize: "11px", fontWeight: 600,
  letterSpacing: "0.1em", textTransform: "uppercase",
  color: "var(--d)", opacity: 0.5, marginBottom: "8px",
  fontFamily: "'Inter', sans-serif",
};
const statLbl = {
  fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em",
  textTransform: "uppercase", color: "var(--d)", opacity: 0.4,
  fontFamily: "'Inter', sans-serif", marginBottom: "6px",
};
const statVal = {
  fontFamily: "'Inter', sans-serif", fontSize: "13px",
  fontWeight: 600, color: "var(--d)",
};