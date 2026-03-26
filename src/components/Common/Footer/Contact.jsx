import React from "react";
import { FaPhone } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";

const Contact = () => {
  return (
    <div className="text-white space-y-6">
      <h2 className="font-bold text-lg md:text-base">Contact US</h2>
      
      <div className="space-y-4">
        {/* Phone */}
        <div className="flex items-center gap-4">
          <div className="">
             <FaPhone className="w-4 h-4 rotate-90 text-white" />
          </div>
          <a href="tel:9801000434" className="hover:text-red-500 transition-colors">
            +977 9801000434
          </a>
        </div>

        {/* Email */}
        <div className="flex items-center gap-4">
          <div className="">
            <HiMail className="w-4 h-4 text-white" />
          </div>
          <a href="mailto:shetalrealestate@gmail.com" className="hover:text-red-500 transition-colors break-all">
            shetalrealestate@gmail.com
          </a>
        </div>
      </div>

      {/* Social Icons - Adjusted margin for mobile */}
      <ul className="flex items-center pt-0 space-x-4">
        {[
          { Icon: BsFacebook, url: process.env.REACT_APP_FACEBOOK_URL },
          { Icon: BsTwitter, url: process.env.REACT_APP_TWITTER_URL },
          { Icon: BsInstagram, url: process.env.REACT_APP_INSTAGRAM_URL },
        ].map((item, idx) => (
          <li key={idx} className="rounded-full w-10 h-10 flex items-center justify-center bg-red-700 hover:bg-red-600 transition-all transform hover:scale-110">
            <a href={item.url} target="_blank" rel="noreferrer">
              <item.Icon className="w-5 h-5 text-white" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contact;