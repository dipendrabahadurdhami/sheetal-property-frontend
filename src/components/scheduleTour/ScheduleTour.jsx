import React, { useState } from "react";
import MortageCalculator from "./MortageCalculator";
import apiClient from '../../utils/apiClient';
import { FaSpinner } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
const ScheduleTour = () => {

  const initalFormData={
    date: '',
    time:'',
    name:'',
    phone:'',
    email:'',
    note:''
  }
  const [form,setForm]= useState(initalFormData)
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const {id} = useParams();
  const validate = () => {
    const __errors = {};
    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/
    if(!form.date) __errors.date = "Enter date";
    if(!form.time) __errors.time = "Enter time";
    if(!form.name) __errors.name = "Enter name";
    if(!form.phone) __errors.phone = "Enter phone";
    if(!form.email) __errors.email = "Enter email address";
    else if(!emailRegex.test(form.email)) __errors.email = "Invalid email address";
    if(!form.note) __errors.note = "Enter note";

    setErrors(__errors);
    return __errors;
  }
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const _errors = validate();
    
    setLoading(true);
    if(Object.keys(_errors).length > 0){
      setLoading(false)
      return false;
    }
    try{
      const data ={
        date: form.date,
        time: form.time,
        name: form.name,
        email: form.email,
        phone: form.phone,
        note_description: form.note,
        property_id: id
      }
      await apiClient.post('/schedule-tour', data).then(res=>{
        if(res.status === 200){
          setLoading(false);
          toast.success("Tour scheduled successfully");
          setForm(initalFormData)
        }else{
          setLoading(false);
          toast.error("Tour failed to schedule");
        }
      })
    }catch(error){
      console.error(error)
      setLoading(false);
      toast.error("Something went wrong. Please try again later or contact admin.");
    }



  }

  const onInputChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }
  return (
    <div className="py-16 space-y-8">
      <div className="text-xl sm:text-2xl font-bold">Schedule Tour</div>
      <div className="grid lg:grid-cols-3 gap-10 xl:gap-16">
        <div className="lg:col-span-2 pb-5 border-b sm:border border-gray-300 sm:rounded-lg sm:p-5">
          <form className="space-y-8" onSubmit={handleFormSubmit}>
            <div className="grid md:grid-cols-2 gap-5">
              <label className="flex flex-col">
                <span>Date</span>
                <input
                  type={"text"}
                  placeholder="Select Tour Date"
                  className="border rounded w-full p-2"
                  name="date"
                  value={form.date}
                  onChange={onInputChange}
                />
                {errors?.date && <span className="text-red-500 text-sm block">{errors?.date}</span>}
              </label>
              <label className="flex flex-col">
                <span>Time</span>
                <input
                  type={"text"}
                  placeholder="Select preferrable time"
                  className="border rounded w-full p-2"
                  name="time"
                  value={form.time}
                  onChange={onInputChange}
                />
                {errors?.time && <span className="text-red-500 text-sm block">{errors?.time}</span>}
              </label>
            </div>
            <div className="grid md:grid-cols-3 items-end gap-5">
              <label className="flex flex-col">
                <span>Your Information</span>
                <input
                  name="name"
                  type={"text"}
                  placeholder="Name"
                  className="border rounded w-full p-2"
                  value={form.name}
                  onChange={onInputChange}
                />
                {errors?.name && <span className="text-red-500 text-sm block">{errors?.name}</span>}
              </label>
              <label className="flex flex-col">
                <input
                  name="phone"
                  type={"text"}
                  placeholder="Phone"
                  className="border rounded w-full p-2"
                  value={form.phone}
                  onChange={onInputChange}
                />
                {errors?.phone && <span className="text-red-500 text-sm block">{errors?.phone}</span>}
              </label>
              <label className="flex flex-col">
                <input
                  name="email"
                  type={"email"}
                  placeholder="Email"
                  className="border rounded w-full p-2"
                  value={form.email}
                  onChange={onInputChange}
                />
                {errors?.email && <span className="text-red-500 text-sm block">{errors?.email}</span>}
              </label>
            </div>
            <div>
            <textarea
              rows={6}
              placeholder="note"
              className="w-full border p-2 rounded"
              name="note"
              value={form.note}
              onChange={onInputChange}
            />
            {errors?.note && <span className="text-red-500 text-sm block mt-0">{errors?.note}</span>}
            </div>
            <div className="">
              <button className="bg-red-700 text-white font-semibold px-5 py-2 rounded-lg">
                {loading?<FaSpinner className="spin"/>:'Contact Owner'}
              </button>
            </div>
          </form>
        </div>
        {/* <div className="flex justify-center">
          <div className="w-full lg:w-96">
            <MortageCalculator />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ScheduleTour;
