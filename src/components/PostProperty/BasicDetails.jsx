import React from "react";
import FormikTextInput from "./FormikTextInput";
import FormikSelect from "./FormikSelect";

const BasicDetails = () => {
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5">
      <div className="text-xl font-medium capitalize">
        Enter your basic details{" "}
      </div>
      <div className=" space-y-5">
        <label className="flex flex-col items-center space-y-3">
          <FormikTextInput
            containerClassname="space-y-2"
            placeholder="Enter your property name"
            className="w-full py-2 px-2"
            name="Property Name"
            label="Property Name"
            isRequired={true}
          />
        </label>
        <div className="grid md:grid-cols-2 gap-5">
          <FormikSelect
            containerClassname="space-y-2"
            className="col-span-2 border py-2 px-2"
            name="Property Type"
            label="Property Type"
            placeHolder="Choose your property type"
            options={[
              { label: "Enabled", value: "ENABLED" },
              { label: "Disabled", value: "DISABLED" },
            ]}
            isRequired={true}
          />
          <FormikSelect
            containerClassname="space-y-2"
            className="col-span-2 border py-2 px-2"
            name="Class Type"
            label="Class Type"
            placeHolder="Choose your Class Type"
            options={[
              { label: "Enabled", value: "ENABLED" },
              { label: "Disabled", value: "DISABLED" },
            ]}
            isRequired={true}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;
