import React, { useState, useEffect, useRef, useCallback } from "react";
import { BsGrid3X3 } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { MdPlayArrow, MdPause, MdClose } from "react-icons/md";

/* ── Shared styles ── */
const topBtn = {
  display: "flex", alignItems: "center",
  background: "rgba(0,0,0,0.48)", backdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "4px", padding: "5px 10px",
  color: "#fff", cursor: "pointer", transition: "background 0.15s",
};
const arrowBase = {
  position: "absolute", top: "50%", transform: "translateY(-50%)",
  background: "rgba(0,0,0,0.46)", backdropFilter: "blur(6px)",
  border: "1px solid rgba(255,255,255,0.13)",
  borderRadius: "4px", width: "40px", height: "40px",
  display: "flex", alignItems: "center", justifyContent: "center",
  color: "#fff", cursor: "pointer", zIndex: 8, transition: "background 0.2s",
};

/* ════════════════════════════════════════════════
   HERO SLIDESHOW
════════════════════════════════════════════════ */
export const HeroSlideshow = ({ images = [], onOpenGallery, onOpenLightbox }) => {
  const [idx,      setIdx]      = useState(0);
  const [playing,  setPlaying]  = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progRef  = useRef(null);
  const DURATION = 5000;

  // FIX #10: goTo uses functional state updater — no stale closure on idx
  const goTo = useCallback((i) => { setIdx(i); setProgress(0); }, []);

  // FIX #10: prev/next use functional updaters so they never capture stale idx
  const prev = (e) => {
    e?.stopPropagation();
    setIdx(p => (p - 1 + images.length) % images.length);
    setProgress(0);
  };
  const next = (e) => {
    e?.stopPropagation();
    setIdx(p => (p + 1) % images.length);
    setProgress(0);
  };

  // Reset to 0 whenever the images array identity changes (new property load)
  useEffect(() => { setIdx(0); setProgress(0); }, [images]);

  // FIX #9: Removed `idx` from dependency array.
  // Previously, when the timer incremented idx, this effect re-ran, cleared both
  // intervals, and immediately restarted them — causing a stutter/skip every cycle.
  // The functional updater inside setInterval doesn't need idx in deps.
  useEffect(() => {
    clearInterval(timerRef.current);
    clearInterval(progRef.current);
    if (!playing || images.length < 2) return;
    setProgress(0);
    const step = 40;
    progRef.current  = setInterval(() => setProgress(p => Math.min(p + (step / DURATION) * 100, 100)), step);
    timerRef.current = setInterval(() => {
      setIdx(p => (p + 1) % images.length);
      setProgress(0);
    }, DURATION);
    return () => {
      clearInterval(timerRef.current);
      clearInterval(progRef.current);
    };
    // NOTE: `idx` intentionally removed from deps — functional updater handles it
  }, [playing, images.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!images.length) return null;

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "clamp(220px, 36vw, 420px)",
      background: "#111",
      overflow: "hidden",
    }}>
      {/* Slides */}
      {images.map((img, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          opacity: i === idx ? 1 : 0,
          transition: "opacity 0.8s ease",
          zIndex: i === idx ? 1 : 0,
        }}>
          <img src={img} alt="" style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: i === idx ? "scale(1.04)" : "scale(1)",
            transition: "transform 6s ease",
          }} />
        </div>
      ))}

      {/* Dark overlays */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.08) 50%, transparent 100%)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: "linear-gradient(110deg, rgba(0,0,0,0.25) 0%, transparent 55%)" }} />

      {/* Clickable layer → lightbox */}
      <div onClick={() => onOpenLightbox(idx)} style={{
        position: "absolute", inset: 0, zIndex: 3, cursor: "zoom-in",
      }} />

      {/* Top-left: counter */}
      <div style={{
        position: "absolute", top: "12px", left: "14px", zIndex: 10,
        background: "rgba(0,0,0,0.44)", backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "4px", padding: "3px 11px",
        fontSize: "11px", fontWeight: "700", color: "#fff", letterSpacing: "0.07em",
      }}>
        {String(idx + 1).padStart(2, "0")}
        <span style={{ opacity: 0.38, margin: "0 4px" }}>/</span>
        {String(images.length).padStart(2, "0")}
      </div>

      {/* Top-right: controls */}
      <div style={{ position: "absolute", top: "12px", right: "14px", zIndex: 10, display: "flex", gap: "6px" }}>
        <button onClick={(e) => { e.stopPropagation(); setPlaying(p => !p); }} style={topBtn}>
          {playing ? <MdPause size={13} /> : <MdPlayArrow size={13} />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); onOpenGallery(); }}
          style={{ ...topBtn, gap: "5px", paddingLeft: "9px", paddingRight: "12px" }}>
          <BsGrid3X3 size={11} />
          <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.04em" }}>
            All {images.length}
          </span>
        </button>
      </div>

      {/* Prev / Next */}
      <button onClick={prev} style={{ ...arrowBase, left: "12px", zIndex: 9 }}><FaChevronLeft size={12} /></button>
      <button onClick={next} style={{ ...arrowBase, right: "12px", zIndex: 9 }}><FaChevronRight size={12} /></button>

      {/* Bottom: hint + dots */}
      <div style={{
        position: "absolute", bottom: "14px", left: "14px", right: "14px",
        zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{
          fontSize: "10px", color: "rgba(255,255,255,0.48)", fontWeight: "600",
          letterSpacing: "0.04em", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)",
          borderRadius: "4px", padding: "3px 9px", border: "1px solid rgba(255,255,255,0.07)",
        }}>Click to expand</div>

        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          {images.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); goTo(i); }} style={{
              width: i === idx ? "22px" : "6px", height: "6px", borderRadius: "3px",
              background: i === idx ? "var(--r, #e74c3c)" : "rgba(255,255,255,0.35)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }} />
          ))}
        </div>
      </div>

      {/* Segmented progress bars */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, display: "flex", height: "3px", gap: "2px" }}>
        {images.map((_, i) => (
          <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
            <div style={{
              height: "100%", background: "var(--r, #e74c3c)",
              width: i < idx ? "100%" : i === idx ? `${progress}%` : "0%",
            }} />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═════════════════════════════════
   THUMBNAIL STRIP
   skip=1 → skips feature_image (shown in hero)
   starts from gallery[0] onward

   FIX #11: Off-by-one in the "+N more" overlay count.
   Previously sliced up to skip+6, then the last of those 6 became the overlay tile.
   This meant the count was wrong (didn't include the tile's own image) and if there
   were exactly 6 remaining images, no overlay was shown at all.
   Fix: show 5 real thumbs + 1 overflow tile. The overflow count now correctly
   includes all images not shown as individual thumbs.
═════════════════════════════════ */
export const ThumbnailStrip = ({ images, skip = 1, onOpenLightbox, onOpenGallery }) => {
  // FIX #11: slice only 5 thumbs; the 6th slot is always the overflow tile if needed
  const MAX_THUMBS = 5;
  const available = images.slice(skip);
  const needsOverflow = available.length > MAX_THUMBS;
  const thumbs = available.slice(0, needsOverflow ? MAX_THUMBS : available.length);
  const extra  = available.length - thumbs.length; // images hidden behind the overflow tile

  if (!thumbs.length) return null;
  const cols = thumbs.length + (needsOverflow ? 1 : 0);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: "4px", marginTop: "4px",
    }}>
      {thumbs.map((img, i) => (
        <div key={i}
          onClick={() => onOpenLightbox(skip + i)}
          style={{
            position: "relative", aspectRatio: "4/3",
            overflow: "hidden", cursor: "pointer", background: "#e8e8e8", borderRadius: "4px",
          }}>
          <img src={img} alt="" style={{
            width: "100%", height: "100%", objectFit: "cover",
            transition: "transform 0.35s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
          />
        </div>
      ))}

      {/* Overflow tile — only rendered when there are hidden images */}
      {needsOverflow && (
        <div
          onClick={onOpenGallery}
          style={{
            position: "relative", aspectRatio: "4/3",
            overflow: "hidden", cursor: "pointer", background: "#e8e8e8", borderRadius: "4px",
          }}>
          {/* Show the next image underneath the overlay */}
          <img src={images[skip + MAX_THUMBS]} alt="" style={{
            width: "100%", height: "100%", objectFit: "cover",
            filter: "brightness(0.35)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", color: "#fff",
          }}>
            <span style={{ fontSize: "18px", fontWeight: "800", lineHeight: 1 }}>+{extra}</span>
            <span style={{ fontSize: "10px", fontWeight: "600", opacity: 0.65, marginTop: "2px" }}>more</span>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════
   ALL PHOTOS OVERLAY
═══════════════════ */
export const AllPhotosOverlay = ({ images, onClose, onOpenLightbox }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 1200,
    background: "rgba(3,3,3,0.97)", overflowY: "auto",
  }}>
    <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "22px 18px 48px" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingBottom: "13px", marginBottom: "13px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <div>
          <span style={{ color: "#fff", fontWeight: "800", fontSize: "16px" }}>All Photos</span>
          <span style={{ color: "rgba(255,255,255,0.32)", fontSize: "12px", marginLeft: "9px" }}>{images.length} images</span>
        </div>
        <button onClick={onClose} style={{
          background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "4px", width: "36px", height: "36px",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", cursor: "pointer",
        }}>
          <MdClose size={16} />
        </button>
      </div>
      <div style={{ columns: "3 240px", columnGap: "5px" }}>
        {images.map((img, i) => (
          <div key={i} onClick={() => { onClose(); onOpenLightbox(i); }} style={{
            breakInside: "avoid", marginBottom: "5px",
            borderRadius: "4px", overflow: "hidden", cursor: "pointer",
          }}>
            <img src={img} alt="" style={{
              width: "100%", height: "auto", display: "block",
              transition: "transform 0.32s, opacity 0.28s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.opacity = "0.78"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "1"; }}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ════════
   LIGHTBOX
════════ */
export const Lightbox = ({ images, startIdx, onClose }) => {
  const [idx, setIdx] = useState(startIdx);

  // FIX #8: Use stable callback refs so the keydown listener is not re-added on
  // every render. Previously there was no dependency array, meaning a new listener
  // was added every render without the old one being removed — they stack up.
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowLeft")  setIdx(p => (p - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIdx(p => (p + 1) % images.length);
      if (e.key === "Escape")     onCloseRef.current();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
    // images.length is the only thing that could change shape; onClose is in a ref
  }, [images.length]);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(0,0,0,0.97)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div onClick={e => e.stopPropagation()} style={{ position: "relative" }}>
        <img src={images[idx]} alt="" style={{
          maxWidth: "90vw", maxHeight: "84vh", objectFit: "contain",
          borderRadius: "4px", boxShadow: "0 28px 72px rgba(0,0,0,0.8)",
        }} />
        <div style={{
          position: "absolute", top: "-34px", left: "50%", transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.42)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em",
        }}>{idx + 1} / {images.length}</div>
        <button onClick={onClose} style={{
          position: "absolute", top: "-38px", right: 0,
          background: "none", border: "none", color: "rgba(255,255,255,0.5)",
          cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
          fontSize: "11px", fontWeight: "700",
        }}><FaTimes size={10} /> ESC</button>
        <button
          onClick={(e) => { e.stopPropagation(); setIdx(p => (p - 1 + images.length) % images.length); }}
          style={{ ...arrowBase, left: "-54px" }}
        >
          <FaChevronLeft size={12} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setIdx(p => (p + 1) % images.length); }}
          style={{ ...arrowBase, right: "-54px" }}
        >
          <FaChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default ThumbnailStrip;