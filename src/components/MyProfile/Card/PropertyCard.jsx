import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaSpinner, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../../../utils/apiClient";

const PropertyCard = ({data,action}) => {
  const [loading,setLoading] = useState(false);
  const [id, setId] = useState(null);
  const removeFromFavorite = async (id) => {
    setId(id);
    setLoading(true);
    await apiClient.post('/remove-from-favourite',{property_id:id}).then(res=>{
      if(res.status === 200){
       
          action();
          setLoading(false);
          setId(null)
          toast.success("Removed from favorite list");
          
      }else{
        setLoading(false);
        setId(null)
        toast.error("Failed to remove from favorite list");
      }
    }).catch(err => {
      setLoading(false);
      setId(null)
      console.error(err)
    })
  }
  return (
    <div className="grid sm:grid-cols-5 items-center border border-gray-200 shadow-xl rounded overflow-hidden mb-6 relative">
      <img
        src={data?.feature_image}
        alt="/fetured/unsplash_178j8tJrNlc"
        className="w-full h-full sm:col-span-2"
      />
      <div className="p-5 sm:col-span-3  space-y-4 text-sm lg:text-base">
        <div className="flex items-center space-x-3">
          <FaUserCircle className="text-red-700 w-10 h-10" />
          <div className="flex flex-col">
            <span className="text-xs">Posted By</span>
            <div>
              <span className="capitalize  text-sm">{data?.posted_by}</span> <span className="text-gray-400 italic text-xs">- Posted on <strong>{data?.posted_date}</strong></span>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="font-bold text-lg relative pr-24">{data?.name}</span>
            <div className="w-8 h-8 cursor-pointer" onClick={()=>removeFromFavorite(data?.property_id)}>
              {true ? (
                <FaHeart className="w-8 h-8 text-red-700" />
              ) : (
                <FaRegHeart className="w-8 h-8 text-red-700" />
              )}
            </div>
          </div>
          <div className="flex justify-between font-bold">
            <span>Rs. {data?.total_price?data?.total_price:'N/A'}</span>
            {data?.land_area_in_sqft_according_to_lal_purja && <span>{data?.land_area_in_sqft_according_to_lal_purja} sq.ft.</span>}
          </div>
        </div>

        {data?.property_location && <div className="font-light">{data?.property_location}</div>}
        <div className="flex justify-end">
          <Link
            to={`/property/${data?.property_id}`}
            className="text-white px-3 py-2 rounded bg-red-700"
          >
            View Property
          </Link>
        </div>
      </div>
     {loading && id === data?.property_id &&  <div className="absolute top-0 left-0 h-full w-full z-10">
        <div className="bg-white opacity-90 h-full w-full"></div>
        <div className="flex items-center justify-center h-full w-full absolute left-0 top-0">
                <FaSpinner className="spin text-red-500 h-8 w-8"/>
        </div>
      </div>
      }
    </div>
  );
};

export default PropertyCard;
