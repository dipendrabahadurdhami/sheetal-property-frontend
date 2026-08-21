import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import ReactPaginate from "react-paginate";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  IoArrowForward,
  IoLocationOutline,
  IoHomeOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCallOutline,
  IoPersonOutline,
  IoDocumentTextOutline,
  IoBusinessOutline,
  IoHammerOutline,
  IoPricetagOutline,
  IoKeyOutline,
  IoSearchOutline,
  IoShieldCheckmarkOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import { Helmet } from "react-helmet";
import BlogStrip from "../components/SingleProduct/BlogStrip";
import HomeSearch from "../components/Common/SearchBox/HomeSearch";
import PropertyCard, { PropertyCardStyles, PropertyGrid, PropertyCardSkeleton } from "../components/card/PropertyCard";

const IMG   = process.env.REACT_APP_IMAGE_LINK || "";
const ITEMS = 12;

const getImages = (property) => {
  const imgs = [];
  if (property?.images?.length) {
    property.images.forEach((img) => {
      const src = img.filename
        ? `${IMG}images/property/main/${img.filename}`
        : img.url || img.src;
      if (src) imgs.push(src);
    });
  }
  if (!imgs.length && property?.feature_image) {
    imgs.push(
      property.feature_image.startsWith("http")
        ? property.feature_image
        : `${IMG}images/property/main/${property.feature_image}`
    );
  }
  return imgs.length ? imgs : ["/unsplash.png"];
};

