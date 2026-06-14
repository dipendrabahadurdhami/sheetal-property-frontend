import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import headTag from "../headTag";
import fallBackSrc from "../assets/images/noUser.png";
import { Helmet } from "react-helmet";

/* ─── tier config — no emoji, single accent per tier ─── */
const TIER = {
  "Agent: Platinum": {
    label: "Platinum",
    order: 1,
    accent: "#8e44ad",
    accentBg: "#8e44ad",
    light: "rgba(142,68,173,0.06)",
    border: "rgba(142,68,173,0.20)",
    desc: "Unlimited listings · Homepage banner · Priority ranking",
  },
  "Agent: Gold": {
    label: "Gold",
    order: 2,
    accent: "#b7770d",
    accentBg: "#b7770d",
    light: "rgba(183,119,13,0.06)",
    border: "rgba(183,119,13,0.20)",
    desc: "50 listings/month · Featured listings · Homepage banner",
  },
  "Agent: Silver": {
    label: "Silver",
    order: 3,
    accent: "#5d6d7e",
    accentBg: "#5d6d7e",
    light: "rgba(93,109,126,0.06)",
    border: "rgba(93,109,126,0.20)",
    desc: "20 listings/month · Featured listings",
  },
  "Agent: Bronze": {
    label: "Bronze",
    order: 4,
    accent: "#ca6f1e",
    accentBg: "#ca6f1e",
    light: "rgba(202,111,30,0.06)",
    border: "rgba(202,111,30,0.20)",
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
    .filter(Boolean)
    .some((f) => f.toLowerCase().includes(t));
};

/* ─── inline SVG icons — consistent stroke style ─── */
const Icon = ({ d, size = 14, color = "currentColor", strokeWidth = 1.5 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d={d} />
  </svg>
);

const ICONS = {
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.7A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.94a16 16 0 006.15 6.15l1.31-1.31a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M11.976 0C5.36 0 0 5.373 0 12c0 2.117.549 4.104 1.508 5.831L0 24l6.335-1.652A11.954 11.954 0 0011.976 24C18.59 24 24 18.627 24 12S18.59 0 11.976 0z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  map: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z",
  building: "M6 2h12v20H6zM12 6v.01M12 10v.01M12 14v.01",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  verified: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  arrow: "M5 12h14M12 5l7 7-7 7",
};

/* ─── star rating ─── */
const Stars = ({ value }) => (
  <span style={{ display: "inline-flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Icon
        key={s}
        d={ICONS.star}
        size={11}
        color={s <= Math.round(value || 0) ? "#e02424" : "#E9EAEC"}
        strokeWidth={s <= Math.round(value || 0) ? 0 : 1.5}
      />
    ))}
  </span>
);

/* ─── label — matches About page Lbl component ─── */
const Lbl = ({ text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
    <div style={{ width: 22, height: 1, background: "#e02424" }} />
    <span
      style={{
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#e02424",
      }}
    >
      {text}
    </span>
  </div>
);

/* ─── agent card ─── */
const AgentCard = ({ data }) => {
  const t = TIER[data.tier] || TIER["Agent: Bronze"];
  const name = getName(data);
  const isPremium = data.is_premium;
  const cardRef = useRef(null);

  const handleEnter = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "translateY(-3px)";
    cardRef.current.style.borderColor = t.accent;
    cardRef.current.style.boxShadow = `0 16px 40px ${t.light.replace("0.06", "0.16")}`;
  };
  const handleLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "translateY(0)";
    cardRef.current.style.borderColor = isPremium ? t.border : "#E9EAEC";
    cardRef.current.style.boxShadow = isPremium ? `0 4px 14px ${t.light}` : "none";
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
          border: `0.5px solid ${isPremium ? t.border : "#E9EAEC"}`,
          boxShadow: isPremium ? `0 4px 14px ${t.light}` : "none",
          overflow: "hidden",
          transition:
            "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s, border-color 0.3s",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* top accent bar — same height, consistent */}
        <div style={{ height: 3, background: t.accentBg, flexShrink: 0 }} />

        {/* card body */}
        <div
          style={{
            padding: "18px 18px 14px",
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
            flex: 1,
          }}
        >
          {/* avatar */}
          <div style={{ flexShrink: 0, position: "relative" }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 4,
                overflow: "hidden",
                border: `0.5px solid ${isPremium ? t.border : "#E9EAEC"}`,
                background: "#F5F6F8",
              }}
            >
              <img
                src={data.photo || fallBackSrc}
                alt={name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {/* verified badge — only for premium */}
            {isPremium && (
              <div
                style={{
                  position: "absolute",
                  bottom: -4,
                  right: -4,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: t.accentBg,
                  border: "2px solid #fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon d={ICONS.verified} size={10} color="#fff" strokeWidth={2} />
              </div>
            )}
          </div>

          {/* info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* name + tier pill */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 8,
                marginBottom: 3,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#0F172A",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {name}
              </div>
              <span
                style={{
                  flexShrink: 0,
                  background: t.light,
                  color: t.accent,
                  border: `0.5px solid ${t.border}`,
                  borderRadius: 2,
                  padding: "2px 8px",
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </span>
            </div>

            {data.designation && (
              <div
                style={{
                  fontSize: 11,
                  color: "#5d6d7e",
                  fontWeight: 600,
                  marginBottom: 2,
                }}
              >
                {data.designation}
              </div>
            )}

            {data.company_name && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  color: "#9ca3af",
                  marginBottom: 6,
                }}
              >
                <Icon d={ICONS.building} size={9} color="#9ca3af" />
                {data.company_name}
              </div>
            )}

            {/* rating */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 5,
              }}
            >
              <Stars value={data.avg_rating || 0} />
              {data.avg_rating > 0 ? (
                <span style={{ fontSize: 11, fontWeight: 700, color: "#b7770d" }}>
                  {data.avg_rating}
                  <span style={{ color: "#9ca3af", fontWeight: 400 }}>
                    {" "}({data.review_count})
                  </span>
                </span>
              ) : (
                <span style={{ fontSize: 10, color: "#9ca3af" }}>No reviews yet</span>
              )}
            </div>

            {/* location */}
            {data.city && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 10,
                  color: "#6b7280",
                }}
              >
                <Icon d={ICONS.map} size={9} color="#e02424" />
                {data.city}
              </div>
            )}

            {/* email */}
            {data.email && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 10,
                  color: "#9ca3af",
                  marginTop: 2,
                }}
              >
                <Icon d={ICONS.mail} size={9} color="#9ca3af" />
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {data.email}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* stats row — symmetric, equal flex */}
        <div
          style={{
            display: "flex",
            borderTop: "0.5px solid #E9EAEC",
            background: "#F5F6F8",
          }}
        >
          {[
            { label: "Listings", value: data.listings_count || 0, color: "#e02424" },
            { label: "Deals", value: data.deals_count || 0, color: "#27ae60" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "10px 0",
                borderRight: i === 0 ? "0.5px solid #E9EAEC" : "none",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: stat.color,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#9ca3af",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  marginTop: 2,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* action buttons — consistent height, consistent spacing */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "10px 14px 14px",
          }}
        >
          {(data.phone || data.mobile) && (
            <a
              href={`tel:${data.phone || data.mobile}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                background: "rgba(224,36,36,0.06)",
                border: "0.5px solid #E9EAEC",
                borderRadius: 4,
                textDecoration: "none",
                flexShrink: 0,
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(224,36,36,0.12)";
                e.currentTarget.style.borderColor = "#e02424";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(224,36,36,0.06)";
                e.currentTarget.style.borderColor = "#E9EAEC";
              }}
            >
              <Icon d={ICONS.phone} size={12} color="#e02424" />
            </a>
          )}

          {data.mobile && (
            <a
              href={`https://wa.me/${data.mobile?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                background: "#25d366",
                borderRadius: 4,
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              <Icon d={ICONS.whatsapp} size={14} color="#fff" />
            </a>
          )}

          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: "#e02424",
              borderRadius: 4,
              height: 36,
              fontSize: 11,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: ".06em",
              textTransform: "uppercase",
              transition: "background 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#991b1b")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#e02424")}
          >
            View Profile
            <Icon d={ICONS.arrow} size={11} color="#fff" />
          </div>
        </div>
      </div>
    </Link>
  );
};

