import React from "react";
import Header from "../components/MyProfile/navigation/Header";
import SideBar from "../components/MyProfile/navigation/SideBar";

const MyProfile = () => {
  return (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Header />
    
    <div className="flex flex-1 pt-20">
      <SideBar />
      
      
    </div>
  </div>
);
};

export default MyProfile;
