import React from "react";
import PropTypes from 'prop-types';

const DocumentsTypes = ({data,propertyStatus,completionYear,url,availabilityDate, errors, onInputChange}) => {
  const onFormInputChange = (name,value) => {
    onInputChange(name, value)
  }
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5  mb-6">
      <div className="text-xl font-medium capitalize">Documents & Types</div>

      <div className="flex flex-wrap justify-between -mx-2 mb-6">
        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Property Status</label>
          <select
            className="border px-2  w-full rounded text-md mb-2"
            name="property_status"
            style={{height:'50px'}}
          
            onChange={(e)=>onFormInputChange('property_status', e.target.value)}
          >

            <option value="">Choose your property status</option>
            {propertyStatus &&  propertyStatus.map((item,i)=>{
              return <option value={item.id} key={i} selected={item.id === data.property_status?'selected':''}>{item.name}</option>
            })}
          </select>
          {errors && errors?.property_status && <p className="text-red-500 text-sm">{errors?.property_status}</p>}
        </div>
        {/* /.form-group */}


        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Completion Year</label>
          <input
            type="text"
            className="border px-2  w-full rounded text-md mb-2"
            name="completion_year"
            style={{height:'50px'}}
            placeholder="2022"
            value={data.completion_year}
            onChange={(e)=>onFormInputChange('completion_year', e.target.value)}
          />
          {errors && errors?.completion_year && <p className="text-red-500 text-sm">{errors?.completion_year}</p>}
        </div>
        {/* /.form-group */}


        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">URL</label>
          <input
            type="url"
            className="border px-2  w-full rounded text-md mb-2"
            name="url"
            style={{height:'50px'}}
            value={data.url}
            onChange={(e)=>onFormInputChange('url', e.target.value)}
          />
          {errors && errors?.url && <p className="text-red-500 text-sm">{errors?.url}</p>}
        </div>
        {/* /.form-group */}


        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Availability From</label>
          <input
            type="date"
            className="border px-2  w-full rounded text-md mb-2"
            name="url"
            style={{height:'50px'}}
            value={data.availability_from}
            onChange={(e)=>onFormInputChange('availability_from', e.target.value)}
          />
          {errors && errors?.url && <p className="text-red-500 text-sm">{errors?.url}</p>}
        </div>
        {/* /.form-group */}


      </div>

        {/* <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Property Status"
          label="Property Status"
          placeHolder="Choose your Property Status"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Completion Year"
          label="Completion Year"
          placeHolder="Choose your Completion Year"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="Completion Year"
          label="Completion Year"
          placeHolder="Choose your Completion Year"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        />
        <FormikSelect
          containerClassname="space-y-2"
          className="col-span-2 border py-2 px-2"
          name="URL "
          label="URL "
          placeHolder="Choose your URL"
          options={[
            { label: "Enabled", value: "ENABLED" },
            { label: "Disabled", value: "DISABLED" },
          ]}
          isRequired={true}
        /> */}

    </div>
  );
};

DocumentsTypes.propTypes = {
  propertyStatus: PropTypes.array,
  completionYear: PropTypes.string,
  url:PropTypes.string,
  availabilityDate:PropTypes.string,
  errors:  PropTypes.object,
  data: PropTypes.object
}

DocumentsTypes.defaultProps = {
  propertyStatus:[],
  completionYear:'',
  url:'',
  availabilityDate:'',
  errors: null,
  data: null,
}

export default DocumentsTypes;
