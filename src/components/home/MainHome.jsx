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
    <div className="space-y-2 pb-20">
      <div
        className="w-full h-96 flex items-center justify-center bg-no-repeat bg-cover bg-center px-5"
        style={{
          backgroundImage: `url("349872.jpeg")`,
        }}
      >
        <h1 className="-mt-10 md:text-5xl text-xl sm:text-3xl font-semibold capitalize text-white">
          शितलता प्रदान गर्दै शितल रियल स्टेट
        </h1>
      </div>
      <div className="px-5 md:px-10 flex justify-center">
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
