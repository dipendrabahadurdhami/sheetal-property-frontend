import React from "react";
import { useSelector } from "react-redux";
import Information from "./Form/Information";
import Password from "./Form/Password";
import SocialMedia from "./Form/SocialMedia";

const DashBoard = () => {
  const user  = useSelector(state=>state.user)
  return (
    <div className="p-5 md:p-10 space-y-16">
      <Information data={user?.data}/>
      <SocialMedia data={user?.data}/>
      <Password />
      {/* <div className="flex justify-between items-center font-semibold">
        <div className="text-2xl">Delete Account</div>
        <button className="text-white font-medium bg-red-700 rounded px-5 py-2">
          Delete My Account
        </button>
      </div> */}
    </div>
  );
};

export default DashBoard;
