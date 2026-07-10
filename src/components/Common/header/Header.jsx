import React, { useState, useEffect, useRef, Fragment } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Transition } from "@headlessui/react";
import '../../../index.css';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {
  IoLogOutOutline, IoPersonOutline, IoHomeOutline, IoPeopleOutline,
  IoLocationOutline, IoDocumentTextOutline, IoAddCircleOutline,
  IoMenuOutline, IoBriefcaseOutline, IoSearchOutline, IoKeyOutline,
  IoBusinessOutline, IoStatsChartOutline, IoConstructOutline,
  IoLeafOutline, IoCashOutline, IoMapOutline, IoCallOutline,
  IoMailOutline, IoInformationCircleOutline, IoNewspaperOutline,
  IoStarOutline, IoShieldCheckmarkOutline, IoHandLeftOutline,
  IoCarOutline, IoStorefrontOutline, IoGridOutline, IoTrendingUpOutline,
  IoArrowForwardOutline, IoChevronDownOutline,
} from "react-icons/io5";

import Sidebar from "./Sidebar";
import { removeUserInfo } from "../../../features/slices/userInformation";
import { removeAllFavorites } from "../../../features/slices/favourites";
import LoginModel from "../../Login/LoginModel";
import ForgotPasswordModel from "../../Login/ForgotPasswordModel";

