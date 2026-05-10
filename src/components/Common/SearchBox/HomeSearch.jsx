import React from "react";
import InputBox from "./InputBox";
import { useNavigate, useSearchParams } from "react-router-dom";
import { navigation } from "../header/navigation";

const HomeSearch = ({ setFilterModal, showFilters = true }) => {
  const [params] = useSearchParams();
  const query    = params.get("tab");
  const navigate = useNavigate();

  const tabs = navigation[0]?.subTitle ?? [];

  return (
    <div className="w-full">
      {/* ── Property type tabs ── */}
      <div className="flex items-end overflow-x-auto scrollbar-hide">
        {tabs.map((item, index) => {
          const isActive = query === item.title;
          return (
            <button
              key={index}
              onClick={() =>
                navigate({ pathname: "", search: `?tab=${item.title}` })
              }
              className={`
                relative min-w-max px-5 py-2.5 text-sm font-semibold
                transition-all duration-150 rounded-t-lg
                ${isActive
                  ? "bg-white text-red-600 shadow-sm z-10"
                  : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                }
              `}
            >
              {item.title}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Search input ── */}
      <div className="bg-white rounded-b-xl rounded-tr-xl shadow-lg">
        <InputBox showFilters={showFilters} setFilterModal={setFilterModal} />
      </div>
    </div>
  );
};

export default HomeSearch;