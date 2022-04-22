import React from "react";
import FormikTextInput from "./FormikTextInput";

const AboutProperty = () => {
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5">
      <div className="text-xl font-medium capitalize">About Property</div>
      <div className="space-y-5">
        <label className="flex flex-col items-center space-y-3">
          <FormikTextInput
            containerClassname="space-y-2"
            placeholder="Enter your Property Highlights"
            className="w-full py-2 px-2"
            name="Property Highlights"
            label="Property Highlights"
            isRequired={true}
          />
        </label>
        <label className="flex flex-col space-y-3">
          <span>Property Detail Description</span>
          <textarea
            rows={8}
            placeholder="Enter the detail description"
            className="w-full py-2 px-2 h-32 flex items-start border border-gray-400 rounded"
            name="Property Highlights"
            isRequired={true}
          />
        </label>
        <label className="flex flex-col items-center space-y-3">
          <FormikTextInput
            containerClassname="space-y-2"
            placeholder="Enter Other Description"
            className="w-full py-2 px-2"
            name="Property Highlights"
            label="Other Description"
            isRequired={true}
          />
        </label>
      </div>
    </div>
  );
};

export default AboutProperty;
