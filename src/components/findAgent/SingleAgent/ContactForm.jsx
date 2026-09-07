import axios from "axios";
import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoChatbubbleOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReasonMultiSelect from "../../Common/ReasonMultiSelect";
import { PREFERRED_CONTACT_TIME_OPTIONS } from "../../../utils/contactReasons";

const ContactForm = ({ data }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", message: "", terms: false,
    reasons: [], reasonOther: "", preferredContactTime: "",
  });

  const onInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const message = "Phone Number:" + form.phone + " Message:" + form.message;
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_LINK}/contact-agent`,
        {
          agent_id:      id,
          name:          form.name,
          email:         form.email,
          phone:         form.phone,
          contact_form:  message,
          terms_agrement: form.terms ? "yes" : "no",
          reasons: form.reasons,
          reason_other: form.reasonOther,
          preferred_contact_time: form.preferredContactTime,
        }
      );
      if (res.status === 200) {
        toast.success("Your details has been sent to the agent.");
        setForm({ name: "", email: "", phone: "", message: "", terms: false, reasons: [], reasonOther: "", preferredContactTime: "" });
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const agentName =
    data && data.first_name
      ? data.first_name + (data.last_name ? " " + data.last_name : "")
      : "this agent";

  const fields = [
    {
      icon: IoPersonOutline,
      label: "Full Name",
      name: "name",
      type: "text",
      placeholder: "Your full name",
      required: true,
    },
    {
      icon: IoMailOutline,
      label: "Email Address",
      name: "email",
      type: "email",
      placeholder: "your@email.com (optional)",
      required: false,
    },
    {
      icon: IoCallOutline,
      label: "Phone Number",
      name: "phone",
      type: "number",
      placeholder: "Your phone number",
      required: true,
    },
  ];

  return (
    <div className="w-full mt-40 border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 bg-red-50 border-b border-red-100">
        <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-0.5">
          Get in Touch
        </p>
        <h2 className="text-base font-bold text-gray-900">
          Contact {agentName}
        </h2>
      </div>

      {/* Form */}
      <div className="px-5 py-5 bg-white">
        <form onSubmit={onFormSubmit} className="space-y-4">

          {/* Text inputs */}
          {fields.map(function(field){
            var Icon = field.icon;
            return (
              <div key={field.name}>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all">
                  <span className="w-10 flex items-center justify-center flex-shrink-0 self-stretch bg-gray-50 border-r border-gray-200">
                    <Icon className="w-4 h-4 text-gray-400" />
                  </span>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    placeholder={field.placeholder}
                    required={field.required}
                    onChange={onInputChange}
                    className="flex-1 px-3 py-2.5 text-sm text-gray-800 outline-none bg-transparent placeholder-gray-300"
                  />
                </div>
              </div>
            );
          })}

          {/* Reason for contact */}
          <ReasonMultiSelect
            compact
            label="Reason for Contact"
            value={form.reasons}
            onChange={(reasons) => setForm({ ...form, reasons })}
            otherValue={form.reasonOther}
            onOtherChange={(reasonOther) => setForm({ ...form, reasonOther })}
          />

          {/* Preferred contact time */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Preferred Contact Time
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all">
              <span className="w-10 flex items-center justify-center flex-shrink-0 self-stretch bg-gray-50 border-r border-gray-200">
                <IoTimeOutline className="w-4 h-4 text-gray-400" />
              </span>
              <select
                value={form.preferredContactTime}
                onChange={(e) => setForm({ ...form, preferredContactTime: e.target.value })}
                className="flex-1 px-3 py-2.5 text-sm text-gray-800 outline-none bg-transparent"
              >
                <option value="">No preference</option>
                {PREFERRED_CONTACT_TIME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Message
            </label>
            <div className="flex border border-gray-200 rounded-xl overflow-hidden focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all">
              <span className="w-10 flex items-start justify-center flex-shrink-0 pt-2.5 bg-gray-50 border-r border-gray-200">
                <IoChatbubbleOutline className="w-4 h-4 text-gray-400" />
              </span>
              <textarea
                name="message"
                value={form.message}
                onChange={onInputChange}
                placeholder="Write your message here..."
                className="flex-1 px-3 py-2.5 text-sm text-gray-800 outline-none bg-transparent placeholder-gray-300 resize-none"
                rows={4}
              />
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={form.terms}
              onChange={function(){ setForm({ ...form, terms: !form.terms }); }}
              className="w-4 h-4 mt-0.5 accent-red-700 flex-shrink-0 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
              I agree to the{" "}
              <span className="text-red-600 font-semibold">Terms and Conditions</span>
              {" "}of Sheetal Property
            </label>
          </div>

          {/* Submit */}
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
              "Contact Now"
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ContactForm;