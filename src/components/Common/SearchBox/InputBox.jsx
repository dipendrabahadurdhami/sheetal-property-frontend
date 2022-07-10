import React, { useState } from "react";
import { AiOutlineControl } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const InputBox = ({ setFilterModal, showFilters=true }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const onInputChange = (e) => {
    setSearch(e.target.value)
  }
  const onSearchButtonClick = (e) => {
    e.preventDefault()
    if(search){
      navigate(`/productSearch?keyword=${search}`)
    }
  }
  return (
    <>
      <form onSubmit={onSearchButtonClick} className="border-2 border-red-700 flex items-center rounded-md bg-white hover:border-red-900 focus:ring-2 focus:ring-red-700 overflow-hidden px-1">
        <input
          type={"text"}
          value={search}
          placeholder="Enter an address, neighbourhood, city or ZIP code"
          className="w-full h-full p-4 px-4 text-sm border-none outline-none overflow-hidden text-ellipsis"
          onChange={onInputChange}
          required
        />
        {showFilters && 
        <button
          type="button"
          onClick={() => setFilterModal(true)}
          className="p-2 sm:px-3 sm:mr-4 sm:py-2 space-x-1 flex items-center text-red-700 font-medium text-sm sm:font-base sm:text-gray-700 sm:border rounded-md border-gray-700"
        >
          <AiOutlineControl className="hidden sm:inline w-6 h-6" />
          <span>Filters</span>
        </button>
        }
        <button type="submit" disabled={!search} className="p-2 sm:p-3 border md:border-none border-red-700 h-full font-medium text-sm flex items-center bg-red-700 text-white rounded-md disabled:opacity-50" >
          <FaSearch className="w-4 h-4 md:mr-4" />
          <span className="hidden md:inline">Search</span>
        </button>
        
      </form>
    </>
  );
};

export default InputBox;
