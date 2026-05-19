import React from "react";
import ProductMap from "./Details/ProductMap";
import {
  FaBed, FaBath, FaUtensils, FaLayerGroup, FaCar, FaWarehouse,
  FaRulerCombined, FaRoad, FaCompass, FaWater,
  FaShieldAlt, FaColumns, FaHome, FaCalendarAlt,
  FaChartArea, FaTachometerAlt, FaMountain, FaWindowMaximize
} from "react-icons/fa";
import { MdMeetingRoom, MdOutlineWaterDrop, MdStraighten } from "react-icons/md";

/* ── single stat tile ── */
const Tile = ({ icon, label, value }) => {
  if (!value || value === "0" || value === 0) return null;
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: "6px",
      padding: "14px 10px",
      border: "1px solid var(--border, #f3f4f6)",
      borderRadius: "10px",
      background: "var(--white, #fff)",
      minWidth: "90px",
      textAlign: "center",
      transition: "border-color 0.15s",
    }}>
      <div style={{ color: "var(--r)", fontSize: "20px" }}>{icon}</div>
      <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--d)" }}>{value}</div>
      <div style={{
        fontSize: "10px",
        color: "var(--gray, #9ca3af)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}>
        {label}
      </div>
    </div>
  );
};

/* ── section wrapper ── */
const Section = ({ title, children }) => (
  <div style={{ marginBottom: "24px" }}>
    <div style={{
      fontSize: "15px", fontWeight: "700",
      color: "var(--d)",
      borderBottom: "2px solid var(--r06)",
      paddingBottom: "8px", marginBottom: "14px",
      display: "flex", alignItems: "center", gap: "8px",
    }}>
      
      {title}
    </div>
    {children}
  </div>
);

/* ── icon tile grid ── */
const TileGrid = ({ tiles }) => {
  const visible = tiles.filter(t => t.value && t.value !== "0" && t.value !== 0);
  if (!visible.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {visible.map((t, i) => (
        <Tile key={i} icon={t.icon} label={t.label} value={t.value} />
      ))}
    </div>
  );
};

/* ── key-value row ── */
const Row = ({ label, value }) => {
  if (!value || value === "0" || value === 0) return null;
  return (
    <li style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 0",
      borderBottom: "1px solid var(--r06)",
      fontSize: "13px",
    }}>
      <span style={{ color: "var(--gray, #6b7280)" }}>{label}</span>
      <span style={{ fontWeight: "600", color: "var(--d)" }}>{value}</span>
    </li>
  );
};

