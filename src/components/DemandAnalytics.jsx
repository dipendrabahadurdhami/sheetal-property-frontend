import React, { useMemo, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  IoTrendingUpOutline, IoHomeOutline, IoLocationOutline,
  IoCashOutline, IoCarOutline, IoGridOutline, IoListOutline,
  IoLeafOutline, IoFlashOutline,
} from "react-icons/io5";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtBudget(n) {
  if (!n) return "0";
  if (n >= 10000000) return (n / 10000000).toFixed(1).replace(/\.0$/, "") + " Cr";
  if (n >= 100000)   return (n / 100000).toFixed(1).replace(/\.0$/, "") + " L";
  return n.toLocaleString("en-IN");
}

function parseBudget(val) {
  const n = parseInt(String(val || "").replace(/,/g, ""), 10);
  return isNaN(n) ? 0 : n;
}

function budgetBucket(val) {
  const n = parseBudget(val);
  if (!n)             return null;
  if (n < 2000000)    return "Under 20L";
  if (n < 5000000)    return "20L–50L";
  if (n < 10000000)   return "50L–1Cr";
  if (n < 30000000)   return "1Cr–3Cr";
  return "Above 3Cr";
}

function count(arr, key) {
  return arr.reduce((acc, item) => {
    const v = item[key];
    if (!v) return acc;
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {});
}

function toChartData(obj, limit = 10) {
  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, value]) => ({ name, value }));
}

// ── Palette ───────────────────────────────────────────────────────────────────
const RED    = "#e02424";
const DARK   = "#0F172A";
const COLORS = ["#e02424", "#1d4ed8", "#15803d", "#d97706", "#7c3aed", "#0891b2", "#db2777", "#65a30d"];

