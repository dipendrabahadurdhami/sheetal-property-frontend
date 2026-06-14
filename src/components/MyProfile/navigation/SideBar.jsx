import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaSpinner, FaCrown } from "react-icons/fa";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { toast } from "react-toastify";
import {
  IoPersonOutline, IoHomeOutline, IoHeartOutline,
  IoAddOutline, IoNotificationsOutline, IoLogOutOutline,
  IoShareSocialOutline,
} from "react-icons/io5";
import { fetchUserInformation, removeUserInfo } from "../../../features/slices/userInformation";
import { removeAllFavorites } from "../../../features/slices/favourites";
import apiClient from "../../../utils/apiClient";

const NAV = [
  { name: "My Profile",    href: "profile",       icon: IoPersonOutline,        agentOnly: false },
  { name: "Social Links",  href: "social",        icon: IoShareSocialOutline,   agentOnly: false },
  { name: "My Properties", href: "my-properties", icon: IoHomeOutline,          agentOnly: true  },
  { name: "Post Property", href: "post-property", icon: IoAddOutline,           agentOnly: true  },
  { name: "Favourites",    href: "favourites",    icon: IoHeartOutline,         agentOnly: false },
  { name: "Notifications", href: "notifications", icon: IoNotificationsOutline, agentOnly: true  },
  { name: "My Plan",       href: "my-plan",       icon: FaCrown,                agentOnly: true  },
];

const SideBar = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const user      = useSelector((state) => state.user);
  const [params]  = useSearchParams();
  const section   = params.get("section") || "profile";
  const [image, setImage]     = useState(null);
  const [loading, setLoading] = useState(false);

  const isAgent = !!(
    user?.data?.subscription_tier?.startsWith("Agent") ||
    user?.data?.is_agent
  );

  const { user_name, first_name, last_name } = user.data || {};
  const username = first_name && last_name
    ? `${first_name} ${last_name}`
    : user_name;

  const visibleNav = NAV.filter(t => !t.agentOnly || isAgent);

  useEffect(() => {
    if (user?.data?.photo) setImage(user.data.photo);
  }, [user]);

  const readURL = (input) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(input.files[0]);
    }
  };

  const onInputChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    readURL(e.target);
    const formData = new FormData();
    formData.append("photo", file);
    setLoading(true);
    try {
      const res = await apiClient.post("update-profile", formData);
      if (res.status === 200) {
        dispatch(fetchUserInformation());
        toast.success("Profile photo updated!");
      }
    } catch {
      toast.error("Failed to update photo.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sheetal_token");
    dispatch(removeUserInfo());
    dispatch(removeAllFavorites());
    navigate("/", { replace: true });
  };

  return (
    <div className="hidden md:flex md:w-64 flex-col flex-shrink-0">
      <div className="flex flex-col h-full border-r border-gray-200 bg-white">
        <div className="flex flex-col pt-6 pb-4 overflow-y-auto flex-1">

          {/* Photo + name */}
          <div className="flex flex-col items-center px-4 mb-4">
            <div className="relative mb-3" style={{ width: 96, height: 96 }}>
              <img
                src={image || "/noUser.png"}
                alt={username}
                style={{
                  width: 96, height: 96, borderRadius: "50%",
                  objectFit: "cover", border: "3px solid #fecaca",
                }}
              />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "rgba(0,0,0,0.5)", borderRadius: "0 0 50px 50px",
                display: "flex", justifyContent: "center", padding: "4px 0",
              }}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                  id="sidebar-photo"
                  onChange={onInputChange}
                />
                <label htmlFor="sidebar-photo" style={{ cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
                  {loading
                    ? <FaSpinner className="spin" style={{ fontSize: 14 }} />
                    : <MdOutlineDriveFolderUpload style={{ fontSize: 16 }} />
                  }
                </label>
              </div>
            </div>

            <div className="text-red-700 text-base font-bold text-center">{username}</div>

            {isAgent && user?.data?.subscription_tier && (
              <div style={{
                marginTop: 5, fontSize: 10, fontWeight: 700,
                letterSpacing: ".08em", textTransform: "uppercase",
                background: "#fef2f2", color: "#b91c1c",
                border: "1px solid #fecaca", borderRadius: 4,
                padding: "2px 10px",
              }}>
                {user.data.subscription_tier.replace("Agent: ", "")} Agent
              </div>
            )}
          </div>

          {/* Agent portal link */}
          {isAgent && (
            <div style={{ padding: "0 12px 12px" }}>
              <a
                href="https://admin.sheetalproperty.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 6,
                  padding: "9px 14px", background: "#b91c1c",
                  color: "#fff", borderRadius: 6,
                  textDecoration: "none", fontSize: 12, fontWeight: 700,
                }}
              >
                Agent Portal →
              </a>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 px-3 space-y-1">
            {visibleNav.map((item) => {
              const Icon   = item.icon;
              const active = section === item.href;
              return (
                <Link key={item.href} to={`/my-profile?section=${item.href}`}>
                  <button
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all"
                    style={{
                      background:  active ? "#fef2f2"     : "transparent",
                      color:       active ? "#b91c1c"     : "#6b7280",
                      borderLeft:  active ? "3px solid #b91c1c" : "3px solid transparent",
                    }}
                  >
                    <Icon style={{ fontSize: 16, flexShrink: 0 }} />
                    {item.name}
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div style={{ padding: 12, borderTop: "1px solid #f0f3f7" }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-all"
          >
            <IoLogOutOutline style={{ fontSize: 16 }} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;