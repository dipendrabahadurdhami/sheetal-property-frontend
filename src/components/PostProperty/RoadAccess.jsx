import React from "react";


const RoadAccess = ({errors, onInputChange, data}) => {
  const onFormInputChange = (name,value) => {
    onInputChange(name, value)
  }
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5 mb-6">
      <div className="text-xl font-medium capitalize">Road Access</div>

      <div className="flex flex-wrap justify-between -mx-2 mb-6">
        <div className="px-2  w-full lg:w-3/12  form-group mb-6">
          <label className="block mb-2">Main Road Width</label>
          <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="main_road_width"
                style={{height:'50px'}}

                value={data.main_road_width}
                onChange={(e)=>onFormInputChange('main_road_width', e.target.value)}
              />
            {errors && errors?.main_road_width && <p className="text-red-500 text-sm">{errors?.main_road_width}</p>}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-3/12  form-group mb-6">
          <label className="block mb-2">Side Road Width</label>
          <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="side_road_width"
                style={{height:'50px'}}
                value={data.side_road_width}
                onChange={(e)=>onFormInputChange('side_road_width', e.target.value)}
              />
            {errors && errors?.side_road_width && <p className="text-red-500 text-sm">{errors?.side_road_width}</p>}
        </div>
        {/* /.form-group */}


        <div className="px-2  w-full lg:w-3/12  form-group mb-6">
          <label className="block mb-2">Road while facing the land</label>
          <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="road_wide_facing_the_land"
                style={{height:'50px'}}
                value={data.road_wide_facing_the_land}
                onChange={(e)=>onFormInputChange('road_wide_facing_the_land', e.target.value)}
              />
            {errors && errors?.road_wide_facing_the_land && <p className="text-red-500 text-sm">{errors?.road_wide_facing_the_land}</p>}
        </div>
        {/* /.form-group */}


        <div className="px-2  w-full lg:w-3/12  form-group mb-6">
          <label className="block mb-2">Mohoda facing the land</label>
          <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="mohoda_facing_the_land"
                style={{height:'50px'}}
                value={data.mohoda_facing_the_land}
                onChange={(e)=>onFormInputChange('mohoda_facing_the_land', e.target.value)}
              />
            {errors && errors?.mohoda_facing_the_land && <p className="text-red-500 text-sm">{errors?.mohoda_facing_the_land}</p>}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-3/12  form-group mb-6">
          <label className="block mb-2">Status of Road</label>
          <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="status_of_road"
                style={{height:'50px'}}
                value={data.status_of_road}
                onChange={(e)=>onFormInputChange('status_of_road', e.target.value)}
              />
            {errors && errors?.status_of_road && <p className="text-red-500 text-sm">{errors?.status_of_road}</p>}
        </div>
        {/* /.form-group */}
      </div>
    </div>
  );
};

export default RoadAccess;
