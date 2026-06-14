import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserInformation } from "../../../features/slices/userInformation";
import apiClient from "../../../utils/apiClient";
import { toast } from "react-toastify";
import { FaSpinner, FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaPinterest, FaTwitter, FaWhatsapp, FaGlobe, FaSkype, FaTiktok } from "react-icons/fa";
import { SiVimeo } from "react-icons/si";

const SOCIALS = [
  { name: "facebook_url",   label: "Facebook",   icon: <FaFacebook  />, color: "#1877F2", placeholder: "https://facebook.com/yourpage" },
  { name: "instagram_url",  label: "Instagram",  icon: <FaInstagram />, color: "#E1306C", placeholder: "https://instagram.com/yourhandle" },
  { name: "tiktok_url",     label: "TikTok",     icon: <FaTiktok    />, color: "#010101", placeholder: "https://tiktok.com/@yourhandle" },
  { name: "youtube_url",    label: "YouTube",    icon: <FaYoutube   />, color: "#FF0000", placeholder: "https://youtube.com/yourchannel" },
  { name: "twitter_url",    label: "Twitter / X", icon: <FaTwitter  />, color: "#1DA1F2", placeholder: "https://twitter.com/yourhandle" },
  { name: "linkedin_url",   label: "LinkedIn",   icon: <FaLinkedin  />, color: "#0077B5", placeholder: "https://linkedin.com/in/yourprofile" },
  { name: "pinterest_url",  label: "Pinterest",  icon: <FaPinterest />, color: "#E60023", placeholder: "https://pinterest.com/yourprofile" },
  { name: "website_url",    label: "Website",    icon: <FaGlobe     />, color: "#27ae60", placeholder: "https://yourwebsite.com" },
  { name: "skype",          label: "Skype",      icon: <FaSkype     />, color: "#00AFF0", placeholder: "live:yourskypeid" },
  { name: "vimeo_url",      label: "Vimeo",      icon: <SiVimeo     />, color: "#1ab7ea", placeholder: "https://vimeo.com/yourchannel" },
];

const SocialMedia = ({ data }) => {
  const dispatch = useDispatch();
  const [loading, setLoading]   = useState(false);
  const [focused, setFocused]   = useState(null);
  const [form, setForm]         = useState({
    facebook_url: "", instagram_url: "", tiktok_url: "",
    youtube_url: "", twitter_url: "", linkedin_url: "",
    pinterest_url: "", website_url: "", skype: "", vimeo_url: "",
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      facebook_url:  data.facebook_url  || "",
      instagram_url: data.instagram_url || "",
      tiktok_url:    data.tiktok_url    || "",
      youtube_url:   data.youtube_url   || "",
      twitter_url:   data.twitter_url   || "",
      linkedin_url:  data.linkedin_url  || "",
      pinterest_url: data.pinterest_url || "",
      website_url:   data.website_url   || "",
      skype:         data.skype         || "",
      vimeo_url:     data.vimeo_url     || "",
    });
  }, [data]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v || ""));
      const res = await apiClient.post("update-profile", formData);
      if (res.status === 200) {
        dispatch(fetchUserInformation());
        toast.success("Social links updated successfully.");
      }
    } catch {
      toast.error("Failed to update social links.");
    } finally {
      setLoading(false);
    }
  };

  const filledCount = Object.values(form).filter(v => v && v.trim()).length;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 860 }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#2c3e50", margin: "0 0 4px" }}>
          Social Links
        </h2>
        <p style={{ fontSize: 13, color: "#7f8c8d", margin: 0 }}>
          {filledCount} of {SOCIALS.length} links added — these appear on your public agent profile
        </p>
      </div>

      {/* Social fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {SOCIALS.map(({ name, label, icon, color, placeholder }) => {
          const isFocused = focused === name;
          const hasValue  = !!form[name];
          return (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                border: `1.5px solid ${isFocused ? color : hasValue ? "#dde3ea" : "#eef0f3"}`,
                borderRadius: 10,
                overflow: "hidden",
                background: "#fff",
                transition: "border-color 0.2s",
              }}
            >
              {/* Icon block */}
              <div style={{
                width: 46, height: 46, flexShrink: 0,
                background: isFocused ? color : hasValue ? color : "#f5f7fa",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, color: isFocused || hasValue ? "#fff" : "#bbb",
                transition: "background 0.2s, color 0.2s",
              }}>
                {icon}
              </div>

              {/* Label */}
              <div style={{
                width: 110, flexShrink: 0,
                padding: "0 12px",
                fontSize: 12, fontWeight: 700,
                color: isFocused ? color : "#7f8c8d",
                borderRight: "1px solid #eef0f3",
                transition: "color 0.2s",
              }}>
                {label}
              </div>

              {/* Input */}
              <input
                type="url"
                name={name}
                value={form[name]}
                onChange={onChange}
                placeholder={placeholder}
                onFocus={() => setFocused(name)}
                onBlur={() => setFocused(null)}
                style={{
                  flex: 1,
                  height: 46,
                  padding: "0 14px",
                  border: "none",
                  outline: "none",
                  fontSize: 13,
                  color: "#2c3e50",
                  background: "transparent",
                  minWidth: 0,
                }}
              />

              {/* Clear button */}
              {hasValue && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, [name]: "" })}
                  style={{
                    width: 36, height: 46, flexShrink: 0,
                    background: "none", border: "none",
                    cursor: "pointer", color: "#bbb",
                    fontSize: 16, display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}
                  title="Clear"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "11px 28px",
            background: loading ? "#ccc" : "#e74c3c",
            color: "#fff", border: "none", borderRadius: 8,
            fontSize: 13, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {loading && <FaSpinner className="animate-spin" />}
          {loading ? "Saving..." : "Save Social Links"}
        </button>
      </div>
    </form>
  );
};

export default SocialMedia;