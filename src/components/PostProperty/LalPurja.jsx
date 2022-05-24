import React from "react";


const LalPurja = ({data,errors,onInputChange}) => {
  const onFormInputChange = (name,value) => {
    onInputChange(name, value)
  }
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5 mb-6">
      <div className="text-xl font-medium capitalize">
        Land Area According to Lal Purja
      </div>
      <div className="flex flex-wrap justify-between -mx-2 mb-6">
        <div className="px-2  w-full lg:w-3/12  form-group mb-6">
          <label className="block mb-2">Land Area In Dhur</label>
          <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="land_area_in_dhur_lal"
                style={{height:'50px'}}
                
                onChange={(e)=>onFormInputChange('land_area_in_dhur_lal', e.target.value)}
              />
            {errors && errors?.land_area_in_dhur_lal && <p className="text-red-500 text-sm">{errors?.land_area_in_dhur_lal}</p>}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-3/12  form-group mb-6">
          <label className="block mb-2">Land Area In Anna</label>
          <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="land_area_in_anna_lal"
                style={{height:'50px'}}
                
                onChange={(e)=>onFormInputChange('land_area_in_anna_lal', e.target.value)}
              />
            {errors && errors?.land_area_in_anna_lal && <p className="text-red-500 text-sm">{errors?.land_area_in_anna_lal}</p>}
        </div>
        {/* /.form-group */}


        <div className="px-2  w-full lg:w-3/12  form-group mb-6">
          <label className="block mb-2">Land Area In Katha</label>
          <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="land_area_in_katha_lal"
                style={{height:'50px'}}
                
                onChange={(e)=>onFormInputChange('land_area_in_katha_lal', e.target.value)}
              />
            {errors && errors?.land_area_in_katha_lal && <p className="text-red-500 text-sm">{errors?.land_area_in_katha_lal}</p>}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-3/12  form-group mb-6">
          <label className="block mb-2">Land Area In Bigha</label>
          <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="land_area_in_bigha_lal"
                style={{height:'50px'}}
                
                onChange={(e)=>onFormInputChange('land_area_in_bigha_lal', e.target.value)}
              />
            {errors && errors?.land_area_in_bigha_lal && <p className="text-red-500 text-sm">{errors?.land_area_in_bigha_lal}</p>}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-3/12  form-group mb-6">
          <label className="block mb-2">Land Area In Ropani</label>
          <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="land_area_in_ropani_lal"
                style={{height:'50px'}}
                
                onChange={(e)=>onFormInputChange('land_area_in_ropani_lal', e.target.value)}
              />
            {errors && errors?.land_area_in_ropani_lal && <p className="text-red-500 text-sm">{errors?.land_area_in_ropani_lal}</p>}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-3/12  form-group mb-6">
          <label className="block mb-2">Land Area In Square Feet</label>
          <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="land_area_in_sqft_lal"
                style={{height:'50px'}}
                
                onChange={(e)=>onFormInputChange('land_area_in_sqft_lal', e.target.value)}
              />
            {errors && errors?.land_area_in_sqft_lal && <p className="text-red-500 text-sm">{errors?.land_area_in_sqft_lal}</p>}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-3/12  form-group mb-6">
          <label className="block mb-2">Land Area In Barganeter</label>
          <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="land_area_in_meters_lal"
                style={{height:'50px'}}
                
                onChange={(e)=>onFormInputChange('land_area_in_meters_lal', e.target.value)}
              />
            {errors && errors?.land_area_in_meters_lal && <p className="text-red-500 text-sm">{errors?.land_area_in_meters_lal}</p>}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-3/12  form-group mb-6">
          <label className="block mb-2">Geometry of Land</label>
          <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="main_road_width"
                style={{height:'50px'}}
                
                onChange={(e)=>onFormInputChange('main_road_width', e.target.value)}
              />
            {errors && errors?.main_road_width && <p className="text-red-500 text-sm">{errors?.main_road_width}</p>}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-3/12  form-group mb-6">
          <label className="block mb-2">Elevation</label>
          <select
            className="border px-2  w-full rounded text-md mb-2"
            name="elevation"
            style={{height:'50px'}}
            onChange={(e)=>onFormInputChange('elevation', e.target.value)}
          >

            <option value="">Select</option>
            <option>East</option>
            <option>West</option>
            <option>North</option>
            <option>South</option>
            <option>South-East</option>
            <option>South-West</option>
            <option>North-East</option>
            <option>North-West</option>
          </select>
          {errors && errors?.elevation && <p className="text-red-500 text-sm">{errors?.elevation}</p>}
        </div>
        {/* /.form-group */}
      </div>
      
    </div>
  );
};

export default LalPurja;
