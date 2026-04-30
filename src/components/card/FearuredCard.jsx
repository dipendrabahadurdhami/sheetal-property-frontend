import React, { useEffect, useState, useMemo } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import '../../index.css';
import {
  FaMapMarkerAlt, FaBed, FaBath, FaUtensils,
  FaLayerGroup, FaCalendarAlt, FaHashtag,
  FaRulerCombined, FaRoad, FaBuilding
} from "react-icons/fa";
import "./FeaturedCard.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { removeFavoriteList, setFavoritesList } from "../../features/slices/favourites";
import apiClient from "../../utils/apiClient";

/* ── HELPERS ── */
const getPropertyKind = (product) => {
  const category = (product?.propertycategory || "").toLowerCase();
  if (category === "land") return "land";
  if (category === "apartment") return "apartment";
  if (category === "house" || category === "commercial") return "house";

  const type = (
    product?.property_type ||
    product?.propertyType?.name ||
    product?.category?.name ||
    ""
  ).toLowerCase();
  if (type.includes("land") || type.includes("plot")) return "land";
  if (type.includes("apartment") || type.includes("flat")) return "apartment";
  return "house";
};

const CATEGORY_CLASS = {
  house:      "cat-house",
  commercial: "cat-commercial",
  land:       "cat-land",
  apartment:  "cat-apartment",
};
const CATEGORY_LABEL = {
  house:      "House",
  commercial: "Commercial",
  land:       "Land",
  apartment:  "Apartment",
};

/* ── STATUS CHIP ── */
const getChipClass = (product) => {
  const days = product.created_at
    ? Math.floor((Date.now() - new Date(product.created_at)) / 86400000)
    : 999;
  if (days <= 7)  return { cls: "chip-new",      label: "New" };
  if (days <= 30) return { cls: "chip-prime",    label: "Prime" };
  if (product.featured) return { cls: "chip-featured", label: "Featured" };
  return null;
};

/* ── SUB-COMPONENTS ── */
const CategoryBadge = ({ product }) => {
  const raw = (product?.propertycategory || "").toLowerCase();
  const cls = CATEGORY_CLASS[raw];
  const lbl = CATEGORY_LABEL[raw];
  if (!cls) return null;
  return <div className={`fc-badge fc-badge-cat ${cls}`}>{lbl}</div>;
};

const StatItem = ({ icon, value, label }) => (
  <div className="fc-stat">
    <span className="fc-stat-icon">{icon}</span>
    <span className="fc-stat-val">{value}</span>
    <span className="fc-stat-lbl">{label}</span>
  </div>
);

const LandStats = ({ product }) => (
  <>
    {product.land_area_in_anna_lal && (
      <StatItem icon={<FaRulerCombined />} value={product.land_area_in_anna_lal} label="Anna" />
    )}
    {product.land_area_in_ropani_lal && (
      <StatItem icon={<FaRulerCombined />} value={product.land_area_in_ropani_lal} label="Ropani" />
    )}
    {product.land_area_in_sqft_lal && (
      <StatItem icon={<FaRulerCombined />} value={product.land_area_in_sqft_lal} label="sqft" />
    )}
    {product.geometry_of_land && (
      <StatItem icon={<FaRoad />} value={product.geometry_of_land} label="Shape" />
    )}
  </>
);

const HouseStats = ({ product }) => (
  <>
    <StatItem icon={<FaBed />}        value={product.bedrooms  || 0} label="Beds" />
    <StatItem icon={<FaBath />}       value={product.bathrooms || 0} label="Baths" />
    <StatItem icon={<FaUtensils />}   value={product.kitchens  || 0} label="Kitchen" />
    <StatItem icon={<FaLayerGroup />} value={`${product.floors || 0}`} label="Floors" />
  </>
);

const ApartmentStats = ({ product }) => (
  <>
    <StatItem icon={<FaBed />}          value={product.bedrooms  || 0} label="Beds" />
    <StatItem icon={<FaBath />}         value={product.bathrooms || 0} label="Baths" />
    <StatItem icon={<FaBuilding />}     value={`${product.floors || 0}th`} label="Floor" />
    {product.land_area_in_sqft_lal && (
      <StatItem icon={<FaRulerCombined />} value={product.land_area_in_sqft_lal} label="sqft" />
    )}
  </>
);

