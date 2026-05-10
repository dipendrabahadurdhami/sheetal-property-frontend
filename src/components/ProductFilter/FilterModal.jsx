import React, { useEffect, useState, useRef } from "react";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { AiOutlineControl } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";

const FilterModal = (props) => {
  const [params, setParams] = useSearchParams();
  const _params = Object.fromEntries([...params]);
  const [price, setPrice] = useState({ min: "", max: "" });
  const [menuActive, setMenuActive] = useState(false);
  const menuRef = useRef(null);

  const activeSort = _params.price_order || "all";
  const hasActiveFilters = _params.min_price || _params.max_price || _params.price_order;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync price inputs with URL params
  useEffect(() => {
    setPrice({
      min: _params.min_price || "",
      max: _params.max_price || "",
    });
  }, [params]);

  const onInputChange = (e) => {
    setPrice({ ...price, [e.target.name]: e.target.value });
  };

  const onPriceInputSubmit = (e) => {
    e.preventDefault();
    setParams({ ..._params, min_price: price.min, max_price: price.max });
    setMenuActive(false);
  };

  const setSortOrder = (order) => {
    setParams({ ..._params, price_order: order });
    setMenuActive(false);
  };

  const clearFilters = () => {
    const { min_price, max_price, price_order, ...rest } = _params;
    setParams(rest);
    setPrice({ min: "", max: "" });
  };

  const sortOptions = [
    { key: "all", label: "Best Match" },
    { key: "low_to_high", label: "Price: Low to High" },
    { key: "high_to_low", label: "Price: High to Low" },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setMenuActive(!menuActive)}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
          border transition-all duration-200
          ${menuActive
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
          }
          ${hasActiveFilters ? "ring-2 ring-red-500 ring-offset-1" : ""}
        `}
      >
        <AiOutlineControl className="w-4 h-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="flex items-center justify-center w-4 h-4 text-xs bg-red-500 text-white rounded-full leading-none">
            ●
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <Transition
        as={Fragment}
        show={menuActive}
        enter="transition ease-out duration-150"
        enterFrom="transform opacity-0 scale-95 -translate-y-1"
        enterTo="transform opacity-100 scale-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="transform opacity-100 scale-100 translate-y-0"
        leaveTo="transform opacity-0 scale-95 -translate-y-1"
      >
        <div className="absolute right-0 mt-2 w-72 origin-top-right z-30 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-900 tracking-wide uppercase">
              Filters
            </span>
            <button
              onClick={() => setMenuActive(false)}
              className="text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none"
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-5">
            {/* Sort Options */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Sort By
              </p>
              <div className="space-y-1">
                {sortOptions.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setSortOrder(key)}
                    className={`
                      w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                      ${activeSort === key
                        ? "bg-gray-900 text-white font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    {activeSort === key && <span className="text-xs">✓</span>}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Price Range */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Price Range
              </p>
              <form onSubmit={onPriceInputSubmit}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Min"
                      name="min"
                      min={0}
                      className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      value={price.min}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Max"
                      name="max"
                      min={0}
                      className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      value={price.max}
                      onChange={onInputChange}
                    />
                  </div>
                </div> <br />
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-2  rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
                >
                  Apply Price
                </button>
              </form>
            </div>
          </div>

          {/* Clear Filters Footer */}
          {hasActiveFilters && (
            <div className="px-4 pb-4 pt-1">
              <button
                onClick={clearFilters}
                className="w-full text-center text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </Transition>
    </div>
  );
};

export default FilterModal;