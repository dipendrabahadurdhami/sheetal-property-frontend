import React, { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Password is required").min(6, "Too Short!"),
  conformPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
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
  const [conformPasswordShown, setConformPasswordShown] = useState(false);
  const [selected, setSelected] = useState(people[0]);
  const [error, setError] = useState(people[0]);

  return (
    <div className="p-3 text-sm">
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          conformPassword: "",
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values) => {
          try {
            const res = await axios.post(
              `${process.env.REACT_APP_API_LINK}/register`,
              {
                user_name: values.name,
                email: values.email,
                password: values.password,
                password_confirmation: values.password_confirmation,
              }
            );
            if (res.data.errors) {
              setError(Object.values(res.data.errors)[0]);
              console.log(error);
            } else {
              setR(false);
              console.log(res);
              navigate(0);
            }
          } catch (err) {
            console.log(err);
          }
        }}
      >
        {({ errors, touched }) => (
          <Form className="w-full space-y-5">
            <div className="border-2 border-gray-400 rounded-lg">
              <label className="flex space-x-3 border-b-2 border-gray-400 p-3 items-center">
                <FaUserAlt className="w-5 h-5 text-gray-400" />
                <Field
                  type="text"
                  name="name"
                  className="w-full focus:outline-none"
                  placeholder="Username or Email"
                  required
                />
              </label>

              {errors.name && touched.name ? (
                <div className="text-red-700 font-base border-b-2 border-gray-400  p-1">
                  {errors.name}
                  <sup>*</sup>
                </div>
              ) : null}

              <label className="flex space-x-3 border-b-2 border-gray-400 py-2 px-3 items-center">
                <MdEmail className="w-7 h-7 text-gray-400" />
                <Field
                  type="email"
                  name="email"
                  className="w-full focus:outline-none"
                  placeholder="Email"
                />
              </label>
              {errors.email && touched.email ? (
                <div className="text-red-700 font-base border-b-2 border-gray-400  p-1">
                  {errors.email}
                  <sup>*</sup>
                </div>
              ) : null}

              <label className="flex space-x-3 border-b-2 border-gray-400 p-3 items-center">
                <FaLock className="w-5 h-5 text-gray-400" />
                <Field
                  name="password"
                  type={passwordShown ? "text" : "password"}
                  className="w-full focus:outline-none"
                  placeholder="Password"
                />
                {passwordShown ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setPasswordShown(false);
                        console.log(passwordShown);
                      }}
                    >
                      <AiOutlineEyeInvisible className="w-6 h-6 text-gray-500" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();

                      setPasswordShown(true);
                      console.log(passwordShown);
                    }}
                  >
                    <AiOutlineEye className="w-6 h-6 text-gray-500" />
                  </button>
                )}
              </label>
              {errors.password && touched.password ? (
                <div className="text-red-700 font-base border-b-2 border-gray-400  p-1">
                  {errors.password}
                  <sup>*</sup>
                </div>
              ) : null}

              <label className="flex space-x-3  p-3 items-center">
                <FaLock className="w-5 h-5 text-gray-400" />
                <Field
                  name="conformPassword"
                  type={conformPasswordShown ? "text" : "password"}
                  className="w-full focus:outline-none"
                  placeholder="Conform Password"
                />
                {conformPasswordShown ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setConformPasswordShown(false);
                      }}
                    >
                      <AiOutlineEyeInvisible className="w-6 h-6 text-gray-500" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setConformPasswordShown(true);
                    }}
                  >
                    <AiOutlineEye className="w-6 h-6 text-gray-500" />
                  </button>
                )}
              </label>
              {errors.conformPassword && touched.conformPassword ? (
                <div className="text-red-700 font-base border-t-2 border-gray-400  p-1">
                  {errors.conformPassword}
                  <sup>*</sup>
                </div>
              ) : null}
            </div>

            <Listbox value={selected} onChange={setSelected}>
              <div className="relative mt-1">
                <Listbox.Button className="relative border-2  border-gray-400 w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-gray-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500">
                  <span className="block truncate">{selected.name}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <SelectorIcon
                      className="w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {people.map((person, personIdx) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `cursor-default select-none relative py-2 pl-10 pr-4 ${
                            active
                              ? "text-gray-900 bg-gray-100"
                              : "text-gray-900"
                          }`
                        }
                        value={person}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {person.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-600">
                                <CheckIcon
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                />
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
            <label className="flex items-center text-gray-500 space-x-3">
              <Field type="checkbox" className="w-5 h-5" />
              <span>
                I agree with your{" "}
                <span className="text-red-700">Terms & Conditions</span>
              </span>
            </label>

            <button
              type="submit"
              className="text-white bg-red-700 rounded-lg w-full font-bold p-3"
            >
              Register
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
