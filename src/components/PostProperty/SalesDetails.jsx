import React from "react";
import FormikSelect from "./FormikSelect";
import FormikTextInput from "./FormikTextInput";

const SalesDetails = () => {
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5">
      <div className="text-xl font-medium capitalize">Sales Details</div>

      <div className="grid md:grid-cols-2 gap-5">
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Urgency type"
          label="Urgency type"
          placeHolder="Choose your Urgency type"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Bahina / Advance"
          label="Bahina / Advance"
          placeHolder="Choose your Bahina / Advance *"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
      </div>
      <div className="space-y-3">
        <div className="capitalize">negotiability (Min Price)</div>
        <div className="grid md:grid-cols-2 gap-5">
          <FormikTextInput
            containerClassname="space-y-2"
            placeholder="Enter your property name"
            className="w-full py-2 px-2"
            name="Property Name"
          />
          <FormikTextInput
            containerClassname="space-y-2"
            placeholder="Enter your property name"
            className="w-full py-2 px-2"
            name="Property Name"
          />
        </div>
      </div>
      <div className="space-y-3">
        <div className="capitalize">current Rent</div>
        <div className="grid md:grid-cols-3 gap-5">
          <FormikTextInput
            containerClassname="space-y-2"
            placeholder="Rent per month"
            className="w-full py-2 px-2"
            name="Property Name"
          />
          <FormikTextInput
            containerClassname="space-y-2"
            placeholder="Min lease amount"
            className="w-full py-2 px-2"
            name="Property Name"
          />
          <FormikTextInput
            containerClassname="space-y-2"
            placeholder="Min deposit amount"
            className="w-full py-2 px-2"
            name="Property Name"
          />
        </div>
      </div>
      <div className="space-y-3">
        <div className="capitalize">Broker’s Response</div>
        <div className="flex items-center space-x-5">
          <label className="flex space-x-3 items-center">
            <input type={"checkbox"} className="w-4 h-4" />
            <span>Yes</span>
          </label>
          <label className="flex space-x-3 items-center">
            <input type={"checkbox"} className="w-4 h-4" />
            <span>No</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SalesDetails;
