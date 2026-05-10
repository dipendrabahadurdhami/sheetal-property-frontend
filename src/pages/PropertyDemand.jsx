import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  IoSearchOutline,
  IoCloseCircle,
  IoLocationOutline,
  IoCashOutline,
  IoCarOutline,
  IoPeopleOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import Loader from "../components/Loader";
import PropertyDemandTable from "../components/PropertyDemandTable";
import headTag from "../headTag";

// ── All searchable fields ──────────────────────────────────────────────────────
const SEARCH_FIELDS = [
  { icon: IoDocumentTextOutline, label: "Requirement"  },
  { icon: IoLocationOutline,     label: "Location"     },
  { icon: IoCashOutline,         label: "Budget"       },
  { icon: IoPeopleOutline,       label: "Tenant"       },
  { icon: IoCarOutline,          label: "Vehicle"      },
];

const matchesTerm = (item, term) => {
  if (!term) return true;
  const t = term.toLowerCase();
  return [
    item?.requirement,
    item?.prefered_location,
    item?.maximum_budget,
    item?.tenant_option,
    item?.vehicles,
  ]
    .filter(Boolean)
    .some((field) => String(field).toLowerCase().includes(t));
};

const PropertyDemand = () => {
  const [demand,       setDemand]       = useState(null);
  const [filteredList, setFilteredList] = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [search,       setSearch]       = useState("");
  const [focused,      setFocused]      = useState(false);

  const displayDemand = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_LINK}/property-demand-list`
      );
      if (res.status === 200) {
        setDemand(res.data.data);
        setFilteredList(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch demands", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    displayDemand();
    headTag({ title: "Property Demand", content: "" });
  }, []);

  // Live filter as user types
  useEffect(() => {
    if (!demand) return;
    setFilteredList(demand.filter((item) => matchesTerm(item, search)));
  }, [search, demand]);

  const handleClear = () => setSearch("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!demand) return;
    setFilteredList(demand.filter((item) => matchesTerm(item, search)));
  };

  const hasResults  = filteredList && filteredList.length > 0;
  const noResults   = filteredList && filteredList.length === 0 && demand;

  return (
    <div className="p-5 md:p-10 mt-40 space-y-8">

   

      {/* ── Search box ── */}
      <div className="flex md:px-10">
        <div className="w-full  bg-white rounded-2xl p-4 xs:p-6 md:p-8 shadow-sm border border-gray-100">

          <form onSubmit={handleSubmit}>
            <div
              className={`flex items-center bg-white rounded-2xl border-2 pl-4 pr-2 py-2 gap-3 transition-all duration-200 ${
                focused
                  ? "border-red-600 shadow-[0_0_0_4px_rgba(185,28,28,0.07)]"
                  : "border-gray-200 hover:border-gray-300 shadow-sm"
              }`}
            >
              {/* Search icon */}
              <IoSearchOutline
                className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                  focused ? "text-red-500" : "text-gray-400"
                }`}
              />

              {/* Input */}
              <input
                type="text"
                value={search}
                placeholder="Search by title, location, budget, tenant, vehicle…"
                className="flex-1 py-2 text-sm md:text-base text-gray-900 placeholder-gray-300 border-none outline-none bg-transparent"
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoComplete="off"
              />

              {/* Clear */}
              {search && (
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

          {/* ── Field chips ── */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Searches:
            </span>
            {SEARCH_FIELDS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-500 text-[11px] font-semibold"
              >
                <Icon className="w-3 h-3" />
                {label}
              </span>
            ))}
          </div>

          {/* ── Active filter badge ── */}
          {search && (
            <div className="flex items-center gap-2.5 mt-3">
              <span className="text-xs text-gray-400 font-medium">
                Filtering:
              </span>
              <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                <IoSearchOutline className="w-3 h-3" />
                {search}
                <button
                  onClick={handleClear}
                  className="ml-0.5 hover:text-red-900 font-black text-sm leading-none"
                >
                  ×
                </button>
              </span>
              {filteredList && (
                <span className="text-xs text-gray-400">
                  {filteredList.length === 0
                    ? "No results"
                    : `${filteredList.length} result${filteredList.length === 1 ? "" : "s"}`}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader />
        </div>
      )}

      {/* ── Result count ── */}
      {!loading && search && hasResults && (
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-bold text-gray-800">{filteredList.length}</span>{" "}
          {filteredList.length === 1 ? "demand" : "demands"} for{" "}
          <span className="font-bold text-red-600">"{search}"</span>
        </p>
      )}

      {/* ── No results ── */}
      {!loading && noResults && (
        <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl">
          <IoSearchOutline className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">
              No results for "{search}"
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Try searching by location, budget or requirement type
            </p>
          </div>
          <button
            onClick={handleClear}
            className="text-xs font-bold text-red-600 hover:text-red-800 whitespace-nowrap"
          >
            Clear
          </button>
        </div>
      )}

      {/* ── Results table ── */}
      {!loading && hasResults && (
        <PropertyDemandTable demands={filteredList} />
      )}
    </div>
  );
};

export default PropertyDemand;