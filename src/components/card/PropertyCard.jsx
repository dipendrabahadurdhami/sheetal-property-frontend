/**
 * PropertyCard — shared reusable grid card
 * Used by: ProductSearch, Sale, Rent, Investment, SingleAgent
 */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  IoHeartOutline, IoHeartSharp,
  IoShareSocialOutline, IoLocationOutline, IoCalendarOutline,
} from "react-icons/io5";
import { removeFavoriteList, setFavoritesList } from "../../features/slices/favourites";
import apiClient from "../../utils/apiClient";

/* ─── helpers ─── */
export const fmtPrice = (v) => {
  if (!v || v === "N/A") return "Price on Request";
  const n = Number(v);
  if (isNaN(n) || n === 0) return "Price on Request";
  if (n >= 1_00_00_000) return `Rs. ${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_000)    return `Rs. ${(n / 1_00_000).toFixed(2)} L`;
  if (n >= 1_000)       return `Rs. ${(n / 1_000).toFixed(0)}K`;
  return `Rs. ${n.toLocaleString()}`;
};

export const fmtDate = (d) => {
  if (!d) return null;
  const p = new Date(d);
  if (isNaN(p.getTime()) || p.getFullYear() <= 0) return null;
  return p.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export const purposeStyle = (p = "") => {
  const lc = (p || "").toLowerCase();
  if (lc === "rent" || lc === "lease") return { color: "#065f46", bg: "#d1fae5" };
  if (lc.includes("invest"))           return { color: "#92400e", bg: "#fef3c7" };
  return { color: "#991b1b", bg: "#fee2e2" };
};

export const statusInfo = (s) => {
  const u = (s || "").toUpperCase();
  if (u === "SOLD OUT")   return { label: "Sold Out",   color: "#991b1b", bg: "#fee2e2" };
  if (u === "RENTED OUT") return { label: "Rented Out", color: "#92400e", bg: "#fef3c7" };
  return { label: "Available", color: "#065f46", bg: "#d1fae5" };
};

export const isSoldProp = (p) => {
  const v = p?.sold ?? p?.is_sold ?? p?.property_sold;
  if (v === null || v === undefined || v === "" || v === 0 || v === "0" || v === false || v === "false") return false;
  return true;
};

export const getPropId     = (p) => p?.property_code ? `#${p.property_code}` : p?.id ? `#${p.id}` : null;
export const getPostedDate = (p) => fmtDate(p?.posted_date || p?.created_at || p?.post_date || p?.date_posted || p?.publishedAt || null);
export const getTitle      = (p) => p?.title || p?.name || "";

export const IMG_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260'%3E%3Crect width='400' height='260' fill='%23f2f2ef'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='11' fill='%23ccc'%3ENo image%3C/text%3E%3C/svg%3E";

/* ─── share socials ─── */
const SOCIALS = [
  { key: "whatsapp", label: "WhatsApp",    dot: "#25D366" },
  { key: "facebook", label: "Facebook",    dot: "#1877F2" },
  { key: "twitter",  label: "Twitter / X", dot: "#111111" },
  { key: "viber",    label: "Viber",       dot: "#7360F2" },
  { key: "copy",     label: "Copy Link",   dot: "#6b7280" },
];

/* ─── ShareMenu ─── */
const ShareMenu = ({ propertyId, propertySlug, onClose }) => {
  const url = `${window.location.origin}/property/${propertySlug || propertyId}`;
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  const share = (key) => {
    const enc = encodeURIComponent(url);
    if (key === "copy") {
      navigator.clipboard.writeText(url)
        .then(() => toast.success("Link copied!"))
        .catch(() => toast.error("Failed to copy"));
      onClose(); return;
    }
    const map = {
      whatsapp: `https://wa.me/?text=${enc}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
      twitter:  `https://twitter.com/intent/tweet?url=${enc}`,
      viber:    `viber://forward?text=${enc}`,
    };
    window.open(map[key], "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div ref={ref} className="pc-sm-menu" onClick={(e) => e.stopPropagation()}>
      <p className="pc-sm-heading">Share via</p>
      {SOCIALS.map(({ key, label, dot }) => (
        <button key={key} className="pc-sm-item" onClick={() => share(key)}>
          <span className="pc-sm-dot" style={{ background: dot }} />
          {label}
        </button>
      ))}
    </div>
  );
};

/* ─── useFavorite hook ─── */
export const useFavorite = (propertyId) => {
  const dispatch  = useDispatch();
  const favorites = useSelector((s) => s.favorites.data);
  const user      = useSelector((s) => s.user);
  const [, setQS] = useSearchParams();
  const token     = localStorage.getItem("sheetal_token");
  const isInFav   = !!favorites?.find((f) => f.property_id === propertyId);
  const [fav, setFav] = useState(isInFav);

  useEffect(() => { setFav(isInFav); }, [isInFav]);
  useEffect(() => { if (!user.data) setFav(false); }, [user]);

  const toggle = useCallback(async (e) => {
    e.stopPropagation();
    if (!user.data && !token) { setQS("?login=1"); return; }
    const already = favorites?.find((f) => f.property_id === propertyId);
    if (already) {
      setFav(false);
      dispatch(removeFavoriteList(propertyId));
      try {
        const r = await apiClient.post("/remove-from-favourite", { property_id: propertyId });
        r.status === 200 ? toast.success("Removed from favourites") : toast.error("Failed to remove");
      } catch { }
    } else {
      setFav(true);
      dispatch(setFavoritesList(propertyId));
      try {
        const r = await apiClient.post("/add-to-favourite", { property_id: propertyId });
        r.status === 200 ? toast.success("Saved to favourites") : toast.error("Failed to save");
      } catch { }
    }
  }, [dispatch, favorites, propertyId, token, user, setQS]);

  return { fav, toggle };
};

/* ─── SoldOverlay ─── */
const SoldOverlay = () => (
  <div className="pc-sold-overlay">
    <span className="pc-sold-label">SOLD</span>
  </div>
);

/* ─── CardMeta ─── */
const CardMeta = ({ property }) => {
  const pid    = getPropId(property);
  const posted = getPostedDate(property);
  const sold   = isSoldProp(property);
  return (
    <div className="pc-meta-row">
      {pid    && <span className="pc-meta-pid">{pid}</span>}
      {posted && <span className="pc-meta-date"><IoCalendarOutline size={10} />{posted}</span>}
      {sold   && <span className="pc-meta-sold">SOLD</span>}
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN EXPORT — PropertyCard (grid card)
══════════════════════════════════════════ */
const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const [imgErr,    setImgErr]    = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { fav, toggle } = useFavorite(property?.id);

  const ps    = purposeStyle(property?.purpose || "");
  const si    = statusInfo(property?.property_status);
  const image = !imgErr && property?.feature_image ? property.feature_image : IMG_FALLBACK;
  const price = fmtPrice(property?.total_price || property?.price);
  const sold  = isSoldProp(property);
  const title = getTitle(property);
  const go    = () => navigate(`/property/${property.url || property.id}`);

  return (
    <article className="pc-card" onClick={go}>
      {/* image */}
      <div className="pc-img-wrap">
        <img src={image} alt="" onError={() => setImgErr(true)} className="pc-img" />
        {sold && <SoldOverlay />}
        <div className="pc-img-top">
          <span className="pc-tag" style={{ color: ps.color, background: ps.bg }}>
            {property?.purpose || "Sale"}
          </span>
          <button className="pc-heart" onClick={toggle} aria-label="Save">
            {fav
              ? <IoHeartSharp   size={13} color="#b91c1c" />
              : <IoHeartOutline size={13} color="rgba(255,255,255,0.9)" />}
          </button>
        </div>
        <div className="pc-price-bar">
          <span className="pc-price">{price}</span>
        </div>
      </div>

      {/* body */}
      <div className="pc-body">
        <div className="pc-title-row">
          <p className="pc-title" title={title}>{title || "Untitled Property"}</p>
          <span className="pc-tag" style={{ color: si.color, background: si.bg, flexShrink: 0 }}>
            {si.label}
          </span>
        </div>
        {property?.property_location && (
          <p className="pc-loc">
            <IoLocationOutline size={11} color="#b91c1c" />
            {property.property_location}
          </p>
        )}
        <div className="pc-tags">
          {property?.property_category && <span className="pc-chip">{property.property_category}</span>}
          {property?.property_type      && <span className="pc-chip">{property.property_type}</span>}
        </div>
      </div>

      {/* footer */}
      <div className="pc-footer">
        <CardMeta property={property} />
        <div className="pc-actions">
          <button
            className="pc-share-btn"
            onClick={(e) => { e.stopPropagation(); setShareOpen(v => !v); }}
            aria-label="Share"
          >
            <IoShareSocialOutline size={13} />
          </button>
          <button className="pc-detail-btn" onClick={(e) => { e.stopPropagation(); go(); }}>
            Details
          </button>
          {shareOpen && (
            <div className="pc-share-anchor">
              <ShareMenu propertyId={property.id} propertySlug={property.url} onClose={() => setShareOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

/* ─── Skeleton card ─── */
export const PropertyCardSkeleton = () => (
  <div className="pc-card pc-skeleton">
    <div className="pc-img-wrap pc-sk-block" />
    <div className="pc-body">
      <div className="pc-sk-line" style={{ width: "70%", height: 13, marginBottom: 7 }} />
      <div className="pc-sk-line" style={{ width: "46%", height: 11 }} />
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <div className="pc-sk-line" style={{ width: 52, height: 20 }} />
        <div className="pc-sk-line" style={{ width: 44, height: 20 }} />
      </div>
    </div>
    <div className="pc-footer">
      <div className="pc-sk-line" style={{ width: 88, height: 11 }} />
      <div className="pc-sk-line" style={{ width: 62, height: 28 }} />
    </div>
  </div>
);

/* ─── Grid wrapper — consistent 1→2→3→4 cols across all pages ─── */
export const PropertyGrid = ({ children, style }) => (
  <div className="pc-grid" style={style}>{children}</div>
);

/* ─── CSS — inject once per page via <PropertyCardStyles /> ─── */
export const PROPERTY_CARD_CSS = `
  @keyframes pc-shimmer {
    0%   { background-position: -600px 0 }
    100% { background-position:  600px 0 }
  }

  .pc-card {
    background: #fff;
    border: 0.5px solid #E9EAEC;
    border-radius: 4px;
    overflow: visible;
    transition: border-color .18s, box-shadow .18s;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    font-family: 'Outfit', sans-serif;
  }
  .pc-card:hover { border-color: #bbb; box-shadow: 0 4px 18px rgba(0,0,0,0.08); }

  .pc-img-wrap {
    position: relative;
    height: 185px;
    background: #eee;
    overflow: hidden;
    flex-shrink: 0;
    border-radius: 4px 4px 0 0;
    z-index: 0;
  }
  .pc-img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
    transition: transform .38s ease;
  }
  .pc-card:hover .pc-img { transform: scale(1.04); }

  .pc-img-top {
    position: absolute; top: 0; left: 0; right: 0;
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 9px 9px 0; z-index: 8;
  }
  .pc-price-bar {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 28px 11px 9px;
    background: linear-gradient(to top, rgba(0,0,0,0.66), transparent);
    z-index: 6;
  }
  .pc-price { font-size: 13px; font-weight: 800; color: #fff; }

  .pc-sold-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    z-index: 7;
  }
  .pc-sold-label {
    background: #e02424; color: #fff;
    font-size: 11px; font-weight: 800;
    padding: 5px 16px; border-radius: 4px; letter-spacing: 3px;
  }

  .pc-tag {
    display: inline-block;
    font-size: 9px; font-weight: 700;
    padding: 3px 8px; border-radius: 4px;
    letter-spacing: 0.6px; text-transform: uppercase; line-height: 1;
  }

  .pc-heart {
    width: 27px; height: 27px; border-radius: 4px;
    background: rgba(0,0,0,0.30); border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0; transition: background .15s;
  }
  .pc-heart:hover { background: rgba(0,0,0,0.50); }

  .pc-body {
    padding: 10px 12px 6px; flex: 1;
    display: flex; flex-direction: column; gap: 4px;
    min-width: 0; overflow: hidden;
  }
  .pc-title-row {
    display: flex; align-items: center;
    justify-content: space-between; gap: 6px; margin-bottom: 2px;
  }
  .pc-title {
    font-size: 12.5px; font-weight: 600; color: #0F172A;
    line-height: 1.4; overflow: hidden;
    text-overflow: ellipsis; white-space: nowrap;
    margin: 0; flex: 1;
  }
  .pc-loc {
    display: flex; align-items: center; gap: 3px;
    font-size: 11px; color: #777;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    width: 100%; margin: 0;
  }
  .pc-tags { display: flex; gap: 5px; flex-wrap: wrap; overflow: hidden; }
  .pc-chip {
    font-size: 10px; color: #666; background: #f3f3f0;
    padding: 2px 8px; border-radius: 4px; line-height: 1.6;
    white-space: nowrap; border: 0.5px solid #E9EAEC;
  }

  .pc-footer {
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 7px 12px 10px;
    border-top: 1px solid #f0f0ee;
    margin-top: auto; gap: 6px; flex-wrap: wrap;
    min-width: 0; overflow: visible;
    position: relative; z-index: 20;
  }
  .pc-actions {
    display: flex; align-items: center; gap: 6px;
    position: relative; flex-shrink: 0; z-index: 300;
  }
  .pc-share-btn {
    display: flex; align-items: center; justify-content: center;
    width: 30px; height: 30px; border-radius: 4px;
    background: #f5f5f3; border: 0.5px solid #E9EAEC;
    cursor: pointer; color: #666; flex-shrink: 0;
    transition: border-color .15s, color .15s;
  }
  .pc-share-btn:hover { border-color: #e02424; color: #e02424; }
  .pc-detail-btn {
    font-size: 11px; font-weight: 700; color: #fff;
    background: #e02424; border: none; border-radius: 4px;
    padding: 6px 14px; cursor: pointer; font-family: inherit;
    transition: background .15s; white-space: nowrap; line-height: 1; flex-shrink: 0;
  }
  .pc-detail-btn:hover { background: #991b1b; }

  .pc-share-anchor {
    position: absolute; bottom: calc(100% + 6px); right: 0; z-index: 200;
  }
  .pc-sm-menu {
    background: #fff; border: 0.5px solid #E9EAEC; border-radius: 4px;
    box-shadow: 0 8px 28px rgba(0,0,0,0.13);
    padding: 8px 0; min-width: 180px; font-family: inherit;
  }
  .pc-sm-heading {
    font-size: 9.5px; font-weight: 700; color: #bbb;
    text-transform: uppercase; letter-spacing: .7px;
    padding: 0 14px 6px; margin: 0;
  }
  .pc-sm-item {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 8px 14px;
    background: none; border: none; cursor: pointer;
    font-size: 12.5px; font-weight: 500; color: #333;
    font-family: inherit; text-align: left; transition: background .1s;
  }
  .pc-sm-item:hover { background: #f7f7f5; }
  .pc-sm-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  .pc-meta-row {
    display: flex; align-items: center; gap: 7px;
    flex-wrap: wrap; min-width: 0; overflow: hidden;
  }
  .pc-meta-pid {
    font-family: monospace; font-size: 10px; color: #aaa;
    font-weight: 500; white-space: nowrap;
  }
  .pc-meta-date {
    display: flex; align-items: center; gap: 3px;
    font-size: 10px; color: #bbb; white-space: nowrap;
  }
  .pc-meta-sold {
    font-size: 9px; font-weight: 800; color: #fff;
    background: #e02424; padding: 2px 6px;
    border-radius: 4px; letter-spacing: 1.5px; white-space: nowrap;
  }

  .pc-skeleton { pointer-events: none; }
  .pc-sk-block {
    background: linear-gradient(90deg, #F5F6F8 25%, #E9EAEC 50%, #F5F6F8 75%);
    background-size: 600px 100%;
    animation: pc-shimmer 1.4s infinite;
  }
  .pc-sk-line {
    border-radius: 4px;
    background: linear-gradient(90deg, #F5F6F8 25%, #E9EAEC 50%, #F5F6F8 75%);
    background-size: 600px 100%;
    animation: pc-shimmer 1.4s infinite;
  }

  /* Grid — 1 col → 2 → 3 → 4, same on every page */
  .pc-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 12px;
    width: 100%;
  }
  @media (min-width: 500px)  { .pc-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 820px)  { .pc-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 1140px) { .pc-grid { grid-template-columns: repeat(4, 1fr); } }
`;

export const PropertyCardStyles = () => (
  <style>{PROPERTY_CARD_CSS}</style>
);

export default PropertyCard;