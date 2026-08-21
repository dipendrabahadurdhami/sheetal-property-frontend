import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  IoCloseOutline,
  IoChevronForwardOutline,
  IoHomeOutline,
  IoKeyOutline,
  IoBriefcaseOutline,
  IoTrendingUpOutline,
  IoInformationCircleOutline,
  IoPersonOutline,
  IoHeartOutline,
  IoBusinessOutline,
  IoLogOutOutline,
  IoAddOutline,
  IoSearchOutline,
  IoCallOutline,
  IoArrowForwardOutline,
  IoChevronDownOutline,
} from "react-icons/io5";

import LoginModel from "../../Login/LoginModel";
import { removeUserInfo } from "../../../features/slices/userInformation";
import { removeAllFavorites } from "../../../features/slices/favourites";

// ─── Full nav mirrored from Header NAV_ITEMS ────────────────────────────────
const SIDEBAR_NAV = [
  {
    id: "buy",
    label: "Buy Property",
    icon: IoKeyOutline,
    featuredLink: "/sale",
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
  {
    id: "rent",
    label: "Rent & Lease",
    icon: IoHomeOutline,
    featuredLink: "/rent",
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
  {
    id: "services",
    label: "Services",
    icon: IoBriefcaseOutline,
    featuredLink: "/services",
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
  {
    id: "invest",
    label: "Investments",
    icon: IoTrendingUpOutline,
    featuredLink: "/investment",
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
          { label: "Land Price Estimates", sub: "Area-wise estimates", link: "/tools/land-estimator" },
          { label: "Property Tax", sub: "Calculate property tax", link: "/tools/property-tax" },
          { label: "Rent Vs Buy", sub: "Compare rent vs buy", link: "/tools/rent-vs-buy" },
          { label: "EMI Calculator", sub: "Plan your loan", link: "/tools/emi-calculator" },
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
  {
    id: "about",
    label: "About Us",
    icon: IoInformationCircleOutline,
    featuredLink: "/About",
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
          { label: "Requirement Form", sub: "Tell us what you need", link: "/requirementForm?agent_id=1" },
          { label: "Visit Our Office", sub: "Directions & hours", link: "/about" },
          { label: "Client Reviews", sub: "What people say", link: "/about" },
          { label: "Partner With Us", sub: "Investor & developer tie-ups", link: "/about" },
        ],
      },
    ],
  },
];

// ── Column accordion (level 2) ──────────────────────────────────────────────
const ColumnRow = ({ col, navigate, setSidebarOpen }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Column heading toggle */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "9px 20px 9px 48px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            flex: 1,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "1.8px",
            textTransform: "uppercase",
            color: open ? "#b91c1c" : "#9ca3af",
            transition: "color 0.15s",
          }}
        >
          {col.heading}
        </span>
        <IoChevronDownOutline
          style={{
            width: "12px",
            height: "12px",
            color: "#d1d5db",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s cubic-bezier(0.16,1,0.3,1)",
            flexShrink: 0,
          }}
        />
      </button>

      {/* Sub-links */}
      <div
        style={{
          maxHeight: open ? `${col.links.length * 65}px` : "0",
          overflow: "hidden",
          transition: "max-height 0.28s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{ paddingBottom: "4px" }}>
          {col.links.map((lnk, i) => (
            <button
              key={i}
              onClick={() => { navigate(lnk.link); setSidebarOpen(false); }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1px",
                width: "100%",
                padding: "8px 20px 8px 56px",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              <span style={{ fontSize: "13px", fontWeight: 500, color: "#374151", letterSpacing: "-0.01em" }}>
                {lnk.label}
              </span>
              {lnk.sub && (
                <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                  {lnk.sub}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Section accordion (level 1) ─────────────────────────────────────────────
const NavRow = ({ item, navigate, setSidebarOpen }) => {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  return (
    <div>
      {/* Section header */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "13px 20px",
          background: open ? "#fef2f2" : "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.15s",
        }}
      >
        <Icon
          style={{
            width: "17px",
            height: "17px",
            color: open ? "#b91c1c" : "#9ca3af",
            flexShrink: 0,
            transition: "color 0.15s",
          }}
        />
        <span
          style={{
            flex: 1,
            fontSize: "14px",
            fontWeight: 600,
            color: open ? "#111827" : "#374151",
            letterSpacing: "-0.01em",
            transition: "color 0.15s",
          }}
        >
          {item.label}
        </span>
        <IoChevronForwardOutline
          style={{
            width: "14px",
            height: "14px",
            color: open ? "#b91c1c" : "#d1d5db",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.22s cubic-bezier(0.16,1,0.3,1), color 0.15s",
            flexShrink: 0,
          }}
        />
      </button>

      {/* Expanded: "Browse All" CTA + column accordions */}
      <div
        style={{
          maxHeight: open ? "1200px" : "0",
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Browse All CTA */}
        <div style={{ padding: "6px 16px 4px 1px" }}>
          <button
            onClick={() => { navigate(item.featuredLink); setSidebarOpen(false); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              padding: "9px 12px",
              background: "#b91c1c",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.01em",
            }}
          >
            <span style={{ flex: 1 }}>Browse All {item.label}</span>
            <IoArrowForwardOutline style={{ width: "12px", height: "12px", opacity: 0.6 }} />
          </button>
        </div>

        {/* Column accordions */}
        <div style={{ paddingBottom: "8px" }}>
          {item.columns.map((col, cIdx) => (
            <ColumnRow
              key={cIdx}
              col={col}
              navigate={navigate}
              setSidebarOpen={setSidebarOpen}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "#f3f4f6", margin: "0 20px" }} />
    </div>
  );
};

// ── Main Sidebar ─────────────────────────────────────────────────────────────
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

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          style={{ position: "fixed", inset: 0, display: "flex", zIndex: 9999 }}
          className="lg:hidden"
          onClose={setSidebarOpen}
        >
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-250"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }}
            />
          </Transition.Child>

          {/* Panel */}
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in duration-220 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: "300px",
                height: "100%",
                background: "#fff",
                overflow: "clip",
              }}
            >
              {/* ── Header ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 20px 16px",
                  flexShrink: 0,
                }}
              >
                <img
                  src="/shetallogo.png"
                  alt="Sheetal Real Estate"
                  style={{ height: "32px", width: "auto" }}
                />
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "4px",
                    border: "none",
                    background: "#f9fafb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#6b7280",
                  }}
                >
                  <IoCloseOutline style={{ width: "18px", height: "18px" }} />
                </button>
              </div>

              {/* ── Search ── */}
              <div style={{ padding: "0 16px 14px", flexShrink: 0 }}>
                <button
                  onClick={() => { navigate("/productSearch"); setSidebarOpen(false); }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    background: "#f9fafb",
                    border: "1px solid #f3f4f6",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  <IoSearchOutline style={{ width: "15px", height: "15px", color: "#9ca3af", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", color: "#9ca3af" }}>Search properties…</span>
                </button>
              </div>

              {/* ── Top divider ── */}
              <div style={{ height: "1px", background: "#f3f4f6", flexShrink: 0 }} />

              {/* ── Scrollable content ── */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {/* Nav accordion — Level 1 */}
                <div style={{ paddingTop: "8px" }}>
                  {SIDEBAR_NAV.map((item) => (
                    <NavRow
                      key={item.id}
                      item={item}
                      navigate={navigate}
                      setSidebarOpen={setSidebarOpen}
                    />
                  ))}
                </div>

                {/* ── Quick contact ── */}
                <div style={{ padding: "20px 20px 8px" }}>
                  <p style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "#d1d5db",
                    marginBottom: "10px",
                  }}>
                    Contact
                  </p>
                  <button
                    onClick={() => { navigate("/agents"); setSidebarOpen(false); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                      padding: "11px 14px",
                      background: "#f9fafb",
                      border: "1px solid #f3f4f6",
                      borderRadius: "4px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "4px",
                        background: "#fef2f2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <IoCallOutline style={{ width: "14px", height: "14px", color: "#b91c1c" }} />
                    </span>
                    <div>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: "#111827", margin: 0 }}>
                        Talk to an agent
                      </p>
                      <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>Free consultation</p>
                    </div>
                    <IoArrowForwardOutline style={{ width: "13px", height: "13px", color: "#d1d5db", marginLeft: "auto" }} />
                  </button>
                </div>

                {/* ── Account (logged in only) ── */}
                {user.data && (
                  <div style={{ padding: "8px 20px 16px" }}>
                    <p style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      color: "#d1d5db",
                      marginBottom: "10px",
                    }}>
                      Account
                    </p>

                    {/* User card */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        background: "#fafafa",
                        borderRadius: "4px",
                        border: "1px solid #f3f4f6",
                        marginBottom: "8px",
                      }}
                    >
                      <img
                        src={user.data?.photo || "/noUser.png"}
                        alt="user"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "1.5px solid #fca5a5",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#111827",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {user.data?.name || "My Account"}
                        </p>
                        <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>Signed in</p>
                      </div>
                    </div>

                    {[
                      { label: "My Profile", icon: IoPersonOutline, link: "/my-profile?section=profile" },
                      { label: "Favourites", icon: IoHeartOutline, link: "/my-profile?section=favourites" },
                      { label: "My Properties", icon: IoBusinessOutline, link: "/my-profile?section=my-properties" },
                    ].map((acct) => {
                      const AIcon = acct.icon;
                      return (
                        <Link
                          key={acct.label}
                          to={acct.link}
                          onClick={() => setSidebarOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px 4px",
                            textDecoration: "none",
                            borderBottom: "1px solid #f9fafb",
                          }}
                        >
                          <AIcon style={{ width: "15px", height: "15px", color: "#9ca3af", flexShrink: 0 }} />
                          <span style={{ flex: 1, fontSize: "13px", fontWeight: 500, color: "#374151" }}>
                            {acct.label}
                          </span>
                          <IoArrowForwardOutline style={{ width: "12px", height: "12px", color: "#e5e7eb" }} />
                        </Link>
                      );
                    })}
                  </div>
                )}

                <div style={{ height: "12px" }} />
              </div>

              {/* ── Bottom actions ── */}
              <div
                style={{
                  padding: "14px 16px",
                  borderTop: "1px solid #f3f4f6",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    if (!user.data) { setAuthModal(true); return; }
                    const isAgent = !!(user.data?.is_agent || user.data?.subscription_tier?.startsWith("Agent"));
                    if (isAgent) {
                      if (user.data?.subscription_tier === "Agent: Bronze") {
                        navigate("/my-profile?section=my-plan");
                      } else {
                        window.open("https://admin.sheetalproperty.com", "_blank");
                      }
                      return;
                    }
                    navigate("/my-profile?section=my-plan");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "7px",
                    padding: "13px",
                    background: "#b91c1c",
                    color: "#fff",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    width: "100%",
                  }}
                >
                  <IoAddOutline style={{ width: "16px", height: "16px" }} />
                  Post a Property — Free
                </button>

                {!user.data ? (
                  <button
                    onClick={() => { setAuthModal(true); setSidebarOpen(false); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "7px",
                      padding: "11px",
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#374151",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <IoPersonOutline style={{ width: "15px", height: "15px", color: "#6b7280" }} />
                    Login / Register
                  </button>
                ) : (
                  <button
                    onClick={handleSignOut}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "7px",
                      padding: "11px",
                      background: "#fff",
                      border: "1px solid #fee2e2",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#b91c1c",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <IoLogOutOutline style={{ width: "15px", height: "15px" }} />
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </Transition.Child>

          <div style={{ flexShrink: 0, width: "56px" }} aria-hidden="true" />
        </Dialog>
      </Transition.Root>

      {authModal && <LoginModel r={authModal} setR={setAuthModal} />}
    </>
  );
};

export default Sidebar;