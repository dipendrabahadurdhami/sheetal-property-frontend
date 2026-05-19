import React, { useEffect, useState, useRef } from "react";
import apiClient from "../../utils/apiClient";
import { useNavigate } from "react-router-dom";
import { FaBed, FaBath, FaMapMarkerAlt, FaRulerCombined } from "react-icons/fa";

const PropertyCard = ({ p, onClick }) => {
  const [hovered, setHovered] = useState(false);

  const img = p.feature_image || p.images?.[0];
  const price = p.total_price
    ? `Rs. ${Number(p.total_price).toLocaleString()}`
    : p.rent_per_month
    ? `Rs. ${Number(p.rent_per_month).toLocaleString()}/mo`
    : null;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        border: hovered
          ? "1.5px solid var(--r, #e53935)"
          : "1px solid #e5e7eb",
        background: "#fff",
        transition: "border-color 0.18s, transform 0.18s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}
    >
      {/* Image */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          overflow: "hidden",
          background: "#f3f4f6",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {img ? (
          <img
            src={img}
            alt={p.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.3s",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f9fafb",
            }}
          >
            <FaRulerCombined style={{ color: "#d1d5db", fontSize: "28px" }} />
          </div>
        )}

        {/* Purpose badge */}
        {p.purpose && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "var(--r, #e53935)",
              color: "#fff",
              fontSize: "9px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "3px 10px",
              borderRadius: "20px",
            }}
          >
            For {p.purpose?.name || p.purpose}
          </div>
        )}

        {/* Category badge */}
        {p.propertycategory && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "rgba(0,0,0,0.52)",
              color: "#fff",
              fontSize: "9px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "3px 9px",
              borderRadius: "20px",
            }}
          >
            {p.propertycategory}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "13px 14px 14px", display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
        {price && (
          <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--r, #e53935)" }}>
            {price}
          </div>
        )}

        <div
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "var(--d, #111827)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: "1.4",
          }}
        >
          {p.name}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "11px",
            color: "#6b7280",
          }}
        >
          <FaMapMarkerAlt style={{ color: "var(--r, #e53935)", fontSize: "10px", flexShrink: 0 }} />
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {p.property_location}
          </span>
        </div>

        {/* Stats row */}
        {(p.bedrooms > 0 || p.bathrooms > 0 || p.land_area_in_anna_lal || p.land_area_in_sqft_lal) && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              fontSize: "11px",
              color: "#6b7280",
              borderTop: "1px solid #f3f4f6",
              paddingTop: "9px",
              marginTop: "4px",
              flexWrap: "wrap",
            }}
          >
            {p.bedrooms > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                <FaBed style={{ color: "var(--r, #e53935)", fontSize: "11px" }} />
                {p.bedrooms} Bed
              </span>
            )}
            {p.bathrooms > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                <FaBath style={{ color: "var(--r, #e53935)", fontSize: "11px" }} />
                {p.bathrooms} Bath
              </span>
            )}
            {p.land_area_in_anna_lal > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                <FaRulerCombined style={{ color: "var(--r, #e53935)", fontSize: "10px" }} />
                {p.land_area_in_anna_lal} Anna
              </span>
            )}
            {!p.land_area_in_anna_lal && p.land_area_in_sqft_lal > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                <FaRulerCombined style={{ color: "var(--r, #e53935)", fontSize: "10px" }} />
                {p.land_area_in_sqft_lal} Sqft
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ══ MAIN ══ */
const RelatedProperties = ({ property }) => {
  const [related, setRelated] = useState([]);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!property?.id) return;
    fetchRelated();
    // eslint-disable-next-line
  }, [property?.id]);

  const fetchRelated = async () => {
    try {
      const res = await apiClient.get(
        `/all-properties?location=${property?.property_location || ""}&limit=7`
      );
      if (res.status === 200) {
        const all = res?.data?.data || [];
        setRelated(all.filter((p) => p.id !== property.id).slice(0, 6));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!related.length) return null;

  return (
    <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: "2rem", marginBottom: "2rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          
          <span className="text-xl sm:text-2xl font-bold">Related Properties</span>
        </div>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>
          {related.length} listing{related.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/*
        Responsive grid:
        - ≥900px  → 3 columns
        - ≥560px  → 2 columns
        - <560px  → horizontal scroll (1 card visible, snaps)
      */}
      <style>{`
        .rp-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        @media (max-width: 899px) {
          .rp-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 559px) {
          .rp-grid {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            gap: 12px;
            padding-bottom: 8px;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }
          .rp-grid::-webkit-scrollbar { height: 4px; }
          .rp-grid::-webkit-scrollbar-track { background: #f3f4f6; border-radius: 4px; }
          .rp-grid::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
          .rp-card {
            min-width: 240px;
            max-width: 240px;
            scroll-snap-align: start;
          }
        }
      `}</style>

      <div className="rp-grid" ref={scrollRef}>
        {related.map((p) => (
          <div key={p.id} className="rp-card">
            <PropertyCard p={p} onClick={() => navigate(`/property/${p.id}`)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProperties;