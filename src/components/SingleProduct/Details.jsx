import React from "react";
import ProductMap from "./Details/ProductMap";
import RoadDetails from "./Details/RoadDetails";
import { IoWaterOutline } from "react-icons/io5";
import { GiElectric } from "react-icons/gi";
import {
  RiParkingBoxLine,
  RiEarthquakeLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import { BsFlower3, BsPeace } from "react-icons/bs";

const Details = ({data}) => {
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-5 md:gap-10 lg:gap-16 py-5">
        <RoadDetails />
        <div>
          <ProductMap latitude={data.latitude} longitude={data.longitude}/>
        </div>
      </div>
      <div>
        <div className="space-y-4 py-5">
          <div className="space-y-4">
            <div className="text-red-700 font-medium">Facility</div>
            <ul className="font-light text-sm space-y-2 grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <li className="flex space-x-1 items-center">
                <IoWaterOutline className="w-4 h-4" />
                <span>Drinking Water</span>
              </li>
              <li className="flex space-x-1 items-center">
                <GiElectric className="w-4 h-4" />
                <span>Electricity</span>
              </li>
              <li className="flex space-x-1 items-center">
                <RiParkingBoxLine className="w-4 h-4" />
                <span>Parking</span>
              </li>
              <li className="flex space-x-1 items-center">
                <RiEarthquakeLine className="w-4 h-4" />
                <span>Earthquake Resistance</span>
              </li>
              <li className="flex space-x-1 items-center">
                <RiDeleteBin6Line className="w-4 h-4" />
                <span>Garbage Dumping</span>
              </li>
              <li className="flex space-x-1 items-center">
                <BsPeace className="w-4 h-4" />
                <span>Peaceful environment</span>
              </li>
              <li className="flex space-x-1 items-center">
                <BsFlower3 className="w-4 h-4" />
                <span>Garden</span>
              </li>
              <li className="flex space-x-1 items-center">
                <IoWaterOutline className="w-4 h-4" />
                <span>Balcony</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="space-y-4 py-5">
          <div className="space-y-4">
            <div className="text-red-700 font-medium">Exterior Facilities</div>
            <ul className="font-light text-sm space-y-2 grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <li className="flex space-x-1 items-center">
                <IoWaterOutline className="w-4 h-4" />
                <span>Drinking Water</span>
              </li>
              <li className="flex space-x-1 items-center">
                <GiElectric className="w-4 h-4" />
                <span>Electricity</span>
              </li>
              <li className="flex space-x-1 items-center">
                <RiParkingBoxLine className="w-4 h-4" />
                <span>Parking</span>
              </li>
              <li className="flex space-x-1 items-center">
                <RiEarthquakeLine className="w-4 h-4" />
                <span>Earthquake Resistance</span>
              </li>
              <li className="flex space-x-1 items-center">
                <RiDeleteBin6Line className="w-4 h-4" />
                <span>Garbage Dumping</span>
              </li>
              <li className="flex space-x-1 items-center">
                <BsPeace className="w-4 h-4" />
                <span>Peaceful environment</span>
              </li>
              <li className="flex space-x-1 items-center">
                <BsFlower3 className="w-4 h-4" />
                <span>Garden</span>
              </li>
              <li className="flex space-x-1 items-center">
                <IoWaterOutline className="w-4 h-4" />
                <span>Balcony</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="space-y-4 py-5">
          <div className="space-y-4">
            <div className="text-red-700 font-medium">Exterior Facilities</div>
            <ul className="font-light text-sm space-y-2 grid sm:grid-cols-2 gap-y-2 gap-x-20">
              <li className="flex justify-between items-center">
                <span>No. of Kitchens</span>
                <span>2</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Parking</span>
                <span>Available</span>
              </li>
              <li className="flex justify-between items-center">
                <span>No. of Bedrooms</span>
                <span>2</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Garrage</span>
                <span>Available</span>
              </li>
              <li className="flex justify-between items-center">
                <span>No. of Bedrooms</span>
                <span>2</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Pillars</span>
                <span>NA</span>
              </li>
              <li className="flex justify-between items-center">
                <span>No. of Floors</span>
                <span>NA</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Water Tank</span>
                <span>Available</span>
              </li>
              <li className="flex justify-between items-center">
                <span>No. of Shatters</span>
                <span>1000 ltr</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Parking</span>
                <span>Available</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="py-5 grid sm:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="text-red-700 font-medium">Environment</div>
            <ul className="font-light text-sm space-y-2">
              <li className="flex items-center">
                <span>Friendly</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="text-red-700 font-medium">Broker</div>
            <ul className="font-light text-sm space-y-2">
              <li className="flex items-center">
                <span>
                  I am Interested in getting response from brokers too.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
