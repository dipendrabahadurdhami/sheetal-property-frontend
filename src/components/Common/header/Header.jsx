import React, { useState, useEffect, Fragment } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Transition } from "@headlessui/react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { IoLogOutOutline, IoPersonOutline, IoHomeOutline, IoPeopleOutline, IoLocationOutline, IoDocumentTextOutline, IoAddCircleOutline, IoMenuOutline, IoChevronDownOutline, IoBriefcaseOutline } from "react-icons/io5";

import Sidebar from "./Sidebar";
import { navigation } from "./navigation";
import { removeUserInfo } from "../../../features/slices/userInformation";
import { removeAllFavorites } from "../../../features/slices/favourites";
import LoginModel from "../../Login/LoginModel";
import ForgotPasswordModel from "../../Login/ForgotPasswordModel";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const favorites = useSelector((state) => state.favorites);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchParams.get("login")) {
      setAuthModal(true);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("login");
      setSearchParams(newParams);
    }
  }, [searchParams, setSearchParams]);

  const handleSignOut = () => {
    localStorage.removeItem("sheetal_token");
    dispatch(removeUserInfo());
    dispatch(removeAllFavorites());
    navigate("/", { replace: true });
  };

  const getNavIcon = (title) => {
    // same sizing as your original — big on mobile, small on lg
    const cls = "w-6 h-6 lg:w-4 lg:h-4 flex-shrink-0 transition-all duration-200";
    switch (title) {
      case "Home":             return <IoHomeOutline className={cls} />;
      case "Property Service": return <IoBriefcaseOutline className={cls} />;
      case "Property Demand":  return <IoLocationOutline className={cls} />;
      case "Requirement form": return <IoDocumentTextOutline className={cls} />;
      case "Find Agent":       return <IoPeopleOutline className={cls} />;
      default:                 return <IoHomeOutline className={cls} />;
    }
  };

  const getSubIcon = (title) => {
    const t = title?.toLowerCase() || "";
    const cls = "w-3.5 h-3.5 flex-shrink-0";
    if (t.includes("sell") || t.includes("sale")) return <IoAddCircleOutline className={cls} />;
    if (t.includes("rent"))                        return <IoHomeOutline className={cls} />;
    if (t.includes("flat") || t.includes("apart")) return <IoLocationOutline className={cls} />;
    return <IoBriefcaseOutline className={cls} />;
  };

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-white py-2 border-b border-gray-100"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-2 md:px-8 lg:px-12 xs:px-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-block transition-transform active:scale-95"
            >
              <img src="/shetallogo.png" alt="Logo" className="h-10 md:h-14 lg:h-14 w-auto" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex md:flex-1 items-center justify-evenly lg:justify-center space-x-1 lg:space-x-2 xl:space-x-4">
            {navigation.map((item, idx) => (
              <div key={idx} className="relative">
                {item.subTitle.length > 0 ? (

                  // ── Dropdown item ──
                  // Headless UI Menu closes on outside click automatically.
                  // The key fix: never call close() manually on navigate — just navigate.
                  // Menu unmounts its Items on outside click natively.
                  <Menu as="div" className="relative">
                    {({ open }) => (
                      <>
                        <Menu.Button
                          title={item.title}
                          className={`flex items-center gap-2 px-2 lg:px-3 py-2 rounded-lg font-bold   whitespace-nowrap transition-all duration-150 ${
                            open
                              ? "text-red-700 bg-red-50"
                              : "text-gray-700 hover:text-red-700 hover:bg-red-50/60"
                          }`}
                        >
                          {getNavIcon(item.title)}
                          <span className="hidden lg:inline text-[10px] xl:text-[15px]">
                            {item.title}
                          </span>
                          <IoChevronDownOutline
                            className={`w-3 h-3 opacity-50 transition-transform duration-200 ${
                              open ? "rotate-180 opacity-100" : ""
                            }`}
                          />
                        </Menu.Button>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 scale-95 translate-y-1"
                          enterTo="opacity-100 scale-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 scale-100 translate-y-0"
                          leaveTo="opacity-0 scale-95 translate-y-1"
                        >
                          <Menu.Items
                            className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 bg-white   rounded-lg shadow-2xl overflow-hidden z-50 "
                            style={{ transformOrigin: "top center" }}
                          >
                            {/* Header label */}
                            

                            <div className="p-1.5 space-y-0.5">
                              {item.subTitle.map((sub, sIdx) => (
                                <Menu.Item key={sIdx}>
                                  {({ active }) => (
                                    // ✅ FIX: just navigate — Menu auto-closes on item click
                                    // AND auto-closes on outside click (Headless UI native)
                                    <button
                                      onClick={() => {
                                        const path =
                                          item.title === "Property Service"
                                            ? "/productSearch"
                                            : sub.link;
                                        navigate(
                                          `${path}?advertisement_purpose=${sub.title}`
                                        );
                                      }}
                                      className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 text-xs font-semibold rounded-lg transition-all duration-100 ${
                                        active
                                          ? "bg-red-600 text-white"
                                          : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                                      }`}
                                    >
                                      <span
                                        className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                                          active ? "bg-red-500" : "bg-gray-100"
                                        }`}
                                      >
                                        {getSubIcon(sub.title)}
                                      </span>
                                      {sub.title}
                                    </button>
                                  )}
                                </Menu.Item>
                              ))}
                            </div>

                            {/* Footer hint */}
                            
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>

                ) : (

                  // ── Plain nav link ──
                  <Link
                    to={item.link}
                    title={item.title}
                    className="flex items-center gap-1.5 p-2 lg:px-3 lg:py-2 text-gray-700 hover:text-red-700 hover:bg-red-50/60 transition-all rounded-lg font-bold  tracking-tight whitespace-nowrap"
                  >
                    {getNavIcon(item.title)}
                    <span className="hidden lg:inline text-[11px] xl:text-[15px]">
                      {item.title}
                    </span>
                  </Link>

                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center justify-end space-x-1.5 md:space-x-2 lg:space-x-3 flex-shrink-0">

            {/* Favourites */}
            {user.data && (
              <button
                className="p-1 text-gray-500 hover:text-red-600 transition-colors relative"
                onClick={() => navigate("/my-profile?section=favourites")}
              >
                {favorites?.data?.length > 0 ? (
                  <AiFillHeart className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                ) : (
                  <AiOutlineHeart className="w-5 h-5 md:w-6 md:h-6" />
                )}
                {favorites?.data?.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-700 text-white text-[8px] rounded-full h-3.5 w-3.5 flex items-center justify-center font-bold border border-white">
                    {favorites.data.length}
                  </span>
                )}
              </button>
            )}

            {/* Auth / User menu */}
            {!user.data ? (
              <button
                onClick={() => setAuthModal(true)}
                className="text-gray-600 hover:text-red-700 p-1 transition-colors"
              >
                <IoPersonOutline className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            ) : (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center p-0.5 pr-1.5 rounded-full border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all">
                  <img
                    src={user.data?.photo || "/noUser.png"}
                    alt="user"
                    className="w-6 h-6 md:w-7 md:h-7 rounded-full object-cover border border-red-500"
                  />
                  <IoChevronDownOutline className="w-3 h-3 text-gray-400 ml-0.5" />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-150"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 focus:outline-none">
                    <div className="px-4 py-3 border-b border-gray-50 bg-gradient-to-br from-red-50/80 to-white">
                      <p className="text-[9px] font-black  tracking-[2px] text-red-500">
                        My Account
                      </p>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/my-profile?section=profile"
                            className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                              active ? "bg-red-50 text-red-700" : "text-gray-700"
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${active ? "bg-red-100" : "bg-gray-100"}`}>
                              <IoPersonOutline className="w-3.5 h-3.5" />
                            </span>
                            My Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-xs font-semibold rounded-lg text-left transition-all ${
                              active ? "bg-red-50 text-red-700" : "text-gray-700"
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${active ? "bg-red-100" : "bg-gray-100"}`}>
                              <IoLogOutOutline className="w-3.5 h-3.5" />
                            </span>
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}

            {/* Post Property */}
            <Link
              to="/my-profile?section=post-property"
              className="bg-red-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[12px] md:text-[15px] font-black hover:bg-red-800 transition-all shadow-lg active:scale-95    flex items-center gap-1 whitespace-nowrap"
            >
              <IoAddCircleOutline className="w-3.5 h-3.5 not-italic" />
              <span className="hidden sm:inline">New Post</span>
              <span className="sm:hidden"></span>
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setSidebarOpen(true)}
            >
              <IoMenuOutline className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {authModal === "forgot-password" ? (
        <ForgotPasswordModel setR={setAuthModal} />
      ) : (
        authModal && <LoginModel r={authModal} setR={setAuthModal} />
      )}
    </>
  );
};

export default Header;