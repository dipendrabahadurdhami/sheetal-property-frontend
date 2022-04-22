import React from "react";
import FormikTextInput from "./FormikTextInput";

const RoadAccess = () => {
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5">
      <div className="text-xl font-medium capitalize">Road Access</div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <label className="flex flex-col items-center space-y-3">
          <FormikTextInput
            containerClassname="space-y-2"
            className="w-full py-2 px-2"
            name="Main Road Width"
            label="Main Road Width"
          />
        </label>
        <label className="flex flex-col items-center space-y-3">
          <FormikTextInput
            containerClassname="space-y-2"
            className="w-full py-2 px-2"
            name="Side Road Width"
            label="Side Road Width"
          />
        </label>
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Road Wide Facing The Land"
          label="Road Wide Facing The Land"
        />
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Mohada Facing The Land"
          label="Mohada Facing The Land"
        />
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Status of Road"
          label="Status of Road"
        />
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Land Perimeter"
          label="Land Perimeter"
        />
      </div>
    </div>
  );
};

export default RoadAccess;
