import React from "react";
import { useSelector } from "react-redux";
import Information from "./Form/Information";
import Password from "./Form/Password";

const DashBoard = () => {
  const user = useSelector((state) => state.user);

  return (
    <div className="p-5 md:p-10 space-y-16">
      <Information data={user?.data} />
      <Password />
    </div>
  );
};

export default DashBoard;
