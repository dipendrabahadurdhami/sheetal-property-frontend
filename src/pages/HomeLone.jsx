import React from "react";
import EmiCalculatorPage from "./EmiCalculatorPage";
import Contact from "../components/Common/Contact";
import Details from "../components/Service/HomeLone/Details";
import HowToWork from "../components/Service/HomeLone/HowToWork";
import LinkBanks from "../components/Service/HomeLone/LinkBanks";
import SEO from "../components/SEO/SEO";

const HomeLone = () => {
  return (
    <div>
      <SEO
        title="Home Loan in Nepal - Compare Bank Rates & Apply Online"
        description="Compare home loan interest rates from major Nepal banks and apply for a housing loan online through Sheetal Property Nepal. Fast approval, linked banking partners."
        keywords="home loan Nepal, housing loan Nepal, bank loan for property Nepal, Nepal home financing, mortgage Nepal"
        path="/homeLone"
      />
      <Details />
      <HowToWork />
      <LinkBanks />
      <EmiCalculatorPage />
      <Contact />
    </div>
  );
};

export default HomeLone;
