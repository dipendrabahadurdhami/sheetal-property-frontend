import { Field, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import apiClient from "../utils/apiClient";
import LocationAutocomplete from "../components/Common/SearchBox/LocationAutocomplete";
import LoginModel from "../components/Login/LoginModel";
import {
  IoPersonOutline, IoLocationOutline, IoCallOutline,
  IoMailOutline, IoBriefcaseOutline, IoCashOutline,
  IoCarOutline, IoHomeOutline, IoDocumentTextOutline,
  IoCheckmarkCircle, IoCloseOutline, IoLockClosedOutline,
  IoQrCodeOutline, IoAlertCircleOutline,
} from "react-icons/io5";
import { FaSpinner, FaUpload, FaTimes, FaLock, FaCheckCircle } from "react-icons/fa";

const API_LINK = process.env.REACT_APP_API_LINK || "";

const VEHICLE_TYPES = [
  { key: "bike", label: "Bike" },
  { key: "scooter", label: "Scooter" },
  { key: "car", label: "Car" },
  { key: "van", label: "Van" },
  { key: "truck", label: "Truck" },
];

function isLoggedIn() {
  return !!localStorage.getItem("sheetal_token");
}

const requirementSchema = Yup.object().shape({
  name:              Yup.string().min(3).required("Name is required"),
  email:             Yup.string().email("Invalid email").required("Email is required"),
  contact_number:    Yup.string().matches(/^[0-9]{10}$/, "Must be 10 digits").required("Required"),
  permanent_address: Yup.string().min(3).required("Permanent address required"),
  temporary_address: Yup.string().min(3).required("Temporary address required"),
  occupation:        Yup.string().min(3).required("Occupation required"),
  tenant_option:     Yup.string().required("Tenant option required"),
  facilities:        Yup.array().min(1, "Select at least one facility").required(),
});

const initialValues = {
  name: "", email: "", permanent_address: "", temporary_address: "",
  contact_number: "", occupation: "", prefered_location: "",
  minimum_budget: "", maximum_budget: "", tenant_option: "",
  requirements: "", vehicle: {}, facilities: [], description: "",
};

const RF = ({ icon: Icon, label, required, error, touched, children }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
    <label style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"#7f8c8d" }}>
      {label}{required && <span style={{ color:"#b91c1c", marginLeft:2 }}>*</span>}
    </label>
    <div style={{
      display:"flex", alignItems:"center",
      border: error && touched ? "1px solid #b91c1c" : "1px solid #e4e4e0",
      borderRadius:4, overflow:"hidden", background:"#fff",
      boxShadow: error && touched ? "0 0 0 3px rgba(185,28,28,0.08)" : "none",
      transition:"border-color .15s, box-shadow .15s",
    }}>
      {Icon && (
        <span style={{ width:40, display:"flex", alignItems:"center", justifyContent:"center", background:"#fafafa", borderRight:"1px solid #e4e4e0", alignSelf:"stretch", flexShrink:0 }}>
          <Icon style={{ fontSize:14, color:"#9ca3af" }} />
        </span>
      )}
      {children}
    </div>
    {error && touched && <p style={{ fontSize:11, color:"#b91c1c", fontWeight:600, margin:0 }}>{error}</p>}
  </div>
);

