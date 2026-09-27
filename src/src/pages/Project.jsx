import React from "react";
import Featured from "../components/home/Featured";
import About from "../components/Project/About";
import Contact from "../components/Project/Contact";
import Details from "../components/Project/Details";
import WhyThis from "../components/Project/WhyThis";
import SEO from "../components/SEO/SEO";

const Project = () => {
  return (
    <>

      <div className="px-5 lg:px-10">
      <SEO
        title="Featured Real Estate Project - Sheetal Property Nepal"
        description="Explore featured real estate development projects in Nepal, with details, pricing and investment opportunities for local and overseas buyers."
        keywords="Nepal real estate project, property development Nepal, new housing project Nepal, investment project Nepal"
        path="/project"
      />
        <div className="py-10 border-b-2 border-gray-300">
          <img
            src="/fetured/unsplash_b_79nOqf95I.png"
            alt="/investment/unsplash2"
            className="w-full h-96 bg-cover bg-center rounded"
          />
        </div>
        <div className="grid lg:grid-cols-3 py-10 gap-10">
          <div className="lg:col-span-2">
            <Details />
            <WhyThis />
          </div>
          <div>
            <Contact />
          </div>
        </div>
        <About />
      </div>
      <Featured />
    </>
  );
};

export default Project;
