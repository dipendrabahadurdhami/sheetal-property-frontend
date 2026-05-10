import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../index.css";
import {
  FaCalculator, FaRulerCombined, FaChartLine,
  FaPercentage, FaMapMarkerAlt, FaFileInvoiceDollar,
} from "react-icons/fa";

const TOOL_DEFS = [
  {
    icon: <FaCalculator />,
    label: "EMI Calculator",
    desc: "Estimate your monthly loan repayment",
    pathKey: "emi-calculator",
    paramFn: ({ price }) => `amount=${price}`,
  },
  {
    icon: <FaRulerCombined />,
    label: "Unit Converter",
    desc: "Convert sqft, sqm, ropani, aana, dhur",
    pathKey: "unit-converter",
    paramFn: ({ area }) => `area=${area}`,
  },
  {
    icon: <FaChartLine />,
    label: "Rate & Trends",
    desc: "Market price trends for this location",
    pathKey: "rate-trends",
    paramFn: ({ loc, type }) => `location=${loc}&type=${type}`,
  },
  {
    icon: <FaPercentage />,
    label: "ROI Calculator",
    desc: "Calculate return on this investment",
    pathKey: "roi-calculator",
    paramFn: ({ price }) => `price=${price}`,
  },
  {
    icon: <FaMapMarkerAlt />,
    label: "Land Price Estimator",
    desc: "Estimate land value per unit",
    pathKey: "land-estimator",
    paramFn: ({ price, area }) => `price=${price}&area=${area}`,
  },
  {
    icon: <FaFileInvoiceDollar />,
    label: "Property Tax",
    desc: "Estimate annual property tax",
    pathKey: "property-tax",
    paramFn: ({ price }) => `value=${price}`,
  },
];

const ToolCard = ({ tool, path }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={path} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: hovered ? "1.5px solid var(--r)" : "1px solid var(--border, #e5e7eb)",
          borderRadius: "12px",
          padding: "16px",
          background: hovered ? "var(--r06)" : "var(--white, #fff)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          transition: "background 0.18s, border-color 0.18s, transform 0.18s",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          cursor: "pointer",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Icon bubble */}
        <div style={{
          width: "42px", height: "42px",
          background: "var(--r06)",
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--r)",
          fontSize: "20px",
          flexShrink: 0,
        }}>
          {tool.icon}
        </div>

        <div style={{
          fontWeight: "700", fontSize: "13px",
          color: "var(--d)",
          lineHeight: "1.3",
        }}>
          {tool.label}
        </div>

        <div style={{
          fontSize: "11px",
          color: "var(--gray, #6b7280)",
          lineHeight: "1.5",
          flex: 1,
        }}>
          {tool.desc}
        </div>

        <div style={{
          marginTop: "auto",
          fontSize: "11px",
          color: "var(--r)",
          fontWeight: "700",
        }}>
          Open tool →
        </div>
      </div>
    </Link>
  );
};

const ToolsWidget = ({ property }) => {
  const price = property?.total_price ? String(property.total_price).replace(/[^0-9.]/g, "") : "";
  const area  = property?.property_area     || "";
  const loc   = property?.property_location || "";
  const type  = property?.property_type     || "";

  const params = { price, area, loc, type };

  return (
    <div style={{
      borderTop: "2px solid var(--r06)",
      paddingTop: "2rem",
      marginBottom: "2rem",
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <span style={{
          width: "4px", height: "22px",
          background: "var(--r)",
          borderRadius: "2px", display: "inline-block",
        }} />
        <span style={{ fontSize: "22px", fontWeight: "700", color: "var(--d)" }}>
          Property Tools
        </span>
      </div>

      <style>{`
        .tw-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        @media (max-width: 899px) {
          .tw-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 559px) {
          .tw-grid {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            gap: 12px;
            padding-bottom: 8px;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }
          .tw-grid::-webkit-scrollbar { height: 4px; }
          .tw-grid::-webkit-scrollbar-track { background: var(--r06); border-radius: 4px; }
          .tw-grid::-webkit-scrollbar-thumb { background: var(--r28); border-radius: 4px; }
          .tw-card { min-width: 200px; max-width: 200px; scroll-snap-align: start; }
        }
      `}</style>

      <div className="tw-grid">
        {TOOL_DEFS.map((tool) => (
          <div key={tool.label} className="tw-card">
            <ToolCard
              tool={tool}
              path={`/tools/${tool.pathKey}?${tool.paramFn(params)}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolsWidget;