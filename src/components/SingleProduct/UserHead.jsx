import React from "react";
import { BiUserCircle } from "react-icons/bi";

const UserHead = ({ setOpen, property }) => {
  return (
    <div className="bg-white shadow border-b border-gray-200">
      <div className=" container mx-auto py-3 px-5  flex  justify-between items-center ">
        <div className="flex items-center space-x-3">
          <BiUserCircle className="w-10 h-10 font-light text-gray-500" />
          <div className="hidden sm:flex flex-col -space-y-1">
            <span className=" text-sm text-gray-500">Posted By</span>
            <div>
              <span className="text-sm sm:text-base sm:font-semibold">
                  {property?.posted_by} 
              </span>
              <span className="text-xs text-gray-400"> - Posted on: <strong>{property?.posted_date}</strong></span>
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={() => setOpen(true)}
            className="text-red-700 border-b-2 border-red-700 pb-2 font-bold"
          >
            Contact Now
          </button>
        </div>
    
      </div>
    </div>
  );
};

export default UserHead;
