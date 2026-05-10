import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineHomeModern,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowsUpDown,
  HiSquares2X2,
  HiBars3,
} from "react-icons/hi2";
import FilterCard from "../components/card/FilterCard";
import FilterModal from "../components/ProductFilter/FilterModal";
import apiClient from "../utils/apiClient";
import ReactPaginate from "react-paginate";

/* ─── Google Fonts ───────────────────────────────────────────── */
const FontInjector = () => {
  useEffect(() => {
    const id = "ps-gfonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id   = id;
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap";
    link.rel  = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
};

/* ─── Global styles ──────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    :root {
      --ps-crimson:  #b91c1c;
      --ps-navy:     #0d1b2e;
      --ps-navy-l:   #162340;
      --ps-gold:     #c9a84c;
      --ps-ivory:    #faf8f5;
      --ps-warm:     #f4f1ec;
      --ps-border:   rgba(0,0,0,0.08);
      --ff-display:  'Cormorant Garamond', Georgia, serif;
      --ff-body:     'DM Sans', system-ui, sans-serif;
    }
    .ps-root { font-family:var(--ff-body); background:var(--ps-ivory); min-height:100vh; }

    /* Hero */
    .ps-hero {
      background: linear-gradient(160deg, var(--ps-navy) 0%, var(--ps-navy-l) 55%, #1e2d42 100%);
      padding-top: calc(var(--navbar-h, 64px) + 2.5rem);
      padding-bottom: 3rem;
      position: relative; overflow: hidden;
    }
    .ps-hero::before {
      content:''; position:absolute; inset:0; pointer-events:none;
      background: radial-gradient(ellipse 70% 55% at 75% 45%, rgba(185,28,28,0.13) 0%, transparent 68%);
    }
    .ps-hero::after {
      content:''; position:absolute; bottom:0; left:0; right:0; height:1px;
      background: linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.45) 50%, transparent 100%);
    }
    .ps-hero-inner { position:relative; z-index:1; max-width:1280px; margin:0 auto; padding:0 1.5rem; }
    .ps-eyebrow {
      display:inline-flex; align-items:center; gap:6px;
      font-size:9px; font-weight:600; letter-spacing:.22em; text-transform:uppercase;
      color:var(--ps-gold); background:rgba(201,168,76,0.1);
      border:1px solid rgba(201,168,76,0.28); border-radius:100px; padding:4px 12px; margin-bottom:12px;
    }
    .ps-hero-title {
      font-family:var(--ff-display); font-size:clamp(1.9rem,5vw,3rem);
      font-weight:600; color:#fff; line-height:1.1; letter-spacing:-.01em; margin:0 0 8px;
    }
    .ps-hero-title em { font-style:italic; color:rgba(255,255,255,0.6); }
    .ps-hero-count { font-size:12px; color:rgba(255,255,255,0.4); }
    .ps-hero-count b { color:rgba(255,255,255,0.65); font-weight:500; }

    /* Controls bar */
    .ps-bar {
      position:sticky; top:0; z-index:40;
      background:rgba(250,248,245,0.9);
      backdrop-filter:blur(18px) saturate(180%);
      -webkit-backdrop-filter:blur(18px) saturate(180%);
      border-bottom:1px solid var(--ps-border);
    }
    .ps-bar-inner {
      max-width:1280px; margin:0 auto; padding:0 1.5rem;
      display:flex; align-items:center; gap:10px; height:54px;
    }
    .ps-pills { display:flex; gap:5px; flex:1; overflow-x:auto; }
    .ps-pills::-webkit-scrollbar { display:none; }
    .ps-pill {
      flex-shrink:0; display:flex; align-items:center; gap:5px;
      font-family:var(--ff-body); font-size:11.5px; font-weight:500;
      padding:5px 13px; border-radius:100px; border:1px solid #e2e8f0;
      cursor:pointer; transition:all .18s; white-space:nowrap;
      color:#64748b; background:transparent;
    }
    .ps-pill:hover { border-color:#94a3b8; color:#334155; }
    .ps-pill.ps-pill--on {
      background:var(--ps-navy); color:#fff; border-color:var(--ps-navy);
      box-shadow:0 2px 10px rgba(13,27,46,0.22);
    }
    .ps-sep { width:1px; height:22px; background:var(--ps-border); flex-shrink:0; }

    /* View toggle */
    .ps-view-toggle {
      display:flex; gap:2px;
      background:#ede9e3; border-radius:10px; padding:3px; flex-shrink:0;
    }
    .ps-vbtn {
      width:30px; height:30px; border-radius:7px; border:none;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; transition:all .18s; color:#94a3b8; background:transparent;
    }
    .ps-vbtn:hover { color:#475569; }
    .ps-vbtn.ps-vbtn--on { background:#fff; color:var(--ps-navy); box-shadow:0 1px 6px rgba(0,0,0,0.1); }

    .ps-filter-btn {
      display:flex; align-items:center; gap:6px;
      font-family:var(--ff-body); font-size:11.5px; font-weight:600;
      padding:7px 15px; border-radius:100px; border:1px solid var(--ps-border);
      background:#fff; color:#374151; cursor:pointer; transition:all .18s; flex-shrink:0;
    }
    .ps-filter-btn:hover { border-color:#94a3b8; box-shadow:0 2px 10px rgba(0,0,0,0.07); }

    /* Body */
    .ps-body { max-width:1280px; margin:0 auto; padding:2rem 1.5rem 5rem; }

    /* Meta row */
    .ps-meta { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; }
    .ps-meta-txt { font-size:12px; color:#94a3b8; }
    .ps-meta-txt b { color:#64748b; font-weight:600; }

    /* Layout modes */
    .ps-grid {
      display:grid;
      grid-template-columns:repeat(auto-fill, minmax(min(100%, 290px), 1fr));
      gap:1rem;
    }
    .ps-list { display:flex; flex-direction:column; gap:.875rem; }

    /* Card enter animation */
    @keyframes ps-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
    .ps-card-item { animation:ps-up .35s ease both; }
    .ps-card-item:nth-child(1){animation-delay:.04s}
    .ps-card-item:nth-child(2){animation-delay:.08s}
    .ps-card-item:nth-child(3){animation-delay:.12s}
    .ps-card-item:nth-child(4){animation-delay:.16s}
    .ps-card-item:nth-child(5){animation-delay:.20s}
    .ps-card-item:nth-child(n+6){animation-delay:.24s}

    /* Skeleton shimmer */
    @keyframes ps-sh { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
    .ps-skel { background:#fff; border-radius:18px; border:1px solid var(--ps-border); overflow:hidden; }
    .ps-skel--list { display:flex; }
    .ps-skel--grid { display:flex; flex-direction:column; }
    .ps-sh {
      background:linear-gradient(90deg,#e8e4de 25%,#f0ece6 50%,#e8e4de 75%);
      background-size:600px 100%; animation:ps-sh 1.3s infinite linear;
    }

    /* Empty state */
    .ps-empty { display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6rem 1rem;text-align:center; }
    .ps-empty-ring {
      width:72px;height:72px;border-radius:50%;
      background:rgba(185,28,28,0.06); border:1px solid rgba(185,28,28,0.13);
      display:flex;align-items:center;justify-content:center;
      color:var(--ps-crimson); margin-bottom:1.25rem;
    }
    .ps-empty h3 { font-family:var(--ff-display);font-size:1.7rem;font-weight:600;color:#1e293b;margin:0 0 8px; }
    .ps-empty p  { font-size:13.5px;color:#94a3b8;max-width:340px;line-height:1.65;margin:0; }

    /* Pagination */
    .ps-pages { display:flex;align-items:center;justify-content:center;gap:4px;margin-top:3rem;padding-top:1.75rem;border-top:1px solid var(--ps-border); }
    .ps-pages li { list-style:none; }
    .ps-pages li a {
      display:flex;align-items:center;justify-content:center;
      min-width:36px;height:36px;padding:0 4px;border-radius:9px;
      font-size:12.5px;font-weight:500;color:#475569;
      background:#fff;border:1px solid #e2e8f0;
      cursor:pointer;transition:all .18s;text-decoration:none;
    }
    .ps-pages li a:hover  { background:var(--ps-warm);border-color:#cbd5e1;color:#1e293b; }
    .ps-pages li.selected a { background:var(--ps-navy);color:#fff;border-color:var(--ps-navy);box-shadow:0 2px 10px rgba(13,27,46,0.22); }
    .ps-pages li.disabled a { opacity:.35;cursor:not-allowed;pointer-events:none; }
    .ps-pages li.previous a, .ps-pages li.next a { font-size:10px; }
  `}</style>
);

/* ─── Skeleton card ──────────────────────────────────────────── */
const SkeletonCard = ({ mode }) => {
  if (mode === "grid") return (
    <div className="ps-skel ps-skel--grid">
      <div className="ps-sh" style={{ height: 200 }} />
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="ps-sh" style={{ height: 18, width: "70%", borderRadius: 6 }} />
        <div className="ps-sh" style={{ height: 12, width: "45%", borderRadius: 6 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="ps-sh" style={{ height: 48, borderRadius: 10 }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <div className="ps-sh" style={{ height: 20, width: "40%", borderRadius: 6 }} />
          <div className="ps-sh" style={{ height: 32, width: 100, borderRadius: 100 }} />
        </div>
      </div>
    </div>
  );
  return (
    <div className="ps-skel ps-skel--list">
      <div className="ps-sh" style={{ width: 260, minHeight: 190, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: "1.25rem", display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="ps-sh" style={{ height: 20, width: "60%", borderRadius: 6 }} />
        <div className="ps-sh" style={{ height: 13, width: "38%", borderRadius: 6 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="ps-sh" style={{ height: 54, borderRadius: 10 }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div className="ps-sh" style={{ height: 34, width: 110, borderRadius: 100 }} />
        </div>
      </div>
    </div>
  );
};

/* ─── Empty state ────────────────────────────────────────────── */
const EmptyState = ({ keyword }) => (
  <div className="ps-empty">
    <div className="ps-empty-ring"><HiOutlineHomeModern size={29} /></div>
    <h3>No Properties Found</h3>
    <p>
      {keyword
        ? `We couldn't find any properties matching "${keyword}". Try adjusting your search or filters.`
        : "No properties match your current filters. Try broadening your search criteria."}
    </p>
  </div>
);

/* ─── Sort options config ────────────────────────────────────── */
const SORTS = [
  { key: "all",         label: "Best Match",     Icon: HiOutlineMagnifyingGlass },
  { key: "low_to_high", label: "Price: Low–High", Icon: HiOutlineArrowsUpDown },
  { key: "high_to_low", label: "Price: High–Low", Icon: HiOutlineArrowsUpDown },
];

/* ─── Main component ─────────────────────────────────────────── */
const ProductSearch = () => {
  const [params, setParams]               = useSearchParams(window.location.search);
  const _params                           = Object.fromEntries([...params]);
  const [products, setProduct]            = useState([]);
  const [loading, setLoading]             = useState(false);
  const [pageCount, setPageCount]         = useState(0);
  const [itemOffset, setItemOffset]       = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [viewMode, setViewMode]           = useState("list"); // "list" | "grid"

  const itemsPerPage = 10;
  const keyword      = params.get("keyword") || "";
  const priceOrder   = params.get("price_order") || "all";

  useEffect(() => {
    setPageCount(Math.ceil(totalProducts / itemsPerPage));
  }, [itemOffset, totalProducts]);

  const handlePageClick = (event) => {
    const newOffset = ((event.selected + 1) * itemsPerPage) % totalProducts;
    setItemOffset(newOffset);
    setParams({ ..._params, page: event.selected + 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchSearch = async () => {
    const kw   = params.get("keyword")?.trim() || "";
    const ap   = params.get("advertisement_purpose")?.trim() || "";
    const pt   = params.get("property_type")?.trim() || "";
    const mnp  = params.get("min_price")?.trim() || 0;
    const mxp  = params.get("max_price")?.trim() || 100000000;
    const po   = params.get("price_order")?.trim() || "all";
    const page = params.get("page") || 1;

    setLoading(true);
    try {
      const res = await apiClient.get(
        `/search?keyword=${kw}&advertisement_purpose=${ap}&min_price=${mnp}&max_price=${mxp}&price_order=${po}&property_type=${pt}&page=${page === 0 ? 1 : page}&itemsPerPage=${itemsPerPage}`
      );
      if (res.status === 200) {
        setProduct(res?.data?.data);
        setItemOffset(res?.data?.meta?.current_page);
        setTotalProducts(res?.data?.meta?.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearch();
    // eslint-disable-next-line
  }, [params]);

  return (
    <div className="ps-root">
      <FontInjector />
      <GlobalStyles />

      {/* ── HERO ── */}
      <section className="ps-hero">
        <div className="ps-hero-inner">
          <div className="ps-eyebrow">
            <HiOutlineHomeModern size={10} />
            Search Results
          </div>
          <h1 className="ps-hero-title">
            {keyword ? <>Results for <em>"{keyword}"</em></> : "All Properties"}
          </h1>
          {!loading && (
            <p className="ps-hero-count">
              {totalProducts > 0
                ? <><b>{totalProducts.toLocaleString()}</b> properties found</>
                : "No results"}
            </p>
          )}
        </div>
      </section>

      {/* ── CONTROLS BAR ── */}
      <div className="ps-bar">
        <div className="ps-bar-inner">

          {/* Sort pills */}
          <div className="ps-pills" role="group" aria-label="Sort options">
            {SORTS.map(({ key, label, Icon }) => (
              <button
                key={key}
                className={`ps-pill ${priceOrder === key ? "ps-pill--on" : ""}`}
                onClick={() => setParams({ ..._params, price_order: key })}
                aria-pressed={priceOrder === key}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          <div className="ps-sep" aria-hidden="true" />

          {/* View toggle */}
          <div className="ps-view-toggle" role="group" aria-label="View mode">
            <button
              className={`ps-vbtn ${viewMode === "list" ? "ps-vbtn--on" : ""}`}
              onClick={() => setViewMode("list")}
              title="List view"
              aria-pressed={viewMode === "list"}
            >
              <HiBars3 size={16} />
            </button>
            <button
              className={`ps-vbtn ${viewMode === "grid" ? "ps-vbtn--on" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <HiSquares2X2 size={16} />
            </button>
          </div>

          <div className="ps-sep" aria-hidden="true" />

          {/* Filters */}
          <FilterModal
            trigger={
              <button className="ps-filter-btn">
                <HiOutlineAdjustmentsHorizontal size={14} />
                Filters
              </button>
            }
          />
        </div>
      </div>

      {/* ── BODY ── */}
      <main className="ps-body">

        {/* Meta */}
        {!loading && products?.length > 0 && (
          <div className="ps-meta">
            <p className="ps-meta-txt">
              Showing <b>{products.length}</b> of <b>{totalProducts.toLocaleString()}</b> results
            </p>
          </div>
        )}

        {/* Cards */}
        {loading ? (
          <div className={viewMode === "grid" ? "ps-grid" : "ps-list"}>
            {[...Array(viewMode === "grid" ? 6 : 4)].map((_, i) => (
              <SkeletonCard key={i} mode={viewMode} />
            ))}
          </div>
        ) : products?.length > 0 ? (
          <div className={viewMode === "grid" ? "ps-grid" : "ps-list"}>
            {products.map((property, i) => (
              <div key={property.id ?? i} className="ps-card-item">
                <FilterCard property={property} viewMode={viewMode} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState keyword={keyword} />
        )}

        {/* Pagination */}
        {!loading && pageCount > 1 && (
          <ReactPaginate
            breakLabel="···"
            nextLabel={<FaChevronRight size={10} />}
            previousLabel={<FaChevronLeft size={10} />}
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
            containerClassName="ps-pages"
          />
        )}
      </main>
    </div>
  );
};

export default ProductSearch;