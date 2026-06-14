import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import headTag from "../headTag";
import fallBackSrc from "../assets/images/noUser.png";
import { FaStar, FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaSearch, FaBuilding } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { Helmet } from "react-helmet";

/* ─── tier config ─── */
const TIER = {
  "Agent: Platinum": {
    icon: "💎", label: "Platinum", order: 1,
    accent: "#8e44ad", accentBg: "linear-gradient(135deg,#6c3483,#8e44ad)",
    light: "rgba(142,68,173,0.06)", border: "rgba(142,68,173,0.25)",
    desc: "Unlimited listings · Homepage banner · Priority ranking",
  },
  "Agent: Gold": {
    icon: "🥇", label: "Gold", order: 2,
    accent: "#d68910", accentBg: "linear-gradient(135deg,#b7770d,#f39c12)",
    light: "rgba(214,137,16,0.06)", border: "rgba(214,137,16,0.25)",
    desc: "50 listings/month · Featured listings · Homepage banner",
  },
  "Agent: Silver": {
    icon: "🥈", label: "Silver", order: 3,
    accent: "#5d6d7e", accentBg: "linear-gradient(135deg,#5d6d7e,#85929e)",
    light: "rgba(93,109,126,0.06)", border: "rgba(93,109,126,0.25)",
    desc: "20 listings/month · Featured listings",
  },
  "Agent: Bronze": {
    icon: "🥉", label: "Bronze", order: 4,
    accent: "#ca6f1e", accentBg: "linear-gradient(135deg,#ca6f1e,#e67e22)",
    light: "rgba(202,111,30,0.06)", border: "rgba(202,111,30,0.25)",
    desc: "1 listing/month · Free plan",
  },
};

const TIER_ORDER = ["Agent: Platinum", "Agent: Gold", "Agent: Silver", "Agent: Bronze"];

const getName = (a) => {
  if (a.first_name && a.last_name) return `${a.first_name} ${a.last_name}`;
  return a.first_name || a.last_name || a.user_name || "Sheetal Agent";
};

const matchesFilter = (a, term) => {
  if (!term) return true;
  const t = term.toLowerCase();
  return [a.first_name, a.last_name, a.user_name, a.email, a.phone, a.mobile, a.city, a.company_name]
    .filter(Boolean).some((f) => f.toLowerCase().includes(t));
};

/* ─── stars ─── */
const Stars = ({ value }) => (
  <span style={{ display: "inline-flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <FaStar key={s} style={{ fontSize: 11, color: s <= Math.round(value || 0) ? "#e02424" : "#E9EAEC" }} />
    ))}
  </span>
);

