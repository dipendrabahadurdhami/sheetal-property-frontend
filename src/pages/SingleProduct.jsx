import React, { useEffect, useState, useRef } from "react";
import Description from "../components/SingleProduct/Description";
import ScheduleTour from "../components/scheduleTour/ScheduleTour";
import ContactModel from "../components/SingleProduct/ContactModel";
import ImageGallery from "../components/SingleProduct/ImageGallery";
import PropertyHighlight from "../components/SingleProduct/PropertyHighlight";
import Details from "../components/SingleProduct/Details";
import ToolsWidget from "../components/SingleProduct/ToolsWidget";
import RelatedProperties from "../components/SingleProduct/RelatedProperties";
import BlogStrip from "../components/SingleProduct/BlogStrip";
import ProductMap from "../components/SingleProduct/Details/ProductMap";
import YoutubeVideo from "../components/SingleProduct/Video";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import headTag from "../headTag";
import {
  FaMapMarkerAlt, FaBed, FaBath, FaUtensils, FaLayerGroup,
  FaHeart, FaRegHeart, FaShare, FaPhoneAlt, FaEnvelope,
  FaWhatsapp, FaCalendarAlt, FaTag, FaBuilding, FaArrowLeft,
  FaUser, FaCheckCircle, FaPrint
} from "react-icons/fa";
import { BiUserCircle } from "react-icons/bi";
import { GrLocation } from "react-icons/gr";
import { removeFavoriteList, setFavoritesList } from "../features/slices/favourites";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../utils/apiClient";
import { toast } from "react-toastify";

/* ── Badge pill ─────────────────────────────────────────────── */
const Badge = ({ children, color = "red" }) => {
  const colors = {
    red:   { bg: "#e02424", text: "#fff" },
    blue:  { bg: "#1d4ed8", text: "#fff" },
    green: { bg: "#059669", text: "#fff" },
    amber: { bg: "#d97706", text: "#fff" },
    gray:  { bg: "#6b7280", text: "#fff" },
  };
  const c = colors[color] || colors.red;
  return (
    <span style={{
      background: c.bg, color: c.text,
      fontSize: "11px", fontWeight: "700",
      padding: "4px 12px", borderRadius: "100px",
      letterSpacing: "0.05em", textTransform: "uppercase",
      display: "inline-block",
    }}>{children}</span>
  );
};

/* ── Quick-stat chip ─────────────────────────────────────────── */
const QuickStat = ({ icon, value, label }) => {
  if (!value || value === "0" || value === 0) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "8px",
      padding: "10px 16px",
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.14)",
      borderRadius: "10px",
      backdropFilter: "blur(8px)",
      color: "#fff",
      whiteSpace: "nowrap",
    }}>
      <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px" }}>{icon}</span>
      <div>
        <div style={{ fontSize: "14px", fontWeight: "700", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "2px" }}>{label}</div>
      </div>
    </div>
  );
};

