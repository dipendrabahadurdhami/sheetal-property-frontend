import React from "react";


const Video = ({errors, onInputChange, data}) => {
  const onFormInputChange = (name,value) => {
    onInputChange(name, value)
  }
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5 mb-6">
      <div className="text-xl font-medium capitalize">Video Section</div>
     
        <div className="flex flex-wrap justify-between -mx-2 mb-6">
          <div className="px-2  w-full lg:w-6/12  form-group mb-6">
            <label className="block mb-2">Youtube Video Url</label>
            <input
                type="number"
                className="border px-2  w-full rounded text-md mb-2"
                name="youtube_url"
                style={{height:'50px'}}
                placeholder="https://www.youtube.com/watch?v=DfuJi3hOlhE"
                onChange={(e)=>onFormInputChange('youtube_url', e.target.value)}
              />
            {errors && errors?.youtubve && <p className="text-red-500 text-sm">{errors?.youtube_url}</p>}
          </div>
          {/* /.form-group */}

         
        </div>

      
    </div>
  );
};

export default Video;
