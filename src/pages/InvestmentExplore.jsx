import React from "react";
import Details from "../components/Investment/explore/Details";
import Map from "../components/Investment/explore/Map";
import ProjectAction from "../components/Investment/explore/ProjectAction";
import SEO from "../components/SEO/SEO";

const InvestmentExplore = () => {
  return (
    <div className="p-5 lg:p-10">
      <Details />
      <Map />
      <SEO
        title="Explore Investment Project - Nepal FDI & Property Investment"
        description="Explore this Nepal investment opportunity in detail — location, returns and project information for local and overseas investors from India and Dubai."
        keywords="Nepal investment project, FDI Nepal, property investment Nepal, invest in Nepal real estate, Nepal investment opportunity"
        path="/investment/export"
      />
      <ProjectAction />
    </div>
  );
};

export default InvestmentExplore;
