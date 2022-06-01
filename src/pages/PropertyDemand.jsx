import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import InputBox from "../components/Common/SearchBox/InputBox";
import Loader from "../components/Loader";
import PropertyDemandTable from "../components/PropertyDemandTable";

const PropertyDemand = () => {
  const [demand, setDemand] = useState(null);
  const [filteredList, setFilteredList] =useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const displayDemand = async () => {
    setLoading(true);
    await axios.get(`${process.env.REACT_APP_API_LINK}/property-demand-list`).then(res=>{
      if(res.status  === 200){
        setLoading(false);
        setDemand(res.data.data);
        setFilteredList(res.data.data);
        console.log(res.data.data)
      }else{
        setLoading(false);
      }
    });
   

  };

  useEffect(() => {
    displayDemand();
  }, []);

  const onSearchClick = () => {
    setLoading(true);
    const filteredList =  demand.filter(item=> ( 
      (item?.requirement && item?.requirement.toLowerCase().includes(search.toLowerCase())) || 
      (item?.prefered_location && item?.prefered_location.toLowerCase().includes(search.toLowerCase())) || 
      (item?.maximum_budget && item?.maximum_budget.toLowerCase().includes(search.toLowerCase())) || 
      (item?.requirement && item?.requirement.toLowerCase().includes(search.toLowerCase())) || 
      (item?.tenant_option && item?.tenant_option.toLowerCase().includes(search.toLowerCase())) ||
      (item?.vehicles && item?.vehicles.toLowerCase().includes(search.toLowerCase()))
      ));
      setTimeout(()=>{
        setLoading(false);
        setFilteredList(filteredList);
      }, 2000)
    
  }
  return (
    <div className="p-5 md:p-10 space-y-10">
      <div className="text-2xl font-bold">PropertyDemand</div>
      <div className="flex justify-center px-5 md:px-10">
        <div className="w-full xl:w-9/12 bg-white rounded p-3 xs:p-7  md:p-10 lg:space-y-5">
          <div className=" relative">
            <input type="text" name="search" placeholder="Search by Title, Location, Budget, Tenant, Vehicle" className="block w-full px-6 text-lg py-6 border-2 border-gray-400 rounded-md" onChange={(e)=>setSearch(e.target.value)}/>
            <button type="submit" className="btn bg-red-600 text-white text-normal font-medium py-4 px-6 rounded-md absolute top-3 right-3 hover:bg-red-700 inline-flex items-center" onClick={onSearchClick}>
              <FaSearch className="mr-2"/>
              Search
            </button>
          </div>
        </div>
      </div>
      {loading && <div className="flex items-center justify-center py-4"><Loader/></div>}
      {!loading && filteredList && filteredList.length === 0 && demand && <p>No result found</p>}
      {filteredList && filteredList.length > 0 && !loading &&  <PropertyDemandTable demands={filteredList} />}
      
    </div>
  );
};

export default PropertyDemand;
