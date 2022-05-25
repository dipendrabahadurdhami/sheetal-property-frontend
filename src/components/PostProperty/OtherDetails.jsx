import React from "react";


const OtherDetails = ({data,errors,onInputChange}) => {
  const onFormInputChange = (name,value) => {
    onInputChange(name, value)
  }
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5 mb-6">
      <div className="text-xl font-medium capitalize">Other Details</div>
      <div className="flex flex-wrap justify-between -mx-2 mb-6">
          <div className="px-2  w-full lg:w-3/12  form-group mb-6">
            <label className="block mb-2">Number of Kitchens</label>
            <input
                type="number"
                className="border px-2  w-full rounded text-md mb-2"
                name="kitchens"
                style={{height:'50px'}}
                placeholder="3"
                value={data.kitchen}
                onChange={(e)=>onFormInputChange('kitchens', e.target.value)}
              />
            {errors && errors?.kitchen && <p className="text-red-500 text-sm">{errors?.kitchen}</p>}
          </div>
          {/* /.form-group */}

          <div className="px-2  w-full lg:w-3/12  form-group mb-6">
            <label className="block mb-2">Number of Floors</label>
            <input
                type="number"
                className="border px-2  w-full rounded text-md mb-2"
                name="floors"
                style={{height:'50px'}}
                placeholder="3"
                value={data.floors}
                onChange={(e)=>onFormInputChange('floors', e.target.value)}
              />
            {errors && errors?.floors && <p className="text-red-500 text-sm">{errors?.floors}</p>}
          </div>
          {/* /.form-group */}

          <div className="px-2  w-full lg:w-3/12  form-group mb-6">
            <label className="block mb-2">Number of Bedrooms</label>
            <input
                type="number"
                className="border px-2  w-full rounded text-md mb-2"
                name="bedrooms"
                style={{height:'50px'}}
                placeholder="3"
                value={data.bedrooms}
                onChange={(e)=>onFormInputChange('bedrooms', e.target.value)}
              />
            {errors && errors?.bedrooms && <p className="text-red-500 text-sm">{errors?.bedrooms}</p>}
          </div>
          {/* /.form-group */}

          <div className="px-2  w-full lg:w-3/12  form-group mb-6">
            <label className="block mb-2">Number of Bathrooms</label>
            <input
                type="number"
                className="border px-2  w-full rounded text-md mb-2"
                name="bathrooms"
                style={{height:'50px'}}
                placeholder="3"
                value={data.bathrooms}
                onChange={(e)=>onFormInputChange('bathrooms', e.target.value)}
              />
            {errors && errors?.bathrooms && <p className="text-red-500 text-sm">{errors?.bathrooms}</p>}
          </div>
          {/* /.form-group */}


          <div className="px-2  w-full lg:w-3/12  form-group mb-6">
            <label className="block mb-2">Number of Shutters</label>
            <input
                type="number"
                className="border px-2  w-full rounded text-md mb-2"
                name="shutters"
                style={{height:'50px'}}
                placeholder="1"
                value={data.shutters}
                onChange={(e)=>onFormInputChange('shutters', e.target.value)}
              />
            {errors && errors?.shutters && <p className="text-red-500 text-sm">{errors?.shutters}</p>}
          </div>
          {/* /.form-group */}

          <div className="px-2  w-full lg:w-3/12  form-group mb-6">
            <label className="block mb-2">Number of Living Rooms</label>
            <input
                type="number"
                className="border px-2  w-full rounded text-md mb-2"
                name="living_room"
                style={{height:'50px'}}
                placeholder="1"
                value={data.living_room}
                onChange={(e)=>onFormInputChange('living_room', e.target.value)}
              />
            {errors && errors?.living_room && <p className="text-red-500 text-sm">{errors?.living_room}</p>}
          </div>
          {/* /.form-group */}

          <div className="px-2  w-full lg:w-3/12  form-group mb-6">
            <label className="block mb-2">Rooms Per Floor</label>
            <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="rooms_per_floor"
                style={{height:'50px'}}
                placeholder="4"
                value={data.rooms_per_floor}
                onChange={(e)=>onFormInputChange('rooms_per_floor', e.target.value)}
              />
            {errors && errors?.rooms_per_floor && <p className="text-red-500 text-sm">{errors?.rooms_per_floor}</p>}
          </div>
          {/* /.form-group */}
          <div className="px-2  w-full lg:w-3/12  form-group mb-6">
            <label className="block mb-2">Parking</label>
            <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="parking"
                style={{height:'50px'}}
                placeholder="Available"
                value={data.parking}
                onChange={(e)=>onFormInputChange('parking', e.target.value)}
              />
            {errors && errors?.parking && <p className="text-red-500 text-sm">{errors?.parking}</p>}
          </div>
          {/* /.form-group */}

          <div className="px-2  w-full lg:w-3/12  form-group mb-6">
            <label className="block mb-2">Garage</label>
            <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="garage"
                style={{height:'50px'}}
                value={data.garage}
                onChange={(e)=>onFormInputChange('garage', e.target.value)}
              />
            {errors && errors?.garage && <p className="text-red-500 text-sm">{errors?.garage}</p>}
          </div>
          {/* /.form-group */}


          <div className="px-2  w-full lg:w-3/12  form-group mb-6">
            <label className="block mb-2">Size of Pillars</label>
            <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="size_of_pillars"
                style={{height:'50px'}}
                value={data.size_of_pillars}
                onChange={(e)=>onFormInputChange('size_of_pillars', e.target.value)}
              />
            {errors && errors?.size_of_pillars && <p className="text-red-500 text-sm">{errors?.size_of_pillars}</p>}
          </div>
          {/* /.form-group */}


          <div className="px-2  w-full lg:w-3/12  form-group mb-6">
            <label className="block mb-2">Number of Pillars</label>
            <input
                type="number"
                className="border px-2  w-full rounded text-md mb-2"
                name="no_of_pillars"
                style={{height:'50px'}}
                value={data.no_of_pillars}
                onChange={(e)=>onFormInputChange('no_of_pillars', e.target.value)}
              />
            {errors && errors?.no_of_pillars && <p className="text-red-500 text-sm">{errors?.no_of_pillars}</p>}
          </div>
          {/* /.form-group */}


          <div className="px-2  w-full lg:w-3/12  form-group mb-6">
            <label className="block mb-2">Source of Water</label>
            <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="source_of_waters"
                style={{height:'50px'}}
                value={data.source_of_waters}
                onChange={(e)=>onFormInputChange('source_of_waters', e.target.value)}
              />
            {errors && errors?.source_of_waters && <p className="text-red-500 text-sm">{errors?.source_of_waters}</p>}
          </div>
          {/* /.form-group */}

          <div className="px-2  w-full lg:w-3/12  form-group mb-6">
            <label className="block mb-2">Capacity of Water Tank</label>
            <input
                type="text"
                className="border px-2  w-full rounded text-md mb-2"
                name="capacity_of_water_tank"
                style={{height:'50px'}}
                placeholder="1000 ltr"
                value={data.capacity_of_water_tank}
                onChange={(e)=>onFormInputChange('capacity_of_water_tank', e.target.value)}
              />
            {errors && errors?.capacity_of_water_tank && <p className="text-red-500 text-sm">{errors?.capacity_of_water_tank}</p>}
          </div>
          {/* /.form-group */}
      </div>
    </div>
  );
};

export default OtherDetails;
