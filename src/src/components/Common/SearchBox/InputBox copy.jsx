import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  IoSearchOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoBusinessOutline,
  IoCloseCircle,
  IoHomeOutline,
  IoMapOutline,
  IoChevronDownOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { Slider } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../utils/apiClient";

const RECENT_KEY = "sheetal_recent_searches";
const MAX_RECENT = 5;
const API_BASE = process.env.REACT_APP_API_LINK || "";
const PRICE_MIN = 500;
const PRICE_MAX = 5_00_00_000;

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
  if (v >= 1_00_000) return `Rs.${(v / 1_00_000).toFixed(1)}L`;
  if (v >= 1_000) return `Rs.${(v / 1_000).toFixed(0)}K`;
  return `Rs.${v}`;
}

const TypeIcon = ({ type }) => {
  const cls = "w-3.5 h-3.5 text-gray-500";
  if (type === "city") return <IoBusinessOutline className={cls} />;
  if (type === "locality") return <IoLocationOutline className={cls} />;
  if (type === "district") return <IoMapOutline className={cls} />;
  return <IoHomeOutline className={cls} />;
};

/* ─────────────────────────────────────────────────────────────────────────────
   FixedPopover — renders with position:fixed using getBoundingClientRect so it
   escapes every overflow:hidden / overflow:clip ancestor in the tree.
───────────────────────────────────────────────────────────────────────────── */
const FixedPopover = ({ anchorRef, open, children, width }) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const recalc = useCallback(() => {
    if (!anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    const w = typeof width === "number" ? width : 200;
    const left = Math.min(r.left, window.innerWidth - w - 8);
    setPos({ top: r.bottom + 6, left });
  }, [anchorRef, width]);

  useEffect(() => {
    if (!open) return;
    recalc();
    window.addEventListener("scroll", recalc, true);
    window.addEventListener("resize", recalc);
    return () => {
      window.removeEventListener("scroll", recalc, true);
      window.removeEventListener("resize", recalc);
    };
  }, [open, recalc]);

  if (!open) return null;

  return (
    <div
      style={{ position: "fixed", top: pos.top, left: pos.left, width: width || "auto", zIndex: 99999 }}
      className="bg-white border border-gray-200 shadow-xl rounded-sm"
    >
      {children}
    </div>
  );
};

