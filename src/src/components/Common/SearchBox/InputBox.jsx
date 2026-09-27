import React, {
  useState, useRef, useEffect, useCallback, useLayoutEffect,
} from "react";
import {
  IoSearchOutline, IoLocationOutline, IoTimeOutline,
  IoBusinessOutline, IoCloseCircle, IoHomeOutline,
  IoMapOutline, IoChevronDownOutline, IoCloseOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../utils/apiClient";

const RECENT_KEY = "sheetal_recent_searches";
const MAX_RECENT = 5;
const API_BASE   = process.env.REACT_APP_API_LINK || "";
const PRICE_MIN  = 500;
const PRICE_MAX  = 5_00_00_000;

// ── helpers ──────────────────────────────────────────────────────────────────
const isPropertyCode = (q) => /^#?SP-?\d+$/i.test(q) || /^\d+$/.test(q);

function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; }
  catch { return []; }
}
function saveRecent(term) {
  const prev = getRecent().filter((r) => r !== term);
  localStorage.setItem(RECENT_KEY, JSON.stringify([term, ...prev].slice(0, MAX_RECENT)));
}
function highlight(text, query) {
  if (!query || !text) return text ?? "";
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${escaped})`, "gi"), "<mark>$1</mark>");
}
function fmtPrice(v) {
  if (v >= 1_00_00_000) return `Rs.${(v / 1_00_00_000).toFixed(1)}Cr`;
  if (v >= 1_00_000)   return `Rs.${(v / 1_00_000).toFixed(1)}L`;
  if (v >= 1_000)      return `Rs.${(v / 1_000).toFixed(0)}K`;
  return `Rs.${v}`;
}
function resolvePropertyId(q) {
  const m = q.match(/^#?SP-?(\d+)$/i);
  return m ? m[1] : q;
}

const TypeIcon = ({ type }) => {
  const cls = "w-3.5 h-3.5 text-gray-500";
  if (type === "city")     return <IoBusinessOutline className={cls} />;
  if (type === "locality") return <IoLocationOutline className={cls} />;
  if (type === "district") return <IoMapOutline className={cls} />;
  return <IoHomeOutline className={cls} />;
};

/* ─── FixedPopover — zero-lag, closes on page scroll ─────────────────────── */
const FixedPopover = ({ anchorRef, open, onClose, children, width = 200 }) => {
  const popRef = useRef(null);
  const rafRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, ready: false });

  // useLayoutEffect so position is computed before first paint → no flicker
  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;

    const place = () => {
      const r   = anchorRef.current?.getBoundingClientRect();
      if (!r) return;
      const left = Math.min(r.left, window.innerWidth - width - 8);
      setPos({ top: r.bottom + 6, left, ready: true });
    };

    place(); // immediate, synchronous

    // Horizontal scroll on the pill bar → reposition via rAF (smooth, no jank)
    const onPillScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(place);
    };

    // Vertical page scroll → just close (cleanest UX, zero lag)
    const onPageScroll = (e) => {
      // Only close when the scrolled element is NOT the pill bar itself
      const pillBar = anchorRef.current?.closest("[data-pill-bar]");
      if (pillBar && pillBar.contains(e.target)) return;
      onClose();
    };

    const pillBar = anchorRef.current?.closest("[data-pill-bar]");
    pillBar?.addEventListener("scroll", onPillScroll);
    window.addEventListener("scroll", onPageScroll, true);
    window.addEventListener("resize", place);

    return () => {
      cancelAnimationFrame(rafRef.current);
      pillBar?.removeEventListener("scroll", onPillScroll);
      window.removeEventListener("scroll", onPageScroll, true);
      window.removeEventListener("resize", place);
    };
  }, [open, anchorRef, width, onClose]);

  // Outside-click closes popover
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        popRef.current && !popRef.current.contains(e.target) &&
        anchorRef.current && !anchorRef.current.contains(e.target)
      ) onClose();
    };
    // Slight delay so the toggle-click itself doesn't immediately close
    const id = setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => { clearTimeout(id); document.removeEventListener("mousedown", handler); };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={popRef}
      style={{
        position: "fixed",
        top:      pos.top,
        left:     pos.left,
        width,
        zIndex:   99999,
        // Hide until first layout pass to avoid position flash
        visibility: pos.ready ? "visible" : "hidden",
      }}
      className="bg-white border border-gray-200 shadow-xl rounded-sm"
    >
      {children}
    </div>
  );
};

/* ─── InputBox ────────────────────────────────────────────────────────────── */
const InputBox = ({
  setFilterModal,
  showFilters     = true,
  activeTab,
  navigateOnFilter = false,
}) => {
  const qs = () => { try { return new URLSearchParams(window.location.search); } catch { return new URLSearchParams(); } };

  const [search,      setSearch]      = useState(() => qs().get("keyword") || "");
  const [open,        setOpen]        = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [data,        setData]        = useState(null);
  const [recent,      setRecent]      = useState([]);
  const [activeIdx,   setActiveIdx]   = useState(-1);
  const [attributes,  setAttributes]  = useState(null);
  const [attrLoading, setAttrLoading] = useState(false);
  const [activeFilter,setActiveFilter]= useState(null);

  // ── filter state ─────────────────────────────────────────────────────────
  const [purpose,    setPurpose]    = useState(() => qs().get("advertisement_purpose") || activeTab?.advertisement_purpose || "all");
  const [propType,   setPropType]   = useState(() => qs().get("property_type")         || activeTab?.property_type         || "all");
  const [category,   setCategory]   = useState(() => qs().get("category")              || "all");
  const [price,      setPrice]      = useState(() => [Number(qs().get("min_price")) || PRICE_MIN, Number(qs().get("max_price")) || PRICE_MAX]);
  const [dateFrom,   setDateFrom]   = useState(() => qs().get("date_from") || "");
  const [dateTo,     setDateTo]     = useState(() => qs().get("date_to")   || "");
  const [propStatus, setPropStatus] = useState(() => qs().get("property_status") || "all");
  const [sortOrder,  setSortOrder]  = useState(() => {
    const o = qs().get("price_order") || "";
    if (o === "low_to_high") return "low";
    if (o === "high_to_low") return "high";
    if (o === "oldest")      return "oldest";
    return "newest";
  });

  // ── refs ──────────────────────────────────────────────────────────────────
  const purposeBtnRef  = useRef(null);
  const typeBtnRef     = useRef(null);
  const categoryBtnRef = useRef(null);
  const priceBtnRef    = useRef(null);
  const propStatusRef  = useRef(null);
  const sortBtnRef     = useRef(null);
  const dateBtnRef     = useRef(null);
  const inputRef       = useRef(null);
  const dropRef        = useRef(null);
  const wrapRef        = useRef(null);
  const abortRef       = useRef(null);
  const navigate       = useNavigate();

  const closeFilter = useCallback(() => setActiveFilter(null), []);

  // ── sync tab ──────────────────────────────────────────────────────────────
  useEffect(() => {
    setPurpose(activeTab?.advertisement_purpose || "all");
    if (activeTab?.property_type) setPropType(activeTab.property_type);
  }, [activeTab]);

  useEffect(() => { setRecent(getRecent()); }, []);

  useEffect(() => {
    if (attributes) return;
    setAttrLoading(true);
    apiClient.get("/property-attributes")
      .then((res) => { if (res.status === 200) setAttributes(res.data.data); })
      .catch(() => {})
      .finally(() => setAttrLoading(false));
  }, [attributes]);

  // ── outside-click closes search dropdown ─────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if (!wrapRef.current?.contains(e.target)) {
        setOpen(false);
        setActiveFilter(null);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── suggestion fetch ──────────────────────────────────────────────────────
  const fetchSuggestions = useCallback(async (q) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/search/suggestions?q=${encodeURIComponent(q)}`, { signal: abortRef.current.signal });
      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err.name !== "AbortError") setData(null);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchSuggestions(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search, fetchSuggestions]);

  // ── buildParams ───────────────────────────────────────────────────────────
  const buildParams = useCallback((keyword, overrides = {}) => {
    const p          = new URLSearchParams();
    const rPurpose   = overrides.purpose    ?? purpose;
    const rPropType  = overrides.propType   ?? propType;
    const rCategory  = overrides.category   ?? category;
    const rDateFrom  = overrides.dateFrom   ?? dateFrom;
    const rDateTo    = overrides.dateTo     ?? dateTo;
    const rStatus    = overrides.propStatus ?? propStatus;
    const rSort      = overrides.sortOrder  ?? sortOrder;

    if (keyword)          p.set("keyword",                keyword);
    if (rPurpose  !== "all") p.set("advertisement_purpose", rPurpose);
    if (rPropType !== "all") p.set("property_type",         rPropType);
    if (rCategory !== "all") p.set("category",              rCategory);
    if (price[0]  !== PRICE_MIN) p.set("min_price", price[0]);
    if (price[1]  !== PRICE_MAX) p.set("max_price", price[1]);
    if (rDateFrom) p.set("date_from", rDateFrom);
    if (rDateTo)   p.set("date_to",   rDateTo);
    if (rStatus !== "all")  p.set("property_status", rStatus);
    if (rSort === "oldest") p.set("price_order", "oldest");
    if (rSort === "low")    p.set("price_order", "low_to_high");
    if (rSort === "high")   p.set("price_order", "high_to_low");

    return p.toString();
  }, [purpose, propType, category, price, dateFrom, dateTo, propStatus, sortOrder]);

  const handleSelect = useCallback((name) => {
    setSearch(name); setOpen(false);
    saveRecent(name); setRecent(getRecent());
    navigate(`/productSearch?${buildParams(name)}`);
  }, [navigate, buildParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    if (isPropertyCode(q)) { navigate(`/property/${resolvePropertyId(q)}`); setOpen(false); return; }
    saveRecent(q); setRecent(getRecent());
    navigate(`/productSearch?${buildParams(q)}`);
    setOpen(false);
  };

  const resetFilters = () => {
    const cp = activeTab?.advertisement_purpose || "all";
    setPurpose(cp); setPropType("all"); setCategory("all");
    setPrice([PRICE_MIN, PRICE_MAX]);
    setDateFrom(""); setDateTo("");
    setPropStatus("all"); setSortOrder("newest");
    const p = new URLSearchParams();
    if (search.trim()) p.set("keyword", search.trim());
    if (cp !== "all")  p.set("advertisement_purpose", cp);
    navigate(`/productSearch?${p.toString()}`);
  };

  // ── derived ───────────────────────────────────────────────────────────────
  const allItems   = data ? [...(data.districts||[]),...(data.cities||[]),...(data.localities||[]),...(data.properties||[])] : [];
  const hasResults = data && (data.districts?.length||data.cities?.length||data.localities?.length||data.properties?.length);

  const purposeLabel    = { all:"Listing Types", Sale:"For Sale", Rent:"For Rent", Invest:"For Invest" }[purpose] || purpose;
  const typeLabel       = propType  !== "all" ? propType  : "Property type";
  const categoryLabel   = category  !== "all" ? category  : "Category";
  const priceActive     = price[0]  !== PRICE_MIN || price[1] !== PRICE_MAX;
  const priceLabel      = priceActive ? `${fmtPrice(price[0])} – ${fmtPrice(price[1])}` : "Price";
  const dateActive      = !!dateFrom || !!dateTo;
  const dateLabel       = dateActive ? (dateFrom && dateTo ? `${dateFrom} – ${dateTo}` : dateFrom || dateTo) : "Listed";
  const propStatusLabel = propStatus === "all" ? "Status" : propStatus === "PENDING" ? "Available" : propStatus === "SOLD OUT" ? "Sold Out" : "Rented Out";
  const sortLabel       = { newest:"Newest", oldest:"Oldest", low:"Price ↑", high:"Price ↓" }[sortOrder];
  const anyActive       = purpose !== "all" || propType !== "all" || category !== "all"
                        || priceActive || dateActive || propStatus !== "all" || sortOrder !== "newest";

  const pillCls = (id, isActive) => [
    "flex items-center gap-1.5 px-3 py-1.5 border text-xs font-medium cursor-pointer",
    "whitespace-nowrap flex-shrink-0 transition-all duration-100 rounded-sm",
    activeFilter === id
      ? "bg-gray-900 border-gray-900 text-white"
      : isActive
        ? "bg-red-50 border-red-500 text-red-700"
        : "bg-white border-gray-300 text-gray-700 hover:border-gray-500",
  ].join(" ");

  const handleKeyDown = (e) => {
    if (!open) return;
    if      (e.key === "ArrowDown" ) { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, allItems.length - 1)); }
    else if (e.key === "ArrowUp"   ) { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); handleSelect(allItems[activeIdx].name); }
    else if (e.key === "Escape")       setOpen(false);
  };

  const clearInput     = () => { setSearch(""); setActiveIdx(-1); setData(null); inputRef.current?.focus(); };
  const removeRecent   = (term, e) => { e.stopPropagation(); const u = getRecent().filter((r) => r !== term); localStorage.setItem(RECENT_KEY, JSON.stringify(u)); setRecent(u); };
  const toggleFilter   = (id) => { setOpen(false); setActiveFilter((v) => v === id ? null : id); };
  const goFilter       = (overrides) => { setActiveFilter(null); if (navigateOnFilter) navigate(`/productSearch?${buildParams(search.trim(), overrides)}`); };

  // ── sub-components ────────────────────────────────────────────────────────
  const SectionLabel = ({ label }) => <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>;
  const HRule        = ()           => <div className="h-px bg-gray-100 mx-3 my-1" />;

  const ResultItem = ({ item, idx }) => (
    <button onClick={() => handleSelect(item.name)}
      className={`flex items-center gap-3 w-full px-4 py-2.5 transition-colors text-left ${activeIdx === idx ? "bg-red-50" : "hover:bg-gray-50"}`}>
      <span className="w-7 h-7 rounded-sm bg-gray-100 flex items-center justify-center flex-shrink-0">
        <TypeIcon type={item.type} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-800 truncate"
          dangerouslySetInnerHTML={{ __html: highlight(item.name, search.trim()) }} />
        {item.locality && <p className="text-xs text-gray-400 truncate">{item.locality}</p>}
      </div>
    </button>
  );

  const Chip = ({ active, onClick, children }) => (
    <button type="button" onClick={onClick}
      className={`px-2.5 py-1.5 border text-xs font-medium rounded-sm transition-all ${
        active ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
      }`}>
      {children}
    </button>
  );

  const PopHead = ({ children }) => <p className="px-3.5 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">{children}</p>;

  const PopFooter = ({ onReset, overrides = {} }) => (
    <div className="flex justify-between items-center px-3.5 py-2.5 border-t border-gray-100">
      <button type="button" onClick={onReset} className="text-xs font-semibold text-gray-400 hover:text-gray-700 underline">Reset</button>
      {navigateOnFilter && (
        <button type="button" onClick={() => goFilter(overrides)}
          className="text-xs font-semibold bg-gray-900 text-white px-3.5 py-1.5 rounded-sm hover:bg-gray-700">
          Apply
        </button>
      )}
    </div>
  );

  /* ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="relative" ref={wrapRef}>

      {/* ── Search bar ── */}
      <form onSubmit={handleSubmit}
        className="border-2 flex items-center bg-white hover:border-red-900 focus-within:ring-2 focus-within:ring-red-300 px-1 transition-all overflow-visible">
        <IoSearchOutline className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={search}
          placeholder="Enter an address, neighbourhood, city, ZIP code or property ID"
          className="w-full h-full p-4 px-3 text-sm border-none outline-none bg-transparent text-ellipsis"
          onChange={(e) => { setSearch(e.target.value); setActiveIdx(-1); setOpen(true); }}
          onFocus={() => { setOpen(true); setActiveFilter(null); }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {search && (
          <button type="button" onClick={clearInput}
            className="p-1 mr-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
            <IoCloseCircle className="w-4 h-4" />
          </button>
        )}
        <button type="submit" disabled={!search.trim()}
          className="p-2 sm:p-3 border md:border-none border-red-800 h-full font-medium text-sm flex items-center bg-red-700 text-white rounded-sm flex-shrink-0 hover:bg-red-800 transition-colors disabled:bg-gray-900 disabled:cursor-not-allowed">
          <IoSearchOutline className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Search</span>
        </button>
      </form>

      {/* ── Suggestions dropdown ── */}
      {open && (
        <div ref={dropRef}
          className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-sm shadow-2xl z-[9999] overflow-hidden"
          style={{ maxHeight: "440px", overflowY: "auto" }}>

          {loading && (
            <div className="px-4 py-3 flex items-center gap-2 text-sm text-gray-400">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.2" />
                <path d="M21 12a9 9 0 00-9-9" />
              </svg>
              Searching…
            </div>
          )}

          {!loading && !search.trim() && (
            <>
              {recent.length > 0 && (
                <>
                  <SectionLabel label="Recent Searches" />
                  <div className="px-3 pb-2 flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button key={r} onClick={() => handleSelect(r)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-600 text-xs font-medium transition-colors">
                        <IoTimeOutline className="w-3.5 h-3.5" />{r}
                        <span role="button" onClick={(e) => removeRecent(r, e)} className="ml-0.5 text-gray-400 hover:text-red-500 font-bold">×</span>
                      </button>
                    ))}
                  </div>
                  <HRule />
                </>
              )}
              {data?.cities?.length > 0 && (
                <><SectionLabel label="Popular Cities" />{data.cities.map((item, i) => <ResultItem key={item.name} item={item} idx={i} />)}</>
              )}
              {data?.localities?.length > 0 && (
                <><HRule /><SectionLabel label="Popular Localities" />{data.localities.map((item, i) => <ResultItem key={item.name} item={item} idx={(data.cities?.length || 0) + i} />)}</>
              )}
              {!data && <div className="px-4 py-4 text-sm text-gray-400 text-center">Start typing to search properties…</div>}
            </>
          )}

          {search.trim() && isPropertyCode(search.trim()) && (
            <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
              <span className="w-7 h-7 rounded-sm bg-red-50 flex items-center justify-center flex-shrink-0">
                <IoHomeOutline className="w-3.5 h-3.5 text-red-600" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">
                  Search property {/^\d+$/.test(search.trim()) ? `#SP-${search.trim()}` : search.trim().toUpperCase()}
                </p>
                <p className="text-xs text-gray-400">Go directly to this property ID</p>
              </div>
              <button onClick={() => { navigate(`/property/${resolvePropertyId(search.trim())}`); setOpen(false); }}
                className="text-xs font-semibold bg-red-700 text-white px-3 py-1.5 rounded-sm hover:bg-red-800 flex-shrink-0">
                Go
              </button>
            </div>
          )}

          {!loading && search.trim() && hasResults && (
            <>
              {data.districts?.length > 0 && (
                <><SectionLabel label="Districts" />{data.districts.map((item, i) => <ResultItem key={item.name} item={item} idx={i} />)}</>
              )}
              {data.cities?.length > 0 && (
                <>{data.districts?.length > 0 && <HRule />}<SectionLabel label="Cities / Towns" />{data.cities.map((item, i) => <ResultItem key={item.name} item={item} idx={(data.districts?.length||0)+i} />)}</>
              )}
              {data.localities?.length > 0 && (
                <>{(data.districts?.length||data.cities?.length) > 0 && <HRule />}<SectionLabel label="Localities / Tols" />{data.localities.map((item, i) => <ResultItem key={item.name} item={item} idx={(data.districts?.length||0)+(data.cities?.length||0)+i} />)}</>
              )}
              {data.properties?.length > 0 && (
                <><HRule /><SectionLabel label="Properties" />{data.properties.map((item, i) => <ResultItem key={item.name+i} item={item} idx={(data.districts?.length||0)+(data.cities?.length||0)+(data.localities?.length||0)+i} />)}</>
              )}
              <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/60">
                <p className="text-[10px] text-gray-400 font-medium">
                  <kbd className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-sm text-[9px] font-mono">↑↓</kbd> navigate &nbsp;·&nbsp;
                  <kbd className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-sm text-[9px] font-mono">Enter</kbd> select &nbsp;·&nbsp;
                  <kbd className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-sm text-[9px] font-mono">Esc</kbd> close
                </p>
              </div>
            </>
          )}

          {!loading && search.trim() && !hasResults && data?.didYouMean && (
            <div className="px-4 py-5 flex items-start gap-3">
              <IoSearchOutline className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">No results for <span className="font-semibold text-gray-800">"{search.trim()}"</span></p>
                <p className="text-sm text-gray-500 mt-1">Did you mean:{" "}
                  <button onClick={() => handleSelect(data.didYouMean)} className="text-red-600 font-semibold hover:underline">{data.didYouMean}</button>?
                </p>
              </div>
            </div>
          )}

          {!loading && search.trim() && !hasResults && !data?.didYouMean && data && !isPropertyCode(search.trim()) && (
            <div className="px-4 py-8 text-center">
              <IoSearchOutline className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No results for <span className="font-semibold text-gray-800">"{search.trim()}"</span></p>
              <p className="text-xs text-gray-400 mt-1">Try a different city, locality or landmark</p>
            </div>
          )}
        </div>
      )}

      {/* ── Filter pill bar ── */}
      {showFilters && (
        <div className="relative mt-2">
          {/* data-pill-bar lets FixedPopover detect horizontal vs vertical scroll */}
          <div data-pill-bar
            className="flex items-center gap-2 bg-white no-scrollbar pb-0.5"
            style={{ overflowX: "auto", overflowY: "visible" }}>

            {/* Status */}
            <div className="relative flex-shrink-0">
              <button ref={propStatusRef} type="button" onClick={() => toggleFilter("propstatus")} className={pillCls("propstatus", propStatus !== "all")}>
                {propStatusLabel}
                <IoChevronDownOutline className={`w-3 h-3 transition-transform duration-150 ${activeFilter === "propstatus" ? "rotate-180" : ""}`} />
              </button>
              <FixedPopover anchorRef={propStatusRef} open={activeFilter === "propstatus"} onClose={closeFilter} width={208}>
                <PopHead>Availability</PopHead>
                <div className="flex flex-wrap gap-2 px-3.5 pb-3 pt-1">
                  {[{label:"All",val:"all"},{label:"Available",val:"PENDING"},{label:"Sold Out",val:"SOLD OUT"},{label:"Rented Out",val:"RENTED OUT"}].map(({label,val}) => (
                    <Chip key={val} active={propStatus===val} onClick={() => { setPropStatus(val); goFilter({propStatus:val}); }}>{label}</Chip>
                  ))}
                </div>
                <PopFooter onReset={() => { setPropStatus("all"); closeFilter(); }} />
              </FixedPopover>
            </div>

            {/* Purpose */}
            <div className="relative flex-shrink-0">
              <button ref={purposeBtnRef} type="button" onClick={() => toggleFilter("purpose")} className={pillCls("purpose", purpose !== "all")}>
                {purposeLabel}
                <IoChevronDownOutline className={`w-3 h-3 transition-transform duration-150 ${activeFilter === "purpose" ? "rotate-180" : ""}`} />
              </button>
              <FixedPopover anchorRef={purposeBtnRef} open={activeFilter === "purpose"} onClose={closeFilter} width={208}>
                <PopHead>Listing type</PopHead>
                <div className="flex flex-wrap gap-2 px-3.5 pb-3 pt-1">
                  {[{label:"All",val:"all"},{label:"For Sale",val:"Sale"},{label:"For Rent",val:"Rent"},{label:"For Invest",val:"Invest"}].map(({label,val}) => (
                    <Chip key={val} active={purpose===val} onClick={() => { setPurpose(val); goFilter({purpose:val}); }}>{label}</Chip>
                  ))}
                </div>
                <PopFooter onReset={() => { setPurpose(activeTab?.advertisement_purpose||"all"); closeFilter(); }} />
              </FixedPopover>
            </div>

            {/* Property type */}
            <div className="relative flex-shrink-0">
              <button ref={typeBtnRef} type="button" onClick={() => toggleFilter("type")} className={pillCls("type", propType !== "all")}>
                {typeLabel}
                <IoChevronDownOutline className={`w-3 h-3 transition-transform duration-150 ${activeFilter === "type" ? "rotate-180" : ""}`} />
              </button>
              <FixedPopover anchorRef={typeBtnRef} open={activeFilter === "type"} onClose={closeFilter} width={224}>
                <PopHead>Property type</PopHead>
                {attrLoading
                  ? <div className="px-3.5 py-4 text-sm text-gray-400">Loading…</div>
                  : (
                    <div className="flex flex-wrap gap-2 px-3.5 pb-3 pt-1">
                      <Chip active={propType==="all"} onClick={() => { setPropType("all"); goFilter({propType:"all"}); }}>All types</Chip>
                      {attributes?.property_types?.map((pt, i) => (
                        <Chip key={i} active={propType===pt.name} onClick={() => { setPropType(pt.name); goFilter({propType:pt.name}); }}>{pt.name}</Chip>
                      ))}
                    </div>
                  )}
                <PopFooter onReset={() => { setPropType("all"); closeFilter(); }} />
              </FixedPopover>
            </div>

            {/* Category */}
            <div className="relative flex-shrink-0">
              <button ref={categoryBtnRef} type="button" onClick={() => toggleFilter("category")} className={pillCls("category", category !== "all")}>
                {categoryLabel}
                <IoChevronDownOutline className={`w-3 h-3 transition-transform duration-150 ${activeFilter === "category" ? "rotate-180" : ""}`} />
              </button>
              <FixedPopover anchorRef={categoryBtnRef} open={activeFilter === "category"} onClose={closeFilter} width={200}>
                <PopHead>Category</PopHead>
                <div className="flex flex-wrap gap-2 px-3.5 pb-3 pt-1">
                  <Chip active={category==="all"} onClick={() => { setCategory("all"); goFilter({category:"all"}); }}>All</Chip>
                  {attributes?.categories?.map((c, i) => (
                    <Chip key={i} active={category===c.name} onClick={() => { setCategory(c.name); goFilter({category:c.name}); }}>{c.name}</Chip>
                  ))}
                </div>
                <PopFooter onReset={() => { setCategory("all"); closeFilter(); }} />
              </FixedPopover>
            </div>

            {/* Price */}
            <div className="relative flex-shrink-0">
              <button ref={priceBtnRef} type="button" onClick={() => toggleFilter("price")} className={pillCls("price", priceActive)}>
                {priceLabel}
                <IoChevronDownOutline className={`w-3 h-3 transition-transform duration-150 ${activeFilter === "price" ? "rotate-180" : ""}`} />
              </button>
              <FixedPopover anchorRef={priceBtnRef} open={activeFilter === "price"} onClose={closeFilter} width={288}>
                <PopHead>Price range</PopHead>
                <div className="px-3.5 pb-2">
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>Rs.5K</span>
                    <span className="font-semibold text-gray-800 text-xs">{fmtPrice(price[0])} – {fmtPrice(price[1])}</span>
                    <span>Rs.5Cr</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <div className="flex-1">
                      <label className="block text-[10px] text-gray-400 mb-1 uppercase tracking-wide font-semibold">Min</label>
                      <input type="number" value={price[0]} onChange={(e) => setPrice([Number(e.target.value), price[1]])}
                        className="border border-gray-200 focus:border-gray-900 outline-none py-1.5 px-2 w-full text-xs rounded-sm" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] text-gray-400 mb-1 uppercase tracking-wide font-semibold">Max</label>
                      <input type="number" value={price[1]} onChange={(e) => setPrice([price[0], Number(e.target.value)])}
                        className="border border-gray-200 focus:border-gray-900 outline-none py-1.5 px-2 w-full text-xs rounded-sm" />
                    </div>
                  </div>
                </div>
                <PopFooter onReset={() => setPrice([PRICE_MIN, PRICE_MAX])} />
              </FixedPopover>
            </div>

            {/* Sort */}
            <div className="relative flex-shrink-0">
              <button ref={sortBtnRef} type="button" onClick={() => toggleFilter("sort")} className={pillCls("sort", sortOrder !== "newest")}>
                {sortLabel}
                <IoChevronDownOutline className={`w-3 h-3 transition-transform duration-150 ${activeFilter === "sort" ? "rotate-180" : ""}`} />
              </button>
              <FixedPopover anchorRef={sortBtnRef} open={activeFilter === "sort"} onClose={closeFilter} width={208}>
                <PopHead>Sort by</PopHead>
                <div className="flex flex-wrap gap-2 px-3.5 pb-3 pt-1">
                  {[{label:"Newest First",val:"newest"},{label:"Oldest First",val:"oldest"},{label:"Price: Low to High",val:"low"},{label:"Price: High to Low",val:"high"}].map(({label,val}) => (
                    <Chip key={val} active={sortOrder===val} onClick={() => { setSortOrder(val); goFilter({sortOrder:val}); }}>{label}</Chip>
                  ))}
                </div>
                <PopFooter onReset={() => { setSortOrder("newest"); closeFilter(); }} />
              </FixedPopover>
            </div>

            {/* Date listed */}
            <div className="relative flex-shrink-0">
              <button ref={dateBtnRef} type="button" onClick={() => toggleFilter("date")} className={pillCls("date", dateActive)}>
                {dateLabel}
                <IoChevronDownOutline className={`w-3 h-3 transition-transform duration-150 ${activeFilter === "date" ? "rotate-180" : ""}`} />
              </button>
              <FixedPopover anchorRef={dateBtnRef} open={activeFilter === "date"} onClose={closeFilter} width={240}>
                <PopHead>Date listed</PopHead>
                <div className="flex flex-wrap gap-1.5 px-3.5 pb-3 pt-1">
                  {[{label:"Today",days:0},{label:"Last 7 days",days:7},{label:"Last 30 days",days:30},{label:"Last 3 months",days:90}].map(({label,days}) => {
                    const from = new Date(); from.setDate(from.getDate() - days);
                    const fs = from.toISOString().split("T")[0];
                    const ts = new Date().toISOString().split("T")[0];
                    return (
                      <Chip key={label} active={dateFrom===fs && dateTo===ts}
                        onClick={() => { setDateFrom(fs); setDateTo(ts); goFilter({dateFrom:fs, dateTo:ts}); }}>
                        {label}
                      </Chip>
                    );
                  })}
                </div>
                <div className="px-3.5 pb-3 flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-400 mb-1 uppercase tracking-wide font-semibold">From</label>
                    <input type="date" value={dateFrom} max={dateTo||undefined} onChange={(e) => setDateFrom(e.target.value)}
                      className="border border-gray-200 focus:border-gray-900 outline-none py-1.5 px-2 w-full text-xs rounded-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-400 mb-1 uppercase tracking-wide font-semibold">To</label>
                    <input type="date" value={dateTo} min={dateFrom||undefined} onChange={(e) => setDateTo(e.target.value)}
                      className="border border-gray-200 focus:border-gray-900 outline-none py-1.5 px-2 w-full text-xs rounded-sm" />
                  </div>
                </div>
                <PopFooter onReset={() => { setDateFrom(""); setDateTo(""); }} overrides={{ dateFrom, dateTo }} />
              </FixedPopover>
            </div>

            {/* Clear all */}
            {anyActive && (
              <button type="button" onClick={resetFilters}
                className="flex items-center gap-1 px-3 py-1.5 rounded-sm border border-dashed bg-white border-gray-300 text-xs font-medium text-gray-600 hover:border-red-400 hover:text-red-600 transition-all whitespace-nowrap flex-shrink-0">
                <IoCloseOutline className="w-3.5 h-3.5" /> Clear all
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        mark { background: transparent; color: #b91c1c; font-weight: 700; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default InputBox;