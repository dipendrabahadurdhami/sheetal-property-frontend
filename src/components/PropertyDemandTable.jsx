import { Disclosure } from "@headlessui/react";
import React, { useState } from "react";

var PAGE_SIZE = 10;

const PropertyDemandTable = ({ demands }) => {
  var page_state = useState(1);
  var page = page_state[0];
  var setPage = page_state[1];

  if (!demands || demands.length === 0) return null;

  var totalPages = Math.ceil(demands.length / PAGE_SIZE);
  var start = (page - 1) * PAGE_SIZE;
  var end = start + PAGE_SIZE;
  var paginated = demands.slice(start, end);

  function goTo(p) {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getPages() {
    var pages = [];
    if (totalPages <= 5) {
      for (var i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (var j = Math.max(2, page - 1); j <= Math.min(totalPages - 1, page + 1); j++) {
        pages.push(j);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }

  var Pagination = (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/60">
      <p className="text-xs text-gray-500 whitespace-nowrap">
        Showing{" "}
        <span className="font-bold text-gray-700">{start + 1}</span>
        {" – "}
        <span className="font-bold text-gray-700">{Math.min(end, demands.length)}</span>
        {" of "}
        <span className="font-bold text-gray-700">{demands.length}</span>
        {" results"}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={function(){ goTo(page - 1); }}
          disabled={page === 1}
          className="flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Prev
        </button>
        {getPages().map(function(p, idx){
          if (p === "...") {
            return (
              <span key={"dot" + idx} className="px-2 text-xs text-gray-400 font-medium">...</span>
            );
          }
          return (
            <button
              key={p}
              onClick={function(){ goTo(p); }}
              className={
                p === page
                  ? "w-8 h-8 text-xs font-bold rounded-lg bg-red-700 text-white border border-red-700"
                  : "w-8 h-8 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 transition-all"
              }
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={function(){ goTo(page + 1); }}
          disabled={page === totalPages}
          className="flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto w-full">

      {/* ── MOBILE: Card layout (hidden on md+) ── */}
      <div className="block md:hidden space-y-3 px-2">
        {paginated.map(function(person, i){
          return (
            <div key={i} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

              {/* Card header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold">
                  {person.requirement || "—"}
                </span>
                {person.tenant_option && (
                  <span className="inline-flex px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                    {person.tenant_option}
                  </span>
                )}
              </div>

              {/* Card body */}
              <div className="px-4 py-3 space-y-2.5">

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Location</p>
                    <p className="text-sm text-gray-700 font-medium">{person.prefered_location || "—"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Budget</p>
                    <p className="text-sm font-bold text-green-700">{person.maximum_budget || "—"}</p>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Vehicle</p>
                    <p className="text-sm text-gray-600">{person.vehicles || "—"}</p>
                  </div>
                </div>

                {person.facilities && person.facilities.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Facilities</p>
                    <Disclosure>
                      {function(dp){
                        var open = dp.open;
                        return (
                          <div>
                            <div className="flex flex-wrap gap-1.5">
                              {person.facilities.slice(0, 3).map(function(fac, idx){
                                return (
                                  <span key={idx} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                    {fac.name ? fac.name : fac}
                                  </span>
                                );
                              })}
                              {open && person.facilities.slice(3).map(function(fac, idx){
                                return (
                                  <Disclosure.Panel key={idx} as="span" className="inline-block">
                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                      {fac.name ? fac.name : fac}
                                    </span>
                                  </Disclosure.Panel>
                                );
                              })}
                            </div>
                            {person.facilities.length > 3 && (
                              <Disclosure.Button className="mt-1.5 text-xs font-semibold text-red-600 hover:text-red-800">
                                {open ? "See Less" : "+" + (person.facilities.length - 3) + " more"}
                              </Disclosure.Button>
                            )}
                          </div>
                        );
                      }}
                    </Disclosure>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Mobile pagination */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          {Pagination}
        </div>
      </div>

      {/* ── DESKTOP: Table layout (hidden on mobile) ── */}
      <div className="hidden md:block sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200" style={{ minWidth: "700px" }}>

                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Requirement
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Preferred Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{ width: "180px" }}>
                      Maximum Budget
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Tenant Option
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Vehicles
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Facilities
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                  {paginated.map(function(person, i){
                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors duration-100">

                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">
                            {person.requirement || "—"}
                          </span>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {person.prefered_location || "—"}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-xs font-semibold text-green-700">
                            {person.maximum_budget || "—"}
                          </span>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          {person.tenant_option ? (
                            <span className="inline-flex px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                              {person.tenant_option}
                            </span>
                          ) : "—"}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {person.vehicles || "—"}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          {!person.facilities || person.facilities.length === 0 ? (
                            <span className="text-gray-400 text-xs">—</span>
                          ) : (
                            <Disclosure>
                              {function(dp){
                                var open = dp.open;
                                return (
                                  <ul className="list-disc pl-4 space-y-0.5">
                                    <li className="text-xs text-gray-700">
                                      {person.facilities[0] && person.facilities[0].name ? person.facilities[0].name : person.facilities[0]}
                                    </li>
                                    {person.facilities[1] && (
                                      <li className="text-xs text-gray-700">
                                        {person.facilities[1].name ? person.facilities[1].name : person.facilities[1]}
                                      </li>
                                    )}
                                    {person.facilities.slice(2).map(function(fac, index){
                                      return (
                                        <Disclosure.Panel key={index} className={open ? "block" : "hidden"}>
                                          <li className="text-xs text-gray-700">{fac.name ? fac.name : fac}</li>
                                        </Disclosure.Panel>
                                      );
                                    })}
                                    {person.facilities.length > 2 && (
                                      <Disclosure.Button className="text-left text-red-600 hover:text-red-800 text-xs font-semibold mt-1">
                                        {open ? "See Less" : "+" + (person.facilities.length - 2) + " more"}
                                      </Disclosure.Button>
                                    )}
                                  </ul>
                                );
                              }}
                            </Disclosure>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {Pagination}
          </div>
        </div>
      </div>

    </div>
  );
};

export default PropertyDemandTable;