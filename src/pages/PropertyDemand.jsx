import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoSearchOutline, IoCloseCircle, IoLocationOutline,
  IoCashOutline, IoCarOutline, IoPeopleOutline,
  IoDocumentTextOutline, IoAddCircleOutline,
  IoArrowForwardOutline, IoListOutline, IoHomeOutline,
  IoBarChartOutline, IoGridOutline,
} from "react-icons/io5";
import Loader from "../components/Loader";
import PropertyDemandTable from "../components/PropertyDemandTable";
import DemandAnalytics from "../components/DemandAnalytics";
import headTag from "../headTag";
import SEO from "../components/SEO/SEO";

const SEARCH_FIELDS = [
  { icon: IoDocumentTextOutline, label: "Requirement" },
  { icon: IoLocationOutline,     label: "Location"    },
  { icon: IoCashOutline,         label: "Budget"      },
  { icon: IoPeopleOutline,       label: "Tenant"      },
  { icon: IoCarOutline,          label: "Vehicle"     },
];

const matchesTerm = (item, term) => {
  if (!term) return true;
  const t = term.toLowerCase();
  let vehicles = item?.vehicles;
  if (typeof vehicles === "string") { try { vehicles = JSON.parse(vehicles); } catch { vehicles = {}; } }
  const vehicleStr = vehicles && typeof vehicles === "object"
    ? Object.entries(vehicles).filter(([, q]) => q > 0).map(([k, q]) => `${k} ${q}`).join(" ")
    : "";
  return [item?.requirement, item?.prefered_location, item?.maximum_budget, item?.tenant_option, vehicleStr]
    .filter(Boolean).some(f => String(f).toLowerCase().includes(t));
};

