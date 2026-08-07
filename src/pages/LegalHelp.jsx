import React from "react";
import Contact from "../components/Common/Contact";
import AskOnline from "../components/Service/Help/AskOnline";
import LegalHelpp from "../components/Service/Help/LegalHelp";
import SEO from "../components/SEO/SEO";

const LegalHelp = () => {
  return (
    <div>
      <LegalHelpp />
      <SEO
        title="Legal Help for Property in Nepal - Documentation & Property Law"
        description="Get expert legal help for property transactions in Nepal — land registration, ownership verification, documentation and property law guidance."
        keywords="property legal help Nepal, land registration Nepal, property documentation Nepal, property law Nepal, land ownership verification"
        path="/LegalHelp"
      />
      <AskOnline />
      <Contact />
    </div>
  );
};

export default LegalHelp;
