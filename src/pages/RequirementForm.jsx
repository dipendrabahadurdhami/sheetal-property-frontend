import { Field, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import apiClient from "../utils/apiClient";
import LoginModel from "../components/Login/LoginModel";
import {
  IoPersonOutline, IoLocationOutline, IoCallOutline,
  IoMailOutline, IoBriefcaseOutline, IoCashOutline,
  IoCarOutline, IoHomeOutline, IoDocumentTextOutline,
  IoCheckmarkCircle, IoCloseOutline, IoLockClosedOutline,
  IoQrCodeOutline, IoAlertCircleOutline,
} from "react-icons/io5";
import {
  FaSpinner, FaUpload, FaTimes, FaLock, FaCheckCircle,
  FaEnvelope, FaPhone, FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaLinkedin,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

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

// Core fields are always required. Everything else is only required when
// visible — either always (normal company form) or per the agent's own
// Form Builder config (agent-branded form).
const buildRequirementSchema = (fieldsConfig) => {
  const isOn = (key) => !fieldsConfig || fieldsConfig[key] !== false;

  return Yup.object().shape({
    name:              Yup.string().min(3).required("Name is required"),
    email:             Yup.string().email("Invalid email").required("Email is required"),
    contact_number:    Yup.string().matches(/^[0-9]{10}$/, "Must be 10 digits").required("Required"),
    permanent_address: Yup.string().min(3).required("Permanent address required"),
    temporary_address: Yup.string().min(3).required("Temporary address required"),
    occupation:        isOn('occupation') ? Yup.string().min(3).required("Occupation required") : Yup.string().notRequired(),
    tenant_option:     isOn('tenant_option') ? Yup.string().required("Tenant option required") : Yup.string().notRequired(),
    facilities:        isOn('facilities') ? Yup.array().min(1, "Select at least one facility").required() : Yup.array().notRequired(),
  });
};

const initialValues = {
  name: "", email: "", permanent_address: "", temporary_address: "",
  contact_number: "", occupation: "", prefered_location: "",
  minimum_budget: "", maximum_budget: "", tenant_option: "",
  requirements: "", vehicle: {}, facilities: [], description: "",
};

const RF = ({ icon: Icon, label, required, error, touched, children }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
    <label style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"#7f8c8d" }}>
      {label}{required && <span style={{ color:"var(--rf-accent, #b91c1c)", marginLeft:2 }}>*</span>}
    </label>
    <div style={{
      display:"flex", alignItems:"center",
      border: error && touched ? "1px solid var(--rf-accent, #b91c1c)" : "1px solid #e4e4e0",
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
    {error && touched && <p style={{ fontSize:11, color:"var(--rf-accent, #b91c1c)", fontWeight:600, margin:0 }}>{error}</p>}
  </div>
);

const SC = ({ title, required, step, children }) => (
  <div style={{ border:"1px solid #e4e4e0", borderRadius:4, overflow:"hidden", background:"#fff" }}>
    <div style={{ padding:"12px 18px", background:"#fafafa", borderBottom:"1px solid #e4e4e0", display:"flex", alignItems:"center", gap:10 }}>
      {step && (
        <div style={{ width:22, height:22, borderRadius:"50%", background:"var(--rf-accent, #b91c1c)", color:"#fff", fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          {step}
        </div>
      )}
      <span style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", color:"#374151" }}>
        {title}{required && <span style={{ color:"var(--rf-accent, #b91c1c)", marginLeft:2 }}>*</span>}
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
    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
      {VEHICLE_TYPES.map(({ key, label }) => (
        <div key={key} style={{
          display:"flex", alignItems:"center", gap:8,
          border:"1px solid #e4e4e0", borderRadius:4,
          padding:"6px 8px 6px 12px",
          background: vehicles[key] > 0 ? "#fef2f2" : "#fafafa",
          borderColor: vehicles[key] > 0 ? "#fecaca" : "#e4e4e0",
        }}>
          <span style={{ fontSize:12, fontWeight:600, color:"#374151", whiteSpace:"nowrap" }}>{label}</span>
          <button type="button" onClick={() => update(key, -1)}
            style={{ width:22, height:22, borderRadius:4, border:"1px solid #e4e4e0", background:"#fff", cursor:"pointer", fontSize:13, fontWeight:700, color:"#374151", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            −
          </button>
          <span style={{ width:16, textAlign:"center", fontSize:12, fontWeight:700, color:"#111" }}>{vehicles[key] || 0}</span>
          <button type="button" onClick={() => update(key, 1)}
            style={{ width:22, height:22, borderRadius:4, border:"1px solid #e4e4e0", background:"#fff", cursor:"pointer", fontSize:13, fontWeight:700, color:"#374151", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            +
          </button>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════
   PAYMENT POPUP
   - Shows QR
   - Collects proof
   - Sends EVERYTHING in one POST /api/requirement-form (or agent-requirement-form)
═══════════════════════════════════════════ */
const PaymentPopupModal = ({ payment, pendingValues, agentId, themeColor, onClose, onUploaded }) => {
  const [proofFile, setProofFile] = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [refInput,  setRefInput]  = useState("");
  const [uploading, setUploading] = useState(false);
  const [done,      setDone]      = useState(false);
  const [error,     setError]     = useState("");

  const accent = themeColor || "#b91c1c";

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

      fd.append("payment_proof", proofFile);
      if (refInput) fd.append("payment_reference", refInput);

      const endpoint = agentId ? "agent-requirement-form" : "requirement-form";
      const headers = agentId
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("sheetal_token")}` };

      const res = await axios.post(`${API_LINK}/${endpoint}`, fd, { headers });

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

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid #e4e4e0", background:accent }}>
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

            <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:4, padding:14 }}>
              <div style={{ fontWeight:800, color:accent, fontSize:11, marginBottom:8, textTransform:"uppercase", letterSpacing:".06em" }}>💳 Bank Details</div>
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
              <div style={{ display:"flex", alignItems:"center", gap:6, color:accent }}>
                <IoAlertCircleOutline style={{ fontSize:14, flexShrink:0 }} />
                <p style={{ fontSize:12, margin:0 }}>{error}</p>
              </div>
            )}

            <button
              onClick={onSubmit}
              disabled={uploading || !proofFile}
              style={{
                width:"100%", padding:"12px 0",
                background: uploading||!proofFile ? "#e5e7eb" : accent,
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
            <button onClick={onClose} style={{ marginTop:10, padding:"10px 24px", background:accent, color:"#fff", border:"none", borderRadius:4, fontSize:13, fontWeight:700, cursor:"pointer" }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════
   AGENT IDENTITY BLOCK (shared content used by sidebar/minimal/card headers)
══════════════════════════════════ */
const AgentSocials = ({ agentInfo, size = 30, gap = 8 }) => {
  const socials = [
    { href: agentInfo?.facebook_url,  icon: <FaFacebook />,  bg:"#1877F2" },
    { href: agentInfo?.instagram_url, icon: <FaInstagram />, bg:"#E1306C" },
    { href: agentInfo?.tiktok_url,    icon: <SiTiktok />,    bg:"#010101" },
    { href: agentInfo?.youtube_url,   icon: <FaYoutube />,   bg:"#FF0000" },
    { href: agentInfo?.twitter_url,   icon: <FaTwitter />,   bg:"#1DA1F2" },
    { href: agentInfo?.linkedin_url,  icon: <FaLinkedin />,  bg:"#0077B5" },
  ].filter(s => s.href);
  if (!socials.length) return null;
  return (
    <div style={{ display:"flex", gap, flexWrap:"wrap", justifyContent:"center" }}>
      {socials.map((s, i) => (
        <a key={i} href={s.href} target="_blank" rel="noreferrer" style={{
          width:size, height:size, borderRadius:"50%", background:s.bg, color:"#fff",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.43, textDecoration:"none",
        }}>
          {s.icon}
        </a>
      ))}
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

  // Agent-branded mode: no login, agent's own name/logo/theme instead of
  // company header — triggered whenever ?agent_id= is present.
  const [agentInfo, setAgentInfo] = useState(null);

  const fieldsConfig = agentId ? agentInfo?.form_fields_config : null;
  const isFieldOn = (key) => !fieldsConfig || fieldsConfig[key] !== false;
  const requirementSchema = buildRequirementSchema(fieldsConfig);

  const template = agentId ? (agentInfo?.form_template || 'classic') : 'classic';
  const themeColor = agentId ? (agentInfo?.form_theme_color || '#b91c1c') : '#b91c1c';
  const isSidebarLayout = template === 'modern' || template === 'modern_right';
  const isMinimal = template === 'minimal';
  const isCard = template === 'card';
  const isClassic = template === 'classic';

  const agentName = (agentInfo?.first_name || agentInfo?.last_name)
    ? `${agentInfo.first_name || ""} ${agentInfo.last_name || ""}`.trim()
    : (agentInfo?.user_name || "Your Agent");

  useEffect(() => {
    axios.get(`${API_LINK}/property-attributes`)
      .then(res => { if (res.status === 200) setProperties(res.data.data); })
      .catch(() => {});

    if (agentId) {
      apiClient.get(`agent-detail/${agentId}`)
        .then(res => setAgentInfo(res.data?.data || res.data || null))
        .catch(() => setAgentInfo(null));
    } else {
      apiClient.get("requirement-fee/settings-public")
        .then(res => setFeeSettings(res.data))
        .catch(() => setFeeSettings({ fee_amount: 500, qr_code_url: null }));
    }

    return () => { if (successTimer.current) clearTimeout(successTimer.current); };
  }, []);

  const showSuccessMessage = () => {
    setShowSuccess(true);
    if (successTimer.current) clearTimeout(successTimer.current);
    successTimer.current = setTimeout(() => setShowSuccess(false), 6000);
  };

  // Both flows go through the same payment popup — agent mode just skips
  // the login check, since payment is required either way (to the
  // company's account normally, or to the agent's own QR/bank for agent mode).
  const validateData = (values, { setSubmitting: setFormikSubmitting, resetForm }) => {
    if (!agentId && !loggedIn) {
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
        <link rel="canonical" href="https://sheetalproperty.com/requirementForm?agent_id=1" />
      </Helmet>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .rf-root { font-family: 'DM Sans', system-ui, sans-serif; --rf-accent: ${themeColor}; }
        .rf-input:focus-within { border-color: var(--rf-accent) !important; box-shadow: 0 0 0 3px rgba(0,0,0,0.06) !important; }
        .rf-check:checked { accent-color: var(--rf-accent); }
        .rf-select:focus { outline: none; }
        .rf-textarea:focus { outline: none; }
        @media(max-width:640px) { .rf-grid-2 { grid-template-columns: 1fr !important; } .rf-grid-3 { grid-template-columns: 1fr !important; } }
        @media(max-width:900px) {
          .rf-modern-shell { flex-direction: column !important; }
          .rf-modern-sidebar { width:100% !important; min-width:0 !important; min-height:auto !important; position:static !important; padding:32px 20px !important; }
        }
      `}</style>

      {paymentPopup && pendingValues && (
        <PaymentPopupModal
          payment={agentId ? {
            qr_code_url: agentInfo?.payment_qr_url,
            bank_name: agentInfo?.payment_bank_name,
            account_number: agentInfo?.payment_account_number,
            account_name: agentInfo?.payment_account_name,
            fee_amount: agentInfo?.payment_amount,
            instructions: agentInfo?.payment_instructions,
          } : feeSettings}
          pendingValues={pendingValues}
          agentId={agentId}
          themeColor={themeColor}
          onClose={() => setPaymentPopup(false)}
          onUploaded={handlePaymentUploaded}
        />
      )}

      {!agentId && <LoginModel r={showLoginModal} setR={setShowLoginModal} />}

      <div
        className={`rf-root${isSidebarLayout ? " rf-modern-shell" : ""}`}
        style={{
          background:"#f4f3f0", minHeight:"100vh",
          paddingTop: agentId ? 0 : 80,
          display: isSidebarLayout ? "flex" : "block",
          flexDirection: template === 'modern_right' ? "row-reverse" : "row",
        }}
      >

        {/* ═══ SIDEBAR (Modern / Modern Right) ═══ */}
        {isSidebarLayout && (
          <div className="rf-modern-sidebar" style={{
            width:300, minWidth:300, background:"linear-gradient(180deg,#111827,#1f2937)",
            padding:"48px 28px", color:"#fff", display:"flex", flexDirection:"column",
            alignItems:"center", textAlign:"center", justifyContent:"center", position:"sticky", top:0,
            alignSelf:"flex-start", minHeight:"100vh", gap:6,
            boxShadow: template === 'modern_right' ? `-4px 0 0 ${themeColor}` : `4px 0 0 ${themeColor}`,
          }}>
            {(agentInfo?.form_logo || agentInfo?.photo) && (
              <img src={agentInfo.form_logo || agentInfo.photo} alt={agentName}
                style={{ width:72, height:72, borderRadius:"50%", objectFit:"cover", border:`3px solid ${themeColor}`, marginBottom:16 }} />
            )}
            <h2 style={{ fontSize:19, fontWeight:800, margin:"0 0 6px", color:"#fff" }}>{agentName}</h2>
            {agentInfo?.tier && (
              <span style={{ fontSize:9, fontWeight:700, background:themeColor, color:"#fff", padding:"3px 10px", borderRadius:12, textTransform:"uppercase", letterSpacing:".06em" }}>
                {agentInfo.tier}
              </span>
            )}
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.65)", marginTop:22, lineHeight:1.7, maxWidth:220 }}>
              {agentInfo?.form_heading || "Tell me what you're looking for and I'll find the perfect match for you."}
            </p>

            {(agentInfo?.phone || agentInfo?.email) && (
              <div style={{ marginTop:26, paddingTop:22, borderTop:"1px solid rgba(255,255,255,0.1)", width:"100%", display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
                {agentInfo?.phone && (
                  <a href={`tel:${agentInfo.phone}`} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:"rgba(255,255,255,0.75)", textDecoration:"none" }}>
                    <FaPhone style={{ fontSize:11 }} /> {agentInfo.phone}
                  </a>
                )}
                {agentInfo?.email && (
                  <a href={`mailto:${agentInfo.email}`} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:"rgba(255,255,255,0.75)", textDecoration:"none" }}>
                    <FaEnvelope style={{ fontSize:11 }} /> {agentInfo.email}
                  </a>
                )}
              </div>
            )}

            <div style={{ marginTop:20 }}>
              <AgentSocials agentInfo={agentInfo} />
            </div>
          </div>
        )}

        {/* ═══ RIGHT/MAIN COLUMN ═══ */}
        <div style={{ flex: isSidebarLayout ? 1 : undefined, minWidth:0 }}>

          {/* ── Classic banner ── */}
          {isClassic && (
            <div style={{ background:`linear-gradient(135deg,${themeColor},#00000055)`, padding:"40px 20px 32px" }}>
              <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center" }}>
                {agentId ? (
                  <>
                    {(agentInfo?.form_logo) && (
                      <img src={agentInfo.form_logo} alt={agentName}
                        style={{ width:64, height:64, borderRadius:"50%", objectFit:"cover", border:"2px solid rgba(255,255,255,0.5)", marginBottom:14 }} />
                    )}
                    <h1 style={{ fontSize:"clamp(20px,4vw,28px)", fontWeight:900, color:"#fff", margin:"0 0 8px", lineHeight:1.1 }}>
                      {agentInfo?.form_heading || `Requirement Form — ${agentName}`}
                    </h1>
                    <p style={{ fontSize:13, color:"rgba(255,255,255,0.7)", margin:0, lineHeight:1.7, maxWidth:480, marginLeft:"auto", marginRight:"auto" }}>
                      Fill in your details and {agentInfo?.first_name || "your agent"} will find the perfect property matching your needs and budget. No account needed — just a quick payment to confirm your request.
                    </p>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── Minimal top bar ── */}
          {isMinimal && (
            <div>
              <div style={{ height:8, background:themeColor }} />
              <div style={{ maxWidth:720, margin:"0 auto", padding:"28px 20px 20px", display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
                {(agentInfo?.form_logo || agentInfo?.photo) && (
                  <img src={agentInfo.form_logo || agentInfo.photo} alt={agentName}
                    style={{ width:48, height:48, borderRadius:"50%", objectFit:"cover", border:`2px solid ${themeColor}` }} />
                )}
                <div style={{ flex:1, minWidth:200 }}>
                  <h1 style={{ fontSize:19, fontWeight:800, color:"#201f1e", margin:0 }}>
                    {agentInfo?.form_heading || `Requirement Form — ${agentName}`}
                  </h1>
                  <p style={{ fontSize:12, color:"#7f8c8d", margin:"2px 0 0" }}>
                    No account needed — just a quick payment to confirm your request.
                  </p>
                </div>
                <AgentSocials agentInfo={agentInfo} size={24} gap={6} />
              </div>
            </div>
          )}

          {/* ── Card: decorative banner + floating profile card ── */}
          {isCard && (
            <>
              <div style={{ background:`linear-gradient(135deg,${themeColor},#00000055)`, height:130 }} />
              <div style={{ maxWidth:720, margin:"-52px auto 0", padding:"0 20px", position:"relative", zIndex:2 }}>
                <div style={{ background:"#fff", borderRadius:12, boxShadow:"0 8px 30px rgba(0,0,0,0.12)", padding:"20px 24px", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                  {(agentInfo?.form_logo || agentInfo?.photo) ? (
                    <img src={agentInfo.form_logo || agentInfo.photo} alt={agentName}
                      style={{ width:56, height:56, borderRadius:"50%", objectFit:"cover", border:`3px solid ${themeColor}`, flexShrink:0 }} />
                  ) : (
                    <div style={{ width:56, height:56, borderRadius:"50%", background:themeColor, flexShrink:0 }} />
                  )}
                  <div style={{ flex:1, minWidth:180 }}>
                    <h2 style={{ fontSize:16, fontWeight:800, color:"#201f1e", margin:0 }}>{agentName}</h2>
                    {agentInfo?.tier && (
                      <span style={{ fontSize:9, fontWeight:700, background:themeColor, color:"#fff", padding:"2px 8px", borderRadius:10, textTransform:"uppercase" }}>{agentInfo.tier}</span>
                    )}
                  </div>
                  <AgentSocials agentInfo={agentInfo} size={26} gap={6} />
                </div>
                <p style={{ fontSize:13, color:"#6b7280", textAlign:"center", margin:"16px 0 0", lineHeight:1.6 }}>
                  {agentInfo?.form_heading || "Fill in your details below and I'll find the perfect property matching your needs and budget."}
                </p>
              </div>
            </>
          )}

          {/* ═══ FORM CONTENT (shared by every template) ═══ */}
          <div className="rf-modern-content" style={{
            maxWidth: isSidebarLayout ? 640 : 720,
            margin: isSidebarLayout ? "0" : "0 auto",
            padding: isSidebarLayout ? "40px 24px 60px" : "24px 16px 60px",
            minWidth: 0,
          }}>

            {!agentId && !loggedIn && (
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", marginBottom:16, background:"#fef3c7", border:"1px solid #fde68a", borderRadius:4 }}>
                <IoLockClosedOutline style={{ fontSize:16, color:"#b45309", flexShrink:0 }} />
                <p style={{ fontSize:13, color:"#92400e", margin:0 }}>
                  You must be{" "}
                  <button type="button" onClick={()=>setShowLoginModal(true)} style={{ background:"none", border:"none", color:themeColor, fontWeight:700, cursor:"pointer", textDecoration:"underline", padding:0, fontSize:13 }}>
                    logged in
                  </button>{" "}
                  to submit this form.
                </p>
              </div>
            )}

            {!agentId && loggedIn && feeSettings?.is_active !== false && (
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", marginBottom:16, background:"#fef2f2", border:"1px solid #fecaca", borderRadius:4 }}>
                <FaLock style={{ fontSize:13, color:themeColor, flexShrink:0 }} />
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

            <Formik enableReinitialize initialValues={initialValues} validationSchema={requirementSchema} onSubmit={validateData}>
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
                      {isFieldOn('occupation') && (
                      <RF icon={IoBriefcaseOutline} label="Occupation" required={!agentId} error={errors.occupation} touched={touched.occupation}>
                        <Field type="text" name="occupation" value={values.occupation} onChange={handleChange} placeholder="Your occupation" style={iS} />
                      </RF>
                      )}
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
                      {isFieldOn('prefered_location') && (
                      <RF icon={IoLocationOutline} label="Preferred Location">
                        <Field type="text" name="prefered_location" value={values.prefered_location} onChange={handleChange} placeholder="e.g. Kathmandu, Lalitpur" style={iS} />
                      </RF>
                      )}
                      {isFieldOn('budget_range') && (
                      <div className="rf-grid-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                        <RF icon={IoCashOutline} label="Minimum Budget">
                          <Field type="text" name="minimum_budget" value={values.minimum_budget} onChange={handleChange} placeholder="Min amount (Rs.)" style={iS} />
                        </RF>
                        <RF icon={IoCashOutline} label="Maximum Budget">
                          <Field type="text" name="maximum_budget" value={values.maximum_budget} onChange={handleChange} placeholder="Max amount (Rs.)" style={iS} />
                        </RF>
                      </div>
                      )}
                      <div className="rf-grid-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                        {isFieldOn('tenant_option') && (
                        <RF icon={IoHomeOutline} label="Tenant Option" required={!agentId} error={errors.tenant_option} touched={touched.tenant_option}>
                          <Field as="select" name="tenant_option" onChange={handleChange} className="rf-select" style={sS}>
                            <option value="">Select</option>
                            {properties?.purposes?.map((p, i) => <option value={p.name} key={i}>{p.name}</option>)}
                          </Field>
                        </RF>
                        )}
                        <RF icon={IoDocumentTextOutline} label="Requirements">
                          <Field as="select" name="requirements" onChange={handleChange} className="rf-select" style={sS}>
                            <option value="">Select</option>
                            {properties?.property_types?.map((pt, i) => <option value={pt.name} key={i}>{pt.name}</option>)}
                          </Field>
                        </RF>
                      </div>

                      {isFieldOn('vehicle') && (
                      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                        <label style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"#7f8c8d" }}>
                          Vehicle
                        </label>
                        <div style={{ border:"1px solid #e4e4e0", borderRadius:4, background:"#fff", padding:"10px 12px" }}>
                          <VehicleCounter vehicles={values.vehicle} onChange={(v) => handleChange({ target: { name: "vehicle", value: v } })} />
                        </div>
                      </div>
                      )}
                    </div>
                  </SC>

                  {isFieldOn('facilities') && (
                  <SC title="Required Facilities" step="3" required={!agentId}>
                    <div role="group" style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                      {properties?.facilities?.map((facility, i) => (
                        <label key={i} style={{
                          display:"flex", alignItems:"center", gap:7,
                          padding:"7px 12px", borderRadius:4, cursor:"pointer",
                          border: values.facilities.includes(facility.name) ? `1px solid ${themeColor}` : "1px solid #e4e4e0",
                          background: values.facilities.includes(facility.name) ? "#fef2f2" : "#fff",
                          fontSize:12, fontWeight:600,
                          color: values.facilities.includes(facility.name) ? themeColor : "#374151",
                          transition:"all .15s",
                        }}>
                          <Field type="checkbox" name="facilities" value={facility.name} className="rf-check" style={{ accentColor:themeColor, width:13, height:13 }} />
                          {facility.name}
                        </label>
                      ))}
                    </div>
                    {errors.facilities && touched.facilities && (
                      <p style={{ fontSize:11, color:themeColor, fontWeight:600, margin:"8px 0 0" }}>{errors.facilities}</p>
                    )}
                  </SC>
                  )}

                  {isFieldOn('description') && (
                  <SC title="Additional Notes" step="4">
                    <textarea rows={4} name="description" value={values.description} onChange={handleChange}
                      className="rf-textarea"
                      placeholder="Any additional requirements or notes for our agents…"
                      style={{ width:"100%", fontSize:13, color:"#374151", background:"transparent", border:"none", resize:"none", fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}
                    />
                  </SC>
                  )}

                  <button type="submit" disabled={isSubmitting || submitting}
                    style={{
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      padding:"14px 24px", border:"none", borderRadius:4,
                      fontSize:13, fontWeight:700, fontFamily:"inherit",
                      cursor: isSubmitting||submitting ? "not-allowed" : "pointer",
                      background: isSubmitting||submitting ? "#e5e7eb" : themeColor,
                      color: isSubmitting||submitting ? "#9ca3af" : "#fff",
                    }}>
                    {isSubmitting || submitting
                      ? <><FaSpinner style={{ animation:"spin .6s linear infinite" }} /> Processing…</>
                      : <>Next: Pay & Submit</>
                    }
                  </button>

                  <p style={{ fontSize:11, color:"#9ca3af", textAlign:"center", margin:0 }}>
                    You'll see the QR payment popup after clicking the button above.
                  </p>

                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequirementForm;