import React from "react";
import FormikTextInput from "./FormikTextInput";

const Finance = () => {
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5">
      <div className="text-xl font-medium capitalize">Finance</div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Finance/Bank Name"
          label="Finance/Bank Name"
        />
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="Loan Amount"
          label="Loan Amount"
        />
        <FormikTextInput
          containerClassname="space-y-2"
          className="w-full py-2 px-2"
          name="SEO"
          label="SEO"
        />
      </div>
    </div>
  );
};

export default Finance;
