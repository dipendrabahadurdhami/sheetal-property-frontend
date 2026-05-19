import React, { useState } from "react";
import GetYoutubeIdByUrl from "../../utils/getYoutubeIdByUrl";
import { FaYoutube, FaPlay } from "react-icons/fa";

const YoutubeVideo = ({ url }) => {
  const youtubeId = GetYoutubeIdByUrl(url);
  const [playing, setPlaying] = useState(false);

  if (!youtubeId || youtubeId === "null") return null;

  const thumbUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div style={{
      borderTop: "2px solid #e5e7eb",
      paddingTop: "2rem",
      marginBottom: "2rem",
    }}>
      {/* Section Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "16px",
      }}>
        <span style={{
          width: "4px", height: "22px",
          background: "var(--r)",
          borderRadius: "2px",
          display: "inline-block",
        }} />
        <span style={{
          fontSize: "clamp(18px,2.5vw,22px)",
          fontWeight: "700",
          color: "var(--d)",
        }}>
          Property Video Tour
        </span>
        <span style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          fontSize: "11px",
          fontWeight: "700",
          color: "#e53935",
          background: "rgba(229,57,53,0.08)",
          padding: "3px 10px",
          borderRadius: "20px",
        }}>
          <FaYoutube style={{ fontSize: "14px" }} />
          YouTube
        </span>
      </div>

      {/* Video container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: "14px",
          overflow: "hidden",
          background: "#111",
          cursor: playing ? "default" : "pointer",
          border: "1px solid #e5e7eb",
        }}
        onClick={() => !playing && setPlaying(true)}
      >
        {!playing ? (
          <>
            {/* Thumbnail */}
            <img
              src={thumbUrl}
              alt="Property video tour"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.4s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              onError={e => { e.currentTarget.style.display = "none"; }}
            />

            {/* Dark overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.35)",
            }} />

            {/* Play button */}
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{
                width: "68px",
                height: "68px",
                borderRadius: "50%",
                background: "var(--r)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 32px rgba(224,36,36,0.45)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(224,36,36,0.6)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(224,36,36,0.45)";
                }}
              >
                <FaPlay style={{
                  color: "#fff",
                  fontSize: "22px",
                  marginLeft: "4px",
                }} />
              </div>
            </div>

            {/* Bottom label */}
            <div style={{
              position: "absolute",
              bottom: "16px",
              left: "16px",
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "600",
              padding: "5px 12px",
              borderRadius: "20px",
              backdropFilter: "blur(4px)",
            }}>
              Click to play video tour
            </div>
          </>
        ) : (
          <iframe
            src={embedUrl}
            title="Property Video Tour"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default YoutubeVideo;