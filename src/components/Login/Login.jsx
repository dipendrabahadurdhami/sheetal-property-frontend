import React, { useContext, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaLock, FaUserAlt } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { LoggedUserContext } from "../Context/LoginContext";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Password is required"),
});

const Login = ({ setR }) => {
  const { setToken } = useContext(LoggedUserContext);
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);

  return (
    <div className="p-3 text-sm">
      <Formik
        initialValues={{
          email: "nnn@gmail.com",
          password: "nikhil",
        }}
        validationSchema={LoginSchema}
        onSubmit={async (values) => {
          try {
            const res = await axios.post(
              `${process.env.REACT_APP_API_LINK}/login`,
              {
                email: values.email,
                password: values.password,
              }
            );

            localStorage.setItem("token", res.data.data.token);
            setToken(res.data.data.token);
            console.log(res.data.data.token);
            setR(false);
            navigate(0);
          } catch (error) {
            console.error(error);
          }
        }}
      >
        {({ errors, touched }) => (
          <Form className="w-full space-y-5">
            <div className="border-2 border-gray-400 rounded-lg overflow-hidden">
              <label className="flex space-x-3 border-b-2 border-gray-400 p-3 items-center">
                <FaUserAlt className="w-5 h-5 text-gray-400" />
                <Field
                  name="email"
                  type="email"
                  className="w-full focus:outline-none"
                  placeholder="Username or Email"
                  required
                />
              </label>
              {errors.email && touched.email ? (
                <div className="text-red-700 font-base border-b-2 border-gray-400  p-1">
                  {errors.email}
                  <sup>*</sup>
                </div>
              ) : null}

              <label className="flex space-x-3  p-3 items-center">
                <FaLock className="w-5 h-5 text-gray-400" />
                <Field
                  name="password"
                  type={passwordShown ? "text" : "password"}
                  className="w-full focus:outline-none"
                  placeholder="Password"
                  required
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
                <div className="text-red-700 font-base border-t-2 border-gray-400  p-1">
                  {errors.password}
                  <sup>*</sup>
                </div>
              ) : null}
            </div>
            <div className="flex justify-between">
              <label className="flex items-center text-gray-500 space-x-3">
                <Field checked={false} type="checkbox" className="w-5 h-5" />
                <span>Remember me</span>
              </label>
              <a href="/" className="text-red-700">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="text-white bg-red-700 rounded-lg w-full text-xl font-bold p-3"
            >
              Login
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
