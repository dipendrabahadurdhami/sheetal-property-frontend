import React, { useState } from "react";
import apiClient from "../../utils/apiClient";
import {
  FaSpinner, FaCalendarAlt, FaClock,
  FaUser, FaPhone, FaEnvelope,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const initialFormData = { date: "", time: "", name: "", phone: "", email: "", note: "" };

const Field = ({ icon, label, error, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
    {label && (
      <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--d, #111827)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
    )}
    <div style={{ position: "relative" }}>
      {icon && (
        <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "12px", pointerEvents: "none" }}>
          {icon}
        </span>
      )}
      {children}
    </div>
    {error && <span style={{ fontSize: "11px", color: "#e53935", fontWeight: "600" }}>{error}</span>}
  </div>
);

const iStyle = (hasIcon = true, error = false) => ({
  width: "100%", padding: hasIcon ? "8px 10px 8px 30px" : "8px 10px",
  fontSize: "12px", border: `1px solid ${error ? "#e53935" : "#e5e7eb"}`,
  borderRadius: "8px", outline: "none", color: "#111827",
  background: "#fff", boxSizing: "border-box", transition: "border-color 0.15s", fontFamily: "inherit",
});

const ScheduleTour = ({ property, sidebar = false }) => {
  const [form, setForm]     = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const propertyId = property?.id || params?.id;

  const validate = () => {
    const e = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!form.date)  e.date  = "Required";
    if (!form.time)  e.time  = "Required";
    if (!form.name)  e.name  = "Enter your name";
    if (!form.phone) e.phone = "Enter phone";
    if (!form.email)             e.email = "Enter email";
    else if (!emailRe.test(form.email)) e.email = "Invalid email";
    if (!form.note)  e.note  = "Enter a note";
    setErrors(e);
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      const res = await apiClient.post("/schedule-tour", {
        date: form.date, time: form.time,
        name: form.name, email: form.email,
        phone: form.phone, note_description: form.note,
        property_id: propertyId,
      });
      if (res.status === 200) {
        toast.success("Tour scheduled successfully!");
        setForm(initialFormData);
        setErrors({});
      } else {
        toast.error("Failed to schedule. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const focusStyle = (e) => (e.target.style.borderColor = "#e53935");
  const blurStyle  = (e, field) => (e.target.style.borderColor = errors[field] ? "#e53935" : "#e5e7eb");

  return (
    <>
      <div>
        {/* Header */}
        <div style={{ padding: "13px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "4px", height: "18px", background: "#e53935", borderRadius: "2px", display: "inline-block" }} />
          <span style={{ fontWeight: "700", fontSize: "15px", color: "#111827" }}>Schedule a Tour</span>
        </div>

        <div style={{ padding: sidebar ? "16px" : "20px 24px 24px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <Field icon={<FaCalendarAlt />} label="Date" error={errors.date}>
                <input type="date" name="date" value={form.date} onChange={onChange}
                  style={iStyle(true, !!errors.date)} onFocus={focusStyle} onBlur={(e) => blurStyle(e, "date")} />
              </Field>
              <Field icon={<FaClock />} label="Time" error={errors.time}>
                <input type="time" name="time" value={form.time} onChange={onChange}
                  style={iStyle(true, !!errors.time)} onFocus={focusStyle} onBlur={(e) => blurStyle(e, "time")} />
              </Field>
            </div>

            <div style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Your Information
            </div>

            <Field icon={<FaUser />} error={errors.name}>
              <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={onChange}
                style={iStyle(true, !!errors.name)} onFocus={focusStyle} onBlur={(e) => blurStyle(e, "name")} />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <Field icon={<FaPhone />} error={errors.phone}>
                <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={onChange}
                  style={iStyle(true, !!errors.phone)} onFocus={focusStyle} onBlur={(e) => blurStyle(e, "phone")} />
              </Field>
              <Field icon={<FaEnvelope />} error={errors.email}>
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={onChange}
                  style={iStyle(true, !!errors.email)} onFocus={focusStyle} onBlur={(e) => blurStyle(e, "email")} />
              </Field>
            </div>

            <Field label="Note" error={errors.note}>
              <textarea name="note" rows={sidebar ? 3 : 4} placeholder="Anything you'd like us to know..."
                value={form.note} onChange={onChange}
                style={{ ...iStyle(false, !!errors.note), resize: "vertical", lineHeight: "1.6" }}
                onFocus={focusStyle} onBlur={(e) => blurStyle(e, "note")} />
            </Field>

            <button type="submit" disabled={loading}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                padding: "10px 0",
                background: "#e53935",
                color: "#fff", fontSize: "13px", fontWeight: "700",
                border: "none", borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.8 : 1, transition: "opacity 0.15s", marginTop: "4px",
              }}>
              {loading
                ? <><FaSpinner style={{ animation: "spin 0.8s linear infinite" }} /> Scheduling...</>
                : "Schedule Tour →"
              }
            </button>
          </form>
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
};

export default ScheduleTour;