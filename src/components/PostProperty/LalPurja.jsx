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
                value={data.land_area_in_dhur_lal}
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
                value={data.land_area_in_anna_lal}
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
                value={data.land_area_in_katha_lal}
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
                value={data.land_area_in_bigha_lal}
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
                value={data.land_area_in_ropani_lal}
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
                value={data.land_area_in_sqft_lal}
                onChange={(e)=>onFormInputChange('land_area_in_sqft_lal', e.target.value)}
              />
            {errors && errors?.land_area_in_sqft_lal && <p className="text-red-500 text-sm">{errors?.land_area_in_sqft_lal}</p>}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-3/12  form-group mb-6">
          <label className="block mb-2">Land Area In Barga meter</label>
          <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="land_area_in_meters_lal"
                style={{height:'50px'}}
                value={data.land_area_in_meters_lal}
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
                name="geometry_of_land"
                style={{height:'50px'}}
                value={data.geometry_of_land}
                onChange={(e)=>onFormInputChange('geometry_of_land', e.target.value)}
              />
            {errors && errors?.geometry_of_land && <p className="text-red-500 text-sm">{errors?.main_road_width}</p>}
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

            <option value="" >Select</option>
            <option selected={data.elevation.toLowerCase() === 'east'?'selected':''}>East</option>
            <option selected={data.elevation.toLowerCase() === 'west'?'selected':''}>West</option>
            <option selected={data.elevation.toLowerCase() === 'north'?'selected':''}>North</option>
            <option selected={data.elevation.toLowerCase() === 'south'?'selected':''}>South</option>
            <option selected={data.elevation.toLowerCase() === 'south-east'?'selected':''}>South-East</option>
            <option selected={data.elevation.toLowerCase() === 'south-west'?'selected':''}>South-West</option>
            <option selected={data.elevation.toLowerCase() === 'north-east'?'selected':''}>North-East</option>
            <option selected={data.elevation.toLowerCase() === 'north-west'?'selected':''}>North-West</option>
          </select>
          {errors && errors?.elevation && <p className="text-red-500 text-sm">{errors?.elevation}</p>}
        </div>
        {/* /.form-group */}
      </div>
      
    </div>
  );
};

export default LalPurja;