/* ── MAIN COMPONENT ── */
const FeaturedCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [favorite,  setFavorite]  = useState(false);
  const [imgIdx,    setImgIdx]    = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const favorites = useSelector((state) => state.favorites.data);
  const user      = useSelector((state) => state.user);
  const token     = localStorage.getItem("sheetal_token");
  const kind      = getPropertyKind(product);
  const chip      = getChipClass(product);

  const purposeName  = product.purpose?.name || product.purpose || "SALE";
  const isRent       = purposeName.toLowerCase().includes("rent");
  const purposeLabel = `For ${purposeName}`;

  const allImages = useMemo(() => {
    const gallery = (product.images || []).map((img) => {
      if (typeof img === "string") return img;
      return img.image_path || img.filename || img.image || null;
    }).filter(Boolean);
    return [product.feature_image, ...gallery].filter(Boolean);
  }, [product]);

  /* Slideshow — only while hovered */
  useEffect(() => {
    let timer = null;
    if (isHovered && allImages.length > 1) {
      timer = setInterval(() => {
        setImgIdx((prev) => (prev + 1) % allImages.length);
      }, 2200);
    } else {
      setImgIdx(0);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [isHovered, allImages.length]);

  useEffect(() => {
    if (favorites?.length > 0)
      setFavorite(!!favorites.find((item) => item.property_id === product.id));
  }, [favorites, product.id]);

  useEffect(() => {
    if (!user.data) setFavorite(false);
  }, [user]);

  const onFavoriteClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user.data && !token) return navigate(`/?login=1`);
    const exists = favorites?.find((item) => item.property_id === id);
    if (exists) {
      setFavorite(false);
      dispatch(removeFavoriteList(id));
      removeFromFavorite(id);
    } else {
      setFavorite(true);
      dispatch(setFavoritesList(id));
      addToFavorite(id);
    }
  };

  const addToFavorite = async (id) => {
    try {
      const res = await apiClient.post("/add-to-favourite", { property_id: id });
      if (res.status === 200) toast.success("Added to favorite list");
      else toast.error("Failed to add to favorite list");
    } catch (err) {
      if (err?.response?.status === 409) {
        toast.info("Already in your favourites!");
        setFavorite(true);
      } else {
        dispatch(removeFavoriteList(id));
        setFavorite(false);
        toast.error("Failed to add to favorite list");
      }
    }
  };

  const removeFromFavorite = async (id) => {
    try {
      const res = await apiClient.post("/remove-from-favourite", { property_id: id });
      if (res.status === 200) toast.success("Removed from favorite list");
      else toast.error("Failed to remove");
    } catch {
      dispatch(setFavoritesList(id));
      setFavorite(true);
      toast.error("Failed to remove from favorite list");
    }
  };

  return (
    <div className="h-full p-2">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/property/${product.id}`)}
        className="fc-card"
      >
        {/* IMAGE STACK */}
        <div className="fc-img-wrap">
          {allImages.map((src, i) => (
            <div key={i} className={`fc-slide${i === imgIdx ? " active" : ""}`}>
              <img src={src} alt="property" className="fc-img" loading="lazy" />
            </div>
          ))}
          <div className="fc-scrim" />
        </div>

        {/* PROGRESS BARS */}
        {allImages.length > 1 && (
          <div className="fc-progress-bars">
            {allImages.map((_, i) => (
              <div key={i} className={`fc-bar${i === imgIdx ? " active" : ""}`} />
            ))}
          </div>
        )}

        {/* TOP BADGES */}
        <div className="fc-top-badges">
          <div className={`fc-badge fc-badge-purpose${isRent ? " rent" : ""}`}>
            {purposeLabel}
          </div>
          <CategoryBadge product={product} />
          <div className="fc-badge fc-badge-code">
            <FaHashtag style={{ width: 8, height: 8 }} />
            {product.property_code || product.id}
          </div>
        </div>

        {/* HEART */}
        <div className="fc-heart" onClick={(e) => onFavoriteClick(e, product.id)}>
          {favorite
            ? <AiFillHeart  style={{ color: "var(--r)", width: 14, height: 14 }} />
            : <AiOutlineHeart style={{ color: "var(--r)", width: 14, height: 14 }} />}
        </div>

        {/* GLASS PANEL — floats over image */}
        <div className="fc-panel">

          <div className="fc-price-row">
            <div className="fc-price serif">
              {product?.total_price
                ? <>Rs. {Number(product.total_price).toLocaleString()}<span className="fc-price-sub"> total</span></>
                : <span className="fc-price-contact">Contact for Price</span>}
            </div>
            {chip && (
              <div className={`fc-chip ${chip.cls}`}>{chip.label}</div>
            )}
          </div>

          <div className="fc-price-divider" />

          <div className="fc-title serif">
            {product.name?.length > 80
              ? product.name.slice(0, 80) + "…"
              : product.name}
          </div>

          <p className="fc-location">
            <FaMapMarkerAlt className="fc-pin" />
            {product.property_location}
          </p>

          <p className="fc-date">
            <FaCalendarAlt className="fc-cal" />
            Posted:{" "}
            {product.created_at
              ? new Date(product.created_at).toLocaleDateString()
              : "Recently"}
          </p>

          <div className="fc-stats">
            {kind === "land"      && <LandStats      product={product} />}
            {kind === "house"     && <HouseStats     product={product} />}
            {kind === "apartment" && <ApartmentStats product={product} />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeaturedCard;