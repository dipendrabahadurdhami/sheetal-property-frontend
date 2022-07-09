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
      <form onSubmit={onSearchButtonClick} className="border-2 border-red-700 flex items-center rounded-md bg-white hover:border-red-900 focus:ring-2 focus:ring-red-700 overflow-hidden space-x-2 xs:space-x-5">
        <input
          type={"text"}
          value={search}
          placeholder="Enter an address, neighbourhood, city or ZIP code"
          className="w-full h-full p-2 xs:p-3 border-none outline-none"
          onChange={onInputChange}
          required
        />
        {showFilters && 
        <button
          type="button"
          onClick={() => setFilterModal(true)}
          className="p-1 sm:px-3 sm:py-2 space-x-1 flex items-center text-red-700 font-bold sm:font-base sm:text-gray-700 sm:border rounded-md border-gray-700"
        >
          <AiOutlineControl className="hidden sm:inline w-6 h-6" />
          <span>Filters</span>
        </button>
        }
        <button type="submit" disabled={!search} className="p-2 xs:p-4 h-full space-x-2 font-medium text-lg flex items-center bg-red-700 text-white" >
          <FaSearch className="w-4 h-4" />
          <span className="hidden md:inline">Search</span>
        </button>
        
      </form>
    </>
  );
};

export default InputBox;
