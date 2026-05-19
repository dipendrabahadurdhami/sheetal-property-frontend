// src/pages/ROICalculator.jsx
// Nepal Real Estate ROI Calculator
// Inputs: purchase price, resale, rental income, loan cost, maintenance, tax, holding period

import { useState, useMemo } from "react";
import ToolLayout from "../components/Common/Tools/ToolLayout";

const ZONES = [
  { label: "Kathmandu Core (Naxal, Lazimpat, Baluwatar)", appreciation: 10 },
  { label: "Kathmandu Mid (Koteshwor, Imadol, Bhaisepati)", appreciation: 8 },
  { label: "Lalitpur / Patan",                             appreciation: 8.5 },
  { label: "Bhaktapur",                                    appreciation: 6.5 },
  { label: "Pokhara",                                      appreciation: 7 },
  { label: "Butwal / Bharatpur",                           appreciation: 6 },
  { label: "Birgunj / Terai cities",                       appreciation: 5 },
  { label: "Outside valley (other)",                       appreciation: 4 },
  { label: "Custom appreciation rate",                     appreciation: null },
];

function fmt(n) { return Math.round(n).toLocaleString("en-NP"); }
function pct(n) { return n.toFixed(2); }

function ResultRow({ label, value, highlight, sub }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "13px 0",
      borderBottom: "1px solid rgba(17,24,39,0.06)",
    }}>
      <div>
        <div style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif", color: "var(--d)", opacity: 0.75 }}>{label}</div>
        {sub && <div style={{ fontSize: "11px", color: "var(--d)", opacity: 0.35, fontFamily: "'Inter', sans-serif" }}>{sub}</div>}
      </div>
      <div style={{
        fontFamily: "'Inter', serif",
        fontSize: "18px",
        fontWeight: 700,
        color: highlight === "red" ? "var(--r)" : highlight === "green" ? "#16a34a" : "var(--d)",
      }}>
        {value}
      </div>
    </div>
  );
}

