import React from "react";
import fallBackSrc from "../../assets/images/noUser.png";
import { Link } from "react-router-dom";
import { FaStar, FaCrown, FaHome, FaHandshake, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const TIER_CONFIG = {
  "Agent: Platinum": { icon: "💎", color: "#fff", bg: "linear-gradient(135deg,#8e44ad,#6c3483)", border: "#8e44ad", label: "Platinum", glow: "rgba(142,68,173,0.25)" },
  "Agent: Gold":     { icon: "🥇", color: "#fff", bg: "linear-gradient(135deg,#f39c12,#d68910)", border: "#f39c12", label: "Gold",     glow: "rgba(243,156,18,0.25)"  },
  "Agent: Silver":   { icon: "🥈", color: "#fff", bg: "linear-gradient(135deg,#7f8c8d,#5d6d7e)", border: "#95a5a6", label: "Silver",   glow: "rgba(149,165,166,0.2)"  },
  "Agent: Bronze":   { icon: "🥉", color: "#ca6f1e", bg: "#fef5ec",                               border: "#e67e22", label: "Bronze",   glow: "none"                   },
};

const Stars = ({ value }) => (
  <div style={{ display:"flex", gap:2 }}>
    {[1,2,3,4,5].map(s => (
      <FaStar key={s} style={{ fontSize:11, color: s<=Math.round(value) ? "#f59e0b" : "#e5e7eb" }} />
    ))}
  </div>
);

const AgentListItem = ({ data }) => {
  const {
    id, first_name, last_name, photo, email, phone, mobile,
    tier, avg_rating, review_count, listings_count, deals_count,
    is_premium, city, designation, company_name,
  } = data;

  const displayName = first_name && last_name ? `${first_name} ${last_name}` : "Sheetal Property Agent";
  const tierConfig  = TIER_CONFIG[tier] || TIER_CONFIG["Agent: Bronze"];
  const isPlatGold  = tier === "Agent: Platinum" || tier === "Agent: Gold";

  return (
    <Link to={`/agent/${id}`} style={{ textDecoration:"none", display:"block" }}>
      <div style={{
        display:"flex", alignItems:"stretch", gap:0,
        background:"#fff", borderRadius:16,
        border:`1px solid ${is_premium ? tierConfig.border : "#e5e7eb"}`,
        boxShadow: is_premium ? `0 4px 20px ${tierConfig.glow}` : "0 1px 4px rgba(0,0,0,0.04)",
        overflow:"hidden", transition:"transform .18s, box-shadow .18s",
        marginBottom:0,
      }}
        onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=is_premium?`0 8px 30px ${tierConfig.glow}`:"0 4px 16px rgba(0,0,0,0.1)"; }}
        onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=is_premium?`0 4px 20px ${tierConfig.glow}`:"0 1px 4px rgba(0,0,0,0.04)"; }}
      >
        {/* Left color strip for premium */}
        {is_premium && (
          <div style={{ width:6, flexShrink:0, background:isPlatGold ? tierConfig.bg : tierConfig.border }} />
        )}

        {/* Avatar area */}
        <div style={{ padding:"20px 16px 20px 20px", display:"flex", alignItems:"center", flexShrink:0 }}>
          <div style={{ position:"relative" }}>
            <div style={{
              width:76, height:76, borderRadius:"50%", overflow:"hidden",
              border:`3px solid ${is_premium ? tierConfig.border : "#e5e7eb"}`,
              boxShadow: is_premium ? `0 4px 12px ${tierConfig.glow}` : "none",
            }}>
              <img src={photo||fallBackSrc} alt={displayName} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            {is_premium && (
              <div style={{ position:"absolute", bottom:0, right:0, width:22, height:22, background:tierConfig.border, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #fff" }}>
                <MdVerified style={{ color:"#fff", fontSize:12 }} />
              </div>
            )}
          </div>
        </div>

        {/* Main info */}
        <div style={{ flex:1, padding:"16px 0 16px 4px", minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
            <span style={{ fontSize:16, fontWeight:800, color:"#111" }}>{displayName}</span>

            {/* Tier badge */}
            <span style={{
              background: isPlatGold ? tierConfig.bg : tierConfig.bg,
              color: isPlatGold ? tierConfig.color : tierConfig.color,
              border: `1px solid ${tierConfig.border}`,
              borderRadius:20, padding:"3px 10px",
              fontSize:11, fontWeight:800,
              boxShadow: is_premium ? `0 2px 6px ${tierConfig.glow}` : "none",
            }}>
              {tierConfig.icon} {tierConfig.label}
            </span>

            {is_premium && <FaCrown style={{ color:tierConfig.border, fontSize:13 }} />}
          </div>

          {designation && <div style={{ fontSize:12, color:"#6b7280", fontWeight:600, marginBottom:2 }}>{designation}</div>}
          {company_name && <div style={{ fontSize:12, color:"#9ca3af", marginBottom:6 }}>🏢 {company_name}</div>}

          {/* Stats row */}
          <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap", marginBottom:8 }}>
            {avg_rating > 0 && (
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <Stars value={avg_rating} />
                <span style={{ fontSize:12, fontWeight:700, color:"#d68910" }}>{avg_rating}</span>
                <span style={{ fontSize:11, color:"#9ca3af" }}>({review_count})</span>
              </div>
            )}
            <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#6b7280" }}>
              <FaHome style={{ color:"#e74c3c", fontSize:11 }} />
              <span>{listings_count||0} listings</span>
            </div>
            {deals_count > 0 && (
              <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#6b7280" }}>
                <FaHandshake style={{ color:"#27ae60", fontSize:11 }} />
                <span>{deals_count} deals</span>
              </div>
            )}
            {city && (
              <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#6b7280" }}>
                <FaMapMarkerAlt style={{ color:"#e74c3c", fontSize:10 }} />
                <span>{city}</span>
              </div>
            )}
          </div>

          <div style={{ fontSize:12, color:"#9ca3af" }}>{email}</div>
        </div>

        {/* Right: CTA */}
        <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", alignItems:"flex-end", justifyContent:"center", gap:8, flexShrink:0 }}>
          {(phone||mobile) && (
            <a href={`tel:${phone||mobile}`} onClick={e=>e.stopPropagation()} style={{ display:"flex", alignItems:"center", gap:6, background:"#f3f4f6", border:"1px solid #e5e7eb", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:600, color:"#374151", textDecoration:"none" }}>
              <FaPhone style={{ fontSize:10, color:"#e74c3c" }} /> Call
            </a>
          )}
          <div style={{ display:"flex", alignItems:"center", gap:6, background:"#e74c3c", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, color:"#fff" }}>
            View Profile →
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AgentListItem;