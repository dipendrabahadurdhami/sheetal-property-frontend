import React from "react";
import FormikSelect from "./FormikSelect";

const AdvertisementTypes = () => {
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5">
      <div className="text-xl font-medium capitalize">
        Advertisement & Types
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Advertisement Type"
          label="Advertisement Type"
          placeHolder="Choose your advertisement type"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Advertisement  Purpose"
          label="Advertisement  Purpose"
          placeHolder="Choose your advertisement purpose"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Commission Type"
          label="Commission Type"
          placeHolder="Choose your commission type"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Owner info"
          label="Owner info"
          placeHolder="Choose your class type"
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

export default AdvertisementTypes;
