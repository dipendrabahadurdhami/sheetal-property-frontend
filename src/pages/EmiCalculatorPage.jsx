// src/pages/EmiCalculatorPage.jsx
// FULLY STATIC — pure math, no API needed
// Nepal home loan EMI with amortization schedule

import { useState, useMemo } from "react";
import ToolLayout from "../components/Common/Tools/ToolLayout";

const NRB_BANKS = [
  { name: "Nepal Rastra Bank Base Rate", rate: 9.5 },
  { name: "Nabil Bank",                  rate: 10.5 },
  { name: "Nepal Bank Ltd",              rate: 10.0 },
  { name: "Himalayan Bank",              rate: 11.0 },
  { name: "Standard Chartered Nepal",   rate: 10.25 },
  { name: "Everest Bank",               rate: 10.75 },
  { name: "SBI Nepal",                  rate: 10.0 },
  { name: "Custom Rate",                rate: null },
];

function fmt(n) {
  return Math.round(n).toLocaleString("en-NP");
}

function calcEMI(principal, annualRate, months) {
  if (!principal || !annualRate || !months) return 0;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function buildSchedule(principal, annualRate, months) {
  const r = annualRate / 100 / 12;
  const emi = calcEMI(principal, annualRate, months);
  let balance = principal;
  const rows = [];
  let totalInterest = 0;

  for (let i = 1; i <= months; i++) {
    const interest  = balance * r;
    const principal_ = emi - interest;
    balance -= principal_;
    totalInterest += interest;
    if (i <= 12 || i === months || i % 12 === 0) {
      rows.push({
        month: i,
        emi: emi,
        principal: principal_,
        interest: interest,
        balance: Math.max(0, balance),
        totalInterest,
      });
    }
  }
  return { rows, emi, totalInterest };
}

export default function EmiCalculatorPage() {
  const [loanAmt,    setLoanAmt]    = useState("");
  const [bankIdx,    setBankIdx]    = useState(0);
  const [customRate, setCustomRate] = useState("");
  const [tenure,     setTenure]     = useState(20);
  const [showSched,  setShowSched]  = useState(false);

  const selectedBank = NRB_BANKS[bankIdx];
  const rate = selectedBank.rate !== null ? selectedBank.rate : parseFloat(customRate) || 0;
  const months = tenure * 12;
  const principal = parseFloat(loanAmt.replace(/,/g, "")) || 0;

  const { rows, emi, totalInterest } = useMemo(
    () => buildSchedule(principal, rate, months),
    [principal, rate, months]
  );

  const totalPayment = emi * months;
  const emiValid = principal > 0 && rate > 0 && months > 0;

  return (
    <ToolLayout
      title="EMI Calculator"
      subtitle="Calculate your monthly home loan installment based on Nepal bank rates. Includes full amortization schedule."
      icon="🏦"
      badge="Home Loan Tool"
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="emi-grid">

        {/* ── INPUTS ── */}
        <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "36px" }}>
          <div className="lbl" style={{ marginBottom: "28px" }}>
            <div className="lbl-line" />
            <span className="lbl-txt">Loan Details</span>
          </div>

          {/* Loan Amount */}
          <div style={{ marginBottom: "22px" }}>
            <label style={labelStyle}>Loan Amount (NPR)</label>
            <input
              type="number"
              placeholder="e.g. 5000000"
              value={loanAmt}
              onChange={(e) => setLoanAmt(e.target.value)}
            />
            {principal > 0 && (
              <small style={{ marginTop: "4px", display: "block", color: "var(--r)", fontFamily: "'DM Sans', sans-serif" }}>
                NPR {fmt(principal)}
              </small>
            )}
          </div>

          {/* Bank / Rate */}
          <div style={{ marginBottom: "22px" }}>
            <label style={labelStyle}>Bank / Interest Rate</label>
            <select value={bankIdx} onChange={(e) => setBankIdx(Number(e.target.value))}>
              {NRB_BANKS.map((b, i) => (
                <option key={i} value={i}>
                  {b.name}{b.rate ? ` — ${b.rate}%` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Custom rate input */}
          {selectedBank.rate === null && (
            <div style={{ marginBottom: "22px" }}>
              <label style={labelStyle}>Custom Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="30"
                placeholder="e.g. 11.5"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
              />
            </div>
          )}

          {/* Tenure */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{ ...labelStyle, display: "flex", justifyContent: "space-between" }}>
              <span>Loan Tenure</span>
              <span style={{ color: "var(--r)", fontWeight: 700 }}>{tenure} years ({months} months)</span>
            </label>
            <input
              type="range"
              min={1}
              max={30}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "var(--r)",
                height: "4px",
                cursor: "pointer",
                border: "none",
                boxShadow: "none",
                padding: 0,
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--d)", opacity: 0.4, fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>
              <span>1 yr</span><span>15 yrs</span><span>30 yrs</span>
            </div>
          </div>

          {/* NRB note */}
          <div style={{ padding: "12px 16px", background: "var(--r06)", borderLeft: "3px solid var(--r)" }}>
            <p style={{ fontSize: "11px", fontFamily: "'DM Sans', sans-serif", color: "var(--d)", opacity: 0.65, margin: 0, lineHeight: 1.6 }}>
              Rates are indicative as per <strong>Nepal Rastra Bank</strong> guidelines. Actual rates vary by bank and credit profile.
            </p>
          </div>
        </div>

        {/* ── RESULTS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Monthly EMI hero */}
          <div style={{ background: "var(--d)", padding: "36px", textAlign: "center" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(249,250,251,0.45)", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>
              Monthly EMI
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: emiValid ? "var(--r)" : "rgba(249,250,251,0.2)", lineHeight: 1 }}>
              {emiValid ? `NPR ${fmt(emi)}` : "—"}
            </div>
            {emiValid && (
              <div style={{ fontSize: "12px", color: "rgba(249,250,251,0.4)", fontFamily: "'DM Sans', sans-serif", marginTop: "8px" }}>
                per month for {tenure} years @ {rate}% p.a.
              </div>
            )}
          </div>

          {/* Stats grid */}
          {emiValid && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="sb">
                  <div style={statLabelStyle}>Total Amount Payable</div>
                  <div style={statValueStyle}>NPR {fmt(totalPayment)}</div>
                </div>
                <div className="sb">
                  <div style={statLabelStyle}>Total Interest</div>
                  <div style={{ ...statValueStyle, color: "var(--r)" }}>NPR {fmt(totalInterest)}</div>
                </div>
                <div className="sb">
                  <div style={statLabelStyle}>Principal Amount</div>
                  <div style={statValueStyle}>NPR {fmt(principal)}</div>
                </div>
                <div className="sb">
                  <div style={statLabelStyle}>Interest Rate</div>
                  <div style={statValueStyle}>{rate}% p.a.</div>
                </div>
              </div>

              {/* Principal vs Interest bar */}
              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,0.08)", padding: "24px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--d)", opacity: 0.45, fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>
                  Principal vs Interest
                </div>
                <div style={{ height: "8px", background: "rgba(17,24,39,0.08)", borderRadius: "4px", overflow: "hidden", marginBottom: "10px" }}>
                  <div style={{ height: "100%", width: `${(principal / totalPayment) * 100}%`, background: "var(--d)", borderRadius: "4px", transition: "width 0.5s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "10px", height: "10px", background: "var(--d)", display: "inline-block" }} />
                    Principal {Math.round((principal / totalPayment) * 100)}%
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "10px", height: "10px", background: "var(--r)", display: "inline-block" }} />
                    Interest {Math.round((totalInterest / totalPayment) * 100)}%
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── AMORTIZATION SCHEDULE ── */}
      {emiValid && (
        <div style={{ marginTop: "24px", background: "#fff", border: "1px solid rgba(17,24,39,0.08)" }}>
          <button
            onClick={() => setShowSched(!showSched)}
            style={{
              width: "100%",
              padding: "18px 32px",
              background: "none",
              border: "none",
              borderBottom: showSched ? "1px solid rgba(17,24,39,0.08)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              color: "var(--d)",
              letterSpacing: "0.04em",
            }}
          >
            <span>View Amortization Schedule (yearly summary)</span>
            <span style={{ color: "var(--r)", fontSize: "18px" }}>{showSched ? "▲" : "▼"}</span>
          </button>

          {showSched && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "var(--d)" }}>
                    {["Month", "EMI (NPR)", "Principal (NPR)", "Interest (NPR)", "Balance (NPR)"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "right", color: "rgba(249,250,251,0.7)", fontWeight: 600, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(17,24,39,0.05)", background: i % 2 === 0 ? "#fff" : "rgba(17,24,39,0.015)" }}>
                      <td style={{ padding: "11px 16px", textAlign: "right", fontWeight: 600, color: r.month === months ? "var(--r)" : "var(--d)" }}>
                        {r.month === months ? "Final" : r.month}
                      </td>
                      <td style={{ padding: "11px 16px", textAlign: "right" }}>{fmt(r.emi)}</td>
                      <td style={{ padding: "11px 16px", textAlign: "right" }}>{fmt(r.principal)}</td>
                      <td style={{ padding: "11px 16px", textAlign: "right", color: "var(--r)" }}>{fmt(r.interest)}</td>
                      <td style={{ padding: "11px 16px", textAlign: "right", fontWeight: 600 }}>{fmt(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .emi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </ToolLayout>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--d)",
  opacity: 0.5,
  marginBottom: "8px",
  fontFamily: "'DM Sans', sans-serif",
};

const statLabelStyle = {
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--d)",
  opacity: 0.45,
  fontFamily: "'DM Sans', sans-serif",
  marginBottom: "6px",
};

const statValueStyle = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "20px",
  fontWeight: 700,
  color: "var(--d)",
};