const InputBox = ({ setFilterModal, showFilters = true, activeTab }) => {
  const [search, setSearch] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get("keyword") || "";
    } catch { return ""; }
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [recent, setRecent] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);

  const [attributes, setAttributes] = useState(null);
  const [attrLoading, setAttrLoading] = useState(false);

  // which filter popover is open: null | "status" | "type" | "price" | "date"
  const [activeFilter, setActiveFilter] = useState(null);

  const [purpose, setPurpose] = useState(activeTab?.advertisement_purpose || "all");
  const [propType, setPropType] = useState(activeTab?.property_type || "all");
  const [price, setPrice] = useState([PRICE_MIN, PRICE_MAX]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Refs for each pill button
  const statusBtnRef = useRef(null);
  const typeBtnRef = useRef(null);
  const priceBtnRef = useRef(null);
  const dateBtnRef = useRef(null);

  const inputRef = useRef(null);
  const dropRef = useRef(null);
  const wrapRef = useRef(null);
  const abortRef = useRef(null);
  const navigate = useNavigate();

  /* ── sync tab → purpose pill ── */
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
      .catch(() => { })
      .finally(() => setAttrLoading(false));
  }, [attributes]);

  /* ── single outside-click handler for everything ── */
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

  /* ── suggestion fetch ── */
  const fetchSuggestions = useCallback(async (q) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/search/suggestions?q=${encodeURIComponent(q)}`, { signal: abortRef.current.signal });
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

  /* ── FIX 1 + FIX 2: buildParams
       - "all" now sets param to null (clears it) instead of falling back to activeTab
       - accepts dateFrom/dateTo overrides to avoid async state lag
  ── */
  const buildParams = useCallback((keyword, overrides = {}) => {
    const p = new URLSearchParams();
    if (keyword) p.set("keyword", keyword);

    const resolvedPurpose  = overrides.purpose  ?? purpose;
    const resolvedType     = overrides.propType ?? propType;
    // FIX 1: when "all", send nothing — don't fall back to activeTab value
    const adPurpose = resolvedPurpose !== "all" ? resolvedPurpose : null;
    const pType     = resolvedType    !== "all" ? resolvedType    : null;
    if (adPurpose) p.set("advertisement_purpose", adPurpose);
    if (pType)     p.set("property_type", pType);

    if (price[0] !== PRICE_MIN) p.set("min_price", price[0]);
    if (price[1] !== PRICE_MAX) p.set("max_price", price[1]);

    // FIX 2: use overrides for dates so state lag doesn't drop them
    const resolvedDateFrom = overrides.dateFrom ?? dateFrom;
    const resolvedDateTo   = overrides.dateTo   ?? dateTo;
    if (resolvedDateFrom) p.set("date_from", resolvedDateFrom);
    if (resolvedDateTo)   p.set("date_to",   resolvedDateTo);

    return p.toString();
  }, [purpose, propType, price, dateFrom, dateTo]);

  /* ── FIX 3: handleSelect — also handles property ID routing ── */
  const handleSelect = useCallback((name) => {
    setSearch(name); setOpen(false);
    saveRecent(name); setRecent(getRecent());
    navigate(`/productSearch?${buildParams(name)}`);
  }, [navigate, buildParams]);

  /* ── FIX 3: handleSubmit — numeric input → property ID page ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    // If input is a pure number, treat it as a property ID
    if (/^\d+$/.test(q)) {
      navigate(`/property/${q}`);
      setOpen(false);
      return;
    }
    saveRecent(q); setRecent(getRecent());
    navigate(`/productSearch?${buildParams(q)}`);
    setOpen(false);
  };

  const resetFilters = () => {
    const clearedPurpose = activeTab?.advertisement_purpose || "all";
    setPurpose(clearedPurpose);
    setPropType("all");
    setPrice([PRICE_MIN, PRICE_MAX]);
    setDateFrom(""); setDateTo("");
    const p = new URLSearchParams();
    if (search.trim()) p.set("keyword", search.trim());
    // FIX 1: clearedPurpose of "all" means no param — consistent with buildParams fix
    if (clearedPurpose !== "all") p.set("advertisement_purpose", clearedPurpose);
    navigate(`/productSearch?${p.toString()}`);
  };

  const allItems = data
    ? [...(data.districts || []), ...(data.cities || []), ...(data.localities || []), ...(data.properties || [])]
    : [];
  const hasResults = data && (data.districts?.length || data.cities?.length || data.localities?.length || data.properties?.length);

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, allItems.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); handleSelect(allItems[activeIdx].name); }
    else if (e.key === "Escape") setOpen(false);
  };

  const clearInput = () => { setSearch(""); setActiveIdx(-1); setData(null); inputRef.current?.focus(); };
  const removeRecent = (term, e) => {
    e.stopPropagation();
    const u = getRecent().filter((r) => r !== term);
    localStorage.setItem(RECENT_KEY, JSON.stringify(u));
    setRecent(u);
  };

  const toggleFilter = (id) => {
    setOpen(false);
    setActiveFilter((v) => v === id ? null : id);
  };

  /* ── derived labels ── */
  const purposeLabels = { all: "For Sale / Rent", sale: "For Sale", rent: "For Rent", invest: "Invest" };
  const purposeLabel = purposeLabels[purpose] || purpose;
  const typeLabel = propType !== "all" ? propType : "Property type";
  const priceActive = price[0] !== PRICE_MIN || price[1] !== PRICE_MAX;
  const priceLabel = priceActive ? `${fmtPrice(price[0])} – ${fmtPrice(price[1])}` : "Price";
  const dateActive = !!dateFrom || !!dateTo;
  const dateLabel = dateActive ? (dateFrom && dateTo ? `${dateFrom} – ${dateTo}` : dateFrom || dateTo) : "Listed";
  const anyActive = purpose !== "all" || propType !== "all" || priceActive || dateActive;

  /* ── pill className helper ── */
  const pillCls = (id, isActive) => {
    const isOpen = activeFilter === id;
    return [
      "flex items-center gap-1.5 px-3 py-1.5 border text-xs font-medium cursor-pointer",
      "whitespace-nowrap flex-shrink-0 transition-all duration-100 rounded-sm",
      isOpen
        ? "bg-gray-900 border-gray-900 text-white"
        : isActive
          ? "bg-red-50 border-red-500 text-red-700"
          : "bg-white border-gray-300 text-gray-700 hover:border-gray-500",
    ].join(" ");
  };

  /* ── shared sub-components ── */
  const SectionLabel = ({ label }) => (
    <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
  );
  const HRule = () => <div className="h-px bg-gray-100 mx-3 my-1" />;

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
      className={`px-2.5 py-1.5 border text-xs font-medium rounded-sm transition-all ${active ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
        }`}>
      {children}
    </button>
  );

  const PopHead = ({ children }) => (
    <p className="px-3.5 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">{children}</p>
  );

  /* ── PopFooter: accepts optional dateOverrides for date panel ── */
  const PopFooter = ({ onReset }) => (
    <div className="flex justify-between items-center px-3.5 py-2.5 border-t border-gray-100">
      <button type="button" onClick={onReset} className="text-xs font-semibold text-gray-400 hover:text-gray-700 underline">Reset</button>
      <button type="button" onClick={() => {
        setActiveFilter(null);
        navigate(`/productSearch?${buildParams(search.trim())}`);
      }}
        className="text-xs font-semibold bg-gray-900 text-white px-3.5 py-1.5 rounded-sm hover:bg-gray-700">
        Apply
      </button>
    </div>
  );

  /* ════════════════════════════════════════════════════════════════════════ */
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
          <button type="button" onClick={clearInput} className="p-1 mr-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
            <IoCloseCircle className="w-4 h-4" />
          </button>
        )}
        <button type="submit" disabled={!search.trim()}
          className="p-2 sm:p-3 border md:border-none border-red-800 h-full font-medium text-sm flex items-center bg-red-700 text-white rounded-sm flex-shrink-0 hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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

          {/* FIX 3: numeric input — show "Search by ID" hint in dropdown */}
          {!loading && search.trim() && /^\d+$/.test(search.trim()) && (
            <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
              <span className="w-7 h-7 rounded-sm bg-red-50 flex items-center justify-center flex-shrink-0">
                <IoHomeOutline className="w-3.5 h-3.5 text-red-600" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">Search property #{search.trim()}</p>
                <p className="text-xs text-gray-400">Go directly to this property ID</p>
              </div>
              <button
                onClick={() => { navigate(`/property/${search.trim()}`); setOpen(false); }}
                className="text-xs font-semibold bg-red-700 text-white px-3 py-1.5 rounded-sm hover:bg-red-800 flex-shrink-0"
              >
                Go
              </button>
            </div>
          )}

          {!loading && search.trim() && hasResults && (
            <>
              {data.districts?.length > 0 && (<><SectionLabel label="Districts" />{data.districts.map((item, i) => <ResultItem key={item.name} item={item} idx={i} />)}</>)}
              {data.cities?.length > 0 && (<>{data.districts?.length > 0 && <HRule />}<SectionLabel label="Cities / Towns" />{data.cities.map((item, i) => <ResultItem key={item.name} item={item} idx={(data.districts?.length || 0) + i} />)}</>)}
              {data.localities?.length > 0 && (<>{(data.districts?.length > 0 || data.cities?.length > 0) && <HRule />}<SectionLabel label="Localities / Tols" />{data.localities.map((item, i) => <ResultItem key={item.name} item={item} idx={(data.districts?.length || 0) + (data.cities?.length || 0) + i} />)}</>)}
              {data.properties?.length > 0 && (<><HRule /><SectionLabel label="Properties" />{data.properties.map((item, i) => <ResultItem key={item.name + i} item={item} idx={(data.districts?.length || 0) + (data.cities?.length || 0) + (data.localities?.length || 0) + i} />)}</>)}
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
          {!loading && search.trim() && !hasResults && !data?.didYouMean && data && !(/^\d+$/.test(search.trim())) && (
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
          <div className="flex items-center gap-2 bg-white no-scrollbar pb-0.5" style={{ overflowX: "auto", overflowY: "visible" }}>

            {/* ── Status pill ── */}
            <div className="relative flex-shrink-0">
              <button
                ref={statusBtnRef}
                type="button"
                onClick={() => toggleFilter("status")}
                className={pillCls("status", purpose !== "all")}
              >
                {purposeLabel}
                {purpose !== "all" && activeFilter !== "status" && <span className="w-1.5 h-1.5" />}
                <IoChevronDownOutline className={`w-3 h-3 transition-transform duration-150 ${activeFilter === "status" ? "rotate-180" : ""}`} />
              </button>
              <FixedPopover anchorRef={statusBtnRef} open={activeFilter === "status"} width={208}>
                <PopHead>Listing type</PopHead>
                <div className="flex flex-wrap gap-2 px-3.5 pb-3 pt-1">
                  {[
                    { label: "All", val: "all" },
                    { label: "Sale", val: "sale" },
                    { label: "Rent", val: "rent" },
                    { label: "Invest", val: "invest" },
                    ...(attributes?.purposes?.filter(p => !["sale", "rent", "invest"].includes(p.name?.toLowerCase())) || []).map(p => ({ label: p.name, val: p.name })),
                  ].map(({ label, val }) => (
                    // FIX 1: pass { purpose: val } override so "All" clears the param immediately
                    <Chip key={val} active={purpose === val} onClick={() => {
                      setPurpose(val);
                      setActiveFilter(null);
                      navigate(`/productSearch?${buildParams(search.trim(), { purpose: val })}`);
                    }}>{label}</Chip>
                  ))}
                </div>
                <PopFooter onReset={() => { setPurpose(activeTab?.advertisement_purpose || "all"); setActiveFilter(null); }} />
              </FixedPopover>
            </div>

            {/* ── Type pill ── */}
            <div className="relative flex-shrink-0">
              <button
                ref={typeBtnRef}
                type="button"
                onClick={() => toggleFilter("type")}
                className={pillCls("type", propType !== "all")}
              >
                {typeLabel}
                {propType !== "all" && activeFilter !== "type" && <span className="w-1.5 h-1.5" />}
                <IoChevronDownOutline className={`w-3 h-3 transition-transform duration-150 ${activeFilter === "type" ? "rotate-180" : ""}`} />
              </button>
              <FixedPopover anchorRef={typeBtnRef} open={activeFilter === "type"} width={224}>
                <PopHead>Property type</PopHead>
                {attrLoading
                  ? <div className="px-3.5 py-4 text-sm text-gray-400">Loading…</div>
                  : (
                    <div className="flex flex-wrap gap-2 px-3.5 pb-3 pt-1">
                      {/* FIX 1: pass { propType: "all" } override so "All types" clears immediately */}
                      <Chip active={propType === "all"} onClick={() => {
                        setPropType("all");
                        setActiveFilter(null);
                        navigate(`/productSearch?${buildParams(search.trim(), { propType: "all" })}`);
                      }}>All types</Chip>
                      {attributes?.property_types?.map((pt, i) => (
                        <Chip key={i} active={propType === pt.name} onClick={() => {
                          setPropType(pt.name);
                          setActiveFilter(null);
                          navigate(`/productSearch?${buildParams(search.trim(), { propType: pt.name })}`);
                        }}>{pt.name}</Chip>
                      ))}
                    </div>
                  )
                }
              </FixedPopover>
            </div>

            {/* ── Price pill ── */}
            <div className="relative flex-shrink-0">
              <button
                ref={priceBtnRef}
                type="button"
                onClick={() => toggleFilter("price")}
                className={pillCls("price", priceActive)}
              >
                {priceLabel}
                {priceActive && activeFilter !== "price" && <span className="w-1.5 h-1.5" />}
                <IoChevronDownOutline className={`w-3 h-3 transition-transform duration-150 ${activeFilter === "price" ? "rotate-180" : ""}`} />
              </button>
              <FixedPopover anchorRef={priceBtnRef} open={activeFilter === "price"} width={288}>
                <PopHead>Price range</PopHead>
                <div className="px-3.5 pb-2">
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>Rs.5K</span>
                    <span className="font-semibold text-gray-800 text-xs">{fmtPrice(price[0])} – {fmtPrice(price[1])}</span>
                    <span>Rs.5Cr</span>
                  </div>
                  <Slider value={price} onChange={(_, val) => setPrice(val)}
                    min={PRICE_MIN} max={PRICE_MAX} step={10_000}
                    style={{ color: "#b91c1c", height: 3, padding: "10px 0" }} />
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

            {/* ── Date pill ── */}
            <div className="relative flex-shrink-0">
              <button
                ref={dateBtnRef}
                type="button"
                onClick={() => toggleFilter("date")}
                className={pillCls("date", dateActive)}
              >
                {dateLabel}
                {dateActive && activeFilter !== "date" && <span className="w-1.5 h-1.5" />}
                <IoChevronDownOutline className={`w-3 h-3 transition-transform duration-150 ${activeFilter === "date" ? "rotate-180" : ""}`} />
              </button>
              <FixedPopover anchorRef={dateBtnRef} open={activeFilter === "date"} width={240}>
                <PopHead>Date listed</PopHead>
                <div className="flex flex-wrap gap-1.5 px-3.5 pb-3 pt-1">
                  {[
                    { label: "Today", days: 0 },
                    { label: "Last 7 days", days: 7 },
                    { label: "Last 30 days", days: 30 },
                    { label: "Last 3 months", days: 90 },
                  ].map(({ label, days }) => {
                    const from = new Date(); from.setDate(from.getDate() - days);
                    const fs = from.toISOString().split("T")[0];
                    const ts = new Date().toISOString().split("T")[0];
                    return (
                      // FIX 2: quick chips also navigate immediately with date overrides
                      <Chip key={label} active={dateFrom === fs && dateTo === ts}
                        onClick={() => {
                          setDateFrom(fs);
                          setDateTo(ts);
                          setActiveFilter(null);
                          navigate(`/productSearch?${buildParams(search.trim(), { dateFrom: fs, dateTo: ts })}`);
                        }}>
                        {label}
                      </Chip>
                    );
                  })}
                </div>
                <div className="px-3.5 pb-3 flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-400 mb-1 uppercase tracking-wide font-semibold">From</label>
                    <input type="date" value={dateFrom} max={dateTo || undefined} onChange={(e) => setDateFrom(e.target.value)}
                      className="border border-gray-200 focus:border-gray-900 outline-none py-1.5 px-2 w-full text-xs rounded-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-400 mb-1 uppercase tracking-wide font-semibold">To</label>
                    <input type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => setDateTo(e.target.value)}
                      className="border border-gray-200 focus:border-gray-900 outline-none py-1.5 px-2 w-full text-xs rounded-sm" />
                  </div>
                </div>
                {/* FIX 2: pass dateOverrides so Apply captures the current picker values */}
                <PopFooter
                  onReset={() => { setDateFrom(""); setDateTo(""); }}
                />
              </FixedPopover>
            </div>

            {/* ── Clear all ── */}
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