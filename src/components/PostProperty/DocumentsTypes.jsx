import React from "react";
import FormikSelect from "./FormikSelect";

const DocumentsTypes = () => {
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5">
      <div className="text-xl font-medium capitalize">Documents & Types</div>

      <div className="grid md:grid-cols-2 gap-5">
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Property Status"
          label="Property Status"
          placeHolder="Choose your Property Status"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Completion Year"
          label="Completion Year"
          placeHolder="Choose your Completion Year"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Completion Year"
          label="Completion Year"
          placeHolder="Choose your Completion Year"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="URL "
          label="URL "
          placeHolder="Choose your URL"
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

export default DocumentsTypes;
