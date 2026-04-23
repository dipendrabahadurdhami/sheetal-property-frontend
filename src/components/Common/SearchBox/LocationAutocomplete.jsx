import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  IoLocationOutline,
  IoCloseOutline,
  IoBusinessOutline,
  IoMapOutline,
  IoHomeOutline,
} from "react-icons/io5";

const API_BASE = process.env.REACT_APP_API_LINK || "";

// Same TypeIcon as InputBox for consistency
const TypeIcon = ({ type }) => {
  const cls = "w-3 h-3 text-gray-400";
  if (type === "city")     return <IoBusinessOutline className={cls} />;
  if (type === "district") return <IoMapOutline className={cls} />;
  if (type === "property") return <IoHomeOutline className={cls} />;
  return <IoLocationOutline className={cls} />;
};

const LocationAutocomplete = ({ value, onChange }) => {
  const [tags,      setTags]      = useState(() =>
    value ? value.split(",").map(v => v.trim()).filter(Boolean) : []
  );
  const [inputVal,  setInputVal]  = useState("");
  const [data,      setData]      = useState(null);
  const [open,      setOpen]      = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [loading,   setLoading]   = useState(false);

  const wrapperRef  = useRef(null);
  const inputRef    = useRef(null);
  const abortRef    = useRef(null);
  const debounceRef = useRef(null);

  // Sync tags array → Formik as "Lalitpur,Kathmandu"
  useEffect(() => { onChange(tags.join(",")); }, [tags]);

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Reuses the SAME endpoint as InputBox — no new API needed
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
      const total =
        (json.districts?.length  || 0) +
        (json.cities?.length     || 0) +
        (json.localities?.length || 0) +
        (json.properties?.length || 0);
      setOpen(total > 0);
      setActiveIdx(-1);
    } catch (err) {
      if (err.name !== "AbortError") setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (inputVal.trim().length < 1) { setData(null); setOpen(false); return; }
    debounceRef.current = setTimeout(
      () => fetchSuggestions(inputVal.trim()), 250
    );
    return () => clearTimeout(debounceRef.current);
  }, [inputVal, fetchSuggestions]);

  // Flat list for keyboard nav — same order as InputBox
  const allItems = data
    ? [
        ...(data.districts  || []),
        ...(data.cities     || []),
        ...(data.localities || []),
        ...(data.properties || []),
      ].filter(item => !tags.includes(item.name))
    : [];

  const distLen = data?.districts?.length  || 0;
  const cityLen = data?.cities?.length     || 0;
  const tolLen  = data?.localities?.length || 0;

  const addTag = useCallback((name) => {
    const clean = name.trim();
    if (clean && !tags.includes(clean))
      setTags(prev => [...prev, clean]);
    setInputVal("");
    setData(null);
    setOpen(false);
    inputRef.current?.focus();
  }, [tags]);

  const removeTag = (tag) =>
    setTags(prev => prev.filter(t => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, allItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (activeIdx >= 0 && allItems[activeIdx])
        addTag(allItems[activeIdx].name);
      else if (inputVal.trim())
        addTag(inputVal);
    } else if (e.key === "Backspace" && inputVal === "" && tags.length > 0) {
      setTags(prev => prev.slice(0, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Same SectionLabel + Divider style as InputBox
  const SectionLabel = ({ label }) => (
    <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
      {label}
    </p>
  );

  const Divider = () => <div className="h-px bg-gray-100 mx-3 my-1" />;

  const ItemRow = ({ item, idx }) => {
    const isAdded = tags.includes(item.name);
    return (
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); if (!isAdded) addTag(item.name); }}
        disabled={isAdded}
        className={`flex items-center gap-3 w-full px-4 py-2.5 transition-colors text-left
          ${isAdded
            ? "opacity-40 cursor-not-allowed"
            : activeIdx === idx ? "bg-red-50" : "hover:bg-gray-50"
          }`}
      >
        <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          <TypeIcon type={item.type} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
          {item.locality && (
            <p className="text-xs text-gray-400 truncate">{item.locality}</p>
          )}
        </div>
        {item.count != null && (
          <span className="ml-auto text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
            {item.count}+
          </span>
        )}
        {isAdded && (
          <span className="text-[10px] text-gray-400 flex-shrink-0">added</span>
        )}
      </button>
    );
  };

  return (
    <div ref={wrapperRef} className="relative w-full">

      {/* Tag input — sits inside FormField's border div */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex flex-wrap items-center gap-1.5 min-h-[42px] px-2 py-1.5 cursor-text w-full"
      >
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-800"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              className="text-red-400 hover:text-red-700 transition-colors"
            >
              <IoCloseOutline style={{ width: 12, height: 12 }} />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => { setInputVal(e.target.value); setActiveIdx(-1); }}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (data) setOpen(true); }}
          placeholder={tags.length === 0 ? "Type a city or area..." : "Add more..."}
          className="flex-1 min-w-[120px] text-sm text-gray-800 outline-none bg-transparent py-1 placeholder-gray-300"
          autoComplete="off"
        />

        {loading && (
          <svg className="w-3.5 h-3.5 animate-spin text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.2"/>
            <path d="M21 12a9 9 0 00-9-9"/>
          </svg>
        )}
      </div>

      {/* Dropdown */}
      {open && !loading && (
        <div
          className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
          style={{ maxHeight: "320px", overflowY: "auto" }}
        >
          {data?.districts?.length > 0 && (
            <>
              <SectionLabel label="Districts" />
              {data.districts
                .filter(i => !tags.includes(i.name))
                .map((item, i) => <ItemRow key={item.name} item={item} idx={i} />)}
            </>
          )}

          {data?.cities?.length > 0 && (
            <>
              {distLen > 0 && <Divider />}
              <SectionLabel label="Cities / Towns" />
              {data.cities
                .filter(i => !tags.includes(i.name))
                .map((item, i) => <ItemRow key={item.name} item={item} idx={distLen + i} />)}
            </>
          )}

          {data?.localities?.length > 0 && (
            <>
              {(distLen > 0 || cityLen > 0) && <Divider />}
              <SectionLabel label="Localities / Tols" />
              {data.localities
                .filter(i => !tags.includes(i.name))
                .map((item, i) => <ItemRow key={item.name} item={item} idx={distLen + cityLen + i} />)}
            </>
          )}

          {data?.properties?.length > 0 && (
            <>
              <Divider />
              <SectionLabel label="Properties" />
              {data.properties
                .filter(i => !tags.includes(i.name))
                .map((item, i) => (
                  <ItemRow key={item.name + i} item={item} idx={distLen + cityLen + tolLen + i} />
                ))}
            </>
          )}

          {/* Same keyboard hint as InputBox */}
          <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/60">
            <p className="text-[10px] text-gray-400 font-medium">
              <kbd className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[9px] font-mono">↑↓</kbd> navigate &nbsp;·&nbsp;
              <kbd className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[9px] font-mono">Enter</kbd> select &nbsp;·&nbsp;
              <kbd className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[9px] font-mono">Esc</kbd> close
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;