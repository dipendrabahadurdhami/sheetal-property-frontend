import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import Search from "../Common/SearchBox/HomeSearch";
import FormFilter from "./FormFilter";
import { useNavigate } from "react-router-dom";

const Model = ({ setFilterModal, filterModal }) => {
  const navigate =  useNavigate();
  const [search, setSearch] = useState('');
  const handleSearchClick = (data) => {
    let params='';
    if(search) params += `keyword=${search}`;
    if(data?.advertisement_purpose) params += `&advertisement_purpose=${data?.advertisement_purpose}`;
    if(data?.property_type) params += `&property_type=${data?.property_type}`;
    if(data?.min_price) params += `&min_price=${data?.min_price}`;
    if(data?.max_price) params += `&max_price=${data?.max_price}`;

    navigate({
      pathname:"/productSearch",
      search: `?${params}`,
    })
  }
  return (
    <Transition.Root show={filterModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed bg-white z-50 inset-0 overflow-y-scroll animate__fadeInUp animate__animated"
        onClose={setFilterModal}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-white transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden md:inline-block md:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className=" md:block absolute top-0 right-0 pt-4 pr-4 z-10">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => setFilterModal(false)}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-10 w-10" aria-hidden="true" />
            </button>
          </div>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block align-bottom bg-white pt-5 pb-4 text-left overflow-hidden transform transition-all sm:align-middle md:max-w-4xl w-full md:p-6">
              <div className="py-10 bg-gray-500 md:bg-white px-8">
                <input type="text" name="search" placeholder="Search" value={search} className="border-2 border-red-700 py-3 block w-full px-4 rounded-md" onChange={(e)=>setSearch(e.target.value)}/>
              </div>
              <div className="md:flex justify-center px-4">
                <div className="md:max-w-3xl">
                  <FormFilter setFilterModal={setFilterModal} setAction={handleSearchClick} />
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Model;