/* ─── agent card ─── */
const AgentCard = ({ data }) => {
  const t = TIER[data.tier] || TIER["Agent: Bronze"];
  const name = getName(data);
  const isPlatGold = data.tier === "Agent: Platinum" || data.tier === "Agent: Gold";
  const isPremium = data.is_premium;
  const cardRef = useRef(null);

  const handleEnter = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "translateY(-3px)";
    cardRef.current.style.borderColor = t.accent;
    cardRef.current.style.boxShadow = `0 16px 40px ${t.light.replace("0.06", "0.18")}`;
  };
  const handleLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "translateY(0)";
    cardRef.current.style.borderColor = isPremium ? t.accent + "55" : "#E9EAEC";
    cardRef.current.style.boxShadow = isPremium ? `0 4px 16px ${t.light}` : "none";
  };

  return (
    <Link to={`/agent/${data.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        ref={cardRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          background: "#fff",
          borderRadius: 4,
          border: `0.5px solid ${isPremium ? t.accent + "55" : "#E9EAEC"}`,
          boxShadow: isPremium ? `0 4px 16px ${t.light}` : "none",
          overflow: "hidden",
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s, border-color 0.3s",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* tier accent bar */}
        <div style={{ height: 3, background: t.accentBg, flexShrink: 0 }} />

        {/* body */}
        <div style={{ padding: "18px 18px 14px", display: "flex", gap: 14, alignItems: "flex-start", flex: 1 }}>
          {/* avatar */}
          <div style={{ flexShrink: 0, position: "relative" }}>
            <div
              style={{
                width: 64, height: 64, borderRadius: 4, overflow: "hidden",
                border: `1.5px solid ${isPremium ? t.accent + "55" : "#E9EAEC"}`,
                background: "#F5F6F8",
              }}
            >
              <img
                src={data.photo || fallBackSrc}
                alt={name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {isPremium && (
              <div
                style={{
                  position: "absolute", bottom: -5, right: -5,
                  width: 20, height: 20, borderRadius: "50%",
                  background: t.accentBg,
                  border: "2px solid #fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <MdVerified style={{ color: "#fff", fontSize: 11 }} />
              </div>
            )}
          </div>

          {/* info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* name + tier badge */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
              <div
                style={{
                  fontSize: 14, fontWeight: 800, color: "#0F172A",
                  lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}
              >
                {name}
              </div>
              <span
                style={{
                  flexShrink: 0,
                  background: t.accentBg, color: "#fff",
                  borderRadius: 20, padding: "2px 9px",
                  fontSize: 9, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {t.icon} {t.label}
              </span>
            </div>

            {data.designation && (
              <div style={{ fontSize: 11, color: "#5d6d7e", fontWeight: 600, marginBottom: 1 }}>{data.designation}</div>
            )}
            {data.company_name && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>
                <FaBuilding style={{ fontSize: 9 }} /> {data.company_name}
              </div>
            )}

            {/* rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <Stars value={data.avg_rating || 0} />
              {data.avg_rating > 0 ? (
                <span style={{ fontSize: 11, fontWeight: 700, color: "#d68910" }}>
                  {data.avg_rating}{" "}
                  <span style={{ color: "#9ca3af", fontWeight: 400 }}>({data.review_count})</span>
                </span>
              ) : (
                <span style={{ fontSize: 10, color: "#9ca3af" }}>No reviews yet</span>
              )}
            </div>

            {/* location / email */}
            {data.city && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#6b7280" }}>
                <FaMapMarkerAlt style={{ fontSize: 9, color: "#e02424" }} /> {data.city}
              </div>
            )}
            {data.email && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#9ca3af", marginTop: 1 }}>
                <FaEnvelope style={{ fontSize: 9 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* stats row */}
        <div
          style={{
            display: "flex",
            borderTop: "0.5px solid #E9EAEC",
            background: "#F5F6F8",
          }}
        >
          {[
            { label: "Listings", value: data.listings_count || 0, color: "#e02424" },
            { label: "Deals",    value: data.deals_count    || 0, color: "#27ae60" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                flex: 1, textAlign: "center", padding: "10px 0",
                borderRight: i === 0 ? "0.5px solid #E9EAEC" : "none",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginTop: 2 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* action buttons */}
        <div style={{ display: "flex", gap: 8, padding: "10px 14px 14px" }}>
          {(data.phone || data.mobile) && (
            <a
              href={`tel:${data.phone || data.mobile}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 36, height: 36, background: "rgba(224,36,36,0.06)",
                border: "0.5px solid #E9EAEC", borderRadius: 4,
                textDecoration: "none", flexShrink: 0,
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(224,36,36,0.14)"; e.currentTarget.style.borderColor = "#e02424"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(224,36,36,0.06)"; e.currentTarget.style.borderColor = "#E9EAEC"; }}
            >
              <FaPhone style={{ fontSize: 11, color: "#e02424" }} />
            </a>
          )}
          {data.mobile && (
            <a
              href={`https://wa.me/${data.mobile?.replace(/\D/g, "")}`}
              target="_blank" rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 36, height: 36, background: "#25d366", borderRadius: 4,
                textDecoration: "none", flexShrink: 0,
              }}
            >
              <FaWhatsapp style={{ fontSize: 14, color: "#fff" }} />
            </a>
          )}
          <div
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              background: isPlatGold ? t.accentBg : "var(--r, #e02424)",
              borderRadius: 4, height: 36,
              fontSize: 11, fontWeight: 800, color: "#fff",
              letterSpacing: ".06em", textTransform: "uppercase",
              transition: "opacity 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            View Profile →
          </div>
        </div>
      </div>
    </Link>
  );
};

