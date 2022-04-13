import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import Search from "../Common/SearchBox/HomeSearch";
import FormFilter from "./FormFilter";

const Model = ({ setFilterModal, filterModal }) => {
  return (
    <Transition.Root show={filterModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed bg-white z-50 inset-0 overflow-y-scroll animate__fadeInUp animate__animated"
        onClose={setFilterModal}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
            className="hidden sm:inline-block sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
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
            <div className="relative inline-block align-bottom bg-white px-4 pt-5 pb-4 text-left overflow-hidden transform transition-all sm:align-middle md:max-w-4xl sm:w-full sm:p-6">
              <div className="py-10">
                <Search />
              </div>
              <div className="flex justify-center">
                <div className="md:max-w-3xl">
                  <FormFilter setFilterModal={setFilterModal} />
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
