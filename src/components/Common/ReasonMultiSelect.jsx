import React from "react";
import { CONTACT_REASON_OPTIONS } from "../../utils/contactReasons";

/**
 * Chip-style multi-select for "Reason for contact / visit". Selecting
 * "other" reveals a free-text field for details. Kept dependency-free
 * (no external multi-select lib) so it drops into any of the existing
 * contact/schedule-tour forms without extra setup.
 *
 * Props:
 *  - value:        string[]  currently selected reason keys
 *  - onChange:     (string[]) => void
 *  - otherValue:   string    free text shown when "other" is selected
 *  - onOtherChange:(string) => void
 *  - label:        string    optional heading, defaults to "Reason for Contact"
 *  - compact:      bool      smaller chip sizing, for tight modal layouts
 */
const ReasonMultiSelect = ({
  value = [],
  onChange,
  otherValue = "",
  onOtherChange,
  label = "Reason for Contact",
  compact = false,
}) => {
  const toggle = (key) => {
    if (value.includes(key)) {
      onChange(value.filter((v) => v !== key));
    } else {
      onChange([...value, key]);
    }
  };

  const showOther = value.includes("other");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 6 : 8 }}>
      {label && (
        <label
          style={{
            fontSize: compact ? 11 : 12,
            fontWeight: 700,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </label>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: compact ? 6 : 8 }}>
        {CONTACT_REASON_OPTIONS.map((opt) => {
          const active = value.includes(opt.value);
          return (
            <button
              type="button"
              key={opt.value}
              onClick={() => toggle(opt.value)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: compact ? "5px 10px" : "7px 14px",
                borderRadius: 20,
                cursor: "pointer",
                border: `1px solid ${active ? "#e53935" : "#e5e7eb"}`,
                background: active ? "#fef2f2" : "#fff",
                color: active ? "#e53935" : "#374151",
                fontSize: compact ? 11 : 12,
                fontWeight: 600,
                transition: "all 0.15s",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {showOther && (
        <input
          type="text"
          placeholder="Please specify..."
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
          style={{
            width: "100%",
            padding: compact ? "7px 10px" : "8px 10px",
            fontSize: compact ? 12 : 13,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            outline: "none",
            color: "#111827",
            background: "#fff",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
      )}
    </div>
  );
};

export default ReasonMultiSelect;
