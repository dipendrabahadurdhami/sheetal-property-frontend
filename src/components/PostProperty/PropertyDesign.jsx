import React from "react";
import FormikSelect from "./FormikSelect";

export const PropertyDesign = () => {
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5">
      <div className="text-xl font-medium capitalize">Address</div>
      <div className="grid md:grid-cols-2 gap-5">
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Exterior Looks"
          label="Exterior Looks"
          placeHolder="None Selected"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Interior Looks"
          label="Interior Looks"
          placeHolder="None Selected"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Facility"
          label="Facility"
          placeHolder="None Selected"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Nearby Facility"
          label="Nearby Facility"
          placeHolder="None Selected"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Environment"
          label="Environment"
          placeHolder="None Selected"
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
