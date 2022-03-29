import { HomeIcon } from "@heroicons/react/solid";
import React from "react";
import { BsCheckCircle, BsXCircle, BsShop } from "react-icons/bs";
import { ImOffice } from "react-icons/im";

const ChooseRentSpace = ({ setSelect }) => {
  const rentSpace = [
    {
      name: "Home",
      icon: <HomeIcon className="w-16 h-16 sm:w-24 sm:h-24 text-red-500" />,
      paid: true,
    },
    {
      name: "Office",
      icon: <ImOffice className="w-16 h-16 sm:w-24 sm:h-24 text-red-500" />,
      paid: false,
    },
    {
      name: "Shop",
      icon: <BsShop className="w-16 h-16 sm:w-24 sm:h-24 text-red-500" />,
      paid: true,
    },
  ];
  return (
    <div className="space-y-5">
      <div className="sm:p-10 text-center text-4xl font-light">
        Choose Rent Space
      </div>
      {rentSpace.map((item) => (
        <button
          onClick={() => setSelect(3)}
          className="w-full p-2 sm:p-4 text-sm sm:text-base rounded border grid grid-cols-2 gap-5 sm:flex sm:space-x-5 items-center sm:justify-between"
        >
          <div className="flex flex-col sm:justify-center items-center space-y-2 md:pl-10">
            {item.icon}
            <span className="text-sm text-gray-500">{item.name}</span>
          </div>
          <div>
            <div className="text-left font-medium">
              {item.paid ? (
                <div className="flex space-x-2 items-center text-red-700">
                  <BsCheckCircle className="w-4 h-4 " />
                  <span>Paid</span>
                </div>
              ) : (
                <div className="flex space-x-2 items-center text-red-700">
                  <BsXCircle className="w-4 h-4" />
                  <span>Unpaid</span>
                </div>
              )}
              <div className="font-medium">Ram Karki</div>
              <div className="text-sm text-gray-500">Anamnagar, Kathmandu</div>
            </div>
          </div>
          <div className="col-span-2">
            <ul className="grid grid-cols-2 gap-2 p-2 border-b text-left text-sm sm:text-base">
              <li>House rent</li>
              <li>Rs. 200000</li>
              <li>Electricity</li>
              <li>Rs. 200000</li>
              <li>Water</li>
              <li>Rs. 200000</li>
            </ul>
            <ul className="grid grid-cols-2 gap-2 p-2 font-semibold text-left">
              <li>Total</li>
              <li>Rs. 40,000</li>
            </ul>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ChooseRentSpace;
