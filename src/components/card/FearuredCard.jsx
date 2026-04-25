import React, { useEffect, useState, useMemo } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {
  FaMapMarkerAlt, FaBed, FaBath, FaUtensils,
  FaLayerGroup, FaCalendarAlt, FaHashtag,
  FaRulerCombined, FaRoad, FaBuilding
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { removeFavoriteList, setFavoritesList } from "../../features/slices/favourites";
import apiClient from "../../utils/apiClient";

// ─── Helper: detect property category ───────────────────────────────────────
const getPropertyKind = (product) => {
  const type = (
    product?.propertyType?.name ||
    product?.property_type?.name ||
    product?.category?.name ||
    ""
  ).toLowerCase();

  if (type.includes("land") || type.includes("plot")) return "land";
  if (type.includes("apartment") || type.includes("flat")) return "apartment";
  return "house"; // house, bungalow, commercial, etc.
};

// ─── Stats row per type ──────────────────────────────────────────────────────
const LandStats = ({ product }) => (
  <>
    {product.land_area_in_anna_lal && (
      <StatItem icon={<FaRulerCombined />} label={`${product.land_area_in_anna_lal} Anna`} />
    )}
    {product.land_area_in_ropani_lal && (
      <StatItem icon={<FaRulerCombined />} label={`${product.land_area_in_ropani_lal} Ropani`} />
    )}
    {product.land_area_in_sqft_lal && (
      <StatItem icon={<FaRulerCombined />} label={`${product.land_area_in_sqft_lal} sqft`} />
    )}
    {product.geometry_of_land && (
      <StatItem icon={<FaRoad />} label={product.geometry_of_land} />
    )}
  </>
);

const HouseStats = ({ product }) => (
  <>
    <StatItem icon={<FaBed />} label={product.bedrooms || 0} />
    <StatItem icon={<FaBath />} label={product.bathrooms || 0} />
    <StatItem icon={<FaUtensils />} label={product.kitchens || 0} />
    <StatItem icon={<FaLayerGroup />} label={product.floors || 0} />
  </>
);

const ApartmentStats = ({ product }) => (
  <>
    <StatItem icon={<FaBed />} label={product.bedrooms || 0} />
    <StatItem icon={<FaBath />} label={product.bathrooms || 0} />
    <StatItem icon={<FaBuilding />} label={`Fl ${product.floors || 0}`} />
    {product.land_area_in_sqft_lal && (
      <StatItem icon={<FaRulerCombined />} label={`${product.land_area_in_sqft_lal} sqft`} />
    )}
  </>
);

const StatItem = ({ icon, label }) => (
  <div className="flex flex-col items-center flex-1 border-l border-white/10 first:border-l-0">
    <span className="text-[#e02424] opacity-80 text-sm mb-1">{icon}</span>
    <span className="text-[11px] font-bold">{label}</span>
  </div>
);

// ─── Main Card ───────────────────────────────────────────────────────────────
const FeaturedCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [favorite, setFavorite] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const favorites = useSelector((state) => state.favorites.data);
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("sheetal_token");

  const kind = getPropertyKind(product);

  const allImages = useMemo(() => {
    const gallery = product.images || [];
    return [
      product.feature_image,
      ...gallery.map((img) => img.image_path || img.image || img),
    ].filter(Boolean);
  }, [product]);

  // Slideshow
  useEffect(() => {
    let interval = null;
    if (isHovered && allImages.length > 1) {
      interval = setInterval(() => {
        setImgIdx((prev) => (prev + 1) % allImages.length);
      }, 1500);
    } else {
      setImgIdx(0);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isHovered, allImages.length]);

  // Favorite sync
  useEffect(() => {
    if (favorites?.length > 0) {
      setFavorite(!!favorites.find((item) => item.property_id === product.id));
    }
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

  // Kind-specific label for the type badge
  const kindLabel = { land: "Land", apartment: "Apartment", house: "House" }[kind];

  return (
    <div className="h-full p-2 ab">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/property/${product.id}`)}
        className="group relative h-[400px] w-full overflow-hidden rounded-2xl shadow-xl cursor-pointer bg-[#f9fafb]"
      >
        {/* IMAGE */}
        <div className="absolute inset-0 z-0 bg-gray-200">
          <img
            src={allImages[imgIdx] || "/fallback-image.jpg"}
            alt="property"
            className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
          />
          {allImages.length > 1 && (
            <div className="absolute top-2 left-0 right-0 flex gap-1 px-4 z-30">
              {allImages.map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                    i === imgIdx ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/100 via-[#111827]/10 to-transparent" />
        </div>

        {/* TOP BADGES */}
        <div className="absolute top-4 left-3 z-20 flex flex-col gap-2">
          <div className="px-2.5 py-1 bg-[#e02424] rounded text-[10px] font-bold text-white uppercase shadow-md w-fit">
            For {product.purpose?.name || product.purpose || "SALE"}
          </div>
          {/* Property kind badge */}
          <div className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] font-bold text-white border border-white/30 w-fit">
            {kindLabel}
          </div>
          <div className="px-2 py-1 bg-[#111827]/60 backdrop-blur-md rounded text-[10px] font-bold text-white border border-white/20 w-fit flex items-center">
            <FaHashtag className="mr-1 text-[#e02424]" />
            {product.property_code || product.id}
          </div>
        </div>

        {/* HEART */}
        <div
          className="absolute top-4 right-3 z-20 p-2 rounded-full bg-[#111827]/30 backdrop-blur-md border border-white/10 hover:bg-[#e02424]/20 transition-colors"
          onClick={(e) => onFavoriteClick(e, product.id)}
        >
          {favorite
            ? <AiFillHeart className="text-[#e02424] w-4 h-4" />
            : <AiOutlineHeart className="text-white w-4 h-4" />}
        </div>

        {/* PRICE */}
        <div className="absolute left-5 z-20 bottom-[165px]">
          <h2 className="text-[#f9fafb] text-3xl font-bold drop-shadow-2xl serif">
            Rs. {product?.total_price
              ? Number(product.total_price).toLocaleString()
              : "Contact for Price"}
          </h2>
        </div>

        {/* DETAILS PANEL */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 p-4"
          style={{
            background: "rgba(17, 24, 39, 0.85)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(249, 250, 251, 0.1)",
          }}
        >
          <div className="mb-1">
            <h3 className="text-white text-md font-semibold truncate serif leading-tight">
              {product.name?.length > 80
                ? product.name.slice(0, 80) + "..."
                : product.name}
            </h3>
            <p className="text-[#f9fafb]/70 text-[11px] flex items-center mt-1">
              <FaMapMarkerAlt className="mr-1 text-[#e02424]" />
              {product.property_location}
            </p>
            <p className="text-[#f9fafb]/50 text-[9px] flex items-center mt-1">
              <FaCalendarAlt className="mr-1 text-[#e02424]" />
              Posted:{" "}
              {product.created_at
                ? new Date(product.created_at).toLocaleDateString()
                : "Recently"}
            </p>
          </div>

          {/* STATS ROW — varies by type */}
          <div className="flex justify-between items-center py-2 mt-2 border-y border-white/10 text-white">
            {kind === "land" && <LandStats product={product} />}
            {kind === "house" && <HouseStats product={product} />}
            {kind === "apartment" && <ApartmentStats product={product} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCard;