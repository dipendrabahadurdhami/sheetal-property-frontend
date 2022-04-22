import React from "react";
import FormikTextInput from "./FormikTextInput";

const LalPurja = () => {
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5">
      <div className="text-xl font-medium capitalize">
        Land Area According to Lal Purja
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Land Area in Ropani"
          label="Land Area in Ropani"
        />
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Land Area in Sq.ft"
          label="Land Area in Sq.ft"
        />
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Land Area in Meters"
          label="Land Area in Meters"
        />
      </div>
    </div>
  );
};

export default LalPurja;
