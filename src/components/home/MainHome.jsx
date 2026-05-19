import React, { useState, useEffect, useRef, useCallback } from "react";
import Search from "../Common/SearchBox/HomeSearch";
import Model from "../FilterSearch/Model";
import Featured from "./Featured";
import LatestProperties from "./LatestProperties";
import "react-multi-carousel/lib/styles.css";

const API_BASE      = process.env.REACT_APP_API_LINK;
const SEARCH_H      = 64;
const IMG_DURATION  = 5000; // ms for image banners
const FADE_MS       = 700;  // crossfade duration

const TABS = [
  { label: "All",    advertisement_purpose: null },
  { label: "Sale",   advertisement_purpose: "Sale" },
  { label: "Rent",   advertisement_purpose: "Rent" },
  { label: "Invest", advertisement_purpose: "Invest" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Checks whether a <video> element has its entire duration buffered
// ─────────────────────────────────────────────────────────────────────────────
const isFullyBuffered = (vid) => {
  try {
    if (!vid.duration || !isFinite(vid.duration)) return false;
    if (!vid.buffered || vid.buffered.length === 0) return false;
    return vid.buffered.end(vid.buffered.length - 1) >= vid.duration - 0.15;
  } catch {
    return false;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// MainHome
// ─────────────────────────────────────────────────────────────────────────────
const MainHome = () => {
  const [filterModal,    setFilterModal]    = useState(false);
  const [activeTab,      setActiveTab]      = useState(0);
  const [banners,        setBanners]        = useState([]);
  const [activeIdx,      setActiveIdx]      = useState(0);
  const [prevIdx,        setPrevIdx]        = useState(null);
  const [allReady,       setAllReady]       = useState(false);
  const [loading,        setLoading]        = useState(true);
  const [scrolled,       setScrolled]       = useState(false);
  const [visualScrolled, setVisualScrolled] = useState(false);
  const [bannerH,        setBannerH]        = useState(0);
  const [bannerReady,    setBannerReady]    = useState(false); // true after first real height measured

  // video DOM nodes keyed by banner index — never moved, never re-created
  const videoRefs    = useRef({});
  const readyMap     = useRef({});
  const videoTotal   = useRef(0);
  const timerRef     = useRef(null);
  const fadingRef    = useRef(false);
  const bannerRef    = useRef(null);
  const searchRef    = useRef(null);
  const userClosedRef = useRef(false);
  const bannersRef   = useRef([]);
  const activeIdxRef = useRef(0);

  bannersRef.current   = banners;
  activeIdxRef.current = activeIdx;

  // ── resize observer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!bannerRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      const h = e.contentRect.height;
      setBannerH(h);
      if (h > 0) setBannerReady(true); // only enable transition after real height known
    });
    ro.observe(bannerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── scroll ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ── click-outside search ──────────────────────────────────────────────────
  useEffect(() => {
    const fn = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        userClosedRef.current = true;
        setVisualScrolled(true);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    if (!bannerH) return;
    searchRef.current?.querySelector("input")?.focus();
  }, [bannerH]);

  useEffect(() => {
    if (!scrolled) {
      if (userClosedRef.current) return;
      setVisualScrolled(false);
      searchRef.current?.querySelector("input")?.focus();
    } else {
      userClosedRef.current = false;
      setVisualScrolled(false);
    }
  }, [scrolled]);

  // ── crossfade advance ─────────────────────────────────────────────────────
  const advanceTo = useCallback((targetIdx) => {
    if (fadingRef.current) return;
    fadingRef.current = true;

    const current     = activeIdxRef.current;
    const leavingVid  = videoRefs.current[current];
    const incomingVid = videoRefs.current[targetIdx];

    // Start playing the incoming video BEFORE the fade begins
    // It's fully buffered so this is instant — no stutter
    if (incomingVid) {
      incomingVid.currentTime = 0;
      incomingVid.play().catch(() => {});
    }

    setPrevIdx(current);
    setActiveIdx(targetIdx);

    setTimeout(() => {
      setPrevIdx(null);
      fadingRef.current = false;
      // Rewind the video that just faded out so it's ready for next loop
      if (leavingVid) {
        leavingVid.pause();
        leavingVid.currentTime = 0;
      }
    }, FADE_MS);
  }, []);

  // ── schedule next (image banners only — videos fire onEnded) ─────────────
  const scheduleNext = useCallback((idx, arr) => {
    clearTimeout(timerRef.current);
    if (!arr || arr.length <= 1) return;
    if (arr[idx]?.media_type !== "video") {
      timerRef.current = setTimeout(() => {
        advanceTo((activeIdxRef.current + 1) % arr.length);
      }, IMG_DURATION);
    }
  }, [advanceTo]);

  // ── build video elements — appended to a hidden stage, never moved ────────
  const setupVideos = useCallback((arr) => {
    const vids = arr.filter((b) => b.media_type === "video");
    videoTotal.current = vids.length;

    if (vids.length === 0) { setAllReady(true); return; }

    const checkDone = () => {
      if (Object.keys(readyMap.current).length >= videoTotal.current) {
        setAllReady(true);
      }
    };

    arr.forEach((banner, idx) => {
      if (banner.media_type !== "video") return;
      if (videoRefs.current[idx]) return;

      const vid = document.createElement("video");
      vid.src          = banner.url;
      vid.muted        = true;
      vid.playsInline  = true;
      vid.preload      = "auto";
      vid.loop         = false;
      vid.crossOrigin  = "anonymous";

      // Positioned absolute inside #video-stage, hidden until active
      Object.assign(vid.style, {
        position:       "absolute",
        top:            "0",
        left:           "0",
        width:          "100%",
        height:         "100%",
        minWidth:       "100%",      // prevent any sub-pixel shrink on mobile
        objectFit:      "cover",
        objectPosition: `50% ${banner.object_position ?? 50}%`,
        opacity:        "0",
        pointerEvents:  "none",
        willChange:     "opacity",
        transition:     "none",
        display:        "block",     // no inline baseline gap
      });

      videoRefs.current[idx] = vid;

      // ── full-download detection ──────────────────────────────────────────
      let marked = false;
      const markReady = () => {
        if (marked) return;
        marked = true;
        readyMap.current[idx] = true;
        checkDone();
      };
      const checkBuffer = () => { if (isFullyBuffered(vid)) markReady(); };

      vid.addEventListener("progress",       checkBuffer);
      vid.addEventListener("suspend",        checkBuffer);
      vid.addEventListener("canplaythrough", checkBuffer);
      setTimeout(markReady, 20000); // absolute ceiling

      vid.load();
    });
  }, []);

  // ── fetch banners ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE}/banners`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBanners(data);
          setupVideos(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [setupVideos]);

  // ── once all ready: mount video nodes into #video-stage & play first ──────
  useEffect(() => {
    if (!allReady || banners.length === 0) return;

    // Wait one tick so #video-stage is in the DOM
    const raf = requestAnimationFrame(() => {
      const stage = document.getElementById("video-stage");
      if (!stage) return;

      banners.forEach((_, idx) => {
        const vid = videoRefs.current[idx];
        if (vid && !stage.contains(vid)) stage.appendChild(vid);
      });

      // Show & play first video
      const first = videoRefs.current[0];
      if (first) {
        first.style.opacity = "1";
        first.currentTime   = 0;
        first.play().catch(() => {});
      }

      scheduleNext(0, banners);
    });

    return () => cancelAnimationFrame(raf);
  }, [allReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── sync video opacity on active/prev change ──────────────────────────────
  useEffect(() => {
    if (!allReady) return;
    banners.forEach((_, idx) => {
      const vid = videoRefs.current[idx];
      if (!vid) return;

      if (idx === activeIdx) {
        // Incoming — already playing, reveal instantly (fade handled by prev layer)
        vid.style.transition = "none";
        vid.style.opacity    = "1";
        vid.style.zIndex     = "2";
      } else if (idx === prevIdx) {
        // Outgoing — fade out
        vid.style.transition = `opacity ${FADE_MS}ms ease-in-out`;
        vid.style.opacity    = "0";
        vid.style.zIndex     = "1";
      } else {
        vid.style.transition = "none";
        vid.style.opacity    = "0";
        vid.style.zIndex     = "0";
      }
    });
  }, [activeIdx, prevIdx, allReady, banners]);

  // ── re-schedule on active change ──────────────────────────────────────────
  useEffect(() => {
    if (!allReady) return;
    scheduleNext(activeIdx, banners);
  }, [activeIdx, allReady, banners, scheduleNext]);

  // ── attach onEnded to all video nodes after mount ─────────────────────────
  useEffect(() => {
    if (!allReady) return;
    banners.forEach((banner, idx) => {
      if (banner.media_type !== "video") return;
      const vid = videoRefs.current[idx];
      if (!vid) return;
      const handler = () => {
        if (activeIdxRef.current === idx) {
          advanceTo((idx + 1) % bannersRef.current.length);
        }
      };
      if (vid._endedHandler) vid.removeEventListener("ended", vid._endedHandler);
      vid._endedHandler = handler;
      vid.addEventListener("ended", handler);
    });
    return () => {
      banners.forEach((_, idx) => {
        const vid = videoRefs.current[idx];
        if (vid?._endedHandler) vid.removeEventListener("ended", vid._endedHandler);
      });
    };
  }, [allReady, banners, advanceTo]);

  // ── cleanup ───────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      Object.values(videoRefs.current).forEach((vid) => {
        vid.pause();
        vid.src = "";
        vid.remove();
      });
    };
  }, []);

  // ── search positioning ────────────────────────────────────────────────────
  const isPageScrolled = (scrolled || visualScrolled) && !filterModal;
  const centeredTop    = bannerH ? Math.round((bannerH - SEARCH_H) / 1.2) : null;
  const scrolledTop    = bannerH ? bannerH - SEARCH_H : 0;

  const searchStyle = {
    position:   "absolute",
    left:       0,
    right:      0,
    top:        isPageScrolled ? scrolledTop : centeredTop,
    transition: (bannerReady && centeredTop !== null) ? "top 0.5s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
    zIndex:     50,
    visibility: centeredTop === null ? "hidden" : "visible",
  };

  const openFilter = (val) => {
    setFilterModal(val);
    if (val) { userClosedRef.current = false; setVisualScrolled(false); }
  };

  const currentBanner = banners[activeIdx] || null;
  const isVisible     = allReady && !loading;

  return (
    <div className="pt-0">
      <style>{`
        @keyframes fadeInfinite {
          0%,5%    { opacity:0; transform:translateY(10px); }
          20%,80%  { opacity:1; transform:translateY(0); }
          95%,100% { opacity:0; transform:translateY(10px); }
        }
        .animate-fade-infinite { animation: fadeInfinite 5s ease-in-out infinite; }

        .no-scrollbar::-webkit-scrollbar { display:none; }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }

        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, #0d1f35 25%, #1a3a5c 50%, #0d1f35 75%);
          background-size: 200% 100%;
          animation: shimmer 1.8s ease-in-out infinite;
        }
      `}</style>

      <div
        ref={bannerRef}
        className="w-full h-80 sm:h-96 md:h-[380px] lg:h-[420px] relative overflow-visible group"
      >
        {/* Media layer — overflow-hidden ensures video/img always fills full width */}
        <div className="absolute inset-0 overflow-hidden bg-[#000d20]">
        {loading && (
            <div className="absolute inset-0 z-20 flex flex-col justify-end pb-4 px-4 md:px-10">
              <div className="skeleton-shimmer h-6 w-1/3 mx-auto rounded mb-6 opacity-60" />
              <div className="w-full xl:w-9/12 mx-auto">
                <div className="flex gap-1 mb-0">
                  {[60, 50, 50, 65].map((w, i) => (
                    <div key={i} className="skeleton-shimmer h-8 rounded-t-sm opacity-50" style={{ width: w }} />
                  ))}
                </div>
                <div className="skeleton-shimmer h-16 w-full rounded-b-md rounded-tr-md opacity-60" />
              </div>
            </div>
          )}

          {/* ── mt.jpg: always rendered, fades out once ready ─────────────── */}
          <img
            src="/mt.jpg"
            alt=""
            style={{
              position:      "absolute",
              top:           0,
              left:          0,
              width:         "100%",
              minWidth:      "100%",
              height:        "100%",
              objectFit:     "cover",
              display:       "block",
              zIndex:        5,
              opacity:       isVisible ? 0 : 1,
              transition:    "opacity 0.9s ease-in-out",
              pointerEvents: "none",
            }}
          />

          {/* ── video stage: all <video> nodes live here permanently ────────── */}
          {/* z-index below mt.jpg while loading, above after ready             */}
          <div
            id="video-stage"
            className="absolute inset-0"
            style={{ zIndex: 2 }}
          >
            {/* Image banners (non-video) rendered as <img> inside the stage */}
            {isVisible && banners.map((banner, idx) => {
              if (banner.media_type === "video") return null;
              const isActive = idx === activeIdx;
              const isFading = idx === prevIdx;
              return (
                <img
                  key={banner.id}
                  src={banner.url}
                  alt={banner.title || ""}
                  style={{
                    position:       "absolute",
                    inset:          0,
                    width:          "100%",
                    height:         "100%",
                    objectFit:      "cover",
                    objectPosition: `50% ${banner.object_position ?? 50}%`,
                    opacity:        isActive ? 1 : 0,
                    transition:     isFading ? `opacity ${FADE_MS}ms ease-in-out` : "none",
                    zIndex:         isActive ? 2 : isFading ? 1 : 0,
                    willChange:     "opacity",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* ── overlay: title + dots ─────────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col justify-end items-center px-5 pb-10 bg-black/20"
          style={{ zIndex: 10 }}
        >
          {currentBanner?.title && (
            <h1 className="text-xs sm:text-sm md:text-2xl lg:text-3xl font-semibold text-white text-center animate-fade-infinite mb-3 tracking-tight drop-shadow-lg">
              {currentBanner.title}
            </h1>
          )}

        </div>

        {/* ── arrows ───────────────────────────────────────────────────────── */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => { clearTimeout(timerRef.current); advanceTo((activeIdx - 1 + banners.length) % banners.length); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-[#f2243d] text-white text-lg rounded-full w-8 h-8 flex items-center justify-center transition-all opacity-0 group-hover:opacity-80 hover:!opacity-100"
              style={{ zIndex: 20 }}
            >‹</button>
            <button
              onClick={() => { clearTimeout(timerRef.current); advanceTo((activeIdx + 1) % banners.length); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-[#f2243d] text-white text-lg rounded-full w-8 h-8 flex items-center justify-center transition-all opacity-0 group-hover:opacity-80 hover:!opacity-100"
              style={{ zIndex: 20 }}
            >›</button>
          </>
        )}

        {/* ── search bar ───────────────────────────────────────────────────── */}
        <div
          style={searchStyle}
          className="px-4 md:px-10"
          onMouseDown={() => { userClosedRef.current = false; setVisualScrolled(false); }}
        >
          <div ref={searchRef} className="w-full xl:w-9/12 mx-auto overflow-visible">
            <div className="flex items-end overflow-x-auto no-scrollbar">
              {TABS.map((tab, i) => (
                <button
                  key={tab.label}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => setActiveTab(i)}
                  className={[
                    "relative shrink-0 px-3 sm:px-5 py-2",
                    "text-xs sm:text-sm font-semibold whitespace-nowrap",
                    "rounded-t-sm transition-all duration-50 focus:outline-none",
                    activeTab === i
                      ? "bg-white text-red-700"
                      : "bg-red-700 text-white/80 hover:bg-black/40 hover:text-white",
                  ].join(" ")}
                >
                  {tab.label}
                  {activeTab === i && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-red-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
            <div className="rounded-b-md rounded-tr-md shadow-lg overflow-visible">
              <Search setFilterModal={openFilter} activeTab={TABS[activeTab]} />
            </div>
          </div>
        </div>
      </div>

      {/* spacer */}
      <div
        style={{
          height:     isPageScrolled ? Math.round(SEARCH_H / 2) + 12 : 0,
          transition: "height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      <Featured />
      <LatestProperties />
      {filterModal && <Model setFilterModal={setFilterModal} filterModal={filterModal} />}
    </div>
  );
};

export default MainHome;