export default function ROICalculator() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [zoneIdx,       setZoneIdx]       = useState(0);
  const [customApp,     setCustomApp]     = useState("");
  const [holdingYears,  setHoldingYears]  = useState(5);
  const [monthlyRent,   setMonthlyRent]   = useState("");
  const [loanAmount,    setLoanAmount]    = useState("");
  const [loanRate,      setLoanRate]      = useState(10.5);
  const [loanTenure,    setLoanTenure]    = useState(20);
  const [maintenancePY, setMaintenancePY] = useState("");
  const [taxPY,         setTaxPY]        = useState("");
  const [registrationPct, setRegistrationPct] = useState(5);

  const zone = ZONES[zoneIdx];
  const appRate = zone.appreciation !== null ? zone.appreciation : parseFloat(customApp) || 0;

  const calc = useMemo(() => {
    const P      = parseFloat(purchasePrice) || 0;
    const loan   = parseFloat(loanAmount) || 0;
    const rent   = parseFloat(monthlyRent) || 0;
    const maint  = parseFloat(maintenancePY) || 0;
    const tax    = parseFloat(taxPY) || 0;
    const yrs    = holdingYears;

    if (P <= 0) return null;

    // Registration / transaction cost
    const registrationCost = P * (registrationPct / 100);

    // Resale value via CAGR appreciation
    const resaleValue = P * Math.pow(1 + appRate / 100, yrs);

    // Total rental income
    const totalRentalIncome = rent * 12 * yrs;

    // Loan interest cost (simple total interest over tenure, prorated to holding period)
    let totalLoanInterest = 0;
    if (loan > 0) {
      const r = loanRate / 100 / 12;
      const n = loanTenure * 12;
      const emi = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const heldMonths = Math.min(yrs * 12, n);
      totalLoanInterest = emi * heldMonths - loan * (1 - Math.pow(1 + r, -heldMonths)); // total interest portion
      // simpler: total paid - principal paid
      let balance = loan;
      let interestPaid = 0;
      for (let i = 0; i < heldMonths; i++) {
        const interest = balance * r;
        interestPaid += interest;
        balance -= (emi - interest);
      }
      totalLoanInterest = interestPaid;
    }

    // Total maintenance cost
    const totalMaintenance = maint * yrs;
    const totalTax         = tax * yrs;

    // Capital gains tax (Nepal: 5% if held 5+ years individual, 10% if less)
    const capitalGain      = resaleValue - P;
    const cgtRate          = yrs >= 5 ? 0.025 : 0.05; // 2.5% long term, 5% short term
    const capitalGainsTax  = Math.max(0, capitalGain) * cgtRate;

    // TOTAL INVESTMENT (what you put in)
    const totalInvestment = P + registrationCost + totalLoanInterest + totalMaintenance + totalTax + capitalGainsTax;

    // TOTAL RETURNS
    const totalReturns = resaleValue + totalRentalIncome;

    // NET PROFIT
    const netProfit = totalReturns - totalInvestment;

    // ROI
    const roi = ((netProfit) / (P + registrationCost)) * 100;

    // CAGR
    const cagr = (Math.pow((P + registrationCost + netProfit) / (P + registrationCost), 1 / yrs) - 1) * 100;

    // Rental yield
    const rentalYield = P > 0 ? ((rent * 12) / P) * 100 : 0;

    return {
      resaleValue, totalRentalIncome, totalLoanInterest,
      totalMaintenance, totalTax, capitalGainsTax,
      registrationCost, totalInvestment, totalReturns,
      netProfit, roi, cagr, rentalYield,
    };
  }, [purchasePrice, zoneIdx, customApp, holdingYears, monthlyRent, loanAmount, loanRate, loanTenure, maintenancePY, taxPY, registrationPct]);

  return (
    <ToolLayout
      title="ROI Calculator"
      subtitle="Calculate your real estate return on investment based on Nepal market conditions — appreciation, rental yield, loan cost, and taxes."
      icon="📈"
      badge="Investment Tool"
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="roi-grid">

        {/* ── LEFT: INPUTS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Property Details */}
          <Section title="Property Details">
            <Field label="Purchase Price (NPR)" note={parseFloat(purchasePrice) > 0 ? `NPR ${fmt(parseFloat(purchasePrice))}` : null}>
              <input type="number" placeholder="e.g. 15000000" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} />
            </Field>

            <Field label="Location Zone">
              <select value={zoneIdx} onChange={e => setZoneIdx(Number(e.target.value))}>
                {ZONES.map((z, i) => (
                  <option key={i} value={i}>{z.label}{z.appreciation ? ` (~${z.appreciation}% p.a.)` : ""}</option>
                ))}
              </select>
            </Field>

            {zone.appreciation === null && (
              <Field label="Custom Appreciation Rate (% per year)">
                <input type="number" step="0.5" placeholder="e.g. 7.5" value={customApp} onChange={e => setCustomApp(e.target.value)} />
              </Field>
            )}

            <Field label={`Holding Period: ${holdingYears} years`}>
              <input type="range" min={1} max={30} value={holdingYears} onChange={e => setHoldingYears(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--r)", border: "none", boxShadow: "none", padding: 0 }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--d)", opacity: 0.4, fontFamily: "'Inter', sans-serif" }}>
                <span>1 yr</span><span>15 yrs</span><span>30 yrs</span>
              </div>
            </Field>

            <Field label="Registration / Transaction Cost (%)">
              <select value={registrationPct} onChange={e => setRegistrationPct(Number(e.target.value))}>
                <option value={4}>4% — Outside Kathmandu Valley</option>
                <option value={5}>5% — Kathmandu Valley (standard)</option>
                <option value={6}>6% — Commercial property</option>
              </select>
            </Field>
          </Section>

          {/* Rental Income */}
          <Section title="Rental Income (optional)">
            <Field label="Monthly Rental Income (NPR)" note="Leave blank if not renting out">
              <input type="number" placeholder="e.g. 30000" value={monthlyRent} onChange={e => setMonthlyRent(e.target.value)} />
            </Field>
          </Section>

          {/* Loan Details */}
          <Section title="Loan / Mortgage (optional)">
            <Field label="Loan Amount (NPR)">
              <input type="number" placeholder="e.g. 8000000" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
            </Field>
            {parseFloat(loanAmount) > 0 && (
              <>
                <Field label="Interest Rate (% p.a.)">
                  <input type="number" step="0.25" min={1} max={30} value={loanRate} onChange={e => setLoanRate(parseFloat(e.target.value))} />
                </Field>
                <Field label={`Loan Tenure: ${loanTenure} years`}>
                  <input type="range" min={1} max={30} value={loanTenure} onChange={e => setLoanTenure(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--r)", border: "none", boxShadow: "none", padding: 0 }} />
                </Field>
              </>
            )}
          </Section>

          {/* Costs */}
          <Section title="Annual Costs (optional)">
            <Field label="Annual Maintenance Cost (NPR)">
              <input type="number" placeholder="e.g. 50000" value={maintenancePY} onChange={e => setMaintenancePY(e.target.value)} />
            </Field>
            <Field label="Annual Tax / Charges (NPR)">
              <input type="number" placeholder="e.g. 20000" value={taxPY} onChange={e => setTaxPY(e.target.value)} />
            </Field>
          </Section>
        </div>

        {/* ── RIGHT: RESULTS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {!calc ? (
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "48px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
              <p style={{ fontFamily: "'Inter', sans-serif", color: "var(--d)", opacity: 0.45, fontSize: "14px" }}>
                Enter a purchase price to see your ROI analysis
              </p>
            </div>
          ) : (
            <>
              {/* Hero metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <HeroStat label="Total ROI" value={`${pct(calc.roi)}%`} color={calc.roi >= 0 ? "var(--r)" : "#dc2626"} sub={`over ${holdingYears} yrs`} />
                <HeroStat label="CAGR" value={`${pct(calc.cagr)}%`} color="var(--d)" sub="annualized" />
                <HeroStat label="Net Profit" value={`NPR ${fmt(calc.netProfit)}`} color={calc.netProfit >= 0 ? "#16a34a" : "#dc2626"} sub="after all costs" />
                <HeroStat label="Rental Yield" value={parseFloat(monthlyRent) > 0 ? `${pct(calc.rentalYield)}%` : "—"} color="var(--d)" sub="annual gross" />
              </div>

              {/* Breakdown */}
              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "28px" }}>
                <div className="lbl" style={{ marginBottom: "16px" }}>
                  <div className="lbl-line" />
                  <span className="lbl-txt">Returns Breakdown</span>
                </div>
                <ResultRow label="Estimated Resale Value" value={`NPR ${fmt(calc.resaleValue)}`} highlight="green" sub={`${appRate}% p.a. appreciation × ${holdingYears} yrs`} />
                <ResultRow label="Total Rental Income" value={`NPR ${fmt(calc.totalRentalIncome)}`} highlight="green" sub={`${holdingYears} years of rental`} />
                <ResultRow label="Total Returns" value={`NPR ${fmt(calc.totalReturns)}`} highlight="red" />
              </div>

              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "28px" }}>
                <div className="lbl" style={{ marginBottom: "16px" }}>
                  <div className="lbl-line" />
                  <span className="lbl-txt">Cost Breakdown</span>
                </div>
                <ResultRow label="Purchase Price" value={`NPR ${fmt(parseFloat(purchasePrice))}`} />
                <ResultRow label="Registration / Transaction" value={`NPR ${fmt(calc.registrationCost)}`} sub={`${registrationPct}% of purchase`} />
                {calc.totalLoanInterest > 0 && <ResultRow label="Total Loan Interest Paid" value={`NPR ${fmt(calc.totalLoanInterest)}`} highlight="red" />}
                {calc.totalMaintenance > 0 && <ResultRow label="Total Maintenance" value={`NPR ${fmt(calc.totalMaintenance)}`} />}
                {calc.totalTax > 0 && <ResultRow label="Total Tax / Charges" value={`NPR ${fmt(calc.totalTax)}`} />}
                <ResultRow label="Capital Gains Tax" value={`NPR ${fmt(calc.capitalGainsTax)}`} sub={holdingYears >= 5 ? "2.5% long-term rate" : "5% short-term rate"} />
                <ResultRow label="Total Investment" value={`NPR ${fmt(calc.totalInvestment)}`} highlight="red" />
              </div>

              {/* Verdict */}
              <div style={{ background: calc.roi >= 8 ? "var(--d)" : calc.roi >= 4 ? "#92400e" : "#7f1d1d", padding: "24px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(249,250,251,0.5)", fontFamily: "'Inter', sans-serif", marginBottom: "8px" }}>
                  Investment Verdict
                </div>
                <div style={{ fontFamily: "'Inter', serif", fontSize: "22px", fontWeight: 700, color: "var(--l)" }}>
                  {calc.roi >= 10 ? "🔥 Excellent — Strong Nepal market returns" :
                   calc.roi >= 7  ? "✅ Good — Above average for Nepal real estate" :
                   calc.roi >= 4  ? "⚠️  Moderate — Typical Kathmandu valley return" :
                                    "❌ Low — Consider renegotiating or different zone"}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(249,250,251,0.45)", fontFamily: "'Inter', sans-serif", marginTop: "6px" }}>
                  Nepal real estate average: 6–10% CAGR in valley areas
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .roi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </ToolLayout>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "28px" }}>
      <div className="lbl" style={{ marginBottom: "20px" }}>
        <div className="lbl-line" />
        <span className="lbl-txt">{title}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>{children}</div>
    </div>
  );
}

function Field({ label, children, note }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--d)", opacity: 0.5, marginBottom: "8px", fontFamily: "'Inter', sans-serif" }}>
        {label}
      </label>
      {children}
      {note && <small style={{ display: "block", marginTop: "4px", color: "var(--r)", fontFamily: "'Inter', sans-serif" }}>{note}</small>}
    </div>
  );
}

function HeroStat({ label, value, color, sub }) {
  return (
    <div className="sb" style={{ textAlign: "center", padding: "20px 16px" }}>
      <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--d)", opacity: 0.4, fontFamily: "'Inter', sans-serif", marginBottom: "8px" }}>{label}</div>
      <div style={{ fontFamily: "'Inter', serif", fontSize: "clamp(18px, 2vw, 26px)", fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: "10px", color: "var(--d)", opacity: 0.35, fontFamily: "'Inter', sans-serif", marginTop: "4px" }}>{sub}</div>}
    </div>
  );
}