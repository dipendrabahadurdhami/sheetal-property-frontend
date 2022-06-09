import React from "react";
import { FaSearch } from "react-icons/fa";

const AgentSearch = ({filter,onAgentSearch}) => {
  const onInputChange = (e) => {
    onAgentSearch(e.target.value)
  }
  return (
    <form className="md:shadow py-5 px-10 mb-10">
      <div className=" -mx-5 flex flex-wrap">
        <label className="w-full md:w-6/12 bold  px-5">Name
          <div className="border border-gray-300 rounded overflow-hidden flex justify-between items-center p-2 px-4">
            <input
              type={"text"}
              placeholder="Agent Name / Address"
              className="w-full py-2 px-2 outline-none"
              name="name"
              value={filter}
              onChange={onInputChange}
            />
            <FaSearch className="text-red-700 w-5 h-5" />
          </div>
        </label>
      </div>
      {/* <label className="flex flex-col">
        <span className="font-semibold">SPECIALTIES</span>
        <select className="border border-gray-300 rounded p-2">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
        </select>
      </label> */}
      {/* <label className="flex flex-col">
        <span className="font-semibold">Language</span>
        <select className="border border-gray-300 rounded p-2">
          <option>English</option>
          <option>Nepali</option>
          <option>Hindi</option>
        </select>
      </label> */}
    </form>
  );
};

export default AgentSearch;
