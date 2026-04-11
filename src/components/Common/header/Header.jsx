import React, { useState, useEffect, useRef, Fragment } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Transition } from "@headlessui/react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {
  IoLogOutOutline, IoPersonOutline, IoHomeOutline, IoPeopleOutline,
  IoLocationOutline, IoDocumentTextOutline, IoAddCircleOutline,
  IoMenuOutline, IoChevronDownOutline, IoBriefcaseOutline,
  IoSearchOutline, IoKeyOutline, IoBusinessOutline, IoStatsChartOutline,
  IoConstructOutline, IoLeafOutline, IoCashOutline, IoMapOutline,
  IoCallOutline, IoMailOutline, IoInformationCircleOutline,
  IoNewspaperOutline, IoStarOutline, IoShieldCheckmarkOutline,
  IoHandLeftOutline, IoCarOutline, IoStorefrontOutline,
  IoGridOutline, IoTrendingUpOutline, IoArrowForwardOutline,
  IoApartmentOutline,
} from "react-icons/io5";

import Sidebar from "./Sidebar";
import { removeUserInfo } from "../../../features/slices/userInformation";
import { removeAllFavorites } from "../../../features/slices/favourites";
import LoginModel from "../../Login/LoginModel";
import ForgotPasswordModel from "../../Login/ForgotPasswordModel";

