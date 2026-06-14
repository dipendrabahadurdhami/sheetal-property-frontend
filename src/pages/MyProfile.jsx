import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUserInfo } from "../features/slices/userInformation";
import { removeAllFavorites } from "../features/slices/favourites";
import DashBoard from "../components/MyProfile/DashBoard";
import SocialMedia from "../components/MyProfile/Form/SocialMedia";
import MyProperties from "../components/MyProfile/MyProperties";
import MyPlan from "../components/MyProfile/MyPlan";
import PostProperty from "./PostProperty";
import PersonalInfo from "../components/findAgent/SingleAgent/PersonalInfo";
import AgentNotifications from "../components/MyProfile/AgentNotifications";
import Properties from "../components/MyProfile/Properties";
import {
  IoPersonOutline, IoShareSocialOutline, IoHomeOutline,
  IoAddOutline, IoNotificationsOutline, IoHeartOutline,
  IoMenuOutline, IoCloseOutline,
} from "react-icons/io5";
import { FaCrown } from "react-icons/fa";

const TABS = [
  { id: "profile",       label: "Profile",       icon: IoPersonOutline,        agentOnly: false },
  { id: "social",        label: "Social Links",  icon: IoShareSocialOutline,   agentOnly: false },
  { id: "my-properties", label: "My Properties", icon: IoHomeOutline,          agentOnly: true  },
  
  { id: "favourites",    label: "Favourites",    icon: IoHeartOutline,         agentOnly: false },
  { id: "notifications", label: "Notifications", icon: IoNotificationsOutline, agentOnly: true  },
  { id: "my-plan",       label: "My Plan",       icon: FaCrown,                agentOnly: true  },
];

const MyProfile = () => {
  const [params, setParams]     = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const user                    = useSelector((s) => s.user);
  const dispatch                = useDispatch();
  const navigate                = useNavigate();
  const isAgent                 = !!user?.data?.is_agent;
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
      case "favourites":    return <Properties />;
      case "notifications": return <AgentNotifications />;
      case "my-plan":       return <MyPlan />;
      default:              return <DashBoard />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f6f8" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "90px 16px 60px" }}>

        <PersonalInfo data={user?.data} />

        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

          {/* Desktop sidebar */}
          <div
            className="profile-sidenav"
            style={{
              width: 220, flexShrink: 0,
              background: "#fff", border: "1px solid #dde3ea",
              borderRadius: 12, overflow: "hidden",
              display: "none",
            }}
          >
            {visibleTabs.map((tab) => {
              const Icon   = tab.icon;
              const active = tab.id === section;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSection(tab.id)}
                  style={{
                    width: "100%", display: "flex",
                    alignItems: "center", gap: 10,
                    padding: "13px 16px",
                    background: active ? "#fef2f2" : "none",
                    border: "none",
                    borderLeft: `3px solid ${active ? "#e74c3c" : "transparent"}`,
                    borderBottom: "1px solid #f5f6f8",
                    cursor: "pointer", textAlign: "left",
                    transition: "background 0.15s",
                  }}
                >
                  <Icon style={{ fontSize: 16, color: active ? "#e74c3c" : "#9ca3af", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#e74c3c" : "#374151" }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              style={{
                width: "100%", display: "flex",
                alignItems: "center", gap: 10,
                padding: "13px 16px", background: "none",
                border: "none", borderLeft: "3px solid transparent",
                borderTop: "1px solid #f0f3f7",
                cursor: "pointer", color: "#e74c3c",
                fontSize: 13, fontWeight: 500,
              }}
            >
              <span style={{ fontSize: 16 }}>↩</span> Logout
            </button>
          </div>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Mobile tab selector */}
            <div style={{
              background: "#fff", border: "1px solid #dde3ea",
              borderRadius: 10, marginBottom: 16, overflow: "hidden",
            }}>
              <button
                onClick={() => setMenuOpen(v => !v)}
                style={{
                  width: "100%", display: "flex",
                  alignItems: "center", gap: 10,
                  padding: "13px 16px", background: "none",
                  border: "none", cursor: "pointer",
                }}
              >
                {React.createElement(activeTab.icon, { style: { fontSize: 16, color: "#e74c3c" } })}
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
                      <button
                        key={tab.id}
                        onClick={() => setSection(tab.id)}
                        style={{
                          width: "100%", display: "flex",
                          alignItems: "center", gap: 10,
                          padding: "12px 16px", background: "none",
                          border: "none", borderBottom: "1px solid #f0f3f7",
                          cursor: "pointer",
                        }}
                      >
                        <Icon style={{ fontSize: 15, color: "#9ca3af" }} />
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%", display: "flex",
                      alignItems: "center", gap: 10,
                      padding: "12px 16px", background: "none",
                      border: "none", cursor: "pointer",
                      color: "#e74c3c",
                    }}
                  >
                    <span style={{ fontSize: 15 }}>↩</span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Section content */}
            <div style={{
              background: "#fff", border: "1px solid #dde3ea",
              borderRadius: 12, padding: 24, minHeight: 400,
            }}>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .profile-sidenav { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default MyProfile;