import React from "react";
import PropTypes from 'prop-types';

const SalesDetails = ({onInputChange, errors, urgencies}) => {
  const onFormInputChange = (name,value) => {
    onInputChange(name, value)
  }
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5 mb-6">
      <div className="text-xl font-medium capitalize">Sales Details</div>

      <div className="flex flex-wrap justify-between -mx-2 mb-6">
        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Urgency Type</label>
          <select
            className="border px-2  w-full rounded text-md mb-2"
            name="urgency_id"
            style={{height:'50px'}}
            onChange={(e)=>onFormInputChange('urgency_id', e.target.value)}
          >

            <option value="">Choose your urgency type</option>
            {urgencies &&  urgencies.map((item,i)=>{
              return <option value={item.id} key={i}>{item.name}</option>
            })}
          </select>
          {errors && errors?.urgency_id && <p className="text-red-500 text-sm">{errors?.urgency_id}</p>}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Bahina/Advance</label>
          <input
              type="text"
              className="border px-2  w-full rounded text-md mb-2"
              name="advance"
              style={{height:'50px'}}
              placeholder="NRs. 10,000"
              onChange={(e)=>onFormInputChange('advance', e.target.value)}
            />
          {errors && errors?.advance && <p className="text-red-500 text-sm">{errors?.advance}</p>}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Selling Price</label>
          <input
              type="text"
              className="border px-2  w-full rounded text-md mb-2"
              name="selling_price"
              style={{height:'50px'}}
              placeholder="NRs. 10,000"
              onChange={(e)=>onFormInputChange('selling_price', e.target.value)}
            />
          {errors && errors?.selling_price && <p className="text-red-500 text-sm">{errors?.selling_price}</p>}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Rent Per Month</label>
          <input
              type="text"
              className="border px-2  w-full rounded text-md mb-2"
              name="rent_per_month"
              style={{height:'50px'}}
              placeholder="NRs. 10,000"
              onChange={(e)=>onFormInputChange('rent_per_month', e.target.value)}
            />
          {errors && errors?.rent_per_month && <p className="text-red-500 text-sm">{errors?.rent_per_month}</p>}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Minimum Deposit</label>
          <input
              type="text"
              className="border px-2  w-full rounded text-md mb-2"
              name="min_deposit"
              style={{height:'50px'}}
              placeholder="NRs. 10,000"
              onChange={(e)=>onFormInputChange('min_deposit', e.target.value)}
            />
          {errors && errors?.min_deposit && <p className="text-red-500 text-sm">{errors?.min_deposit}</p>}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Minimum Lease Amount</label>
          <input
              type="text"
              className="border px-2  w-full rounded text-md mb-2"
              name="min_lease"
              style={{height:'50px'}}
              placeholder="NRs. 10,000"
              onChange={(e)=>onFormInputChange('min_lease', e.target.value)}
            />
          {errors && errors?.min_lease && <p className="text-red-500 text-sm">{errors?.min_lease}</p>}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Broker's Response</label>
          <select
            className="border px-2  w-full rounded text-md mb-2"
            name="broker_response"
            style={{height:'50px'}}
            onChange={(e)=>onFormInputChange('broker_response', e.target.value)}
          >

            <option value="">Choose your response</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors && errors?.broker_response && <p className="text-red-500 text-sm">{errors?.broker_response}</p>}
        </div>
        {/* /.form-group */}
      </div>
    </div>
  );
};


SalesDetails.propTypes = {
  errors:  PropTypes.object,
  data: PropTypes.object,
  onInputChange: PropTypes.func,
  urgencies: PropTypes.array
}

SalesDetails.defaultProps = {
  errors: null,
  data: null,
  urgencies:[]
}


export default SalesDetails;
