import React from "react";
import Contact from "./Contact";
import LowerFooter from "./LowerFooter";
import MainContent from "./MainContent";
import OurServices from "./OurServices";
import Pages from "./Pages";

const Footer = () => {
  return (
    <div className="flex flex-col xl:items-center bg-neutral-400">
      <div className="px-5 py-10 lg:p-10 grid md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-5 max-w-[1440px]">
        <div>
          <MainContent />
        </div>
        <div>
          <OurServices />
        </div>
        <div>
          <Pages />
        </div>
        <div>
          <Contact />
        </div>
      </div>
      <div className="w-full bg-white">
        <LowerFooter />
      </div>
    </div>
  );
};

export default Footer;
