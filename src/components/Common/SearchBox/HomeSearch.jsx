import React from "react";
import InputBox from "./InputBox";
import { useNavigate, useSearchParams } from "react-router-dom";
import { navigation } from "../header/navigation";

const Search = ({ setFilterModal, showFilters = true }) => {
  const [params] = useSearchParams();
  const query = params.get("tab");
  let navigate = useNavigate();

  return (
    <div>
      <div className="flex xl:w-4/5  sm:text-lg items-center justify-start font-bold overflow-x-auto">
        {navigation[0].subTitle.map((item, index) => (
          <button
            key={index}
            onClick={() =>
              navigate({
                pathname: "",
                search: `?tab=${item.title}`,
              })
            }
            className={`${
              query === item.title
                ? "bg-red-700 text-white rounded-t"
                : "text-white md:text-black"
            }   font-medium p-2 px-4 sm:px-6 min-w-max`}
          >
            {item.title}
          </button>
        ))}
      </div>
      <InputBox showFilters={showFilters} setFilterModal={setFilterModal} />
    </div>
  );
};

export default Search;
