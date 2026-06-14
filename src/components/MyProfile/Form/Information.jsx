import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInformation } from "../../../features/slices/userInformation";
import apiClient from "../../../utils/apiClient";
import { toast } from "react-toastify";
import { FaSpinner, FaUser, FaBuilding, FaPhone, FaMapMarkerAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Field = ({ label, children, error }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <span style={{ fontSize: 11, fontWeight: 700, color: "#7f8c8d", textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {label}
    </span>
    {children}
    {error && <span style={{ fontSize: 11, color: "#e74c3c" }}>{error}</span>}
  </label>
);

const inputStyle = {
  padding: "10px 14px",
  border: "1px solid #dde3ea",
  borderRadius: 8,
  fontSize: 14,
  color: "#2c3e50",
  outline: "none",
  background: "#f8f9fb",
  transition: "border-color 0.2s, background 0.2s",
  width: "100%",
  boxSizing: "border-box",
};

const sectionStyle = {
  background: "#fff",
  border: "1px solid #dde3ea",
  borderRadius: 12,
  overflow: "hidden",
  marginBottom: 20,
};

const sectionHeader = (icon, title, color) => (
  <div style={{ padding: "12px 18px", borderBottom: "1px solid #f0f3f7", background: "#fafbfc", display: "flex", alignItems: "center", gap: 8 }}>
    <span style={{ color, fontSize: 14 }}>{icon}</span>
    <span style={{ fontSize: 13, fontWeight: 700, color: "#2c3e50", textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</span>
  </div>
);

const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, padding: 18 };

const Information = ({ data }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isAgent = user?.data?.is_agent;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "", last_name: "", gender: "", dob: "",
    occupation: "", description: "",
    phone: "", mobile: "", city: "", state: "", country: "",
    address_1: "", address_2: "", post_code: "",
    company_name: "", designation: "", company_address: "",
    company_phone: "", company_mobile: "", company_website: "",
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      first_name:      data.first_name      || "",
      last_name:       data.last_name       || "",
      gender:          data.gender          || "",
      dob:             data.dob             || "",
      occupation:      data.occupation      || "",
      description:     data.description     || "",
      phone:           data.phone           || "",
      mobile:          data.mobile          || "",
      city:            data.city            || "",
      state:           data.state           || "",
      country:         data.country         || "",
      address_1:       data.address_1       || "",
      address_2:       data.address_2       || "",
      post_code:       data.post_code       || "",
      company_name:    data.company_name    || "",
      designation:     data.designation     || "",
      company_address: data.company_address || "",
      company_phone:   data.company_phone   || "",
      company_mobile:  data.company_mobile  || "",
      company_website: data.company_website || "",
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
        toast.success("Profile updated successfully.");
      }
    } catch (err) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp = (name, placeholder, type = "text", extra = {}) => (
    <input
      type={type}
      name={name}
      value={form[name]}
      onChange={onChange}
      placeholder={placeholder}
      style={inputStyle}
      onFocus={e => { e.target.style.borderColor = "#e74c3c"; e.target.style.background = "#fff"; }}
      onBlur={e => { e.target.style.borderColor = "#dde3ea"; e.target.style.background = "#f8f9fb"; }}
      {...extra}
    />
  );

  const emailVerified = !!data?.email_verified_at;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 860 }}>

      {/* Email verification banner */}
      {!emailVerified && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#fef9e7", border: "1px solid #f39c12", borderRadius: 10, marginBottom: 20, fontSize: 13 }}>
          <FaExclamationCircle style={{ color: "#f39c12", flexShrink: 0 }} />
          <span style={{ color: "#7f6003" }}>Your email is not verified. Check your inbox to verify your account and get the verified badge.</span>
        </div>
      )}

      {emailVerified && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#eafaf1", border: "1px solid #a9dfbf", borderRadius: 10, marginBottom: 20, fontSize: 13 }}>
          <FaCheckCircle style={{ color: "#27ae60", flexShrink: 0 }} />
          <span style={{ color: "#1e8449" }}>Email verified — your verified badge is active on your public profile.</span>
        </div>
      )}

      {/* Account (read-only) */}
      <div style={sectionStyle}>
        {sectionHeader(<FaUser />, "Account", "#3c8dbc")}
        <div style={grid}>
          <Field label="Username">
            <input style={{ ...inputStyle, cursor: "not-allowed", opacity: 0.7 }} value={data?.user_name || ""} disabled />
          </Field>
          <Field label="Email">
            <div style={{ position: "relative" }}>
              <input style={{ ...inputStyle, cursor: "not-allowed", opacity: 0.7, paddingRight: 36 }} value={data?.email || ""} disabled />
              {emailVerified && (
                <FaCheckCircle style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#27ae60", fontSize: 14 }} />
              )}
            </div>
          </Field>
        </div>
      </div>

      {/* Personal Info */}
      <div style={sectionStyle}>
        {sectionHeader(<FaUser />, "Personal Information", "#8e44ad")}
        <div style={grid}>
          <Field label="First Name">{inp("first_name", "First name")}</Field>
          <Field label="Last Name">{inp("last_name", "Last name")}</Field>
          <Field label="Gender">
            <select name="gender" value={form.gender} onChange={onChange} style={inputStyle}
              onFocus={e => { e.target.style.borderColor = "#e74c3c"; e.target.style.background = "#fff"; }}
              onBlur={e => { e.target.style.borderColor = "#dde3ea"; e.target.style.background = "#f8f9fb"; }}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Date of Birth">{inp("dob", "", "date")}</Field>
          <Field label="Occupation">{inp("occupation", "Your occupation")}</Field>
          <Field label="Bio / About" style={{ gridColumn: "1 / -1" }}>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Tell clients about yourself..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical", gridColumn: "1 / -1" }}
              onFocus={e => { e.target.style.borderColor = "#e74c3c"; e.target.style.background = "#fff"; }}
              onBlur={e => { e.target.style.borderColor = "#dde3ea"; e.target.style.background = "#f8f9fb"; }}
            />
          </Field>
        </div>
      </div>

      {/* Contact */}
      <div style={sectionStyle}>
        {sectionHeader(<FaPhone />, "Contact Information", "#27ae60")}
        <div style={grid}>
          <Field label="Phone">{inp("phone", "+977 XXXXXXXXXX", "tel")}</Field>
          <Field label="Mobile / WhatsApp">{inp("mobile", "+977 XXXXXXXXXX", "tel")}</Field>
          <Field label="City">{inp("city", "Kathmandu")}</Field>
          <Field label="State / Province">{inp("state", "Bagmati")}</Field>
          <Field label="Country">{inp("country", "Nepal")}</Field>
          <Field label="Post Code">{inp("post_code", "44600")}</Field>
          <Field label="Address Line 1">{inp("address_1", "Street address")}</Field>
          <Field label="Address Line 2">{inp("address_2", "Apartment, suite, etc.")}</Field>
        </div>
      </div>

      {/* Company — agents only */}
      {isAgent && (
        <div style={sectionStyle}>
          {sectionHeader(<FaBuilding />, "Company / Agency", "#e67e22")}
          <div style={grid}>
            <Field label="Company Name">{inp("company_name", "Sheetal Property Agency")}</Field>
            <Field label="Designation">{inp("designation", "Senior Real Estate Agent")}</Field>
            <Field label="Company Phone">{inp("company_phone", "+977 XXXXXXXXXX", "tel")}</Field>
            <Field label="Company Mobile">{inp("company_mobile", "+977 XXXXXXXXXX", "tel")}</Field>
            <Field label="Company Website">{inp("company_website", "https://yourcompany.com", "url")}</Field>
            <Field label="Company Address">{inp("company_address", "Office address")}</Field>
          </div>
        </div>
      )}

      {/* Submit */}
      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8 }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "11px 28px", background: loading ? "#ccc" : "#e74c3c",
            color: "#fff", border: "none", borderRadius: 8,
            fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {loading ? <FaSpinner className="animate-spin" /> : null}
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default Information;