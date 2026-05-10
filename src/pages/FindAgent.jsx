import axios from "axios";
import React, { useEffect, useState } from "react";
import AgentSearch from "../components/Common/SearchBox/AgentSearch";
import AgentList from "../components/findAgent/AgentList";
import Loader from "../components/Loader";
import headTag from "../headTag";

var PAGE_SIZE = 10;

const matchesFilter = (agent, term) => {
  if (!term) return true;
  const t = term.toLowerCase();
  return [
    agent.first_name,
    agent.last_name,
    agent.email,
    agent.phone,
    agent.mobile,
    agent.city,
    agent.state,
    agent.country,
    agent.address_1,
    agent.address_2,
    agent.company_name,
    agent.company_address,
    agent.company_phone,
    agent.company_mobile,
    agent.designation,
    agent.occupation,
    agent.user_name,
  ]
    .filter(Boolean)
    .some((field) => field.toLowerCase().includes(t));
};

const FindAgent = () => {
  const [filter,       setFilter]       = useState("");
  const [agents,       setAgents]       = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [filterAgents, setFilterAgents] = useState([]);
  const [page,         setPage]         = useState(1);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_LINK}/agent-list`
      );
      if (res.status === 200) {
        setAgents(res.data.data);
        setFilterAgents(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch agents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    headTag({ title: "Find Agent", content: "" });
  }, []);

  // Reset to page 1 whenever filter changes
  useEffect(() => {
    setFilterAgents(
      agents.filter((agent) => matchesFilter(agent, filter))
    );
    setPage(1);
  }, [filter, agents]);

  // Pagination calculations
  const totalPages = Math.ceil(filterAgents.length / PAGE_SIZE);
  const start      = (page - 1) * PAGE_SIZE;
  const end        = start + PAGE_SIZE;
  const pageAgents = filterAgents.slice(start, end);

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

  return (
    <div className="py-6 px-4 mt-40 sm:px-5 lg:p-10 space-y-5 md:space-y-8 max-w-[1440px] mx-auto">

      {/* ── Page title ── */}
      <div className="text-xl font-bold">
        Real Estate Agents in{" "}
        <span className="text-red-600">Sheetal Real Estate</span>
      </div>

      {/* ── Search ── */}
      <AgentSearch
        filter={filter}
        onAgentSearch={setFilter}
        totalAgents={agents.length}
        filteredCount={filterAgents.length}
      />

      {/* ── Results ── */}
      {loading ? (
        <div className="flex py-2 justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {/* Result info bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1">
            {filter ? (
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-bold text-gray-800">{filterAgents.length}</span>{" "}
                {filterAgents.length === 1 ? "agent" : "agents"} for{" "}
                <span className="font-bold text-red-600">"{filter}"</span>
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                <span className="font-bold text-gray-800">{filterAgents.length}</span> agents available
              </p>
            )}
            {filterAgents.length > 0 && (
              <p className="text-xs text-gray-400">
                Page <span className="font-semibold text-gray-600">{page}</span> of{" "}
                <span className="font-semibold text-gray-600">{totalPages}</span>
              </p>
            )}
          </div>

          {/* Agent list */}
          <AgentList agents={pageAgents} />

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-3 border-t border-gray-100">

              {/* Count */}
              <p className="text-xs text-gray-500 whitespace-nowrap">
                Showing{" "}
                <span className="font-bold text-gray-700">{start + 1}</span>
                {" – "}
                <span className="font-bold text-gray-700">{Math.min(end, filterAgents.length)}</span>
                {" of "}
                <span className="font-bold text-gray-700">{filterAgents.length}</span>
                {" agents"}
              </p>

              {/* Page buttons */}
              <div className="flex items-center gap-1 flex-wrap justify-center">

                {/* Prev */}
                <button
                  onClick={() => goTo(page - 1)}
                  disabled={page === 1}
                  className="flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Prev
                </button>

                {/* Page numbers */}
                {getPages().map(function(p, idx){
                  if (p === "...") {
                    return (
                      <span key={"dot" + idx} className="px-2 text-xs text-gray-400 font-medium">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => goTo(p)}
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

                {/* Next */}
                <button
                  onClick={() => goTo(page + 1)}
                  disabled={page === totalPages}
                  className="flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>

              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FindAgent;