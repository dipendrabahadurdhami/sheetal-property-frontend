import React from "react";
import MainComponent from "../components/PostProperty/MainComponent";


const PostProperty = () => {
  return (
    <div className="p-5 lg:p-10 py-10">
      <div className="grid ap-5">
        <div className="md:col-span-3">
          <div className="text-2xl font-medium mb-5">Post Property</div>
          <MainComponent />
        </div>
      </div>
    </div>
  );
};

export default PostProperty;
