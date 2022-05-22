import React from "react";
import PropTypes from 'prop-types';

const SalesDetails = ({onInputChange, errors, urgencies}) => {
  const onFormInputChange = (name,value) => {
    onInputChange(name, value)
  }
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5">
      <div className="text-xl font-medium capitalize">Sales Details</div>

      <div className="flex flex-wrap justify-between -mx-2 mb-6">
        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Urgency Type</label>
          <select
            className="border px-2  w-full rounded text-md mb-2"
            name="urgency_type"
            style={{height:'50px'}}
            onChange={(e)=>onFormInputChange('urgency_type', e.target.value)}
          >

            <option value="">Choose your advertisement type</option>
            {urgencies &&  urgencies.map((item,i)=>{
              return <option value={item.id} key={i}>{item.name}</option>
            })}
          </select>
          {errors && errors?.urgency_type && <p className="text-red-500 text-sm">{errors?.urgency_type}</p>}
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
