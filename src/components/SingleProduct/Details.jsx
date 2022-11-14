import React from "react";
import ProductMap from "./Details/ProductMap";
import RoadDetails from "./Details/RoadDetails";

const Details = ({ data }) => {
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-5 md:gap-10 lg:gap-16 py-5">
        <RoadDetails data={data} />
        <div>
          <ProductMap
            latitude={data.latitude}
            longitude={data.longitude}
            data={data}
          />
        </div>
      </div>
    </div>
  );
};

export default Details;
