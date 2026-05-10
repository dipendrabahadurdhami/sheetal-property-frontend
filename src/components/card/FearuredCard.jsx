import React, { useEffect, useState, useMemo, useCallback } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import '../../index.css';
import {
  FaMapMarkerAlt, FaBed, FaBath, FaUtensils,
  FaLayerGroup, FaCalendarAlt, FaHashtag,
  FaRulerCombined, FaRoad, FaBuilding, FaCamera
} from "react-icons/fa";
import "./FeaturedCard.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { removeFavoriteList, setFavoritesList } from "../../features/slices/favourites";
import apiClient from "../../utils/apiClient";

/* ────────── HELPERS ────────── */
const getPropertyKind = (product) => {
  const category = (product?.propertycategory || "").toLowerCase();
  if (category === "land") return "land";
  if (category === "apartment") return "apartment";
  if (category === "house" || category === "commercial") return "house";
  const type = (
    product?.property_type ||
    product?.propertyType?.name ||
    product?.category?.name || ""
  ).toLowerCase();
  if (type.includes("land") || type.includes("plot")) return "land";
  if (type.includes("apartment") || type.includes("flat")) return "apartment";
  return "house";
};

const CATEGORY_META = {
  house:      { label: "House",      color: "#4ade80", bg: "rgba(22,101,52,0.55)" },
  commercial: { label: "Commercial", color: "#fb923c", bg: "rgba(124,45,18,0.55)" },
  land:       { label: "Land",       color: "#fbbf24", bg: "rgba(120,53,15,0.55)" },
  apartment:  { label: "Apartment",  color: "#a78bfa", bg: "rgba(76,29,149,0.55)" },
};

const getStatusBadge = (product) => {
  const days = product.created_at
    ? Math.floor((Date.now() - new Date(product.created_at)) / 86400000)
    : 999;
  if (days <= 3)  return { label: "Just Listed", color: "#34d399", bg: "rgba(6,78,59,0.75)" };
  if (days <= 7)  return { label: "New",         color: "#60a5fa", bg: "rgba(30,58,138,0.75)" };
  if (days <= 30) return { label: "Prime",       color: "#c084fc", bg: "rgba(88,28,135,0.75)" };
  if (product.featured) return { label: "Featured", color: "#fbbf24", bg: "rgba(120,53,15,0.75)" };
  return null;
};

const formatPrice = (price) => {
  const n = Number(price);
  if (!price || isNaN(n)) return null;
  if (n >= 10000000) return { val: (n / 10000000).toFixed(2).replace(/\.?0+$/, ""), unit: "Cr" };
  if (n >= 100000)   return { val: (n / 100000).toFixed(2).replace(/\.?0+$/, ""),  unit: "L"  };
  return { val: n.toLocaleString(), unit: "" };
};

/* ────────── STAT ITEM ────────── */
const Stat = ({ icon, value, label }) => (
  <div className="fc2-stat">
    <span className="fc2-stat-icon">{icon}</span>
    <span className="fc2-stat-value">{value}</span>
    <span className="fc2-stat-label">{label}</span>
  </div>
);

const LandStats = ({ p }) => (
  <>
    {p.land_area_in_anna_lal   && <Stat icon={<FaRulerCombined />} value={p.land_area_in_anna_lal}   label="Anna"   />}
    {p.land_area_in_ropani_lal && <Stat icon={<FaRulerCombined />} value={p.land_area_in_ropani_lal} label="Ropani" />}
    {p.land_area_in_sqft_lal   && <Stat icon={<FaRulerCombined />} value={p.land_area_in_sqft_lal}   label="sqft"   />}
    {p.geometry_of_land        && <Stat icon={<FaRoad />}          value={p.geometry_of_land}         label="Shape"  />}
  </>
);

const HouseStats = ({ p }) => (
  <>
    <Stat icon={<FaBed />}        value={p.bedrooms  || 0} label="Beds"    />
    <Stat icon={<FaBath />}       value={p.bathrooms || 0} label="Baths"   />
    <Stat icon={<FaUtensils />}   value={p.kitchens  || 0} label="Kitchen" />
    <Stat icon={<FaLayerGroup />} value={p.floors    || 0} label="Floors"  />
  </>
);

const ApartmentStats = ({ p }) => (
  <>
    <Stat icon={<FaBed />}           value={p.bedrooms  || 0}     label="Beds"  />
    <Stat icon={<FaBath />}          value={p.bathrooms || 0}     label="Baths" />
    <Stat icon={<FaBuilding />}      value={`${p.floors || 0}th`} label="Floor" />
    {p.land_area_in_sqft_lal && <Stat icon={<FaRulerCombined />} value={p.land_area_in_sqft_lal} label="sqft" />}
  </>
);

