import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaLock, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import apiClient from "../../../utils/apiClient";

const Password = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [oldPasswordShown, setOldPasswordShown] = useState(false);
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null)
  const validateForm = () => {
    let errors={};
    if(!oldPassword) errors.oldPassword = "Please enter your old password";
    else if(!password) errors.password = "Please enter your new password";
    else if(password.length < 6) errors.password = "Password length must be at least 6 chararcters"
    else if(!confirmPassword) errors.confirmPassword = "Please re-enter your new password";
    else if(password != confirmPassword) errors.confirmPassword="Password Mismatched";
    setErrors(errors);
    return errors;
  }
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const errors = validateForm();

    if(Object.keys(errors).length > 0){
      setLoading(false);
      return false;
    }else{
      try{
        await apiClient.post('change-password', {
          old_password: oldPassword,
          password: password,
          password_confirmation: confirmPassword
        }).then(res=>{
          if(res.status === 200){
            setLoading(false);
            toast.success(`Password updated successfully.`);
          }else{
            setLoading(false);
            toast.error(res.message);
          }
        })
      }catch(error){
        console.error(error);
        setLoading(false);
        toast.error(error.response.data.message);
      }
    }
    
  }

  

 
  return (
    <div className="space-y-5 md:space-y-10">
      <div className="max-w-7xl mx-auto ">
        <h1 className="text-2xl font-semibold text-gray-900">
          Change Password
        </h1>
      </div>
      <form className="grid gap-5 md:gap-10 md:w-2/4" onSubmit={handleFormSubmit}>
        <label className="flex flex-col space-y-2">
          <span>Old Password</span>
          <div className="p-2 border border-gray-500 rounded overflow-hidden flex space-x-3 pr-3 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-red-700 focus-visible:ring-offset-2 focus-visible:border-red-700">
            <input
              type={oldPasswordShown ? "text" : "password"}
              className="w-full border-none"
              value={oldPassword}
              onChange={(e)=> setOldPassword
                (e.target.value)}
            />
            {oldPasswordShown ? (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setOldPasswordShown(false);
                  }}
                >
                  <AiOutlineEyeInvisible className="w-6 h-6 text-gray-500" />
                </button>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setOldPasswordShown(true);
                }}
              >
                <AiOutlineEye className="w-6 h-6 text-gray-500" />
              </button>
            )}
          </div>
          {errors?.oldPassword && <span className="text-red-400 text-sm">{errors?.oldPassword}</span>}
        </label>
        <label className="flex flex-col space-y-2">
          <span>New Password</span>
          <div className="p-2 border border-gray-500 rounded overflow-hidden flex space-x-3 pr-3 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-red-700 focus-visible:ring-offset-2 focus-visible:border-red-700">
            <input
              type={passwordShown ? "text" : "password"}
              className="w-full border-none"
              name="password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
            />
            {passwordShown ? (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setPasswordShown(false);
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
                }}
              >
                <AiOutlineEye className="w-6 h-6 text-gray-500" />
              </button>
            )}
          </div>
          {errors?.password && <span className="text-red-400 text-sm">{errors?.password}</span>}
        </label>
        <label className="flex flex-col space-y-2">
          <span>Confirm New Password</span>
          <div className="p-2 border border-gray-500 rounded overflow-hidden flex space-x-3 pr-3 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-red-700 focus-visible:ring-offset-2 focus-visible:border-red-700">
            <input
              type={confirmPasswordShown ? "text" : "password"}
              className="w-full border-none"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e)=> setConfirmPassword(e.target.value)}
            />
            {confirmPasswordShown ? (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setConfirmPasswordShown(false);
                  }}
                >
                  <AiOutlineEyeInvisible className="w-6 h-6 text-gray-500" />
                </button>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setConfirmPasswordShown(true);
                }}
              >
                <AiOutlineEye className="w-6 h-6 text-gray-500" />
              </button>
            )}
          </div>
          {errors?.confirmPassword && <span className="text-red-400 text-sm">{errors?.confirmPassword}</span>}
        </label>
        <div></div>
        <div className="flex justify-end">
        <button type="submit" className="text-white font-medium bg-red-700 rounded px-5 py-2"  disabled={loading}>
            {loading ?<FaSpinner className="spin"/> : 'Update Password'}
            </button>
        </div>
      </form>
     
    </div>
  );
};

export default Password;
