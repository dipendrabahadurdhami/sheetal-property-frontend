
import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import {  useSelector } from "react-redux";
import apiClient from "../../utils/apiClient";
import PropertyCard from "./Card/PropertyCard";

const MyProperties = () => {
  const [loading,setLoading] = useState(false);
  const user = useSelector(state=>state.user);
    const [properties,setProperties] = useState(null);
 

  useEffect(()=>{
    fetchProperties();
  },[user])

  const fetchProperties = async () => {
    setLoading(true)
    if(user.data){
        await apiClient.get(`${process.env.REACT_APP_API_LINK}/user-property`).then(res=>{
            setProperties(res.data.data)
            console.log(res.data.data);
            setLoading(false)
        }).catch(err=>{
            console.log(err);
            setLoading(false)
        })
    }
    }
  
  return (
    <div className="p-5 lg:p-10 space-y-5 md:space-y-10">
      <div className="text-xl font-bold">My Properties</div>
      <div className="">
        {loading && <FaSpinner className="spin" />}
        {!loading && properties && properties.map((item,i) => <PropertyCard key={i} data={item}/>)}
        {!loading && properties && properties.length === 0 ? <p>You haven't posted any property</p>: ''}
      </div>
    </div>
  );
};

export default MyProperties;
