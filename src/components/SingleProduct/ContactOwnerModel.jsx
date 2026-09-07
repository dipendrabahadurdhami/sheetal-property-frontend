import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { FaSpinner, FaUserCircle } from "react-icons/fa";
import { IoPersonOutline, IoMailOutline, IoCallOutline, IoTimeOutline } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import ReasonMultiSelect from "../Common/ReasonMultiSelect";
import { PREFERRED_CONTACT_TIME_OPTIONS } from "../../utils/contactReasons";

const inputWrap =
  "flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all";
const iconBox =
  "w-10 flex items-center justify-center flex-shrink-0 self-stretch bg-gray-50 border-r border-gray-200";
const fieldInput =
  "flex-1 px-3 py-2.5 text-sm text-gray-800 outline-none bg-transparent placeholder-gray-300";
const fieldLabel = "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5";

const ContactOwnerModel = ({ data, open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    terms: false,
    reasons: [],
    reasonOther: "",
    preferredContactTime: "",
  });

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios
      .post(`${process.env.REACT_APP_API_LINK}/contact-owner`, {
        name: form.name,
        email: form.email,
        mobile_number: "+977" + form.phone,
        property_id: data?.id,
        terms_agrement: form.terms ? "yes" : "no",
        reasons: form.reasons,
        reason_other: form.reasonOther,
        preferred_contact_time: form.preferredContactTime,
      })
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          toast.success("Your details has been sent to the agent.");
          setForm({ name: "", email: "", phone: "", terms: false, reasons: [], reasonOther: "", preferredContactTime: "" });
          setOpen(false);
        } else {
          setLoading(false);
          toast.error("Something went wrong. Please try again later");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        toast.error("Something went wrong. Please try again later");
      });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      {/* ↓ z-[99999] ensures this always sits above navbar, UserHead, TabNav */}
      <Dialog
        as="div"
        className="fixed z-[99999] inset-0 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              {/* Header */}
              <div className="px-5 py-4 bg-red-50 border-b border-red-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaUserCircle className="text-gray-400 w-9 h-9 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-0.5">
                      Contact Property Owner
                    </p>
                    <h2 className="text-sm font-bold text-gray-900">{data?.posted_by}</h2>
                    {data?.posted_date && (
                      <p className="text-xs text-gray-500">Posted on: {data.posted_date}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="text-gray-400 hover:text-red-500 focus:outline-none flex-shrink-0"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Form */}
              <div className="px-5 py-5 bg-white max-h-[75vh] overflow-y-auto">
                <form className="space-y-4" onSubmit={onFormSubmit}>
                  <div>
                    <label className={fieldLabel}>
                      Full Name<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className={inputWrap}>
                      <span className={iconBox}>
                        <IoPersonOutline className="w-4 h-4 text-gray-400" />
                      </span>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        placeholder="Your full name"
                        required
                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                        className={fieldInput}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={fieldLabel}>
                      Phone Number<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className={inputWrap}>
                      <span className={`${iconBox} text-xs font-semibold text-gray-500`}>+977</span>
                      <IoCallOutline className="w-4 h-4 text-gray-400 ml-3" />
                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        placeholder="Your mobile number"
                        required
                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                        className={fieldInput}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={fieldLabel}>Email Address</label>
                    <div className={inputWrap}>
                      <span className={iconBox}>
                        <IoMailOutline className="w-4 h-4 text-gray-400" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        placeholder="your@email.com (optional)"
                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                        className={fieldInput}
                      />
                    </div>
                  </div>

                  <ReasonMultiSelect
                    compact
                    label="Reason for Contact"
                    value={form.reasons}
                    onChange={(reasons) => setForm({ ...form, reasons })}
                    otherValue={form.reasonOther}
                    onOtherChange={(reasonOther) => setForm({ ...form, reasonOther })}
                  />

                  <div>
                    <label className={fieldLabel}>Preferred Contact Time</label>
                    <div className={inputWrap}>
                      <span className={iconBox}>
                        <IoTimeOutline className="w-4 h-4 text-gray-400" />
                      </span>
                      <select
                        value={form.preferredContactTime}
                        onChange={(e) => setForm({ ...form, preferredContactTime: e.target.value })}
                        className={`${fieldInput} appearance-none`}
                      >
                        <option value="">No preference</option>
                        {PREFERRED_CONTACT_TIME_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-1">
                    <input
                      type="checkbox"
                      id="contactOwnerTerms"
                      checked={form.terms}
                      onChange={() => setForm({ ...form, terms: !form.terms })}
                      className="w-4 h-4 mt-0.5 accent-red-700 flex-shrink-0 cursor-pointer"
                    />
                    <label htmlFor="contactOwnerTerms" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                      I wish to be contacted by a Sheetal Property expert, and I agree to the{" "}
                      <span className="text-red-600 font-semibold">Terms and Policy</span>.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!form.terms || loading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-700 hover:bg-red-800 active:scale-[0.98] text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin w-4 h-4" />
                        Sending...
                      </>
                    ) : (
                      "Contact Owner"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ContactOwnerModel;