const PropertyDemand = () => {
  const [demand,       setDemand]       = useState(null);
  const [filteredList, setFilteredList] = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [search,       setSearch]       = useState("");
  const [focused,      setFocused]      = useState(false);
  const [tab,          setTab]          = useState("listings"); // listings | analytics
  const [matches,      setMatches]      = useState({});

  const displayDemand = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_LINK}/property-demand-list`);
      if (res.status === 200) {
        const demands = res.data.data;
        setDemand(demands);
        setFilteredList(demands);
        if (demands?.length) fetchMatches(demands);
      }
    } catch (err) { console.error("Failed to fetch demands", err); }
    finally { setLoading(false); }
  };

  const fetchMatches = async (demands) => {
    try {
      const ids = demands.map(d => d.id).join(",");
      const res = await axios.get(`${process.env.REACT_APP_API_LINK}/demand-matches-by-requirements?requirement_form_ids=${ids}`);
      if (res.status === 200 && res.data?.data) setMatches(res.data.data);
    } catch { /* silently fail — claims just won't show */ }
  };

  useEffect(() => {
    displayDemand();
    headTag({ title: "Property Demand Board", content: "Browse buyer and tenant requirements across Nepal." });
  }, []);

  useEffect(() => {
    if (!demand) return;
    setFilteredList(demand.filter(item => matchesTerm(item, search)));
  }, [search, demand]);

  const hasResults = filteredList && filteredList.length > 0;
  const noResults  = filteredList && filteredList.length === 0 && demand;

  return (
    <div style={{ paddingTop: "64px" }}>
      <SEO
        title="Property Demand in Nepal - Post What You're Looking For"
        description="Post your property requirement in Nepal and get matched with sellers and agents. See current buyer demand trends across Nepal's real estate market."
        keywords="property demand Nepal, property requirement Nepal, buyer demand Nepal real estate, find property Nepal, property matching Nepal"
        path="/property-demand"
      />

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(135deg, var(--d) 0%, #1e293b 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 60px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 60px)" }} />
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "340px", height: "340px", borderRadius: "50%", background: "radial-gradient(circle, rgba(224,36,36,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "52px 40px 44px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "32px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <div style={{ width: "22px", height: "1px", background: "var(--r)" }} />
                <span style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--r)" }}>Property Demand Board</span>
              </div>
              <h1 style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 900, color: "#fff", lineHeight: 1.08, letterSpacing: "-1px", margin: "0 0 12px" }}>
                What Buyers &amp; Tenants<br /><span style={{ color: "var(--r)" }}>Are Looking For</span>
              </h1>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0, maxWidth: "460px" }}>
                Browse verified property requirements across Nepal. If your property matches, connect directly.
              </p>
            </div>

            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "22px 26px", minWidth: "240px", backdropFilter: "blur(8px)" }}>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 6px" }}>Have a property?</p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, margin: "0 0 16px" }}>Post your requirement so agents can reach you directly.</p>
              <Link to="/requirementForm?agent_id=1" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--r)", color: "#fff", textDecoration: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 700, padding: "11px 18px", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--rd)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--r)"}
              >
                <IoAddCircleOutline style={{ width: "15px", height: "15px" }} />
                Post a Requirement
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "28px", marginTop: "36px", flexWrap: "wrap" }}>
            {[
              { icon: IoListOutline,      label: "Active Demands",   val: demand ? `${demand.length}+` : "…" },
              { icon: IoLocationOutline,  label: "Locations Covered", val: "50+" },
              { icon: IoHomeOutline,      label: "Property Types",    val: "10+" },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "4px", background: "var(--r06)", border: "1px solid rgba(224,36,36,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon style={{ width: "14px", height: "14px", color: "var(--r)" }} />
                </div>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1 }}>{val}</p>
                  <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* ── Tab switcher ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "24px", borderBottom: "1px solid #eaecef", paddingBottom: "0" }}>
          {[
            { id: "listings",  icon: IoGridOutline,     label: "Listings" },
            { id: "analytics", icon: IoBarChartOutline, label: "Analytics" },
          ].map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "10px 18px", border: "none", borderBottom: tab === id ? "2px solid var(--r)" : "2px solid transparent",
              background: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: 700,
              color: tab === id ? "var(--r)" : "#6b7280",
              marginBottom: "-1px", transition: "color 0.15s",
            }}>
              <Icon style={{ width: "15px", height: "15px" }} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Analytics tab ── */}
        {tab === "analytics" && demand && <DemandAnalytics demands={demand} />}

        {/* ── Listings tab ── */}
        {tab === "listings" && (
          <>
            {/* Search */}
            <div style={{ background: "#fff", borderRadius: "6px", padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid #eaecef", marginBottom: "24px" }}>
              <form onSubmit={e => { e.preventDefault(); }}>
                <div style={{ display: "flex", alignItems: "center", border: focused ? "2px solid var(--r)" : "2px solid #e5e7eb", borderRadius: "6px", padding: "4px 4px 4px 14px", gap: "10px", transition: "border-color 0.2s", boxShadow: focused ? "0 0 0 4px var(--r06)" : "none", background: "#fff" }}>
                  <IoSearchOutline style={{ width: "16px", height: "16px", flexShrink: 0, color: focused ? "var(--r)" : "#9ca3af", transition: "color 0.2s" }} />
                  <input type="text" value={search} placeholder="Search by requirement, location, budget, tenant type…"
                    style={{ flex: 1, padding: "9px 0", fontSize: "13px", color: "var(--d)", border: "none", outline: "none", background: "transparent" }}
                    onChange={e => setSearch(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} autoComplete="off" />
                  {search && (
                    <button type="button" onClick={() => setSearch("")}
                      style={{ background: "#f3f4f6", border: "none", cursor: "pointer", width: "26px", height: "26px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", flexShrink: 0 }}>
                      <IoCloseCircle style={{ width: "13px", height: "13px" }} />
                    </button>
                  )}
                  <div style={{ width: "1px", height: "22px", background: "#e5e7eb", flexShrink: 0 }} />
                  <button type="submit" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "4px", background: "var(--r)", color: "#fff", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 700, flexShrink: 0, transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--rd)"}
                    onMouseLeave={e => e.currentTarget.style.background = "var(--r)"}
                  >
                    <IoSearchOutline style={{ width: "13px", height: "13px" }} /> Search
                  </button>
                </div>
              </form>

              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px", marginTop: "12px" }}>
                <span style={{ fontSize: "9px", fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.15em" }}>Filter by:</span>
                {SEARCH_FIELDS.map(({ icon: Icon, label }) => (
                  <span key={label} onClick={() => setSearch(label.toLowerCase())}
                    style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 9px", borderRadius: "999px", background: "var(--l)", border: "1px solid #e5e7eb", color: "#6b7280", fontSize: "10px", fontWeight: 600, cursor: "pointer", transition: "all 0.12s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--r06)"; e.currentTarget.style.color = "var(--r)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "var(--l)"; e.currentTarget.style.color = "#6b7280"; }}
                  >
                    <Icon style={{ width: "10px", height: "10px" }} />{label}
                  </span>
                ))}
                {search && (
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", padding: "3px 10px", borderRadius: "999px", background: "var(--r06)", border: "1px solid rgba(224,36,36,0.2)", color: "var(--r)", fontSize: "10px", fontWeight: 700 }}>
                    {search}
                    <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--rd)", fontWeight: 900, fontSize: "12px", padding: 0 }}>×</button>
                  </span>
                )}
              </div>
            </div>

            {loading && <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}><Loader /></div>}

            {!loading && demand && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
                  {search ? <><span style={{ fontWeight: 700, color: "var(--d)" }}>{filteredList?.length}</span> results for "<span style={{ color: "var(--r)", fontWeight: 700 }}>{search}</span>"</> : <><span style={{ fontWeight: 700, color: "var(--d)" }}>{filteredList?.length}</span> active demands</>}
                </p>
                <Link to="/requirementForm?agent_id=1" style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 700, color: "var(--r)", textDecoration: "none" }}>
                  <IoAddCircleOutline style={{ width: "13px", height: "13px" }} />
                  Post your requirement
                  <IoArrowForwardOutline style={{ width: "11px", height: "11px" }} />
                </Link>
              </div>
            )}

            {!loading && noResults && (
              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 22px", background: "#fff", border: "1px solid #eaecef", borderRadius: "6px" }}>
                <IoSearchOutline style={{ width: "18px", height: "18px", color: "#9ca3af", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--d)", margin: "0 0 2px" }}>No results for "{search}"</p>
                  <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>Try location, budget or requirement type</p>
                </div>
                <button onClick={() => setSearch("")} style={{ background: "none", border: "1px solid rgba(224,36,36,0.3)", borderRadius: "4px", padding: "5px 12px", fontSize: "11px", fontWeight: 700, color: "var(--r)", cursor: "pointer" }}>Clear</button>
              </div>
            )}

            {!loading && hasResults && <PropertyDemandTable demands={filteredList} matches={matches} />}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyDemand;