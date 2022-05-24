import React from "react";
import PropTypes from 'prop-types';

const ExpectedPrice = ({errors,onInputChange}) => {
  const onFormInputChange = (name,value) => {
    onInputChange(name, value)
  }
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5  mb-6">
      <div className="text-xl font-medium capitalize">Expected Price</div>

      <div className="flex flex-wrap justify-between -mx-2 mb-6">
        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Unit Price Per Anna</label>
          <input
              type="text"
              className="border px-2  w-full rounded text-md mb-2"
              name="anna_price"
              style={{height:'50px'}}
              placeholder="NRs. 10,000"
              onChange={(e)=>onFormInputChange('anna_price', e.target.value)}
            />
          {errors && errors?.anna_price && <p className="text-red-500 text-sm">{errors?.anna_price}</p>}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Building Price Per Square Feet</label>
          <input
              type="text"
              className="border px-2  w-full rounded text-md mb-2"
              name="sqft_price"
              style={{height:'50px'}}
              placeholder="NRs. 10,000"
              onChange={(e)=>onFormInputChange('sqft_price', e.target.value)}
            />
          {errors && errors?.sqft_price && <p className="text-red-500 text-sm">{errors?.sqft_price}</p>}
        </div>
        {/* /.form-group */}
      </div>
    </div>
  );
};

ExpectedPrice.propTypes = {
  errors:  PropTypes.object,
  data: PropTypes.object,
  onInputChange: PropTypes.func
}

ExpectedPrice.defaultProps = {
  errors: null,
  data: null,
}

export default ExpectedPrice;