const SC = ({ title, required, step, children }) => (
  <div style={{ border:"1px solid #e4e4e0", borderRadius:4, overflow:"hidden", background:"#fff" }}>
    <div style={{ padding:"12px 18px", background:"#fafafa", borderBottom:"1px solid #e4e4e0", display:"flex", alignItems:"center", gap:10 }}>
      {step && (
        <div style={{ width:22, height:22, borderRadius:"50%", background:"#b91c1c", color:"#fff", fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          {step}
        </div>
      )}
      <span style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", color:"#374151" }}>
        {title}{required && <span style={{ color:"#b91c1c", marginLeft:2 }}>*</span>}
      </span>
    </div>
    <div style={{ padding:"18px" }}>{children}</div>
  </div>
);

const iS = { flex:1, padding:"10px 12px", fontSize:13, color:"#111", outline:"none", background:"transparent", border:"none" };
const sS = { flex:1, padding:"10px 12px", fontSize:13, color:"#374151", outline:"none", background:"transparent", border:"none" };

const VehicleCounter = ({ vehicles, onChange }) => {
  const update = (key, delta) => {
    const next = { ...vehicles, [key]: Math.max(0, (vehicles[key] || 0) + delta) };
    if (next[key] === 0) delete next[key];
    onChange(next);
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {VEHICLE_TYPES.map(({ key, label }) => (
        <div key={key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 0" }}>
          <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>{label}</span>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button type="button" onClick={() => update(key, -1)}
              style={{ width:26, height:26, borderRadius:4, border:"1px solid #e4e4e0", background:"#fff", cursor:"pointer", fontSize:14, fontWeight:700, color:"#374151", display:"flex", alignItems:"center", justifyContent:"center" }}>
              −
            </button>
            <span style={{ width:24, textAlign:"center", fontSize:13, fontWeight:700, color:"#111" }}>{vehicles[key] || 0}</span>
            <button type="button" onClick={() => update(key, 1)}
              style={{ width:26, height:26, borderRadius:4, border:"1px solid #e4e4e0", background:"#fff", cursor:"pointer", fontSize:14, fontWeight:700, color:"#374151", display:"flex", alignItems:"center", justifyContent:"center" }}>
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════
   PAYMENT POPUP
   - Shows QR
   - Collects proof
   - Sends EVERYTHING in one POST /api/requirement-form
═══════════════════════════════════════════ */
const PaymentPopupModal = ({ payment, pendingValues, agentId, onClose, onUploaded }) => {
  const [proofFile, setProofFile] = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [refInput,  setRefInput]  = useState("");
  const [uploading, setUploading] = useState(false);
  const [done,      setDone]      = useState(false);
  const [error,     setError]     = useState("");

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setProofFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async () => {
    if (!proofFile) { setError("Please attach a payment screenshot."); return; }
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();

      // Append all form fields
      Object.keys(pendingValues).forEach(key => {
        if (key === 'facilities') {
          pendingValues.facilities.forEach(f => fd.append('facilities[]', f));
        } else if (key === 'vehicle') {
          fd.append('vehicle', JSON.stringify(pendingValues.vehicle));
        } else if (key === 'minimum_budget' || key === 'maximum_budget') {
          if (pendingValues[key] !== "" && pendingValues[key] != null) {
            fd.append(key, pendingValues[key]);
          }
        } else {
          fd.append(key, pendingValues[key] ?? "");
        }
      });

      if (agentId) fd.append("agent_id", agentId);

      // Append proof + reference
      fd.append("payment_proof", proofFile);
      if (refInput) fd.append("payment_reference", refInput);

      const res = await axios.post(
        `${API_LINK}/requirement-form`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("sheetal_token")}`,
          },
        }
      );

      if (res.status === 200) {
        setDone(true);
        onUploaded && onUploaded(res.data?.data);
      } else {
        setError(res.data?.message || "Submission failed.");
      }
    } catch (e) {
      if (e.response?.status === 422) {
        const errs = e.response.data.errors || {};
        const first = Object.values(errs)[0];
        setError(Array.isArray(first) ? first[0] : first);
      } else {
        setError(e.response?.data?.message || "Submission failed.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:4, width:"100%", maxWidth:420, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }} onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid #e4e4e0", background:"#b91c1c" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <FaLock style={{ color:"#fff", fontSize:14 }} />
            <div>
              <p style={{ fontSize:13, fontWeight:800, color:"#fff", margin:0 }}>
                {done ? "Submitted ✓" : "Complete Payment"}
              </p>
              <p style={{ fontSize:11, color:"rgba(255,255,255,0.7)", margin:0 }}>
                {done ? "Admin will verify within 24 hours" : `Rs. ${payment?.fee_amount || 500} one-time fee`}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.2)", border:"none", width:28, height:28, borderRadius:4, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>
            <FaTimes style={{ fontSize:11 }} />
          </button>
        </div>

        {!done && (
          <div style={{ padding:20, display:"flex", flexDirection:"column", gap:14 }}>

            {/* QR */}
            {payment?.qr_code_url ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                <div style={{ padding:12, background:"#fff", border:"1px solid #e4e4e0", borderRadius:4 }}>
                  <img
                    src={payment.qr_code_url}
                    alt="Payment QR"
                    style={{ width:220, height:220, objectFit:"contain", display:"block" }}
                    onError={e=>{ e.currentTarget.style.display="none"; }}
                  />
                </div>
                <p style={{ fontSize:11, color:"#7f8c8d", margin:0, textAlign:"center" }}>
                  Scan with eSewa / Khalti / your banking app
                </p>
              </div>
            ) : (
              <div style={{ border:"2px dashed #e4e4e0", borderRadius:4, padding:20, textAlign:"center" }}>
                <IoQrCodeOutline style={{ fontSize:44, color:"#ddd", marginBottom:6 }} />
                <div style={{ fontSize:12, color:"#9ca3af" }}>
                  QR not uploaded yet.<br/>Use bank transfer details below.
                </div>
              </div>
            )}

            {/* Bank details */}
            <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:4, padding:14 }}>
              <div style={{ fontWeight:800, color:"#b91c1c", fontSize:11, marginBottom:8, textTransform:"uppercase", letterSpacing:".06em" }}>💳 Bank Details</div>
              {[
                ["Bank",    payment?.bank_name      || "—"],
                ["Account", payment?.account_number || "—"],
                ["Name",    payment?.account_name   || "—"],
                ["Amount",  `Rs. ${payment?.fee_amount || 0}`],
              ].map(([k,v]) => (
                <div key={k} style={{ display:"flex", gap:8, fontSize:12, color:"#374151", marginBottom:4 }}>
                  <span style={{ fontWeight:700, minWidth:60, color:"#111" }}>{k}</span>
                  <span style={{ fontFamily: k==="Account" ? "monospace" : "inherit", wordBreak:"break-all" }}>{v}</span>
                </div>
              ))}
            </div>

            {payment?.instructions && (
              <p style={{ fontSize:11, color:"#7f8c8d", lineHeight:1.6, margin:0 }}>ℹ️ {payment.instructions}</p>
            )}

            {/* Screenshot upload */}
            <div>
              <label style={{ fontSize:10, fontWeight:700, color:"#7f8c8d", textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:6 }}>
                Payment Screenshot *
              </label>
              <label style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", border:"1px dashed #e4e4e0", borderRadius:4, cursor:"pointer", fontSize:12, color:"#7f8c8d" }}>
                <FaUpload style={{ fontSize:11 }} />
                {proofFile ? proofFile.name : "Click to upload screenshot"}
                <input type="file" accept="image/*" style={{ display:"none" }} onChange={onPick} />
              </label>
              {preview && (
                <img src={preview} alt="preview" style={{ marginTop:8, maxHeight:120, borderRadius:4, border:"1px solid #e4e4e0" }} />
              )}
            </div>

            {/* Reference */}
            <div>
              <label style={{ fontSize:10, fontWeight:700, color:"#7f8c8d", textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:6 }}>
                Transaction ID <span style={{ fontWeight:400, color:"#9ca3af" }}>(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. TXN-1234567"
                value={refInput}
                onChange={e=>setRefInput(e.target.value)}
                style={{ width:"100%", border:"1px solid #e4e4e0", borderRadius:4, padding:"10px 12px", fontSize:12, outline:"none", fontFamily:"monospace", boxSizing:"border-box" }}
              />
            </div>

            {error && (
              <div style={{ display:"flex", alignItems:"center", gap:6, color:"#b91c1c" }}>
                <IoAlertCircleOutline style={{ fontSize:14, flexShrink:0 }} />
                <p style={{ fontSize:12, margin:0 }}>{error}</p>
              </div>
            )}

            <button
              onClick={onSubmit}
              disabled={uploading || !proofFile}
              style={{
                width:"100%", padding:"12px 0",
                background: uploading||!proofFile ? "#e5e7eb" : "#b91c1c",
                color:      uploading||!proofFile ? "#9ca3af" : "#fff",
                border:"none", borderRadius:4, fontSize:13, fontWeight:700,
                cursor:     uploading||!proofFile ? "not-allowed" : "pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:7,
              }}
            >
              {uploading
                ? <><FaSpinner style={{ animation:"spin .6s linear infinite" }} /> Submitting…</>
                : "Submit Requirement & Screenshot"}
            </button>

            <p style={{ fontSize:11, color:"#9ca3af", textAlign:"center", margin:0 }}>
              Admin will verify and match you with agents within 24 hours.
            </p>
          </div>
        )}

        {done && (
          <div style={{ padding:30, textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:"#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <FaCheckCircle style={{ fontSize:36, color:"#27ae60" }} />
            </div>
            <h4 style={{ fontSize:16, fontWeight:800, color:"#1e8449", margin:0 }}>Submitted!</h4>
            <p style={{ fontSize:13, color:"#374151", margin:0, lineHeight:1.6 }}>
              Our team will verify your payment and an agent will contact you within 24 hours.
            </p>
            <button onClick={onClose} style={{ marginTop:10, padding:"10px 24px", background:"#b91c1c", color:"#fff", border:"none", borderRadius:4, fontSize:13, fontWeight:700, cursor:"pointer" }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════
   MAIN
══════════════════════════════════ */
const RequirementForm = () => {
  const loggedIn = isLoggedIn();
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const agentId = searchParams.get("agent_id") || null;

  const [properties,     setProperties]     = useState(null);
  const [submitting,     setSubmitting]      = useState(false);
  const [showSuccess,    setShowSuccess]     = useState(false);
  const [showLoginModal, setShowLoginModal]  = useState(false);
  const [feeSettings,    setFeeSettings]     = useState(null);
  const [paymentPopup,   setPaymentPopup]    = useState(false);
  const [pendingValues,  setPendingValues]   = useState(null);
  const [pendingReset,   setPendingReset]    = useState(null);

  const submitLock   = useRef(false);
  const successTimer = useRef(null);

  useEffect(() => {
    axios.get(`${API_LINK}/property-attributes`)
      .then(res => { if (res.status === 200) setProperties(res.data.data); })
      .catch(() => {});
    apiClient.get("contact-fee/settings-public")
      .then(res => setFeeSettings(res.data))
      .catch(() => setFeeSettings({ fee_amount: 500, qr_code_url: null }));
    return () => { if (successTimer.current) clearTimeout(successTimer.current); };
  }, []);

  const showSuccessMessage = () => {
    setShowSuccess(true);
    if (successTimer.current) clearTimeout(successTimer.current);
    successTimer.current = setTimeout(() => setShowSuccess(false), 6000);
  };

  // Just validate + open popup — don't hit API yet
  const validateData = (values, { setSubmitting: setFormikSubmitting, resetForm }) => {
    if (!loggedIn) {
      setShowLoginModal(true);
      setFormikSubmitting(false);
      return;
    }
    if (submitLock.current) return;
    submitLock.current = true;

    setPendingValues(values);
    setPendingReset(() => resetForm);
    setPaymentPopup(true);

    submitLock.current = false;
    setFormikSubmitting(false);
  };

  const handlePaymentUploaded = () => {
    setPaymentPopup(false);
    setPendingValues(null);
    if (pendingReset) pendingReset({ values: initialValues });
    showSuccessMessage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>Property Requirement Form Nepal | Sheetal Property Nepal</title>
        <meta name="description" content="Submit your property requirement to Sheetal Property Nepal." />
        <link rel="canonical" href="https://sheetalproperty.com/requirementform" />
      </Helmet>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .rf-root { font-family: 'DM Sans', system-ui, sans-serif; }
        .rf-input:focus-within { border-color: #b91c1c !important; box-shadow: 0 0 0 3px rgba(185,28,28,0.08) !important; }
        .rf-check:checked { accent-color: #b91c1c; }
        .rf-select:focus { outline: none; }
        .rf-textarea:focus { outline: none; }
        @media(max-width:640px) { .rf-grid-2 { grid-template-columns: 1fr !important; } .rf-grid-3 { grid-template-columns: 1fr !important; } }
      `}</style>

      {paymentPopup && pendingValues && (
        <PaymentPopupModal
          payment={feeSettings}
          pendingValues={pendingValues}
          agentId={agentId}
          onClose={() => setPaymentPopup(false)}
          onUploaded={handlePaymentUploaded}
        />
      )}

      <LoginModel r={showLoginModal} setR={setShowLoginModal} />

      <div className="rf-root" style={{ background:"#f4f3f0", minHeight:"100vh", paddingTop:80 }}>

        <div style={{ background:"linear-gradient(135deg,#b91c1c,#7f1d1d)", padding:"40px 20px 32px" }}>
          <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center" }}>
            <span style={{ display:"inline-block", background:"rgba(255,255,255,0.15)", color:"#fff", fontSize:9, fontWeight:800, letterSpacing:".12em", textTransform:"uppercase", padding:"3px 10px", borderRadius:4, marginBottom:12 }}>
              Property Matching Service
            </span>
            <h1 style={{ fontSize:"clamp(22px,4vw,32px)", fontWeight:900, color:"#fff", margin:"0 0 10px", lineHeight:1.1 }}>
              Tell Us What You're Looking For
            </h1>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.7)", margin:0, lineHeight:1.7, maxWidth:480, marginLeft:"auto", marginRight:"auto" }}>
              Fill in your details and our team will find the perfect property matching your needs and budget.
            </p>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:20, flexWrap:"wrap" }}>
              {["Fill Form", "Pay Fee", "Agent Matches", "Move In"].map((s,i)=>(
                <React.Fragment key={s}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", background:"rgba(255,255,255,0.2)", color:"#fff", fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{i+1}</div>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.8)", fontWeight:600 }}>{s}</span>
                  </div>
                  {i<3 && <span style={{ color:"rgba(255,255,255,0.3)", fontSize:12 }}>→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth:720, margin:"0 auto", padding:"24px 16px 60px" }}>

          {!loggedIn && (
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", marginBottom:16, background:"#fef3c7", border:"1px solid #fde68a", borderRadius:4 }}>
              <IoLockClosedOutline style={{ fontSize:16, color:"#b45309", flexShrink:0 }} />
              <p style={{ fontSize:13, color:"#92400e", margin:0 }}>
                You must be{" "}
                <button type="button" onClick={()=>setShowLoginModal(true)} style={{ background:"none", border:"none", color:"#b91c1c", fontWeight:700, cursor:"pointer", textDecoration:"underline", padding:0, fontSize:13 }}>
                  logged in
                </button>{" "}
                to submit this form.
              </p>
            </div>
          )}

          {loggedIn && feeSettings?.is_active !== false && (
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", marginBottom:16, background:"#fef2f2", border:"1px solid #fecaca", borderRadius:4 }}>
              <FaLock style={{ fontSize:13, color:"#b91c1c", flexShrink:0 }} />
              <p style={{ fontSize:13, color:"#7f1d1d", margin:0 }}>
                After submitting, a fee of <strong>Rs. {feeSettings?.fee_amount || 500}</strong> is required.
                You'll see the QR / bank details in a popup.
              </p>
            </div>
          )}

          {showSuccess && (
            <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"16px", marginBottom:16, background:"#f0fdf4", border:"1px solid #a9dfbf", borderRadius:4 }}>
              <IoCheckmarkCircle style={{ fontSize:18, color:"#27ae60", flexShrink:0, marginTop:1 }} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:800, color:"#1e8449", margin:"0 0 2px" }}>Requirement submitted successfully!</p>
                <p style={{ fontSize:12, color:"#27ae60", margin:0 }}>Our agent will review and contact you shortly.</p>
              </div>
              <button onClick={()=>setShowSuccess(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"#27ae60", flexShrink:0 }}>
                <IoCloseOutline style={{ fontSize:16 }} />
              </button>
            </div>
          )}

          <Formik initialValues={initialValues} validationSchema={requirementSchema} onSubmit={validateData}>
            {({ values, handleSubmit, handleChange, isSubmitting, errors, touched }) => (
              <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>

                <SC title="Personal Information" step="1">
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <RF icon={IoPersonOutline} label="Full Name" required error={errors.name} touched={touched.name}>
                      <Field type="text" name="name" value={values.name} onChange={handleChange} placeholder="Enter your full name" style={iS} />
                    </RF>
                    <div className="rf-grid-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      <RF icon={IoMailOutline} label="Email Address" required error={errors.email} touched={touched.email}>
                        <Field type="email" name="email" value={values.email} onChange={handleChange} placeholder="your@email.com" style={iS} />
                      </RF>
                      <RF icon={IoCallOutline} label="Contact Number" required error={errors.contact_number} touched={touched.contact_number}>
                        <Field type="number" name="contact_number" value={values.contact_number} onChange={handleChange} placeholder="10-digit number" style={iS} />
                      </RF>
                    </div>
                    <RF icon={IoBriefcaseOutline} label="Occupation" required error={errors.occupation} touched={touched.occupation}>
                      <Field type="text" name="occupation" value={values.occupation} onChange={handleChange} placeholder="Your occupation" style={iS} />
                    </RF>
                    <div className="rf-grid-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      <RF icon={IoLocationOutline} label="Temporary Address" required error={errors.temporary_address} touched={touched.temporary_address}>
                        <Field type="text" name="temporary_address" value={values.temporary_address} onChange={handleChange} placeholder="Temporary address" style={iS} />
                      </RF>
                      <RF icon={IoLocationOutline} label="Permanent Address" required error={errors.permanent_address} touched={touched.permanent_address}>
                        <Field type="text" name="permanent_address" value={values.permanent_address} onChange={handleChange} placeholder="Permanent address" style={iS} />
                      </RF>
                    </div>
                  </div>
                </SC>

                <SC title="Property Preferences" step="2">
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      <label style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"#7f8c8d" }}>Preferred Location</label>
                      <div style={{ display:"flex", alignItems:"center", border:"1px solid #e4e4e0", borderRadius:4, overflow:"visible", background:"#fff" }}>
                        <span style={{ width:40, display:"flex", alignItems:"center", justifyContent:"center", background:"#fafafa", borderRight:"1px solid #e4e4e0", alignSelf:"stretch", flexShrink:0 }}>
                          <IoLocationOutline style={{ fontSize:14, color:"#9ca3af" }} />
                        </span>
                        <LocationAutocomplete
                          value={values.prefered_location}
                          onChange={val => handleChange({ target: { name: "prefered_location", value: val } })}
                        />
                      </div>
                    </div>
                    <div className="rf-grid-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      <RF icon={IoCashOutline} label="Minimum Budget">
                        <Field type="text" name="minimum_budget" value={values.minimum_budget} onChange={handleChange} placeholder="Min amount (Rs.)" style={iS} />
                      </RF>
                      <RF icon={IoCashOutline} label="Maximum Budget">
                        <Field type="text" name="maximum_budget" value={values.maximum_budget} onChange={handleChange} placeholder="Max amount (Rs.)" style={iS} />
                      </RF>
                    </div>
                    <div className="rf-grid-3" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                      <RF icon={IoHomeOutline} label="Tenant Option" required error={errors.tenant_option} touched={touched.tenant_option}>
                        <Field as="select" name="tenant_option" onChange={handleChange} className="rf-select" style={sS}>
                          <option value="">Select</option>
                          {properties?.purposes?.map((p, i) => <option value={p.name} key={i}>{p.name}</option>)}
                        </Field>
                      </RF>
                      <RF icon={IoDocumentTextOutline} label="Requirements">
                        <Field as="select" name="requirements" onChange={handleChange} className="rf-select" style={sS}>
                          <option value="">Select</option>
                          {properties?.property_types?.map((pt, i) => <option value={pt.name} key={i}>{pt.name}</option>)}
                        </Field>
                      </RF>
                      <RF icon={IoCarOutline} label="Vehicle" error={errors.vehicle} touched={touched.vehicle}>
                        <div style={{ padding:"10px 12px", flex:1 }}>
                          <VehicleCounter vehicles={values.vehicle} onChange={(v) => handleChange({ target: { name: "vehicle", value: v } })} />
                        </div>
                      </RF>
                    </div>
                  </div>
                </SC>

                <SC title="Required Facilities" step="3" required>
                  <div role="group" style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {properties?.facilities?.map((facility, i) => (
                      <label key={i} style={{
                        display:"flex", alignItems:"center", gap:7,
                        padding:"7px 12px", borderRadius:4, cursor:"pointer",
                        border: values.facilities.includes(facility.name) ? "1px solid #b91c1c" : "1px solid #e4e4e0",
                        background: values.facilities.includes(facility.name) ? "#fef2f2" : "#fff",
                        fontSize:12, fontWeight:600,
                        color: values.facilities.includes(facility.name) ? "#b91c1c" : "#374151",
                        transition:"all .15s",
                      }}>
                        <Field type="checkbox" name="facilities" value={facility.name} className="rf-check" style={{ accentColor:"#b91c1c", width:13, height:13 }} />
                        {facility.name}
                      </label>
                    ))}
                  </div>
                  {errors.facilities && touched.facilities && (
                    <p style={{ fontSize:11, color:"#b91c1c", fontWeight:600, margin:"8px 0 0" }}>{errors.facilities}</p>
                  )}
                </SC>

                <SC title="Additional Notes" step="4">
                  <textarea rows={4} name="description" value={values.description} onChange={handleChange}
                    className="rf-textarea"
                    placeholder="Any additional requirements or notes for our agents…"
                    style={{ width:"100%", fontSize:13, color:"#374151", background:"transparent", border:"none", resize:"none", fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}
                  />
                </SC>

                <button type="submit" disabled={isSubmitting || submitting}
                  style={{
                    display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                    padding:"14px 24px", border:"none", borderRadius:4,
                    fontSize:13, fontWeight:700, fontFamily:"inherit",
                    cursor: isSubmitting||submitting ? "not-allowed" : "pointer",
                    background: isSubmitting||submitting ? "#e5e7eb" : "#b91c1c",
                    color: isSubmitting||submitting ? "#9ca3af" : "#fff",
                  }}>
                  {isSubmitting || submitting
                    ? <><FaSpinner style={{ animation:"spin .6s linear infinite" }} /> Processing…</>
                    : <>{!loggedIn && <IoLockClosedOutline style={{ fontSize:13 }} />} Next: Pay & Submit</>
                  }
                </button>

                {loggedIn && (
                  <p style={{ fontSize:11, color:"#9ca3af", textAlign:"center", margin:0 }}>
                    You'll see the QR payment popup after clicking the button above.
                  </p>
                )}

              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default RequirementForm;