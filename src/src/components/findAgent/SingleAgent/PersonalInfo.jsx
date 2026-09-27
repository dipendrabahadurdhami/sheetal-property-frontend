import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchUserInformation } from "../../../features/slices/userInformation";
import { FaCamera, FaExclamationCircle } from "react-icons/fa";
import { IoLocationOutline, IoBriefcaseOutline } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import fallBackSrc from "../../../assets/images/noUser.png";
import apiClient from "../../../utils/apiClient";
import { toast } from "react-toastify";

const PROFILE_FIELDS = [
  "first_name", "last_name", "phone", "mobile",
  "city", "address_1", "description", "designation",
  "company_name", "facebook_url", "instagram_url",
  "tiktok_url", "youtube_url", "photo",
];

const calcCompletion = (data) => {
  if (!data) return 0;
  const filled = PROFILE_FIELDS.filter(
    (f) => data[f] && String(data[f]).trim()
  ).length;
  return Math.round((filled / PROFILE_FIELDS.length) * 100);
};

const getColor = (pct) => {
  if (pct >= 80) return "#27ae60";
  if (pct >= 50) return "#f39c12";
  return "#e74c3c";
};

const getLabel = (pct) => {
  if (pct >= 80) return "Great profile!";
  if (pct >= 50) return "Keep going";
  return "Complete your profile";
};

const PersonalInfo = ({ data }) => {
  const dispatch = useDispatch();
  const fileRef  = useRef(null);

  const agentName =
    data?.first_name && data?.last_name
      ? `${data.first_name} ${data.last_name}`
      : data?.first_name || data?.user_name || "Agent";

  const emailVerified = !!data?.email_verified_at;
  const isAgent       = !!data?.is_agent;
  const completion    = calcCompletion(data);
  const color         = getColor(completion);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo must be under 2MB.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("photo", file);
      await apiClient.post("update-profile", formData);
      dispatch(fetchUserInformation());
      toast.success("Photo updated!");
    } catch {
      toast.error("Failed to update photo.");
    }
  };

  const missing = [
    !data?.phone        && "phone",
    !data?.city         && "city",
    !data?.description  && "bio",
    !data?.photo        && "photo",
    !data?.company_name && isAgent && "company name",
  ].filter(Boolean).slice(0, 3);

  return (
    <div style={{
      background: "#fff", border: "1px solid #dde3ea",
      borderRadius: 14, padding: 24, marginBottom: 24,
    }}>

      {/* Email not verified warning */}
      {!emailVerified && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 14px", background: "#fef9e7",
          border: "1px solid #f39c12", borderRadius: 8,
          marginBottom: 16, fontSize: 12, color: "#7f6003",
        }}>
          <FaExclamationCircle style={{ color: "#f39c12", flexShrink: 0 }} />
          Your email is not verified. Check your inbox to get your verified badge.
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>

        {/* Avatar with camera */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 88, height: 88, borderRadius: "50%",
            overflow: "hidden", border: "3px solid #fecaca",
            background: "#f5f5f5",
          }}>
            <img
              src={data?.photo || fallBackSrc}
              alt={agentName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            title="Change photo"
            style={{
              position: "absolute", bottom: 0, right: 0,
              width: 26, height: 26, borderRadius: "50%",
              background: "#e74c3c", border: "2px solid #fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#fff", fontSize: 11,
            }}
          >
            <FaCamera />
          </button>
          <input
            ref={fileRef} type="file" accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoChange}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 180 }}>

          {/* Name + badges */}
          <div style={{
            display: "flex", alignItems: "center",
            gap: 8, flexWrap: "wrap", marginBottom: 4,
          }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#2c3e50" }}>
              {agentName}
            </h1>
            {emailVerified && (
              <span style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "#eafaf1", border: "1px solid #a9dfbf",
                borderRadius: 20, padding: "2px 10px",
                fontSize: 11, fontWeight: 700, color: "#1e8449",
              }}>
                <MdVerified style={{ color: "#27ae60", fontSize: 13 }} />
                Verified
              </span>
            )}
            {isAgent && data?.subscription_tier && (
              <span style={{
                background: "#fef9e7", border: "1px solid #f9ca24",
                borderRadius: 20, padding: "2px 10px",
                fontSize: 11, fontWeight: 700, color: "#b7770d",
              }}>
                {data.subscription_tier}
              </span>
            )}
          </div>

          {/* Designation */}
          <p style={{
            margin: "0 0 8px", fontSize: 11, fontWeight: 700,
            color: "#e74c3c", textTransform: "uppercase", letterSpacing: "0.1em",
          }}>
            {data?.designation || (isAgent ? "Sheetal Property Agent" : "Member")}
          </p>

          {/* Location */}
          {(data?.city || data?.address_1) && (
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 13, color: "#7f8c8d", marginBottom: 4,
            }}>
              <IoLocationOutline style={{ flexShrink: 0 }} />
              <span>{[data.city, data.address_1].filter(Boolean).join(", ")}</span>
            </div>
          )}

          {/* Company */}
          {data?.company_name && (
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 13, color: "#7f8c8d",
            }}>
              <IoBriefcaseOutline style={{ flexShrink: 0 }} />
              <span>{data.company_name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Completion bar */}
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #f0f3f7" }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 6,
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color }}>
            {getLabel(completion)}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color }}>
            {completion}% complete
          </span>
        </div>
        <div style={{ background: "#f0f3f7", borderRadius: 20, height: 7, overflow: "hidden" }}>
          <div style={{
            width: `${completion}%`, background: color,
            height: "100%", borderRadius: 20, transition: "width 0.6s ease",
          }} />
        </div>
        {completion < 80 && missing.length > 0 && (
          <p style={{ margin: "8px 0 0", fontSize: 11, color: "#7f8c8d" }}>
            Add your {missing.join(", ")} to improve your profile.
          </p>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;