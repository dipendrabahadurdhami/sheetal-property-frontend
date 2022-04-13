import { Slider } from "@material-ui/core";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const FormFilter = ({ setFilterModal }) => {
  const [value, setValue] = useState([10, 100]);
  const ImageThumb = (props) => {
    return (
      <span {...props}>
        <img
          src="https://picsum.photos/40/40"
          alt="loading"
          style={{ borderRadius: 20 }}
        />
      </span>
    );
  };

  return (
    <div className="space-y-8 py-8">
      <div className="space-y-6">
        <h1 className="font-bold text-lg">Property Status</h1>
        <div className="flex space-x-4 items-center text-sm">
          <button className="border rounded border-gray-400 p-3">
            All Status
          </button>
          <button className="border rounded border-gray-400 p-3">
            For Rent
          </button>
          <button className="border rounded border-gray-400 p-3">
            For Sale
          </button>
          <button className="border rounded border-gray-400 p-3">
            Investment
          </button>
          <button className="border rounded border-gray-400 p-3">
            Top Projects
          </button>
        </div>
      </div>
      <div className="space-y-6">
        <h1 className="font-bold text-lg">Property Types</h1>
        <div className="flex space-x-4 items-center text-sm overflow-x-scroll">
          <button className="border rounded border-gray-400 p-3 whitespace-nowrap">
            All Types
          </button>
          <button className="border rounded border-gray-400 p-3 whitespace-nowrap">
            Apartment
          </button>
          <button className="border rounded border-gray-400 p-3 whitespace-nowrap">
            Bungalow{" "}
          </button>
          <button className="border rounded border-gray-400 p-3 whitespace-nowrap">
            Commercial Building
          </button>
          <button className="border rounded border-gray-400 p-3 whitespace-nowrap">
            Commercial House
          </button>
          <button className="border rounded border-gray-400 p-3 whitespace-nowrap">
            Commercial Space
          </button>
          <button className="border rounded border-gray-400 p-3 whitespace-nowrap">
            Flat
          </button>
        </div>
      </div>
      <div>
        <div className="flex space-x-6 items-center">
          <span className="font-bold text-lg">Price Range</span>
          <span className="text-gray-500">(Rs.500 - Rs.500,000)</span>
        </div>
        <div className="grid grid-cols-2 gap-5 items-center">
          <div>
            <Slider
              value={value}
              thumb={{
                height: 40,
                backgroundImage: `url("https://picsum.photos/40/40")`,
                width: 40,
                backgroundColor: "#fff",
                marginTop: -20,
                marginLeft: -20,
              }}
              aria-label="Default"
              onChange={(e, data) => setValue(data)}
              style={{
                color: "#B91C1B",
                height: 3,
                padding: "13px 0",
              }}
              min={10}
              max={100}
            />
          </div>
          <input
            type="text"
            className="w-full p-3 border border-gray-400 rounded"
            placeholder="Property ID"
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-400 rounded"
            placeholder="Min Area (Anna, Dhur)"
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-400 rounded"
            placeholder="Max Area (Anna, Dhur)"
          />
        </div>
      </div>
      <div className="space-y-6">
        <div className="">
          <span className="font-bold text-lg">Features</span>
        </div>
        <div className="grid grid-cols-4 gap-y-5 gap-x-2 items-center text-sm">
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Air Conditioner</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Advanced Lift</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Aluminum Partition</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Backup Generator</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Backup Solar</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Balcony</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Balcony</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Balcony</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Barbeque</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>CCTV</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>COMMUNITY HALL</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Drainage</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Drinking water supply</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Dryer</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Electricity</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Electricity Backup</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          className="text-white p-3 bg-red-700 font-medium flex items-center rounded space-x-2"
          onClick={() => setFilterModal(false)}
        >
          <span>Search</span>
          <FaSearch className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FormFilter;
