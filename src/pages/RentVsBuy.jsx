// src/pages/RentVsBuy.jsx
// Rent vs Buy Analyzer — Nepal real estate context
// Compares total cost of renting vs buying over a holding period

import { useState, useMemo } from "react";
import ToolLayout from "../components/Common/Tools/ToolLayout";

function fmt(n) { return Math.round(Math.abs(n)).toLocaleString("en-NP"); }
function pct(n) { return Number(n).toFixed(1); }

export default function RentVsBuy() {
  // Renting inputs
  const [monthlyRent,     setMonthlyRent]     = useState("");
  const [rentIncrease,    setRentIncrease]     = useState(5);    // % per year Nepal avg

  // Buying inputs
  const [purchasePrice,   setPurchasePrice]   = useState("");
  const [downPaymentPct,  setDownPaymentPct]  = useState(20);
  const [interestRate,    setInterestRate]    = useState(10.5);
  const [loanTenure,      setLoanTenure]      = useState(20);
  const [appreciation,    setAppreciation]    = useState(8);     // Nepal avg
  const [maintenancePct,  setMaintenancePct]  = useState(1);     // % of value per year
  const [registrationPct, setRegistrationPct] = useState(5);

  // Shared
  const [holdingYears,    setHoldingYears]    = useState(10);
  const [investReturn,    setInvestReturn]    = useState(8);     // opportunity cost rate

  const calc = useMemo(() => {
    const rent  = parseFloat(monthlyRent)   || 0;
    const price = parseFloat(purchasePrice) || 0;
    if (rent <= 0 || price <= 0) return null;

    const downPayment   = price * (downPaymentPct / 100);
    const loanAmount    = price - downPayment;
    const regCost       = price * (registrationPct / 100);
    const totalUpfront  = downPayment + regCost;

    // ── RENTING COST ──
    // Rent grows each year
    let totalRentCost = 0;
    let currentRent = rent * 12;
    for (let y = 0; y < holdingYears; y++) {
      totalRentCost += currentRent;
      currentRent *= (1 + rentIncrease / 100);
    }
    // Opportunity cost: the down payment money could have been invested
    const opportunityCost = totalUpfront * (Math.pow(1 + investReturn / 100, holdingYears) - 1);
    const totalRentScenario = totalRentCost + opportunityCost;

    // ── BUYING COST ──
    const r = interestRate / 100 / 12;
    const n = loanTenure * 12;
    const emi = loanAmount > 0
      ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : 0;

    const heldMonths = Math.min(holdingYears * 12, n);
    let interestPaid = 0;
    let balance = loanAmount;
    for (let i = 0; i < heldMonths; i++) {
      const interest = balance * r;
      interestPaid += interest;
      balance -= (emi - interest);
    }
    const principalPaid = loanAmount - Math.max(0, balance);

    // Annual maintenance cost (% of value)
    const totalMaintenance = price * (maintenancePct / 100) * holdingYears;

    // Resale value
    const resaleValue = price * Math.pow(1 + appreciation / 100, holdingYears);
    const capitalGain = resaleValue - price;
    const cgt = capitalGain > 0 ? capitalGain * (holdingYears >= 5 ? 0.025 : 0.05) : 0;
    const netResale = resaleValue - Math.max(0, balance) - cgt;

    // Total buying cost = upfront + interest + maintenance - equity gained
    const totalBuyingScenario = totalUpfront + interestPaid + totalMaintenance - netResale + price;
    // Net buying cost (what you actually "lose" vs renting)
    const netBuyingCost = totalUpfront + interestPaid + totalMaintenance + cgt - (resaleValue - price);

    const diff = totalRentScenario - netBuyingCost;
    const buyWins = diff > 0;

    // Break-even year (simplified: when equity + appreciation > rent paid)
    let breakEvenYear = null;
    let rentSoFar = 0;
    let currentRentBE = rent * 12;
    for (let y = 1; y <= 30; y++) {
      rentSoFar += currentRentBE;
      currentRentBE *= (1 + rentIncrease / 100);
      const propValue = price * Math.pow(1 + appreciation / 100, y);
      const loanBal   = loanAmount * Math.pow(1 + r, y * 12) - emi * (Math.pow(1 + r, y * 12) - 1) / r;
      const equity    = Math.max(0, propValue - Math.max(0, loanBal));
      const buyCostSoFar = totalUpfront + (emi * 12 * y - (loanAmount - Math.max(0, loanBal))) + price * (maintenancePct / 100) * y;
      if (equity > rentSoFar && breakEvenYear === null) {
        breakEvenYear = y;
      }
    }

    return {
      totalRentScenario, netBuyingCost, diff, buyWins,
      totalRentCost, opportunityCost,
      downPayment, regCost, totalUpfront,
      interestPaid, totalMaintenance,
      resaleValue, capitalGain, cgt, netResale,
      emi, breakEvenYear,
    };
  }, [monthlyRent, rentIncrease, purchasePrice, downPaymentPct, interestRate, loanTenure, appreciation, maintenancePct, registrationPct, holdingYears, investReturn]);

  return (
    <ToolLayout
      title="Rent vs Buy Analyzer"
      subtitle="Should you rent or buy in Nepal? Compare the true cost of renting vs buying over time, factoring in appreciation, loan interest, and opportunity cost."
      icon="⚖️"
      badge="Decision Tool"
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="rvb-grid">

        {/* ── INPUTS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Renting */}
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "28px" }}>
            <div className="lbl" style={{ marginBottom: "20px" }}>
              <div className="lbl-line" />
              <span className="lbl-txt">If You Rent</span>
            </div>
            <FI label="Monthly Rent (NPR)">
              <input type="number" placeholder="e.g. 30000" value={monthlyRent} onChange={e => setMonthlyRent(e.target.value)} />
            </FI>
            <FI label={`Annual Rent Increase: ${rentIncrease}%`} note="Nepal average ~5–8% per year">
              <input type="range" min={0} max={15} step={0.5} value={rentIncrease} onChange={e => setRentIncrease(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--r)", border: "none", boxShadow: "none", padding: 0 }} />
            </FI>
          </div>

          {/* Buying */}
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "28px" }}>
            <div className="lbl" style={{ marginBottom: "20px" }}>
              <div className="lbl-line" />
              <span className="lbl-txt">If You Buy</span>
            </div>
            <FI label="Property Purchase Price (NPR)">
              <input type="number" placeholder="e.g. 15000000" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} />
            </FI>
            <FI label={`Down Payment: ${downPaymentPct}%`} note={purchasePrice ? `NPR ${fmt(parseFloat(purchasePrice) * downPaymentPct / 100)}` : ""}>
              <input type="range" min={10} max={100} value={downPaymentPct} onChange={e => setDownPaymentPct(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--r)", border: "none", boxShadow: "none", padding: 0 }} />
            </FI>
            <FI label="Home Loan Interest Rate (% p.a.)">
              <input type="number" step={0.25} min={1} max={25} value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} />
            </FI>
            <FI label={`Loan Tenure: ${loanTenure} years`}>
              <input type="range" min={1} max={30} value={loanTenure} onChange={e => setLoanTenure(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--r)", border: "none", boxShadow: "none", padding: 0 }} />
            </FI>
            <FI label={`Annual Appreciation: ${appreciation}%`} note="Nepal valley avg: 7–10% p.a.">
              <input type="range" min={0} max={20} step={0.5} value={appreciation} onChange={e => setAppreciation(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--r)", border: "none", boxShadow: "none", padding: 0 }} />
            </FI>
            <FI label="Registration Fee (%)">
              <select value={registrationPct} onChange={e => setRegistrationPct(Number(e.target.value))}>
                <option value={4}>4% — Outside Valley</option>
                <option value={5}>5% — Kathmandu Valley</option>
                <option value={6}>6% — Commercial</option>
              </select>
            </FI>
          </div>

          {/* Shared */}
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "28px" }}>
            <div className="lbl" style={{ marginBottom: "20px" }}>
              <div className="lbl-line" />
              <span className="lbl-txt">Comparison Settings</span>
            </div>
            <FI label={`Comparison Period: ${holdingYears} years`}>
              <input type="range" min={1} max={30} value={holdingYears} onChange={e => setHoldingYears(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--r)", border: "none", boxShadow: "none", padding: 0 }} />
            </FI>
            <FI label={`Investment Return (opportunity cost): ${investReturn}%`} note="If you invested the down payment instead">
              <input type="range" min={1} max={20} step={0.5} value={investReturn} onChange={e => setInvestReturn(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--r)", border: "none", boxShadow: "none", padding: 0 }} />
            </FI>
          </div>
        </div>

        {/* ── RESULTS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {!calc ? (
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "48px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚖️</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--d)", opacity: 0.45, fontSize: "14px" }}>
                Enter rent and property price to compare
              </p>
            </div>
          ) : (
            <>
              {/* VERDICT */}
              <div style={{ background: calc.buyWins ? "var(--d)" : "#1e3a5f", padding: "32px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>
                  {calc.buyWins ? "🏠" : "🏢"}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: "var(--l)", marginBottom: "8px" }}>
                  {calc.buyWins ? "Buying is Better" : "Renting is Better"}
                  {" "}over {holdingYears} years
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 700, color: "var(--r)" }}>
                  Save NPR {fmt(calc.diff)} by {calc.buyWins ? "buying" : "renting"}
                </div>
                {calc.breakEvenYear && calc.buyWins && (
                  <div style={{ marginTop: "10px", fontSize: "12px", color: "rgba(249,250,251,0.45)", fontFamily: "'DM Sans', sans-serif" }}>
                    Break-even point: approximately year {calc.breakEvenYear}
                  </div>
                )}
              </div>

              {/* Side by side */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {/* Rent side */}
                <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "20px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--d)", opacity: 0.4, fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>
                    🏢 Renting — Total Cost
                  </div>
                  <CRow label="Total Rent Paid" val={`NPR ${fmt(calc.totalRentCost)}`} />
                  <CRow label="Opportunity Cost" val={`NPR ${fmt(calc.opportunityCost)}`} note="(invested down payment)" />
                  <div style={{ borderTop: "2px solid var(--d)", paddingTop: "10px", marginTop: "6px" }}>
                    <CRow label="Total" val={`NPR ${fmt(calc.totalRentScenario)}`} bold />
                  </div>
                </div>

                {/* Buy side */}
                <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "20px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--d)", opacity: 0.4, fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>
                    🏠 Buying — Net Cost
                  </div>
                  <CRow label="Down Payment + Reg" val={`NPR ${fmt(calc.totalUpfront)}`} />
                  <CRow label="Total Interest Paid" val={`NPR ${fmt(calc.interestPaid)}`} />
                  <CRow label="Maintenance" val={`NPR ${fmt(calc.totalMaintenance)}`} />
                  <CRow label="Capital Gains Tax" val={`NPR ${fmt(calc.cgt)}`} />
                  <CRow label="Resale Value" val={`− NPR ${fmt(calc.resaleValue)}`} note="(asset recovered)" />
                  <div style={{ borderTop: "2px solid var(--d)", paddingTop: "10px", marginTop: "6px" }}>
                    <CRow label="Net Cost" val={`NPR ${fmt(calc.netBuyingCost)}`} bold />
                  </div>
                </div>
              </div>

              {/* EMI vs Rent */}
              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "24px" }}>
                <div className="lbl" style={{ marginBottom: "16px" }}>
                  <div className="lbl-line" />
                  <span className="lbl-txt">Monthly Comparison</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ textAlign: "center", padding: "16px", background: "rgba(17,24,39,0.03)" }}>
                    <div style={{ fontSize: "11px", color: "var(--d)", opacity: 0.45, fontFamily: "'DM Sans', sans-serif", marginBottom: "6px" }}>Monthly Rent</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 700, color: "var(--d)" }}>
                      NPR {fmt(parseFloat(monthlyRent))}
                    </div>
                  </div>
                  <div style={{ textAlign: "center", padding: "16px", background: "var(--r06)" }}>
                    <div style={{ fontSize: "11px", color: "var(--d)", opacity: 0.45, fontFamily: "'DM Sans', sans-serif", marginBottom: "6px" }}>Monthly EMI</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 700, color: "var(--r)" }}>
                      NPR {fmt(calc.emi)}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "14px", padding: "12px 16px", background: "var(--r06)", borderLeft: "3px solid var(--r)" }}>
                  <p style={{ fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: "var(--d)", opacity: 0.65, margin: 0 }}>
                    EMI is {calc.emi > parseFloat(monthlyRent) ? `NPR ${fmt(calc.emi - parseFloat(monthlyRent))} more` : `NPR ${fmt(parseFloat(monthlyRent) - calc.emi)} less`} than your current rent per month.
                    {calc.emi > parseFloat(monthlyRent) ? " However, you're building equity in an appreciating asset." : " Buying is affordable on a monthly basis too."}
                  </p>
                </div>
              </div>

              {/* Appreciation insight */}
              <div style={{ background: "var(--r06)", border: "1px solid var(--r28)", padding: "20px 24px" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 700, color: "var(--d)", marginBottom: "6px" }}>
                  Property Value after {holdingYears} years
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 700, color: "var(--r)" }}>
                  NPR {fmt(calc.resaleValue)}
                </div>
                <div style={{ fontSize: "12px", color: "var(--d)", opacity: 0.55, fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>
                  Capital gain: NPR {fmt(calc.capitalGain)} ({pct(appreciation)}% p.a. appreciation)
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .rvb-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </ToolLayout>
  );
}

function FI({ label, children, note }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--d)", opacity: 0.5, marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </label>
      {note && <div style={{ fontSize: "11px", color: "var(--r)", fontFamily: "'DM Sans', sans-serif", marginBottom: "5px" }}>{note}</div>}
      {children}
    </div>
  );
}

function CRow({ label, val, note, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "6px 0", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ color: "var(--d)", opacity: 0.6 }}>
        {label}
        {note && <div style={{ fontSize: "10px", opacity: 0.6 }}>{note}</div>}
      </div>
      <div style={{ fontWeight: bold ? 700 : 500, color: "var(--d)", textAlign: "right" }}>{val}</div>
    </div>
  );
}