/* ── Section card wrapper ─────────────────────────────────────── */
const SectionCard = ({ title, icon, children, id }) => (
  <div id={id} style={{
    background: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: "16px",
    overflow: "hidden",
    marginBottom: "20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
  }}>
    {title && (
      <div style={{
        padding: "16px 22px",
        borderBottom: "1px solid #f4f4f4",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        {icon && <span style={{ color: "var(--r)", fontSize: "16px" }}>{icon}</span>}
        <h2 style={{
          margin: 0, fontSize: "16px", fontWeight: "700",
          color: "var(--d)", fontFamily: "'DM Sans',sans-serif",
        }}>{title}</h2>
      </div>
    )}
    <div style={{ padding: "20px 22px" }}>{children}</div>
  </div>
);

/* ══ MAIN PAGE ══ */
const SingleProduct = () => {
  const [open, setOpen]           = useState(false);
  const [property, setProperty]   = useState({});
  const [loading, setLoading]     = useState(false);
  const [favorite, setFavorite]   = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied]       = useState(false);

  const { id }    = useParams();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const favorites = useSelector((s) => s.favorites.data);
  const user      = useSelector((s) => s.user);
  const token     = localStorage.getItem("sheetal_token");

  const overviewRef  = useRef(null);
  const detailsRef   = useRef(null);
  const locationRef  = useRef(null);
  const toolsRef     = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); FetchData(); }, [id]);

  useEffect(() => {
    if (favorites?.find((item) => item.property_id === property.id)) setFavorite(true);
    else setFavorite(false);
  }, [favorites, property]);

  useEffect(() => {
    if (!user.data) setFavorite(false);
  }, [user]);

  async function FetchData() {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_LINK}/property-detail/${id}`);
      if (res.status === 200) {
        setProperty(res.data.data);
        const { name, property_description } = res.data.data;
        if (name) headTag({ title: name, content: property_description });
      }
    } catch {}
    finally { setLoading(false); }
  }

  const onFavoriteClick = (e) => {
    e.preventDefault();
    if (!user.data && !token) return navigate("?login=1");
    if (favorites.find((item) => item.property_id === property.id)) {
      setFavorite(false);
      dispatch(removeFavoriteList(property.id));
      apiClient.post("/remove-from-favourite", { property_id: property.id })
        .then((r) => r.status === 200 && toast.success("Removed from favorites"));
    } else {
      setFavorite(true);
      dispatch(setFavoritesList(property.id));
      apiClient.post("/add-to-favourite", { property_id: property.id })
        .then((r) => r.status === 200 && toast.success("Added to favorites"));
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const scrollTo = (ref, tab) => {
    setActiveTab(tab);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const purposeColor = {
    rent:   "blue",
    sale:   "green",
    invest: "amber",
  }[property?.purpose?.toLowerCase()] || "gray";

  const category = (property?.propertycategory || "").toLowerCase();
  const isLand   = category === "land";

  if (loading && Object.keys(property).length === 0) {
    return (
      <div style={{ paddingTop: "120px", display: "flex", justifyContent: "center", paddingBottom: "80px" }}>
        <Loader />
      </div>
    );
  }

  if (!loading && Object.keys(property).length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .sp-fade { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .tab-btn { background:none; border:none; cursor:pointer; font-family:inherit; font-size:13px; font-weight:600; padding:10px 18px; color:#6b7280; border-bottom:2px solid transparent; transition:all 0.2s; white-space:nowrap; }
        .tab-btn.active { color:var(--r,#e02424); border-bottom-color:var(--r,#e02424); }
        .tab-btn:hover { color:var(--r,#e02424); }
        .sp-action-btn { display:flex;align-items:center;gap:6px;padding:9px 18px;border-radius:100px;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;border:none;font-family:inherit; }
        .sp-icon-btn { width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;font-size:15px;transition:all 0.2s; }
        .sidebar-contact-btn { width:100%;padding:13px;border-radius:12px;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:inherit;transition:all 0.2s; }
        .sidebar-contact-btn:hover { opacity:0.9;transform:translateY(-1px); }
        @media (max-width:1023px) {
          .sp-2col { grid-template-columns:1fr !important; }
          .sp-sidebar { position:static !important; top:auto !important; }
          .sp-mobile-bar { display:flex !important; }
        }
        .sp-mobile-bar { display:none; }
      `}</style>

      {/* ──────────────── HERO PROPERTY HEADER ──────────────── */}
      <div className="sp-fade" style={{
        background: "linear-gradient(135deg, #0a0f1e 0%, #1a2035 100%)",
        paddingTop: "90px",
        paddingBottom: "0",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle background texture */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 80% 50%, rgba(224,36,36,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        <div className="container mx-auto px-5 lg:px-10" style={{ position: "relative" }}>
          {/* Back + breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <button onClick={() => navigate(-1)} style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)", borderRadius: "8px",
              padding: "6px 14px", fontSize: "12px", fontWeight: "600", cursor: "pointer",
            }}>
              <FaArrowLeft style={{ fontSize: "10px" }} /> Back
            </button>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
              Properties / {property.property_location || "Nepal"} / <span style={{ color: "rgba(255,255,255,0.7)" }}>{property.name}</span>
            </span>
          </div>

          {/* Main header row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "space-between", alignItems: "flex-start" }}>
            {/* Left: title + meta */}
            <div style={{ flex: "1 1 0", minWidth: "260px" }}>
              {/* Badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
                {property.purpose && <Badge color={purposeColor}>For {property.purpose}</Badge>}
                {property.propertycategory && <Badge color="gray">{property.propertycategory}</Badge>}
                {property.property_type && <Badge color="gray">{property.property_type}</Badge>}
              </div>

              {/* Title */}
              <h1 style={{
                color: "#fff", fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(24px, 4vw, 42px)", fontWeight: "700",
                lineHeight: "1.15", letterSpacing: "-0.02em",
                marginBottom: "14px",
              }}>{property.name}</h1>

              {/* Location */}
              {property.property_location && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.6)", fontSize: "14px", marginBottom: "20px" }}>
                  <FaMapMarkerAlt style={{ color: "var(--r)", fontSize: "13px" }} />
                  <span>{property.property_location}</span>
                  {property.district && <span>· {property.district}</span>}
                  {property.latitude && property.longitude && (
                    <a href={`https://www.google.com/maps/@${property.latitude},${property.longitude},15z`}
                      target="_blank" rel="noreferrer"
                      style={{ color: "var(--r)", fontSize: "12px", fontWeight: "600", marginLeft: "4px" }}>
                      View on map ↗
                    </a>
                  )}
                </div>
              )}

              {/* Quick stats chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {!isLand && <QuickStat icon={<FaBed />}     value={property.bedrooms}  label="Beds" />}
                {!isLand && <QuickStat icon={<FaBath />}    value={property.bathrooms} label="Baths" />}
                {!isLand && <QuickStat icon={<FaUtensils />}value={property.kitchens}  label="Kitchen" />}
                {!isLand && <QuickStat icon={<FaLayerGroup />} value={property.floors} label="Floors" />}
                {property.land_area_in_anna_lal  && <QuickStat icon={<FaBuilding />} value={property.land_area_in_anna_lal}  label="Anna" />}
                {property.land_area_in_ropani_lal && <QuickStat icon={<FaBuilding />} value={property.land_area_in_ropani_lal} label="Ropani" />}
                {property.land_area_in_sqft_lal  && <QuickStat icon={<FaBuilding />} value={property.land_area_in_sqft_lal}  label="Sqft" />}
              </div>
            </div>

            {/* Right: price + actions */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "16px", flexShrink: 0 }}>
              {/* Price block */}
              <div style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "16px", padding: "18px 24px", textAlign: "right",
              }}>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
                  {property.purpose === "rent" ? "Monthly Rent" : "Asking Price"}
                </div>
                <div style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: "800", color: "#fff", lineHeight: 1 }}>
                  Rs. <span style={{ color: "var(--r)" }}>{property.total_price || "N/A"}</span>
                </div>
                {property.anna_price && (
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
                    Rs. {property.anna_price} / Anna
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button className="sp-icon-btn" title="Add to favorites"
                  style={{ background: favorite ? "rgba(224,36,36,0.2)" : "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: favorite ? "var(--r)" : "rgba(255,255,255,0.7)" }}
                  onClick={onFavoriteClick}>
                  {favorite ? <FaHeart /> : <FaRegHeart />}
                </button>
                <button className="sp-icon-btn" title="Share"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}
                  onClick={handleShare}>
                  <FaShare />
                </button>
                <button className="sp-icon-btn" title="Print"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}
                  onClick={() => window.print()}>
                  <FaPrint />
                </button>
                <button className="sp-action-btn" onClick={() => setOpen(true)}
                  style={{ background: "var(--r)", color: "#fff" }}>
                  <FaEnvelope /> Contact Owner
                </button>
              </div>
            </div>
          </div>

          {/* Agent bar */}
          <div style={{
            marginTop: "28px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "18px",
            paddingBottom: "0",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {property.image_of_property_owner ? (
                <img src={property.image_of_property_owner} alt={property.posted_by}
                  style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.15)" }} />
              ) : (
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BiUserCircle style={{ color: "rgba(255,255,255,0.5)", fontSize: "22px" }} />
                </div>
              )}
              <div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Listed by</div>
                <div style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>{property.posted_by || "Owner"}</div>
              </div>
              {property.posted_date && (
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", display: "flex", alignItems: "center", gap: "5px" }}>
                  <FaCalendarAlt style={{ fontSize: "11px" }} /> {property.posted_date}
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FaCheckCircle style={{ color: "#4ade80", fontSize: "13px" }} />
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: "500" }}>Verified Property</span>
            </div>
          </div>

          {/* Tab navigation */}
          <div style={{
            display: "flex", gap: "0", marginTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            overflowX: "auto",
          }}>
            {[
              { key: "overview",  label: "Overview",  ref: overviewRef },
              { key: "details",   label: "Details",   ref: detailsRef },
              { key: "location",  label: "Location",  ref: locationRef },
              { key: "tools",     label: "Tools",     ref: toolsRef },
            ].map((tab) => (
              <button key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                style={{ color: activeTab === tab.key ? "#fff" : "rgba(255,255,255,0.45)", borderColor: activeTab === tab.key ? "var(--r)" : "transparent" }}
                onClick={() => scrollTo(tab.ref, tab.key)}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* ──────────────── END HERO ──────────────── */}

      {/* ──────────────── MAIN CONTENT ──────────────── */}
      <div style={{ background: "#f8f9fb", paddingBottom: "100px" }}>
        <div className="container mx-auto px-5 lg:px-10 py-8">

          {/* Gallery */}
          <div style={{ marginBottom: "20px" }}>
            <ImageGallery property={property} />
          </div>

          {/* Two-column layout */}
          <div className="sp-2col" style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: "24px",
            alignItems: "start",
          }}>

            {/* ══ LEFT ══ */}
            <div style={{ minWidth: 0 }}>

              {/* Overview */}
              <div ref={overviewRef}>
                {property.property_description && (
                  <SectionCard title="Description" icon={<FaBuilding />} id="overview">
                    <Description data={property} />
                  </SectionCard>
                )}

                {property.property_highlights && (
                  <SectionCard title="Property Highlights" id="highlights">
                    <PropertyHighlight data={property.property_highlights} />
                  </SectionCard>
                )}
              </div>

              {/* Details */}
              <div ref={detailsRef}>
                <SectionCard title="Property Details" id="details">
                  <Details data={property} hideMap />
                </SectionCard>
              </div>

              {/* Video */}
              {property.youtube_url && (
                <SectionCard title="Property Video">
                  <YoutubeVideo url={property.youtube_url} />
                </SectionCard>
              )}

              {/* Tools */}
              <div ref={toolsRef}>
                <SectionCard title="Financial Tools" id="tools">
                  <ToolsWidget property={property} />
                </SectionCard>
              </div>

              {/* Related */}
              <SectionCard title="Similar Properties">
                <RelatedProperties property={property} />
              </SectionCard>

              {/* Blog */}
              <BlogStrip />
            </div>
            {/* ══ END LEFT ══ */}

            {/* ══ RIGHT SIDEBAR ══ */}
            <div className="sp-sidebar" style={{ position: "sticky", top: "88px", display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Quick Contact Card */}
              <div style={{
                background: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0",
                overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              }}>
                <div style={{
                  background: "linear-gradient(135deg,#0a0f1e,#1a2035)",
                  padding: "18px 20px",
                }}>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                    {property.purpose === "rent" ? "Monthly Rent" : "Asking Price"}
                  </div>
                  <div style={{ color: "#fff", fontSize: "24px", fontWeight: "800" }}>
                    Rs. <span style={{ color: "var(--r)" }}>{property.total_price || "N/A"}</span>
                  </div>
                  {property.anna_price && (
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginTop: "3px" }}>
                      Rs. {property.anna_price} / Anna
                    </div>
                  )}
                </div>
                <div style={{ padding: "16px" }}>
                  <button className="sidebar-contact-btn"
                    style={{ background: "var(--r)", color: "#fff", marginBottom: "10px" }}
                    onClick={() => setOpen(true)}>
                    <FaEnvelope style={{ display: "inline", marginRight: "8px" }} />
                    Send Message
                  </button>
                  <button className="sidebar-contact-btn"
                    style={{ background: "#f8f9fb", color: "var(--d)", border: "1px solid #e5e7eb" }}
                    onClick={onFavoriteClick}>
                    {favorite ? <FaHeart style={{ display: "inline", marginRight: "8px", color: "var(--r)" }} /> : <FaRegHeart style={{ display: "inline", marginRight: "8px" }} />}
                    {favorite ? "Saved" : "Save Property"}
                  </button>
                </div>
              </div>

              {/* Map Card */}
              {property.latitude && property.longitude && (
                <div ref={locationRef} style={{
                  background: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0",
                  overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid #f4f4f4", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaMapMarkerAlt style={{ color: "var(--r)" }} />
                    <span style={{ fontWeight: "700", fontSize: "14px", color: "var(--d)" }}>Location on Map</span>
                  </div>
                  <div style={{ height: "220px" }}>
                    <ProductMap latitude={property.latitude} longitude={property.longitude} data={property} />
                  </div>
                  {property.property_location && (
                    <div style={{
                      padding: "10px 14px", borderTop: "1px solid #f4f4f4",
                      fontSize: "12px", color: "#6b7280", display: "flex", alignItems: "center", gap: "6px",
                    }}>
                      <FaMapMarkerAlt style={{ color: "var(--r)", fontSize: "11px", flexShrink: 0 }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {property.property_location}{property.district ? `, ${property.district}` : ""}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Schedule Tour */}
              <div style={{
                background: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0",
                overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}>
                <ScheduleTour property={property} sidebar />
              </div>

              {/* Agent card */}
              <div style={{
                background: "#fff", borderRadius: "16px", border: "1px solid #f0f0f0",
                padding: "18px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "14px" }}>
                  Listed by
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                  {property.image_of_property_owner ? (
                    <img src={property.image_of_property_owner} alt={property.posted_by}
                      style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <BiUserCircle style={{ fontSize: "28px", color: "#9ca3af" }} />
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "15px", color: "var(--d)" }}>{property.posted_by || "Owner"}</div>
                    {property.posted_date && (
                      <div style={{ fontSize: "12px", color: "#9ca3af", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <FaCalendarAlt style={{ fontSize: "10px" }} /> Listed {property.posted_date}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1.5px solid var(--r)", color: "var(--r)", background: "rgba(224,36,36,0.04)", fontWeight: "700", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}
                  onClick={() => setOpen(true)}>
                  <FaPhoneAlt style={{ display: "inline", marginRight: "7px", fontSize: "11px" }} />
                  Contact Owner
                </button>
              </div>
            </div>
            {/* ══ END SIDEBAR ══ */}

          </div>
        </div>
      </div>

      {/* ──── MOBILE FLOATING ACTION BAR ──── */}
      <div className="sp-mobile-bar" style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", borderTop: "1px solid #e5e7eb",
        padding: "12px 16px", gap: "10px", zIndex: 100,
        boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
      }}>
        <button style={{
          flex: 1, padding: "12px", borderRadius: "10px",
          background: "#f3f4f6", border: "none", fontWeight: "700",
          fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
        }} onClick={onFavoriteClick}>
          {favorite ? <FaHeart style={{ color: "var(--r)" }} /> : <FaRegHeart />}
          {favorite ? "Saved" : "Save"}
        </button>
        <button style={{
          flex: 2, padding: "12px", borderRadius: "10px",
          background: "var(--r)", border: "none", color: "#fff",
          fontWeight: "700", fontSize: "14px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
        }} onClick={() => setOpen(true)}>
          <FaEnvelope /> Contact Owner
        </button>
      </div>

      <ContactModel data={property} open={open} setOpen={setOpen} />
    </>
  );
};

export default SingleProduct;
