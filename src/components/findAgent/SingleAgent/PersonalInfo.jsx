import React from "react";
import { FaStar } from "react-icons/fa";
import fallBackSrc from '../../../assets/images/noUser.png';

const PersonalInfo = ({data}) => {
  return (
    <div className="flex space-x-5 items-center justify-start">
      <div className="h-32 w-32 rounded-full overflow-hidden">
        <img
          alt=""
          src={data.photo?data.photo:fallBackSrc}
          className="h-full w-full object-contain object-center"
        />
      </div>
      <div className="flex flex-col space-y-1 text-sm text-gray-500">
        <h1 className="text-red-700 font-medium text-lg">{data.first_name} {data.last_name}</h1>
        {data.address_1 && <p> {data.address_1},  {data.address_2}</p>}
        <p>Shetal Property Premier Agent</p>
        <div className="flex items-center">
          <FaStar className="w-5 h-5 text-red-700" />
          <FaStar className="w-5 h-5 text-red-700" />
          <FaStar className="w-5 h-5 text-red-700" />
          <FaStar className="w-5 h-5 text-red-700" />
          <FaStar className="w-5 h-5 text-red-700" />
        </div>
        {/* <p>35 sales in last 12 months</p> */}
      </div>
    </div>
  );
};

export default PersonalInfo;