// ── Tooltip ───────────────────────────────────────────────────────────────────
const TT = ({ active, payload, label, prefix = "", suffix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: DARK, color: "#fff", borderRadius: "6px",
      padding: "10px 14px", fontSize: "12px", fontWeight: 600,
      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
    }}>
      <p style={{ margin: "0 0 4px", color: "rgba(255,255,255,0.5)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0, color: p.color || "#fff" }}>
          {prefix}{typeof p.value === "number" ? p.value.toLocaleString() : p.value}{suffix}
        </p>
      ))}
    </div>
  );
};

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, accent }) => (
  <div style={{
    background: "#fff", border: "1px solid #eaecef", borderRadius: "6px",
    padding: "18px 20px", display: "flex", flexDirection: "column", gap: "8px",
    position: "relative", overflow: "hidden",
  }}>
    <div style={{
      position: "absolute", top: 0, left: 0, width: "3px", height: "100%",
      background: accent || RED, borderRadius: "6px 0 0 6px",
    }} />
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#9ca3af" }}>{label}</span>
      <div style={{
        width: "28px", height: "28px", borderRadius: "4px",
        background: `${accent || RED}14`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon style={{ width: "14px", height: "14px", color: accent || RED }} />
      </div>
    </div>
    <p style={{ fontSize: "28px", fontWeight: 900, color: DARK, margin: 0, lineHeight: 1 }}>{value}</p>
    {sub && <p style={{ fontSize: "11px", color: "#6b7280", margin: 0 }}>{sub}</p>}
  </div>
);

// ── Chart wrapper ─────────────────────────────────────────────────────────────
const ChartBox = ({ title, subtitle, children, span = 1 }) => (
  <div style={{
    background: "#fff", border: "1px solid #eaecef", borderRadius: "6px",
    padding: "20px 22px",
    gridColumn: span > 1 ? `span ${span}` : undefined,
  }}>
    <p style={{ fontSize: "12px", fontWeight: 800, color: DARK, margin: "0 0 2px", letterSpacing: "-0.01em" }}>{title}</p>
    {subtitle && <p style={{ fontSize: "10px", color: "#9ca3af", margin: "0 0 18px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{subtitle}</p>}
    {!subtitle && <div style={{ height: "18px" }} />}
    {children}
  </div>
);

// ── Main analytics component ──────────────────────────────────────────────────
const DemandAnalytics = ({ demands }) => {
  const [view, setView] = useState("overview"); // overview | detail

  const data = useMemo(() => {
    if (!demands || !demands.length) return null;

    // Purpose breakdown
    const purposeRaw = count(demands, "tenant_option");
    const purposeData = toChartData(purposeRaw);

    // Requirement type
    const reqRaw = count(demands, "requirement");
    const reqData = toChartData(reqRaw);

    // Budget buckets
    const budgetRaw = {};
    const ORDER = ["Under 20L", "20L–50L", "50L–1Cr", "1Cr–3Cr", "Above 3Cr"];
    demands.forEach(d => {
      const b = budgetBucket(d.maximum_budget);
      if (b) budgetRaw[b] = (budgetRaw[b] || 0) + 1;
    });
    const budgetData = ORDER.filter(k => budgetRaw[k]).map(k => ({ name: k, value: budgetRaw[k] }));

    // Location top 8
    const locRaw = count(demands, "prefered_location");
    const locData = toChartData(locRaw, 8);

    // Vehicles — parse JSON object and aggregate by type
    const vehRaw = {};
    demands.forEach(d => {
      let v = d.vehicles;
      if (typeof v === "string") { try { v = JSON.parse(v); } catch { v = {}; } }
      if (v && typeof v === "object") {
        Object.entries(v).forEach(([type, qty]) => {
          if (qty > 0) vehRaw[type] = (vehRaw[type] || 0) + qty;
        });
      }
    });
    const vehData = toChartData(vehRaw, 6);

    // Facilities — flatten array
    const facRaw = {};
    demands.forEach(d => {
      (d.facilities || []).forEach(f => {
        const name = f?.name || f;
        if (name) facRaw[name] = (facRaw[name] || 0) + 1;
      });
    });
    const facData = toChartData(facRaw, 8);

    // Budget avg by purpose
    const budgetByPurpose = {};
    demands.forEach(d => {
      const p = d.tenant_option;
      const b = parseBudget(d.maximum_budget);
      if (p && b) {
        if (!budgetByPurpose[p]) budgetByPurpose[p] = { sum: 0, count: 0 };
        budgetByPurpose[p].sum += b;
        budgetByPurpose[p].count += 1;
      }
    });
    const budgetByPurposeData = Object.entries(budgetByPurpose).map(([name, { sum, count }]) => ({
      name, avg: Math.round(sum / count), avgFmt: fmtBudget(Math.round(sum / count)),
    }));

    // Demand trend by month (using index as proxy if no created_at)
    const trendData = demands.reduce((acc, d, i) => {
      const mo = `Entry ${Math.floor(i / Math.max(1, Math.floor(demands.length / 8))) + 1}`;
      const last = acc[acc.length - 1];
      if (last && last.name === mo) { last.value += 1; }
      else acc.push({ name: mo, value: 1 });
      return acc;
    }, []);

    // Radar: profile summary (normalized 0–100)
    const total = demands.length;
    const withLocation = demands.filter(d => d.prefered_location).length;
    const withBudget   = demands.filter(d => d.maximum_budget).length;
    const withVehicle  = demands.filter(d => {
      let v = d.vehicles;
      if (typeof v === "string") { try { v = JSON.parse(v); } catch { v = {}; } }
      return v && typeof v === "object" && Object.values(v).some(qty => qty > 0);
    }).length;
    const withFacility = demands.filter(d => d.facilities?.length > 0).length;
    const withDesc     = demands.filter(d => d.description).length;
    const radarData = [
      { subject: "Location",    A: Math.round(withLocation / total * 100) },
      { subject: "Budget",      A: Math.round(withBudget / total * 100) },
      { subject: "Vehicle",     A: Math.round(withVehicle / total * 100) },
      { subject: "Facilities",  A: Math.round(withFacility / total * 100) },
      { subject: "Description", A: Math.round(withDesc / total * 100) },
    ];

    // Top avg budget
    const allBudgets = demands.map(d => parseBudget(d.maximum_budget)).filter(Boolean);
    const avgBudget = allBudgets.length ? Math.round(allBudgets.reduce((a, b) => a + b, 0) / allBudgets.length) : 0;
    const maxBudget = allBudgets.length ? Math.max(...allBudgets) : 0;

    return {
      purposeData, reqData, budgetData, locData,
      vehData, facData, budgetByPurposeData,
      trendData, radarData, avgBudget, maxBudget,
      total, withLocation, withBudget,
      topPurpose: purposeData[0]?.name || "—",
      topReq: reqData[0]?.name || "—",
      topLoc: locData[0]?.name || "—",
    };
  }, [demands]);

  if (!data) return null;

  const LABEL_STYLE = { fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" };

  return (
    <div style={{ marginBottom: "40px" }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "20px", gap: "12px", flexWrap: "wrap",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div style={{ width: "16px", height: "1px", background: RED }} />
            <span style={{ ...LABEL_STYLE, color: RED }}>Demand Analytics</span>
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 900, color: DARK, margin: 0, letterSpacing: "-0.5px" }}>
            Market Intelligence
          </h2>
        </div>
        {/* Toggle */}
        <div style={{
          display: "flex", background: "#f1f5f9", borderRadius: "6px", padding: "3px", gap: "2px",
        }}>
          {["overview", "detail"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "6px 16px", borderRadius: "4px", border: "none", cursor: "pointer",
              fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
              background: view === v ? "#fff" : "transparent",
              color: view === v ? DARK : "#9ca3af",
              boxShadow: view === v ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s",
            }}>{v}</button>
          ))}
        </div>
      </div>

      {/* ── KPI row ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "12px", marginBottom: "16px",
      }}>
        
      </div>

      {/* ── OVERVIEW charts ── */}
      {view === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "12px" }}>

          {/* Purpose split — pie */}
          <div style={{ gridColumn: "span 4" }}>
            <ChartBox title="Purpose Split" subtitle="Rent vs sale distribution">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={data.purposeData} cx="50%" cy="50%" innerRadius={52} outerRadius={80}
                    dataKey="value" paddingAngle={3}>
                    {data.purposeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<TT />} />
                  <Legend iconType="circle" iconSize={8}
                    formatter={v => <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </ChartBox>
          </div>

          {/* Requirement type — bar */}
          <div style={{ gridColumn: "span 8" }}>
            <ChartBox title="Requirement Types" subtitle="Property type breakdown">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.reqData} barSize={22} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<TT suffix=" demands" />} />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                    {data.reqData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartBox>
          </div>

          {/* Budget distribution — area */}
          <div style={{ gridColumn: "span 7" }}>
            <ChartBox title="Budget Distribution" subtitle="Demand count per budget range">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data.budgetData} margin={{ left: -10 }}>
                  <defs>
                    <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={RED} stopOpacity={0.18} />
                      <stop offset="95%" stopColor={RED} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280", fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<TT suffix=" demands" />} />
                  <Area type="monotone" dataKey="value" stroke={RED} strokeWidth={2} fill="url(#budgetGrad)" dot={{ fill: RED, r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartBox>
          </div>

          {/* Data completeness radar */}
          <div style={{ gridColumn: "span 5" }}>
            <ChartBox title="Data Completeness" subtitle="% of demands with field filled">
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={data.radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#6b7280", fontWeight: 600 }} />
                  <Radar name="%" dataKey="A" stroke={RED} fill={RED} fillOpacity={0.12} strokeWidth={2} />
                  <Tooltip content={<TT suffix="%" />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartBox>
          </div>

          {/* Trend line */}
          <div style={{ gridColumn: "span 12" }}>
            <ChartBox title="Demand Volume Trend" subtitle="Cumulative demand entries across dataset">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={data.trendData} margin={{ left: -10 }}>
                  <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%"   stopColor="#1d4ed8" />
                      <stop offset="100%" stopColor={RED} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<TT suffix=" demands" />} />
                  <Line type="monotone" dataKey="value" stroke="url(#trendGrad)" strokeWidth={2.5}
                    dot={false} activeDot={{ r: 5, fill: RED, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartBox>
          </div>

        </div>
      )}

      {/* ── DETAIL charts ── */}
      {view === "detail" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "12px" }}>

          {/* Top locations — horizontal bar */}
          <div style={{ gridColumn: "span 6" }}>
            <ChartBox title="Top Locations" subtitle="Most demanded areas">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.locData} layout="vertical" barSize={14} margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TT suffix=" demands" />} />
                  <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                    {data.locData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartBox>
          </div>

          {/* Facilities — horizontal bar */}
          <div style={{ gridColumn: "span 6" }}>
            <ChartBox title="Facility Preferences" subtitle="Most requested amenities">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.facData} layout="vertical" barSize={14} margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TT suffix=" demands" />} />
                  <Bar dataKey="value" radius={[0, 3, 3, 0]} fill="#7c3aed">
                    {data.facData.map((_, i) => <Cell key={i} fill={COLORS[(i + 4) % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartBox>
          </div>

          {/* Avg budget by purpose — bar */}
          <div style={{ gridColumn: "span 6" }}>
            <ChartBox title="Avg Budget by Purpose" subtitle="Mean maximum budget per demand type">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.budgetByPurposeData} barSize={32} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#374151", fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                    tickFormatter={v => fmtBudget(v)} />
                  <Tooltip content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div style={{ background: DARK, color: "#fff", borderRadius: "6px", padding: "10px 14px", fontSize: "12px", fontWeight: 600 }}>
                        <p style={{ margin: "0 0 4px", color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>{label}</p>
                        <p style={{ margin: 0 }}>Rs. {fmtBudget(payload[0].value)}</p>
                      </div>
                    );
                  }} />
                  <Bar dataKey="avg" radius={[3, 3, 0, 0]}>
                    {data.budgetByPurposeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartBox>
          </div>

          {/* Vehicle demand — pie */}
          <div style={{ gridColumn: "span 6" }}>
            <ChartBox title="Vehicle Requirements" subtitle="Parking preference breakdown">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={data.vehData} cx="50%" cy="50%" outerRadius={80}
                    dataKey="value" paddingAngle={3} label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                    >
                    {data.vehData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<TT />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartBox>
          </div>

          {/* Budget buckets — stacked visual progress bars */}
          <div style={{ gridColumn: "span 12" }}>
            <ChartBox title="Budget Range Progress" subtitle="Demand count per price tier">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                {data.budgetData.map((d, i) => {
                  const max = Math.max(...data.budgetData.map(x => x.value));
                  const pct = Math.round(d.value / max * 100);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#374151", width: "90px", flexShrink: 0 }}>{d.name}</span>
                      <div style={{ flex: 1, height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: "4px",
                          background: COLORS[i % COLORS.length],
                          width: pct + "%",
                          transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
                        }} />
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: 800, color: COLORS[i % COLORS.length], width: "32px", textAlign: "right", flexShrink: 0 }}>{d.value}</span>
                    </div>
                  );
                })}
              </div>
            </ChartBox>
          </div>

        </div>
      )}
    </div>
  );
};

export default DemandAnalytics;