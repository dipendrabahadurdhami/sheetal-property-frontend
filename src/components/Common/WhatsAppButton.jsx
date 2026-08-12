import React from "react";

// Change this if the WhatsApp number ever changes.
// Country code included, no +, no spaces (WhatsApp API format).
const WHATSAPP_NUMBER = "919705250833"; // 91 = India country code + 9705250833
const DEFAULT_MESSAGE = "Hi, I have an enquiry.";

const WhatsAppButton = () => {
  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    DEFAULT_MESSAGE
  )}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "58px",
        height: "58px",
        backgroundColor: "#25D366",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        zIndex: 9999,
        cursor: "pointer",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <svg
        viewBox="0 0 32 32"
        width="32"
        height="32"
        fill="#ffffff"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.7 4.61 1.902 6.478L4 29l7.72-1.865A11.94 11.94 0 0016.001 27C22.628 27 28 21.627 28 15S22.628 3 16.001 3zm0 21.75c-1.99 0-3.844-.58-5.406-1.579l-.388-.243-4.584 1.107 1.224-4.464-.253-.406A9.71 9.71 0 016.25 15c0-5.376 4.375-9.75 9.751-9.75S25.75 9.624 25.75 15 21.377 24.75 16.001 24.75zm5.34-7.302c-.293-.147-1.735-.856-2.004-.954-.269-.098-.464-.147-.66.147-.195.293-.757.954-.928 1.15-.171.196-.342.22-.635.073-.293-.147-1.235-.455-2.353-1.451-.87-.776-1.458-1.735-1.629-2.028-.171-.293-.018-.451.129-.598.132-.132.293-.342.44-.513.147-.171.196-.293.293-.489.098-.196.049-.367-.024-.514-.073-.147-.66-1.592-.904-2.181-.238-.573-.48-.496-.66-.505l-.562-.01c-.196 0-.514.073-.783.367-.269.293-1.026 1.003-1.026 2.446 0 1.443 1.05 2.837 1.196 3.032.147.196 2.066 3.156 5.007 4.425.7.302 1.246.483 1.672.618.702.223 1.341.191 1.846.116.563-.084 1.735-.709 1.98-1.394.244-.685.244-1.272.171-1.394-.073-.122-.269-.196-.562-.343z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
