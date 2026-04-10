import React, { useState, useRef, useEffect, useCallback } from "react";
import { AiOutlineControl } from "react-icons/ai";
import {
  IoSearchOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoBusinessOutline,
  IoCloseCircle,
  IoHomeOutline,
  IoMapOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";

// ── Constants ──────────────────────────────────────────────────────────────────
const RECENT_KEY = "sheetal_recent_searches";
const MAX_RECENT = 5;
const API_BASE   = process.env.REACT_APP_API_URL || "";

// ── Recent search helpers ──────────────────────────────────────────────────────
function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; }
  catch { return []; }
}

function saveRecent(term) {
  const prev = getRecent().filter((r) => r !== term);
  localStorage.setItem(
    RECENT_KEY,
    JSON.stringify([term, ...prev].slice(0, MAX_RECENT))
  );
}

// ── Highlight matched text red ─────────────────────────────────────────────────
function highlight(text, query) {
  if (!query || !text) return text ?? "";
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${escaped})`, "gi"), "<mark>$1</mark>");
}

// ── Icon per result type ───────────────────────────────────────────────────────
const TypeIcon = ({ type }) => {
  const cls = "w-3.5 h-3.5 text-gray-500";
  if (type === "city")     return <IoBusinessOutline className={cls} />;
  if (type === "locality") return <IoLocationOutline className={cls} />;
  if (type === "district") return <IoMapOutline className={cls} />;
  return <IoHomeOutline className={cls} />;
};

// ── Main component ─────────────────────────────────────────────────────────────
const InputBox = ({ setFilterModal, showFilters = true }) => {
  const [search,    setSearch]    = useState("");
  const [open,      setOpen]      = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [data,      setData]      = useState(null);
  const [recent,    setRecent]    = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);

  const inputRef = useRef(null);
  const dropRef  = useRef(null);
  const abortRef = useRef(null);
  const navigate = useNavigate();

  // load recents on mount
  useEffect(() => { setRecent(getRecent()); }, []);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropRef.current  && !dropRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // fetch from Laravel API with debounce
  const fetchSuggestions = useCallback(async (q) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    try {
      const res  = await fetch(
        `${API_BASE}/api/search/suggestions?q=${encodeURIComponent(q)}`,
        { signal: abortRef.current.signal }
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err.name !== "AbortError") setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchSuggestions(search.trim()), 250);
    return () => clearTimeout(timer);
  }, [search, fetchSuggestions]);

  // flat list for keyboard nav
  const allItems = data
    ? [
        ...(data.districts  || []),
        ...(data.cities     || []),
        ...(data.localities || []),
        ...(data.properties || []),
      ]
    : [];

  const hasResults = data && (
    data.districts?.length  ||
    data.cities?.length     ||
    data.localities?.length ||
    data.properties?.length
  );

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSelect = useCallback((name) => {
    setSearch(name);
    setOpen(false);
    saveRecent(name);
    setRecent(getRecent());
    navigate(`/productSearch?keyword=${encodeURIComponent(name)}`);
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    saveRecent(q);
    setRecent(getRecent());
    navigate(`/productSearch?keyword=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, allItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(allItems[activeIdx].name);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const clearInput = () => {
    setSearch("");
    setActiveIdx(-1);
    setData(null);
    inputRef.current?.focus();
  };

  const removeRecent = (term, e) => {
    e.stopPropagation();
    const updated = getRecent().filter((r) => r !== term);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    setRecent(updated);
  };

  const q = search.trim();

  // ── Sub-components ────────────────────────────────────────────────────────────
  const SectionLabel = ({ label }) => (
    <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
      {label}
    </p>
  );

  const Divider = () => <div className="h-px bg-gray-100 mx-3 my-1" />;

  const ResultItem = ({ item, idx }) => (
    <button
      onClick={() => handleSelect(item.name)}
      className={`flex items-center gap-3 w-full px-4 py-2.5 transition-colors text-left ${
        activeIdx === idx ? "bg-red-50" : "hover:bg-gray-50"
      }`}
    >
      <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
        <TypeIcon type={item.type} />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className="text-sm font-semibold text-gray-800 truncate"
          dangerouslySetInnerHTML={{ __html: highlight(item.name, q) }}
        />
        {item.locality && (
          <p className="text-xs text-gray-400 truncate">{item.locality}</p>
        )}
      </div>
      {item.count != null && (
        <span className="ml-auto text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
          {item.count}+
        </span>
      )}
    </button>
  );

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="relative">

      {/* ── Search Bar ── */}
      <form
        onSubmit={handleSubmit}
        className="border-2 flex items-center rounded-md bg-white hover:border-red-900 focus-within:ring-2 focus-within:ring-red-300 overflow-visible px-1 transition-all"
      >
        <IoSearchOutline className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />

        <input
          ref={inputRef}
          type="text"
          value={search}
          placeholder="Enter an address, neighbourhood, city or ZIP code"
          className="w-full h-full p-4 px-3 text-sm border-none outline-none bg-transparent overflow-hidden text-ellipsis"
          onChange={(e) => {
            setSearch(e.target.value);
            setActiveIdx(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {/* Clear button — only when typing */}
        {search && (
          <button
            type="button"
            onClick={clearInput}
            className="p-1 mr-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <IoCloseCircle className="w-4 h-4" />
          </button>
        )}

        {/* Filters */}
        {showFilters && (
          <button
            type="button"
            onClick={() => setFilterModal(true)}
            className="p-2 sm:px-3 sm:mr-4 sm:py-2 space-x-1 flex items-center text-red-700 font-medium text-sm sm:font-base sm:text-gray-700 sm:border rounded-md border-gray-700 flex-shrink-0"
          >
            <AiOutlineControl className="hidden sm:inline w-6 h-6" />
            <span>Filters</span>
          </button>
        )}

        {/* Search button — identical classes to your original */}
        <button
          type="submit"
          disabled={!q}
          className="p-2 sm:p-3 border md:border-none border-red-800 h-full font-medium text-sm flex items-center bg-red-700 text-white rounded-md flex-shrink-0 hover:bg-red-800 transition-colors"
        >
          <IoSearchOutline className="w-4 h-4 md:mr-4" />
          <span className="hidden md:inline">Search</span>
        </button>
      </form>

      {/* ── Dropdown ── */}
      {open && (
        <div
          ref={dropRef}
          className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
          style={{ maxHeight: "440px", overflowY: "auto" }}
        >

          {/* Loading */}
          {loading && (
            <div className="px-4 py-3 flex items-center gap-2 text-sm text-gray-400">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.2" />
                <path d="M21 12a9 9 0 00-9-9" />
              </svg>
              Searching…
            </div>
          )}

          {/* ── No query: recents + popular from DB ── */}
          {!loading && !q && (
            <>
              {recent.length > 0 && (
                <>
                  <SectionLabel label="Recent Searches" />
                  <div className="px-3 pb-2 flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button
                        key={r}
                        onClick={() => handleSelect(r)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-600 text-xs font-medium transition-colors"
                      >
                        <IoTimeOutline className="w-3.5 h-3.5" />
                        {r}
                        <span
                          role="button"
                          onClick={(e) => removeRecent(r, e)}
                          className="ml-0.5 text-gray-400 hover:text-red-500 font-bold"
                        >
                          ×
                        </span>
                      </button>
                    ))}
                  </div>
                  <Divider />
                </>
              )}

              {/* Popular cities from DB */}
              {data?.cities?.length > 0 && (
                <>
                  <SectionLabel label="Popular Cities" />
                  {data.cities.map((item, i) => (
                    <ResultItem key={item.name} item={item} idx={i} />
                  ))}
                </>
              )}

              {data?.localities?.length > 0 && (
                <>
                  <Divider />
                  <SectionLabel label="Popular Localities" />
                  {data.localities.map((item, i) => (
                    <ResultItem
                      key={item.name}
                      item={item}
                      idx={(data.cities?.length || 0) + i}
                    />
                  ))}
                </>
              )}

              {/* Fallback if API not ready yet */}
              {!data && (
                <div className="px-4 py-4 text-sm text-gray-400 text-center">
                  Start typing to search properties…
                </div>
              )}
            </>
          )}

          {/* ── Has query + results ── */}
          {!loading && q && hasResults && (
            <>
              {data.districts?.length > 0 && (
                <>
                  <SectionLabel label="Districts" />
                  {data.districts.map((item, i) => (
                    <ResultItem key={item.name} item={item} idx={i} />
                  ))}
                </>
              )}

              {data.cities?.length > 0 && (
                <>
                  {data.districts?.length > 0 && <Divider />}
                  <SectionLabel label="Cities / Towns" />
                  {data.cities.map((item, i) => (
                    <ResultItem
                      key={item.name}
                      item={item}
                      idx={(data.districts?.length || 0) + i}
                    />
                  ))}
                </>
              )}

              {data.localities?.length > 0 && (
                <>
                  {(data.districts?.length > 0 || data.cities?.length > 0) && <Divider />}
                  <SectionLabel label="Localities / Tols" />
                  {data.localities.map((item, i) => (
                    <ResultItem
                      key={item.name}
                      item={item}
                      idx={
                        (data.districts?.length || 0) +
                        (data.cities?.length || 0) + i
                      }
                    />
                  ))}
                </>
              )}

              {data.properties?.length > 0 && (
                <>
                  <Divider />
                  <SectionLabel label="Properties" />
                  {data.properties.map((item, i) => (
                    <ResultItem
                      key={item.name + i}
                      item={item}
                      idx={
                        (data.districts?.length  || 0) +
                        (data.cities?.length     || 0) +
                        (data.localities?.length || 0) + i
                      }
                    />
                  ))}
                </>
              )}

              {/* Keyboard hint */}
              <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/60">
                <p className="text-[10px] text-gray-400 font-medium">
                  <kbd className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[9px] font-mono">↑↓</kbd> navigate &nbsp;·&nbsp;
                  <kbd className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[9px] font-mono">Enter</kbd> select &nbsp;·&nbsp;
                  <kbd className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[9px] font-mono">Esc</kbd> close
                </p>
              </div>
            </>
          )}

          {/* ── Did you mean ── */}
          {!loading && q && !hasResults && data?.didYouMean && (
            <div className="px-4 py-5 flex items-start gap-3">
              <IoSearchOutline className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">
                  No results for{" "}
                  <span className="font-semibold text-gray-800">"{q}"</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Did you mean:{" "}
                  <button
                    onClick={() => handleSelect(data.didYouMean)}
                    className="text-red-600 font-semibold hover:underline"
                  >
                    {data.didYouMean}
                  </button>
                  ?
                </p>
              </div>
            </div>
          )}

          {/* ── No results at all ── */}
          {!loading && q && !hasResults && !data?.didYouMean && data && (
            <div className="px-4 py-8 text-center">
              <IoSearchOutline className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                No results for{" "}
                <span className="font-semibold text-gray-800">"{q}"</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try a different city, locality or landmark
              </p>
            </div>
          )}
        </div>
      )}

      <style>{`mark { background: transparent; color: #b91c1c; font-weight: 700; }`}</style>
    </div>
  );
};

export default InputBox;