import React from "react";
import { IoCheckmarkOutline } from "react-icons/io5";

/**
 * Horizontal numbered step indicator — circles connected by a line, the
 * completed ones filled with a checkmark, the active one highlighted, the
 * rest outlined. Used to give multi-step forms a "SaaS onboarding" feel.
 *
 * Props:
 *  - steps:       string[]  short label per step (e.g. ["Your Details", "Preferences", "Review"])
 *  - currentStep: number    0-indexed active step
 */
const StepProgress = ({ steps, currentStep }) => (
  <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 4 }}>
    {steps.map((label, i) => {
      const isDone = i < currentStep;
      const isActive = i === currentStep;
      const circleColor = isDone || isActive ? "#e53935" : "#e5e7eb";
      const textColor = isDone || isActive ? "#e53935" : "#9ca3af";
      return (
        <React.Fragment key={label}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 0, flex: "0 0 auto" }}>
            <div
              style={{
                width: 26, height: 26, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, flexShrink: 0,
                background: isDone || isActive ? circleColor : "#fff",
                color: isDone || isActive ? "#fff" : "#9ca3af",
                border: `2px solid ${circleColor}`,
                transition: "all 0.2s",
              }}
            >
              {isDone ? <IoCheckmarkOutline size={14} /> : i + 1}
            </div>
            <span
              style={{
                fontSize: 10, fontWeight: 700, color: textColor, marginTop: 5,
                textAlign: "center", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.03em",
              }}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                flex: 1, height: 2, marginTop: 12, marginLeft: 4, marginRight: 4,
                background: i < currentStep ? "#e53935" : "#e5e7eb",
                transition: "background 0.2s",
              }}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default StepProgress;
