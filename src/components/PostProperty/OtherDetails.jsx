import React from "react";
import { useCookies } from "react-cookie";
import FormikTextInput from "./FormikTextInput";

const OtherDetails = () => {
  const [cookies] = useCookies(['sheetal_token']);
  console.log("Token",cookies.sheetal_token);
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5">
      <div className="text-xl font-medium capitalize">Other Details</div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Number of Kitchen"
          label="Number of Kitchen"
        />
        <label className="flex flex-col items-center space-y-3">
          <FormikTextInput
            containerClassname="space-y-2"
            className="w-full py-2 px-2"
            name="Number of Floors"
            label="Number of Floors"
          />
        </label>
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Number of Bedrooms"
          label="Number of Bedrooms"
        />
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Number of Shutter"
          label="Number of Shutter"
        />
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Number of Living Rooms"
          label="Number of Living Rooms"
        />
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Parking"
          label="Parking"
        />
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Garage"
          label="Garage"
        />
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Size of Pillars"
          label="Size of Pillars"
        />
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Sources of Water"
          label="Sources of Water"
        />
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Capacity of Water Tank"
          label="Capacity of Water Tank"
        />
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Facilities"
          label="Facilities"
        />
      </div>
    </div>
  );
};

export default OtherDetails;
