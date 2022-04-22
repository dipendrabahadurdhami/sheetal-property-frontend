import React from "react";
import FormikSelect from "./FormikSelect";

const ExpectedPrice = () => {
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5">
      <div className="text-xl font-medium capitalize">Expected Price</div>

      <div className="grid md:grid-cols-2 gap-5">
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Total Price (NRs.)"
          label="Total Price (NRs.)"
          placeHolder="Choose your Total Price (NRs.)"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Unit price per aana"
          label="Unit price per aana"
          placeHolder="Choose your Unit price per aana"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Building Price per sq.ft*"
          label="Building Price per sq.ft*"
          placeHolder="Choose your Building Price per sq.ft*"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
      </div>
    </div>
  );
};

export default ExpectedPrice;
