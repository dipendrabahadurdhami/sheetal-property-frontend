import { Slider } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import apiClient from "../../utils/apiClient";

const FormFilter = ({ setFilterModal, setAction }) => {
  const [price, setPrice] = useState([500, 500000]);
  const [loading,setLoading] = useState(false);
  const [properties, setProperties] = useState(null);

  const [purpose,setPurpose] = useState('all');
  const [property_type, setProperty_type] =useState('all');
 
  const ImageThumb = (props) => {
    return (
      <span {...props}>
        <img
          src="https://picsum.photos/40/40"
          alt="loading"
          style={{ borderRadius: 20 }}
        />
      </span>
    );
  };


  const fetchAllProperties = async () => {
    setLoading(true);
    await apiClient.get('/property-attributes').then(res=>{
        if(res.status === 200){
            setProperties(res.data.data);
            setLoading(false);
        }
    }).catch(err=>{
      setLoading(false);
    })
  }

  const onPriceInputChange = (e) => {
 
    const {name, value} = e.target;
    if(name === 'min'){
      setPrice([Number(value), price[1]]);
    }else{
      setPrice([price[0],Number(value)]);
    }

  }

  useEffect(()=>{
    fetchAllProperties()
  },[])

  const onSearchButtonClick = () => {
      const data = {
          min_price: price[0],
          max_price: price[1],
          property_type: property_type,
          advertisement_purpose: purpose
      }
      setAction(data)
  }

  return (
    <div className="space-y-8 py-8">
      <div className="space-y-6">
        <h2 className="text-xl font-bold border-b border-gray-300  mb-4">Filters</h2>
        {properties && properties?.purposes && 
          <div>
            <h1 className="font-bold text-lg mb-4">Property Status</h1>
            <div className="text-sm flex flex-wrap -mx-2">
              <div className="px-2 mb-4">
                <button className={`border rounded  p-3 mb-4 ${purpose === 'all'?'bg-red-500 border-red-500 text-white':'border-gray-400'}`}  onClick={()=>setPurpose('all')}>
                  All Status
                </button>
              </div>
              {properties?.purposes.length > 0 && properties?.purposes.map((_purpose,i)=>{
                return(
                  <div className="px-2 mb-4" key={i}>
                    <button className={`border rounded  p-3 mb-4  ${purpose === _purpose?.name?'bg-red-500 border-red-500 text-white':'border-gray-400'}`} onClick={()=>setPurpose(_purpose?.name)}>
                      {_purpose?.name}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
          }
      </div>

      {properties && properties?.property_types && 
      <div className="space-y-6">
        <h1 className="font-bold text-lg">Property Types</h1>
        <div className="flex -mx-2 items-center text-sm flex-wrap">
          <div className="px-2 mb-4">
            <button className={`border rounded p-3 whitespace-nowrap ${property_type === 'all'?'bg-red-500 border-red-500 text-white':'border-gray-400'}`}  onClick={()=>setProperty_type('all')}>
              All Types
            </button>
          </div>
          {properties?.property_types.length > 0 && properties?.property_types.map((property,i)=>{
            return (
              <div className="px-2 mb-4" key={i}>
                <button className={`border rounded  p-3 whitespace-nowrap ${property_type === property?.name?'bg-red-500 border-red-500 text-white':'border-gray-400'}`} onClick={()=>setProperty_type(property?.name)}>
                  {property?.name}
                </button>
              </div>
            )
          })}
        
        </div>
      </div>
      }



        <div className="space-x-2 items-center">
          <span className="font-bold text-lg">Price Range</span>
          <span className="text-gray-500">(Rs.500 - Rs.500,000)</span>
        </div>
        <div className="items-center">
          <div>
            <Slider
              value={price}
              getAriaLabel={(index) =>
                index === 0 ? "Minimum price" : "Maximum price"
              }
              thumb={{
                height: 40,
              
                width: 40,
                backgroundColor: "#fff",
                marginTop: -20,
                marginLeft: -20,
              }}
              onChange={(e, data) => setPrice(data)}
              style={{
                color: "#B91C1B",
                height: 5,
                padding: "13px 0",
              }}
              min={0}
              max={9999999}
            />


            <div className="flex flex-wrap -mx-2">
                <div className="px-2">
                  <label className="block text-sm">Minimum</label>
                  <input type={'text'} name="min" value={price[0]} className="border border-gray-300 py-2 px-2 rounded-sm"  onChange={onPriceInputChange}/>
                </div>
                <div className="px-2">
                  <label className="block text-sm">Maximum</label>
                  <input type={'text'} name="max" value={price[1]} className="border border-gray-300 py-2 px-2 rounded-sm" onChange={onPriceInputChange}/>
                </div>
            </div>
          </div>
          <input
            type="text"
            className="w-full p-3 border border-gray-400 rounded hidden"
            placeholder="Property ID"
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-400 rounded hidden"
            placeholder="Min Area (Anna, Dhur)"
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-400 rounded hidden"
            placeholder="Max Area (Anna, Dhur)"
          />
        </div>
 



      <div className="space-y-6 hidden">
        <div className="">
          <span className="font-bold text-lg">Features</span>
        </div>
        <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-5 gap-x-2 items-center text-sm">
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Air Conditioner</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Advanced Lift</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Aluminum Partition</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Backup Generator</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Backup Solar</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Balcony</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Balcony</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Balcony</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Barbeque</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>CCTV</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>COMMUNITY HALL</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Drainage</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Drinking water supply</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Dryer</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Electricity</span>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="checkbox"
              className="w-5 h-5 border border-red-900"
              placeholder="Property ID"
            />
            <span>Electricity Backup</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          className="text-white p-3 bg-red-700 font-medium flex items-center rounded space-x-2 px-5"
          onClick={onSearchButtonClick}
        >
          <span>Search</span>
          <FaSearch className="w-4 h-4 mb-1" />
        </button>
      </div>
    </div>
  );
};

export default FormFilter;
