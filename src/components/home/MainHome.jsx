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
    <div className="pt-20">
      <style>
        {`
          @keyframes fadeInfinite {
            0%, 3% { opacity: 0; transform: translateY(20px); }
            20%, 80% { opacity: 1; transform: translateY(0); }
            97%, 100% { opacity: 0; transform: translateY(20px); }
          }
          .animate-fade-infinite {
            animation: fadeInfinite 5s ease-in-out infinite;
          }
        `}
      </style>

      <div className="w-full h-72 md:h-96 overflow-hidden relative">
        <div className="absolute left-0 w-full h-full bg-black">
          
          <img
            src="/home-banner3.gif"
            alt=""
            className="w-full h-full mt-0 object-cover "
          />
        </div>
        
        <div className="relative w-full h-full flex flex-col justify-end items-center px-5 pb-16 bg-black/40">
          <h1 className="text-xs sm:text-xs md:text-3xl xl:text-4xl font-semibold  text-white text-center animate-fade-infinite">
            Leading Property Management Company
          </h1>
        </div>
      </div>

      <div className="px-5 md:px-10 flex justify-center relative">
        <div className="w-full xl:w-9/12 -mt-40 md:-mt-40 rounded md:shadow-xl">
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