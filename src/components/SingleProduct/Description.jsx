import { useState, useRef, useEffect } from "react";
import Parser from "html-react-parser";

const COLLAPSED_HEIGHT = 180;

const ExpandableBlock = ({ content }) => {
  const [expanded, setExpanded]     = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) setNeedsToggle(ref.current.scrollHeight > COLLAPSED_HEIGHT);
  }, [content]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={ref}
        style={{ maxHeight: expanded ? "none" : `${COLLAPSED_HEIGHT}px`, overflow: "hidden", transition: "max-height 0.35s ease" }}
        className="text-sm space-y-3 leading-relaxed text-gray-700">
        {Parser(content)}
      </div>

      {needsToggle && !expanded && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "56px", background: "linear-gradient(to bottom, transparent, #fff)", pointerEvents: "none" }} />
      )}

      {needsToggle && (
        <button onClick={() => setExpanded((p) => !p)}
          style={{
            marginTop: expanded ? "12px" : "6px",
            padding: "7px 18px", fontSize: "13px", fontWeight: "600",
            color: "var(--r)", background: "rgba(224,36,36,0.05)",
            border: "1.5px solid rgba(224,36,36,0.3)", borderRadius: "100px",
            cursor: "pointer", transition: "all 0.2s",
          }}>
          {expanded ? "Show less ▲" : "Read more ▼"}
        </button>
      )}
    </div>
  );
};

const Description = ({ data }) => {
  if (!data) return null;
  return (
    <div>
      {data.property_description && <ExpandableBlock content={data.property_description} />}
      {data.other_description && (
        <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #f3f4f6" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
            Additional Details
          </div>
          <ExpandableBlock content={data.other_description} />
        </div>
      )}
    </div>
  );
};

export default Description;
