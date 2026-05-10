import React, { useState, useEffect, useRef } from "react";
import Search from "../Common/SearchBox/HomeSearch";
import Model from "../FilterSearch/Model";
import Featured from "./Featured";
import Investment from "./Investment";
import LatestProperties from "./LatestProperties";
import "react-multi-carousel/lib/styles.css";

const API_BASE = process.env.REACT_APP_API_LINK;

const STATS = [
  { num: "10K+", label: "Properties Listed" },
  { num: "5K+",  label: "Happy Clients" },
  { num: "200+", label: "Verified Agents" },
  { num: "8+",   label: "Years of Trust" },
];

const MainHome = () => {
  const [filterModal, setFilterModal] = useState(false);
  const [banners, setBanners]         = useState([]);
  const [activeIdx, setActiveIdx]     = useState(0);
  const [loading, setLoading]         = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/banners`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setBanners(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setVideoLoaded(false); }, [activeIdx]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const current = banners[activeIdx];
    if (current?.media_type === "video") return;
    timerRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [banners, activeIdx]);

  const goTo    = (idx) => { clearInterval(timerRef.current); setActiveIdx(idx); };
  const current = banners[activeIdx] || null;

  const renderMedia = (banner) => {
    if (!banner) return null;
    const vertPos = banner.object_position ?? 50;
    const style   = { objectPosition: `50% ${vertPos}%`, objectFit: "cover" };
    const cls     = "w-full h-full transition-all duration-1000 ease-in-out";

    if (banner.media_type === "video") {
      return (
        <div className="relative w-full h-full bg-[#000d20]">
          <img src={banner.thumbnail_url || "/home-banner1.gif"}
            className={`absolute inset-0 ${cls} ${videoLoaded ? "opacity-0 scale-105" : "opacity-100"}`}
            alt="Banner" loading="eager" style={style} />
          <video key={banner.id}
            className={`absolute inset-0 ${cls} ${videoLoaded ? "opacity-100" : "opacity-0"}`}
            src={banner.url} autoPlay muted loop playsInline preload="auto"
            controlsList="nodownload" crossOrigin="anonymous" style={style}
            onCanPlayThrough={() => setVideoLoaded(true)} />
        </div>
      );
    }
    return (
      <img key={banner.id} src={banner.url} alt={banner.title || "Premium Property"}
        className={cls} style={style} />
    );
  };

  return (
    <div className="pt-0 overflow-x-hidden">
      <style>{`
        @keyframes bannerIn { from{opacity:0} to{opacity:1} }
        @keyframes heroUp { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
        .banner-in   { animation: bannerIn 0.9s ease both; }
        .hero-eyebrow{ animation: heroUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .hero-title  { animation: heroUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.28s both; }
        .hero-search { animation: scaleIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
        .bn-dot { width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.35);cursor:pointer;transition:all .3s;border:none; }
        .bn-dot.on { background:#fff;transform:scale(1.45); }
        .bn-btn { background:rgba(255,255,255,0.12);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.22);color:#fff;border-radius:50%;width:42px;height:42px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:20px;transition:all .3s; }
        .bn-btn:hover { background:var(--r);border-color:var(--r); }
        .search-float { background:rgba(255,255,255,0.97);backdrop-filter:blur(24px);border-radius:20px;box-shadow:0 32px 80px rgba(0,0,0,0.18),0 0 0 1px rgba(255,255,255,0.7); }
        .stat-sep { border-right:1px solid rgba(0,0,0,0.07); }
        .stat-sep:last-child { border-right:none; }
        @media(max-width:767px){
          .stat-sep:nth-child(2n){border-right:none}
          .stat-sep:nth-child(2n-1):not(:last-child){border-right:1px solid rgba(0,0,0,0.07)}
        }
      `}</style>

      {/* HERO */}
      <div className="relative w-full" style={{height:"min(100vh,500px)",minHeight:"380px"}}>
        <div className="absolute inset-0 bg-[#000d20]">
          {loading
            ? <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
            : current
              ? <div className="w-full h-full banner-in">{renderMedia(current)}</div>
              : <img src="/home-banner1.gif" alt="" className="w-full h-full object-cover" />
          }
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0"
          style={{background:"linear-gradient(160deg,rgba(0,0,0,.45) 0%,rgba(0,0,0,.08) 50%,rgba(0,0,0,.6) 100%)"}} />
        <div className="absolute bottom-0 left-0 right-0 h-48"
          style={{background:"linear-gradient(to top,rgba(0,0,0,.55),transparent)"}} />

        {/* Hero content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-5 pb-32 pt-20">
          {current?.title ? (
            <h1 className="hero-title text-white font-bold text-3xl md:text-5xl lg:text-6xl max-w-4xl leading-tight drop-shadow-2xl"
              style={{fontFamily:"'Cormorant Garamond',serif",letterSpacing:"-0.02em"}}>
              {current.title}
            </h1>
          ) : (
            <>
              <p className="hero-eyebrow text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-white/70 mb-4">
                Nepal's Premier Real Estate Platform
              </p>
              <h1 className="hero-title text-white font-bold text-4xl md:text-5xl lg:text-[62px] max-w-3xl leading-tight drop-shadow-2xl"
                style={{fontFamily:"'Cormorant Garamond',serif",letterSpacing:"-0.02em"}}>
                Find Your Dream Property in Nepal
              </h1>
            </>
          )}
        </div>

        {/* Slider arrows */}
        {banners.length > 1 && (
          <>
            <button className="bn-btn absolute left-4 md:left-8 top-1/2 -translate-y-1/2"
              onClick={() => goTo((activeIdx - 1 + banners.length) % banners.length)}>‹</button>
            <button className="bn-btn absolute right-4 md:right-8 top-1/2 -translate-y-1/2"
              onClick={() => goTo((activeIdx + 1) % banners.length)}>›</button>
          </>
        )}

        {/* Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2.5 items-center">
            {banners.map((_, i) => (
              <button key={i} className={`bn-dot ${i === activeIdx ? "on" : ""}`} onClick={() => goTo(i)} />
            ))}
          </div>
        )}
      </div>

      {/* FLOATING SEARCH */}
      <div className="px-4 md:px-8 flex justify-center relative z-20" style={{marginTop:"-56px"}}>
        <div className="search-float hero-search w-full max-w-5xl p-5 md:p-7">
          <Search setFilterModal={setFilterModal} />
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="mt-10 md:mt-14 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
            {STATS.map((s, i) => (
              <div key={i} className="stat-sep text-center py-8 px-4">
                <div className="text-3xl md:text-4xl font-bold mb-1.5"
                  style={{color:"var(--r)",fontFamily:"'Cormorant Garamond',serif"}}>
                  {s.num}
                </div>
                <div className="text-xs md:text-sm text-gray-500 font-medium tracking-wide uppercase">{s.label}</div>
              </div>
            ))}
          </div>
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
