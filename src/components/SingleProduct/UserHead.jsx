import React, { useState, useEffect } from "react";
import { BiUserCircle } from "react-icons/bi";
import { FaPhone, FaEnvelope, FaTag, FaLock, FaSpinner, FaCheckCircle, FaClock, FaQrcode, FaTimes, FaUpload } from "react-icons/fa";
import { useSelector } from "react-redux";
import apiClient from "../../utils/apiClient";
import { toast } from "react-toastify";

const FALLBACK_PHONE = "+9779801000434";

const UserHead = ({ setOpen, property }) => {
  const {
    image_of_property_owner,
    posted_by,
    posted_date,
    property_code,
    phone,
    id: propertyId,
  } = property || {};

  const contactPhone = phone || FALLBACK_PHONE;
  const user = useSelector((state) => state.user);
  const isLoggedIn = !!user?.data;

  const [payStatus, setPayStatus] = useState(null); // null | 'not_paid' | 'pending' | 'confirmed'
  const [checkingPay, setCheckingPay] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [feeSettings, setFeeSettings] = useState(null);
  const [refNumber, setRefNumber] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1=QR, 2=submit ref

  // Check payment status when property loads
  useEffect(() => {
    if (!isLoggedIn || !propertyId) return;
    checkPaymentStatus();
  }, [isLoggedIn, propertyId]);

  const checkPaymentStatus = async () => {
    setCheckingPay(true);
    try {
      const res = await apiClient.get(`contact-fee/check/${propertyId}`);
      setPayStatus(res.data.status);
    } catch (err) {
      setPayStatus("not_paid");
    } finally {
      setCheckingPay(false);
    }
  };

  const openPayModal = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to contact the owner.");
      return;
    }
    // If already confirmed — open contact modal directly
    if (payStatus === "confirmed") {
      setOpen(true);
      return;
    }
    // Load fee settings
    try {
      const res = await apiClient.get("contact-fee/settings-public");
      setFeeSettings(res.data);
    } catch {
      setFeeSettings({
        fee_amount: 500,
        bank_name: "Nabil Bank",
        account_number: "...",
        account_name: "Sheetal Property Nepal",
        payment_instructions: "Transfer the amount and enter the reference number.",
      });
    }
    setShowPayModal(true);
    setStep(1);
  };

  const handleSubmitPayment = async () => {
    if (!refNumber.trim()) {
      toast.error("Please enter the payment reference number.");
      return;
    }
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactClick = () => {
    if (!isLoggedIn) {
      toast.error("Please login to contact the owner.");
      return;
    }
    if (payStatus === "confirmed") {
      setOpen(true);
    } else {
      openPayModal();
    }
  };

  // Render contact button based on pay status
  const renderContactButton = () => {
    if (checkingPay) {
      return (
        <button disabled style={btnStyle("#aaa")}>
          <FaSpinner className="animate-spin" style={{ fontSize: 10 }} />
          Checking...
        </button>
      );
    }

    if (!isLoggedIn) {
      return (
        <button onClick={handleContactClick} style={btnStyle("#e74c3c")}>
          <FaLock style={{ fontSize: 10 }} />
          Contact Owner
        </button>
      );
    }

    if (payStatus === "confirmed") {
      return (
        <button onClick={() => setOpen(true)} style={btnStyle("#27ae60")}>
          <FaCheckCircle style={{ fontSize: 10 }} />
          Contact Owner
        </button>
      );
    }

    if (payStatus === "pending") {
      return (
        <button disabled style={btnStyle("#f39c12")}>
          <FaClock style={{ fontSize: 10 }} />
          Payment Pending
        </button>
      );
    }

    // not_paid or null
    return (
      <button onClick={openPayModal} style={btnStyle("#e74c3c")}>
        <FaLock style={{ fontSize: 10 }} />
        Unlock Contact
      </button>
    );
  };

  return (
    <>
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e8e8e8",
        position: "sticky",
        top: "65px",
        zIndex: 100,
        boxShadow: "0 1px 0 #e8e8e8, 0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div className="container mx-auto" style={{
          padding: "0 20px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}>
          {/* Left: Agent info */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            <div style={{
              width: "30px", height: "30px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "1.5px solid #e5e7eb",
              flexShrink: 0,
              background: "#f5f5f5",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {image_of_property_owner ? (
                <img src={image_of_property_owner} alt={posted_by}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <BiUserCircle style={{ fontSize: "17px", color: "#bbb" }} />
              )}
            </div>
            <div style={{ minWidth: 0, lineHeight: 1.3 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "5px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: "600" }}>
                  Listed by
                </span>
                <span
                style={{ fontSize: "13px", fontWeight: "700", color: "#111", cursor: "pointer", textDecoration: "underline" }}
                onClick={() => property?.user_id && window.location.assign(`/agent/${property.user_id}`)}
              >
                {posted_by || "Sheetal Real Estate"}
              </span>
              </div>
              {posted_date && <span style={{ fontSize: "11px", color: "#b0b0b0" }}>{posted_date}</span>}
            </div>
            {property_code && (
              <div className="hidden sm:flex" style={{
                alignItems: "center", gap: "4px",
                background: "#f5f5f5", border: "1px solid #e5e7eb",
                borderRadius: "4px", padding: "3px 9px",
                fontSize: "10px", fontWeight: "700", color: "#888",
              }}>
                <FaTag style={{ fontSize: "8px", color: "#e74c3c" }} />
                #{property_code}
              </div>
            )}
          </div>

          {/* Right: CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px", flexShrink: 0 }}>
            <a href={`tel:${contactPhone}`} className="hidden sm:flex" style={{
              alignItems: "center", gap: "6px",
              padding: "0 13px", height: "32px",
              background: "#f5f5f5", border: "1px solid #e5e7eb",
              borderRadius: "4px", fontSize: "12px", fontWeight: "600",
              color: "#374151", textDecoration: "none", whiteSpace: "nowrap",
            }}>
              <FaPhone style={{ fontSize: "10px", color: "#e74c3c" }} />
              Call Agent
            </a>
            {renderContactButton()}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16,
        }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowPayModal(false); }}
        >
          <div style={{
            background: "#fff", borderRadius: 16, padding: 28,
            width: "100%", maxWidth: 420, position: "relative",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            {/* Close */}
            <button onClick={() => setShowPayModal(false)} style={{
              position: "absolute", top: 14, right: 14,
              background: "none", border: "none", cursor: "pointer",
              color: "#7f8c8d", fontSize: 18,
            }}>
              <FaTimes />
            </button>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{
                width: 56, height: 56, background: "#fef0f0",
                borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", margin: "0 auto 12px",
              }}>
                <FaLock style={{ fontSize: 22, color: "#e74c3c" }} />
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#2c3e50" }}>
                Unlock Contact Info
              </h3>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#7f8c8d" }}>
                Pay once to contact the owner of this property
              </p>
            </div>

            {/* Fee amount */}
            <div style={{
              background: "#f8f9fb", borderRadius: 10, padding: "12px 16px",
              textAlign: "center", marginBottom: 20,
            }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#e74c3c" }}>
                Rs. {feeSettings?.fee_amount || 500}
              </div>
              <div style={{ fontSize: 12, color: "#7f8c8d" }}>One-time contact unlock fee</div>
            </div>

            {step === 1 && (
              <>
                {/* Bank details */}
                <div style={{ background: "#f0f9ff", border: "1px solid #bde0fe", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 13, marginBottom: 10 }}>
                    💳 Payment Details
                  </div>
                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
                    <div><strong>Bank:</strong> {feeSettings?.bank_name || "Nabil Bank"}</div>
                    <div><strong>Account:</strong> {feeSettings?.account_number || "..."}</div>
                    <div><strong>Name:</strong> {feeSettings?.account_name || "Sheetal Property Nepal"}</div>
                    <div><strong>Amount:</strong> Rs. {feeSettings?.fee_amount || 500}</div>
                  </div>
                </div>

                {/* QR placeholder — replace with actual QR when bank API available */}
                <div style={{
                  border: "2px dashed #dde3ea", borderRadius: 10,
                  padding: 20, textAlign: "center", marginBottom: 16,
                }}>
                  <FaQrcode style={{ fontSize: 48, color: "#bbb", marginBottom: 8 }} />
                  <div style={{ fontSize: 12, color: "#7f8c8d" }}>
                    Dynamic QR coming soon.<br />Please use bank transfer above.
                  </div>
                </div>

                {feeSettings?.payment_instructions && (
                  <div style={{ fontSize: 12, color: "#7f8c8d", marginBottom: 16, lineHeight: 1.6 }}>
                    ℹ️ {feeSettings.payment_instructions}
                  </div>
                )}

                <button
                  onClick={() => setStep(2)}
                  style={btnStyle("#e74c3c", "100%")}
                >
                  I Have Paid — Submit Reference
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <button onClick={() => setStep(1)} style={{
                  background: "none", border: "none", color: "#7f8c8d",
                  fontSize: 13, cursor: "pointer", marginBottom: 14, padding: 0,
                }}>
                  ← Back to payment details
                </button>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#7f8c8d", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    Payment Reference Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your bank transaction reference"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 12px",
                      border: "1px solid #ddd", borderRadius: 8,
                      fontSize: 14, outline: "none",
                    }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#7f8c8d", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    Payment Screenshot (optional)
                  </label>
                  <label style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 12px", border: "1px dashed #ddd",
                    borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#7f8c8d",
                  }}>
                    <FaUpload />
                    {proofFile ? proofFile.name : "Upload screenshot"}
                    <input
                      type="file" accept="image/*" style={{ display: "none" }}
                      onChange={(e) => setProofFile(e.target.files[0])}
                    />
                  </label>
                </div>

                <button
                  onClick={handleSubmitPayment}
                  disabled={submitting || !refNumber.trim()}
                  style={btnStyle(submitting || !refNumber.trim() ? "#aaa" : "#27ae60", "100%")}
                >
                  {submitting ? <FaSpinner className="animate-spin" /> : "Submit Payment"}
                </button>

                <div style={{ fontSize: 12, color: "#7f8c8d", textAlign: "center", marginTop: 10 }}>
                  Admin will verify your payment within 24 hours
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const btnStyle = (bg, width = "auto") => ({
  display: "flex", alignItems: "center", gap: "6px",
  padding: "0 15px", height: "32px",
  background: bg, color: "#fff", border: "none",
  borderRadius: "4px", fontSize: "12px", fontWeight: "700",
  cursor: bg === "#aaa" ? "not-allowed" : "pointer",
  whiteSpace: "nowrap", width,
  justifyContent: "center",
});

export default UserHead;