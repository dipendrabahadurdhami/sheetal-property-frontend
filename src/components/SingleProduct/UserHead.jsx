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
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sp-userhead-row1 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .sp-userhead-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        /* Shared button look */
        .sp-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 40px;
          border-radius: 6px;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-decoration: none;
          cursor: pointer;
          font-size: 12px;
          padding: 0 6px;
        }
        .sp-btn-icon { font-size: 11px; flex-shrink: 0; }

        /* Call Agent hidden on mobile, shown from desktop breakpoint */
        .sp-btn-call { display: none; }

        .sp-btn-call {
          background: #f5f5f5;
          border: 1px solid #e5e7eb;
          color: #374151;
        }
        .sp-btn-ask {
          background: #fff;
          border: 1.5px solid #e74c3c;
          color: #374151;
        }
        .sp-btn-contact {
          background: #27ae60;
          border: none;
          color: #fff;
        }

        /* Full labels used everywhere now that mobile only shows 2 buttons */

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
          .sp-userhead-actions {
            display: flex;
            align-items: stretch;
            gap: 10px;
            flex: 0 0 auto;
          }
          .sp-btn-call { display: flex; }
          .sp-btn {
            flex: 0 0 auto;
            font-size: 13px;
            padding: 0 18px;
          }
          .sp-btn-ask { padding: 0 16px; }
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
            <a href={`tel:${phone}`} className="sp-btn sp-btn-call">
              <FaPhone className="sp-btn-icon" style={{ color: "#e74c3c" }} />
              <span>Call Agent</span>
            </a>
          )}
          <button onClick={onAskAiClick} className="sp-btn sp-btn-ask">
            <FaCommentDots className="sp-btn-icon" style={{ color: "#e74c3c" }} />
            <span>Ask AI</span>
          </button>
          <button onClick={handleContactClick} className="sp-btn sp-btn-contact">
            <FaEnvelope className="sp-btn-icon" />
            <span>Contact Owner</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserHead;