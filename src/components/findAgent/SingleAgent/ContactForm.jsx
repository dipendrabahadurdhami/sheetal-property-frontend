import axios from "axios";
import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ContactForm = ({data}) => {
  const {id} = useParams();
  const [loading,setLoading]=useState(false);
  const [form,setForm] = useState({name:'', email:'', phone:'', message:'', terms:false});


  const onInputChange=(e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const message = "Phone Number:"+form.phone + " Message:"+ form.message;
    await axios.post(`${process.env.REACT_APP_API_LINK}/contact-agent`,{
      agent_id: id,
      name:form.name,
      email:form.email,
      contact_form:  message,
      terms_agrement:form.terms?'yes':'no'
    }).then(res=>{
      if(res.status === 200){
        setLoading(false);
        toast.success("Your details has been sent to the agent.");
        setForm({
          name:'',
          email:'',
          phone:'',
          message:'',
          terms:false
        });
      }else{
        setLoading(false);
        toast.error("Something went wrong. Please try again later");
      }
    }).catch(err=>{
      setLoading(false);
      console.error(err);
    })

  }


  return (
    <div className="p-4 border border-gray-300 rounded space-y-5">
      <h1 className="text-2xl font-bold">Want to contact {data.first_name} {data.last_name}?</h1>
      <div>
        <form className="space-y-5" onSubmit={onFormSubmit}>
          <div className="mb-4 w-full">
            <label className="block w-full text-sm">Fullname</label>
            <input
              type={"text"}
              placeholder="Name"
              name='name'
              value={form.name}
              required
              className="border border-gray-300 rounded p-2  w-full"
              onChange={onInputChange}
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block w-full text-sm">Email Address</label>
            <input
              type={"email"}
              placeholder="Email Address"
              name='email'
              required
              value={form.email}
              className="border border-gray-300 rounded p-2  w-full"
              onChange={onInputChange}
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block w-full text-sm">Phone Number</label>
            <input
              type={"number"}
              placeholder="Phone"
              name='phone'
              value={form.phone}
              className="border border-gray-300 rounded p-2  w-full"
              onChange={onInputChange}
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block w-full text-sm">Message</label>
            <textarea
              placeholder="Message"
              name='message'
              value={form.message}
              onChange={onInputChange}
              className="border border-gray-300 rounded p-2  w-full min-h-32">{form.message}</textarea>
          </div>
          <div className="flex items-center space-x-4">
            <input type="checkbox" className="w-5 h-5" value={form.terms} checked={form.terms} onChange={(e)=>setForm({...form, terms: !form.terms})} id="terms" />
            <label htmlFor="terms">I agree to Terms & Condition of Sheetal Property</label>
          </div>
          
          <div className="flex justify-center">
            <button type="submit" disabled={!form.terms || loading} className={`w-full bg-red-700 py-2 text-lg font-bold text-white flex items-center justify-center rounded-lg ${!form.terms ||  loading?'opacity-50':''}`}>
              {loading?<FaSpinner className="spin"/>:'Contact Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
