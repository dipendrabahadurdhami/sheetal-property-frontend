import React from "react";
import { BiUserCircle } from "react-icons/bi";
import { FaPhone, FaEnvelope, FaTag } from "react-icons/fa";

// FIX #12: Fallback phone number extracted to a constant.
// Previously the number was hardcoded directly in the href, meaning even if the
// property had its own contact number it would be ignored.
const FALLBACK_PHONE = "+9779801000434";

const UserHead = ({ setOpen, property }) => {
  const {
    image_of_property_owner,
    posted_by,
    posted_date,
    property_code,
    // FIX #12: read phone from property if provided
    phone,
  } = property || {};

  const contactPhone = phone || FALLBACK_PHONE;

  return (
    <div style={{
      background: "#fff",
      borderBottom: "1px solid #e8e8e8",
      position: "sticky",
      top: "65px",   // sit below the site navbar
      zIndex: 100,
      boxShadow: "0 1px 0 #e8e8e8, 0 2px 8px rgba(0,0,0,0.04)",
    }}>
      <div
        className="container mx-auto"
        style={{
          padding: "0 20px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* ── Left: Agent ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
          {/* Avatar */}
          <div style={{
            width: "30px", height: "30px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "1.5px solid #e5e7eb",
            flexShrink: 0,
            background: "#f5f5f5",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {image_of_property_owner ? (
              <img src={image_of_property_owner} alt={posted_by}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <BiUserCircle style={{ fontSize: "17px", color: "#bbb" }} />
            )}
          </div>

          {/* Name + date */}
          <div style={{ minWidth: 0, lineHeight: 1.3 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "5px", flexWrap: "wrap" }}>
              <span style={{
                fontSize: "10px", color: "#9ca3af",
                letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: "600",
              }}>
                Listed by
              </span>
              <span style={{
                fontSize: "13px", fontWeight: "700",
                color: "#111", letterSpacing: "-0.01em",
              }}>
                {posted_by || "Sheetal Real Estate"}
              </span>
            </div>
            {posted_date && (
              <span style={{ fontSize: "11px", color: "#b0b0b0" }}>
                {posted_date}
              </span>
            )}
          </div>

          {/* Property code */}
          {property_code && (
            <div className="hidden sm:flex" style={{
              alignItems: "center", gap: "4px",
              background: "#f5f5f5",
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
              padding: "3px 9px",
              fontSize: "10px", fontWeight: "700",
              color: "#888",
              letterSpacing: "0.06em",
              flexShrink: 0,
            }}>
              <FaTag style={{ fontSize: "8px", color: "var(--r, #e74c3c)" }} />
              #{property_code}
            </div>
          )}
        </div>

        {/* ── Right: CTAs ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "7px", flexShrink: 0 }}>
          {/* Call — desktop only; FIX #12: uses property phone or fallback */}
          <a
            href={`tel:${contactPhone}`}
            className="hidden sm:flex"
            style={{
              alignItems: "center", gap: "6px",
              padding: "0 13px", height: "32px",
              background: "#f5f5f5",
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
              fontSize: "12px", fontWeight: "600",
              color: "#374151",
              textDecoration: "none",
              transition: "background 0.15s, border-color 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#eee"; e.currentTarget.style.borderColor = "#d1d5db"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f5f5f5"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
          >
            <FaPhone style={{ fontSize: "10px", color: "var(--r, #e74c3c)" }} />
            Call Agent
          </a>

          {/* Contact Owner */}
          <button
            onClick={() => setOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "0 15px", height: "32px",
              background: "var(--r, #e74c3c)",
              color: "#fff", border: "none",
              borderRadius: "4px",
              fontSize: "12px", fontWeight: "700",
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "opacity 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <FaEnvelope style={{ fontSize: "10px" }} />
            Contact Owner
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserHead;