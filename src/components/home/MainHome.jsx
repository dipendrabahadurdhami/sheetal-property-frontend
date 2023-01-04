import React, { useState } from "react";
import Search from "../Common/SearchBox/HomeSearch";
import Model from "../FilterSearch/Model";
import Featured from "./Featured";
import Investment from "./Investment";
import LatestProperties from "./LatestProperties";
import "react-multi-carousel/lib/styles.css";

const MainHome = () => {
  const [filterModal, setFilterModal] = useState(false);

  return (
    <div className="space-y-2 pb-10">
      <div className="w-full h-72 md:h-96 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-black">
          <img
            src="/home-banner1.gif"
            alt=""
            className="w-full h-full object-cover lg:hidden"
          />
          <img
            src="/home-banner2.gif"
            alt=""
            className="w-full h-full object-cover hidden lg:block xl:hidden"
          />
          <img
            src="/home-banner3.gif"
            alt=""
            className="w-full h-full object-cover hidden xl:block"
          />
        </div>
        <div className="relative w-full h-full flex items-center justify-center px-5 bg-black bg-opacity-40">
          <h1 className="-mt-10 text-xl sm:text-3xl md:text-4xl xl:text-5xl font-semibold capitalize text-white text-center">
            Leading Property Management Company
          </h1>
        </div>
      </div>
      <div className="px-5 md:px-10 flex justify-center relative">
        <div className="w-full xl:w-9/12 -mt-40 md:-mt-40  rounded md:shadow-xl">
          <Search setFilterModal={setFilterModal} />
        </div>
      </div>
      <Featured />
      <Investment />
      <LatestProperties />
      {filterModal && (
        <Model setFilterModal={setFilterModal} filterModal={filterModal} />
      )}
    </div>
  );
};

export default MainHome;