/* ─── Hero Slideshow ───────────────────────────────────── */
const HeroSlideshow = ({ images }) => {
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState(null);
  const timer = useRef(null);

  const go = useCallback((next) => {
    if (next === idx) return;
    setPrev(idx);
    setIdx(next);
    setTimeout(() => setPrev(null), 900);
  }, [idx]);

  useEffect(() => {
    if (images.length < 2) return;
    timer.current = setInterval(() => {
      setIdx(cur => {
        const next = (cur + 1) % images.length;
        setPrev(cur);
        setTimeout(() => setPrev(null), 900);
        return next;
      });
    }, 5200);
    return () => clearInterval(timer.current);
  }, [images.length]);

  const slides = images.length ? images : ["/unsplash.png"];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#c8cdd6" }}>
      {prev !== null && (
        <img src={slides[prev]} alt=""
          onError={e => { e.target.src = "/unsplash.png"; }}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%", objectFit: "cover",
            opacity: 0, transition: "opacity 0.9s ease", zIndex: 1,
          }}
        />
      )}
      <img key={idx} src={slides[idx]} alt="Sale property"
        onError={e => { e.target.src = "/unsplash.png"; }}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%", objectFit: "cover",
          zIndex: 2, animation: "saleKenBurns 6s ease forwards",
        }}
      />
      <div style={{
        position: "absolute", inset: 0, zIndex: 3,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.55) 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, zIndex: 4,
        display: "flex", alignItems: "center", justifyContent: "center",
        paddingBottom: 40, paddingLeft: 16, paddingRight: 16,
      }}>
        <h1 className="sale-hero-title">
          Find Your Perfect Property for Sale in Nepal
        </h1>
      </div>

      {slides.length > 1 && (
        <>
          <button onClick={() => go((idx - 1 + slides.length) % slides.length)}
            className="sale-hero-btn sale-hero-btn--left"
          >
            <IoChevronBackOutline size={14} color="#fff" />
          </button>
          <button onClick={() => go((idx + 1) % slides.length)}
            className="sale-hero-btn sale-hero-btn--right"
          >
            <IoChevronForwardOutline size={14} color="#fff" />
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div style={{
          position: "absolute", bottom: 16, left: "50%",
          transform: "translateX(-50%)", zIndex: 5, display: "flex", gap: 6,
        }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => go(i)} style={{
              width: i === idx ? 18 : 6, height: 6, borderRadius: 4,
              border: "none", padding: 0, cursor: "pointer",
              background: i === idx ? "#E02424" : "rgba(255,255,255,0.55)",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════ */
const Sale = () => {
  const [params, setParams]         = useSearchParams();
  const navigate                    = useNavigate();
  const [properties, setProperties] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [total, setTotal]           = useState(0);
  const [pageCount, setPageCount]   = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const page = params.get("page") || 1;
        const kw   = params.get("keyword");
        let res;
        if (kw) {
          const q = new URLSearchParams();
          q.set("advertisement_purpose", "sale");
          q.set("keyword", kw);
          q.set("page", page);
          q.set("per_page", ITEMS);
          res = await apiClient.get(`/search?${q}`);
        } else {
          res = await apiClient.get(`/sale?page=${page}&per_page=${ITEMS}`);
        }
        if (res.status === 200) {
          const data = res.data?.data || [];
          setProperties(data);
          setTotal(res.data?.meta?.total || 0);
          setPageCount(Math.ceil((res.data?.meta?.total || 0) / ITEMS));
          if (!kw && Number(page) === 1) {
            const imgs = [];
            for (const p of data.slice(0, 8)) {
              const pi = getImages(p);
              if (pi[0] !== "/unsplash.png") imgs.push(pi[0]);
            }
            if (imgs.length) setHeroImages(imgs);
          }
        }
      } catch { setProperties([]); }
      finally { setLoading(false); }
    };
    load();
  }, [params]);

  const handlePage = (ev) => {
    const cur = Object.fromEntries([...params]);
    setParams({ ...cur, page: ev.selected + 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearSearch = () => setParams({});

  return (
    <>
      <PropertyCardStyles />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

        .sale-root {
          font-family: 'Outfit', system-ui, sans-serif;
          background: #F7F8FA;
          -webkit-font-smoothing: antialiased;
          margin-top: 65px;
        }

        .sale-root *:not(.sale-search-outer, .sale-search-outer *) {
          box-sizing: border-box;
        }

        @keyframes sale-spin  { to { transform: rotate(360deg); } }
        @keyframes saleKenBurns {
          from { transform: scale(1.04); }
          to   { transform: scale(1.0);  }
        }
        @keyframes saleFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        .sale-hero-wrap {
          position: relative;
          height: 55vh;
          min-height: 260px;
          max-height: 520px;
          background: #c8cdd6;
        }

        .sale-hero-title {
          font-size: clamp(18px, 5.5vw, 38px);
          font-weight: 800;
          color: #fff;
          text-align: center;
          letter-spacing: -0.3px;
          line-height: 1.2;
          text-shadow: 0 2px 16px rgba(0,0,0,0.35);
          animation: saleFadeUp 0.8s ease both;
          max-width: 520px;
          padding: 0;
        }

        .sale-hero-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-58%);
          z-index: 5;
          background: rgba(255,255,255,0.16);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255,255,255,0.28);
          border-radius: 4px;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          min-width: 44px;
          min-height: 44px;
        }
        .sale-hero-btn--left  { left: 10px; }
        .sale-hero-btn--right { right: 10px; }
        .sale-hero-btn:hover  { background: rgba(255,255,255,0.3); }

        .sale-search-outer {
          width: 100%;
          position: sticky;
          top: 0;
          z-index: 100;
          background: #fff;
          border-bottom: 1px solid #E4E6EA;
          box-shadow: 0 1px 8px rgba(0,0,0,0.06);
          padding: 12px 32px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .sale-search-inner { width: 100%; max-width: 860px; overflow: visible; }
        .sale-search-count {
          margin-top: 6px; font-size: 11px; color: #9CA3AF;
          font-family: 'Outfit', sans-serif; text-align: center;
        }
        .sale-search-count strong { color: #374151; font-weight: 700; }

        .sale-why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
        }
        .sale-why-item {
          padding: 28px 32px;
          border-right: 1px solid #E4E6EA;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .sale-why-item:last-child { border-right: none; }

        .sale-chip {
          display: inline-block;
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #E02424; background: #FEF2F2;
          border: 1px solid #FECACA;
          padding: 3px 8px; border-radius: 4px;
        }

        .sale-ring {
          width: 30px; height: 30px;
          border: 2.5px solid #FECACA; border-top-color: #E02424;
          border-radius: 50%;
          animation: sale-spin 0.65s linear infinite;
          margin: 0 auto 12px;
        }

        .sale-pager { display: flex; justify-content: center; margin-top: 40px; }
        .sale-pager .pagination {
          display: flex; align-items: center; gap: 5px;
          list-style: none; padding: 0;
        }
        .sale-pager li a {
          display: flex; align-items: center; justify-content: center;
          min-width: 36px; height: 36px; padding: 0 10px;
          border: 1.5px solid #E4E6EA; background: #fff;
          color: #374151; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.15s;
          text-decoration: none; border-radius: 4px;
          font-family: 'Outfit', sans-serif;
        }
        .sale-pager li a:hover      { border-color: #E02424; color: #E02424; }
        .sale-pager .selected a     { background: #E02424; border-color: #E02424; color: #fff !important; }
        .sale-pager .disabled a     { opacity: 0.3; pointer-events: none; }

        .sale-section {
          padding: 28px 32px;
          max-width: 1240px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        .sale-quicklinks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
          gap: 9px;
        }

        .sale-cta-row {
          max-width: 1240px; margin: 0 auto;
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 24px;
        }
        .sale-cta-btns { display: flex; gap: 9px; flex-wrap: wrap; }

        @media (max-width: 768px) {
          .sale-root { margin-top: 56px; }
          .sale-hero-wrap { height: 52vw; min-height: 200px; max-height: 300px; }
          .sale-search-outer { padding: 8px 10px 10px; position: sticky; top: 0; }
          .sale-why-grid {
            display: flex; flex-direction: row; overflow-x: auto;
            -webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory;
            gap: 0; scrollbar-width: none; -ms-overflow-style: none;
          }
          .sale-why-grid::-webkit-scrollbar { display: none; }
          .sale-why-item {
            min-width: 80vw; max-width: 320px; scroll-snap-align: start;
            border-right: 1px solid #E4E6EA; border-bottom: none;
            padding: 16px 16px; flex-shrink: 0;
          }
          .sale-why-item:last-child { border-right: none; }
          .sale-section { padding: 18px 12px; }
          .sale-quicklinks-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .sale-quicklinks-section { padding: 24px 12px !important; }
          .sale-cta-row { flex-direction: column; align-items: stretch; gap: 16px; }
          .sale-cta-btns { width: 100%; flex-direction: column; gap: 8px; }
          .sale-cta-btns button { width: 100% !important; justify-content: center; padding: 13px 16px !important; font-size: 12px !important; border-radius: 6px !important; }
          .sale-cta-section { padding: 32px 12px !important; }
          .sale-blog-section { padding: 24px 12px !important; }
          .sale-pager li a { min-width: 38px; height: 38px; font-size: 11px; }
          .sale-pager .pagination { gap: 3px; }
        }

        @media (max-width: 420px) {
          .sale-hero-wrap { min-height: 180px; max-height: 260px; }
          .sale-section { padding: 14px 10px; }
          .sale-why-item { min-width: 86vw; padding: 14px 14px; }
          .sale-search-outer { padding: 7px 8px 8px; }
          .sale-quicklinks-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .sale-section { padding: 22px 20px; }
          .sale-search-outer { padding: 10px 20px 12px; }
          .sale-why-grid { grid-template-columns: repeat(2, 1fr); gap: 0; }
          .sale-why-item { border-right: 1px solid #E4E6EA; border-bottom: 1px solid #E4E6EA; padding: 20px 22px; }
          .sale-why-item:nth-child(2n) { border-right: none; }
          .sale-why-item:nth-last-child(-n+2) { border-bottom: none; }
          .sale-why-item:last-child { border-right: none; border-bottom: none; }
          .sale-quicklinks-grid { grid-template-columns: repeat(3, 1fr); }
          .sale-quicklinks-section { padding: 28px 20px !important; }
          .sale-cta-row { gap: 20px; }
          .sale-cta-btns { gap: 8px; }
          .sale-cta-btns button { padding: 11px 16px !important; font-size: 11px !important; }
          .sale-cta-section { padding: 40px 20px !important; }
          .sale-blog-section { padding: 28px 20px !important; }
        }
      `}</style>

      <div className="sale-root">
        <Helmet>
          <title>Buy Property in Nepal — Houses, Land & Apartments for Sale | Sheetal Property Nepal</title>
          <meta name="description" content={`Find ${total > 0 ? total : "thousands of"} verified properties for sale in Nepal. Browse houses, land, apartments and commercial properties in Kathmandu, Pokhara and across Nepal.`} />
          <meta name="keywords" content="property for sale Nepal, house for sale Kathmandu, land for sale Nepal, apartment for sale Kathmandu, buy property Nepal, real estate Nepal, Sheetal Property" />
          <link rel="canonical" href="https://sheetalproperty.com/sale" />
          <meta property="og:title" content="Buy Property in Nepal | Sheetal Property Nepal" />
          <meta property="og:description" content="Find verified properties for sale across Nepal. Houses, land, apartments and commercial properties." />
          <meta property="og:url" content="https://sheetalproperty.com/sale" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Sheetal Property Nepal" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="Buy Property in Nepal | Sheetal Property Nepal" />
        </Helmet>

        {/* ══ HERO ═══════════════════════════════════════════ */}
        <div className="sale-hero-wrap">
          <HeroSlideshow images={heroImages} />
        </div>

        {/* ══ SEARCH BAR ═════════════════════════════════════ */}
        <div className="sale-search-outer">
          <div className="sale-search-inner">
            <HomeSearch
              showFilters={true}
              activeTab={{ advertisement_purpose: "sale" }}
              navigateOnFilter={true}
            />
          </div>
          {total > 0 && (
            <p className="sale-search-count">
              <strong>{total}</strong> properties available for sale
            </p>
          )}
        </div>

        {/* ══ WHY BUY STRIP ══════════════════════════════════ */}
        <section style={{ background: "#fff", borderBottom: "1px solid #E4E6EA" }}>
          <div className="sale-why-grid" style={{ maxWidth: 1240, margin: "10px auto", padding: "0 32px" }}>
            {[
              { icon: <IoSearchOutline size={20} color="#E02424" />, title: "Extensive Listings", desc: "Thousands of verified properties for sale across Nepal's most sought-after locations." },
              { icon: <IoShieldCheckmarkOutline size={20} color="#E02424" />, title: "Verified Properties", desc: "Every listing is vetted by our team — legal clearance and title deed confirmed." },
              { icon: <IoTrendingUpOutline size={20} color="#E02424" />, title: "Best Market Prices", desc: "Get access to fair market pricing data so you always make an informed decision." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="sale-why-item">
                <div style={{ width: 40, height: 40, borderRadius: 4, background: "#FEF2F2", border: "1px solid #FECACA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 11.5, color: "#64748B", lineHeight: 1.65 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ LISTINGS ═══════════════════════════════════════ */}
        <section className="sale-section" style={{ width: "100%" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 22, paddingBottom: 16, borderBottom: "1px solid #E4E6EA" }}>
            <div>
              <span className="sale-chip" style={{ display: "inline-block", marginBottom: 8 }}>All Listings</span>
              <h2 style={{ fontSize: "clamp(16px, 2vw, 22px)", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.4px" }}>
                {loading ? "Loading…" : `${total} Propert${total === 1 ? "y" : "ies"} for Sale`}
              </h2>
            </div>
          </div>

          {/* skeleton */}
          {loading && (
            <PropertyGrid>
              {Array.from({ length: ITEMS }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </PropertyGrid>
          )}

          {/* cards */}
          {!loading && properties.length > 0 && (
            <PropertyGrid>
              {properties.map((p, i) => (
                <PropertyCard key={p.id || i} property={p} />
              ))}
            </PropertyGrid>
          )}

          {/* empty */}
          {!loading && properties.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ width: 46, height: 46, borderRadius: 4, background: "#FEF2F2", border: "1px solid #FECACA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <IoHomeOutline size={18} color="#E02424" />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>No Properties Found</h3>
              <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 16 }}>Try a different search term</p>
              <button onClick={clearSearch} style={{ background: "#E02424", color: "#fff", border: "none", padding: "10px 22px", fontSize: 11, fontWeight: 700, borderRadius: 4, cursor: "pointer", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                View All Properties
              </button>
            </div>
          )}

          {!loading && pageCount > 1 && (
            <div className="sale-pager">
              <ReactPaginate
                breakLabel="…"
                nextLabel={<FaChevronRight size={10} />}
                previousLabel={<FaChevronLeft size={10} />}
                onPageChange={handlePage}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageCount={pageCount}
                forcePage={Math.max(0, (Number(params.get("page")) || 1) - 1)}
                renderOnZeroPageCount={null}
                className="pagination"
              />
            </div>
          )}
        </section>

        {/* ══ QUICK LINKS ════════════════════════════════════ */}
        <section className="sale-quicklinks-section" style={{ background: "#fff", borderTop: "1px solid #E4E6EA", borderBottom: "1px solid #E4E6EA", padding: "32px 0" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 0px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 12.5, fontWeight: 800, color: "#0F172A" }}>Quick Links</h3>
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>Popular sections</span>
            </div>
            <div className="sale-quicklinks-grid">
              {[
                { label: "Rent Property",     icon: <IoKeyOutline size={13} />,          path: "/rent" },
                { label: "Investment",         icon: <IoPricetagOutline size={13} />,     path: "/invest" },
                { label: "New Projects",       icon: <IoHammerOutline size={13} />,       path: "/new-projects" },
                { label: "Commercial",         icon: <IoBusinessOutline size={13} />,     path: "/commercial" },
                { label: "Find an Agent",      icon: <IoPersonOutline size={13} />,       path: "/agents" },
                { label: "Submit Requirement", icon: <IoDocumentTextOutline size={13} />, path: "/requirementForm?agent_id=1" },
              ].map(({ label, icon, path }) => (
                <button key={label} onClick={() => navigate(path)} style={{ background: "#F7F8FA", border: "1px solid #E4E6EA", borderRadius: 6, padding: "12px 12px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 11.5, fontWeight: 600, color: "#374151", transition: "all 0.15s", textAlign: "left", WebkitTapHighlightColor: "rgba(224,36,36,0.08)", minHeight: 44 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#E02424"; e.currentTarget.style.color = "#E02424"; e.currentTarget.style.background = "#FEF2F2"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E4E6EA"; e.currentTarget.style.color = "#374151"; e.currentTarget.style.background = "#F7F8FA"; }}
                >
                  <span style={{ color: "#E02424", display: "flex", flexShrink: 0 }}>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BLOGS ══════════════════════════════════════════ */}
        <section className="sale-blog-section" style={{ background: "#F7F8FA", padding: "40px 0", borderBottom: "1px solid #E4E6EA" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 0px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #E4E6EA", flexWrap: "wrap", gap: 12 }}>
              <div>
                <span className="sale-chip" style={{ display: "inline-block", marginBottom: 8 }}>From Our Blog</span>
                <h2 style={{ fontSize: "clamp(15px, 1.8vw, 19px)", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.3px" }}>
                  Property Buying Guides &amp; Tips
                </h2>
              </div>
              <button onClick={() => navigate("/blog")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: "#E02424", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5, padding: 0, minHeight: 44 }}>
                View All <IoArrowForward size={11} />
              </button>
            </div>
            <BlogStrip />
          </div>
        </section>

        {/* ══ CTA ════════════════════════════════════════════ */}
        <section className="sale-cta-section" style={{ background: "#fff", borderBottom: "1px solid #E4E6EA", padding: "52px 0" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 0px" }}>
            <div className="sale-cta-row">
              <div style={{ maxWidth: 480 }}>
                <span className="sale-chip" style={{ display: "inline-block", marginBottom: 12 }}>Get Started Today</span>
                <h2 style={{ fontSize: "clamp(19px, 2.4vw, 28px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px", lineHeight: 1.15, marginBottom: 9 }}>
                  Ready to Find Your <span style={{ color: "#E02424" }}>Dream Property?</span>
                </h2>
                <p style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.75, maxWidth: 380 }}>
                  Our experts guide you from property search to closing — no obligation, completely free.
                </p>
              </div>
              <div className="sale-cta-btns">
                <button onClick={() => navigate("/requirementForm?agent_id=1")} style={{ background: "#E02424", color: "#fff", border: "none", padding: "12px 22px", fontSize: 11.5, fontWeight: 700, borderRadius: 4, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif", transition: "background 0.15s", display: "flex", alignItems: "center", gap: 7 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#C01A1A"}
                  onMouseLeave={e => e.currentTarget.style.background = "#E02424"}
                >
                  <IoDocumentTextOutline size={13} /> Submit Requirement
                </button>
                <button onClick={() => navigate("/agents")} style={{ background: "#fff", color: "#374151", border: "1.5px solid #E4E6EA", padding: "12px 22px", fontSize: 11.5, fontWeight: 600, borderRadius: 4, cursor: "pointer", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 7 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#374151"; e.currentTarget.style.color = "#0F172A"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E4E6EA"; e.currentTarget.style.color = "#374151"; }}
                >
                  <IoPersonOutline size={13} /> Find an Agent
                </button>
                <button onClick={() => navigate("/contact")} style={{ background: "#F7F8FA", color: "#374151", border: "1.5px solid #E4E6EA", padding: "12px 22px", fontSize: 11.5, fontWeight: 600, borderRadius: 4, cursor: "pointer", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", transition: "background 0.15s", display: "flex", alignItems: "center", gap: 7 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#EAEBEE"}
                  onMouseLeave={e => e.currentTarget.style.background = "#F7F8FA"}
                >
                  <IoCallOutline size={13} /> Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Sale;