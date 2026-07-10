import React from "react";
import { FaPhone, FaEnvelope, FaTag, FaCommentDots } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const UserHead = ({ setOpen, property, onAskAiClick }) => {
  const {
    posted_date,
    property_code,
    phone,
  } = property || {};

  const user = useSelector((state) => state.user);
  const isLoggedIn = !!user?.data;

  const handleContactClick = () => {
    if (!isLoggedIn) {
      toast.error("Please login to contact the owner.");
      return;
    }
    setOpen(true);
  };

  return (
    <div className="sp-userhead">
      <style>{`
        .sp-userhead {
          background: #fff;
          border-bottom: 1px solid #e8e8e8;
          box-shadow: 0 1px 0 #e8e8e8, 0 2px 8px rgba(0,0,0,0.04);
        }
        .sp-userhead-inner {
          max-width: 1320px;
          margin: 0 auto;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .sp-userhead-row1 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .sp-userhead-actions {
          display: flex;
          align-items: stretch;
          gap: 10px;
        }
        .sp-userhead-actions a,
        .sp-userhead-actions button {
          flex: 1;
        }

        @media (min-width: 768px) {
          .sp-userhead {
            position: sticky;
            top: 65px;
            z-index: 100;
          }
          .sp-userhead-inner {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            height: 56px;
            padding: 0 24px;
            gap: 20px;
          }
          .sp-userhead-row1 { flex: 0 0 auto; }
          .sp-userhead-actions { flex: 0 0 auto; }
          .sp-userhead-actions a,
          .sp-userhead-actions button { flex: 0 0 auto; }
        }
      `}</style>

      <div className="sp-userhead-inner">

        {/* Row 1: posted date + property code */}
        <div className="sp-userhead-row1">
          {posted_date && (
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: "600" }}>
                Posted On
              </div>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#111" }}>{posted_date}</span>
            </div>
          )}

          {property_code && (
            <div style={{
              display: "flex", alignItems: "center", gap: "5px",
              background: "#f5f5f5", border: "1px solid #e5e7eb",
              borderRadius: "6px", padding: "5px 11px",
              fontSize: "11px", fontWeight: "700", color: "#888",
              whiteSpace: "nowrap",
            }}>
              <FaTag style={{ fontSize: "9px", color: "#e74c3c" }} />
              #{property_code}
            </div>
          )}
        </div>

        {/* Row 2: actions */}
        <div className="sp-userhead-actions">
          {phone && (
            <a href={`tel:${phone}`} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
              padding: "0 18px", height: "40px",
              background: "#f5f5f5", border: "1px solid #e5e7eb",
              borderRadius: "6px", fontSize: "13px", fontWeight: "600",
              color: "#374151", textDecoration: "none", whiteSpace: "nowrap",
            }}>
              <FaPhone style={{ fontSize: "11px", color: "#e74c3c" }} />
              Call Agent
            </a>
          )}
          <button onClick={onAskAiClick} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
            padding: "0 16px", height: "40px",
            background: "#fff", color: "#374151", border: "1.5px solid #e74c3c",
            borderRadius: "6px", fontSize: "13px", fontWeight: "700",
            cursor: "pointer", whiteSpace: "nowrap",
          }}>
            <FaCommentDots style={{ fontSize: "12px", color: "#e74c3c" }} />
            Ask AI
          </button>
          <button onClick={handleContactClick} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
            padding: "0 18px", height: "40px",
            background: "#27ae60", color: "#fff", border: "none",
            borderRadius: "6px", fontSize: "13px", fontWeight: "700",
            cursor: "pointer", whiteSpace: "nowrap",
          }}>
            <FaEnvelope style={{ fontSize: "11px" }} />
            Contact Owner
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserHead;