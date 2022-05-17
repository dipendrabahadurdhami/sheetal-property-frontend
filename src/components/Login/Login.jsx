import React, { useContext, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaLock, FaSpinner, FaUserAlt } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {setLoading ,setLogin, setError} from '../../features/slices/auth';
import { setUserInfo, fetchUserInformation } from "../../features/slices/userInformation";
// import { LoggedUserContext } from "../Context/LoginContext";

import {  toast } from 'react-toastify';

// import { useCookies } from 'react-cookie';
import apiClient from "../../utils/apiClient";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Password is required"),
});

const Login = ({ setR }) => {
  // const { setToken } = useContext(LoggedUserContext);
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  // const [cookies, setCookie] = useCookies(['sheetal_token']);
  const auth =  useSelector((state)=>state.auth);
  const dispatch =  useDispatch();

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
          
            dispatch(setLoading(true));
            const res = await axios.post(`${process.env.REACT_APP_API_LINK}/login`,
              {
                email: values.email,
                password: values.password,
              }
            );

           if(res.status === 200){
              localStorage.setItem("sheetal_token", res.data.data.token);
              dispatch(setLoading(false));
              dispatch(setLogin(res.data.data))
              dispatch(setError(''))
  
              // setCookie('sheetal_token', res.data.data.token, { path: '/' });
              toast.success(`Welcome ${res.data.data.user_name}, You have successfully logged in.`);

              setTimeout(()=>{
                dispatch(fetchUserInformation())
              }, 1000)

           }else{
             const error = "Something went wrong. Please try again later";
            toast.error(error)
            dispatch(setError(error));
            dispatch(setLoading(false));
           }

            
            // setToken(res.data.data.token);
            // console.log(res.data.data.token);
            setR(false);
            // navigate(0);
          } catch (error) {
            console.error(error);
            toast.error(error.response.data.message)
            dispatch(setLoading(false));
            dispatch(setError(error.response.data.message));
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
              className="inline-flex justify-center text-white bg-red-700 rounded-lg w-full text-sm font-medium p-3 text-center"
            >
              {auth.isLoading?<FaSpinner className="spin"/>: 'Login'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
