import React from "react";
import PropTypes from 'prop-types';

const Address = ({ errors, onInputChange}) => {
  const onFormInputChange = (name,value) => {
    onInputChange(name, value)
  }
  return (
    <div className="space-y-5  mb-6">
      <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5">
        <div className="text-xl font-medium capitalize">Address</div>
        
        <div className="flex flex-wrap justify-between -mx-2 mb-6">
          <div className="px-2  w-full lg:w-6/12  form-group mb-6">
            <label className="block mb-2">Zone</label>
            <input
              type="text"
              className="border px-2  w-full rounded text-md mb-2"
              name="zone"
              style={{height:'50px'}}
              placeholder="Bagmati"
              onChange={(e)=>onFormInputChange('zone', e.target.value)}
            />
            {errors && errors?.zone && <p className="text-red-500 text-sm">{errors?.zone}</p>}
          </div>
          {/* /.form-group */}
          <div className="px-2  w-full lg:w-6/12  form-group mb-6">
            <label className="block mb-2">District</label>
            <input
              type="text"
              className="border px-2  w-full rounded text-md mb-2"
              name="district"
              style={{height:'50px'}}
              placeholder="Kathmandu"
              onChange={(e)=>onFormInputChange('district', e.target.value)}
            />
            {errors && errors?.district && <p className="text-red-500 text-sm">{errors?.district}</p>}
          </div>
          {/* /.form-group */}
          <div className="px-2  w-full lg:w-6/12  form-group mb-6">
            <label className="block mb-2">Town</label>
            <input
              type="text"
              className="border px-2  w-full rounded text-md mb-2"
              name="town"
              style={{height:'50px'}}
              placeholder="NewRoad"
              onChange={(e)=>onFormInputChange('town', e.target.value)}
            />
            {errors && errors?.town && <p className="text-red-500 text-sm">{errors?.town}</p>}
          </div>
          {/* /.form-group */}
          <div className="px-2  w-full lg:w-6/12  form-group mb-6">
            <label className="block mb-2">Tole</label>
            <input
              type="text"
              className="border px-2  w-full rounded text-md mb-2"
              name="tole"
              style={{height:'50px'}}
              placeholder=""
              onChange={(e)=>onFormInputChange('tole', e.target.value)}
            />
            {errors && errors?.tole && <p className="text-red-500 text-sm">{errors?.tole}</p>}
          </div>
          {/* /.form-group */}
          <div className="px-2  w-full lg:w-6/12  form-group mb-6">
            <label className="block mb-2">Street</label>
            <input
              type="text"
              className="border px-2  w-full rounded text-md mb-2"
              name="street"
              style={{height:'50px'}}
              placeholder=""
              onChange={(e)=>onFormInputChange('street', e.target.value)}
            />
            {errors && errors?.street && <p className="text-red-500 text-sm">{errors?.street}</p>}
          </div>
          {/* /.form-group */}

          <div className="px-2  w-full lg:w-6/12  form-group mb-6">
            <label className="block mb-2">VDC/NP/MNP</label>
            <input
              type="text"
              className="border px-2  w-full rounded text-md mb-2"
              name="vdc_np_mnp"
              style={{height:'50px'}}
              placeholder=""
              onChange={(e)=>onFormInputChange('vdc_np_mnp', e.target.value)}
            />
            {errors && errors?.tole && <p className="text-red-500 text-sm">{errors?.vdc_np_mnp}</p>}
          </div>
          {/* /.form-group */}

          <div className="px-2  w-full lg:w-6/12  form-group mb-6">
            <label className="block mb-2">Ward Number</label>
            <input
              type="text"
              className="border px-2  w-full rounded text-md mb-2"
              name="ward_no"
              style={{height:'50px'}}
              placeholder=""
              onChange={(e)=>onFormInputChange('ward_no', e.target.value)}
            />
            {errors && errors?.ward_no && <p className="text-red-500 text-sm">{errors?.ward_no}</p>}
          </div>
          {/* /.form-group */}
          
        </div>
      </div>
      {/* <div className="relative ">
        <iframe
          width="100%"
          height="400"
          id="gmap_canvas"
          src="https://maps.google.com/maps?q=2880%20Broadway,%20New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          className="relative"
        ></iframe>
        <div className="absolute space-x-5 top-3 left-3 bg-transparent rounded shadow z-10 flex items-center">
          <div className="rounded-lg bg-white p-3 text-sm border">
            <button className="pr-5">sjhbdjh</button>
            <button>sjhbdjh</button>
          </div>
          <input
            type={"text"}
            className="bg-white border p-2 rounded shadow"
            placeholder="Enter a location"
          />
        </div>
      </div> */}
    </div>
  );
};

Address.propTypes = {
  propertyStatus: PropTypes.array,
  completionYear: PropTypes.string,
  url:PropTypes.string,
  availabilityDate:PropTypes.string,
  errors:  PropTypes.object,
  data: PropTypes.object
}

Address.defaultProps = {
  propertyStatus:[],
  completionYear:'',
  url:'',
  availabilityDate:'',
  errors: null,
  data: null,
}

export default Address;
