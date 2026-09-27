import React, { useState, useEffect, useRef, useCallback } from "react";
import Search from "../Common/SearchBox/HomeSearch";
import Model from "../FilterSearch/Model";
import Featured from "./Featured";
import LatestProperties from "./LatestProperties";
import RentSection from "./RentSection";
import SaleSection from "./SaleSection";
import "react-multi-carousel/lib/styles.css";

const API_BASE = process.env.REACT_APP_API_LINK;
const SEARCH_H = 64;
const IMG_DURATION = 5000;
const FADE_MS = 700;

const TABS = [
  { label: "All", advertisement_purpose: null },
  { label: "Sale", advertisement_purpose: "Sale" },
  { label: "Rent", advertisement_purpose: "Rent" },
  { label: "Invest", advertisement_purpose: "Invest" },
];

const isFullyBuffered = (vid) => {
  try {
    if (!vid.duration || !isFinite(vid.duration)) return false;
    if (!vid.buffered || vid.buffered.length === 0) return false;
    return vid.buffered.end(vid.buffered.length - 1) >= vid.duration - 0.15;
  } catch {
    return false;
  }
};

const MainHome = () => {
  const [filterModal, setFilterModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [banners, setBanners] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(null);
  const [allReady, setAllReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [bannerH, setBannerH] = useState(0);
  const [bannerReady, setBannerReady] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  const [searchActive, setSearchActive] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const videoRefs = useRef({});
  const readyMap = useRef({});
  const videoTotal = useRef(0);
  const timerRef = useRef(null);
  const fadingRef = useRef(false);
  const bannerRef = useRef(null);
  const searchRef = useRef(null);
  const bannersRef = useRef([]);
  const activeIdxRef = useRef(0);

  bannersRef.current = banners;
  activeIdxRef.current = activeIdx;

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    if (!bannerRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      const h = e.contentRect.height;
      setBannerH(h);
      if (h > 0) setBannerReady(true);
    });
    ro.observe(bannerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const fn = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
      if (isScrolled) setSearchActive(false);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchActive(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const advanceTo = useCallback((targetIdx) => {
    if (fadingRef.current) return;
    fadingRef.current = true;
    const current = activeIdxRef.current;
    const leavingVid = videoRefs.current[current];
    const incomingVid = videoRefs.current[targetIdx];
    if (incomingVid) { incomingVid.currentTime = 0; incomingVid.play().catch(() => { }); }
    setPrevIdx(current);
    setActiveIdx(targetIdx);
    setTimeout(() => {
      setPrevIdx(null);
      fadingRef.current = false;
      if (leavingVid) { leavingVid.pause(); leavingVid.currentTime = 0; }
    }, FADE_MS);
  }, []);

  const scheduleNext = useCallback((idx, arr) => {
    clearTimeout(timerRef.current);
    if (!arr || arr.length <= 1) return;
    if (arr[idx]?.media_type !== "video") {
      timerRef.current = setTimeout(() => {
        advanceTo((activeIdxRef.current + 1) % arr.length);
      }, IMG_DURATION);
    }
  }, [advanceTo]);

  const setupVideos = useCallback((arr) => {
    const vids = arr.filter((b) => b.media_type === "video");
    videoTotal.current = vids.length;
    if (vids.length === 0) { setAllReady(true); return; }
    const checkDone = () => {
      if (Object.keys(readyMap.current).length >= videoTotal.current) setAllReady(true);
    };
    arr.forEach((banner, idx) => {
      if (banner.media_type !== "video") return;
      if (videoRefs.current[idx]) return;
      const vid = document.createElement("video");
      vid.src = banner.url; vid.muted = true; vid.playsInline = true;
      vid.preload = "auto"; vid.loop = false; vid.crossOrigin = "anonymous";
      Object.assign(vid.style, {
        position: "absolute", top: "0", left: "0", width: "100%", height: "100%",
        minWidth: "100%", objectFit: "cover",
        objectPosition: `50% ${banner.object_position ?? 50}%`,
        opacity: "0", pointerEvents: "none", willChange: "opacity",
        transition: "none", display: "block",
      });
      videoRefs.current[idx] = vid;
      let marked = false;
      const markReady = () => {
        if (marked) return; marked = true; readyMap.current[idx] = true; checkDone();
      };
      const checkBuffer = () => { if (isFullyBuffered(vid)) markReady(); };
      vid.addEventListener("progress", checkBuffer);
      vid.addEventListener("suspend", checkBuffer);
      vid.addEventListener("canplaythrough", checkBuffer);
      setTimeout(markReady, 20000);
      vid.load();
    });
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/banners`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) { setBanners(data); setupVideos(data); } })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [setupVideos]);

  useEffect(() => {
    if (!allReady || banners.length === 0) return;
    const raf = requestAnimationFrame(() => {
      const stage = document.getElementById("video-stage");
      if (!stage) return;
      banners.forEach((_, idx) => {
        const vid = videoRefs.current[idx];
        if (vid && !stage.contains(vid)) stage.appendChild(vid);
      });
      const first = videoRefs.current[0];
      if (first) { first.style.opacity = "1"; first.currentTime = 0; first.play().catch(() => { }); }
      scheduleNext(0, banners);
    });
    return () => cancelAnimationFrame(raf);
  }, [allReady]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!allReady) return;
    banners.forEach((_, idx) => {
      const vid = videoRefs.current[idx];
      if (!vid) return;
      if (idx === activeIdx) {
        vid.style.transition = "none"; vid.style.opacity = "1"; vid.style.zIndex = "2";
      } else if (idx === prevIdx) {
        vid.style.transition = `opacity ${FADE_MS}ms ease-in-out`; vid.style.opacity = "0"; vid.style.zIndex = "1";
      } else {
        vid.style.transition = "none"; vid.style.opacity = "0"; vid.style.zIndex = "0";
      }
    });
  }, [activeIdx, prevIdx, allReady, banners]);

  useEffect(() => {
    if (!allReady) return;
    scheduleNext(activeIdx, banners);
  }, [activeIdx, allReady, banners, scheduleNext]);

  useEffect(() => {
    if (!allReady) return;
    banners.forEach((banner, idx) => {
      if (banner.media_type !== "video") return;
      const vid = videoRefs.current[idx];
      if (!vid) return;
      const handler = () => {
        if (activeIdxRef.current === idx) advanceTo((idx + 1) % bannersRef.current.length);
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

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      Object.values(videoRefs.current).forEach((vid) => { vid.pause(); vid.src = ""; vid.remove(); });
    };
  }, []);

  const isAtBottom = !searchActive || scrolled || filterModal;
  const centeredTop = bannerH ? Math.round((bannerH - SEARCH_H) / 1.2) : null;
  const scrolledTop = bannerH ? bannerH - SEARCH_H : 0;

  const searchStyle = {
    position: "absolute",
    left: 0,
    right: 0,
    top: isAtBottom ? scrolledTop : centeredTop,
    transition: (bannerReady && centeredTop !== null && hasInteracted)
      ? "top 0.45s cubic-bezier(0.4, 0, 0.2, 1)"
      : "none",
    zIndex: 50,
    visibility: centeredTop === null ? "hidden" : "visible",
  };

  const handleSearchOpen = () => { setHasInteracted(true); setSearchActive(true); };
  const openFilter = (val) => { setFilterModal(val); if (val) setSearchActive(false); };

  const currentBanner = banners[activeIdx] || null;
  const isVisible = allReady && !loading;

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
        @media (max-width: 767px) {
          .banner-wrapper {
            height: auto !important;
            aspect-ratio: 16 / 9;
            overflow: hidden !important;
          }
        }
      `}</style>

      {/* ── BANNER ── */}
      <div
        ref={bannerRef}
        className="banner-wrapper w-full h-52 sm:h-64 md:h-[380px] lg:h-[420px] relative overflow-visible group"
      >
        <div className="absolute inset-0 overflow-hidden bg-[#000d20]">
          <img
            src="/mt.webp" alt=""
            style={{
              position: "absolute", top: 0, left: 0, width: "100%", minWidth: "100%",
              height: "100%", objectFit: "cover", display: "block", zIndex: 5,
              opacity: isVisible ? 0 : 1, transition: "opacity 0.9s ease-in-out", pointerEvents: "none",
            }}
          />
          <div id="video-stage" className="absolute inset-0" style={{ zIndex: 2 }}>
            {isVisible && banners.map((banner, idx) => {
              if (banner.media_type === "video") return null;
              const isActive = idx === activeIdx;
              const isFading = idx === prevIdx;
              return (
                <img key={banner.id} src={banner.url} alt={banner.title || ""}
                  style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%",
                    objectFit: "cover", objectPosition: `50% ${banner.object_position ?? 50}%`,
                    opacity: isActive ? 1 : 0,
                    transition: isFading ? `opacity ${FADE_MS}ms ease-in-out` : "none",
                    zIndex: isActive ? 2 : isFading ? 1 : 0, willChange: "opacity",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* overlay */}
        <div className="absolute inset-0 flex flex-col justify-end items-center px-5 pb-10 bg-black/20" style={{ zIndex: 10 }}>
          {currentBanner?.title && (
            <h1 className="text-xs sm:text-sm md:text-2xl lg:text-3xl font-semibold text-white text-center animate-fade-infinite mb-3 tracking-tight drop-shadow-lg">
              {currentBanner.title}
            </h1>
          )}
        </div>

        {/* arrows */}
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

        {/* ── DESKTOP search bar (unchanged) ── */}
        {!isMobile && (
          <div style={searchStyle} className="px-4 md:px-10" onMouseDown={handleSearchOpen}>
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
        )}
      </div>

      {/* ── MOBILE: native app card overlapping banner ── */}
      {isMobile && (
        <div
          style={{
            margin: "0 12px",
            margin: "0 12px",
            position: "relative",
            zIndex: 40,
          }}
          onMouseDown={handleSearchOpen}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 4,
              boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
              border: "1px solid rgba(0,0,0,0.07)",
              overflow: "visible",
            }}
          >
            {/* Tab row inside card */}
            <div style={{ display: "flex", gap: 4, padding: "10px 10px 0" }}>
              {TABS.map((tab, i) => (
                <button
                  key={tab.label}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => setActiveTab(i)}
                  style={{
                    flex: 1,
                    padding: "8px 4px",
                    borderRadius: 4,
                    border: "none",
                    background: activeTab === i ? "#b91c1c" : "#f3f4f6",
                    color: activeTab === i ? "#ffffff" : "#6b7280",
                    fontSize: 12,
                    fontWeight: activeTab === i ? 600 : 400,
                    cursor: "pointer",
                    transition: "background 0.12s ease, color 0.12s ease",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Thin rule */}
            <div style={{ height: 1, background: "#f3f4f6", margin: "10px 0 0" }} />

            {/* Search component — borderless on mobile (handled inside InputBox) */}
            <div ref={searchRef} style={{ overflow: "visible" }}>
              <Search setFilterModal={openFilter} activeTab={TABS[activeTab]} />
            </div>
          </div>
        </div>
      )}

      {/* desktop spacer */}
      {!isMobile && (
        <div style={{
          height: !isAtBottom ? Math.round(SEARCH_H / 2) + 12 : 0,
          transition: hasInteracted ? "height 0.45s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
        }} />
      )}

      <Featured />
      <LatestProperties />
      <SaleSection />
      <RentSection />
      {filterModal && <Model setFilterModal={setFilterModal} filterModal={filterModal} />}
    </div>
    
  );
  
};

export default MainHome;