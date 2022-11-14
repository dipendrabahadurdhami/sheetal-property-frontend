import React, { useContext, useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaBell } from "react-icons/fa";
import { RiArrowDownSLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { LoggedUserContext } from "../../Context/LoginContext";
import LoginModel from "../../Login/LoginModel";
import UserLogin from "./UserLogin";

const TopBar = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  // const { token } = useContext(LoggedUserContext);

  const [r, setR] = useState(false);
  // const [logged, setLogged] = useState(true);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const favorites = useSelector((state) => state.favorites);
  useEffect(() => {
    if (searchParams.has("login")) {
      const needsToLogin = searchParams.get("login");
      if (needsToLogin) {
        searchParams.delete("login");
        setSearchParams(searchParams);
        setR(true);
      }
    }
  }, [searchParams]);
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
          {user.data ? (
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
          <Link
            to="/my-profile?section=post-property"
            className="px-5 py-3 bg-red-700 hover:bg-red-800 text-sm text-white capitalize rounded-lg"
          >
            post property{" "}
          </Link>
          {user.data && (
            <div className="flex items-center justify-center space-x-7">
              {/* <FaBell className="w-8 h-8 rounded-full text-red-700" /> */}
              <div
                className="w-8 h-8 rounded-full text-red-700 cursor-pointer relative"
                onClick={() => navigate("/my-profile?section=favourites")}
              >
                {!user.data && <AiOutlineHeart className="w-8 h-8" />}
                {user.data && <AiFillHeart className="w-8 h-8" />}
                {user.data && favorites.data.length > 0 && (
                  <span className="absolute -right-2 top-0 rounded-full w-4 h-4 bg-white border border-red-700 text-red-700 text-xs flex items-center justify-center text-center font-medium">
                    {favorites.data.length}
                  </span>
                )}
              </div>
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
