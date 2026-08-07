import React from "react";

const PageLoader = () => (
  <div
    style={{
      minHeight: "40vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "3px solid #e5e7eb",
        borderTopColor: "#d33",
        animation: "seo-spin 0.8s linear infinite",
      }}
    />
    <style>{`@keyframes seo-spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default PageLoader;
