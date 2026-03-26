import { Field, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import LocationAutocomplete from "../components/Common/SearchBox/LocationAutocomplete";
import LoginModel from "../components/Login/LoginModel";
import headTag from "../headTag";
import {
  IoPersonOutline, IoLocationOutline, IoCallOutline,
  IoMailOutline, IoBriefcaseOutline, IoCashOutline,
  IoCarOutline, IoHomeOutline, IoDocumentTextOutline,
  IoCheckmarkCircle, IoCloseOutline, IoLockClosedOutline,
  IoQrCodeOutline, IoCheckmarkDoneOutline, IoAlertCircleOutline,
} from "react-icons/io5";

const API_BASE     = process.env.REACT_APP_API_URL  || "";
const API_LINK     = process.env.REACT_APP_API_LINK || "";
const PAYMENT_AMOUNT = 500; // match your .env / PaymentController const

function isLoggedIn() {
  return !!localStorage.getItem("sheetal_token");
}

// ── Yup schema ───────────────────────────────────────────────────────────────
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
  requirements: "", vehicle: "", facilities: [], description: "",
};

// ── Shared UI pieces ─────────────────────────────────────────────────────────
const FormField = ({ icon: Icon, label, required, error, touched, children }) => (
  <div className="flex flex-col space-y-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <div className={`flex items-center border rounded-xl overflow-hidden transition-all ${
      error && touched
        ? "border-red-400 ring-2 ring-red-100"
        : "border-gray-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100"
    }`}>
      {Icon && (
        <span className="w-10 flex items-center justify-center flex-shrink-0 self-stretch bg-gray-50 border-r border-gray-200">
          <Icon className="w-4 h-4 text-gray-400" />
        </span>
      )}
      {children}
    </div>
    {error && touched && <p className="text-red-500 text-xs font-medium">{error}</p>}
  </div>
);

const SectionCard = ({ title, required, children }) => (
  <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
    <div className="px-4 sm:px-5 py-3.5 bg-gray-50 border-b border-gray-100">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {title}{required && <span className="text-red-500 ml-0.5">*</span>}
      </p>
    </div>
    <div className="px-4 sm:px-5 py-4 sm:py-5">{children}</div>
  </div>
);

const inputCls  = "flex-1 px-3 py-2.5 text-sm text-gray-800 outline-none bg-transparent placeholder-gray-300";
const selectCls = "flex-1 px-3 py-2.5 text-sm text-gray-700 outline-none bg-transparent";

// ── Fonepay QR + Transaction ID Modal ────────────────────────────────────────
const PaymentModal = ({ onClose, onVerified }) => {
  const [txnId,    setTxnId]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [step,     setStep]     = useState("qr"); // "qr" | "verify" | "done"

  const handleVerify = async () => {
    const clean = txnId.trim();
    if (clean.length < 6) {
      setError("Please enter a valid transaction ID (min 6 characters)");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("sheetal_token");
      const res   = await axios.post(
        `${API_BASE}/api/payment/verify`,
        { transaction_id: clean },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.verified) {
        setStep("done");
        setTimeout(() => {
          onVerified(res.data.transaction_id);
          onClose();
        }, 1800);
      } else {
        setError(res.data.message || "Verification failed");
      }
    } catch (e) {
      setError(e.response?.data?.message || "Could not verify. Check your transaction ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50">
              <IoQrCodeOutline className="w-4 h-4 text-blue-600" />
            </span>
            <div>
              <p className="text-sm font-bold text-gray-900">Pay via Fonepay</p>
              <p className="text-xs text-gray-400">NPR {PAYMENT_AMOUNT.toLocaleString()}</p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
            <IoCloseOutline className="w-4 h-4" />
          </button>
        </div>

        {step === "done" ? (
          /* ── Success state ── */
          <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <IoCheckmarkDoneOutline className="w-7 h-7 text-green-600" />
            </div>
            <p className="text-sm font-bold text-gray-900">Payment verified!</p>
            <p className="text-xs text-gray-400">You can now submit your requirement.</p>
          </div>
        ) : (
          <>
            {/* ── Step indicator ── */}
            <div className="flex items-center gap-0 px-5 pt-4">
              {["Scan & Pay", "Enter ID", "Verified"].map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                      (step === "qr" && i === 0) || (step === "verify" && i === 1)
                        ? "bg-red-700 text-white"
                        : i < (step === "verify" ? 1 : 0)
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-400"
                    }`}>{i + 1}</div>
                    <span className="text-[9px] text-gray-400">{s}</span>
                  </div>
                  {i < 2 && <div className={`flex-1 h-px mb-4 mx-1 ${i === 0 && step === "verify" ? "bg-green-400" : "bg-gray-200"}`} />}
                </React.Fragment>
              ))}
            </div>

            {step === "qr" && (
              <div className="px-5 py-4 flex flex-col items-center gap-4">
                {/* QR image */}
                <div className="border-2 border-blue-100 rounded-xl p-2 bg-blue-50">
                  <img
                    src="/qr.png"
                    alt="Fonepay QR"
                    className="w-52 h-52 object-contain"
                    onError={e => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="w-52 h-52 hidden items-center justify-center flex-col gap-2">
                    <IoQrCodeOutline className="w-16 h-16 text-gray-300" />
                    <p className="text-xs text-gray-400">Place qr.png in /public</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Open any <span className="font-semibold text-blue-600">Nepali bank app</span> → Scan QR → Pay{" "}
                    <span className="font-bold text-gray-800">NPR {PAYMENT_AMOUNT.toLocaleString()}</span>
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Works with NIC Asia, Nabil, Everest, Laxmi, and all Fonepay-enabled banks
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("verify")}
                  className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-bold rounded-xl transition-colors"
                >
                  I've paid — enter transaction ID
                </button>
              </div>
            )}

            {step === "verify" && (
              <div className="px-5 py-4 flex flex-col gap-3">
                <p className="text-xs text-gray-500">
                  Find the transaction ID in your bank app's payment receipt and enter it below.
                </p>
                <input
                  type="text"
                  value={txnId}
                  onChange={e => { setTxnId(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleVerify()}
                  placeholder="e.g. FP2024031512345"
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all font-mono tracking-wide ${
                    error
                      ? "border-red-400 ring-2 ring-red-100"
                      : "border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  }`}
                  autoFocus
                />
                {error && (
                  <div className="flex items-center gap-1.5 text-red-600">
                    <IoAlertCircleOutline className="w-4 h-4 flex-shrink-0" />
                    <p className="text-xs">{error}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep("qr")}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={loading || txnId.trim().length < 6}
                    className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.2"/>
                          <path d="M21 12a9 9 0 00-9-9"/>
                        </svg>
                        Verifying…
                      </>
                    ) : "Verify Payment"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const RequirementForm = () => {
  const authToken = useSelector(state => state.auth?.token);
  const loggedIn  = !!authToken || isLoggedIn();

  const [properties,    setProperties]    = useState(null);
  const [submitting,    setSubmitting]    = useState(false);
  const [showSuccess,   setShowSuccess]   = useState(false);
  const [showPayment,   setShowPayment]   = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [verifiedTxnId,   setVerifiedTxnId]   = useState("");

  const submitLock   = useRef(false);
  const successTimer = useRef(null);

  useEffect(() => {
    axios.get(`${API_LINK}/property-attributes`)
      .then(res => { if (res.status === 200) setProperties(res.data.data); })
      .catch(e => console.error("Failed to load properties", e));

    headTag({ title: "Requirement Form", content: "Requirement form for your desired property" });
    return () => { if (successTimer.current) clearTimeout(successTimer.current); };
  }, []);

  const showSuccessMessage = () => {
    setShowSuccess(true);
    if (successTimer.current) clearTimeout(successTimer.current);
    successTimer.current = setTimeout(() => setShowSuccess(false), 6000);
  };

  const handlePaymentClick = () => {
    if (!loggedIn) { setShowLoginModal(true); return; }
    setShowPayment(true);
  };

  const handlePaymentVerified = (txnId) => {
    setPaymentVerified(true);
    setVerifiedTxnId(txnId);
    toast.success("Payment verified! You can now submit your form.");
  };

  const validateData = async (values, { setSubmitting: setFormikSubmitting, resetForm }) => {
    if (!loggedIn) { setShowLoginModal(true); setFormikSubmitting(false); return; }
    if (!paymentVerified) {
      toast.warning("Please complete payment verification first.");
      setShowPayment(true);
      setFormikSubmitting(false);
      return;
    }
    if (submitLock.current) return;
    submitLock.current = true;
    setSubmitting(true);

    try {
      const result = await axios.post(
        `${API_LINK}/requirement-form`,
        { ...values, payment_transaction_id: verifiedTxnId },
        { headers: { "Content-Type": "application/json" } }
      );
      if (result?.data) {
        resetForm({ values: initialValues });
        setPaymentVerified(false);
        setVerifiedTxnId("");
        showSuccessMessage();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
      setFormikSubmitting(false);
      submitLock.current = false;
    }
  };

  return (
    <div className="w-full mt-40 px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12 xl:px-16 xl:py-16 max-w-[1440px] mx-auto">

      {showPayment && (
        <PaymentModal
          onClose={() => setShowPayment(false)}
          onVerified={handlePaymentVerified}
        />
      )}

      <LoginModel r={showLoginModal} setR={setShowLoginModal} />

      <div className="w-full mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Requirement Form</h1>
          <p className="text-sm text-gray-400 mt-2">Fill in your details and we'll find the right property for you</p>
        </div>

        {/* Not logged in warning */}
        {!loggedIn && (
          <div className="flex items-center gap-3 px-4 py-3.5 mb-5 bg-amber-50 border border-amber-200 rounded-xl">
            <IoLockClosedOutline className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800 flex-1">
              You must be{" "}
              <button type="button" onClick={() => setShowLoginModal(true)}
                className="font-bold underline underline-offset-2 hover:text-red-700 transition-colors">
                logged in
              </button>{" "}
              to submit this form.
            </p>
          </div>
        )}

        {/* Payment status banner */}
        {loggedIn && !paymentVerified && (
          <div className="flex items-center gap-3 px-4 py-3.5 mb-5 bg-blue-50 border border-blue-200 rounded-xl">
            <IoQrCodeOutline className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-800 flex-1">
              Payment of{" "}
              <span className="font-bold">NPR {PAYMENT_AMOUNT.toLocaleString()}</span>{" "}
              required before submitting.{" "}
              <button type="button" onClick={() => setShowPayment(true)}
                className="font-bold underline underline-offset-2 hover:text-red-700 transition-colors">
                Pay now
              </button>
            </p>
          </div>
        )}

        {paymentVerified && (
          <div className="flex items-center gap-3 px-4 py-3.5 mb-5 bg-green-50 border border-green-200 rounded-xl">
            <IoCheckmarkDoneOutline className="w-4 h-4 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800 flex-1">
              Payment verified! Transaction ID:{" "}
              <span className="font-mono font-bold">{verifiedTxnId}</span>
            </p>
          </div>
        )}

        {showSuccess && (
          <div className="flex items-start gap-3 px-4 py-4 mb-5 bg-green-50 border border-green-200 rounded-xl">
            <IoCheckmarkCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-green-800">Requirement submitted successfully!</p>
              <p className="text-xs text-green-600 mt-0.5">Our agent will review your requirement and contact you shortly.</p>
            </div>
            <button type="button" onClick={() => setShowSuccess(false)}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-green-100 text-green-500 hover:text-green-700 transition-colors flex-shrink-0">
              <IoCloseOutline className="w-4 h-4" />
            </button>
          </div>
        )}

        <Formik initialValues={initialValues} validationSchema={requirementSchema} onSubmit={validateData}>
          {({ values, handleSubmit, handleChange, isSubmitting, errors, touched }) => (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

              <SectionCard title="Personal Information">
                <div className="space-y-4">
                  <FormField icon={IoPersonOutline} label="Full Name" required error={errors.name} touched={touched.name}>
                    <Field type="text" name="name" value={values.name} onChange={handleChange} placeholder="Enter your full name" className={inputCls} />
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField icon={IoMailOutline} label="Email Address" required error={errors.email} touched={touched.email}>
                      <Field type="email" name="email" value={values.email} onChange={handleChange} placeholder="your@email.com" className={inputCls} />
                    </FormField>
                    <FormField icon={IoCallOutline} label="Contact Number" required error={errors.contact_number} touched={touched.contact_number}>
                      <Field type="number" name="contact_number" value={values.contact_number} onChange={handleChange} placeholder="10-digit number" className={inputCls} />
                    </FormField>
                  </div>

                  <FormField icon={IoBriefcaseOutline} label="Occupation" required error={errors.occupation} touched={touched.occupation}>
                    <Field type="text" name="occupation" value={values.occupation} onChange={handleChange} placeholder="Your occupation" className={inputCls} />
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField icon={IoLocationOutline} label="Temporary Address" required error={errors.temporary_address} touched={touched.temporary_address}>
                      <Field type="text" name="temporary_address" value={values.temporary_address} onChange={handleChange} placeholder="Temporary address" className={inputCls} />
                    </FormField>
                    <FormField icon={IoLocationOutline} label="Permanent Address" required error={errors.permanent_address} touched={touched.permanent_address}>
                      <Field type="text" name="permanent_address" value={values.permanent_address} onChange={handleChange} placeholder="Permanent address" className={inputCls} />
                    </FormField>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Property Preferences">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Preferred Location</label>
                    <div className={`flex items-center border rounded-xl overflow-visible transition-all ${
                      errors.prefered_location && touched.prefered_location
                        ? "border-red-400 ring-2 ring-red-100"
                        : "border-gray-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100"
                    }`}>
                      <span className="w-10 flex items-center justify-center flex-shrink-0 self-stretch bg-gray-50 border-r border-gray-200 rounded-l-xl">
                        <IoLocationOutline className="w-4 h-4 text-gray-400" />
                      </span>
                      <LocationAutocomplete
                        value={values.prefered_location}
                        onChange={val => handleChange({ target: { name: "prefered_location", value: val } })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField icon={IoCashOutline} label="Minimum Budget" error={errors.minimum_budget} touched={touched.minimum_budget}>
                      <Field type="text" name="minimum_budget" value={values.minimum_budget} onChange={handleChange} placeholder="Min amount" className={inputCls} />
                    </FormField>
                    <FormField icon={IoCashOutline} label="Maximum Budget" error={errors.maximum_budget} touched={touched.maximum_budget}>
                      <Field type="text" name="maximum_budget" value={values.maximum_budget} onChange={handleChange} placeholder="Max amount" className={inputCls} />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField icon={IoHomeOutline} label="Tenant Option" required error={errors.tenant_option} touched={touched.tenant_option}>
                      <Field as="select" name="tenant_option" onChange={handleChange} className={selectCls}>
                        <option value="">Select</option>
                        {properties?.purposes?.map((p, i) => (
                          <option value={p.name} key={i}>{p.name}</option>
                        ))}
                      </Field>
                    </FormField>
                    <FormField icon={IoDocumentTextOutline} label="Requirements" error={errors.requirements} touched={touched.requirements}>
                      <Field as="select" name="requirements" onChange={handleChange} className={selectCls}>
                        <option value="">Select</option>
                        <option value="room">Room</option>
                        <option value="flat">Flat</option>
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="land">Land</option>
                      </Field>
                    </FormField>
                    <FormField icon={IoCarOutline} label="Vehicle" error={errors.vehicle} touched={touched.vehicle}>
                      <Field as="select" name="vehicle" onChange={handleChange} className={selectCls}>
                        <option value="">Select</option>
                        <option value="two">Two Wheelers</option>
                        <option value="three">Three Wheelers</option>
                        <option value="four">Four Wheelers</option>
                      </Field>
                    </FormField>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Required Facilities" required>
                <div role="group" className="flex flex-wrap gap-2">
                  {properties?.facilities?.map((facility, i) => (
                    <label key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all text-xs sm:text-sm font-medium select-none ${
                      values.facilities.includes(facility.name)
                        ? "bg-red-50 border-red-300 text-red-700"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}>
                      <Field type="checkbox" name="facilities" value={facility.name} className="accent-red-700 w-3.5 h-3.5 flex-shrink-0" />
                      {facility.name}
                    </label>
                  ))}
                </div>
                {errors.facilities && touched.facilities && (
                  <p className="text-red-500 text-xs font-medium mt-2">{errors.facilities}</p>
                )}
              </SectionCard>

              <SectionCard title="Description (optional)">
                <textarea rows={5} name="description" value={values.description} onChange={handleChange}
                  placeholder="Any additional requirements or notes..."
                  className="w-full text-sm text-gray-700 placeholder-gray-300 outline-none resize-none bg-transparent" />
              </SectionCard>

              {/* ── Payment + Submit row ── */}
              <div className="flex flex-col sm:flex-row items-stretch gap-3">

                {/* Fonepay button */}
                <button
                  type="button"
                  onClick={handlePaymentClick}
                  className={`flex items-center justify-center gap-2 px-5 py-3.5 text-white text-sm font-bold rounded-xl transition-all shadow-sm ${
                    paymentVerified
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {paymentVerified
                    ? <><IoCheckmarkDoneOutline className="w-4 h-4" /> Payment Verified</>
                    : <><IoQrCodeOutline className="w-4 h-4" /> Pay via Fonepay</>
                  }
                </button>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || submitting || !paymentVerified}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-red-700 hover:bg-red-800 active:scale-[0.99] text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isSubmitting || submitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25"/>
                        <path d="M21 12a9 9 0 00-9-9"/>
                      </svg>
                      Processing…
                    </>
                  ) : (
                    <>
                      {!loggedIn && <IoLockClosedOutline className="w-4 h-4" />}
                      {!paymentVerified && loggedIn && <IoQrCodeOutline className="w-4 h-4 opacity-50" />}
                      Submit Requirement
                    </>
                  )}
                </button>
              </div>

              {!paymentVerified && loggedIn && (
                <p className="text-xs text-gray-400 text-center">
                  Complete payment verification above to enable submission
                </p>
              )}

            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RequirementForm;