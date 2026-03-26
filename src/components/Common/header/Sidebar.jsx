import React, { Fragment, useState } from "react";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { HiX, HiChevronRight } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaHome, FaPlus, FaUser, FaBuilding, FaSignOutAlt } from "react-icons/fa";

import LoginModel from "../../Login/LoginModel";
import { navigation } from "./navigation";
import { removeUserInfo } from "../../../features/slices/userInformation";
import { removeAllFavorites } from "../../../features/slices/favourites";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [authModal, setAuthModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleSignOut = () => {
    localStorage.removeItem("sheetal_token");
    dispatch(removeUserInfo());
    dispatch(removeAllFavorites());
    setSidebarOpen(false);
    navigate("/", { replace: true });
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 flex z-[60] lg:hidden" onClose={setSidebarOpen}>
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" />
          </Transition.Child>

          {/* Sidebar Panel */}
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl">
              {/* Close Button Inside Sidebar */}
              <div className="absolute top-2 right-2">
                <button
                  type="button"
                  className="flex items-center justify-center h-10 w-10 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none"
                  onClick={() => setSidebarOpen(false)}
                >
                  <HiX className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 h-0 pt-6 pb-4 overflow-y-auto">
                {/* Branding */}
                <div className="flex-shrink-0 flex items-center px-6">
                  <img className="h-12 w-auto" src="/shetallogo.png" alt="Logo" />
                </div>

                {/* Main Navigation */}
                <nav className="mt-8 flex-1 px-4 space-y-1">
                  {navigation.map((item) =>
                    item.subTitle.length === 0 ? (
                      <Link
                        key={item.title}
                        to={item.link}
                        onClick={() => setSidebarOpen(false)}
                        className="group w-full flex items-center px-3 py-3 text-sm font-bold text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <Disclosure as="div" key={item.title} className="space-y-1">
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="group w-full flex items-center px-3 py-3 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-all">
                              <span className="flex-1  tracking-wide">{item.title}</span>
                              <HiChevronRight
                                className={classNames(
                                  open ? "rotate-90 text-red-600" : "text-gray-400",
                                  "ml-3 h-5 w-5 transform transition-transform duration-200"
                                )}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="space-y-1 ml-4 border-l-2 border-gray-100">
                              {item.subTitle.map((subItem) => (
                                <button
                                  key={subItem.title}
                                  onClick={() => {
                                    const path = item.title === "Property Service" ? "/productSearch" : subItem.link;
                                    navigate(`${path}?advertisement_purpose=${subItem.title}`);
                                    setSidebarOpen(false);
                                  }}
                                  className="group w-full flex items-center pl-6 py-2.5 text-sm font-semibold text-gray-500 hover:text-red-700 hover:bg-red-50/50 rounded-lg transition-all"
                                >
                                  {subItem.title}
                                </button>
                              ))}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    )
                  )}
                </nav>

                {/* User specific section */}
                {user.data && (
                  <div className="mt-8 pt-6 border-t border-gray-100 px-4">
                    <p className="px-3 text-xs font-black text-gray-400  tracking-widest mb-2">Account</p>
                    <nav className="space-y-1">
                      <Link to="/my-profile?section=profile" className="flex items-center px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-red-50 rounded-xl" onClick={() => setSidebarOpen(false)}>
                        <FaUser className="w-4 h-4 text-red-600 mr-4" /> My Profile
                      </Link>
                      <Link to="/my-profile?section=favourites" className="flex items-center px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-red-50 rounded-xl" onClick={() => setSidebarOpen(false)}>
                        <FaHeart className="w-4 h-4 text-red-600 mr-4" /> Favorites
                      </Link>
                      <Link to="/my-profile?section=my-properties" className="flex items-center px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-red-50 rounded-xl" onClick={() => setSidebarOpen(false)}>
                        <FaBuilding className="w-4 h-4 text-red-600 mr-4" /> My Properties
                      </Link>
                    </nav>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col space-y-3">
                  {!user.data ? (
                    <button
                      onClick={() => { setAuthModal(true); setSidebarOpen(false); }}
                      className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-red-600 text-red-600 font-black py-3 rounded-xl hover:bg-red-50 transition-all  text-xs"
                    >
                      <FaUser className="text-[10px]" />
                      <span>Login / Register</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-gray-200 text-gray-600 font-black py-3 rounded-xl hover:bg-gray-100 transition-all  text-xs"
                    >
                      <FaSignOutAlt className="text-[10px]" />
                      <span>Sign Out</span>
                    </button>
                  )}
                  
                  <Link
                    to="/my-profile?section=post-property"
                    className="w-full bg-red-700 text-white  text-sm text-center font-black py-4 rounded-xl shadow-lg shadow-red-200 active:scale-95 transition-all flex items-center justify-center space-x-2 "
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaPlus className="text-[10px]" />
                    <span>New Post</span>
                  </Link>
                </div>
              </div>
            </div>
          </Transition.Child>
          
          {/* Buffer to allow user to tap off to close */}
          <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
        </Dialog>
      </Transition.Root>

      {/* Auth Modal */}
      {authModal && <LoginModel r={authModal} setR={setAuthModal} />}
    </>
  );
};

export default Sidebar;