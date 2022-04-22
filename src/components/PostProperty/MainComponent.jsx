import { Formik } from "formik";
import React from "react";
import AboutProperty from "./AboutProperty";
import Address from "./Address";
import AdvertisementTypes from "./AdvertisementTypes";
import BasicDetails from "./BasicDetails";
import DocumentsTypes from "./DocumentsTypes";
import ExpectedPrice from "./ExpectedPrice";
import Finance from "./Finance";
import LalPurja from "./LalPurja";
import LandMeasurements from "./LandMeasurements";

import MyProperty from "./MyProperty";
import OtherDetails from "./OtherDetails";
import RoadAccess from "./RoadAccess";
import SalesDetails from "./SalesDetails";
import UploadImage from "./UploadImage";

const MainComponent = () => {
  return (
    <div>
      <Formik>
        <div className="space-y-5">
          <MyProperty />
          <BasicDetails />
          <AdvertisementTypes />
          <DocumentsTypes />
          <Address />
          <ExpectedPrice />
          <SalesDetails />
          <AboutProperty />
          <OtherDetails />
          <RoadAccess />
          <LalPurja />
          <LandMeasurements />
          <Finance />
          <UploadImage />
          <button
            type="submit"
            className="bg-red-700 text-white px-5 py-2 font-medium rounded"
          >
            Submit
          </button>
        </div>
      </Formik>
    </div>
  );
};

export default MainComponent;
