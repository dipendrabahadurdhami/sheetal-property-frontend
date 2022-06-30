import React from "react";
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";
import { AiFillTwitterCircle } from "react-icons/ai";
import { IoLogoInstagram } from "react-icons/io";

const MainContent = () => {
  console.log(process.env)
  return (
    <div className="space-y-5 xl:w-2/3">
      <img src="/shetallogo.png" alt="footerlogo" className="w-28 h-16" />
      <p className="text-white">
        Shetal Real State is a company that helps you find your dream home.
       
      </p>
      <ul className="flex items-center mt-10 space-x-3">
        <li  className="rounded-full w-10 h-10 p-2 overflow-hidden flex items-center justify-center bg-white">
          <a href={process.env.REACT_APP_FACEBOOK_URL} target={"_blank"}><BsFacebook className="w-full h-full text-neutral-400" /></a>
        </li>
        <li  className="rounded-full w-10 h-10 p-2 overflow-hidden flex items-center justify-center bg-white">
          <a href={process.env.REACT_APP_TWITTER_URL} target={"_blank"}><BsTwitter className="w-full h-full text-neutral-400" /></a>
        </li>
        <li className="rounded-full w-10 h-10 p-2 overflow-hidden flex items-center justify-center bg-white">
          <a href={process.env.REACT_APP_INSTAGRAM_URL} target={"_blank"}><BsInstagram className="w-full h-full text-neutral-400" /></a>
        </li>
      </ul>
    </div>
  );
};

export default MainContent;
