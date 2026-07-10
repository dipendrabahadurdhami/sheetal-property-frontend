import React from "react";
import { BiUserCircle } from "react-icons/bi";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaGlobe,
  FaBriefcase,
  FaStar,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { MdVerified } from "react-icons/md";

// Some agent profiles have the literal text "null"/"undefined"/"N/A" saved
// instead of an actual empty value — treat those as empty too, everywhere.
const isValid = (v) => {
  if (v === null || v === undefined) return false;
  const s = String(v).trim().toLowerCase();
  return s !== "" && s !== "null" && s !== "undefined" && s !== "n/a";
};

/**
 * Shows the profile of whoever actually posted the listing — pulled live
 * from their own agent account (PropertyResource -> agent), not re-typed
 * per property. If no agent data is available (e.g. legacy listing with
 * no linked user), the card renders nothing.
 */
const AgentCard = ({ agent }) => {
  if (!agent) return null;

  const name =
    isValid(agent.first_name) && isValid(agent.last_name)
      ? `${agent.first_name} ${agent.last_name}`
      : (isValid(agent.first_name) && agent.first_name) || (isValid(agent.user_name) && agent.user_name) || "Sheetal Real Estate";

  const socials = [
    { label: "Facebook", href: agent.facebook_url, bg: "#1877F2", icon: <FaFacebook /> },
    { label: "Instagram", href: agent.instagram_url, bg: "#E1306C", icon: <FaInstagram /> },
    { label: "TikTok", href: agent.tiktok_url, bg: "#010101", icon: <SiTiktok /> },
    { label: "YouTube", href: agent.youtube_url, bg: "#FF0000", icon: <FaYoutube /> },
    { label: "Twitter/X", href: agent.twitter_url, bg: "#1DA1F2", icon: <FaTwitter /> },
    { label: "LinkedIn", href: agent.linkedin_url, bg: "#0077B5", icon: <FaLinkedin /> },
  ].filter((s) => isValid(s.href));

  const rows = [
    { icon: FaPhone, label: "Phone", value: agent.phone, href: isValid(agent.phone) ? `tel:${agent.phone}` : null },
    { icon: FaWhatsapp, label: "WhatsApp", value: agent.whatsapp, href: isValid(agent.whatsapp) ? `https://wa.me/${agent.whatsapp.replace(/\D/g, "")}` : null },
    { icon: FaEnvelope, label: "Email", value: agent.email, href: isValid(agent.email) ? `mailto:${agent.email}` : null },
    { icon: FaBriefcase, label: "Company", value: agent.company_name },
    { icon: FaGlobe, label: "Website", value: isValid(agent.website_url) ? agent.website_url : (isValid(agent.website) ? agent.website : null), href: isValid(agent.website_url) ? agent.website_url : (isValid(agent.website) ? agent.website : null) },
  ].filter((r) => isValid(r.value));

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <a href={agent.id ? `/agent/${agent.id}` : undefined} style={{ flexShrink: 0 }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid #fecaca",
              background: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isValid(agent.photo) ? (
              <img
                src={agent.photo}
                alt={name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <BiUserCircle style={{ fontSize: "30px", color: "#bbb" }} />
            )}
          </div>
        </a>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <a
              href={agent.id ? `/agent/${agent.id}` : undefined}
              style={{ fontSize: "15px", fontWeight: 700, color: "#111", textDecoration: "none" }}
            >
              {name}
            </a>
            {agent.email_verified && (
              <MdVerified title="Verified agent" style={{ color: "#10b981", fontSize: "14px" }} />
            )}
          </div>
          {isValid(agent.designation) && (
            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
              {agent.designation}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px", flexWrap: "wrap" }}>
            {agent.tier && (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#92400e",
                  background: "#fef3c7",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                {agent.tier}
              </span>
            )}
            {!!agent.review_count && (
              <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "12px", color: "#374151" }}>
                <FaStar style={{ color: "#f59e0b", fontSize: "11px" }} />
                {agent.avg_rating} ({agent.review_count})
              </span>
            )}
            {!!agent.listings_count && (
              <span style={{ fontSize: "12px", color: "#6b7280" }}>
                {agent.listings_count} listing{agent.listings_count === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </div>
      </div>

      {rows.length > 0 && (
        <div style={{ padding: "10px 16px" }}>
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "7px 0",
                borderBottom: i < rows.length - 1 ? "1px solid #f5f5f5" : "none",
              }}
            >
              <row.icon style={{ fontSize: "12px", color: "#e74c3c", flexShrink: 0 }} />
              {row.href ? (
                <a
                  href={row.href}
                  target={row.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  style={{ fontSize: "13px", color: "#111", fontWeight: 600, textDecoration: "none" }}
                >
                  {row.value}
                </a>
              ) : (
                <span style={{ fontSize: "13px", color: "#111", fontWeight: 600 }}>{row.value}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {socials.length > 0 && (
        <div
          style={{
            padding: "10px 16px 14px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            borderTop: rows.length > 0 ? "1px solid #f0f0f0" : "none",
          }}
        >
          {socials.map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              title={s.label}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: s.bg,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                textDecoration: "none",
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentCard;