import React, { useEffect } from "react";

import MainHome from "../components/home/MainHome";
import headTag from "../headTag";

const Home = () => {
  useEffect(() => {
    headTag({
      title: "Shetal Real State",
      content:
        "Sheetal is one of the leading Real Estate Company in Nepal, offers variety of land, house rent and sale in Nepal. List your property and lean back to your seat.",
    });
  }, []);

  return (
    <div>
      <MainHome />
    </div>
  );
};

export default Home;
