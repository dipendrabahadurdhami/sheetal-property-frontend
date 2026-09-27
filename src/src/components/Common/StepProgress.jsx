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
 *
 * Layout note: each step's label used to sit in a 0-width flex column
 * centered on the circle. For the first step that meant roughly half the
 * label text rendered to the LEFT of the modal's own padding and got
 * clipped by the modal's overflow-hidden edge (e.g. "Your Details" showing
 * up as "ur Details"). Labels near either end now anchor toward the
 * middle instead of centering on a point, so nothing can overflow past
 * the container.
 */
const StepProgress = ({ steps, currentStep }) => (
  <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 4, width: "100%" }}>
    {steps.map((label, i) => {
      const isDone = i < currentStep;
      const isActive = i === currentStep;
      const isFirst = i === 0;
      const isLast = i === steps.length - 1;
      const circleColor = isDone || isActive ? "#e53935" : "#e5e7eb";
      const textColor = isDone || isActive ? "#e53935" : "#9ca3af";

      return (
        <React.Fragment key={label}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isFirst ? "flex-start" : isLast ? "flex-end" : "center",
              flexShrink: 0,
              minWidth: 0,
            }}
          >
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
                textAlign: isFirst ? "left" : isLast ? "right" : "center",
                whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.03em",
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
                minWidth: 12,
              }}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default StepProgress;
