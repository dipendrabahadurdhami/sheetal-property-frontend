import React from "react";
import ListBox from "../components/Common/ListBox";

const RequirementForm = () => {
  const TenantOption = [{ name: "Rent" }, { name: "Buy" }, { name: "Invest" }];
  const Vehicle = [
    { name: "Two Wheeler" },
    { name: "There Wheeler" },
    { name: "Four Wheeler" },
  ];
  const Requirements = [
    { name: "Room" },
    { name: "Flat" },
    { name: "House" },
    { name: "Apartment" },
  ];
  const Facilities = [{ name: "Rent" }, { name: "Buy" }, { name: "Invest" }];
  return (
    <div className="flex justify-center px-5 py-10 sm:p-5 lg:p-10 xl:p-24">
      <div className="w-full">
        <h1 className="text-3xl font-bold w-full text-center  pb-10">
          Requirement Form{" "}
        </h1>
        <form className="space-y-5">
          <label className="flex flex-col space-y-2">
            <span>Name *</span>
            <input
              type="text"
              className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
              placeholder="Enter your name"
            />
          </label>
          <label className="flex flex-col space-y-2">
            <span>Temporary Address *</span>
            <input
              type={"text"}
              className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
              placeholder="Enter your temporary address"
            />
          </label>
          <label className="flex flex-col space-y-2">
            <span>Permanent Address *</span>
            <input
              type={"text"}
              className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
              placeholder="Enter your permanent address"
            />
          </label>
          <label className="flex flex-col space-y-2">
            <span>Contact number *</span>
            <input
              type={"Number"}
              className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
              placeholder="Enter your contact number"
            />
          </label>
          <label className="flex flex-col space-y-2">
            <span>Email Address *</span>
            <input
              type={"email"}
              className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
              placeholder="Enter your email address"
            />
          </label>
          <label className="flex flex-col space-y-2">
            <span>Occupation *</span>
            <input
              className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
              placeholder="Enter your email address"
            />
          </label>
          <label className="flex flex-col space-y-2">
            <span>Preferred location</span>
            <input
              className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
              placeholder="Enter your preferred location"
            />
          </label>
          <label className="flex flex-col space-y-2">
            <span>Maximum budget</span>
            <input
              className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
              placeholder="Enter your maximum budget"
            />
          </label>

          <label className="flex flex-col space-y-2">
            <span>Tenant option</span>
            <ListBox list={TenantOption} />
          </label>
          <label className="flex flex-col space-y-2">
            <span>Requirements</span>
            <ListBox list={Requirements} />
          </label>
          <label className="flex flex-col space-y-2">
            <span>Vehicle</span>
            <ListBox list={Vehicle} />
          </label>
          <label className="flex flex-col space-y-2">
            <span>Facilities</span>
            <select
              multiple
              className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
            >
              <option>jsdn</option>
              <option>jsdn</option>
              <option>jsdn</option>
              <option>jsdn</option>
            </select>
          </label>

          <label className="flex flex-col space-y-2">
            <span> Description (if any)</span>
            <textarea
              rows={7}
              className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
              placeholder="Enter your name"
            />
          </label>
          <button className="bg-red-700 px-10 md:px-24  p-3 font-bold text-white rounded-lg">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequirementForm;
