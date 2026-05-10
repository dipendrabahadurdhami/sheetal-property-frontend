import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaLock, FaSpinner, FaUserAlt, FaEnvelopeOpenText } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setLoading, setLogin, setError } from "../../features/slices/auth";
import { fetchUserInformation } from "../../features/slices/userInformation";
import { toast } from "react-toastify";

// Ensure axios sends cookies globally
axios.defaults.withCredentials = true;

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .max(255, "Email too long")
    .required("Email is required")
    .trim(),
  password: Yup.string()
    .min(6, "Password too short")
    .max(100, "Password too long")
    .required("Password is required"),
});

const Login = ({ setR }) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_LINK?.replace(/\/$/, "");
  const SANCTUM_URL = API_BASE?.replace("/api", "/sanctum/csrf-cookie");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const user_name = params.get("user_name");

    if (token && user_name) {
      // Immediate storage
      localStorage.setItem("sheetal_token", token);
      dispatch(setLogin({ token, user_name }));
      toast.success(`Email Verified! Welcome, ${user_name}`);

      setTimeout(() => {
        dispatch(fetchUserInformation());
        setR(false);
        navigate(location.pathname, { replace: true });
      }, 800);
    }
  }, [location, dispatch, navigate, setR]);

  const handleJustResend = async (e) => {
    if (e) e.preventDefault();
    try {
      setLocalLoading(true);
      await axios.post(`${API_BASE}/email/resend`, { email: unverifiedEmail });
      toast.success("Verification link resent successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not resend link");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleChangeEmail = async (e) => {
    if (e) e.preventDefault();
    if (!newEmail) return toast.error("Please enter a new email");
    try {
      setLocalLoading(true);
      const response = await axios.post(`${API_BASE}/email/change-resend`, {
        old_email: unverifiedEmail,
        new_email: newEmail.toLowerCase().trim(),
      });
      setUnverifiedEmail(newEmail.toLowerCase().trim());
      setNewEmail("");
      toast.success(response.data.message || "Email updated! Check your inbox.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update email");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="p-3 text-sm relative">
      <Formik
        initialValues={{ email: "", password: "", _honeypot: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values) => {
          if (values._honeypot) return;
          try {
            dispatch(setLoading(true));

            // CRITICAL: Initialize CSRF protection before Login
            await axios.get(SANCTUM_URL);

            const res = await axios.post(`${API_BASE}/login`, {
              email: values.email.toLowerCase().trim(),
              password: values.password,
            });

            // Improved check: look for token in res.data.data OR res.data directly
            const userData = res.data?.data || res.data;
            const token = userData?.token;

            if (res.status === 200 && token) {
              localStorage.setItem("sheetal_token", token);
              dispatch(setLogin(userData));
              toast.success(`Welcome back, ${userData.user_name || 'User'}!`);
              
              setTimeout(() => {
                dispatch(fetchUserInformation());
                dispatch(setLoading(false));
                setR(false);
              }, 800);
            } else {
              throw new Error("Token not received from server");
            }
          } catch (error) {
            dispatch(setLoading(false));
            if (error.response?.status === 403 && error.response?.data?.must_verify) {
              setUnverifiedEmail(error.response.data.email);
              toast.warning("Verification Required");
            } else {
              const errMsg = error.response?.data?.message || error.message || "Invalid Email or Password";
              toast.error(errMsg);
              dispatch(setError(errMsg));
            }
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="w-full space-y-5">
            <Field type="text" name="_honeypot" style={{ display: 'none' }} tabIndex="-1" />
            <div className="border-2 border-gray-400 rounded-lg overflow-hidden bg-white">
              <div className={`flex space-x-3 border-b-2 border-gray-400 p-3 items-center ${errors.email && touched.email ? 'bg-red-50' : ''}`}>
                <FaUserAlt className="w-4 h-4 text-gray-400" />
                <Field name="email" type="email" className="w-full focus:outline-none bg-transparent" placeholder="Email Address" />
              </div>
              <div className={`flex space-x-3 p-3 items-center ${errors.password && touched.password ? 'bg-red-50' : ''}`}>
                <FaLock className="w-4 h-4 text-gray-400" />
                <Field name="password" type={passwordShown ? "text" : "password"} className="w-full focus:outline-none bg-transparent" placeholder="Password" />
                <button type="button" onClick={() => setPasswordShown(!passwordShown)}>
                  {passwordShown ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" className="text-red-700 text-xs font-bold uppercase" onClick={() => setR("forgot-password")}>
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              disabled={auth.isLoading || isSubmitting}
              className="flex justify-center items-center text-white bg-red-700 hover:bg-red-800 rounded-lg w-full text-sm font-black p-4 shadow-lg disabled:bg-gray-400 uppercase tracking-widest"
            >
              {auth.isLoading ? <FaSpinner className="animate-spin" /> : "Secure Login"}
            </button>
          </Form>
        )}
      </Formik>

      {/* Verification Rescue Overlay */}
      {unverifiedEmail && (
        <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-4 text-center border-2 border-red-700 rounded-lg shadow-2xl">
          <FaEnvelopeOpenText className="text-red-700 text-5xl mb-4" />
          <h2 className="text-lg font-black uppercase mb-2">Verify Your Email</h2>
          <p className="text-gray-600 mb-6 text-xs">
            We need to verify <strong>{unverifiedEmail}</strong>.
          </p>

          <div className="w-full space-y-4">
            <button
              type="button"
              onClick={handleJustResend}
              disabled={localLoading}
              className="w-full bg-red-700 text-white text-xs font-bold py-3 rounded uppercase hover:bg-red-800 shadow-md"
            >
              {localLoading && !newEmail ? <FaSpinner className="animate-spin inline mr-2" /> : "Just Resend Link"}
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-300 w-full absolute"></div>
              <span className="bg-white px-3 text-[10px] font-bold text-gray-400 uppercase relative z-10">Or Change Email</span>
            </div>

            <input
              type="email"
              value={newEmail}
              placeholder="Enter new real email"
              className="w-full border-2 border-gray-300 p-2 rounded focus:border-red-700 outline-none text-center text-xs"
              onChange={(e) => setNewEmail(e.target.value)}
            />

            <button
              type="button"
              onClick={handleChangeEmail}
              disabled={localLoading || !newEmail}
              className="w-full bg-black text-white text-xs font-bold py-3 rounded uppercase hover:bg-gray-800 disabled:bg-gray-400"
            >
              {localLoading && newEmail ? "Updating..." : "Update & Send"}
            </button>

            <button
              type="button"
              onClick={() => setUnverifiedEmail(null)}
              className="text-red-700 text-[10px] font-bold uppercase underline block mx-auto mt-2"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;