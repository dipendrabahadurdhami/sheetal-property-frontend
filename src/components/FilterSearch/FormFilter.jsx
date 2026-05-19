import { Slider } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import apiClient from "../../utils/apiClient";

const FormFilter = ({ setFilterModal, setAction }) => {
  const [price, setPrice] = useState([500, 50_00_000]);
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState(null);

  const [purpose, setPurpose] = useState("all");
  const [property_type, setProperty_type] = useState("all");
  const [date_from, setDateFrom] = useState("");
  const [date_to, setDateTo] = useState("");

  const fetchAllProperties = async () => {
    setLoading(true);
    await apiClient
      .get("/property-attributes")
      .then((res) => {
        if (res.status === 200) {
          setProperties(res.data.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const onPriceInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "min") {
      setPrice([Number(value), price[1]]);
    } else {
      setPrice([price[0], Number(value)]);
    }
  };

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const onSearchButtonClick = () => {
    const data = {
      min_price: price[0],
      max_price: price[1],
      property_type: property_type,
      advertisement_purpose: purpose,
      date_from: date_from,
      date_to: date_to,
    };
    setAction(data);
  };

  return (
    <div className="space-y-8 py-8">
      <div className="space-y-6">
        <h2 className="text-xl font-bold border-b border-gray-300 mb-4">
          Filters
        </h2>
        {properties && properties?.purposes && (
          <div>
            <h1 className="font-bold text-lg mb-4">Property Status</h1>
            <div className="text-sm flex flex-wrap -mx-2">
              <div className="px-2 mb-14">
                <button
                  className={`border rounded p-3 mb-4 ${
                    purpose === "all"
                      ? "bg-red-500 border-red-500 text-white"
                      : "border-gray-400"
                  }`}
                  onClick={() => setPurpose("all")}
                >
                  All Status
                </button>
              </div>
              {properties?.purposes.length > 0 &&
                properties?.purposes.map((_purpose, i) => (
                  <div className="px-2 mb-14" key={i}>
                    <button
                      className={`border rounded p-3 mb-4 ${
                        purpose === _purpose?.name
                          ? "bg-red-500 border-red-500 text-white"
                          : "border-gray-400"
                      }`}
                      onClick={() => setPurpose(_purpose?.name)}
                    >
                      {_purpose?.name}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {properties && properties?.property_types && (
        <div className="space-y-6">
          <h1 className="font-bold text-lg">Property Types</h1>
          <div className="flex -mx-2 items-center text-sm flex-wrap">
            <div className="px-2 mb-14">
              <button
                className={`border rounded p-3 whitespace-nowrap ${
                  property_type === "all"
                    ? "bg-red-500 border-red-500 text-white"
                    : "border-gray-400"
                }`}
                onClick={() => setProperty_type("all")}
              >
                All Types
              </button>
            </div>
            {properties?.property_types.length > 0 &&
              properties?.property_types.map((property, i) => (
                <div className="px-2 mb-14" key={i}>
                  <button
                    className={`border rounded p-3 whitespace-nowrap ${
                      property_type === property?.name
                        ? "bg-red-500 border-red-500 text-white"
                        : "border-gray-400"
                    }`}
                    onClick={() => setProperty_type(property?.name)}
                  >
                    {property?.name}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="space-x-2 items-center">
        <span className="font-bold text-lg">Price Range</span>
        <span className="text-gray-500">(Rs.5000 - Rs.5,00,00,000)</span>
      </div>
      <div className="items-center">
        <div>
          <Slider
            value={price}
            getAriaLabel={(index) =>
              index === 0 ? "Minimum price" : "Maximum price"
            }
            onChange={(e, data) => setPrice(data)}
            style={{ color: "#B91C1B", height: 5, padding: "13px 0" }}
            min={0}
            max={5_00_00_000}
          />
          <div className="flex flex-wrap -mx-2">
            <div className="px-2 w-6/12">
              <label className="block text-sm">Minimum</label>
              <input
                type="text"
                name="min"
                value={price[0]}
                className="border border-gray-300 py-2 px-2 w-full rounded-sm"
                onChange={onPriceInputChange}
              />
            </div>
            <div className="px-2 w-6/12">
              <label className="block text-sm">Maximum</label>
              <input
                type="text"
                name="max"
                value={price[1]}
                className="border border-gray-300 py-2 px-2 w-full rounded-sm"
                onChange={onPriceInputChange}
              />
            </div>
          </div>
        </div>
        <input type="text" className="w-full p-3 border border-gray-400 rounded hidden" placeholder="Property ID" />
        <input type="text" className="w-full p-3 border border-gray-400 rounded hidden" placeholder="Min Area (Anna, Dhur)" />
        <input type="text" className="w-full p-3 border border-gray-400 rounded hidden" placeholder="Max Area (Anna, Dhur)" />
      </div>

      <div className="space-y-6 hidden">
        <div>
          <span className="font-bold text-lg">Features</span>
        </div>
        <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-5 gap-x-2 items-center text-sm">
          {[
            "Air Conditioner","Advanced Lift","Aluminum Partition","Backup Generator",
            "Backup Solar","Balcony","Balcony","Balcony","Barbeque","CCTV",
            "COMMUNITY HALL","Drainage","Drinking water supply","Dryer",
            "Electricity","Electricity Backup",
          ].map((f, i) => (
            <div className="flex space-x-4 items-center" key={i}>
              <input type="checkbox" className="w-5 h-5 border border-red-900" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Posted Date Range ── */}
      <div>
        <h1 className="font-bold text-lg mb-4">Posted Date Range</h1>
        <div className="flex flex-wrap -mx-2">
          <div className="px-2 w-6/12">
            <label className="block text-sm mb-1">From</label>
            <input
              type="date"
              value={date_from}
              max={date_to || undefined}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-gray-300 py-2 px-2 w-full rounded-sm"
            />
          </div>
          <div className="px-2 w-6/12">
            <label className="block text-sm mb-1">To</label>
            <input
              type="date"
              value={date_to}
              min={date_from || undefined}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-gray-300 py-2 px-2 w-full rounded-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <button
          className="text-white p-3 bg-red-700 font-medium flex items-center rounded space-x-2 px-5"
          onClick={onSearchButtonClick}
        >
          <span>Search</span>
          <FaSearch className="w-4 h-4 mb-1" />
        </button>
      </div>
    </div>
  );
};

export default FormFilter;