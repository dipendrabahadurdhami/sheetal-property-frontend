import React, { useState } from "react";
import { CONTACT_REASON_OPTIONS } from "../../utils/contactReasons";

/**
 * Dropdown-and-add picker for "Reason for contact / visit" — pick a reason
 * from the select, click Add, and it becomes a removable tag. Selecting
 * "other" as a tag reveals a free-text field for details. Much more compact
 * than showing all options as always-visible chips, especially inside a
 * modal. Kept dependency-free (no external multi-select lib).
 *
 * Props:
 *  - value:        string[]  currently selected reason keys
 *  - onChange:     (string[]) => void
 *  - otherValue:   string    free text shown when "other" is selected
 *  - onOtherChange:(string) => void
 *  - label:        string    optional heading, defaults to "Reason for Contact"
 *  - compact:      bool      smaller sizing, for tight modal layouts
 */
const ReasonMultiSelect = ({
  value = [],
  onChange,
  otherValue = "",
  onOtherChange,
  label = "Reason for Contact",
  compact = false,
}) => {
  const [pending, setPending] = useState("");
  const available = CONTACT_REASON_OPTIONS.filter((opt) => !value.includes(opt.value));
  const showOther = value.includes("other");

  const addReason = () => {
    if (!pending) return;
    onChange([...value, pending]);
    setPending("");
  };

  const remove = (key) => {
    onChange(value.filter((v) => v !== key));
  };

  const labelFor = (key) => CONTACT_REASON_OPTIONS.find((o) => o.value === key)?.label || key;

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

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <select
          value={pending}
          onChange={(e) => setPending(e.target.value)}
          disabled={available.length === 0}
          style={{
            flex: "1 1 160px",
            padding: compact ? "7px 10px" : "8px 10px",
            fontSize: compact ? 12 : 13,
            color: "#374151",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            background: "#fff",
            outline: "none",
          }}
        >
          <option value="">
            {available.length === 0 ? "All reasons added" : "Select a reason..."}
          </option>
          {available.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={addReason}
          disabled={!pending}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: compact ? "0 12px" : "0 16px",
            height: compact ? 30 : 36,
            borderRadius: 8,
            border: "none",
            cursor: pending ? "pointer" : "not-allowed",
            background: pending ? "#e53935" : "#e5e7eb",
            color: pending ? "#fff" : "#9ca3af",
            fontSize: compact ? 11 : 12,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          + Add
        </button>
      </div>

      {value.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: compact ? 6 : 8 }}>
          {value.map((key) => (
            <div
              key={key}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: compact ? "5px 6px 5px 10px" : "6px 6px 6px 12px",
                borderRadius: 20,
                border: "1px solid #fecaca",
                background: "#fef2f2",
                color: "#e53935",
                fontSize: compact ? 11 : 12,
                fontWeight: 600,
              }}
            >
              {labelFor(key)}
              <button
                type="button"
                onClick={() => remove(key)}
                title="Remove"
                style={{
                  width: compact ? 15 : 17,
                  height: compact ? 15 : 17,
                  borderRadius: "50%",
                  border: "none",
                  background: "transparent",
                  color: "#e53935",
                  cursor: "pointer",
                  fontSize: compact ? 11 : 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

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
