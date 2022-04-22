import React, { useState } from "react";

// import Details from "../components/SingleProduct/Details";
import UserHead from "../components/SingleProduct/UserHead";
import Description from "../components/SingleProduct/Description";
// import ExtraValue from "../components/SingleProduct/ExtraValue";
import Featured from "../components/home/Featured";
import Property from "../components/home/Property";
import ScheduleTour from "../components/scheduleTour/ScheduleTour";
import ContactModel from "../components/SingleProduct/ContactModel";
import ProductLocation from "../components/SingleProduct/ProductLocation";
import ImageGallery from "../components/SingleProduct/ImageGallery";
import PropertyHighlight from "../components/SingleProduct/PropertyHighlight";
import ReviewComponent from "../components/SingleProduct/review/ReviewComponent";
import Details from "../components/SingleProduct/Details";

const SingleProduct = () => {
  const [open, setOpen] = useState(false);
  window.scrollTo(0, 0);
  return (
    <>
      <UserHead setOpen={setOpen} />
      <div className="px-5 lg:px-10 py-10 pb-10">
        <ProductLocation />
        <ImageGallery />

        <Description />
        {/* <ExtraValue /> */}
        <PropertyHighlight />
        <Details />
        <ReviewComponent />
        <ScheduleTour />
        <Featured />
        <Property />
      </div>
      <ContactModel open={open} setOpen={setOpen} />
    </>
  );
};

export default SingleProduct;
