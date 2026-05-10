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
} from "react-icons/io5";

import LoginModel from "../../Login/LoginModel";
import { removeUserInfo } from "../../../features/slices/userInformation";
import { removeAllFavorites } from "../../../features/slices/favourites";

const SIDEBAR_NAV = [
  {
    id: "buy",
    label: "Buy Property",
    icon: IoKeyOutline,
    links: [
      { label: "Residential Houses", link: "/productSearch?advertisement_purpose=For Sale&type=house" },
      { label: "Apartments & Flats", link: "/productSearch?advertisement_purpose=For Sale&type=apartment" },
      { label: "Land & Plots", link: "/productSearch?advertisement_purpose=For Sale&type=land" },
      { label: "Commercial Space", link: "/productSearch?advertisement_purpose=For Sale&type=commercial" },
      { label: "Browse All For Sale", link: "/productSearch?advertisement_purpose=For Sale", cta: true },
    ],
  },
  {
    id: "rent",
    label: "Rent & Lease",
    icon: IoHomeOutline,
    links: [
      { label: "Rooms & Flats", link: "/productSearch?advertisement_purpose=For Rent&type=flat" },
      { label: "Full Houses", link: "/productSearch?advertisement_purpose=For Rent&type=house" },
      { label: "Office Space", link: "/productSearch?advertisement_purpose=For Rent&type=office" },
      { label: "Furnished Rentals", link: "/productSearch?advertisement_purpose=For Rent&furnished=true" },
      { label: "Browse All Rentals", link: "/productSearch?advertisement_purpose=For Rent", cta: true },
    ],
  },
  {
    id: "services",
    label: "Services",
    icon: IoBriefcaseOutline,
    links: [
      { label: "Property Valuation", link: "/services/valuation" },
      { label: "Legal & Documentation", link: "/services/legal" },
      { label: "Home Loan Assistance", link: "/services/loan" },
      { label: "Interior Design", link: "/services/interior" },
      { label: "All Services", link: "/services", cta: true },
    ],
  },
  {
    id: "invest",
    label: "Investments",
    icon: IoTrendingUpOutline,
    links: [
      { label: "Premium Plots", link: "/productSearch?tag=premium-land" },
      { label: "Apartment Projects", link: "/productSearch?tag=project" },
      { label: "Commercial Buildings", link: "/productSearch?tag=commercial-invest" },
      { label: "ROI Calculator", link: "/tools/roi-calculator" },
      { label: "Investment Properties", link: "/productSearch?tag=investment", cta: true },
    ],
  },
  {
    id: "about",
    label: "About Us",
    icon: IoInformationCircleOutline,
    links: [
      { label: "About Sheetal", link: "/about" },
      { label: "Our Team", link: "/team" },
      { label: "Find an Agent", link: "/find-agent" },
      { label: "Contact Us", link: "/contact" },
      { label: "Client Reviews", link: "/reviews", cta: true },
    ],
  },
];

// ── Single accordion row ────────────────────────────────────────────────────
const NavRow = ({ item, navigate, setSidebarOpen }) => {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "13px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
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
            fontWeight: 500,
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
            color: "#d1d5db",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s cubic-bezier(0.16,1,0.3,1)",
            flexShrink: 0,
          }}
        />
      </button>

      {/* Expanded sub-links */}
      <div
        style={{
          maxHeight: open ? "320px" : "0",
          overflow: "hidden",
          transition: "max-height 0.28s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{ paddingBottom: "6px" }}>
          {item.links.map((lnk, i) =>
            lnk.cta ? (
              <button
                key={i}
                onClick={() => { navigate(lnk.link); setSidebarOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "calc(100% - 32px)",
                  margin: "6px 16px 4px",
                  padding: "10px 14px",
                  background: "#111827",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#fff",
                  letterSpacing: "-0.01em",
                }}
              >
                <span style={{ flex: 1 }}>{lnk.label}</span>
                <IoArrowForwardOutline style={{ width: "13px", height: "13px", opacity: 0.6 }} />
              </button>
            ) : (
              <button
                key={i}
                onClick={() => { navigate(lnk.link); setSidebarOpen(false); }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "9px 20px 9px 51px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#6b7280",
                  letterSpacing: "-0.01em",
                  transition: "color 0.12s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#111827"}
                onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
              >
                {lnk.label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "#f3f4f6", margin: "0 20px" }} />
    </div>
  );
};

// ── Main Sidebar ────────────────────────────────────────────────────────────
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
          style={{ position: "fixed", inset: 0, display: "flex", zIndex: 70 }}
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
                overflow: "hidden",
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
                    width: "32px", height: "32px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#f9fafb",
                    display: "flex", alignItems: "center", justifyContent: "center",
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
                    borderRadius: "10px",
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
                {/* Nav accordion */}
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
                    fontSize: "10px", fontWeight: 600,
                    letterSpacing: "1.5px", textTransform: "uppercase",
                    color: "#d1d5db", marginBottom: "10px",
                  }}>
                    Contact
                  </p>
                  <button
                    onClick={() => { navigate("/contact"); setSidebarOpen(false); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                      padding: "11px 14px",
                      background: "#f9fafb",
                      border: "1px solid #f3f4f6",
                      borderRadius: "10px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        width: "30px", height: "30px",
                        borderRadius: "8px",
                        background: "#fef2f2",
                        display: "flex", alignItems: "center", justifyContent: "center",
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
                      fontSize: "10px", fontWeight: 600,
                      letterSpacing: "1.5px", textTransform: "uppercase",
                      color: "#d1d5db", marginBottom: "10px",
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
                        borderRadius: "10px",
                        border: "1px solid #f3f4f6",
                        marginBottom: "8px",
                      }}
                    >
                      <img
                        src={user.data?.photo || "/noUser.png"}
                        alt="user"
                        style={{
                          width: "36px", height: "36px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "1.5px solid #fca5a5",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: "13px", fontWeight: 600, color: "#111827",
                          margin: 0, overflow: "hidden",
                          textOverflow: "ellipsis", whiteSpace: "nowrap",
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
                <Link
                  to="/my-profile?section=post-property"
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "7px",
                    padding: "13px",
                    background: "#b91c1c",
                    color: "#fff",
                    borderRadius: "10px",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  <IoAddOutline style={{ width: "16px", height: "16px" }} />
                  Post a Property — Free
                </Link>

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
                      borderRadius: "10px",
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
                      borderRadius: "10px",
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