import React from "react";
import MainComponent from "../components/PostProperty/MainComponent";
import SEO from "../components/SEO/SEO";


const PostProperty = () => {
  return (
    <div className="p-5 lg:p-10 py-10">
      <div className="grid ap-5">
      <SEO
        title="Post Property for Sale or Rent in Nepal - Free Listing"
        description="List your property for sale or rent in Nepal for free. Reach thousands of buyers and tenants, including NRN and overseas investors from India and Dubai, on Sheetal Property Nepal."
        keywords="post property Nepal, list property for sale Nepal, sell property Nepal free, rent out property Nepal, property listing Nepal"
        path="/post-property"
      />
        <div className="md:col-span-3">
          <div className="text-2xl font-medium mb-5">Post Property</div>
          <MainComponent />
        </div>
      </div>
    </div>
  );
};

export default PostProperty;