/* ─── tier section ─── */
const TierSection = ({ tier, agents }) => {
  if (!agents.length) return null;
  const t = TIER[tier];
  const isPremium = tier !== "Agent: Bronze";

  return (
    <div style={{ marginBottom: 48 }}>
      {/* section header */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 16, marginBottom: 20,
          padding: "14px 18px",
          background: t.light,
          borderRadius: 4,
          border: `0.5px solid ${t.border}`,
          borderLeft: `3px solid ${t.accent}`,
        }}
      >
        <div
          style={{
            width: 42, height: 42, borderRadius: 4,
            background: t.accentBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, flexShrink: 0,
          }}
        >
          {t.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.3px" }}>
              {t.label} Agents
            </span>
            <span
              style={{
                background: t.accentBg, color: "#fff",
                borderRadius: 20, padding: "2px 10px",
                fontSize: 10, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase",
              }}
            >
              {agents.length} {agents.length === 1 ? "agent" : "agents"}
            </span>
            {isPremium && (
              <span
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  background: "#fff", border: `0.5px solid ${t.border}`,
                  borderRadius: 20, padding: "2px 10px",
                  fontSize: 10, color: t.accent, fontWeight: 700,
                }}
              >
                <MdVerified style={{ fontSize: 11 }} /> Verified Premium
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: "#7f8c8d", marginTop: 3 }}>{t.desc}</div>
        </div>
      </div>

      {/* cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 14,
        }}
      >
        {agents.map((agent) => (
          <AgentCard key={agent.id} data={agent} />
        ))}
      </div>
    </div>
  );
};

/* ─── main page ─── */
const FindAgent = () => {
  const [filter,     setFilter]     = useState("");
  const [agents,     setAgents]     = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [tierFilter, setTierFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_LINK}/agent-list`)
      .then((res) => { if (res.status === 200) setAgents(res.data.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
    headTag({ title: "Find Agent", content: "Find verified real estate agents in Nepal" });
  }, []);

  const filtered = agents.filter(
    (a) => matchesFilter(a, filter) && (tierFilter === "all" || a.tier === tierFilter)
  );

  const grouped = TIER_ORDER.reduce((acc, tier) => {
    acc[tier] = filtered.filter((a) => a.tier === tier);
    return acc;
  }, {});

  const premiumCount = agents.filter((a) => a.is_premium).length;

  return (
    <div
      className="ab"
      style={{ background: "#F5F6F8", minHeight: "100vh", fontFamily: "'Outfit', sans-serif" }}
    >
      <Helmet>
        <title>Find Real Estate Agents in Nepal | Sheetal Property Nepal</title>
        <meta name="description" content={`Find ${agents.length} verified real estate agents across Nepal. Connect with Platinum, Gold, Silver and Bronze tier agents for buying, selling and renting properties in Kathmandu and beyond.`} />
        <meta name="keywords" content="real estate agents Nepal, property agents Kathmandu, find property agent Nepal, verified agents Nepal, Sheetal Property agents" />
        <link rel="canonical" href="https://sheetalproperty.com/agents" />
        <meta property="og:title" content="Find Real Estate Agents in Nepal | Sheetal Property Nepal" />
        <meta property="og:description" content="Find verified real estate agents across Nepal." />
        <meta property="og:url" content="https://sheetalproperty.com/agents" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Real Estate Agents in Nepal",
          "description": "Verified real estate agents at Sheetal Property Nepal",
          "url": "https://sheetalproperty.com/agents",
          "numberOfItems": agents.length,
        })}</script>
      </Helmet>

      {/* ── hero ── */}
      <div
        style={{
          background: "#0F172A",
          paddingTop: 110, paddingBottom: 52,
          position: "relative", overflow: "hidden",
        }}
      >
        {/* grid bg */}
        <div className="grid-wrap">
          <div className="grid-bg" />
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          {/* label */}
          <div className="lbl" style={{ justifyContent: "center" }}>
            <div className="lbl-line" />
            <span className="lbl-txt">Verified Real Estate Agents</span>
            <div className="lbl-line" />
          </div>

          <h1
            className="h-xl"
            style={{ color: "#fff", textAlign: "center", marginBottom: 12 }}
          >
            Find Your{" "}
            <span style={{ color: "var(--r, #e02424)" }}>Perfect Agent</span>
          </h1>

          <p
            style={{
              textAlign: "center", color: "rgba(255,255,255,0.5)",
              fontSize: 14, marginBottom: 32, opacity: 1,
              maxWidth: 440, marginLeft: "auto", marginRight: "auto",
            }}
          >
            {agents.length} agents · {premiumCount} verified premium agents across Nepal
          </p>

          {/* search */}
          <div style={{ maxWidth: 540, margin: "0 auto", position: "relative" }}>
            <FaSearch
              style={{
                position: "absolute", left: 16, top: "50%",
                transform: "translateY(-50%)", color: "#9ca3af", fontSize: 14, zIndex: 1,
              }}
            />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search by name, city, company..."
              style={{
                width: "100%",
                padding: "14px 18px 14px 46px",
                borderRadius: 4,
                border: "1.5px solid rgba(255,255,255,0.1)",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                fontFamily: "'Outfit', sans-serif",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--r, #e02424)";
                e.target.style.background = "rgba(255,255,255,0.1)";
                e.target.style.boxShadow = "0 0 0 3px rgba(224,36,36,0.14)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.1)";
                e.target.style.background = "rgba(255,255,255,0.06)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* quick stats */}
          <div
            style={{
              display: "flex", justifyContent: "center", gap: 32,
              marginTop: 36, flexWrap: "wrap",
            }}
          >
            {TIER_ORDER.map((tier) => {
              const t = TIER[tier];
              const cnt = agents.filter((a) => a.tier === tier).length;
              return (
                <div key={tier} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{cnt}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginTop: 3 }}>
                    {t.icon} {t.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── filter tabs ── */}
      <div
        style={{
          background: "#fff",
          borderBottom: "0.5px solid #E9EAEC",
          position: "sticky", top: 0, zIndex: 50,
          boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: 1200, margin: "0 auto", padding: "0 24px",
            display: "flex", overflowX: "auto", scrollbarWidth: "none",
          }}
        >
          {[
            { id: "all", label: "All Agents", count: agents.length },
            ...TIER_ORDER.map((tier) => ({
              id: tier,
              label: `${TIER[tier].icon} ${TIER[tier].label}`,
              count: agents.filter((a) => a.tier === tier).length,
            })),
          ].map((tab) => {
            const active = tierFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTierFilter(tab.id)}
                style={{
                  padding: "14px 18px",
                  border: "none", background: "none",
                  fontSize: 12, fontWeight: 700,
                  fontFamily: "'Outfit', sans-serif",
                  color: active ? "#e02424" : "#6b7280",
                  borderBottom: `2px solid ${active ? "#e02424" : "transparent"}`,
                  cursor: "pointer", whiteSpace: "nowrap",
                  transition: "all .15s",
                  letterSpacing: ".02em",
                }}
              >
                {tab.label}{" "}
                <span
                  style={{
                    fontSize: 10,
                    color: active ? "#e02424" : "#9ca3af",
                    fontWeight: 500,
                  }}
                >
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── content ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 24px 72px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
            <Loader />
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center", padding: "80px 20px",
              background: "#fff", borderRadius: 4,
              border: "0.5px solid #E9EAEC",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div
              style={{
                fontSize: 16, fontWeight: 800, color: "#0F172A",
                marginBottom: 8, letterSpacing: "-0.3px",
              }}
            >
              No agents found
            </div>
            <div style={{ fontSize: 13, color: "#9ca3af" }}>
              Try a different search term or tier filter
            </div>
          </div>
        ) : (
          TIER_ORDER.map((tier) => (
            <TierSection key={tier} tier={tier} agents={grouped[tier] || []} />
          ))
        )}
      </div>
    </div>
  );
};

export default FindAgent;