/* ─── tier section header ─── */
const TierSection = ({ tier, agents }) => {
  if (!agents.length) return null;
  const t = TIER[tier];
  const isPremium = tier !== "Agent: Bronze";

  return (
    <div style={{ marginBottom: 44 }}>
      {/* section header — matches About page section headers */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 18,
          padding: "14px 18px",
          background: t.light,
          borderRadius: 4,
          border: `0.5px solid ${t.border}`,
          borderLeft: `3px solid ${t.accent}`,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: "#0F172A",
                letterSpacing: "-0.2px",
              }}
            >
              {t.label} Agents
            </span>
            <span
              style={{
                background: t.light,
                color: t.accent,
                border: `0.5px solid ${t.border}`,
                borderRadius: 2,
                padding: "2px 10px",
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              {agents.length} {agents.length === 1 ? "agent" : "agents"}
            </span>
            {isPremium && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: "#fff",
                  border: `0.5px solid ${t.border}`,
                  borderRadius: 2,
                  padding: "2px 8px",
                  fontSize: 9,
                  color: t.accent,
                  fontWeight: 700,
                }}
              >
                <Icon d={ICONS.verified} size={10} color={t.accent} />
                Verified Premium
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: "#7f8c8d", marginTop: 3 }}>{t.desc}</div>
        </div>
      </div>

      {/* cards grid — mobile first */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
          gap: 12,
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
  const [filter, setFilter] = useState("");
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tierFilter, setTierFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_LINK}/agent-list`)
      .then((res) => {
        if (res.status === 200) setAgents(res.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    headTag({
      title: "Find Agent",
      content: "Find verified real estate agents in Nepal",
    });
  }, []);

  const filtered = agents.filter(
    (a) =>
      matchesFilter(a, filter) &&
      (tierFilter === "all" || a.tier === tierFilter)
  );

  const grouped = TIER_ORDER.reduce((acc, tier) => {
    acc[tier] = filtered.filter((a) => a.tier === tier);
    return acc;
  }, {});

  const premiumCount = agents.filter((a) => a.is_premium).length;

  return (
    <div
      className="ab"
      style={{
        background: "#F5F6F8",
        minHeight: "100vh",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <Helmet>
        <title>Find Real Estate Agents in Nepal | Sheetal Property Nepal</title>
        <meta
          name="description"
          content={`Find ${agents.length} verified real estate agents across Nepal. Connect with Platinum, Gold, Silver and Bronze tier agents for buying, selling and renting properties in Kathmandu and beyond.`}
        />
        <meta
          name="keywords"
          content="real estate agents Nepal, property agents Kathmandu, find property agent Nepal, verified agents Nepal, Sheetal Property agents"
        />
        <link rel="canonical" href="https://sheetalproperty.com/agents" />
        <meta property="og:title" content="Find Real Estate Agents in Nepal | Sheetal Property Nepal" />
        <meta property="og:description" content="Find verified real estate agents across Nepal." />
        <meta property="og:url" content="https://sheetalproperty.com/agents" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Real Estate Agents in Nepal",
            description: "Verified real estate agents at Sheetal Property Nepal",
            url: "https://sheetalproperty.com/agents",
            numberOfItems: agents.length,
          })}
        </script>
      </Helmet>

      {/* ── hero — matches About page hero structure ── */}
      <div
        style={{
          background: "#0F172A",
          paddingTop: 110,
          paddingBottom: 52,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* grid bg — same as About */}
        <div className="grid-wrap">
          <div className="grid-bg" />
        </div>

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* section label */}
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
            <span style={{ color: "#e02424" }}>Perfect Agent</span>
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.5)",
              fontSize: 13,
              marginBottom: 32,
              maxWidth: 400,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.7,
            }}
          >
            {agents.length} agents · {premiumCount} verified premium agents across Nepal
          </p>

          {/* search input — same style as About hero inputs */}
          <div
            style={{ maxWidth: 520, margin: "0 auto", position: "relative" }}
          >
            <div
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
            >
              <Icon d={ICONS.search} size={14} color="#9ca3af" />
            </div>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search by name, city, company..."
              style={{
                width: "100%",
                padding: "13px 18px 13px 44px",
                borderRadius: 4,
                border: "1.5px solid rgba(255,255,255,0.1)",
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                fontFamily: "'Outfit', sans-serif",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#e02424";
                e.target.style.background = "rgba(255,255,255,0.10)";
                e.target.style.boxShadow = "0 0 0 3px rgba(224,36,36,0.14)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.1)";
                e.target.style.background = "rgba(255,255,255,0.06)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* tier quick stats — same pattern as About hero stat boxes */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 28,
              marginTop: 36,
              flexWrap: "wrap",
            }}
          >
            {TIER_ORDER.map((tier) => {
              const t = TIER[tier];
              const cnt = agents.filter((a) => a.tier === tier).length;
              return (
                <div key={tier} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color: "#fff",
                      lineHeight: 1,
                    }}
                  >
                    {cnt}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "rgba(255,255,255,0.4)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".1em",
                      marginTop: 4,
                    }}
                  >
                    {t.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── filter tabs — sticky, consistent with About nav style ── */}
      <div
        style={{
          background: "#fff",
          borderBottom: "0.5px solid #E9EAEC",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {[
            { id: "all", label: "All Agents", count: agents.length },
            ...TIER_ORDER.map((tier) => ({
              id: tier,
              label: TIER[tier].label,
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
                  border: "none",
                  background: "none",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "'Outfit', sans-serif",
                  color: active ? "#e02424" : "#6b7280",
                  borderBottom: `2px solid ${active ? "#e02424" : "transparent"}`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all .15s",
                  letterSpacing: ".02em",
                }}
              >
                {tab.label}
                <span
                  style={{
                    marginLeft: 5,
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
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "36px 24px 72px",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 80,
            }}
          >
            <Loader />
          </div>
        ) : filtered.length === 0 ? (
          /* empty state */
          <div
            style={{
              textAlign: "center",
              padding: "72px 20px",
              background: "#fff",
              borderRadius: 4,
              border: "0.5px solid #E9EAEC",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 4,
                background: "rgba(224,36,36,0.06)",
                border: "0.5px solid rgba(224,36,36,0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Icon d={ICONS.search} size={20} color="#e02424" />
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "#0F172A",
                marginBottom: 6,
                letterSpacing: "-0.2px",
              }}
            >
              No agents found
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>
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