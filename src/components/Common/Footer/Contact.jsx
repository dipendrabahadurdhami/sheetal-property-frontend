import React from "react";
import { FaPhone } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";

const Contact = () => {
  return (
    <div className=" text-white item-leftspace-y-5">
      <div className="grid grid-cols-12 gap-6 ">
        <div className="col-span-12 md:col-span-1">
          <span className="visible md:hidden  font-bold items-left mb-4 ">Contact US</span>{" "}
        </div>
        <div className="col-span-11  hidden md:block">
          <span className="hidden sm:block font-bold  mb-4">Contact US</span>
        </div>
        <div className="">
          <FaPhone className="w-5 h-5 rotate-90 text-red-700" />
        </div>
        <div className="col-span-11 ">
          {" "}
          <a href="tel: 9801000434">+977 9801000434</a>
        </div>
        <div className="">
          <HiMail className="w-6 h-6 text-red-700" />
        </div>
        <div className="col-span-10">
          <a href="mailto: shetalrealestate@gmail.com">shetalrealestate@gmail.com </a>
        </div>
      </div>
      <ul className="flex items-center mt-20 space-x-3">
        <li className="rounded-full w-10 h-10 p-2 overflow-hidden flex items-center justify-center bg-red-700">
          <a href={process.env.REACT_APP_FACEBOOK_URL} target={"_blank"}>
            <BsFacebook className="w-full h-full text-white" />
          </a>
        </li>
        <li className="rounded-full w-10 h-10 p-2 overflow-hidden flex items-center justify-center bg-red-700">
          <a href={process.env.REACT_APP_TWITTER_URL} target={"_blank"}>
            <BsTwitter className="w-full h-full text-white" />
          </a>
        </li>
        <li className="rounded-full w-10 h-10 p-2 overflow-hidden flex items-center justify-center bg-red-700">
          <a href={process.env.REACT_APP_INSTAGRAM_URL} target={"_blank"}>
            <BsInstagram className="w-full h-full text-white" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Contact;