// ─── Navigation Data ───────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    id: "buy",
    label: "Buy Property",
    icon: <IoKeyOutline />,
    mega: {
      featured: {
        title: "Find Your Dream Home",
        desc: "Explore thousands of verified properties across Nepal — from cozy apartments to luxury villas.",
        cta: "Browse All Listings",
        link: "/productSearch?advertisement_purpose=For Sale",
        stat: "2,400+ Active Listings",
      },
      columns: [
        {
          heading: "By Type",
          links: [
            { label: "Residential Houses", icon: <IoHomeOutline />, link: "/productSearch?advertisement_purpose=For Sale&type=house" },
            { label: "Apartments & Flats", icon: <IoApartmentOutline />, link: "/productSearch?advertisement_purpose=For Sale&type=apartment" },
            { label: "Commercial Space", icon: <IoStorefrontOutline />, link: "/productSearch?advertisement_purpose=For Sale&type=commercial" },
            { label: "Land & Plots", icon: <IoMapOutline />, link: "/productSearch?advertisement_purpose=For Sale&type=land" },
            { label: "Showroom & Office", icon: <IoBusinessOutline />, link: "/productSearch?advertisement_purpose=For Sale&type=office" },
          ],
        },
        {
          heading: "By Location",
          links: [
            { label: "Kathmandu Valley", icon: <IoLocationOutline />, link: "/productSearch?advertisement_purpose=For Sale&location=kathmandu" },
            { label: "Pokhara", icon: <IoLocationOutline />, link: "/productSearch?advertisement_purpose=For Sale&location=pokhara" },
            { label: "Chitwan", icon: <IoLocationOutline />, link: "/productSearch?advertisement_purpose=For Sale&location=chitwan" },
            { label: "Bhaktapur", icon: <IoLocationOutline />, link: "/productSearch?advertisement_purpose=For Sale&location=bhaktapur" },
            { label: "Lalitpur", icon: <IoLocationOutline />, link: "/productSearch?advertisement_purpose=For Sale&location=lalitpur" },
          ],
        },
      ],
    },
  },
  {
    id: "rent",
    label: "Rent & Lease",
    icon: <IoHomeOutline />,
    mega: {
      featured: {
        title: "Rent with Confidence",
        desc: "Short-term or long-term — find verified rental properties with transparent pricing and no hidden fees.",
        cta: "View Rentals",
        link: "/productSearch?advertisement_purpose=For Rent",
        stat: "1,100+ Rental Properties",
      },
      columns: [
        {
          heading: "Rental Types",
          links: [
            { label: "Rooms & Flats", icon: <IoApartmentOutline />, link: "/productSearch?advertisement_purpose=For Rent&type=flat" },
            { label: "Full Houses", icon: <IoHomeOutline />, link: "/productSearch?advertisement_purpose=For Rent&type=house" },
            { label: "Office Space", icon: <IoBusinessOutline />, link: "/productSearch?advertisement_purpose=For Rent&type=office" },
            { label: "Shop & Showroom", icon: <IoStorefrontOutline />, link: "/productSearch?advertisement_purpose=For Rent&type=shop" },
            { label: "Warehouse & Godown", icon: <IoGridOutline />, link: "/productSearch?advertisement_purpose=For Rent&type=warehouse" },
          ],
        },
        {
          heading: "Quick Filters",
          links: [
            { label: "Furnished Rentals", icon: <IoStarOutline />, link: "/productSearch?advertisement_purpose=For Rent&furnished=true" },
            { label: "Near Ringroad", icon: <IoCarOutline />, link: "/productSearch?advertisement_purpose=For Rent&near=ringroad" },
            { label: "Student Friendly", icon: <IoLeafOutline />, link: "/productSearch?advertisement_purpose=For Rent&tag=student" },
            { label: "Business District", icon: <IoTrendingUpOutline />, link: "/productSearch?advertisement_purpose=For Rent&tag=business" },
            { label: "New Listings", icon: <IoNewspaperOutline />, link: "/productSearch?advertisement_purpose=For Rent&sort=newest" },
          ],
        },
      ],
    },
  },
  {
    id: "services",
    label: "Property Services",
    icon: <IoBriefcaseOutline />,
    mega: {
      featured: {
        title: "Full-Service Real Estate",
        desc: "From valuation to legal documentation — Sheetal Real Estate handles every step of your property journey.",
        cta: "Explore All Services",
        link: "/services",
        stat: "15+ Years of Expertise",
      },
      columns: [
        {
          heading: "Our Services",
          links: [
            { label: "Property Valuation", icon: <IoStatsChartOutline />, link: "/services/valuation" },
            { label: "Legal & Documentation", icon: <IoDocumentTextOutline />, link: "/services/legal" },
            { label: "Home Loan Assistance", icon: <IoCashOutline />, link: "/services/loan" },
            { label: "Interior Design", icon: <IoConstructOutline />, link: "/services/interior" },
            { label: "Property Management", icon: <IoShieldCheckmarkOutline />, link: "/services/management" },
          ],
        },
        {
          heading: "For Owners",
          links: [
            { label: "List Your Property", icon: <IoAddCircleOutline />, link: "/my-profile?section=post-property" },
            { label: "Demand Registration", icon: <IoHandLeftOutline />, link: "/property-demand" },
            { label: "Market Insights", icon: <IoTrendingUpOutline />, link: "/market-insights" },
            { label: "Investment Advisory", icon: <IoLeafOutline />, link: "/services/investment" },
            { label: "NRN / Foreign Buyers", icon: <IoGridOutline />, link: "/services/nrn" },
          ],
        },
      ],
    },
  },
  {
    id: "invest",
    label: "Investments",
    icon: <IoTrendingUpOutline />,
    mega: {
      featured: {
        title: "Invest Smart in Nepal",
        desc: "Nepal's real estate market is growing. Get expert guidance on high-return investment properties and emerging zones.",
        cta: "See Investment Properties",
        link: "/productSearch?tag=investment",
        stat: "Avg. 12% Annual Returns",
      },
      columns: [
        {
          heading: "Investment Types",
          links: [
            { label: "Premium Plots", icon: <IoMapOutline />, link: "/productSearch?tag=premium-land" },
            { label: "Apartment Projects", icon: <IoApartmentOutline />, link: "/productSearch?tag=project" },
            { label: "Commercial Buildings", icon: <IoBusinessOutline />, link: "/productSearch?tag=commercial-invest" },
            { label: "Resort & Tourism", icon: <IoLeafOutline />, link: "/productSearch?tag=resort" },
            { label: "Industrial Land", icon: <IoGridOutline />, link: "/productSearch?tag=industrial" },
          ],
        },
        {
          heading: "Tools & Resources",
          links: [
            { label: "ROI Calculator", icon: <IoStatsChartOutline />, link: "/tools/roi-calculator" },
            { label: "Market Reports", icon: <IoNewspaperOutline />, link: "/market-reports" },
            { label: "Price Trends", icon: <IoTrendingUpOutline />, link: "/price-trends" },
            { label: "Hotspot Locations", icon: <IoStarOutline />, link: "/hotspots" },
            { label: "NRN Investment Guide", icon: <IoDocumentTextOutline />, link: "/guides/nrn" },
          ],
        },
      ],
    },
  },
  {
    id: "about",
    label: "About Us",
    icon: <IoInformationCircleOutline />,
    mega: {
      featured: {
        title: "Nepal's Trusted Real Estate Brand",
        desc: "Sheetal Real Estate — built on trust, driven by excellence. Helping families find homes since 2009.",
        cta: "Our Full Story",
        link: "/about",
        stat: "10,000+ Families Served",
      },
      columns: [
        {
          heading: "Company",
          links: [
            { label: "About Sheetal", icon: <IoInformationCircleOutline />, link: "/about" },
            { label: "Our Team", icon: <IoPeopleOutline />, link: "/team" },
            { label: "Find an Agent", icon: <IoPersonOutline />, link: "/find-agent" },
            { label: "Careers", icon: <IoBriefcaseOutline />, link: "/careers" },
            { label: "Press & Media", icon: <IoNewspaperOutline />, link: "/press" },
          ],
        },
        {
          heading: "Connect",
          links: [
            { label: "Contact Us", icon: <IoCallOutline />, link: "/contact" },
            { label: "Requirement Form", icon: <IoDocumentTextOutline />, link: "/requirement-form" },
            { label: "Email Us", icon: <IoMailOutline />, link: "/contact#email" },
            { label: "Visit Our Office", icon: <IoLocationOutline />, link: "/contact#office" },
            { label: "Client Reviews", icon: <IoStarOutline />, link: "/reviews" },
          ],
        },
      ],
    },
  },
];

