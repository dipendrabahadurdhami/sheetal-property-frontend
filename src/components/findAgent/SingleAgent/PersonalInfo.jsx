import React from "react";
import { FaStar } from "react-icons/fa";
import { IoLocationOutline, IoBriefcaseOutline } from "react-icons/io5";
import fallBackSrc from "../../../assets/images/noUser.png";

const PersonalInfo = ({ data }) => {
  const agentName =
    data.first_name && data.last_name
      ? data.first_name + " " + data.last_name
      : "Sheetal Property Agent";

  return (
    <div className="w-full mt-40">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 sm:p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">

        {/* Avatar */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-red-100 flex-shrink-0">
          <img
            alt={agentName}
            src={data.photo ? data.photo : fallBackSrc}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-center sm:text-left space-y-1.5">

          <h1 className="text-xl font-bold text-gray-900 truncate">
            {agentName}
          </h1>

          <p className="text-xs font-bold uppercase tracking-widest text-red-600">
            Sheetal Property Premier Agent
          </p>

          {(data.address_1 || data.address_2) && (
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-gray-500">
              <IoLocationOutline className="w-4 h-4 flex-shrink-0 text-gray-400" />
              <span className="truncate">
                {[data.address_1, data.address_2].filter(Boolean).join(", ")}
              </span>
            </div>
          )}

          {data.designation && (
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-gray-500">
              <IoBriefcaseOutline className="w-4 h-4 flex-shrink-0 text-gray-400" />
              <span>{data.designation}</span>
            </div>
          )}

          {/* Stars */}
          <div className="flex items-center justify-center sm:justify-start gap-0.5 pt-1">
            {[1,2,3,4,5].map(function(s){
              return <FaStar key={s} className="w-4 h-4 text-red-600" />;
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;