import React, { useState, useEffect, useRef } from "react";
import Search from "../Common/SearchBox/HomeSearch";
import Model from "../FilterSearch/Model";
import Featured from "./Featured";
import Investment from "./Investment";
import LatestProperties from "./LatestProperties";
import "react-multi-carousel/lib/styles.css";

const API_BASE = process.env.REACT_APP_API_LINK;

const MainHome = () => {
  const [filterModal, setFilterModal] = useState(false);
  const [banners, setBanners] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/banners`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setBanners(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setVideoLoaded(false);
  }, [activeIdx]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const current = banners[activeIdx];
    if (current?.media_type === "video") return;
    timerRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [banners, activeIdx]);

  const goTo = (idx) => { clearInterval(timerRef.current); setActiveIdx(idx); };
  const current = banners[activeIdx] || null;

  const renderMedia = (banner) => {
    if (!banner) return null;

    const verticalPos = banner.object_position ?? 50;
    const dynamicMediaStyle = {
      objectPosition: `50% ${verticalPos}%`,
      objectFit: "cover"
    };
    const mediaClass = "w-full h-full mt-0 transition-all duration-1000 ease-in-out";

    if (banner.media_type === "video") {
      return (
        <div className="relative mt-0 top-0 w-full h-full bg-[#000d20]">
          <img
            src={banner.thumbnail_url || "/home-banner1.gif"}
            className={`absolute inset-0 ${mediaClass} ${videoLoaded ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
            alt="Banner Preview"
            loading="eager"
            style={dynamicMediaStyle}
          />
          <video
            key={banner.id}
            className={`absolute inset-0 ${mediaClass} ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            src={banner.url}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controlsList="nodownload"
            crossOrigin="anonymous"
            style={dynamicMediaStyle}
            onCanPlayThrough={() => setVideoLoaded(true)}
          />
        </div>
      );
    }

    return (
      <img
        key={banner.id}
        src={banner.url}
        alt={banner.title || "Premium Property"}
        className={mediaClass}
        style={dynamicMediaStyle}
      />
    );
  };

  return (
    // ✅ KEY CHANGE: removed pt-20 — banner now starts at top-0, behind transparent header
    <div className="pt-0">
      <style>{`
        @keyframes fadeInfinite {
          0%, 5%   { opacity:0; transform:translateY(15px); }
          20%, 80% { opacity:1; transform:translateY(0); }
          95%, 100%{ opacity:0; transform:translateY(15px); }
        }
        .animate-fade-infinite { animation: fadeInfinite 5s ease-in-out infinite; }
        .banner-in { animation: bannerIn 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes bannerIn { from{opacity:0} to{opacity:1} }
        .dot { width:7px; height:7px; border-radius:50%; background:rgba(255,255,255,0.3); cursor:pointer; transition:.3s; border:none; }
        .dot.on { background:#f2243d; transform:scale(1.3); }
      `}</style>

      {/* ✅ KEY CHANGE: increased height — h-96 md:h-[500px] to give room for header overlap */}
      <div className="w-full h-96 md:h-[500px] overflow-hidden relative">
        <div className="absolute inset-0 bg-[#000d20]">
          {loading ? (
            <div className="w-full h-full bg-[#eeeef1] animate-pulse" />
          ) : current ? (
            <div className="w-full h-full banner-in">{renderMedia(current)}</div>
          ) : (
            <img src="/home-banner3.gif" alt="" className="w-full h-full object-cover" />
          )}
        </div>

        {/* ✅ Overlay with extra top padding so text/dots don't hide behind header */}
        <div className="relative w-full h-full flex flex-col justify-end items-center px-5 pb-14 bg-black/20">
          {current?.title && (
            <h1 className="text-sm md:text-3xl font-semibold text-white text-center animate-fade-infinite mb-4 tracking-tight drop-shadow-lg">
              {current.title}
            </h1>
          )}
          {banners.length > 1 && (
            <div className="flex gap-2.5 items-center">
              {banners.map((_, i) => (
                <button key={i} className={`dot ${i === activeIdx ? "on" : ""}`} onClick={() => goTo(i)} />
              ))}
            </div>
          )}
        </div>

        {banners.length > 1 && (
          <>
            <button
              onClick={() => goTo((activeIdx - 1 + banners.length) % banners.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-[#f2243d] text-white text-xl rounded-full w-9 h-9 flex items-center justify-center transition-all opacity-70 hover:opacity-100"
            >‹</button>
            <button
              onClick={() => goTo((activeIdx + 1) % banners.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-[#f2243d] text-white text-xl rounded-full w-9 h-9 flex items-center justify-center transition-all opacity-70 hover:opacity-100"
            >›</button>
          </>
        )}
      </div>

      <div className="px-5 md:px-10 flex justify-center relative">
        <div className="w-full xl:w-9/12 -mt-16 md:-mt-24 rounded shadow-lg">
          <Search setFilterModal={setFilterModal} />
        </div>
      </div>

      <Featured />
      <Investment />
      <LatestProperties />
      {filterModal && <Model setFilterModal={setFilterModal} filterModal={filterModal} />}
    </div>
  );
};

export default MainHome;