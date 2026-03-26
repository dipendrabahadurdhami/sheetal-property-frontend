import React from "react";
// 1. IMPORT all the sub-components
import MainContent from "./MainContent";
import OurServices from "./OurServices";
import Pages from "./Pages";
import PropertiesInNepal from "./PropertiesInNepal";
import Contact from "./Contact";
import LowerFooter from "./LowerFooter";

const Footer = () => {
  return (
    <footer className="bg-neutral-800  pt-10">
      {/* Mobile-First Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="max-w-[1440px] mx-auto px-5 items-center justify-between grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-4 pb-4">
        <MainContent />
        <OurServices />
        <Pages />
        <PropertiesInNepal />
        <Contact />
      </div>
      
      {/* Bottom Copyright bar */}
      <LowerFooter />
    </footer>
  );
};

// 2. EXPORT the Footer so App.js can find it
export default Footer;