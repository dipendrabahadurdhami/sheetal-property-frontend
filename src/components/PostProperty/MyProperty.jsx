import React from "react";

const MyProperty = () => {
  return (
    <div className="sm:p-5 sm:border rounded-lg sm:space-y-5">
      <div className="text-xl font-medium">My property is : </div>
      <div className="sm:flex items-center sm:space-x-5">
        <label className="flex items-center space-x-3">
          <input type={"checkbox"} className="border-red-500 w-4 h-4" />
          <span className="font-light">Apartment</span>
        </label>
        <label className="flex items-center space-x-3">
          <input type={"checkbox"} className="border-red-500 w-4 h-4" />
          <span className="font-light ">Land</span>
        </label>
        <label className="flex items-center space-x-3">
          <input type={"checkbox"} className="border-red-500 w-4 h-4" />
          <span className="font-light">Building</span>
        </label>
      </div>
    </div>
  );
};

export default MyProperty;
