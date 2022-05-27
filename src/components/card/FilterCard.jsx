import React from "react";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { product } from "../Object/product";

const FilterCard = ({ property }) => {
  let navigate = useNavigate();
  console.log("Propertyy", property);
  return (
    <div
      
      className="cursor-pointer"
    >
      <div className="grid sm:grid-cols-3 lg:grid-cols-4 w-full relative bg-white rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
        <div>
          <div className="rounded-b px-3 py-0.5 font-semibold absolute top-0 bg-red-700 text-sm text-white uppercase">
            For {property.purpose}
          </div>
          <img
            src={property?.feature_image}
            alt="unsplash"
            className="w-full bg-center h-full bg-cover"
          />
        </div>
        <div className="rounded-md overflow-hidden sm:col-span-2 lg:col-span-3">
          <div className="p-5 sm:p-7 xl:pr-10 space-y-5 font-light">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-bold text-gray-600 text-xl">
                  {property?.title}
                </h1>
                <h1 className="text-sm">from {property?.property_location?property?.property_location:'N/A'} </h1>
              </div>
              <FiHeart className="w-8 h-8 text-red-700" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-5">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Price</span>
                <span className="font-medium">Rs. {property?.total_price?property?.total_price:'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Property Category</span>
                <span className="font-medium">
                  {
                    property?.property_category?property?.property_category:'N/A'
                  }
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Property Type</span>
                <span className="font-medium">{product?.property_type?product?.property_type:'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Purpose</span>
                <span className="font-medium">{product?.purpose?product?.purpose:'N/A'}</span>
              </div>
            </div>
            <div className="flex  justify-end">
              <button className="bg-red-700 rounded text-white font-medium px-5 py-2 w-full sm:w-auto" onClick={() => navigate("/property/"+property.id)}>
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterCard;
