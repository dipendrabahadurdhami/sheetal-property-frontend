// src/pages/PropertyTaxEstimator.jsx
// Nepal property tax estimator — House Tax, Rental Tax, Capital Gains Tax, Registration Fee
// Fully static — based on IRD Nepal and local municipality rules

import { useState, useMemo } from "react";
import ToolLayout from "../components/Common/Tools/ToolLayout";

const MUNICIPALITIES = [
  { label: "Kathmandu Metropolitan City",    houseTaxRate: 0.008, category: "Metro" },
  { label: "Lalitpur Metropolitan City",     houseTaxRate: 0.007, category: "Metro" },
  { label: "Bhaktapur Municipality",         houseTaxRate: 0.006, category: "Sub-Metro" },
  { label: "Pokhara Metropolitan City",      houseTaxRate: 0.006, category: "Metro" },
  { label: "Birgunj Metropolitan City",      houseTaxRate: 0.005, category: "Metro" },
  { label: "Bharatpur Metropolitan City",    houseTaxRate: 0.005, category: "Metro" },
  { label: "Other Sub-Metropolitan City",    houseTaxRate: 0.005, category: "Sub-Metro" },
  { label: "Municipality (Nagar Palika)",    houseTaxRate: 0.004, category: "Municipal" },
  { label: "Rural Municipality (Gaun Palika)", houseTaxRate: 0.002, category: "Rural" },
];

const PROPERTY_USE = [
  { key: "own",        label: "Owner-occupied (own residence)" },
  { key: "rented",     label: "Rented out to tenants" },
  { key: "commercial", label: "Commercial / Business use" },
  { key: "mixed",      label: "Mixed (partly rented, partly own)" },
];

function fmt(n) { return Math.round(n).toLocaleString("en-NP"); }
function fmtD(n) { return n.toFixed(2); }

function TaxRow({ label, amount, rate, note, highlight }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr auto",
      gap: "12px", padding: "14px 0",
      borderBottom: "1px solid rgba(17,24,39,0.06)",
      alignItems: "start",
    }}>
      <div>
        <div style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif", color: "var(--d)", fontWeight: highlight ? 600 : 400 }}>{label}</div>
        {note && <div style={{ fontSize: "11px", color: "var(--d)", opacity: 0.4, fontFamily: "'Inter', sans-serif", marginTop: "2px" }}>{note}</div>}
        {rate && <div style={{ fontSize: "11px", color: "var(--r)", fontFamily: "'Inter', sans-serif", marginTop: "2px" }}>Rate: {rate}</div>}
      </div>
      <div style={{
        fontFamily: "'Inter', serif", fontSize: "18px",
        fontWeight: 700, color: highlight ? "var(--r)" : "var(--d)",
        textAlign: "right", whiteSpace: "nowrap",
      }}>
        NPR {fmt(amount)}
      </div>
    </div>
  );
}

