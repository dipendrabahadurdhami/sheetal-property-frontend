import React, { useState } from "react";
import Search from "../Common/SearchBox/HomeSearch";
import Model from "../FilterSearch/Model";
import AdviceTools from "./AdviceTools";
import Featured from "./Featured";
import Property from "./Property";
import { TopProjects } from "./TopProjects";

const MainHome = () => {
  const [filterModal, setFilterModal] = useState(false);
  return (
    <div className="space-y-2 pb-20">
      <div
        className="w-full h-72 flex items-center justify-center bg-no-repeat bg-cover bg-center px-5"
        style={{
          backgroundImage: `url("349872.jpeg")`,
        }}
      >
        <h1 className="-mt-10 md:text-5xl text-xl sm:text-3xl font-semibold capitalize text-white">
          Search Nepal’s home of property
        </h1>
      </div>
      <div className="px-5 md:px-10 flex justify-center">
        <div className="w-full xl:w-9/12 -mt-40 md:-mt-32 md:bg-white rounded md:shadow-xl md:border border-gray-100 md:p-5 lg:p-10">
          <Search setFilterModal={setFilterModal} />
        </div>
      </div>
      <Featured />
      <Property />
      <TopProjects />
      <AdviceTools />
      {filterModal && (
        <Model setFilterModal={setFilterModal} filterModal={filterModal} />
      )}
    </div>
  );
};

export default MainHome;