// ─── Mega Menu Panel ────────────────────────────────────────────────────────────
const MegaMenu = ({ item, onClose }) => {
  const navigate = useNavigate();
  const { mega } = item;

  return (
    <div style={{ width: "780px", maxWidth: "95vw" }}>
      <div className="h-3" />
      <div
        className="rounded-2xl overflow-hidden border border-gray-100"
        style={{
          background: "rgba(255,255,255,0.98)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 25px 60px -10px rgba(0,0,0,0.25), 0 10px 20px -5px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex">
          {/* Left Featured Panel */}
          <div
            className="w-64 flex-shrink-0 flex flex-col justify-between p-6 relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #7f1d1d 0%, #b91c1c 55%, #dc2626 100%)",
            }}
          >
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute top-1/2 right-4 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative z-10">
              <img
                src="/shetallogo.png"
                alt="Sheetal Real Estate"
                className="h-9 w-auto mb-5"
                style={{ filter: "brightness(0) invert(1) opacity(0.9)" }}
              />
              <h3 className="text-white font-black text-[15px] leading-snug mb-2">
                {mega.featured.title}
              </h3>
              <p className="text-red-200 text-[11px] leading-relaxed mb-4">
                {mega.featured.desc}
              </p>
              <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                <span className="text-white text-[10px] font-bold tracking-wide">{mega.featured.stat}</span>
              </div>
            </div>

            <button
              onClick={() => { navigate(mega.featured.link); onClose(); }}
              className="relative z-10 flex items-center justify-center gap-2 bg-white text-red-700 font-black text-[11px] px-4 py-2.5 rounded-xl hover:bg-red-50 active:scale-95 transition-all group w-full"
            >
              {mega.featured.cta}
              <IoArrowForwardOutline className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Columns */}
          <div className="flex-1 p-6 grid grid-cols-2 gap-x-6 gap-y-2">
            {mega.columns.map((col, cIdx) => (
              <div key={cIdx}>
                <p className="text-[9px] font-black tracking-[2.5px] text-red-500 uppercase mb-3 pb-2 border-b border-gray-100">
                  {col.heading}
                </p>
                <div className="space-y-0.5">
                  {col.links.map((lnk, lIdx) => (
                    <button
                      key={lIdx}
                      onClick={() => { navigate(lnk.link); onClose(); }}
                      className="flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-lg text-[12px] font-semibold text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all group"
                    >
                      <span className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-red-100 flex items-center justify-center flex-shrink-0 transition-colors text-gray-400 group-hover:text-red-600 text-sm">
                        {lnk.icon}
                      </span>
                      {lnk.label}
                      <IoArrowForwardOutline className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-red-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer strip */}
        <div className="border-t border-gray-100 px-6 py-2.5 flex items-center justify-between bg-gray-50/60">
          <p className="text-[10px] text-gray-400 font-medium">
            Sheetal Real Estate — Nepal's Most Trusted Property Platform
          </p>
          <button
            onClick={() => { navigate("/requirement-form"); onClose(); }}
            className="flex items-center gap-1.5 text-[10px] font-bold text-red-600 hover:text-red-800 transition-colors"
          >
            <IoDocumentTextOutline className="w-3 h-3" />
            Submit a Requirement
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Header ────────────────────────────────────────────────────────────────
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const closeTimer = useRef(null);

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

  const handleMouseEnter = (id) => {
    clearTimeout(closeTimer.current);
    setActiveNav(id);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveNav(null), 130);
  };

  const handleClose = () => {
    clearTimeout(closeTimer.current);
    setActiveNav(null);
  };

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-2"
            : "bg-gradient-to-b from-black/55 via-black/20 to-transparent py-4"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-10 flex items-center justify-between">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-block transition-transform active:scale-95"
            >
              <img src="/shetallogo.png" alt="Sheetal Real Estate" className="h-10 md:h-12 w-auto" />
            </Link>
          </div>

          {/* Desktop Mega Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_ITEMS.map((item) => {
              const isOpen = activeNav === item.id;
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-[13px] whitespace-nowrap transition-all duration-200 ${
                      isOpen
                        ? isScrolled
                          ? "text-red-700 bg-red-50"
                          : "text-white bg-white/20 backdrop-blur-sm"
                        : isScrolled
                        ? "text-gray-700 hover:text-red-700 hover:bg-red-50/60"
                        : "text-white/90 hover:text-white hover:bg-white/15"
                    }`}
                  >
                    <span className={`text-base transition-transform duration-200 ${isOpen ? "scale-110" : ""}`}>
                      {item.icon}
                    </span>
                    {item.label}
                    <IoChevronDownOutline
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Animated Mega Menu */}
                  <div
                    className="absolute"
                    style={{
                      top: "100%",
                      left: "50%",
                      transition: "opacity 0.22s ease, transform 0.25s cubic-bezier(0.16,1,0.3,1)",
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen
                        ? "translateX(-50%) translateY(0px)"
                        : "translateX(-50%) translateY(-12px)",
                      pointerEvents: isOpen ? "auto" : "none",
                      zIndex: 50,
                    }}
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <MegaMenu item={item} onClose={handleClose} />
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">

            {/* Search */}
            <button
              onClick={() => navigate("/productSearch")}
              className={`p-2 rounded-xl transition-all hidden lg:flex ${
                isScrolled
                  ? "text-gray-600 hover:bg-gray-100 hover:text-red-700"
                  : "text-white/80 hover:bg-white/15 hover:text-white"
              }`}
            >
              <IoSearchOutline className="w-5 h-5" />
            </button>

            {/* Favourites */}
            {user.data && (
              <button
                className={`p-2 rounded-xl transition-all relative ${
                  isScrolled
                    ? "text-gray-500 hover:text-red-600 hover:bg-gray-100"
                    : "text-white/80 hover:text-white hover:bg-white/15"
                }`}
                onClick={() => navigate("/my-profile?section=favourites")}
              >
                {favorites?.data?.length > 0 ? (
                  <AiFillHeart className="w-5 h-5 text-red-500" />
                ) : (
                  <AiOutlineHeart className="w-5 h-5" />
                )}
                {favorites?.data?.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[8px] rounded-full h-3.5 w-3.5 flex items-center justify-center font-bold">
                    {favorites.data.length}
                  </span>
                )}
              </button>
            )}

            {/* Auth / User */}
            {!user.data ? (
              <button
                onClick={() => setAuthModal(true)}
                className={`p-2 rounded-xl transition-all ${
                  isScrolled
                    ? "text-gray-600 hover:bg-gray-100 hover:text-red-700"
                    : "text-white/80 hover:bg-white/15 hover:text-white"
                }`}
              >
                <IoPersonOutline className="w-5 h-5" />
              </button>
            ) : (
              <Menu as="div" className="relative">
                <Menu.Button
                  className={`flex items-center gap-1.5 p-1 pr-2 rounded-full border transition-all ${
                    isScrolled
                      ? "border-gray-200 hover:border-red-300 hover:shadow-sm bg-white"
                      : "border-white/30 hover:border-white/60"
                  }`}
                >
                  <img
                    src={user.data?.photo || "/noUser.png"}
                    alt="user"
                    className="w-7 h-7 rounded-full object-cover border-2 border-red-500"
                  />
                  <IoChevronDownOutline
                    className={`w-3 h-3 ${isScrolled ? "text-gray-400" : "text-white/70"}`}
                  />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-150"
                  enterFrom="opacity-0 scale-95 translate-y-1"
                  enterTo="opacity-100 scale-100 translate-y-0"
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 focus:outline-none">
                    <div className="px-4 py-3 border-b border-gray-50 bg-gradient-to-br from-red-50/80 to-white">
                      <p className="text-[9px] font-black tracking-[2px] text-red-500">MY ACCOUNT</p>
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

            {/* Post Property CTA */}
            <Link
              to="/my-profile?section=post-property"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-black transition-all shadow-lg active:scale-95 whitespace-nowrap ml-1 ${
                isScrolled
                  ? "bg-red-700 text-white hover:bg-red-800"
                  : "bg-white/20 backdrop-blur-sm text-white border border-white/40 hover:bg-white/30"
              }`}
            >
              <IoAddCircleOutline className="w-4 h-4" />
              <span className="hidden sm:inline">Post Property</span>
            </Link>

            {/* Mobile hamburger */}
            <button
              className={`lg:hidden p-2 rounded-xl transition-colors ${
                isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/20"
              }`}
              onClick={() => setSidebarOpen(true)}
            >
              <IoMenuOutline className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop when mega menu open */}
      <div
        className="fixed inset-0 z-30 transition-all duration-300"
        style={{
          background: "rgba(0,0,0,0.18)",
          backdropFilter: activeNav ? "blur(1.5px)" : "none",
          WebkitBackdropFilter: activeNav ? "blur(1.5px)" : "none",
          opacity: activeNav ? 1 : 0,
          pointerEvents: activeNav ? "auto" : "none",
        }}
        onClick={handleClose}
      />

      {authModal === "forgot-password" ? (
        <ForgotPasswordModel setR={setAuthModal} />
      ) : (
        authModal && <LoginModel r={authModal} setR={setAuthModal} />
      )}
    </>
  );
};

export default Header;