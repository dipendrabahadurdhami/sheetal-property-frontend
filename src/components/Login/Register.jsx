import React, { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaUserAlt, FaLock, FaSpinner } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";

const SignupSchema = Yup.object().shape({
  user_name: Yup.string()
    .min(3, "Too Short!")
    .max(30, "Too Long!")
    .matches(/^[a-zA-Z0-9_]+$/, "Only alphanumeric and underscores allowed")
    .required("Required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Required")
    .max(255),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Minimum 8 characters")
    .matches(/[a-z]/, "Lowercase required")
    .matches(/[A-Z]/, "Uppercase required")
    .matches(/[0-9]/, "Number required")
    .matches(/[!@#$%^&*]/, "Special character required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
  acceptTerms: Yup.boolean()
    .oneOf([true], "Required"),
});

const people = [
  { name: "Agent" },
  { name: "Buyer" },
  { name: "Seller" },
  { name: "Owner" },
];

const Register = ({ setR }) => {
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [selected, setSelected] = useState(people[0]);
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  const sanitizeInput = (val) => {
    if (typeof val !== "string") return val;
    return val.replace(/[<>]/g, "").trim();
  };

  return (
    <div className="p-3 text-sm">
      <Formik
        initialValues={{
          user_name: "",
          email: "",
          password: "",
          confirmPassword: "",
          acceptTerms: false,
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values) => {
          try {
            setServerError(null);
            setLoading(true);

            const payload = {
              user_name: sanitizeInput(values.user_name),
              email: sanitizeInput(values.email),
              password: values.password,
              password_confirmation: values.confirmPassword,
              user_type: selected.name,
            };

            const res = await axios.post(
              `${process.env.REACT_APP_API_LINK}/register`,
              payload
            );

            if (res.data.errors) {
              setServerError(res.data.errors);
              setLoading(false);
              toast.error("Registration failed");
            } else {
              setR(false);
              setLoading(false);
              toast.success("User successfully registered");
              navigate("/");
            }
          } catch (err) {
            setLoading(false);
            const msg = err.response?.data?.errors || { error: ["Connection failed"] };
            setServerError(msg);
            toast.error("Error submitting form");
          }
        }}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="w-full space-y-5">
            <div className="border-2 border-gray-400 rounded-lg overflow-hidden">
              <label className="flex space-x-3 border-b-2 border-gray-400 p-3 items-center bg-white">
                <FaUserAlt className="w-5 h-5 text-gray-400" />
                <Field
                  type="text"
                  name="user_name"
                  className="w-full focus:outline-none"
                  placeholder="Username"
                />
              </label>
              {errors.user_name && touched.user_name && (
                <div className="text-red-700 font-base border-b-2 border-gray-400 p-1 bg-red-50">
                  {errors.user_name}<sup>*</sup>
                </div>
              )}

              <label className="flex space-x-3 border-b-2 border-gray-400 py-2 px-3 items-center bg-white">
                <MdEmail className="w-7 h-7 text-gray-400" />
                <Field
                  type="email"
                  name="email"
                  className="w-full focus:outline-none"
                  placeholder="Email"
                />
              </label>
              {errors.email && touched.email && (
                <div className="text-red-700 font-base border-b-2 border-gray-400 p-1 bg-red-50">
                  {errors.email}<sup>*</sup>
                </div>
              )}

              <label className="flex space-x-3 border-b-2 border-gray-400 p-3 items-center bg-white">
                <FaLock className="w-5 h-5 text-gray-400" />
                <Field
                  name="password"
                  type={passwordShown ? "text" : "password"}
                  className="w-full focus:outline-none"
                  placeholder="Password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setPasswordShown(!passwordShown)}
                >
                  {passwordShown ? (
                    <AiOutlineEyeInvisible className="w-6 h-6 text-gray-500" />
                  ) : (
                    <AiOutlineEye className="w-6 h-6 text-gray-500" />
                  )}
                </button>
              </label>
              {errors.password && touched.password && (
                <div className="text-red-700 font-base border-b-2 border-gray-400 p-1 bg-red-50">
                  {errors.password}<sup>*</sup>
                </div>
              )}

              <label className="flex space-x-3 p-3 items-center bg-white">
                <FaLock className="w-5 h-5 text-gray-400" />
                <Field
                  name="confirmPassword"
                  type={confirmPasswordShown ? "text" : "password"}
                  className="w-full focus:outline-none"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setConfirmPasswordShown(!confirmPasswordShown)}
                >
                  {confirmPasswordShown ? (
                    <AiOutlineEyeInvisible className="w-6 h-6 text-gray-500" />
                  ) : (
                    <AiOutlineEye className="w-6 h-6 text-gray-500" />
                  )}
                </button>
              </label>
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <div className="text-red-700 font-base p-1">{errors.confirmPassword}*</div>
            )}

            <Listbox value={selected} onChange={setSelected}>
              <div className="relative mt-1">
                <Listbox.Button className="relative border-2 border-gray-400 w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg focus:outline-none">
                  <span className="block truncate">{selected.name}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <SelectorIcon className="w-5 h-5 text-gray-400" />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {people.map((person, personIdx) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `cursor-default select-none relative py-2 pl-10 pr-4 ${
                            active ? "text-gray-900 bg-gray-100" : "text-gray-900"
                          }`
                        }
                        value={person}
                      >
                        {({ selected: isSel }) => (
                          <>
                            <span className={`block truncate ${isSel ? "font-medium" : "font-normal"}`}>
                              {person.name}
                            </span>
                            {isSel ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-600">
                                <CheckIcon className="w-5 h-5" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>

            <div className="flex flex-col space-y-2">
              <label className="flex items-center text-gray-500 space-x-3 cursor-pointer">
                <Field
                  type="checkbox"
                  name="acceptTerms"
                  className="w-5 h-5"
                />
                <span>
                  I agree with your <span className="text-red-700">Terms & Conditions</span>
                </span>
              </label>
              {errors.acceptTerms && touched.acceptTerms && (
                <div className="text-red-600">{errors.acceptTerms}</div>
              )}
            </div>

            {serverError && (
              <ul className="text-red-500 bg-red-100 rounded-sm p-2 list-none">
                {Object.entries(serverError).map(([key, value], i) => (
                  <li key={i} className="py-1 border-b border-red-200 last:border-0">
                    {Array.isArray(value) ? value[0] : value}
                  </li>
                ))}
              </ul>
            )}

            <button
              type="submit"
              className="text-white bg-red-700 rounded-lg w-full font-bold p-3 text-center flex items-center justify-center disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Register"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;