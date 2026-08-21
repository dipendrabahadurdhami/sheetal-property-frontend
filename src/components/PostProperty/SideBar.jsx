import React from "react";
import { useDispatch, useSelector } from "react-redux";

const SideBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  return (
    <div className="border rounded pt-5 space-y-5">
      <div className="px-5 flex items-center space-x-2">
        <div>
          <img
            src={`${user.data?.photo ? user.data?.photo : "noUser.png"}`}
            alt="noUser"
            className="rounded-full w-12 h-12 object-cover object-center"
          />
        </div>
        <div>
          <div className="text-xs font-light">Username</div>
          <div className="text-sm font-medium">{user.data?.user_name}</div>
        </div>
      </div>
      <div className="grid">
        <a href="my-profile" className="px-5 py-3 hover:bg-gray-200">
          Dashboard
        </a>
        <a href="/" className="px-5 py-3 hover:bg-gray-200">
          Featured Property
        </a>
        <a href="propertyDemand" className="px-5 py-3 hover:bg-gray-200">
          Property Demand
        </a>
        <a
          href="my-profile?section=post-property"
          className="px-5 py-3 hover:bg-gray-100 bg-gray-100"
        >
          Post Property
        </a>
        <a href="/requirementForm?agent_id=1" className="px-5 py-3 hover:bg-gray-200">
          Requirement Form
        </a>
      </div>
    </div>
  );
};

export default SideBar;
