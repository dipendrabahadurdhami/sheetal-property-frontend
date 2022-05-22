import React from "react";
import PropTypes from 'prop-types';

const AdvertisementTypes = ({advertisementType,advertisementPurpose, advertisementCommission, owners, onInputChange, errors}) => {

  const onFormInputChange = (name,value) => {
    onInputChange(name, value)
  }
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5  mb-6">
      <div className="text-xl font-medium capitalize mb-6">
        Advertisement & Types
      </div>
      <div className="flex flex-wrap justify-between -mx-2 mb-6">
          <div className="px-2  w-full lg:w-6/12  form-group mb-6">
            <label className="block mb-2">Advertisement Type</label>
            <select
              className="border px-2  w-full rounded text-md mb-2"
              name="advertisement_type"
              style={{height:'50px'}}
              onChange={(e)=>onFormInputChange('advertisement_type', e.target.value)}
            >

              <option value="">Choose your advertisement type</option>
              {advertisementType &&  advertisementType.map((item,i)=>{
                return <option value={item.id} key={i}>{item.name}</option>
              })}
            </select>
            {errors && errors?.advertisement_type && <p className="text-red-500 text-sm">{errors?.advertisement_type}</p>}
          </div>
          {/* /.form-group */}
          <div className="px-2  w-full lg:w-6/12  form-group  mb-6">
            <label className="block mb-2">Advertisement Purpose</label>
            <select
              className="border px-2  w-full rounded text-md mb-2"
              name="purpose_id"
              style={{height:'50px'}}
              onChange={(e)=>onFormInputChange('purpose_id', e.target.value)}
            >

              <option value="">Choose your advertisement purpose</option>
              {advertisementPurpose &&  advertisementPurpose.map((item,i)=>{
                return <option value={item.id} key={i}>{item.name}</option>
              })}
            </select>
            {errors && errors?.purpose_id && <p className="text-red-500 text-sm">{errors?.purpose_id}</p>}
          </div>
          {/* /.form-group */}
          <div className="px-2  w-full lg:w-6/12  form-group  mb-6">
            <label className="block mb-2">Commission</label>
            <select
              className="border px-2  w-full rounded text-md mb-2"
              name="commission"
              style={{height:'50px'}}
              onChange={(e)=>onFormInputChange('commission', e.target.value)}
            >

              <option value="">Choose your commission</option>
              {advertisementCommission &&  advertisementCommission.map((item,i)=>{
                return <option value={item.id} key={i}>{item.name}</option>
              })}
            </select>
            {errors && errors?.commission && <p className="text-red-500 text-sm">{errors?.commission}</p>}
          </div>
          {/* /.form-group */}

          <div className="px-2  w-full lg:w-6/12  form-group  mb-6">
            <label className="block mb-2">Owner Info</label>
            <select
              className="border px-2  w-full rounded text-md mb-2"
              name="owner_info"
              style={{height:'50px'}}
              onChange={(e)=>onFormInputChange('owner_info', e.target.value)}
            >

              <option value="">Choose Owner</option>
              {owners &&  owners.map((item,i)=>{
                return <option value={item.id} key={i}>{item.name}</option>
              })}
            </select>
            {errors && errors?.owner_info && <p className="text-red-500 text-sm">{errors?.owner_info}</p>}
          </div>
          {/* /.form-group */}
        </div>
    </div>
  );
};

AdvertisementTypes.propTypes = {
  advertisementType: PropTypes.array,
  advertisementPurpose: PropTypes.array,
  advertisementCommission: PropTypes.array,
  owners: PropTypes.array,
  errors:  PropTypes.object,
  data: PropTypes.object
}

AdvertisementTypes.defaultProps = {
  advertisementType:[],
  advertisementPurpose:[],
  advertisementCommission:[],
  owners:[],
  errors: null,
  data: null,
}


export default AdvertisementTypes;
