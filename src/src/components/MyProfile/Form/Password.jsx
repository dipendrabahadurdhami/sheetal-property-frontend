import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaLock, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import apiClient from "../../../utils/apiClient";

const inputStyle = {
  padding: "10px 14px",
  border: "1px solid #dde3ea",
  borderRadius: 6,
  fontSize: 14,
  color: "#2c3e50",
  outline: "none",
  background: "#f8f9fb",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.2s, background 0.2s",
};

const Password = () => {
  const [show, setShow]       = useState({ old: false, new: false, confirm: false });
  const [oldPassword, setOld] = useState("");
  const [password, setNew]    = useState("");
  const [confirmPassword, setCo] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!oldPassword)                    e.old     = "Enter your current password";
    if (!password)                       e.new     = "Enter a new password";
    else if (password.length < 6)        e.new     = "At least 6 characters required";
    if (!confirmPassword)                e.confirm = "Re-enter your new password";
    else if (password !== confirmPassword) e.confirm = "Passwords do not match";
    setErrors(e);
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      const res = await apiClient.post("change-password", {
        old_password: oldPassword,
        password,
        password_confirmation: confirmPassword,
      });
      if (res.status === 200) {
        toast.success("Password updated successfully.");
        setOld(""); setNew(""); setCo(""); setErrors({});
      } else {
        toast.error(res.data?.message || "Failed to update.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update.");
    } finally {
      setLoading(false);
    }
  };

  const PwField = ({ label, value, onChange, showKey, error }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#7f8c8d", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      <div style={{ position: "relative" }}>
        <input
          type={show[showKey] ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ ...inputStyle, paddingRight: 40 }}
          onFocus={e => { e.target.style.borderColor = "#e74c3c"; e.target.style.background = "#fff"; }}
          onBlur={e => { e.target.style.borderColor = "#dde3ea"; e.target.style.background = "#f8f9fb"; }}
        />
        <button type="button"
          onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 2 }}
        >
          {show[showKey] ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
        </button>
      </div>
      {error && <span style={{ fontSize: 11, color: "#e74c3c" }}>{error}</span>}
    </div>
  );

  return (
    <div style={{ background: "#fff", border: "1px solid #dde3ea", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ padding: "8px 12px", borderBottom: "1px solid #f0f3f7", background: "#fafbfc", display: "flex", alignItems: "center", gap: 8 }}>
        <FaLock style={{ color: "#e74c3c", fontSize: 13 }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#2c3e50", textTransform: "uppercase", letterSpacing: "0.05em" }}>Change Password</span>
      </div>
      <form onSubmit={handleSubmit} style={{ padding: "10px 10px 12px", display: "flex", flexDirection: "column", gap: 12, maxWidth: 480 }}>
        <PwField label="Current Password"  value={oldPassword}      onChange={setOld} showKey="old"     error={errors.old} />
        <PwField label="New Password"      value={password}         onChange={setNew} showKey="new"     error={errors.new} />
        <PwField label="Confirm Password"  value={confirmPassword}  onChange={setCo}  showKey="confirm" error={errors.confirm} />
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
          <button type="submit" disabled={loading} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 24px", background: loading ? "#ccc" : "#e74c3c",
            color: "#fff", border: "none", borderRadius: 6,
            fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading && <FaSpinner />}
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Password;