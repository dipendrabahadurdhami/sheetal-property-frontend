import React, { useEffect } from "react";

import MainHome from "../components/home/MainHome";
import headTag from "../headTag";

const Home = () => {
  useEffect(() => {
    headTag({ title: "Shetal Real State", content: "" });
  }, []);

  return (
    <div>
      <MainHome />
    </div>
  );
};

export default Home;
