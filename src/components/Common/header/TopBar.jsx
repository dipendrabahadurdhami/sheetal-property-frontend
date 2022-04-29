import React, { useContext, useState } from "react";
import { FaBell } from "react-icons/fa";
import { RiArrowDownSLine } from "react-icons/ri";
import { LoggedUserContext } from "../../Context/LoginContext";
import LoginModel from "../../Login/LoginModel";
import UserLogin from "./UserLogin";

const TopBar = () => {
  const { token } = useContext(LoggedUserContext);

  const [r, setR] = useState(false);
  // const [logged, setLogged] = useState(true);

  return (
    <>
      <div className="px-5 lg:px-10 py-3 shadow flex justify-between items-center">
        <a href="/">
          <img
            src="/shetallogo.png"
            alt="shetallogo.png"
            className="w-36 h-auto"
          />
        </a>
        <div className="flex space-x-7 items-center">
          {token ? (
            <></>
          ) : (
            <button
              onClick={() => {
                setR(true);
              }}
              className="text-red-700 text-lg capitalize flex items-center space-x-2"
            >
              <span>Login / Register</span>
              <RiArrowDownSLine className="w-5 h-5" />
            </button>
          )}
          <a
            href="/postProperty"
            className="px-5 py-3 bg-red-700 text-lg text-white capitalize rounded-lg"
          >
            post property{" "}
          </a>
          {token && (
            <div className="flex items-center justify-center space-x-7">
              <FaBell className="w-8 h-8 rounded-full text-red-700" />
              <UserLogin />
            </div>
          )}
        </div>
      </div>
      {r && <LoginModel r={r} setR={setR} />}
    </>
  );
};

export default TopBar;
