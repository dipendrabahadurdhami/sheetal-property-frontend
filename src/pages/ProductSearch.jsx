import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { removeFavoriteList, setFavoritesList } from "../features/slices/favourites";
import apiClient from "../utils/apiClient";
import HomeSearch from "../components/Common/SearchBox/HomeSearch";
import {
  IoGridOutline, IoListOutline, IoLocationOutline,
  IoChevronBackOutline, IoChevronForwardOutline,
  IoHeartOutline, IoHeartSharp, IoShareSocialOutline,
  IoHomeOutline, IoCalendarOutline,
} from "react-icons/io5";

const ITEMS_PER_PAGE = 12;

const fmtPrice = (v) => {
  if (!v || v === "N/A") return "Price on Request";
  const n = Number(v);
  if (isNaN(n) || n === 0) return "Price on Request";
  if (n >= 1_00_00_000) return `Rs. ${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_000) return `Rs. ${(n / 1_00_000).toFixed(2)} L`;
  if (n >= 1_000) return `Rs. ${(n / 1_000).toFixed(0)}K`;
  return `Rs. ${n.toLocaleString()}`;
};

const fmtDate = (d) => {
  if (!d || d === "0000-00-00" || d === "0000-00-00 00:00:00") return null;
  const str = String(d).trim();
  if (!str) return null;
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    if (parsed.getFullYear() <= 0) return null;
    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  }
  return str.length > 4 && str.length < 40 ? str : null;
};

const purposeStyle = (p = "") => {
  const lc = (p || "").toLowerCase();
  if (lc === "rent" || lc === "lease") return { color: "#065f46", bg: "#d1fae5" };
  if (lc.includes("invest")) return { color: "#92400e", bg: "#fef3c7" };
  return { color: "#991b1b", bg: "#fee2e2" };
};

const isSoldProp = (p) => {
  const v = p?.sold ?? p?.is_sold ?? p?.property_sold;
  if (v === null || v === undefined || v === "" || v === 0 || v === "0" || v === false || v === "false") return false;
  return true;
};

const getPropId = (p) =>
  p?.property_code ? `#${p.property_code}` : p?.id ? `#${p.id}` : null;

const getPostedDate = (p) =>
  fmtDate(
    p?.posted_date || p?.created_at || p?.post_date || p?.date_posted || p?.publishedAt || null
  );

const getTitle = (p) => p?.title || p?.name || "";

const IMG_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260'%3E%3Crect width='400' height='260' fill='%23f2f2ef'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='11' fill='%23ccc'%3ENo image%3C/text%3E%3C/svg%3E";

const useFavorite = (propertyId) => {
  const dispatch = useDispatch();
  const favorites = useSelector((s) => s.favorites.data);
  const user = useSelector((s) => s.user);
  const [, setQS] = useSearchParams();
  const token = localStorage.getItem("sheetal_token");
  const isInFav = !!favorites?.find((f) => f.property_id === propertyId);
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

const SOCIALS = [
  { key: "whatsapp", label: "WhatsApp", dot: "#25D366" },
  { key: "facebook", label: "Facebook", dot: "#1877F2" },
  { key: "twitter", label: "Twitter / X", dot: "#111111" },
  { key: "viber", label: "Viber", dot: "#7360F2" },
  { key: "copy", label: "Copy Link", dot: "#6b7280" },
];

const ShareMenu = ({ propertyId, onClose }) => {
  const url = `${window.location.origin}/property/${propertyId}`;
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
      onClose();
      return;
    }
    const map = {
      whatsapp: `https://wa.me/?text=${enc}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
      twitter: `https://twitter.com/intent/tweet?url=${enc}`,
      viber: `viber://forward?text=${enc}`,
    };
    window.open(map[key], "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div ref={ref} className="sm-menu" onClick={(e) => e.stopPropagation()}>
      <p className="sm-heading">Share via</p>
      {SOCIALS.map(({ key, label, dot }) => (
        <button key={key} className="sm-item" onClick={() => share(key)}>
          <span className="sm-dot" style={{ background: dot }} />
          {label}
        </button>
      ))}
    </div>
  );
};

const SoldOverlay = () => (
  <div className="sold-overlay">
    <span className="sold-label">SOLD</span>
  </div>
);

const CardMeta = ({ property }) => {
  const pid = getPropId(property);
  const posted = getPostedDate(property);
  const sold = isSoldProp(property);
  return (
    <div className="card-meta-row">
      {pid && <span className="meta-pid">{pid}</span>}
      {posted && (
        <span className="meta-date">
          <IoCalendarOutline size={10} />
          {posted}
        </span>
      )}
      {sold && <span className="meta-sold">SOLD</span>}
    </div>
  );
};

const statusInfo = (s) => {
  const u = (s || "").toUpperCase();
  if (u === "SOLD OUT") return { label: "Sold Out", color: "#991b1b", bg: "#fee2e2" };
  if (u === "RENTED OUT") return { label: "Rented Out", color: "#92400e", bg: "#fef3c7" };
  return { label: "Available", color: "#065f46", bg: "#d1fae5" };
};

const GridCard = ({ property }) => {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { fav, toggle } = useFavorite(property?.id);
  const ps = purposeStyle(property?.purpose || "");
  const image = !imgErr && property?.feature_image ? property.feature_image : IMG_FALLBACK;
  const price = fmtPrice(property?.total_price);
  const sold = isSoldProp(property);
  const title = getTitle(property);
  const go = () => navigate(`/property/${property.id}`);

  return (
    <article className="ps-card gc" onClick={go}>
      <div className="gc-img-wrap">
        <img src={image} alt="" onError={() => setImgErr(true)} className="gc-img" />
        {sold && <SoldOverlay />}
        <div className="gc-img-top">
          <span className="purpose-tag" style={{ color: ps.color, background: ps.bg }}>
            {property?.purpose || "Sale"}
          </span>
          <button className="heart-btn" onClick={toggle} aria-label="Save">
            {fav
              ? <IoHeartSharp size={13} color="#b91c1c" />
              : <IoHeartOutline size={13} color="rgba(255,255,255,0.9)" />}
          </button>
        </div>
        <div className="gc-price-bar">
          <span className="gc-price">{price}</span>
        </div>
      </div>

      <div className="gc-body">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, marginBottom: 2 }}>
          <p className="gc-title" title={title} style={{ margin: 0, flex: 1 }}>
            {title || "Untitled Property"}
          </p>
          <span className="purpose-tag" style={{ color: statusInfo(property?.property_status).color, background: statusInfo(property?.property_status).bg, flexShrink: 0 }}>
            {statusInfo(property?.property_status).label}
          </span>
        </div>
        {property?.property_location && (
          <p className="gc-loc">
            <IoLocationOutline size={11} color="#b91c1c" />
            {property.property_location}
          </p>
        )}
        <div className="gc-tags">
          {property?.property_category && <span className="tag">{property.property_category}</span>}
          {property?.property_type && <span className="tag">{property.property_type}</span>}
        </div>
      </div>

      <div className="gc-footer">
        <CardMeta property={property} />
        <div className="gc-actions">
          <button
            className="share-btn"
            onClick={(e) => { e.stopPropagation(); setShareOpen(v => !v); }}
            aria-label="Share"
          >
            <IoShareSocialOutline size={13} />
          </button>
          <button className="detail-btn" onClick={(e) => { e.stopPropagation(); go(); }}>
            Details
          </button>
          {shareOpen && (
            <div className="share-anchor">
              <ShareMenu propertyId={property.id} onClose={() => setShareOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

const ListCard = ({ property }) => {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { fav, toggle } = useFavorite(property?.id);
  const ps = purposeStyle(property?.purpose || "");
  const image = !imgErr && property?.feature_image ? property.feature_image : IMG_FALLBACK;
  const price = fmtPrice(property?.total_price);
  const sold = isSoldProp(property);
  const title = getTitle(property);
  const go = () => navigate(`/property/${property.id}`);

  const details = [
    { label: "Category", value: property?.property_category },
    { label: "Type", value: property?.property_type },
    { label: "Purpose", value: property?.purpose },
    {
      label: "Area",
      value: property?.land_area_in_sqft_according_to_lal_purja
        ? `${property.land_area_in_sqft_according_to_lal_purja} sq.ft.`
        : null,
    },
  ].filter((d) => d.value);

  return (
    <article className="ps-card lc" onClick={go}>
      <div className="lc-img-wrap">
        <img src={image} alt="" onError={() => setImgErr(true)} className="lc-img" />
        {sold && <SoldOverlay />}
        <span className="purpose-tag lc-purpose" style={{ color: ps.color, background: ps.bg }}>
          {property?.purpose || "Sale"}
        </span>
        <button className="lc-img-heart heart-btn" onClick={toggle} aria-label="Save">
          {fav
            ? <IoHeartSharp size={13} color="#b91c1c" />
            : <IoHeartOutline size={13} color="rgba(255,255,255,0.9)" />}
        </button>
      </div>

      <div className="lc-content">
        <div className="lc-top">
          <div className="lc-title-wrap">
            <h2 className="lc-title">{title || "Untitled Property"}</h2>
            {property?.property_location && (
              <p className="lc-loc">
                <IoLocationOutline size={11} color="#b91c1c" style={{ flexShrink: 0 }} />
                {property.property_location}
              </p>
            )}
          <span className="purpose-tag lc-status-mob" style={{ color: statusInfo(property?.property_status).color, background: statusInfo(property?.property_status).bg }}>
              {statusInfo(property?.property_status).label}
            </span>
          </div>
          <div className="lc-price-col">
            <span className="purpose-tag lc-status-desk" style={{ color: statusInfo(property?.property_status).color, background: statusInfo(property?.property_status).bg }}>
              {statusInfo(property?.property_status).label}
            </span>
            <span className="lc-price">{price}</span>
            <button className="heart-btn heart-flat lc-heart-desk" onClick={toggle} aria-label="Save">
              {fav
                ? <IoHeartSharp size={16} color="#b91c1c" />
                : <IoHeartOutline size={16} color="#ccc" />}
            </button>
          </div>
        </div>

        {details.length > 0 && (
          <div className="lc-detail-grid">
            {details.map(({ label, value }) => (
              <div key={label} className="lc-cell">
                <span className="cell-lbl">{label}</span>
                <span className="cell-val">{value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="lc-footer">
          <CardMeta property={property} />
          <div className="lc-actions">
            <button
              className="share-btn share-btn-text"
              onClick={(e) => { e.stopPropagation(); setShareOpen(v => !v); }}
            >
              <IoShareSocialOutline size={13} />
              <span className="share-label">Share</span>
            </button>
            <button className="detail-btn" onClick={(e) => { e.stopPropagation(); go(); }}>
              Details
            </button>
            {shareOpen && (
              <div className="share-anchor">
                <ShareMenu propertyId={property.id} onClose={() => setShareOpen(false)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

const SkeletonGrid = () => (
  <div className="ps-card gc skeleton">
    <div className="gc-img-wrap sk-block" />
    <div className="gc-body">
      <div className="sk-line" style={{ width: "70%", height: 13, marginBottom: 7 }} />
      <div className="sk-line" style={{ width: "46%", height: 11 }} />
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <div className="sk-line" style={{ width: 52, height: 20 }} />
        <div className="sk-line" style={{ width: 44, height: 20 }} />
      </div>
    </div>
    <div className="gc-footer">
      <div className="sk-line" style={{ width: 88, height: 11 }} />
      <div className="sk-line" style={{ width: 62, height: 28 }} />
    </div>
  </div>
);

const SkeletonList = () => (
  <div className="ps-card lc skeleton">
    <div className="lc-img-wrap sk-block" />
    <div className="lc-content">
      <div className="sk-line" style={{ width: "42%", height: 15 }} />
      <div className="sk-line" style={{ width: "30%", height: 11, marginTop: 6 }} />
      <div className="lc-detail-grid" style={{ marginTop: 10 }}>
        {[1, 2, 3, 4].map((i) => <div key={i} className="sk-line" style={{ height: 34 }} />)}
      </div>
    </div>
  </div>
);

const GhostCard = () => (
  <div
    aria-hidden="true"
    className="ps-card gc"
    style={{
      visibility: "hidden",
      pointerEvents: "none",
      background: "transparent",
      border: "none",
      boxShadow: "none",
    }}
  >
    <div className="gc-img-wrap" style={{ background: "transparent" }} />
    <div className="gc-body" style={{ flex: 1 }} />
    <div className="gc-footer" style={{ borderTop: "none" }} />
  </div>
);

const ProductSearch = () => {
  const [params, setParams] = useSearchParams(window.location.search);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState("grid");

  const buildQuery = useCallback(() => {
    const g = (k, fb = "") => (params.get(k) || fb).trim();
    const q = {
      keyword: g("keyword"),
      advertisement_purpose: g("advertisement_purpose"),
      property_type: g("property_type"),
      category: g("category"),
      min_price: g("min_price", "0"),
      max_price: g("max_price", "100000000"),
      price_order: g("price_order", "all"),
      date_from: g("date_from"),
      date_to: g("date_to"),
      min_bedrooms: g("min_bedrooms"),
      min_bathrooms: g("min_bathrooms"),
      min_floors: g("min_floors"),
      min_parking: g("min_parking"),
      min_land_sqft: g("min_land_sqft"),
      max_land_sqft: g("max_land_sqft"),
      property_status: g("property_status"),
      price_order: g("price_order", "all"),
      page: g("page", "1"),
      itemsPerPage: ITEMS_PER_PAGE,
    };
    // strip empty strings so API doesn't receive blank params
    Object.keys(q).forEach((k) => { if (q[k] === "") delete q[k]; });
    return q;
  }, [params]);

  const fetchSearch = useCallback(async () => {
    setLoading(true);
    try {
      const isFeatured = params.get("featured") === "true";
      const endpoint = isFeatured ? "/featured-property-list" : "/search";
      const res = await apiClient.get(endpoint, { params: isFeatured ? {} : buildQuery() });
      if (res.status === 200) {
        // featured endpoint returns array directly or wrapped differently
        const raw = res.data?.data ?? res.data;
        const list = Array.isArray(raw) ? raw : [];
        setProducts(list);
        setTotalProducts(res.data?.total ?? res.data?.meta?.total ?? list.length);
        setPageCount(res.data?.last_page ?? res.data?.meta?.last_page ?? Math.ceil(list.length / ITEMS_PER_PAGE));
        setCurrentPage((res.data?.current_page ?? res.data?.meta?.current_page ?? 1) - 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  useEffect(() => {
    fetchSearch();
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageClick = ({ selected }) => {
    const current = Object.fromEntries([...params]);
    setParams({ ...current, page: String(selected + 1) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ghostCount =
    viewMode === "grid" && products.length > 0 && products.length < ITEMS_PER_PAGE
      ? (4 - (products.length % 4)) % 4
      : 0;

  const activeTab = {
    advertisement_purpose: params.get("advertisement_purpose") || undefined,
    property_type: params.get("property_type") || undefined,
  };
  const keyword = params.get("keyword") || "";

  return (
    <div className="ps-root">
      <Helmet>
        <title>{keyword ? `${keyword} — Properties in Nepal` : "Search Properties in Nepal"} | Sheetal Property Nepal</title>
        <meta name="description" content={keyword ? `Find ${totalProducts} verified properties matching "${keyword}" in Nepal. Buy, sell and rent houses, land, apartments and commercial spaces.` : `Search ${totalProducts} verified properties across Nepal. Find houses, land, apartments and commercial spaces for sale and rent.`} />
        <meta name="keywords" content={`${keyword ? keyword + ", " : ""}property Nepal, real estate Nepal, house for sale Nepal, land for sale Nepal, flat for rent Kathmandu, Sheetal Property`} />
        <link rel="canonical" href="https://sheetalproperty.com/search" />
        <meta property="og:title" content={`${keyword ? keyword + " — " : ""}Search Properties in Nepal | Sheetal Property Nepal`} />
        <meta property="og:description" content={`Search verified properties across Nepal. Find your perfect home or investment today on Sheetal Property Nepal.`} />
        <meta property="og:url" content="https://sheetalproperty.com/search" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sheetal Property Nepal" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Search Properties in Nepal | Sheetal Property Nepal" />
      </Helmet>
      <style>{CSS}</style>

      <header className="ps-search-header">
        <div className="ps-search-inner">
          <HomeSearch showFilters={true} activeTab={activeTab} navigateOnFilter={true} />
        </div>
      </header>

      <main className="ps-content">
        <div className="ps-toolbar">
          <p className="ps-count">
            {loading ? (
              <span className="ps-count-loading">Searching…</span>
            ) : (
              <>
                <strong>{totalProducts.toLocaleString()}</strong>{" "}
                propert{totalProducts === 1 ? "y" : "ies"} found
                {keyword && <> for <em>"{keyword}"</em></>}
              </>
            )}
          </p>
          <div className="ps-toggle">
            {[
              { mode: "list", Icon: IoListOutline, label: "List" },
              { mode: "grid", Icon: IoGridOutline, label: "Grid" },
            ].map(({ mode, Icon, label }) => (
              <button
                key={mode}
                className={`ps-toggle-btn${viewMode === mode ? " active" : ""}`}
                onClick={() => setViewMode(mode)}
                title={`${label} view`}
              >
                <Icon size={15} />
                <span className="toggle-lbl">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          viewMode === "grid" ? (
            <div className="grid-layout">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <SkeletonGrid key={i} />)}
            </div>
          ) : (
            <div className="list-layout">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonList key={i} />)}
            </div>
          )
        ) : products.length === 0 ? (
          <div className="ps-empty">
            <div className="ps-empty-icon"><IoHomeOutline size={26} color="#ccc" /></div>
            <p className="ps-empty-title">No properties found</p>
            <p className="ps-empty-sub">Try adjusting your search filters or location</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid-layout">
            {products.map((p, i) => <GridCard key={p.id ?? i} property={p} />)}
            {Array.from({ length: ghostCount }).map((_, i) => <GhostCard key={`gh${i}`} />)}
          </div>
        ) : (
          <div className="list-layout">
            {products.map((p, i) => <ListCard key={p.id ?? i} property={p} />)}
          </div>
        )}

        {!loading && pageCount > 1 && (
          <div className="ps-pag-wrap">
            <ReactPaginate
              breakLabel="…"
              nextLabel={<IoChevronForwardOutline size={13} />}
              previousLabel={<IoChevronBackOutline size={13} />}
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              pageCount={pageCount}
              forcePage={currentPage}
              renderOnZeroPageCount={null}
              containerClassName="ps-pag"
              pageLinkClassName="pg-a"
              previousLinkClassName="pg-a"
              nextLinkClassName="pg-a"
              breakLinkClassName="pg-a"
            />
          </div>
        )}
      </main>
    </div>
  );
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=DM+Mono:wght@400;500&display=swap');

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .ps-root, .ps-root * { box-sizing: border-box; }

  .ps-root {
    --r:  #b91c1c;
    --rd: #991b1b;
    --d:  #111111;
    --bg: #f4f3f0;
    --bd: 1px solid #e4e4e0;
    --br: 4px;
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    margin-top: 70px;
    min-height: 100vh;
    background: var(--bg);
    color: var(--d);
  }

  .ps-search-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #fff;
    border-bottom: var(--bd);
    padding: 12px 0;
    box-shadow: 0 1px 8px rgba(0,0,0,0.06);
  }
  .ps-search-inner {
    max-width: 860px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .ps-content {
    max-width: 1320px;
    margin: 0 auto;
    padding: 16px 16px 80px;
  }
  @media (min-width: 600px)  { .ps-content { padding: 20px 24px 80px; } }
  @media (min-width: 1024px) { .ps-content { padding: 24px 32px 80px; } }

  .ps-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    gap: 8px;
    flex-wrap: wrap;
  }
  .ps-count { font-size: 12.5px; color: #888; margin: 0; }
  .ps-count strong { color: var(--d); font-weight: 700; }
  .ps-count em     { color: var(--r); font-style: italic; }
  .ps-count-loading { color: #bbb; }

  .ps-toggle {
    display: flex;
    border: var(--bd);
    border-radius: var(--br);
    overflow: hidden;
  }
  .ps-toggle-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    height: 32px;
    padding: 0 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #bbb;
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    transition: background .15s, color .15s;
  }
  .ps-toggle-btn.active { background: var(--r); color: #fff; }
  .ps-toggle-btn:not(.active):hover { background: #f5f5f3; color: #555; }
  .toggle-lbl { display: none; }
  @media (min-width: 380px) { .toggle-lbl { display: inline; } }

  .ps-card {
    background: #fff;
    border: var(--bd);
    border-radius: var(--br);
    overflow: visible;
    transition: border-color .18s, box-shadow .18s;
    cursor: pointer;
    width: 100%;
    min-width: 0;
  }
  .ps-card:hover { border-color: #bbb; box-shadow: 0 4px 18px rgba(0,0,0,0.08); }

  .purpose-tag {
    display: inline-block;
    font-size: 9px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 4px;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    line-height: 1;
  }

  .sold-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 7;
  }
  .sold-label {
    background: var(--r);
    color: #fff;
    font-size: 11px;
    font-weight: 800;
    padding: 5px 16px;
    border-radius: 4px;
    letter-spacing: 3px;
  }

  .heart-btn {
    width: 27px;
    height: 27px;
    border-radius: 4px;
    background: rgba(0,0,0,0.30);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background .15s;
  }
  .heart-btn:hover { background: rgba(0,0,0,0.50); }
  .heart-flat            { background: transparent !important; }
  .heart-flat:hover      { background: transparent !important; }

  .card-meta-row {
    display: flex;
    align-items: center;
    gap: 7px;
    flex-wrap: wrap;
    min-width: 0;
    overflow: hidden;
  }
  .meta-pid {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: #aaa;
    font-weight: 500;
    white-space: nowrap;
  }
  .meta-date {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 10px;
    color: #bbb;
    white-space: nowrap;
  }
  .meta-sold {
    font-size: 9px;
    font-weight: 800;
    color: #fff;
    background: var(--r);
    padding: 2px 6px;
    border-radius: 4px;
    letter-spacing: 1.5px;
    white-space: nowrap;
  }

  .detail-btn {
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    background: var(--r);
    border: none;
    border-radius: 4px;
    padding: 6px 14px;
    cursor: pointer;
    font-family: inherit;
    transition: background .15s;
    white-space: nowrap;
    line-height: 1;
    flex-shrink: 0;
  }
  .detail-btn:hover { background: var(--rd); }

  .share-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 4px;
    background: #f5f5f3;
    border: var(--bd);
    cursor: pointer;
    color: #666;
    flex-shrink: 0;
    transition: border-color .15s, color .15s;
  }
  .share-btn:hover { border-color: var(--r); color: var(--r); }
  .share-btn-text {
    width: auto;
    padding: 0 10px;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    font-family: inherit;
  }
  .share-label { display: none; }
  @media (min-width: 480px) { .share-label { display: inline; } }

  .share-anchor {
    position: absolute;
    bottom: calc(100% + 6px);
    right: 0;
    z-index: 200;
  }

  .sm-menu {
    background: #fff;
    border: var(--bd);
    border-radius: 4px;
    box-shadow: 0 8px 28px rgba(0,0,0,0.13);
    padding: 8px 0;
    min-width: 180px;
    font-family: inherit;
  }
  .sm-heading {
    font-size: 9.5px;
    font-weight: 700;
    color: #bbb;
    text-transform: uppercase;
    letter-spacing: .7px;
    padding: 0 14px 6px;
    margin: 0;
  }
  .sm-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 8px 14px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12.5px;
    font-weight: 500;
    color: #333;
    font-family: inherit;
    text-align: left;
    transition: background .1s;
  }
  .sm-item:hover { background: #f7f7f5; }
  .sm-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  .grid-layout {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 12px;
    width: 100%;
  }
  @media (min-width: 500px)  { .grid-layout { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 820px)  { .grid-layout { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 1140px) { .grid-layout { grid-template-columns: repeat(4, 1fr); } }

  .gc {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .gc-img-wrap {
    position: relative;
    height: 185px;
    background: #eee;
    overflow: hidden;
    flex-shrink: 0;
    border-radius: 4px 4px 0 0;
    z-index: 0;
  }
  .gc-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform .38s ease;
  }
  .ps-card:hover .gc-img { transform: scale(1.04); }

  .gc-img-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 9px 9px 0;
    z-index: 8;
  }
  .gc-price-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 28px 11px 9px;
    background: linear-gradient(to top, rgba(0,0,0,0.66), transparent);
    z-index: 6;
  }
  .gc-price { font-size: 13px; font-weight: 800; color: #fff; }

  .gc-body {
    padding: 10px 12px 6px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    overflow: hidden;
  }
  .gc-title {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--d);
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0;
    width: 100%;
  }
  .gc-loc {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    color: #777;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
  .gc-tags {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    overflow: hidden;
  }
  .tag {
    font-size: 10px;
    color: #666;
    background: #f3f3f0;
    padding: 2px 8px;
    border-radius: 4px;
    line-height: 1.6;
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .gc-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 12px 10px;
    border-top: 1px solid #f0f0ee;
    margin-top: auto;
    gap: 6px;
    flex-wrap: wrap;
    min-width: 0;
    overflow: visible;
    position: relative;
    z-index: 20;
  }
  .gc-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    position: relative;
    flex-shrink: 0;
    z-index: 300;
  }

  .list-layout {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .lc {
    display: flex;
    flex-direction: row;
    overflow: hidden;
    min-height: 120px;
    width: 100%;
  }

  .lc-img-wrap {
    position: relative;
    width: 100px;
    flex-shrink: 0;
    background: #eee;
    overflow: hidden;
    border-radius: 4px 0 0 4px;
    z-index: 0;
  }
  @media (min-width: 420px) { .lc-img-wrap { width: 130px; } }
  @media (min-width: 600px) { .lc-img-wrap { width: 190px; } }
  @media (min-width: 820px) { .lc-img-wrap { width: 240px; } }
  @media (min-width: 1100px){ .lc-img-wrap { width: 280px; } }

  .lc-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform .38s ease;
  }
  .ps-card:hover .lc-img { transform: scale(1.03); }

  .lc-purpose { position: absolute; top: 8px; left: 8px; z-index: 6; }

  .lc-img-heart {
    position: absolute;
    bottom: 8px;
    right: 8px;
    z-index: 6;
    display: flex;
  }
  @media (min-width: 600px) { .lc-img-heart { display: none; } }

  .lc-content {
    flex: 1;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    overflow: hidden;
  }
  @media (min-width: 600px) { .lc-content { padding: 14px 18px; gap: 9px; } }

  .lc-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    min-width: 0;
    overflow: hidden;
  }
  .lc-title-wrap { flex: 1; min-width: 0; overflow: hidden; }
  .lc-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--d);
    line-height: 1.35;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
  @media (min-width: 600px) { .lc-title { font-size: 15px; } }

  .lc-loc {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    color: #777;
    margin-top: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .lc-price-col {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .lc-price {
    font-size: 12px;
    font-weight: 800;
    color: var(--d);
    white-space: nowrap;
  }
  @media (min-width: 600px) { .lc-price { font-size: 14.5px; } }

  .lc-heart-desk { display: none; }
  @media (min-width: 600px) { .lc-heart-desk { display: flex; } }

  /* status badge: mobile shows under title, desktop shows in price col */
  .lc-status-mob  { display: inline-block; margin-top: 4px; }
  .lc-status-desk { display: none; }
  @media (min-width: 600px) {
    .lc-status-mob  { display: none; }
    .lc-status-desk { display: inline-block; }
  }

  .lc-detail-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 7px;
  }
  @media (min-width: 600px) { .lc-detail-grid { gap: 10px; } }
  @media (min-width: 820px) { .lc-detail-grid { grid-template-columns: repeat(4, 1fr); } }
  @media (max-width: 360px) { .lc-detail-grid { display: none; } }

  .lc-cell { display: flex; flex-direction: column; gap: 2px; }
  .cell-lbl {
    font-size: 9px;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: .5px;
    font-weight: 600;
  }
  .cell-val { font-size: 11.5px; font-weight: 600; color: var(--d); }
  @media (min-width: 600px) { .cell-val { font-size: 12px; } }

  .lc-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #f0f0ee;
    padding-top: 8px;
    margin-top: auto;
    gap: 6px;
    flex-wrap: wrap;
    min-width: 0;
    overflow: hidden;
  }
  .lc-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    position: relative;
    flex-shrink: 0;
    z-index: 300;
  }

  .ps-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    gap: 10px;
    text-align: center;
  }
  .ps-empty-icon {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    background: #efefed;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ps-empty-title { font-size: 16px; font-weight: 700; color: var(--d); margin: 0; }
  .ps-empty-sub   { font-size: 13px; color: #999; margin: 0; }

  .ps-pag-wrap { display: flex; justify-content: center; margin-top: 36px; }
  .ps-pag {
    display: flex;
    align-items: center;
    gap: 3px;
    list-style: none;
    padding: 0;
    margin: 0;
    flex-wrap: wrap;
    justify-content: center;
  }
  .pg-a {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 34px;
    height: 34px;
    padding: 0 8px;
    border: var(--bd);
    border-radius: 4px;
    font-size: 12.5px;
    font-weight: 500;
    color: #555;
    background: #fff;
    cursor: pointer;
    text-decoration: none;
    transition: border-color .15s, color .15s, background .15s;
    font-family: 'DM Sans', sans-serif;
  }
  .pg-a:hover { border-color: var(--r); color: var(--r); }
  .ps-pag .selected .pg-a { background: var(--r); color: #fff; border-color: var(--r); }
  .ps-pag .disabled .pg-a { opacity: .4; pointer-events: none; }

  .skeleton { pointer-events: none; }
  .sk-block, .sk-line {
    background: linear-gradient(90deg, #ebeae8 25%, #f5f5f3 50%, #ebeae8 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 4px;
  }
  .sk-block { border-radius: 0; }
`;

export default ProductSearch;