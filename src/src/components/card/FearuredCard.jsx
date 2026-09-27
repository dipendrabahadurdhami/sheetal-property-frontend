import React, { useEffect, useState, useMemo } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {
  FaMapMarkerAlt, FaCalendarAlt, FaHashtag
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { removeFavoriteList, setFavoritesList } from "../../features/slices/favourites";
import apiClient from "../../utils/apiClient";

const formatNepaliPrice = (amount) => {
  if (!amount) return null;
  const num = Number(amount);
  if (isNaN(num)) return null;
  return new Intl.NumberFormat("en-IN").format(num);
};

const getChipClass = (product) => {
  const days = product.created_at
    ? Math.floor((Date.now() - new Date(product.created_at)) / 86400000)
    : 999;
  if (days <= 7)  return { cls: "chip-new",      label: "New" };
  if (days <= 30) return { cls: "chip-prime",    label: "Prime" };
  if (product.featured) return { cls: "chip-featured", label: "Featured" };
  return null;
};

const styles = `
  :root {
    --r:   #b91c1c;
    --r28: rgba(185,28,28,0.28);
  }

  .fc-card {
    position: relative;
    height: 357px;
    width: 100%;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    background: #111;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 2px 24px rgba(0,0,0,0.18);
    transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease;
  }
  .fc-card:hover {
    transform: translateY(-6px) scale(1.012);
    box-shadow: 0 16px 48px rgba(0,0,0,0.32), 0 2px 8px rgba(224,36,36,0.12);
  }

  .fc-img-wrap {
    position: absolute;
    inset: 0;
    z-index: 0;
  }
  .fc-slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.9s ease, transform 6s ease;
    transform: scale(1.02);
  }
  .fc-slide.active {
    opacity: 1;
    transform: scale(1);
  }
  .fc-card:hover .fc-slide.active {
    transform: scale(1.02);
    transition: opacity 0.9s ease, transform 4s ease;
  }
  .fc-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    image-rendering: high-quality;
    will-change: transform;
    display: block;
  }
  .fc-img-fallback {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #111;
    display: block;
    padding: 24%;
    box-sizing: border-box;
    opacity: 0.5;
  }

  .fc-scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0,0,0,0.88) 0%,
      rgba(0,0,0,0.52) 38%,
      rgba(0,0,0,0.18) 65%,
      rgba(0,0,0,0.08) 100%
    );
  }

  .fc-progress-bars {
    position: absolute;
    top: 0; left: 0; right: 0;
    display: flex;
    gap: 3px;
    padding: 12px 14px 0;
    z-index: 30;
  }
  .fc-bar {
    height: 2px;
    flex: 1;
    border-radius: 99px;
    background: rgba(255,255,255,0.28);
    overflow: hidden;
    position: relative;
  }
  .fc-bar.active::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.9);
    animation: barFill 1.8s linear forwards;
  }
  @keyframes barFill {
    from { transform: scaleX(0); transform-origin: left; }
    to   { transform: scaleX(1); transform-origin: left; }
  }

  .fc-top-badges {
    position: absolute;
    top: 25px;
    left: 13px;
    z-index: 20;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .fc-badge {
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.13em;
    width: fit-content;
  }
  .fc-badge-purpose {
    background: var(--r);
    color: #fff;
    box-shadow: 0 2px 10px var(--r28);
  }
  .fc-badge-purpose.rent {
    background: #185FA5;
    box-shadow: 0 2px 10px rgba(24,95,165,0.35);
  }
  .fc-badge-code {
    background: rgba(255,255,255,0.14);
    color: rgba(255,255,255,0.75);
    border: 0.5px solid rgba(255,255,255,0.18);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .fc-heart {
    position: absolute;
    top: 16px;
    right: 13px;
    z-index: 20;
    width: 34px;
    height: 34px;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 50%;
    border: 0.5px solid rgba(255,255,255,0.22);
    box-shadow: 0 2px 8px rgba(0,0,0,0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }
  .fc-heart:hover { background: rgba(255,255,255,0.28); transform: scale(1.12); }
  .fc-heart:active { transform: scale(0.94); }

  .fc-panel {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    z-index: 10;
    padding: 16px 16px 18px;
  }

  .fc-price-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .fc-price {
    font-family: 'Inter', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.4px;
    line-height: 1;
    text-shadow: 0 1px 8px rgba(0,0,0,0.4);
  }
  .fc-price-sub {
    font-size: 10px;
    font-weight: 400;
    color: #fff;
    margin-left: 2px;
  }
  .fc-price-contact {
    font-size: 14px;
    font-weight: 500;
    color: #fff;
  }
  .fc-price-divider {
    height: 0.5px;
    background: rgba(255,255,255,0.15);
    margin-bottom: 8px;
  }

  .fc-chip {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    padding: 3px 9px;
    border-radius: 20px;
    white-space: nowrap;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  .chip-new      { background: rgba(4,52,44,0.65);   color: #7fdfc4; border: 0.5px solid rgba(127,223,196,0.25); }
  .chip-prime    { background: rgba(38,33,92,0.65);  color: #bbb8f8; border: 0.5px solid rgba(187,184,248,0.25); }
  .chip-featured { background: rgba(65,36,2,0.65);   color: #fac775; border: 0.5px solid rgba(250,199,117,0.25); }
  .chip-hot      { background: rgba(80,19,19,0.65);  color: #f09595; border: 0.5px solid rgba(240,149,149,0.25); }

  .fc-title {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    line-height: 1.3;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 1px 6px rgba(0,0,0,0.5);
  }

  .fc-location {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 10.5px;
    color: #fff;
    opacity: 0.85;
    line-height: 1.4;
    margin-bottom: 2px;
  }
  .fc-pin { color: var(--r); font-size: 10px; flex-shrink: 0; }

  .fc-date {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    color: rgba(255,255,255,0.55);
    line-height: 1.4;
    margin-bottom: 11px;
  }
  .fc-cal { color: rgba(255,255,255,0.28); font-size: 10px; flex-shrink: 0; }

  .fc-skeleton {
    position: relative;
    height: 357px;
    width: 100%;
    border-radius: 6px;
    overflow: hidden;
    background: #f2f2f2;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 2px 24px rgba(0,0,0,0.18);
  }
  .fc-skeleton-shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      110deg,
      #eeeeee 25%,
      #f8f8f8 50%,
      #eeeeee 75%
    );
    background-size: 200% 100%;
    animation: skeletonShimmer 1.6s ease-in-out infinite;
  }
  @keyframes skeletonShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .fc-skeleton-logo {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }
  .fc-skeleton-logo-plate {
    width: 92px;
    height: 92px;
    border-radius: 50%;
    background: rgba(0,0,0,0.04);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .fc-skeleton-logo img {
    width: 62%;
    height: 62%;
    object-fit: contain;
    opacity: 0.95;
    image-rendering: -webkit-optimize-contrast;
  }
  .fc-skeleton-panel {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 16px 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
    z-index: 3;
  }
  .fc-skeleton-bar {
    border-radius: 4px;
    background: rgba(0,0,0,0.08);
  }
  .fc-skeleton-panel .fc-skeleton-bar {
    background: rgba(255,255,255,0.15);
  }

  @media (max-width: 767px) {
    .fc-card {
      height: 220px;
      border-radius: 4px;
      box-shadow: 0 1px 8px rgba(0,0,0,0.14);
    }
    .fc-card:hover { transform: none; box-shadow: 0 1px 8px rgba(0,0,0,0.14); }
    .fc-card:active { transform: scale(0.975); transition: transform 0.1s ease; }
    .fc-top-badges { top: 8px; left: 8px; gap: 3px; }
    .fc-badge { font-size: 7.5px; padding: 2.5px 7px; border-radius: 2px; }
    .fc-heart { top: 8px; right: 8px; width: 28px; height: 28px; }
    .fc-panel { padding: 8px 10px 11px; }
    .fc-price { font-size: 17px; letter-spacing: -0.2px; }
    .fc-price-contact { font-size: 12px; }
    .fc-price-divider { margin-bottom: 5px; }
    .fc-title { font-size: 12px; margin-bottom: 3px; }
    .fc-location { font-size: 9.5px; margin-bottom: 1px; }
    .fc-date { font-size: 9px; margin-bottom: 0; }
    .fc-progress-bars { padding: 6px 8px 0; gap: 2px; }
    .fc-bar { height: 1.5px; }
    .fc-scrim {
      background: linear-gradient(
        to top,
        rgba(0,0,0,0.90) 0%,
        rgba(0,0,0,0.50) 40%,
        rgba(0,0,0,0.15) 65%,
        rgba(0,0,0,0.04) 100%
      );
    }
    .fc-skeleton { height: 178px; border-radius: 4px; }
    .fc-skeleton-logo-plate { width: 60px; height: 60px; }
  }
`;

const FeaturedCardSkeleton = () => (
  <>
    <style>{styles}</style>
    <div className="h-full p-2">
      <div className="fc-skeleton">
        <div className="fc-skeleton-shimmer" />
        <div className="fc-skeleton-logo">
          <div className="fc-skeleton-logo-plate">
            <img src="/shetallogo.png" alt="Loading" />
          </div>
        </div>
        <div style={{ position: "absolute", top: 25, left: 13, display: "flex", flexDirection: "column", gap: 5, zIndex: 10 }}>
          <div className="fc-skeleton-bar" style={{ width: 60, height: 18 }} />
          <div className="fc-skeleton-bar" style={{ width: 48, height: 16 }} />
        </div>
        <div className="fc-skeleton-bar" style={{ position: "absolute", top: 16, right: 13, width: 34, height: 34, borderRadius: "50%", zIndex: 10 }} />
        <div className="fc-skeleton-panel">
          <div className="fc-skeleton-bar" style={{ width: "55%", height: 26 }} />
          <div className="fc-skeleton-bar" style={{ width: "100%", height: 1 }} />
          <div className="fc-skeleton-bar" style={{ width: "75%", height: 16 }} />
          <div className="fc-skeleton-bar" style={{ width: "50%", height: 13 }} />
          <div className="fc-skeleton-bar" style={{ width: "40%", height: 12 }} />
        </div>
      </div>
    </div>
  </>
);

const FeaturedCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [favorite,   setFavorite]   = useState(false);
  const [imgIdx,     setImgIdx]     = useState(0);
  const [isHovered,  setIsHovered]  = useState(false);
  const [imgLoaded,  setImgLoaded]  = useState(false);

  const favorites = useSelector((state) => state.favorites.data);
  const user      = useSelector((state) => state.user);
  const token     = localStorage.getItem("sheetal_token");

  const chip = getChipClass(product);

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

  const formattedPrice = formatNepaliPrice(product?.total_price);

  if (!imgLoaded) {
    return (
      <>
        <FeaturedCardSkeleton />
        <img
          src={product?.feature_image}
          alt=""
          style={{ display: "none" }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(true)}
        />
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="h-full p-2">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => navigate(`/property/${product.url || product.id}`)}
          className="fc-card"
        >
          <div className="fc-img-wrap">
            {allImages.length > 0 ? (
              allImages.map((src, i) => (
                <div key={i} className={`fc-slide${i === imgIdx ? " active" : ""}`}>
                  <img
                    src={src}
                    alt="property"
                    className="fc-img"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/shetallogo.png";
                      e.target.className = "fc-img-fallback";
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="fc-slide active">
                <img src="/shetallogo.png" alt="property" className="fc-img-fallback" />
              </div>
            )}
            <div className="fc-scrim" />
          </div>

          {allImages.length > 1 && (
            <div className="fc-progress-bars">
              {allImages.map((_, i) => (
                <div key={i} className={`fc-bar${i === imgIdx ? " active" : ""}`} />
              ))}
            </div>
          )}

          <div className="fc-top-badges">
            <div className={`fc-badge fc-badge-purpose${isRent ? " rent" : ""}`}>
              {purposeLabel}
            </div>
            <div className="fc-badge fc-badge-code">
              <FaHashtag style={{ width: 8, height: 8 }} />
              {product.property_code || product.id}
            </div>
          </div>

          <div className="fc-heart" onClick={(e) => onFavoriteClick(e, product.id)}>
            {favorite
              ? <AiFillHeart    style={{ color: "var(--r)", width: 14, height: 14 }} />
              : <AiOutlineHeart style={{ color: "var(--r)", width: 14, height: 14 }} />
            }
          </div>

          <div className="fc-panel">
            <div className="fc-price-row">
              <div className="fc-price">
                {formattedPrice
                  ? <>Rs. {formattedPrice}<span className="fc-price-sub"></span></>
                  : <span className="fc-price-contact">Contact for Price</span>
                }
              </div>
              {chip && <div className={`fc-chip ${chip.cls}`}>{chip.label}</div>}
            </div>

            <div className="fc-price-divider" />

            <div className="fc-title">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturedCard;   