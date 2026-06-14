import React, { useEffect, useState, useRef, useCallback } from "react";
import UserHead from "../components/SingleProduct/UserHead";
import Description from "../components/SingleProduct/Description";
import ScheduleTour from "../components/scheduleTour/ScheduleTour";
import ContactModel from "../components/SingleProduct/ContactModel";
import ProductLocation from "../components/SingleProduct/ProductLocation";
import {
  HeroSlideshow,
  ThumbnailStrip,
  AllPhotosOverlay,
  Lightbox,
} from "../components/SingleProduct/ImageGallery";
import PropertyHighlight from "../components/SingleProduct/PropertyHighlight";
import Details from "../components/SingleProduct/Details";
import ToolsWidget from "../components/SingleProduct/ToolsWidget";
import RelatedProperties from "../components/SingleProduct/RelatedProperties";
import BlogStrip from "../components/SingleProduct/BlogStrip";
import ReviewComponent from "../components/SingleProduct/review/ReviewComponent";
import ProductMap from "../components/SingleProduct/Details/ProductMap";
import YoutubeVideo from "../components/SingleProduct/Video";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import Loader from "../components/Loader";
import headTag from "../headTag";
import { FaMapMarkerAlt, FaPhoneAlt, FaBookmark, FaShareAlt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const NAV_H      = 65;
const USERHEAD_H = 50;
const TABNAV_H   = 44;
const STICKY_TOP = NAV_H + USERHEAD_H + TABNAV_H;

const TABS = [
  { id: "sec-overview",   label: "Overview"   },
  { id: "sec-highlights", label: "Highlights" },
  { id: "sec-details",    label: "Details"    },
  { id: "sec-video",      label: "Video Tour" },
  { id: "sec-map",        label: "Location"   },
  { id: "sec-related",    label: "Similar"    },
];

/* ─────────────────────────────────────────
   GLOBAL CSS — mobile-first, single map
───────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --r:       #e74c3c;
    --r-hover: #d44032;
    --r-soft:  rgba(231,76,60,0.07);
    --ink:     #0f0f0f;
    --ink-2:   #3a3a3a;
    --ink-3:   #888;
    --line:    #e6e6e6;
    --surface: #fff;
  }

  /* ── Tab nav ── */
  .sp-tabnav::-webkit-scrollbar { display: none; }

  .sp-tab {
    flex-shrink: 0;
    padding: 0 12px;
    height: 100%;
    border: none;
    border-bottom: 2px solid transparent;
    background: transparent;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-3);
    transition: color 0.15s, border-color 0.15s;
    white-space: nowrap;
  }
  .sp-tab:hover  { color: var(--ink-2); }
  .sp-tab.active { color: var(--r); border-bottom-color: var(--r); }

  /* ── Section heading ── */
  .sp-heading {
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--line);
  }
  .sp-heading__kicker {
    display: block;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--r);
    margin-bottom: 5px;
  }
  .sp-heading__title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 18px;
    font-weight: 400;
    color: var(--ink);
    margin: 0;
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  /* ── Side card ── */
  .sp-sidecard {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 4px;
    overflow: hidden;
  }
  .sp-sidecard__head {
    padding: 10px 14px;
    border-bottom: 1px solid #f0f0f0;
    background: #fafafa;
  }
  .sp-sidecard__head-label {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-2);
  }

  /* ── Buttons ── */
  .sp-cta {
    flex: 1;
    height: 44px;
    background: var(--r);
    color: #fff;
    border: none;
    border-radius: 4px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: background 0.14s;
  }
  .sp-cta:hover  { background: var(--r-hover); }
  .sp-cta:active { opacity: 0.9; }

  .sp-icon-btn {
    width: 44px;
    height: 44px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 4px;
    cursor: pointer;
    color: var(--ink-3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.14s, color 0.14s;
  }
  .sp-icon-btn:hover { border-color: #bbb; color: var(--ink-2); }

  /* ── Verified strip ── */
  .sp-verified {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: #f0fdf8;
    border: 1px solid #c3f0dc;
    border-radius: 4px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #065f46;
  }

  /* ── Map location strip ── */
  .sp-map-loc {
    padding: 9px 13px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    color: var(--ink-3);
  }

  /* ── Mobile-first sticky CTA bar ── */
  .sp-mobile-cta-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 200;
    background: #fff;
    border-top: 1px solid var(--line);
    padding: 10px 16px;
    display: flex;
    gap: 8px;
    box-shadow: 0 -2px 12px rgba(0,0,0,0.08);
  }

  /* ── Layout: mobile-first → desktop ── */

  /* Mobile (default) */
  .sp-layout {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* The sidebar on mobile becomes a content block (no sticky) */
  .sp-sidebar {
    position: static;
    top: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 0;
  }

  /* Hide desktop CTA row inside sidebar on mobile (we use the fixed bar) */
  .sp-sidebar-cta-row {
    display: none;
  }

  /* Show map in main content area on mobile */
  .sp-map-main {
    display: block;
  }

  /* Hide the sidebar map on mobile (avoid duplicate) */
  .sp-sidebar-map {
    display: none;
  }

  /* Tablet (≥ 768px) */
  @media (min-width: 768px) {
    .sp-heading__title { font-size: 20px; }
    .sp-tab { padding: 0 14px; font-size: 10.5px; }

    /* Hide the mobile fixed bar on tablet+ */
    .sp-mobile-cta-bar { display: none; }

    /* Show desktop CTA row in sidebar */
    .sp-sidebar-cta-row { display: flex; }
  }

  /* Desktop (≥ 1060px) — two-column layout */
  @media (min-width: 1060px) {
    .sp-layout {
      display: grid;
      grid-template-columns: 1fr 354px;
      gap: 32px;
      align-items: start;
    }

    .sp-sidebar {
      position: sticky;
      top: ${STICKY_TOP + 12}px;
    }

    /* On desktop: hide map in main content, show map in sidebar */
    .sp-map-main    { display: none; }
    .sp-sidebar-map { display: block; }
  }
`;

/* ─────────────────────────────────────────
   TAB NAV
───────────────────────────────────────── */
const TabNav = ({ activeTab, onTabClick }) => (
  <div style={{
    position: "sticky",
    top: `${NAV_H + USERHEAD_H}px`,
    zIndex: 90,
    background: "#fff",
    borderBottom: "1px solid #e6e6e6",
    boxShadow: "0 1px 5px rgba(0,0,0,0.04)",
  }}>
    <div
      className="sp-tabnav"
      style={{
        maxWidth: "1320px",
        margin: "0 auto",
        padding: "0 16px",
        display: "flex",
        alignItems: "stretch",
        height: `${TABNAV_H}px`,
        overflowX: "auto",
        scrollbarWidth: "none",
      }}
    >
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`sp-tab${activeTab === tab.id ? " active" : ""}`}
          onClick={() => onTabClick(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────────
   SECTION WRAPPER
───────────────────────────────────────── */
const Section = ({ id, sectionRef, label, kicker, children, style = {} }) => (
  <div
    id={id}
    ref={sectionRef}
    style={{ marginBottom: "40px", scrollMarginTop: `${STICKY_TOP + 8}px`, ...style }}
  >
    {label && (
      <div className="sp-heading">
        {kicker && <span className="sp-heading__kicker">{kicker}</span>}
        <h2 className="sp-heading__title">{label}</h2>
      </div>
    )}
    {children}
  </div>
);

/* ─────────────────────────────────────────
   SIDE CARD
───────────────────────────────────────── */
const SideCard = ({ title, children }) => (
  <div className="sp-sidecard">
    {title && (
      <div className="sp-sidecard__head">
        <span className="sp-sidecard__head-label">{title}</span>
      </div>
    )}
    {children}
  </div>
);

/* ─────────────────────────────────────────
   SINGLE PRODUCT
───────────────────────────────────────── */
const SingleProduct = () => {
  const [open,        setOpen]        = useState(false);
  const [activeTab,   setActiveTab]   = useState("sec-overview");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [error,       setError]       = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1060);

useEffect(() => {
  const handler = () => setIsDesktop(window.innerWidth >= 1060);
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
}, []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const { id } = useParams();
  const [property, setProperty] = useState({});
  const [loading,  setLoading]  = useState(false);

  const secRefs = useRef(null);
  if (!secRefs.current) {
    secRefs.current = {
      "sec-overview":   React.createRef(),
      "sec-highlights": React.createRef(),
      "sec-details":    React.createRef(),
      "sec-video":      React.createRef(),
      "sec-map":        React.createRef(),
      "sec-related":    React.createRef(),
    };
  }

  useEffect(() => {
    const controller = new AbortController();
    async function FetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_LINK}/property-detail/${id}`, {
          signal: controller.signal,
        });
        if (res.status === 200) setProperty(res.data.data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError("Failed to load property. Please try again.");
        console.error("Property fetch error:", err);
      }
      setLoading(false);
    }
    FetchData();
    return () => controller.abort();
  }, [id]);

  const { name, property_description } = property;
  useEffect(() => {
    name && headTag({ title: name, content: property_description });
  }, [name, property_description]);

  useEffect(() => {
    if (!Object.keys(property).length) return;
    let observer = null;
    const t = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible.length) setActiveTab(visible[0].target.id);
        },
        { rootMargin: `-${STICKY_TOP + 10}px 0px -55% 0px`, threshold: 0 }
      );
      Object.entries(secRefs.current).forEach(([, r]) => {
        if (!r.current) return;
        if (r.current.offsetParent === null) return;
        observer.observe(r.current);
      });
    }, 300);
    return () => { clearTimeout(t); observer?.disconnect(); };
  }, [property]);

  const handleTabClick = useCallback((tabId) => {
    setActiveTab(tabId);
    const el = secRefs.current[tabId]?.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - STICKY_TOP - 8;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  const feature   = property?.feature_image  || null;
  const gallery   = property?.gallery_images || [];
  const galUrls   = gallery.map(g => (typeof g === "string" ? g : g.image)).filter(Boolean);
  const allImages = [...(feature ? [feature] : []), ...galUrls];

  const hasMap = !!(property?.latitude && property?.longitude);

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* Loading */}
      {loading && !Object.keys(property).length ? (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader />
        </div>

      /* Error */
      ) : error ? (
        <div style={{
          minHeight: "60vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "14px",
          padding: "0 20px",
        }}>
          <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#e74c3c", fontWeight: 600, fontSize: "14px", textAlign: "center" }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "9px 24px", background: "#e74c3c", color: "#fff",
              border: "none", borderRadius: "4px", cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontWeight: 700, fontSize: "11px",
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}
          >
            Retry
          </button>
        </div>

      /* Page */
      ) : (
        !loading && Object.keys(property).length > 0 && (
          <>
            <Helmet>
              <title>{property?.name || property?.title || "Property"} {property?.property_location ? `in ${property.property_location}` : ""} | Sheetal Property Nepal</title>
              <meta name="description" content={property?.property_description ? String(property.property_description).replace(/<[^>]*>/g, "").slice(0, 160) : `${property?.name || "Property"} ${property?.property_location ? `in ${property.property_location}` : ""} — Find verified properties on Sheetal Property Nepal.`} />
              <meta name="keywords" content={`${property?.name || ""}, ${property?.property_location || ""}, ${property?.district || ""}, ${property?.property_type || ""}, property Nepal, real estate Nepal, Sheetal Property`} />
              <link rel="canonical" href={`https://sheetalproperty.com/property/${id}`} />
              <meta property="og:title" content={`${property?.name || "Property"} | Sheetal Property Nepal`} />
              <meta property="og:description" content={property?.property_description ? String(property.property_description).replace(/<[^>]*>/g, "").slice(0, 200) : `View this property on Sheetal Property Nepal`} />
              <meta property="og:image" content={property?.feature_image || "https://sheetalproperty.com/shetallogo.png"} />
              <meta property="og:url" content={`https://sheetalproperty.com/property/${id}`} />
              <meta property="og:type" content="article" />
              <meta property="og:site_name" content="Sheetal Property Nepal" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content={`${property?.name || "Property"} | Sheetal Property Nepal`} />
              <meta name="twitter:description" content={property?.property_description ? String(property.property_description).replace(/<[^>]*>/g, "").slice(0, 200) : "View this property on Sheetal Property Nepal"} />
              <meta name="twitter:image" content={property?.feature_image || "https://sheetalproperty.com/shetallogo.png"} />
              <script type="application/ld+json">{JSON.stringify({
                "@context": "https://schema.org",
                "@type": "RealEstateListing",
                "name": property?.name || "Property",
                "description": property?.property_description ? String(property.property_description).replace(/<[^>]*>/g, "").slice(0, 300) : "",
                "url": `https://sheetalproperty.com/property/${id}`,
                "image": property?.feature_image || "",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": property?.property_location || "",
                  "addressRegion": property?.district || "",
                  "addressCountry": "NP"
                },
                "offers": {
                  "@type": "Offer",
                  "price": property?.total_price || 0,
                  "priceCurrency": "NPR"
                }
              })}</script>
            </Helmet>

            {/* Hero */}
            {allImages.length > 0 && (
              <div style={{ marginTop: `${NAV_H}px` }}>
                <HeroSlideshow
                  images={allImages}
                  onOpenGallery={() => setGalleryOpen(true)}
                  onOpenLightbox={setLightboxIdx}
                />
              </div>
            )}

            <UserHead setOpen={setOpen} property={property} />
            <TabNav activeTab={activeTab} onTabClick={handleTabClick} />

            {/* Body */}
            <div style={{
              maxWidth: "1320px",
              margin: "0 auto",
              padding: "20px 16px 100px", /* bottom pad for mobile fixed bar */
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              <ProductLocation property={property} />

              {allImages.length > 1 && (
                <div style={{ marginBottom: "28px" }}>
                  <ThumbnailStrip
                    images={allImages} skip={1}
                    onOpenLightbox={setLightboxIdx}
                    onOpenGallery={() => setGalleryOpen(true)}
                  />
                </div>
              )}

              <div className="sp-layout">

                {/* ═══ LEFT (main content) ═══ */}
                <div style={{ minWidth: 0 }}>

                  {property?.property_description && (
                    <Section
                      id="sec-overview"
                      sectionRef={secRefs.current["sec-overview"]}
                      kicker="Overview"
                      label="About This Property"
                    >
                      <Description data={property} />
                    </Section>
                  )}

                  {property?.property_highlights && (
                    <Section
                      id="sec-highlights"
                      sectionRef={secRefs.current["sec-highlights"]}
                      kicker="Features"
                      label="Property Highlights"
                    >
                      <PropertyHighlight data={property.property_highlights} />
                    </Section>
                  )}

                  <Section
                    id="sec-details"
                    sectionRef={secRefs.current["sec-details"]}
                    kicker="Specifications"
                    label="Property Details"
                  >
                    <Details data={property} hideMap />
                  </Section>

                  {property?.youtube_url && (
                    <Section
                      id="sec-video"
                      sectionRef={secRefs.current["sec-video"]}
                      kicker="Media"
                      label="Video Tour"
                    >
                      <div style={{ borderRadius: "4px", overflow: "hidden", border: "1px solid #e6e6e6" }}>
                        <YoutubeVideo url={property.youtube_url} />
                      </div>
                    </Section>
                  )}

                  {/*
                    ── MAP SECTION ──
                    .sp-map-main  = visible on mobile/tablet (CSS: display:block)
                    .sp-map-main  = hidden on desktop      (CSS: display:none)
                    Sidebar map   = hidden on mobile/tablet (CSS: display:none)
                    Sidebar map   = visible on desktop      (CSS: display:block)
                    → Only ONE map renders at any viewport width.
                  */}
                  {hasMap && !isDesktop && (
                    <Section
                      id="sec-map"
                      sectionRef={secRefs.current["sec-map"]}
                      kicker="Map"
                      label="Location"
                    >
                      <div className="sp-map-main">
                        <div style={{ height: "280px", borderRadius: "4px", overflow: "hidden", border: "1px solid #e6e6e6" }}>
                          <ProductMap
                            latitude={property.latitude}
                            longitude={property.longitude}
                            data={property}
                          />
                        </div>
                        {property?.property_location && (
                          <div className="sp-map-loc" style={{ borderTop: "1px solid #f0f0f0", marginTop: "8px", padding: "8px 0 0" }}>
                            <FaMapMarkerAlt style={{ color: "#e74c3c", fontSize: "11px", flexShrink: 0 }} />
                            <span>{property.property_location}{property.district ? `, ${property.district}` : ""}</span>
                          </div>
                        )}
                      </div>
                    </Section>
                  )}

                  {/* If no map, still register the ref so tab nav works */}
                  {!hasMap && (
                    <div
                      id="sec-map"
                      ref={secRefs.current["sec-map"]}
                      style={{ scrollMarginTop: `${STICKY_TOP + 8}px` }}
                    />
                  )}

                  <Section>
                    <ToolsWidget property={property} />
                  </Section>

                  <div style={{ height: "1px", background: "#e6e6e6", margin: "0 0 40px" }} />

                  <ReviewComponent propertyId={property?.id} />

                  <Section
                    id="sec-related"
                    sectionRef={secRefs.current["sec-related"]}
                    kicker="Explore"
                    label="Similar Properties"
                  >
                    <RelatedProperties property={property} />
                  </Section>

                  <BlogStrip />
                </div>
                {/* ═══ END LEFT ═══ */}

                {/* ═══ SIDEBAR ═══ */}
                <div className="sp-sidebar">

                  {/* Desktop-only CTA row (hidden on mobile via CSS; mobile uses fixed bar) */}
                  <div className="sp-sidebar-cta-row" style={{ display: "none", gap: "7px" }}>
                    <button className="sp-cta" onClick={() => setOpen(true)}>
                      <FaPhoneAlt size={11} />
                      Contact Agent
                    </button>
                    {[FaBookmark, FaShareAlt].map((Icon, i) => (
                      <button key={i} className="sp-icon-btn">
                        <Icon size={13} />
                      </button>
                    ))}
                  </div>

                  {/*
                    Desktop-only map card.
                    .sp-sidebar-map → display:none on mobile, display:block on desktop.
                  */}
                  {hasMap && isDesktop && (
                    <div className="sp-sidebar-map">
                      <SideCard title="Location">
                        <div style={{ height: "192px", overflow: "hidden" }}>
                          <ProductMap
                            latitude={property.latitude}
                            longitude={property.longitude}
                            data={property}
                          />
                        </div>
                        {property?.property_location && (
                          <div className="sp-map-loc">
                            <FaMapMarkerAlt style={{ color: "#e74c3c", fontSize: "11px", flexShrink: 0 }} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {property.property_location}
                              {property.district ? `, ${property.district}` : ""}
                            </span>
                          </div>
                        )}
                      </SideCard>
                    </div>
                  )}

                  {/* Tour scheduler — shown in sidebar on desktop; moved below content on mobile */}
                  <SideCard title="Schedule a Tour">
                    <ScheduleTour property={property} sidebar />
                  </SideCard>

                  {/* Verified badge */}
                  <div className="sp-verified">
                    <MdVerified size={15} style={{ color: "#10b981", flexShrink: 0 }} />
                    Verified listing — confirmed by our team
                  </div>
                </div>
                {/* ═══ END SIDEBAR ═══ */}

              </div>
            </div>

            {/* ── Mobile fixed CTA bar (hidden on tablet+) ── */}
            <div className="sp-mobile-cta-bar">
              <button className="sp-cta" onClick={() => setOpen(true)}>
                <FaPhoneAlt size={11} />
                Contact Agent
              </button>
              <button className="sp-icon-btn">
                <FaBookmark size={13} />
              </button>
              <button className="sp-icon-btn">
                <FaShareAlt size={13} />
              </button>
            </div>

            {galleryOpen && (
              <AllPhotosOverlay
                images={allImages}
                onClose={() => setGalleryOpen(false)}
                onOpenLightbox={setLightboxIdx}
              />
            )}
            {lightboxIdx !== null && (
              <Lightbox
                images={allImages}
                startIdx={lightboxIdx}
                onClose={() => setLightboxIdx(null)}
              />
            )}

            <ContactModel data={property} open={open} setOpen={setOpen} />
          </>
        )
      )}
    </>
  );
};

export default SingleProduct;