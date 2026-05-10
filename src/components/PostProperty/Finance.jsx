import React from "react";
import FormikTextInput from "./FormikTextInput";

const Finance = ({errors, onInputChange, data}) => {
  const onFormInputChange = (name,value) => {
    onInputChange(name, value)
  }
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5 mb-6">
      <div className="text-xl font-medium capitalize">Finance</div>
     
        <div className="flex flex-wrap justify-between -mx-2 mb-6">
          <div className="px-2  w-full lg:w-6/12  form-group mb-6">
            <label className="block mb-2">Finance/Bank Name</label>
            <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="finance_bank_name"
                style={{height:'50px'}}
                placeholder="ABC Bank"
                data={data.finance_bank_name}
                onChange={(e)=>onFormInputChange('finance_bank_name', e.target.value)}
              />
            {errors && errors?.finance_bank_name && <p className="text-red-500 text-sm">{errors?.finance_bank_name}</p>}
          </div>
          {/* /.form-group */}

          <div className="px-2  w-full lg:w-3/12  form-group mb-6">
            <label className="block mb-2">Loan Amount</label>
            <input
                type="number"
                className="border px-2  w-full rounded text-md mb-2"
                name="loan_amount"
                style={{height:'50px'}}
                placeholder="200000"
                value={data.loan_amount}
                onChange={(e)=>onFormInputChange('loan_amount', e.target.value)}
              />
            {errors && errors?.loan_amount && <p className="text-red-500 text-sm">{errors?.loan_amount}</p>}
          </div>
          {/* /.form-group */}

          <div className="px-2  w-full lg:w-3/12  form-group mb-6">
            <label className="block mb-2">SEO</label>
            <input
                type="seo"
                className="border px-2  w-full rounded text-md mb-2"
                name="seo"
                style={{height:'50px'}}
                placeholder=""
                value={data.seo}
                onChange={(e)=>onFormInputChange('seo', e.target.value)}
              />
            {errors && errors?.seo && <p className="text-red-500 text-sm">{errors?.seo}</p>}
          </div>
          {/* /.form-group */}

        </div>

      
    </div>
  );
};

export default Finance;
