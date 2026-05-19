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
   GLOBAL CSS — no bars, no dots, no icons,
   border-radius 4px only, red theme only
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

  /* Tab nav */
  .sp-tabnav::-webkit-scrollbar { display: none; }

  .sp-tab {
    flex-shrink: 0;
    padding: 0 16px;
    height: 100%;
    border: none;
    border-bottom: 2px solid transparent;
    background: transparent;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-3);
    transition: color 0.15s, border-color 0.15s;
    white-space: nowrap;
  }
  .sp-tab:hover  { color: var(--ink-2); }
  .sp-tab.active { color: var(--r); border-bottom-color: var(--r); }

  /* Section heading — kicker above, serif title, bottom rule */
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
    font-size: 20px;
    font-weight: 400;
    color: var(--ink);
    margin: 0;
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  /* Side card */
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

  /* Buttons */
  .sp-cta {
    flex: 1;
    height: 40px;
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
    width: 40px;
    height: 40px;
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

  /* Verified strip */
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

  /* Map location strip */
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

  /* Responsive */
  .sp-layout { display: grid; grid-template-columns: 1fr 354px; gap: 32px; align-items: start; }

  @media (max-width: 1060px) {
    .sp-layout    { grid-template-columns: 1fr !important; }
    .sp-sidebar   { position: static !important; top: auto !important; }
    .sp-map-mob   { display: block !important; }
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
        padding: "0 24px",
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
    style={{ marginBottom: "48px", scrollMarginTop: `${STICKY_TOP + 8}px`, ...style }}
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
    async function FetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_LINK}/property-detail/${id}`);
        if (res.status === 200) setProperty(res.data.data);
      } catch (err) {
        setError("Failed to load property. Please try again.");
        console.error("Property fetch error:", err);
      }
      setLoading(false);
    }
    FetchData();
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
        }}>
          <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#e74c3c", fontWeight: 600, fontSize: "14px" }}>
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
              <title>{property?.name || property?.title || "Property"} | Shetal Real Estate</title>
              <meta property="og:title" content={property?.name || property?.title || "Property"} />
              <meta property="og:description" content={property?.property_description ? String(property.property_description).replace(/<[^>]*>/g, "").slice(0, 200) : "View this property on Shetal Real Estate"} />
              <meta property="og:image" content={property?.feature_image || ""} />
              <meta property="og:url" content={`${window.location.origin}/property/${id}`} />
              <meta property="og:type" content="website" />
              <meta property="og:site_name" content="Shetal Real Estate" />
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
              padding: "28px 24px 80px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              <ProductLocation property={property} />

              {allImages.length > 1 && (
                <div style={{ marginBottom: "32px" }}>
                  <ThumbnailStrip
                    images={allImages} skip={1}
                    onOpenLightbox={setLightboxIdx}
                    onOpenGallery={() => setGalleryOpen(true)}
                  />
                </div>
              )}

              <div className="sp-layout">

                {/* ═══ LEFT ═══ */}
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

                  {/* Map – mobile only */}
                  <Section
                    id="sec-map"
                    sectionRef={secRefs.current["sec-map"]}
                    kicker={property?.latitude && property?.longitude ? "Map" : undefined}
                    label={property?.latitude && property?.longitude ? "Location" : undefined}
                  >
                    {property?.latitude && property?.longitude && (
                      <div className="sp-map-mob" style={{ display: "none" }}>
                        <div style={{ height: "300px", borderRadius: "4px", overflow: "hidden", border: "1px solid #e6e6e6" }}>
                          <ProductMap latitude={property.latitude} longitude={property.longitude} data={property} />
                        </div>
                      </div>
                    )}
                  </Section>

                  <Section>
                    <ToolsWidget property={property} />
                  </Section>

                  <div style={{ height: "1px", background: "#e6e6e6", margin: "0 0 48px" }} />

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
                <div
                  className="sp-sidebar"
                  style={{
                    position: "sticky",
                    top: `${STICKY_TOP + 12}px`,
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {/* CTA row */}
                  <div style={{ display: "flex", gap: "7px" }}>
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

                  {/* Map card */}
                  {property?.latitude && property?.longitude && (
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
                  )}

                  {/* Tour scheduler */}
                  <SideCard title="Schedule a Tour">
                    <ScheduleTour property={property} sidebar />
                  </SideCard>

                  {/* Verified */}
                  <div className="sp-verified">
                    <MdVerified size={15} style={{ color: "#10b981", flexShrink: 0 }} />
                    Verified listing — confirmed by our team
                  </div>
                </div>
                {/* ═══ END SIDEBAR ═══ */}

              </div>
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