// ─── Navigation Data ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    id: "buy",
    label: "Buy Property",
    mega: {
      featured: {
        title: "Find Your Dream Home",
        desc: "Explore thousands of verified properties across Nepal — from cozy apartments to luxury villas.",
        cta: "Browse All Listings",
        link: "/sale",
        stat: "2,400+ Active Listings",
      },
      columns: [
        {
          heading: "By Type",
          links: [
            { label: "Residential Houses", sub: "Houses & bungalows", link: "/productSearch?advertisement_purpose=Sale&property_type=Residential&category=House" },
            { label: "Apartments & Flats", sub: "Urban living spaces", link: "/productSearch?advertisement_purpose=Sale&category=Apartment" },
            { label: "Commercial Space", sub: "Shops & offices", link: "/productSearch?advertisement_purpose=Sale&property_type=commercial" },
            { label: "Land & Plots", sub: "Build your own", link: "/productSearch?&category=Land" },
            { label: "Showroom & Office", sub: "Business premises", link: "/productSearch?advertisement_purpose=Sale&property_type=office" },
          ],
        },
        {
          heading: "By Location",
          links: [
            { label: "Kathmandu Valley", sub: "Kathmandu, Lalitpur & Bhaktapur", link: "/productSearch?advertisement_purpose=Sale&district=kathmandu,lalitpur,bhaktapur" },
            { label: "Kathmandu", sub: "Capital city listings", link: "/productSearch?&advertisement_purpose=sale&keyword=kathmandu" },
            { label: "Lalitpur", sub: "Patan district", link: "/productSearch?&advertisement_purpose=sale&keyword=lalitpur" },
            { label: "Bhaktapur", sub: "Heritage city homes", link: "/productSearch?&advertisement_purpose=sale&keyword=bhaktapur" },
            { label: "Chitwan", sub: "Southern plains", link: "/productSearch?&advertisement_purpose=sale&keyword=chitwan" },
          ],
        },
        {
          heading: "By Budget",
          links: [
            { label: "Under Rs. 50 Lakhs", sub: "Starter homes", link: "/productSearch?advertisement_purpose=Sale&max_price=5000000" },
            { label: "Rs. 50L – Rs. 1 Crore", sub: "Mid-range homes", link: "/productSearch?advertisement_purpose=Sale&min_price=5000000&max_price=10000000" },
            { label: "Rs. 1Cr – Rs. 3 Crore", sub: "Premium listings", link: "/productSearch?advertisement_purpose=Sale&min_price=10000000&max_price=30000000" },
            { label: "Above Rs. 3 Crore", sub: "Luxury properties", link: "/productSearch?advertisement_purpose=Sale&min_price=30000000" },
            { label: "Negotiable Price", sub: "Open to offers", link: "/productSearch?advertisement_purpose=Sale&negotiable=true" },
          ],
        },
      ],
    },
  },
  {
    id: "rent",
    label: "Rent & Lease",
    mega: {
      featured: {
        title: "Rent with Confidence",
        desc: "Short-term or long-term — find verified rental properties with transparent pricing and no hidden fees.",
        cta: "View Rentals",
        link: "/rent",
        stat: "1,100+ Rental Properties",
      },
      columns: [
        {
          heading: "Rental Types",
          links: [
            { label: "Rooms & Flats", sub: "Affordable stays", link: "/productSearch?advertisement_purpose=Rent&property_type=flat" },
            { label: "Full Houses", sub: "Family rentals", link: "/productSearch?advertisement_purpose=Rent&property_type=house" },
            { label: "Office Space", sub: "Work-ready spaces", link: "/productSearch?advertisement_purpose=Rent&property_type=office" },
            { label: "Shop & Showroom", sub: "Retail premises", link: "/productSearch?advertisement_purpose=Rent&property_type=shop" },
            { label: "Warehouse & Godown", sub: "Storage & logistics", link: "/productSearch?advertisement_purpose=Rent&property_type=warehouse" },
          ],
        },
        {
          heading: "Quick Filters",
          links: [
            { label: "Furnished Rentals", sub: "Move in ready", link: "/productSearch?advertisement_purpose=Rent&furnished=true" },
            { label: "Near Ringroad", sub: "Easy commute", link: "/productSearch?advertisement_purpose=Rent&near=ringroad" },
            { label: "Student Friendly", sub: "Near colleges", link: "/productSearch?advertisement_purpose=Rent&tag=student" },
            { label: "Business District", sub: "Commercial hubs", link: "/productSearch?advertisement_purpose=Rent&tag=business" },
            { label: "New Listings", sub: "Just added", link: "/productSearch?advertisement_purpose=Rent&sort=newest" },
          ],
        },
        {
          heading: "By Location",
          links: [
            { label: "Kathmandu Valley", sub: "Kathmandu, Lalitpur & Bhaktapur", link: "/productSearch?advertisement_purpose=Rent&district=kathmandu,lalitpur,bhaktapur" },
            { label: "Kathmandu", sub: "Capital rentals", link: "/productSearch?advertisement_purpose=Rent&keyword=kathmandu" },
            { label: "Lalitpur", sub: "Patan & surrounds", link: "/productSearch?advertisement_purpose=Rent&keyword=lalitpur" },
            { label: "Bhaktapur", sub: "Heritage zone", link: "/productSearch?advertisement_purpose=Rent&keyword=bhaktapur" },
            { label: "Chitwan", sub: "Bharatpur city", link: "/productSearch?advertisement_purpose=Rent&keyword=chitwan" },
          ],
        },
      ],
    },
  },
  {
    id: "services",
    label: "Services",
    mega: {
      featured: {
        title: "Full-Service Real Estate",
        desc: "From valuation to legal documentation — Shetal Real Estate handles every step of your property journey.",
        cta: "Explore All Services",
        link: "/services",
        stat: "15+ Years of Expertise",
      },
      columns: [
        {
          heading: "Our Services",
          links: [
            { label: "Property Valuation", sub: "Fair market pricing", link: "/services/valuation" },
            { label: "Legal & Documentation", sub: "Title & deed support", link: "/services/legal" },
            { label: "Home Loan Assistance", sub: "Bank tie-ups", link: "/services/loan" },
            { label: "Interior Design", sub: "End-to-end design", link: "/services/interior" },
            { label: "Property Management", sub: "Hands-off ownership", link: "/services/management" },
          ],
        },
        {
          heading: "For Owners",
          links: [
            { label: "List Your Property", sub: "Become an agent to post", link: "/my-profile?section=my-plan" },
            { label: "Demand Registration", sub: "Find buyers fast", link: "/property-demand" },
            { label: "Market Insights", sub: "Price trends & data", link: "/market-insights" },
            { label: "Investment Advisory", sub: "Expert guidance", link: "/services/investment" },
            { label: "NRN / Foreign Buyers", sub: "International rules", link: "/services/nrn" },
          ],
        },
        {
          heading: "Resources",
          links: [
            { label: "Buying Guide", sub: "Step-by-step help", link: "/guides/buying" },
            { label: "Renting Guide", sub: "Tenant rights & tips", link: "/guides/renting" },
            { label: "Legal Checklist", sub: "Due diligence list", link: "/guides/legal-checklist" },
            { label: "EMI Calculator", sub: "Plan your loan", link: "/tools/emi-calculator" },
            { label: "FAQ", sub: "Common questions", link: "/faq" },
          ],
        },
      ],
    },
  },
  {
    id: "invest",
    label: "Investments",
    mega: {
      featured: {
        title: "Invest Smart in Nepal",
        desc: "Nepal's real estate market is growing. Get expert guidance on high-return investment properties and emerging zones.",
        cta: "See Investment Properties",
        link: "/investment",
        stat: "Avg. 12% Annual Returns",
      },
      columns: [
        {
          heading: "Investment Types",
          links: [
            { label: "Premium Plots", sub: "High-growth zones", link: "/productSearch?tag=premium-land" },
            { label: "Apartment Projects", sub: "Under-construction", link: "/productSearch?tag=project" },
            { label: "Commercial Buildings", sub: "Rental income", link: "/productSearch?tag=commercial-invest" },
            { label: "Resort & Tourism", sub: "Hospitality assets", link: "/productSearch?tag=resort" },
            { label: "Industrial Land", sub: "Manufacturing zones", link: "/productSearch?tag=industrial" },
          ],
        },
        {
          heading: "Tools & Resources",
          links: [
            { label: "ROI Calculator", sub: "Estimate returns", link: "/tools/roi-calculator" },
            { label: "Land Price Estimates", sub: "Land Price Estimates", link: "/tools/land-estimator" },
            { label: "Property tax", sub: "Calculate property tax", link: "/tools/property-tax" },
            { label: "Rent Vs Buy", sub: "Compare rent vs buy", link: "/tools/rent-vs-buy" },
            { label: "Emi Calculator", sub: "Plan your loan", link: "/tools/emi-calculator" },
          ],
        },
        {
          heading: "Why Invest in Nepal",
          links: [
            { label: "Stable Market Growth", sub: "10yr trend analysis", link: "/blog/top-5-areas-to-invest-in-nepal-in-2026-1778657157" },
            { label: "Tax Benefits", sub: "Govt incentives", link: "/blog/top-5-areas-to-invest-in-nepal-in-2026-1778657157" },
            { label: "Infrastructure Projects", sub: "New roads & metros", link: "/blog/top-5-areas-to-invest-in-nepal-in-2026-1778657157" },
            { label: "Tourism Boom", sub: "Hospitality demand", link: "/blog/top-5-areas-to-invest-in-nepal-in-2026-1778657157" },
            { label: "Success Stories", sub: "Investor testimonials", link: "/about" },
          ],
        },
      ],
    },
  },
  {
    id: "about",
    label: "About Us",
    mega: {
      featured: {
        title: "Nepal's Future-Ready Real Estate Brand",
        desc: "Shetal Real Estate — building trust, long-term value, and future-ready communities across Nepal. Founded to modernize real estate through transparency, professionalism, and innovation.",
        cta: "Our Full Story",
        link: "/About",
        stat: "5,000+ Families Served",
      },
      columns: [
        {
          heading: "Company",
          links: [
            { label: "About Shetal", sub: "Our mission & story", link: "/About" },
            { label: "Our Team", sub: "Meet the experts", link: "/about" },
            { label: "Find an Agent", sub: "Local specialists", link: "/agents" },
            { label: "Careers", sub: "Join our team", link: "/about" },
            { label: "Blogs & Articles", sub: "Insights & research", link: "/blog" },
          ],
        },
        {
          heading: "What We Do",
          links: [
            { label: "Exclusive Property Sales", sub: "Strategic sales & branding", link: "/about" },
            { label: "Property Management", sub: "End-to-end management", link: "/about" },
            { label: "Real Estate Development", sub: "Plotting & housing projects", link: "/about" },
            { label: "Investment & Hospitality", sub: "High-return ecosystems", link: "/about" },
            { label: "NRN / Foreign Buyers", sub: "International rules", link: "/about" },
          ],
        },
        {
          heading: "Connect",
          links: [
            { label: "Contact Us", sub: "Get in touch", link: "/about" },
            { label: "Requirement Form", sub: "Tell us what you need", link: "/requirementform" },
            { label: "Visit Our Office", sub: "Directions & hours", link: "/about" },
            { label: "Client Reviews", sub: "What people say", link: "/about" },
            { label: "Partner With Us", sub: "Investor & developer tie-ups", link: "/about" },
          ],
        },
      ],
    },
  },
];

