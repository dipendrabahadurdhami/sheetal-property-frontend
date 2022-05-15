import React from "react";
import { FiHeart, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const FearuredCard = ({ product }) => {
  let navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/property/${product.id}`);
      }}
      className="cursor-pointer h-full"
    >
      <div className="block w-full h-full relative bg-white rounded-xl shadow-lg border-2 border-gray-200">
        <div className="-mt-3 rounded px-3 py-0.5 font-semibold absolute top-0 bg-red-700 text-sm text-white uppercase">
          For {product.purpose}
        </div>
        <div className="rounded-md overflow-hidden">
          <img
            src={product.feature_image}
            alt="unsplash"
            className="w-full bg-center h-44 sm:h-48"
          />
          <div className="p-3 space-y-2 pb-7 text-xl font-light">
            <div className="flex justify-between ">
              <h1 className="font-medium text-normal text-gray-600 hover:text-red-500">{product.name}</h1>
              <div className="w-full h-6 ml-10" style={{maxWidth:'20px'}}>
                <FiHeart className="w-full h-full text-red-700" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Rs. {product.total_price} </span>
              <span className="font-medium">{product.land_according_to_measurements.land_area_in_sqft_measurements?product.land_according_to_measurements.land_area_in_sqft_measurements:'-'} sq.ft.</span>
            </div>
            <div className="text-gray-600 text-sm flex"><FiMapPin width={6} className="mr-2" style={{marginTop:'2px'}}/> {product.property_location}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FearuredCard;
