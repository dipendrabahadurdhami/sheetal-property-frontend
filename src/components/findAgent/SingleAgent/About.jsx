import React from "react";

const About = ({ data }) => {
  return (
    <div className="space-y-10">
      <div className="lg:w-2/3 border-t xs:border border-gray-300 xs:rounded py-5 xs:p-5">
        <div className="font-medium text-xl py-5 text-center">
          Agent Information
        </div>
        <ul className="">
          {data.address_1 && (
            <li className="flex flex-wrap text-gray-600 mb-2">
              <div className="w-full md:w-6/12">Broker Address Line 1:</div>
              <div className="w-full md:w-6/12">{data.address_1}</div>
            </li>
          )}
          {data.address_2 && (
            <li className="flex flex-wrap text-gray-600 mb-2">
              <div className="w-full md:w-6/12">Broker Address Line 2:</div>
              <div className="w-full md:w-6/12">{data.address_2}</div>
            </li>
          )}
          {data.email && (
            <li className="flex flex-wrap text-gray-600 mb-2">
              <div className="w-full md:w-6/12">Email Address:</div>
              <div className="w-full md:w-6/12">{data.email}</div>
            </li>
          )}
          {data.mobile && (
            <li className="flex flex-wrap text-gray-600 mb-2">
              <div className="w-full md:w-6/12">Mobile Number:</div>
              <div className="w-full md:w-6/12">{data.mobile}</div>
            </li>
          )}
          {data.phone && (
            <li className="flex flex-wrap text-gray-600 mb-2">
              <div className="w-full md:w-6/12">Phone Number:</div>
              <div className="w-full md:w-6/12">{data.phone}</div>
            </li>
          )}
          {data.created_at && (
            <li className="flex flex-wrap text-gray-600">
              <div className="w-full md:w-6/12">Member Since:</div>
              <div className="w-full md:w-6/12">{data.created_at}</div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default About;
