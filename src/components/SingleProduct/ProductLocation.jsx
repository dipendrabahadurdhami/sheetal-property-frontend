import React from "react";
import { GrLocation } from "react-icons/gr";

const ProductLocation = ({ property }) => {
  return (
    <div>
      <div className="text-lg sm:text-2xl font-bold">{property.name}</div>
      <div className="flex space-x-2 text-xs sm:text-sm">
        <span>{property.property_location} | </span>
        <a href="/" className="flex items-center space-x-2 text-red-700">
          <GrLocation className="w-4 h-4 text-red-700" />
          <span className="border-b border-red-700">Show on Map</span>
        </a>
      </div>
    </div>
  );
};

export default ProductLocation;
