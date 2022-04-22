import React from "react";

const SideBar = () => {
  return (
    <div className="border rounded pt-5 space-y-5">
      <div className="px-5 flex items-center space-x-2">
        <div>
          <img
            src="noUser.png"
            alt="noUser"
            className="rounded-full w-12 h-12"
          />
        </div>
        <div>
          <div className="text-sm font-light">Owner</div>
          <div className="text-sm font-medium">Ram Timalsina</div>
        </div>
      </div>
      <div className="grid">
        <a href="myProfile" className="px-5 py-3 hover:bg-gray-200">
          Dashboard
        </a>
        <a href="/" className="px-5 py-3 hover:bg-gray-200">
          Featured Property
        </a>
        <a href="propertyDemand" className="px-5 py-3 hover:bg-gray-200">
          Property Demand
        </a>
        <a
          href="postProperty"
          className="px-5 py-3 hover:bg-gray-100 bg-gray-100"
        >
          Post Property
        </a>
        <a href="requirementForm" className="px-5 py-3 hover:bg-gray-200">
          Requirement Form
        </a>
      </div>
    </div>
  );
};

export default SideBar;