/* ══ MAIN ══ */
const Details = ({ data, hideMap = false }) => {
  if (!data) return null;

  const {
    property_code, propertycategory,
    district, town, tol, ward_no, zone,
    anna_price, sqft_price, rent_per_month, advance, selling_price,
    bedrooms, bathrooms, kitchens, floors, parking, garage,
    living_room, shutters, room_per_floor, no_of_pillars, size_of_pillars,
    boundry, completion_year, availability_from, furnished_status,
    land_area_in_ropani_lal, land_area_in_anna_lal, land_area_in_sqft_lal,
    land_area_in_katha_lal, land_area_in_dhur_lal, land_area_in_bigha_lal,
    land_area_in_meters_lal,
    land_area_in_ropani_mes, land_area_in_sqft_mes, land_area_in_meters_mes,
    geometry_of_land, land_perimeter, elevation, mohoda_facing_the_land,
    main_road_width, side_road_width, road_wide_facing_the_land, status_of_road,
    source_of_waters, capacity_of_water_tank,
    finance_bank_name, loan_amount, class_type,
    latitude, longitude,
    company_name, company_address, company_phone,
  } = data;

  const category = (propertycategory || "").toLowerCase();
  const isLand = category === "land";

  return (
    <div style={{ paddingTop: "24px" }}>

      {/* ── PROPERTY DETAILS ── */}
      {!isLand && (
        <Section title="Property Details">
          <TileGrid tiles={[
            { icon: <FaBed />,            label: "Bedrooms",    value: bedrooms },
            { icon: <FaBath />,           label: "Bathrooms",   value: bathrooms },
            { icon: <FaUtensils />,       label: "Kitchens",    value: kitchens },
            { icon: <FaLayerGroup />,     label: "Floors",      value: floors },
            { icon: <FaCar />,            label: "Parking",     value: parking },
            { icon: <FaWarehouse />,      label: "Garage",      value: garage },
            { icon: <MdMeetingRoom />,    label: "Living Rm",   value: living_room },
            { icon: <FaWindowMaximize />, label: "Shutters",    value: shutters },
            { icon: <MdMeetingRoom />,    label: "Rm/Floor",    value: room_per_floor },
            { icon: <FaColumns />,        label: "Pillars",     value: no_of_pillars },
            { icon: <FaRulerCombined />,  label: "Pillar Size", value: size_of_pillars },
            { icon: <FaShieldAlt />,      label: "Boundary",    value: boundry },
            { icon: <FaCalendarAlt />,    label: "Built Year",  value: completion_year },
            { icon: <FaHome />,           label: "Furnished",   value: furnished_status },
          ]} />
        </Section>
      )}

      {/* ── LAND AREA (LAL PURJA) ── */}
      {(land_area_in_ropani_lal || land_area_in_anna_lal || land_area_in_sqft_lal ||
        land_area_in_dhur_lal || land_area_in_bigha_lal || land_area_in_katha_lal) && (
        <Section title="Land Area (Lal Purja)">
          <TileGrid tiles={[
            { icon: <FaRulerCombined />, label: "Ropani", value: land_area_in_ropani_lal },
            { icon: <FaRulerCombined />, label: "Anna",   value: land_area_in_anna_lal },
            { icon: <FaRulerCombined />, label: "Sqft",   value: land_area_in_sqft_lal },
            { icon: <FaRulerCombined />, label: "Katha",  value: land_area_in_katha_lal },
            { icon: <FaRulerCombined />, label: "Dhur",   value: land_area_in_dhur_lal },
            { icon: <FaRulerCombined />, label: "Bigha",  value: land_area_in_bigha_lal },
            { icon: <MdStraighten />,    label: "Sq.Mt.", value: land_area_in_meters_lal },
          ]} />
        </Section>
      )}

      {/* ── LAND AREA (MEASUREMENTS) ── */}
      {(land_area_in_ropani_mes || land_area_in_sqft_mes || land_area_in_meters_mes) && (
        <Section title="Land Area (Measurements)">
          <TileGrid tiles={[
            { icon: <FaRulerCombined />, label: "Ropani", value: land_area_in_ropani_mes },
            { icon: <FaRulerCombined />, label: "Sqft",   value: land_area_in_sqft_mes },
            { icon: <MdStraighten />,    label: "Sq.Mt.", value: land_area_in_meters_mes },
          ]} />
        </Section>
      )}

      {/* ── LAND FEATURES ── */}
      {(geometry_of_land || land_perimeter || elevation || mohoda_facing_the_land) && (
        <Section title="Land Features">
          <TileGrid tiles={[
            { icon: <FaChartArea />,     label: "Shape",     value: geometry_of_land },
            { icon: <FaTachometerAlt />, label: "Perimeter", value: land_perimeter },
            { icon: <FaMountain />,      label: "Elevation", value: elevation },
            { icon: <FaCompass />,       label: "Facing",    value: mohoda_facing_the_land },
          ]} />
        </Section>
      )}

      {/* ── ROAD DETAILS ── */}
      {(main_road_width || side_road_width || road_wide_facing_the_land || status_of_road) && (
        <Section title="Road Details">
          <TileGrid tiles={[
            { icon: <FaRoad />, label: "Main Road",   value: main_road_width ? `${main_road_width} ft` : null },
            { icon: <FaRoad />, label: "Side Road",   value: side_road_width ? `${side_road_width} ft` : null },
            { icon: <FaRoad />, label: "Facing Road", value: road_wide_facing_the_land },
            { icon: <FaRoad />, label: "Road Status", value: status_of_road },
          ]} />
        </Section>
      )}

      {/* ── UTILITIES ── */}
      {(source_of_waters || capacity_of_water_tank) && (
        <Section title="Utilities">
          <TileGrid tiles={[
            { icon: <MdOutlineWaterDrop />, label: "Water Source", value: source_of_waters },
            { icon: <FaWater />,            label: "Water Tank",   value: capacity_of_water_tank },
          ]} />
        </Section>
      )}

      {/* ── PRICING DETAILS ── */}
      {(anna_price || sqft_price || rent_per_month || advance || selling_price) && (
        <Section title="Pricing Details">
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <Row label="Price per Anna" value={anna_price     ? `Rs. ${Number(anna_price).toLocaleString()}`     : null} />
            <Row label="Price per Sqft" value={sqft_price     ? `Rs. ${Number(sqft_price).toLocaleString()}`     : null} />
            <Row label="Rent per Month" value={rent_per_month ? `Rs. ${Number(rent_per_month).toLocaleString()}` : null} />
            <Row label="Advance"        value={advance        ? `Rs. ${Number(advance).toLocaleString()}`        : null} />
            <Row label="Selling Price"  value={selling_price  ? `Rs. ${Number(selling_price).toLocaleString()}`  : null} />
          </ul>
        </Section>
      )}

      {/* ── LOCATION DETAILS ── */}
      {(district || town || tol || ward_no || zone) && (
        <Section title="Location Details">
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <Row label="District" value={district} />
            <Row label="Town"     value={town} />
            <Row label="Tol"      value={tol} />
            <Row label="Ward No." value={ward_no} />
            <Row label="Zone"     value={zone} />
          </ul>
        </Section>
      )}

      {/* ── FINANCE ── */}
      {(finance_bank_name || loan_amount || class_type) && (
        <Section title="Finance Details">
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <Row label="Bank / Finance" value={finance_bank_name} />
            <Row label="Loan Amount"    value={loan_amount ? `Rs. ${Number(loan_amount).toLocaleString()}` : null} />
            <Row label="Class Type"     value={class_type} />
          </ul>
        </Section>
      )}

      {/* ── OTHER DETAILS ── */}
      {(availability_from || property_code || company_name) && (
        <Section title="Other Details">
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <Row label="Property Code"   value={property_code} />
            <Row label="Available From"  value={availability_from} />
            <Row label="Company"         value={company_name} />
            <Row label="Company Address" value={company_address} />
            <Row label="Company Phone"   value={company_phone} />
          </ul>
        </Section>
      )}

      {/* ── MAP (hidden when rendered in sidebar layout) ── */}
      {!hideMap && latitude && longitude && (
        <Section title="Location on Map">
          <ProductMap latitude={latitude} longitude={longitude} data={data} />
        </Section>
      )}

    </div>
  );
};

export default Details;