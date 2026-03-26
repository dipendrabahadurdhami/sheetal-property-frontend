import React, { useState, useRef, useEffect } from "react";
import {
  IoSearchOutline,
  IoCloseCircle,
  IoPersonOutline,
  IoBusinessOutline,
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoIdCardOutline,
} from "react-icons/io5";

const SEARCH_FIELDS = [
  { icon: IoPersonOutline,   label: "Name"        },
  { icon: IoBusinessOutline, label: "Company"     },
  { icon: IoLocationOutline, label: "City"        },
  { icon: IoCallOutline,     label: "Phone"       },
  { icon: IoMailOutline,     label: "Email"       },
  { icon: IoIdCardOutline,   label: "Designation" },
];

const AgentSearch = ({ filter, onAgentSearch, totalAgents, filteredCount }) => {
  const [localVal, setLocalVal] = useState(filter || "");
  const [focused,  setFocused]  = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { setLocalVal(filter || ""); }, [filter]);

  const handleChange = (e) => {
    setLocalVal(e.target.value);
    onAgentSearch(e.target.value);
  };

  const handleClear = () => {
    setLocalVal("");
    onAgentSearch("");
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAgentSearch(localVal);
  };

  return (
    <div className="w-full md:px-0 mt-40 mb-0">

      {/* ── Header row ── */}
      

      {/* ── Search bar ── */}
      <form onSubmit={handleSubmit}>
        <div
          className={`w-full flex justify-center content-center bg-white rounded-xl border-2 pl-4 pr-2 py-2 gap-3 transition-all duration-200 ${
            focused
              ? "border-red-600 shadow-[0_0_0_4px_rgba(185,28,28,0.07)]"
              : "border-gray-200 hover:border-gray-300 shadow-sm"
          }`}
        >
          {/* Icon */}
          <IoSearchOutline
            className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
              focused ? "text-red-500" : "text-gray-400"
            }`}
          />

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={localVal}
            placeholder="Search by name, city, company, email, phone…"
            className="flex-1 py-2 text-sm text-gray-900 placeholder-gray-300 border-none outline-none bg-transparent"
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete="off"
          />

          {/* Clear */}
          {localVal && (
            <button
              type="button"
              onClick={handleClear}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <IoCloseCircle className="w-4 h-4" />
            </button>
          )}

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

          {/* Submit */}
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-800 active:scale-95 text-white text-sm font-bold rounded-xl transition-all flex-shrink-0"
          >
            <IoSearchOutline className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </form>

      {/* ── Searchable field chips ── */}
      

      {/* ── Active filter badge ── */}
      {localVal && (
        <div className="flex items-center gap-2.5 mt-3">
          <span className="text-xs text-gray-400 font-medium">
            Filtering by:
          </span>
          <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            <IoSearchOutline className="w-3 h-3" />
            {localVal}
            <button
              onClick={handleClear}
              className="ml-0.5 hover:text-red-900 font-black text-sm leading-none"
            >
              ×
            </button>
          </span>
          {filteredCount != null && (
            <span className="text-xs text-gray-400">
              {filteredCount === 0
                ? "No agents found"
                : `${filteredCount} ${filteredCount === 1 ? "agent" : "agents"} found`}
            </span>
          )}
        </div>
      )}

      {/* ── No results message ── */}
      {localVal && filteredCount === 0 && (
        <div className="mt-4 px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3">
          <IoSearchOutline className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-700">
              No agents found for "{localVal}"
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Try searching by name, city, company or phone number
            </p>
          </div>
          <button
            onClick={handleClear}
            className="ml-auto text-xs font-bold text-red-600 hover:text-red-800 whitespace-nowrap"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};

export default AgentSearch;