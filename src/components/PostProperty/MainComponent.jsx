
import { object } from "prop-types";
import React, { useEffect, useState } from "react";
import apiClient from "../../utils/apiClient";
import AboutProperty from "./AboutProperty";
import Address from "./Address";
import AdvertisementTypes from "./AdvertisementTypes";

import DocumentsTypes from "./DocumentsTypes";
import ExpectedPrice from "./ExpectedPrice";
import Finance from "./Finance";
import Video from "./Video";
import LalPurja from "./LalPurja";
import LandMeasurements from "./LandMeasurements";

import MyProperty from "./MyProperty";
import OtherDetails from "./OtherDetails";
import RoadAccess from "./RoadAccess";
import SalesDetails from "./SalesDetails";
import Uploads from "./Uploads";
import MapWithASearchBox from "../MapWithSearch";

const MainComponent = (props) => {
  const [propertyAttributes, setPropertyAtributes] = useState(null);
  const [errors,setErrors] = useState(null);
  const [form,setForm] = useState({
    propertytype_id: null,
    category_id: null,
    class_id:null,
    name:'',
    featured_image:'',
    expiry_date:null,


    advertisement_type:'',
    purpose_id:'',
    commission:'',
    owner_info:'',


    property_status:'',
    completion_year:'',
    url:'',
    availability_from:'',

    zone:'',
    district:'',
    town:'',
    tol:'',
    street:'',
    vdc_np_mnp:'',
    ward_no:'',

    anna_price:'',
    sqft_price:'',

    urgency_id:'',
    advance:'',
    selling_price:'',
    rent_per_month:'',
    min_lease:'',
    min_deposit:'',
    broker_response:'yes',


    property_highlights:'',
    property_description:'',
    other_description:'',

    location:'',
    lat:'',
    lng:''

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

  const handleFileInputChange = (name, file) => {
    console.log(file)
    setForm({
      ...form,
      [name]:file
    })
  }
  
  const validate = () => {
    const errors =  {};
    if(!form.propertytype_id) errors.propertytype_id = "Please select one of property type";
    if(!form.category_id) errors.category_id = "Please select one of category type";
    if(!form.class_id) errors.class_id = "Please select one of class type";
    if(!form.name) errors.name = "Please enter property name";
    if(!form.advertisement_type) errors.advertisement_type = "Please select one of advertisement type";
    if(!form.purpose_id) errors.purpose_id = "Please select one of advertisement purpose";

    if(!form.property_status) errors.property_status = "Please select one  property status";
    setErrors(errors);
    return errors;
  }

  const mapLocation = (lat, lng, address) => {
    alert("hello")
    setForm({
      ...form,
      lat:lat,
      lng:lng,
      location: address
    });
   
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
      const _errors =validate();
      if(object.keys(_errors).length > 0){
        return false;
      }

      const formData = new FormData();


      formData.append('name', form.name);
      formData.append('propertytype_id',form.propertytype_id);
      formData.append('category_id',form.category_id);
      formData.append('feature_image',form.featured_image);
      formData.append('class_id',form.class_id);
      formData.append('expiry_date',form.expiry_date);



      formData.append('advertisement_type',form.advertisement_type);
      formData.append('purpose_id', form.purpose_id);
      formData.append('commission', form.commission);
      formData.append('owner_info', form.owner_info);
      formData.append('property_status', form.property_status);
      formData.append('completion_year', form.completion_year);
      formData.append('url', form.url);
      formData.append('availability_from', form.availability_from);


      formData.append('zone',form.zone);
      formData.append('district',form.district);
      formData.append('town',form.town);
      formData.append('tol',form.tol);
      formData.append('street',form.street);
      formData.append('vdc_np_mnp',form.vdc_np_mnp);
      formData.append('ward_no',form.ward_no);


      formData.append('anna_price',form.anna_price);
      formData.append('sqft_price',form.sqft_price);


      formData.append('urgency_id',form.urgency_id);
      formData.append('advance',form.advance);
      formData.append('selling_price',form.selling_price);
      formData.append('rent_per_month', form.rent_per_month);
      formData.append('min_lease',form.min_lease);
      formData.append('min_deposit',form.min_deposit);
      formData.append('broker_response',form.broker_response);


      formData.append('property_highlights',form.property_highlights);
      formData.append('property_description',form.property_description);
      formData.append('other_description',form.other_description);


      formData.append('location','');
      formData.append('lat','');
      formData.append('lng','');

      // exterior_look_id[0]
      // exterior_look_id[1]
      // interior_look_id[0]
      // interior_look_id[1]
      {/*
      formData.append('total_price','');
      formData.append('property_location','');
      formData.append('purpose_id','');
      formData.append('property_description','');
      formData.append('advertisement_type','');
      formData.append('commission','');
      formData.append('owner_info','');
      formData.append('property_status','');
      formData.append('completion_year','');
      formData.append('url','');
      formData.append('availability_from','');
      formData.append('zone','');
      formData.append('district','');
      formData.append('town','');
      formData.append('tol','');
      formData.append('street','');
      formData.append('vdc_np_mnp','');
      formData.append('ward_no','');
      formData.append('property_highlights','');
      formData.append('other_description','');
      formData.append('kitchens','');
      formData.append('floors','');
      formData.append('bedrooms','');
      formData.append('bathrooms','');
      formData.append('shutters','');
      formData.append('living_room','');
      formData.append('rooms_per_floor','');
      formData.append('parking','');
      formData.append('garage','');
      formData.append('size_of_pillars','');
      formData.append('no_of_pillars','');
      formData.append('capacity_of_water_tank','');
      formData.append('land_area_in_dhur_lal','');
      formData.append('land_area_in_anna_lal','');
      formData.append('land_area_in_katha_lal','');
      formData.append('land_area_in_bigha_lal','');
      formData.append('land_area_in_ropani_lal','');
      formData.append('land_area_in_sqft_lal','');
      formData.append('land_area_in_meters_lal','');
      formData.append('geometry_of_land','');
      formData.append('elevation','');
      document[0]
      document[1]
      formData.append('location','');
      formData.append('lat','');
      formData.append('lng','');
      formData.append('anna_price','');
      formData.append('sqft_price','');
      formData.append('main_road_width','');
      formData.append('side_road_width','');
      formData.append('road_wide_facing_the_land','');
      formData.append('mohoda_facing_the_land','');
      formData.append('status_of_road','');
      formData.append('finance_bank_name','');
      formData.append('loan_amount','');
      formData.append('youtube_url','');
      formData.append('urgency_id','');
      formData.append('advance','');
      formData.append('selling_price','');
      formData.append('rent_per_month','');
      formData.append('min_lease','');
      formData.append('min_deposit','');
      formData.append('broker_response','');
      formData.append('sources_of_waters','');
      formData.append('seo','');
    */}
  }

  return (
    <div>
     
        <div className="space-y-5">
          <form onSubmit={handleFormSubmit}>
            <MyProperty 
              propertyType={propertyAttributes?.data?.property_types} 
              categoryType={propertyAttributes?.data?.categories}
              classType={propertyAttributes?.data?.class_types}
              data={form}
              errors={errors}
              onInputChange={handleFormInputChange}
              onFileChange={handleFileInputChange}/>

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
              urgencies={propertyAttributes?.data?.urgency_types}

              data={form}
              errors={errors}
              onInputChange={handleFormInputChange}
            />
            <AboutProperty 
             data={form}
             errors={errors}
             onInputChange={handleFormInputChange}
             />

               
            <MapWithASearchBox  
              google={props?.google}
              center={{ lat: 27.7014202, lng: 85.3128947 }}
              height="300px"
              zoom={15}
              mapLocation={mapLocation}
              />

            <OtherDetails 
              data={form}
              errors={errors}
              onInputChange={handleFormInputChange}
            />
            <RoadAccess 
              data={form}
              errors={errors}
              onInputChange={handleFormInputChange}
            />
            <LalPurja 
              data={form}
              errors={errors}
              onInputChange={handleFormInputChange}
            />
            {/*<LandMeasurements />*/}
            <Finance 
             data={form}
             errors={errors}
             onInputChange={handleFormInputChange}
             />
            <Video 
              data={form}
              errors={errors}
              onInputChange={handleFormInputChange}/>
          
          
            <Uploads
              data={form}
              errors={errors}
              onInputChange={handleFormInputChange}
            />
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
