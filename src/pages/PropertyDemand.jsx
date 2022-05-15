import axios from "axios";
import React, { useEffect, useState } from "react";
import InputBox from "../components/Common/SearchBox/InputBox";
import PropertyDemandTable from "../components/PropertyDemandTable";

const PropertyDemand = () => {
  const [demand, setDemand] = useState([]);

  const displayDemand = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_LINK}/property-demand-list`
    );
    setDemand(res.data.data);
    console.log(res.data.data);
  };

  useEffect(() => {
    displayDemand();
  }, []);
  return (
    <div className="p-5 md:p-10 space-y-10">
      <div className="text-2xl font-bold">PropertyDemand</div>
      <div className="flex justify-center px-5 md:px-10">
        <div className="w-full xl:w-9/12 bg-white rounded p-3 xs:p-7  md:p-10 lg:space-y-5">
          <InputBox />
        </div>
      </div>
      <PropertyDemandTable demands={demand} />
    </div>
  );
};

export default PropertyDemand;