export default function PropertyTaxEstimator() {
  const [propValue,     setPropValue]     = useState("");
  const [govtValue,     setGovtValue]     = useState("");
  const [muniIdx,       setMuniIdx]       = useState(0);
  const [useKey,        setUseKey]        = useState("own");
  const [monthlyRent,   setMonthlyRent]   = useState("");
  const [holdingYears,  setHoldingYears]  = useState(5);
  const [isPrimary,     setIsPrimary]     = useState(true);
  const [calcType,      setCalcType]      = useState("annual"); // annual | transaction

  const muni     = MUNICIPALITIES[muniIdx];
  const propVal  = parseFloat(propValue.replace(/,/g, "")) || 0;
  const govtVal  = parseFloat(govtValue.replace(/,/g, "")) || propVal * 0.6; // govt is ~60% of market
  const rent     = parseFloat(monthlyRent) || 0;

  const result = useMemo(() => {
    if (propVal <= 0) return null;

    // ── ANNUAL TAXES ──

    // 1. House / Land Tax (Ghar Jagga Kar) — based on govt valuation
    const houseTax = govtVal * muni.houseTaxRate;

    // 2. Rental Income Tax (IRD Nepal)
    // Individual: 10% on gross rental income
    // If commercial: 15%
    const annualRent = rent * 12;
    let rentalTax = 0;
    if (useKey === "rented")     rentalTax = annualRent * 0.10;
    if (useKey === "commercial") rentalTax = annualRent * 0.15;
    if (useKey === "mixed")      rentalTax = annualRent * 0.10 * 0.5; // half rented

    // 3. Garbage / services (municipal average)
    const municipalFee = muni.category === "Metro" ? 3000 : muni.category === "Sub-Metro" ? 2000 : 1000;

    const totalAnnual = houseTax + rentalTax + municipalFee;

    // ── TRANSACTION / SALE TAXES ──

    // Registration fee (on govt value)
    // 4–5% in valley, 3% outside
    const regPct = muni.category === "Metro" ? 0.05 : muni.category === "Sub-Metro" ? 0.045 : 0.04;
    const registrationFee = govtVal * regPct;

    // Capital gains tax
    // Individual primary residence held 5+ yrs: exempt for first property
    // Others: 2.5% long-term (5+ yrs), 5% short-term (<5 yrs)
    const gain = propVal - (propVal * 0.75); // assume bought at 75% of current for demo — user should know their cost basis
    let cgtRate = 0;
    if (!isPrimary) {
      cgtRate = holdingYears >= 5 ? 0.025 : 0.05;
    } else {
      // Primary residence: exempt if first property
      cgtRate = 0;
    }
    const capitalGainsTax = Math.max(0, propVal - propVal * 0.75) * cgtRate;

    // Stamp duty (included in registration in Nepal, but separate charge in some cases)
    const stampDuty = govtVal * 0.005; // 0.5% additional stamp

    // Agent commission (1.5–2%)
    const commission = propVal * 0.015;

    const totalTransaction = registrationFee + stampDuty + commission + capitalGainsTax;

    return {
      houseTax, rentalTax, municipalFee, totalAnnual,
      registrationFee, stampDuty, commission, capitalGainsTax, totalTransaction,
      regPct, cgtRate,
    };
  }, [propVal, govtVal, muni, useKey, rent, holdingYears, isPrimary]);

  return (
    <ToolLayout
      title="Property Tax Estimator"
      subtitle="Estimate annual property taxes and transaction costs for Nepal real estate — including house tax, rental income tax, capital gains, and registration fees."
      icon="🧾"
      badge="Tax Tool"
    >
      {/* Tab switch */}
      <div style={{ display: "flex", gap: "0", marginBottom: "24px", border: "1px solid rgba(17,24,39,0.1)" }}>
        {[
          { key: "annual",      label: "📅 Annual Property Tax" },
          { key: "transaction", label: "🤝 Sale / Transaction Tax" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setCalcType(t.key)}
            style={{
              flex: 1, padding: "14px 20px",
              background: calcType === t.key ? "var(--d)" : "#fff",
              color: calcType === t.key ? "var(--l)" : "var(--d)",
              border: "none", fontFamily: "'Inter', sans-serif",
              fontSize: "13px", fontWeight: 500,
              cursor: "pointer", transition: "all 0.2s",
              opacity: calcType === t.key ? 1 : 0.6,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="tax-grid">

        {/* ── INPUTS ── */}
        <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "32px" }}>
          <div className="lbl" style={{ marginBottom: "24px" }}>
            <div className="lbl-line" />
            <span className="lbl-txt">Property Information</span>
          </div>

          <Fld label="Market Value of Property (NPR)">
            <input type="number" placeholder="e.g. 15000000" value={propValue} onChange={e => setPropValue(e.target.value)} />
            {propVal > 0 && <small style={{ color: "var(--r)", fontFamily: "'Inter', sans-serif", marginTop: "4px", display: "block" }}>NPR {fmt(propVal)}</small>}
          </Fld>

          <Fld label="Government Assessed Value (NPR)" note="Usually 50–70% of market value. Leave blank to auto-estimate.">
            <input type="number" placeholder={propVal > 0 ? `Auto: ~NPR ${fmt(propVal * 0.6)}` : "e.g. 9000000"} value={govtValue} onChange={e => setGovtValue(e.target.value)} />
          </Fld>

          <Fld label="Municipality">
            <select value={muniIdx} onChange={e => setMuniIdx(Number(e.target.value))}>
              {MUNICIPALITIES.map((m, i) => <option key={i} value={i}>{m.label} ({m.category})</option>)}
            </select>
          </Fld>

          <Fld label="Property Use">
            <select value={useKey} onChange={e => setUseKey(e.target.value)}>
              {PROPERTY_USE.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
          </Fld>

          {(useKey === "rented" || useKey === "commercial" || useKey === "mixed") && (
            <Fld label="Monthly Rental Income (NPR)">
              <input type="number" placeholder="e.g. 40000" value={monthlyRent} onChange={e => setMonthlyRent(e.target.value)} />
            </Fld>
          )}

          {calcType === "transaction" && (
            <>
              <Fld label={`Holding Period: ${holdingYears} years`}>
                <input type="range" min={1} max={30} value={holdingYears} onChange={e => setHoldingYears(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--r)", border: "none", boxShadow: "none", padding: 0 }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--d)", opacity: 0.35, fontFamily: "'Inter', sans-serif" }}>
                  <span>1 yr</span><span>Short-term</span><span>Long-term (5+)</span>
                </div>
              </Fld>

              <Fld label="Property Type">
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>
                  <input type="checkbox" checked={isPrimary} onChange={e => setIsPrimary(e.target.checked)} style={{ width: "auto", margin: 0 }} />
                  Primary Residence (first/only property — CGT may be exempt)
                </label>
              </Fld>
            </>
          )}
        </div>

        {/* ── RESULTS ── */}
        <div>
          {!result ? (
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "48px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧾</div>
              <p style={{ fontFamily: "'Inter', sans-serif", color: "var(--d)", opacity: 0.45, fontSize: "14px" }}>
                Enter property value to see tax estimates
              </p>
            </div>
          ) : calcType === "annual" ? (
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "32px" }}>
              <div className="lbl" style={{ marginBottom: "20px" }}>
                <div className="lbl-line" />
                <span className="lbl-txt">Annual Tax Breakdown</span>
              </div>

              <TaxRow
                label="House / Land Tax (Ghar Jagga Kar)"
                amount={result.houseTax}
                rate={`${(muni.houseTaxRate * 100).toFixed(1)}% of govt value`}
                note={`Based on ${muni.label}`}
              />
              {result.rentalTax > 0 && (
                <TaxRow
                  label="Rental Income Tax (IRD)"
                  amount={result.rentalTax}
                  rate={useKey === "commercial" ? "15% on gross rent" : "10% on gross rent"}
                  note={`Annual rent: NPR ${fmt(parseFloat(monthlyRent) * 12)}`}
                />
              )}
              <TaxRow
                label="Municipal Service Fee"
                amount={result.municipalFee}
                note="Garbage, drainage, local services (estimate)"
              />

              {/* Total */}
              <div style={{ background: "var(--d)", padding: "20px 24px", marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "rgba(249,250,251,0.7)", fontFamily: "'Inter', sans-serif" }}>
                  Total Annual Tax
                </div>
                <div style={{ fontFamily: "'Inter', serif", fontSize: "28px", fontWeight: 700, color: "var(--r)" }}>
                  NPR {fmt(result.totalAnnual)}
                </div>
              </div>

              <div style={{ marginTop: "16px", padding: "14px", background: "var(--r06)", borderLeft: "3px solid var(--r)" }}>
                <p style={{ fontSize: "11px", fontFamily: "'Inter', sans-serif", color: "var(--d)", opacity: 0.65, margin: 0, lineHeight: 1.6 }}>
                  Monthly equivalent: <strong>NPR {fmt(result.totalAnnual / 12)}/month</strong>. Taxes are assessed and collected by local municipality offices.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "32px" }}>
              <div className="lbl" style={{ marginBottom: "20px" }}>
                <div className="lbl-line" />
                <span className="lbl-txt">Sale / Transaction Cost Breakdown</span>
              </div>

              <TaxRow
                label="Registration Fee (Darta Dastoor)"
                amount={result.registrationFee}
                rate={`${(result.regPct * 100).toFixed(1)}% of govt value`}
                note="Paid at Land Revenue Office"
              />
              <TaxRow
                label="Stamp Duty"
                amount={result.stampDuty}
                rate="0.5% of govt value"
              />
              <TaxRow
                label="Agent / Broker Commission"
                amount={result.commission}
                rate="~1.5% of market value"
                note="Negotiable — typically 1–2%"
              />
              <TaxRow
                label="Capital Gains Tax (CGT)"
                amount={result.capitalGainsTax}
                rate={isPrimary ? "Exempt (primary residence)" : holdingYears >= 5 ? "2.5% long-term (5+ yrs)" : "5% short-term (<5 yrs)"}
                note={isPrimary ? "First property exemption may apply" : `Based on ${holdingYears} year holding`}
              />

              <div style={{ background: "var(--d)", padding: "20px 24px", marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "rgba(249,250,251,0.7)", fontFamily: "'Inter', sans-serif" }}>
                  Total Transaction Cost
                </div>
                <div style={{ fontFamily: "'Inter', serif", fontSize: "28px", fontWeight: 700, color: "var(--r)" }}>
                  NPR {fmt(result.totalTransaction)}
                </div>
              </div>
              <div style={{ textAlign: "right", marginTop: "6px", fontSize: "12px", color: "var(--d)", opacity: 0.4, fontFamily: "'Inter', sans-serif" }}>
                {fmtD((result.totalTransaction / propVal) * 100)}% of market value
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .tax-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </ToolLayout>
  );
}

function Fld({ label, children, note }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--d)", opacity: 0.5, marginBottom: "8px", fontFamily: "'Inter', sans-serif" }}>
        {label}
      </label>
      {note && <div style={{ fontSize: "11px", color: "var(--d)", opacity: 0.4, fontFamily: "'Inter', sans-serif", marginBottom: "6px" }}>{note}</div>}
      {children}
    </div>
  );
}