import React, { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { AiOutlineControl } from "react-icons/ai";

import {useSearchParams } from 'react-router-dom';

const FilterModal = (props) => {
  const [params, setParams] = useSearchParams();
  const _params = Object.fromEntries([...params]);
  const  [price,setPrice]=useState({min:null, max:null})
  const [menuActive, setMenuActive] = useState(false)
  const onInputChange = (e) => {
    setPrice({
      ...price,
      [e.target.name]:e.target.value
    })
  }
  const onPriceInputSubmit = (e) => {

    e.preventDefault();
    const parameters = {..._params, min_price:price.min, max_price:price.max}

    setParams(parameters);
   
  }
  // useEffect(()=>{
  //   setParams({..._params, min:price.min, max:price.max})
  // },[price])
  return (
    <div className="w-56 text-right">
      <div className="relative inline-block text-left">
        <div>
          <button type="button" className="inline-flex justify-center space-x-3 items-center w-full px-4 py-2 text-xl font-medium bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          onClick={()=>setMenuActive(!menuActive)}>
            <AiOutlineControl
              className="w-5 h-5 ml-2 -mr-1"
              aria-hidden="true"
            />
            <span>Filters</span>
          </button>
        </div>
        <Transition
          as={Fragment}
          show={menuActive}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="absolute right-0 w-56 lg:w-96 mt-2 origin-top-right z-20 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div>
              <div className="flex justify-start items-start flex-col p-5 space-y-4 font-medium">
                <button onClick={()=>setParams({..._params, price_order:'all'})}>Best Match</button>
                <button onClick={()=>setParams({..._params,price_order:'low_to_high'})}>Price low to high </button>
                <button onClick={()=>setParams({..._params,price_order:'high_to_low'})}>Price high to low</button>
                <div>
                  <h1>Price</h1>
                  <form className="" onSubmit={onPriceInputSubmit}>
                    <div className="grid lg:grid-cols-2 gap-5 mb-4">
                      <input
                        type={"text"}
                        placeholder="Min"
                        name="min"
                        className="border rounded-lg p-2"
                        value={price.min}
                        onChange={onInputChange}
                        required
                      />
                      <input
                        type={"text"}
                        placeholder="Max"
                        name="max"
                        className="border rounded-lg p-2"
                        value={price.max}
                        onChange={onInputChange}
                        required
                      />
                    </div>
                    <div className="flex w-full justify-center">
                      <button type="submit" className="bg-red-700 text-white p-2 px-5 font-medium rounded">
                        Proceed
                      </button>
                    </div>  
                  </form>
                </div>
                
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
};

export default FilterModal;
