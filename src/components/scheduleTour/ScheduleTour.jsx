import React, { useState, useEffect } from "react";
import apiClient from "../../utils/apiClient";
import {
  FaSpinner, FaCalendarAlt, FaClock,
  FaUser, FaPhone, FaEnvelope, FaLock,
  FaCheckCircle, FaClock as FaClockAlt,
  FaQrcode, FaTimes, FaUpload,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
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
  const user = useSelector((state) => state.user);
  const isLoggedIn = !!user?.data;

  const [form, setForm]           = useState(initialFormData);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [payStatus, setPayStatus] = useState(null); // null | not_paid | pending | confirmed
  const [checkingPay, setCheckingPay] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [feeSettings, setFeeSettings] = useState(null);
  const [refNumber, setRefNumber] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep]           = useState(1);

  const params = useParams();
  const propertyId = property?.id || params?.id;

  useEffect(() => {
    if (!isLoggedIn || !propertyId) return;
    checkPaymentStatus();
  }, [isLoggedIn, propertyId]);

  const checkPaymentStatus = async () => {
    setCheckingPay(true);
    try {
      const res = await apiClient.get(`contact-fee/check/${propertyId}`);
      setPayStatus(res.data.status);
    } catch { setPayStatus("not_paid"); }
    finally { setCheckingPay(false); }
  };

  const openPayModal = async () => {
    if (!isLoggedIn) { toast.error("Please login first."); return; }
    try {
      const res = await apiClient.get("contact-fee/settings-public");
      setFeeSettings(res.data);
    } catch {
      setFeeSettings({ fee_amount: 500, bank_name: "Nabil Bank", account_number: "...", account_name: "Sheetal Property Nepal" });
    }
    setShowPayModal(true);
    setStep(1);
  };

  const handleSubmitPayment = async () => {
    if (!refNumber.trim()) { toast.error("Please enter reference number."); return; }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("property_id", propertyId);
      formData.append("reference_number", refNumber.trim());
      if (proofFile) formData.append("payment_proof", proofFile);
      await apiClient.post("contact-fee/submit", formData);
      setPayStatus("pending");
      setShowPayModal(false);
      toast.success("Payment submitted! Admin will verify within 24 hours.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit payment.");
    } finally { setSubmitting(false); }
  };

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
    if (!isLoggedIn) { toast.error("Please login first."); return; }
    if (payStatus !== "confirmed") {
      toast.warning("Please unlock contact first to schedule a tour.");
      openPayModal();
      return;
    }
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

  // Render payment status banner
  const renderPayBanner = () => {
    if (!isLoggedIn) return (
      <div style={{ background: "#fef9e7", border: "1px solid #f39c12", borderRadius: 8, padding: "10px 12px", marginBottom: 12, fontSize: 12, color: "#d68910", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
        <FaLock style={{ fontSize: 10 }} /> Login required to schedule a tour
      </div>
    );

    if (checkingPay) return (
      <div style={{ textAlign: "center", padding: "10px 0", fontSize: 12, color: "#7f8c8d" }}>
        <FaSpinner className="animate-spin" style={{ display: "inline", marginRight: 6 }} /> Checking...
      </div>
    );

    if (payStatus === "confirmed") return (
      <div style={{ background: "#eafaf1", border: "1px solid #a9dfbf", borderRadius: 8, padding: "10px 12px", marginBottom: 12, fontSize: 12, color: "#1e8449", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
        <FaCheckCircle /> Contact unlocked — you can schedule a tour
      </div>
    );

    if (payStatus === "pending") return (
      <div style={{ background: "#fef9e7", border: "1px solid #f39c12", borderRadius: 8, padding: "10px 12px", marginBottom: 12, fontSize: 12, color: "#d68910", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
        <FaClockAlt /> Payment pending — schedule available after verification
      </div>
    );

    return (
      <div style={{ background: "#fef0f0", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 12px", marginBottom: 12, fontSize: 12, color: "#e74c3c", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
        <span><FaLock style={{ display: "inline", marginRight: 4 }} /> Pay Rs. {feeSettings?.fee_amount || 500} to schedule tour</span>
        <button onClick={openPayModal} style={{ background: "#e74c3c", color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
          Pay Now
        </button>
      </div>
    );
  };

  return (
    <>
      <div>
        {/* Header */}
        <div style={{ padding: "13px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "4px", height: "18px", background: "#e53935", borderRadius: "2px", display: "inline-block" }} />
          <span style={{ fontWeight: "700", fontSize: "15px", color: "#111827" }}>Schedule a Tour</span>
        </div>

        <div style={{ padding: sidebar ? "16px" : "20px 24px 24px" }}>
          {renderPayBanner()}

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

            <button type="submit" disabled={loading || payStatus !== "confirmed"}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                padding: "10px 0",
                background: payStatus !== "confirmed" ? "#9ca3af" : "#e53935",
                color: "#fff", fontSize: "13px", fontWeight: "700",
                border: "none", borderRadius: "8px",
                cursor: loading || payStatus !== "confirmed" ? "not-allowed" : "pointer",
                opacity: loading ? 0.8 : 1, transition: "opacity 0.15s", marginTop: "4px",
              }}>
              {loading
                ? <><FaSpinner style={{ animation: "spin 0.8s linear infinite" }} /> Scheduling...</>
                : payStatus !== "confirmed"
                  ? <><FaLock style={{ fontSize: 11 }} /> Unlock to Schedule</>
                  : "Schedule Tour →"
              }
            </button>
          </form>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setShowPayModal(false); }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 400, position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
            <button onClick={() => setShowPayModal(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: "#7f8c8d", fontSize: 18 }}>
              <FaTimes />
            </button>

            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ width: 56, height: 56, background: "#fef0f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <FaCalendarAlt style={{ fontSize: 22, color: "#e74c3c" }} />
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#2c3e50" }}>Unlock & Schedule Tour</h3>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#7f8c8d" }}>Pay once to contact owner and schedule tours</p>
            </div>

            <div style={{ background: "#f8f9fb", borderRadius: 10, padding: "12px 16px", textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#e74c3c" }}>Rs. {feeSettings?.fee_amount || 500}</div>
              <div style={{ fontSize: 12, color: "#7f8c8d" }}>One-time unlock fee</div>
            </div>

            {step === 1 && (
              <>
                <div style={{ background: "#f0f9ff", border: "1px solid #bde0fe", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 13, marginBottom: 10 }}>💳 Payment Details</div>
                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
                    <div><strong>Bank:</strong> {feeSettings?.bank_name || "Nabil Bank"}</div>
                    <div><strong>Account:</strong> {feeSettings?.account_number || "..."}</div>
                    <div><strong>Name:</strong> {feeSettings?.account_name || "Sheetal Property Nepal"}</div>
                    <div><strong>Amount:</strong> Rs. {feeSettings?.fee_amount || 500}</div>
                  </div>
                </div>
                <div style={{ border: "2px dashed #dde3ea", borderRadius: 10, padding: 20, textAlign: "center", marginBottom: 16 }}>
                  <FaQrcode style={{ fontSize: 48, color: "#bbb", marginBottom: 8 }} />
                  <div style={{ fontSize: 12, color: "#7f8c8d" }}>Dynamic QR coming soon.<br />Please use bank transfer above.</div>
                </div>
                <button onClick={() => setStep(2)} style={{ width: "100%", background: "#e74c3c", color: "#fff", border: "none", padding: "11px 0", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  I Have Paid — Submit Reference
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "#7f8c8d", fontSize: 13, cursor: "pointer", marginBottom: 14, padding: 0 }}>
                  ← Back
                </button>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#7f8c8d", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    Payment Reference Number *
                  </label>
                  <input type="text" placeholder="Enter bank transaction reference" value={refNumber}
                    onChange={e => setRefNumber(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none" }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#7f8c8d", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    Screenshot (optional)
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", border: "1px dashed #ddd", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#7f8c8d" }}>
                    <FaUpload />
                    {proofFile ? proofFile.name : "Upload screenshot"}
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => setProofFile(e.target.files[0])} />
                  </label>
                </div>
                <button onClick={handleSubmitPayment} disabled={submitting || !refNumber.trim()}
                  style={{ width: "100%", background: submitting || !refNumber.trim() ? "#aaa" : "#27ae60", color: "#fff", border: "none", padding: "11px 0", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: submitting || !refNumber.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {submitting ? <FaSpinner className="animate-spin" /> : "Submit Payment"}
                </button>
                <div style={{ fontSize: 12, color: "#7f8c8d", textAlign: "center", marginTop: 10 }}>Admin will verify within 24 hours</div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
};

export default ScheduleTour;