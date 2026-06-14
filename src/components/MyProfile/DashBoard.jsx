import React from "react";
import { useSelector } from "react-redux";
import Information from "./Form/Information";
import Password from "./Form/Password";

const DashBoard = () => {
  const user = useSelector((state) => state.user);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Information data={user?.data} />
      <Password />
    </div>
  );
};

export default DashBoard;