import React from "react";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const FearuredCard = ({ product }) => {
  let navigate = useNavigate();

  return (
    <button
      onClick={() => {
        navigate({
          pathname: "/property",
          search: `?tab=${product.name}`,
        });
      }}
    >
      <div className="block w-full xs:w-64 sm:w-80 relative bg-white rounded-xl shadow-lg border-2 border-gray-200">
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
            <div className="flex justify-between items-center">
              <h1 className="font-light text-gray-600">{product.name}</h1>
              <FiHeart className="w-6 h-6 text-red-700" />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Rs. {product.total_price} Cr.</span>
              <span className="font-medium">2025 sq.ft</span>
            </div>
            <div className="text-gray-600">{product.property_location}</div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default FearuredCard;
