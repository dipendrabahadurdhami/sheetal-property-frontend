import { Field, Formik, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import axios from "axios";

import ListBox from "../components/Common/ListBox";

const RequirementForm = () => {
  const [properties,setProperties] = useState(null);
  const [loading, setLoading]= useState(false);
  const [tenant, setTenant] = useState(null);
  const Vehicle = [
    { name: "Two Wheeler" },
    { name: "There Wheeler" },
    { name: "Four Wheeler" },
  ];
  const Requirements = [
    { name: "Room" },
    { name: "Flat" },
    { name: "House" },
    { name: "Apartment" },
  ];

  const allProperties = async () => {
    setLoading(true);
    await axios.get(`${process.env.REACT_APP_API_LINK}/property-attributes`).then(res=>{
      if(res.status  === 200){
        setLoading(false);
        setProperties(res.data.data);

        console.log(res.data.data)
      }else{
        setLoading(false);
      }
    });
   

  };
  useEffect(()=>{
    allProperties();
  },[])
  // const Facilities = [{ name: "Electricity", value:"Electricity" }, { name: "Water", value:'Water' }, { name: "Parking", value: 'parking' },{name: "Drainage", value: 'drainage'}];

  // const formik = useFormik({
  //   initialValues: {
  //     name: "",
  //     email: "",
  //     permanent_address: "",
  //     temporary_address: "",
  //     contact_number: "",
  //     occupation: "",
  //     prefered_location: "",
  //     maximun_budget: "",
  //     tenant_option: "",
  //     requirements: "",
  //     vehicle: "",
  //     facilities: [],
  //     description: "",
  //   },
  //   onSubmit

  // })

  // const [values,setValues] = useState({
  //   name: "",
  //   email: "",
  //   permanent_address: "",
  //   temporary_address:"",
  //   contact_number: "",
  //   occupation: "",
  //   prefered_location:"",
  //   maximun_budget: "",
  //   tenant_option:"",
  //   requirements:"",
  //   vehicle:"",
  //   facilities: [],
  //   description:"",

  //   formData:""
  // })

  // const handleChange =(e) => {
  //   console.log(e);

  //     return setValues((oldValue)=>{
  //       return {...oldValue,[e.target.name]:e.target.value}

  //     })
  // }

  // const {name,email,permanent_address,temporary_address,contact_number,occupation,prefered_location,maximun_budget,tenant_option,requirements,vehicle,facilities,description,formData} = values

  return (
    <div className="flex justify-center px-5 py-10 sm:p-5 lg:p-10 xl:p-24">
      <div className="w-full">
        <h1 className="text-3xl font-bold w-full text-center  pb-10">
          Requirement Form{" "}
        </h1>
        <Formik
          initialValues={{
            name: "",
            email: "",
            permanent_address: "",
            temporary_address: "",
            contact_number: "",
            occupation: "",
            prefered_location: "",
            maximum_budget: "",
            tenant_option: "",
            requirements: "",
            vehicle: "",
            facilities: [],
            description: "",
          }}
          onSubmit={async (values, { resetForm }) => {
            const axiosConfig = {
              headers: {
                "Content-Type": "application/json",
              },
            };
            await axios.post(
              `${process.env.REACT_APP_API_LINK}/requirement-form`,
              values,
              axiosConfig
            );
            alert("Submitted Successfully")
            resetForm({ values: "" });
          }}
        >
          {({ values, handleSubmit, handleChange, isSubmitting }) => (
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="flex flex-col space-y-2">
                <span>Name *</span>
                <Field
                  type="text"
                  className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                  placeholder="Enter your name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span>Temporary Address *</span>
                <Field
                  type={"text"}
                  className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                  placeholder="Enter your temporary address"
                  name="temporary_address"
                  value={values.temporary_address}
                  onChange={handleChange}
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span>Permanent Address *</span>
                <Field
                  type={"text"}
                  className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                  placeholder="Enter your permanent address"
                  name="permanent_address"
                  value={values.permanent_address}
                  onChange={handleChange}
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span>Contact number *</span>
                <Field
                  type={"Number"}
                  className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                  placeholder="Enter your contact number"
                  name="contact_number"
                  value={values.contact_number}
                  onChange={handleChange}
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span>Email Address *</span>
                <Field
                  type={"email"}
                  className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                  placeholder="Enter your email address"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span>Occupation *</span>
                <Field
                  className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                  placeholder="Enter your email address"
                  name="occupation"
                  value={values.occupation}
                  onChange={handleChange}
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span>Preferred location</span>
                <Field
                  className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                  placeholder="Enter your preferred location"
                  name="prefered_location"
                  value={values.prefered_location}
                  onChange={handleChange}
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span>Maximum budget</span>
                <Field
                  className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                  placeholder="Enter your maximum budget"
                  name="maximum_budget"
                  value={values.maximun_budget}
                  onChange={handleChange}
                />
              </label>

              <label className="flex flex-col space-y-2">
                <span>Tenant option</span>
                {/* <ListBox list={TenantOption} name="tenant_option" value ={values.tenant_option}   onChange={handleChange} /> */}
                <Field
                  as="select"
                  name="tenant_option"
                  onChange={handleChange}
                  className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                >
                  <option value="">Select</option>
                  {properties && properties?.purposes && properties?.purposes.map((purpose,i)=>{
                    return (<option value={purpose.name} key={i}>{purpose.name}</option>)
                  })}
                </Field>
              </label>
              <label className="flex flex-col space-y-2">
                <span>Requirements</span>
                {/* <ListBox
                  list={Requirements}
                  name="requirements"
                  value={values.requirements}
                  onChange={handleChange}
                /> */}
                <Field
                  as="select"
                  name="requirements"
                  onChange={handleChange}
                  className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                >
                  <option value="">Select</option>
                  <option value="room">Room</option>
                  <option value="flat">Flat </option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="land">Land</option>
                </Field>
              </label>
              <label className="flex flex-col space-y-2">
                <span>Vehicle</span>
                {/* <ListBox
                  list={Vehicle}
                  name="vehicle"
                  value={values.vehicle}
                  onChange={handleChange}
                /> */}
                <Field
                  as="select"
                  name="vehicle"
                  onChange={handleChange}
                  className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                >
                  <option value="">Select</option>
                  <option value="two">Two Wheelers</option>
                  <option value="three">Three Wheelers </option>
                  <option value="four">Four Wheelers</option>
                </Field>
              </label>
              <label className="flex flex-col space-y-2">
                <span>Facilities</span>

                <div role="group" className="-mx-4 flex flex-wrap" aria-labelledby="checkbox-group">
                  {properties && properties?.facilities && properties?.facilities.map((facility,i)=>{
                    return(
                    <label key={i} className="px-4">
                      <Field type="checkbox" name="facilities" value={facility.name} />
                      <span className="ml-2">{facility.name}</span>
                    </label>
                    )
                  })}
              </div>


              </label>

              <label className="flex flex-col space-y-2">
                <span> Description (if any)</span>
                <textarea
                  rows={7}
                  className="text-gray-500 border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                  placeholder="Enter your name"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                />
              </label>
              <button
                className="bg-red-700 px-10 md:px-24  p-3 font-bold text-white rounded-lg"
                type="submit"
                disabled={isSubmitting}
              >
                Submit
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default RequirementForm;