// ─── Full-Width Mega Menu ─────────────────────────────────────────────────────
const MegaMenu = ({ item, onClose, isOpen }) => {
  const { mega } = item;

  return (
    <div
      style={{
        position: "fixed",
        top: "64px",
        left: 0,
        right: 0,
        zIndex: 50,
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0)" : "translateY(-8px)",
        pointerEvents: isOpen ? "auto" : "none",
        transition: "opacity 0.22s cubic-bezier(0.16,1,0.3,1), transform 0.25s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Top border accent */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, var(--r) 0%, var(--r) 50%, var(--r) 100%)" }} />

      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid var(--l)",
          boxShadow: "0 20px 60px -10px rgba(0,0,0,0.18), 0 8px 20px -5px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px", display: "flex" }}>

          {/* Featured Panel */}
          <div
            style={{
              width: "280px",
              flexShrink: 0,
              padding: "32px 32px 32px 0",
              borderRight: "1px solid var(--l)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--r)" }}>
              {item.label}
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--d)", lineHeight: "1.3", margin: 0 }}>
              {mega.featured.title}
            </h3>
            <p style={{ fontSize: "13px", color: "var(--d)", lineHeight: "1.6", margin: 0, flex: 1 }}>
              {mega.featured.desc}
            </p>

            {/* Stat pill — no dot icon */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              background: "var(--r06)", borderRadius: "4px",
              padding: "6px 12px", width: "fit-content",
            }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--rd)" }}>{mega.featured.stat}</span>
            </div>

            <Link
              to={mega.featured.link}
              onClick={onClose}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                background: "var(--r)", color: "#fff",
                textDecoration: "none", borderRadius: "4px",
                fontSize: "13px", fontWeight: 700,
                padding: "12px 20px", cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--rd)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--r)"}
            >
              {mega.featured.cta}
              <IoArrowForwardOutline style={{ width: "14px", height: "14px" }} />
            </Link>
          </div>

          {/* Columns */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: `repeat(${mega.columns.length}, 1fr)`, gap: "0" }}>
            {mega.columns.map((col, cIdx) => (
              <div
                key={cIdx}
                style={{
                  padding: "28px 28px",
                  borderRight: cIdx < mega.columns.length - 1 ? "1px solid var(--l)" : "none",
                }}
              >
                <p style={{
                  fontSize: "10px", fontWeight: 700,
                  letterSpacing: "2px", textTransform: "uppercase",
                  color: "var(--r)", margin: "0 0 16px 0",
                  paddingBottom: "10px",
                  borderBottom: "1px solid var(--l)",
                }}>
                  {col.heading}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {col.links.map((lnk, lIdx) => (
                    <Link
                      key={lIdx}
                      to={lnk.link}
                      onClick={onClose}
                      style={{
                        display: "flex", flexDirection: "column", gap: "1px",
                        width: "100%", textAlign: "left",
                        textDecoration: "none",
                        padding: "9px 10px", borderRadius: "4px",
                        cursor: "pointer",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--r06)"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}
                    >
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--d)" }}>
                        {lnk.label}
                      </span>
                      {lnk.sub && (
                        <span style={{ fontSize: "11px", color: "var(--d)" }}>
                          {lnk.sub}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer bar */}
        <div style={{
          borderTop: "1px solid var(--l)",
          background: "var(--l)",
          padding: "12px 40px",
        }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: "11px", color: "var(--d)", margin: 0 }}>
              Shetal Real Estate — Building Trust, Long-Term Value & Future-Ready Communities
            </p>
            <Link
              to="/requirementform"
              onClick={onClose}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                textDecoration: "none",
                fontSize: "11px", fontWeight: 700, color: "var(--r)",
              }}
            >
              <IoDocumentTextOutline style={{ width: "13px", height: "13px" }} />
              Submit a Requirement →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Header ──────────────────────────────────────────────────────────────
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const closeTimer = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isTransparent = isHome && !isScrolled;

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
    closeTimer.current = setTimeout(() => setActiveNav(null), 140);
  };

  const handleClose = () => {
    clearTimeout(closeTimer.current);
    setActiveNav(null);
  };

  // Agent-branded requirement form (opened via QR/link with ?agent_id=)
  // is a bare, standalone page — no site header.
  const isAgentBareForm = location.pathname.toLowerCase() === "/requirementform" && searchParams.has("agent_id");
  if (isAgentBareForm) return null;

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* ── Header bar ── */}
      <header
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 60,
          height: "64px",
          display: "flex",
          alignItems: "center",
          transition: "background 0.4s, box-shadow 0.4s",
          background: isTransparent ? "transparent" : "rgba(255,255,255,0.97)",
          backdropFilter: isTransparent ? "none" : "blur(12px)",
          WebkitBackdropFilter: isTransparent ? "none" : "blur(12px)",
          boxShadow: isTransparent ? "none" : "0 1px 0 rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 25px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          {/* ── LEFT: Logo ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
            <div
              style={{ display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0 }}
              onClick={() => { navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            >
              <img
                src="/shetallogo.png"
                alt="Shetal Real Estate"
                style={{ height: "38px", width: "auto" }}
              />
            </div>
          </div>

          {/* ── RIGHT: Nav + Actions ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>

            {/* Desktop nav — hidden on mobile */}
            <nav
              className="hidden lg:flex"
              style={{ alignItems: "center", gap: "2px" }}
            >
              {NAV_ITEMS.map((item) => {
                const isOpen = activeNav === item.id;
                return (
                  <div
                    key={item.id}
                    style={{ position: "relative" }}
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => { navigate(item.mega.featured.link); handleClose(); }}
                      style={{
                        background: isOpen
                          ? isScrolled ? "var(--r06)" : "rgba(255,255,255,0.15)"
                          : "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: isTransparent
                          ? "rgba(255,255,255,0.9)"
                          : isOpen ? "var(--r)" : "var(--d)",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        transition: "all 0.15s",
                        whiteSpace: "nowrap",
                        letterSpacing: "0.01em",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                      onMouseEnter={e => {
                        if (!isOpen) {
                          e.currentTarget.style.color = isTransparent ? "#fff" : "var(--r)";
                          e.currentTarget.style.background = isTransparent ? "rgba(255,255,255,0.12)" : "var(--r06)";
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isOpen) {
                          e.currentTarget.style.color = isTransparent ? "rgba(255,255,255,0.9)" : "var(--d)";
                          e.currentTarget.style.background = "none";
                        }
                      }}
                    >
                      {item.label}
                    </button>

                    <MegaMenu
                      item={item}
                      onClose={handleClose}
                      isOpen={isOpen}
                    />
                  </div>
                );
              })}
            </nav>

            {/* Favourites */}
            {user.data && (
              <button
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "8px", borderRadius: "4px",
                  color: isTransparent ? "rgba(255,255,255,0.8)" : "var(--d)",
                  position: "relative", transition: "all 0.15s",
                }}
                onClick={() => navigate("/my-profile?section=favourites")}
              >
                {favorites?.data?.length > 0 ? (
                  <AiFillHeart style={{ width: "19px", height: "19px", color: "var(--r)" }} />
                ) : (
                  <AiOutlineHeart style={{ width: "19px", height: "19px" }} />
                )}
                {favorites?.data?.length > 0 && (
                  <span style={{
                    position: "absolute", top: "4px", right: "4px",
                    background: "var(--r)", color: "#fff",
                    fontSize: "8px", fontWeight: 700,
                    borderRadius: "999px", minWidth: "14px", height: "14px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    lineHeight: 1,
                  }}>
                    {favorites.data.length}
                  </span>
                )}
              </button>
            )}

            {/* Auth / User menu */}
            {!user.data ? (
              <button
                className="hidden sm:flex"
                onClick={() => setAuthModal(true)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "8px", borderRadius: "4px",
                  transition: "all 0.15s",
                }}
              >

                <IoPersonOutline style={{ width: "19px", height: "19px" }} />
              </button>
            ) : (
               <Menu as="div" className="hidden sm:flex" style={{ position: "relative" }}>
                <Menu.Button
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "4px 8px 4px 4px", borderRadius: "999px",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  <img
                    src={user.data?.photo || "/noUser.png"}
                    alt="user"
                    style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--r)" }}
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
                  <Menu.Items
                    style={{
                      position: "absolute", right: 0, marginTop: "8px",
                      width: "176px", background: "#fff",
                      borderRadius: "4px",
                      boxShadow: "0 10px 40px -5px rgba(0,0,0,0.15), 0 4px 10px -3px rgba(0,0,0,0.06)",
                      border: "0.5px solid var(--l)",
                      overflow: "hidden", zIndex: 70,
                      outline: "none",
                    }}
                  >
                    <div style={{ padding: "12px 16px 10px", borderBottom: "0.5px solid var(--l)", background: "linear-gradient(135deg, var(--r06), #fff)" }}>
                      <p style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2px", color: "var(--r)", margin: 0, textTransform: "uppercase" }}>My Account</p>
                    </div>
                    <div style={{ padding: "6px" }}>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/my-profile?section=profile"
                            style={{
                              display: "flex", alignItems: "center", gap: "10px",
                              padding: "10px 12px", borderRadius: "4px",
                              textDecoration: "none", fontSize: "13px", fontWeight: 600,
                              color: active ? "var(--r)" : "var(--d)",
                              background: active ? "var(--r06)" : "transparent",
                              transition: "all 0.1s",
                            }}
                          >
                            <span style={{
                              width: "24px", height: "24px", borderRadius: "4px",
                              background: active ? "var(--r14)" : "var(--l)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <IoPersonOutline style={{ width: "13px", height: "13px" }} />
                            </span>
                            My Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            style={{
                              display: "flex", alignItems: "center", gap: "10px",
                              width: "100%", padding: "10px 12px", borderRadius: "4px",
                              textAlign: "left", background: active ? "var(--r06)" : "transparent",
                              border: "none", fontSize: "13px", fontWeight: 600,
                              color: active ? "var(--r)" : "var(--d)",
                              cursor: "pointer", transition: "all 0.1s",
                            }}
                          >
                            <span style={{
                              width: "24px", height: "24px", borderRadius: "4px",
                              background: active ? "var(--r14)" : "var(--l)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <IoLogOutOutline style={{ width: "13px", height: "13px" }} />
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
            <button
              onClick={() => {
                if (!user.data) { setAuthModal(true); return; }
                const isAgent = !!(user.data?.is_agent || user.data?.subscription_tier?.startsWith("Agent"));
                if (isAgent) { window.open("https://admin.sheetalproperty.com", "_blank"); return; }
                navigate("/my-profile?section=my-plan");
              }}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 10px", borderRadius: "4px",
                fontSize: "13px", fontWeight: 700,
                textDecoration: "none",
                background: isTransparent ? "rgba(255,255,255,0.0)" : "var(--r)",
                color: "var(--l)",
                WebkitBackdropFilter: isScrolled ? "none" : "blur(8px)",
                transition: "all 0.2s",
                marginLeft: "4px",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isTransparent ? "rgba(255,255,255,0.28)" : "var(--rd)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isTransparent ? "rgba(255,255,255,0.18)" : "var(--r)";
              }}
            >
              <span className="sm:inline">Post Property</span>
            </button>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden"
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "8px", borderRadius: "4px",
                color: isTransparent ? "rgba(255,255,255,0.9)" : "var(--d)",
                marginLeft: "2px",
              }}
              onClick={() => setSidebarOpen(true)}
            >
              <IoMenuOutline style={{ width: "22px", height: "22px" }} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Full-width mega menu backdrop ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          top: "64px",
          zIndex: 40,
          background: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          opacity: activeNav ? 1 : 0,
          pointerEvents: activeNav ? "auto" : "none",
          transition: "opacity 0.22s",
        }}
        onMouseEnter={handleMouseLeave}
        onClick={handleClose}
      />

      {/* ── Mega menu mouse bridge ── */}
      {activeNav && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            height: "8px",
            zIndex: 55,
          }}
          onMouseEnter={() => handleMouseEnter(activeNav)}
          onMouseLeave={handleMouseLeave}
        />
      )}

      {/* Render one mega menu per nav item */}
      {NAV_ITEMS.map((item) => (
        <div
          key={item.id}
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
          style={{ zIndex: 999, position: "relative" }}
        >
          <MegaMenu
            item={item}
            onClose={handleClose}
            isOpen={activeNav === item.id}
          />
        </div>
      ))}

      {/* Auth modals */}
      {authModal === "forgot-password" ? (
        <ForgotPasswordModel setR={setAuthModal} />
      ) : (
        authModal && <LoginModel r={authModal} setR={setAuthModal} />
      )}
    </>
  );
};

export default Header;