/* ────────── MAIN CARD ────────── */
const FeaturedCard = ({ product }) => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const [favorite,  setFavorite]  = useState(false);
  const [imgIdx,    setImgIdx]    = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const favorites = useSelector((s) => s.favorites.data);
  const user      = useSelector((s) => s.user);
  const token     = localStorage.getItem("sheetal_token");

  const kind    = getPropertyKind(product);
  const status  = getStatusBadge(product);
  const catMeta = CATEGORY_META[(product?.propertycategory || "").toLowerCase()];
  const price   = formatPrice(product?.total_price);

  const purposeName = product.purpose?.name || product.purpose || "SALE";
  const isRent      = purposeName.toLowerCase().includes("rent");

  const allImages = useMemo(() => {
    const gallery = (product.images || []).map((img) =>
      typeof img === "string" ? img : (img.image_path || img.filename || img.image || null)
    ).filter(Boolean);
    return [product.feature_image, ...gallery].filter(Boolean);
  }, [product]);

  useEffect(() => {
    if (!isHovered || allImages.length <= 1) { setImgIdx(0); return; }
    const t = setInterval(() => setImgIdx((p) => (p + 1) % allImages.length), 2400);
    return () => clearInterval(t);
  }, [isHovered, allImages.length]);

  useEffect(() => {
    setFavorite(!!favorites?.find((f) => f.property_id === product.id));
  }, [favorites, product.id]);

  useEffect(() => { if (!user.data) setFavorite(false); }, [user]);

  const onHeart = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user.data && !token) return navigate("/?login=1");
    const exists = favorites?.find((f) => f.property_id === product.id);
    if (exists) {
      setFavorite(false);
      dispatch(removeFavoriteList(product.id));
      apiClient.post("/remove-from-favourite", { property_id: product.id })
        .then((r) => r.status === 200 ? toast.success("Removed from favourites") : toast.error("Failed"))
        .catch(() => { dispatch(setFavoritesList(product.id)); setFavorite(true); toast.error("Error"); });
    } else {
      setFavorite(true);
      dispatch(setFavoritesList(product.id));
      apiClient.post("/add-to-favourite", { property_id: product.id })
        .then((r) => r.status === 200 ? toast.success("Added to favourites") : toast.error("Failed"))
        .catch((err) => {
          if (err?.response?.status === 409) { toast.info("Already in favourites!"); setFavorite(true); }
          else { dispatch(removeFavoriteList(product.id)); setFavorite(false); toast.error("Error"); }
        });
    }
  }, [user, token, favorites, product.id, dispatch, navigate]);

  return (
    <article
      className={`fc2-card${isHovered ? " fc2-hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/property/${product.id}`)}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/property/${product.id}`)}
      aria-label={`View property: ${product.name}`}
    >

      {/* ── IMAGE LAYER ── */}
      <div className="fc2-media">
        {allImages.map((src, i) => (
          <div key={i} className={`fc2-slide${i === imgIdx ? " is-active" : ""}`}>
            <img
              src={src}
              alt=""
              className={`fc2-img${imgLoaded ? " loaded" : ""}`}
              loading="lazy"
              onLoad={() => i === 0 && setImgLoaded(true)}
            />
          </div>
        ))}
        <div className="fc2-scrim-top"    />
        <div className="fc2-scrim-bottom" />
      </div>

      {/* ── PROGRESS DOTS ── */}
      {allImages.length > 1 && (
        <div className="fc2-progress">
          {allImages.map((_, i) => (
            <span
              key={i}
              className={`fc2-prog-dot${i === imgIdx ? " active" : ""}${i < imgIdx ? " done" : ""}`}
            />
          ))}
        </div>
      )}

      {/* ── PHOTO COUNT ── */}
      {allImages.length > 1 && (
        <div className="fc2-photo-count">
          <FaCamera />
          {imgIdx + 1} / {allImages.length}
        </div>
      )}

      {/* ── TOP LEFT BADGES ── */}
      <div className="fc2-tl">
        <span className={`fc2-purpose${isRent ? " rent" : ""}`}>
          {isRent ? "For Rent" : "For Sale"}
        </span>
        {catMeta && (
          <span
            className="fc2-cat"
            style={{ "--cc": catMeta.color, "--cb": catMeta.bg }}
          >
            {catMeta.label}
          </span>
        )}
      </div>

      {/* ── TOP RIGHT ── */}
      <div className="fc2-tr">
        {status && (
          <span
            className="fc2-status"
            style={{ "--sc": status.color, "--sb": status.bg }}
          >
            <span className="fc2-status-dot" style={{ background: status.color }} />
            {status.label}
          </span>
        )}
        <button
          className={`fc2-heart${favorite ? " active" : ""}`}
          onClick={onHeart}
          aria-label={favorite ? "Remove from favourites" : "Add to favourites"}
        >
          <span className="fc2-heart-bg" />
          {favorite
            ? <AiFillHeart  className="fc2-heart-ico filled" />
            : <AiOutlineHeart className="fc2-heart-ico" />}
        </button>
      </div>

      {/* ── BOTTOM PANEL ── */}
      <div className="fc2-panel">

        {/* Price + ID */}
        <div className="fc2-top-row">
          <div className="fc2-price">
            {price ? (
              <>
                <span className="fc2-rs">Rs.</span>
                <span className="fc2-amount">{price.val}</span>
                {price.unit && <span className="fc2-unit">{price.unit}</span>}
              </>
            ) : (
              <span className="fc2-contact-price">Price on Request</span>
            )}
          </div>
          <span className="fc2-id">
            <FaHashtag />
            {product.property_code || product.id}
          </span>
        </div>

        {/* Title */}
        <h3 className="fc2-title">
          {(product.name || "Unnamed Property").slice(0, 68)}
          {(product.name || "").length > 68 ? "…" : ""}
        </h3>

        {/* Location */}
        <div className="fc2-loc">
          <FaMapMarkerAlt className="fc2-loc-pin" />
          <span className="fc2-loc-text">{product.property_location || "Location not specified"}</span>
        </div>

        {/* Stats */}
        <div className="fc2-stats">
          {kind === "land"      && <LandStats      p={product} />}
          {kind === "house"     && <HouseStats     p={product} />}
          {kind === "apartment" && <ApartmentStats p={product} />}
        </div>

        {/* Footer bar */}
        <div className="fc2-footer">
          <span className="fc2-posted">
            <FaCalendarAlt />
            {product.created_at
              ? new Date(product.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })
              : "Recently"}
          </span>
          <span className="fc2-cta">
            View Details
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>

      </div>
    </article>
  );
};

export default FeaturedCard;