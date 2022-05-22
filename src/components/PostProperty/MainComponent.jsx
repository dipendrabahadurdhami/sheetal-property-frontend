
import { object } from "prop-types";
import React, { useEffect, useState } from "react";
import apiClient from "../../utils/apiClient";
import AboutProperty from "./AboutProperty";
import Address from "./Address";
import AdvertisementTypes from "./AdvertisementTypes";

import DocumentsTypes from "./DocumentsTypes";
import ExpectedPrice from "./ExpectedPrice";
import Finance from "./Finance";
import LalPurja from "./LalPurja";
import LandMeasurements from "./LandMeasurements";

import MyProperty from "./MyProperty";
import OtherDetails from "./OtherDetails";
import RoadAccess from "./RoadAccess";
import SalesDetails from "./SalesDetails";
import UploadImage from "./UploadImage";

const MainComponent = () => {
  const [propertyAttributes, setPropertyAtributes] = useState(null);
  const [errors,setErrors] = useState(null);
  const [form,setForm] = useState({
    propertytype_id: null,
    category_id: null,
    name:'',


    advertisement_type:'',
    purpose_id:'',
    commission:'',


    property_status:'',
    completion_year:'',
    url:'',


    unit_price_per_anna:'',
    building_price_per_square_feet:'',
  })



  useEffect(()=>{
    fetchPropertiesAttributes()
  },[])
  
  

  const fetchPropertiesAttributes = async () => {
      try{
         await apiClient.get('/property-attributes').then(res=>{
           if(res.status === 200){
             console.log(res.data)
             setPropertyAtributes(res.data)
           }
         }).catch(err=>{
           console.log(err)
         })
      }catch(error){
        console.error(error)
      }
  } 
  const handleFormInputChange = (name, value) => {
      setForm({
        ...form,
        [name]:value
      })
  }
  
  const validate = () => {
    const errors =  {};
    if(!form.propertytype_id) errors.propertytype_id = "Please select one of property type";
    if(!form.category_id) errors.category_id = "Please select one of category type";
    if(!form.name) errors.name = "Please enter property name";
    if(!form.advertisement_type) errors.advertisement_type = "Please select one of advertisement type";
    if(!form.purpose_id) errors.purpose_id = "Please select one of advertisement purpose";

    if(!form.property_status) errors.property_status = "Please select one  property status";
    setErrors(errors);
    return errors;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
      const _errors =validate();
      if(object.keys(_errors).length > 0){
        return false;
      }
  }

  return (
    <div>
     
        <div className="space-y-5">
          <form onSubmit={handleFormSubmit}>
            <MyProperty 
              propertyType={propertyAttributes?.data?.property_types} 
              categoryType={propertyAttributes?.data?.categories}
              data={form}
              errors={errors}
              onInputChange={handleFormInputChange}/>

            <AdvertisementTypes 
              advertisementType={propertyAttributes?.data?.advertisement_types}
              advertisementPurpose={propertyAttributes?.data?.purposes}
              advertisementCommission={propertyAttributes?.data?.commission_types}
              owners={propertyAttributes?.data?.owner_types}
              data={form}
              errors={errors}
              onInputChange={handleFormInputChange}/>

             <DocumentsTypes 
               propertyStatus={propertyAttributes?.data?.property_status}
               completionYear={propertyAttributes?.data?.completion_year}
               url={propertyAttributes?.data?.url}
               availabilityDate={propertyAttributes?.data?.availability_from}
               data={form}
               errors={errors}
               onInputChange={handleFormInputChange}/>
            
            <Address 
              data={form}
              errors={errors}
              onInputChange={handleFormInputChange}
            />
            <ExpectedPrice 

              data={form}
              errors={errors}
              onInputChange={handleFormInputChange}
            />
             <SalesDetails 
              urgencies={propertyAttributes?.data?.urgencies}
              data={form}
              errors={errors}
              onInputChange={handleFormInputChange}
            />
            {/*<AboutProperty />
            <OtherDetails />
            <RoadAccess />
            <LalPurja />
            <LandMeasurements />
            <Finance />
            <UploadImage /> */}
            <button
              type="submit"
              className="bg-red-700 text-white px-5 py-2 font-medium rounded"
            >
              Submit
            </button>
          </form>
        </div>
     
    </div>
  );
};

export default MainComponent;
