import React, { useState } from "react";
import {
  FaWifi, FaParking, FaSwimmingPool, FaDumbbell, FaShieldAlt,
  FaBolt, FaFire, FaTint, FaLeaf, FaWarehouse, FaCamera,
  FaBell, FaSnowflake, FaHotTub, FaTree, FaElevator,
} from "react-icons/fa";
import { MdOutlineSecurity, MdLocalLaundryService, MdBalcony } from "react-icons/md";

/* ── Map amenity keys from API to icon + label ── */
const AMENITY_MAP = {
  wifi:            { icon: <FaWifi />,              label: "WiFi" },
  parking:         { icon: <FaParking />,            label: "Parking" },
  swimming_pool:   { icon: <FaSwimmingPool />,       label: "Swimming Pool" },
  gym:             { icon: <FaDumbbell />,            label: "Gym" },
  security:        { icon: <FaShieldAlt />,           label: "Security" },
  power_backup:    { icon: <FaBolt />,                label: "Power Backup" },
  gas:             { icon: <FaFire />,                label: "Gas" },
  water_supply:    { icon: <FaTint />,                label: "Water Supply" },
  garden:          { icon: <FaTree />,                label: "Garden" },
  warehouse:       { icon: <FaWarehouse />,           label: "Warehouse" },
  cctv:            { icon: <FaCamera />,              label: "CCTV" },
  intercom:        { icon: <FaBell />,                label: "Intercom" },
  air_conditioning:{ icon: <FaSnowflake />,           label: "AC" },
  jacuzzi:         { icon: <FaHotTub />,              label: "Jacuzzi" },
  green_area:      { icon: <FaLeaf />,                label: "Green Area" },
  lift:            { icon: <FaElevator />,            label: "Lift / Elevator" },
  laundry:         { icon: <MdLocalLaundryService />, label: "Laundry" },
  balcony:         { icon: <MdBalcony />,             label: "Balcony" },
  cctv_surveillance:{ icon: <MdOutlineSecurity />,   label: "Surveillance" },
};

/* ── Single amenity chip ── */
const AmenityChip = ({ icon, label }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "7px",
        padding: "14px 10px",
        border: hov ? "1.5px solid var(--r)" : "1px solid #f3f4f6",
        borderRadius: "12px",
        background: hov ? "var(--r06)" : "#fff",
        transition: "all 0.18s",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        cursor: "default",
        minWidth: "80px",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "20px", color: hov ? "var(--r)" : "#374151" }}>
        {icon}
      </span>
      <span style={{
        fontSize: "10px",
        fontWeight: "600",
        color: hov ? "var(--r)" : "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        lineHeight: 1.3,
      }}>
        {label}
      </span>
    </div>
  );
};

/* ── Main ── */
const MoreDetails = ({ data }) => {
  if (!data) return null;

  /* Build list of present amenities from property data */
  const present = Object.entries(AMENITY_MAP).filter(([key]) => {
    const val = data[key];
    return val && val !== "0" && val !== 0 && val !== "no" && val !== false;
  });

  /* Also support a raw amenities array from API */
  const rawAmenities = Array.isArray(data.amenities) ? data.amenities : [];

  /* Merge both sources */
  const allChips = [
    ...present.map(([, v]) => v),
    ...rawAmenities
      .filter(a => !present.some(([k]) => k === a))
      .map(a => AMENITY_MAP[a] || { icon: <FaLeaf />, label: a }),
  ];

  if (allChips.length === 0) return null;

  return (
    <div style={{
      borderTop: "2px solid #e5e7eb",
      paddingTop: "2rem",
      marginBottom: "2rem",
    }}>
      {/* Section Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "18px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            width: "4px", height: "22px",
            background: "var(--r)",
            borderRadius: "2px",
            display: "inline-block",
          }} />
          <span style={{
            fontSize: "clamp(18px,2.5vw,22px)",
            fontWeight: "700",
            color: "var(--d)",
          }}>
            Amenities & Features
          </span>
        </div>
        <span style={{
          fontSize: "12px",
          color: "#9ca3af",
          fontWeight: "600",
        }}>
          {allChips.length} available
        </span>
      </div>

      {/* Grid of chips */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
      }}>
        {allChips.map((chip, i) => (
          <AmenityChip key={i} icon={chip.icon} label={chip.label} />
        ))}
      </div>
    </div>
  );
};

export default MoreDetails;