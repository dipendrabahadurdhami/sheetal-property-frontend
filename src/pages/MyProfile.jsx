import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUserInfo } from "../features/slices/userInformation";
import { removeAllFavorites } from "../features/slices/favourites";
import DashBoard from "../components/MyProfile/DashBoard";
import SocialMedia from "../components/MyProfile/Form/SocialMedia";
import MyProperties from "../components/MyProfile/MyProperties";
import MyPlan from "../components/MyProfile/MyPlan";
import AgentNotifications from "../components/MyProfile/AgentNotifications";
import Properties from "../components/MyProfile/Properties";
import {
  IoPersonOutline, IoShareSocialOutline, IoHomeOutline,
  IoAddOutline, IoNotificationsOutline, IoHeartOutline,
  IoMenuOutline, IoCloseOutline, IoLogOutOutline,
} from "react-icons/io5";
import { FaCrown } from "react-icons/fa";
import PostProperty from "./PostProperty";

const TABS = [
  { id: "profile",       label: "Profile",        icon: IoPersonOutline,        agentOnly: false },
  { id: "social",        label: "Social Links",   icon: IoShareSocialOutline,   agentOnly: false },
  { id: "my-properties", label: "My Properties",  icon: IoHomeOutline,          agentOnly: true  },
  { id: "post-property", label: "Post Property",  icon: IoAddOutline,           agentOnly: true  },
  { id: "favourites",    label: "Favourites",     icon: IoHeartOutline,         agentOnly: false },
  { id: "notifications", label: "Notifications",  icon: IoNotificationsOutline, agentOnly: true  },
  { id: "my-plan",       label: "My Plan",        icon: FaCrown,                agentOnly: true  },
];

const MyProfile = () => {
  const [params, setParams]     = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const user                    = useSelector((s) => s.user);
  const dispatch                = useDispatch();
  const navigate                = useNavigate();
  const isAgent                 = !!(user?.data?.subscription_tier?.startsWith("Agent") || user?.data?.is_agent);
  const section                 = params.get("section") || "profile";

  useEffect(() => {
    if (!user?.data && !localStorage.getItem("sheetal_token")) {
      navigate("/?login=1");
    }
  }, [user, navigate]);

  const visibleTabs = TABS.filter(t => !t.agentOnly || isAgent);
  const activeTab   = visibleTabs.find(t => t.id === section) || visibleTabs[0];

  const setSection = (id) => {
    setParams({ section: id });
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.removeItem("sheetal_token");
    dispatch(removeUserInfo());
    dispatch(removeAllFavorites());
    navigate("/", { replace: true });
  };

  const renderContent = () => {
    switch (section) {
      case "profile":       return <DashBoard />;
      case "social":        return <SocialMedia data={user?.data} />;
      case "my-properties": return <MyProperties />;
      case "post-property": return <PostProperty />;
      case "favourites":    return <Properties />;
      case "notifications": return <AgentNotifications />;
      case "my-plan":       return <MyPlan />;
      default:              return <DashBoard />;
    }
  };

  const { user_name, first_name, last_name, photo } = user?.data || {};
  const displayName = first_name && last_name ? `${first_name} ${last_name}` : user_name || "My Account";

  return (
    <div style={{ minHeight: "100vh", background: "#f5f6f8", fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        .mp-layout {
          max-width: 1160px;
          margin: 0 auto;
          padding: 72px 8px 40px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        .mp-sidebar {
          display: none;
          width: 220px;
          flex-shrink: 0;
        }
        .mp-main { flex: 1; min-width: 0; }
        .mp-mobile-nav { display: block; }

        @media (min-width: 768px) {
          .mp-layout { padding: 80px 20px 60px; }
          .mp-sidebar { display: block; }
          .mp-mobile-nav { display: none; }
        }
        @media (min-width: 1024px) {
          .mp-layout { padding: 90px 32px 60px; gap: 24px; }
          .mp-sidebar { width: 240px; }
        }
      `}</style>

      <div className="mp-layout">

        {/* ── Desktop sidebar ── */}
        <div className="mp-sidebar">
          {/* User avatar + name */}
          <div style={{ background: "#fff", border: "1px solid #dde3ea", borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ background: "linear-gradient(135deg,#e74c3c,#c0392b)", padding: "20px 16px", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.4)", overflow: "hidden", margin: "0 auto 10px", background: "#fff" }}>
                {photo
                  ? <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fee2e2" }}>
                      <IoPersonOutline size={28} color="#e74c3c" />
                    </div>
                }
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{displayName}</div>
              {isAgent && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>Agent</div>}
            </div>
            <div>
              {visibleTabs.map((tab) => {
                const Icon   = tab.icon;
                const active = tab.id === section;
                return (
                  <button key={tab.id} onClick={() => setSection(tab.id)} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "11px 16px", background: active ? "#fef2f2" : "none",
                    border: "none", borderLeft: `3px solid ${active ? "#e74c3c" : "transparent"}`,
                    borderBottom: "1px solid #f5f6f8", cursor: "pointer", textAlign: "left",
                    transition: "background 0.15s",
                  }}>
                    <Icon style={{ fontSize: 15, color: active ? "#e74c3c" : "#9ca3af", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#e74c3c" : "#374151" }}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
              <button onClick={handleLogout} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "11px 16px", background: "none", border: "none",
                borderLeft: "3px solid transparent", borderTop: "1px solid #f0f3f7",
                cursor: "pointer", color: "#e74c3c",
              }}>
                <IoLogOutOutline style={{ fontSize: 15 }} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="mp-main">

          {/* Mobile nav dropdown */}
          <div className="mp-mobile-nav" style={{ background: "#fff", border: "1px solid #dde3ea", borderRadius: 8, marginBottom: 12, overflow: "hidden" }}>
            <button onClick={() => setMenuOpen(v => !v)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "12px 14px", background: "none", border: "none", cursor: "pointer",
            }}>
              {React.createElement(activeTab.icon, { style: { fontSize: 16, color: "#e74c3c", flexShrink: 0 } })}
              <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#2c3e50", textAlign: "left" }}>
                {activeTab.label}
              </span>
              {menuOpen
                ? <IoCloseOutline style={{ fontSize: 18, color: "#9ca3af" }} />
                : <IoMenuOutline  style={{ fontSize: 18, color: "#9ca3af" }} />
              }
            </button>
            {menuOpen && (
              <div style={{ borderTop: "1px solid #f0f3f7" }}>
                {visibleTabs.filter(t => t.id !== section).map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id} onClick={() => setSection(tab.id)} style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10,
                      padding: "11px 14px", background: "none", border: "none",
                      borderBottom: "1px solid #f5f6f8", cursor: "pointer",
                    }}>
                      <Icon style={{ fontSize: 15, color: "#9ca3af" }} />
                      <span style={{ fontSize: 13, color: "#374151" }}>{tab.label}</span>
                    </button>
                  );
                })}
                <button onClick={handleLogout} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "11px 14px", background: "none", border: "none", cursor: "pointer",
                }}>
                  <IoLogOutOutline style={{ fontSize: 15, color: "#e74c3c" }} />
                  <span style={{ fontSize: 13, color: "#e74c3c", fontWeight: 600 }}>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Section content */}
          <div style={{ background: "#fff", border: "1px solid #dde3ea", borderRadius: 10, padding: "12px 10px" }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;