import { useState, useRef, useEffect } from "react";
import Parser from "html-react-parser";

const COLLAPSED_HEIGHT = 160; // px

const ExpandableBlock = ({ content }) => {
  const [expanded, setExpanded] = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      setNeedsToggle(ref.current.scrollHeight > COLLAPSED_HEIGHT);
    }
  }, [content]);

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={ref}
        style={{
          maxHeight: expanded ? "none" : `${COLLAPSED_HEIGHT}px`,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
        className="text-xs md:text-sm space-y-2 md:space-y-5 py-5"
      >
        {Parser(content)}
      </div>

      {/* Fade overlay when collapsed */}
      {needsToggle && !expanded && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            background: "linear-gradient(to bottom, transparent, white)",
            pointerEvents: "none",
          }}
        />
      )}

      {needsToggle && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: expanded ? "8px" : "4px",
            padding: "6px 14px",
            fontSize: "13px",
            fontWeight: "600",
            color: "var(--r, #e53935)",
            background: "transparent",
            border: "1.5px solid currentColor",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {expanded ? "Show less ▲" : "Show more ▼"}
        </button>
      )}
    </div>
  );
};

const Description = ({ data }) => {
  if (!data) return null;

  return (
    <div>
      <div className="border-b-2 border-gray-200 py-3 font-bold text-xl sm:text-2xl">
        Description
      </div>

      {data.property_description && (
        <ExpandableBlock content={data.property_description} />
      )}

      {data.other_description && (
        <>
          <div
            className="border-b border-gray-100 py-2 font-semibold text-sm text-gray-500 mt-2"
          >
            Additional Details
          </div>
          <ExpandableBlock content={data.other_description} />
        </>
      )}
    </div>
  );
};

export default Description;