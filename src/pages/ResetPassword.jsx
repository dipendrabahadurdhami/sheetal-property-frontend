import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FaLock, FaSpinner } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string().required("This field is required"),
  password_confirmation: Yup.string()
    .required("This field is required")
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
});

const initialValues = {
  password: "",
  password_confirmation: "",
};

const ResetPassword = (props) => {
  const navigate = useNavigate();

  const { token } = useParams();

  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (data) => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_LINK}/reset-password`,
        { token, ...data }
      );

      if (res?.data?.status === 200) {
        toast.success(res?.data?.message || "Your password has been reseted.");
        setLoading(false);
        navigate("/");
      } else {
        toast.error(
          res?.data?.message || "Something went wrong while reseting password."
        );
        setLoading(false);
      }
    } catch (e) {
      toast.error("Something went wrong while reseting password.");
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handlePasswordReset,
    validationSchema: resetPasswordSchema,
  });

  const { values, errors, touched, setFieldValue } = formik;

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="max-w-[560px] px-5 lg:px-10 py-4 md:py-8 lg:py-10 space-y-4">
        <div className="text-lg lg:text-xl font-medium">Reset Password</div>
        <form onSubmit={formik.handleSubmit} className="text-sm space-y-4">
          <div className="space-y-2">
            <div>New Password:</div>
            <div className="flex space-x-3 p-3 items-center border-2 rounded-lg">
              <FaLock className="w-5 h-5 text-gray-400" />
              <input
                type={passwordShown ? "text" : "password"}
                className="w-full focus:outline-none"
                placeholder="Enter New Password"
                value={values.password}
                onChange={(event) =>
                  setFieldValue("password", event.target.value)
                }
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

            {errors.password && touched.password && (
              <div className="text-red-700 p-1">{errors.password}</div>
            )}
          </div>

          <div className="space-y-2">
            <div>Confirm New Password:</div>
            <div className="flex space-x-3 p-3 items-center border-2 rounded-lg">
              <FaLock className="w-5 h-5 text-gray-400" />
              <input
                type={confirmPasswordShown ? "text" : "password"}
                className="w-full focus:outline-none"
                placeholder="Confirm New Password"
                value={values.password_confirmation}
                onChange={(event) =>
                  setFieldValue("password_confirmation", event.target.value)
                }
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

            {errors.password_confirmation && touched.password_confirmation && (
              <div className="text-red-700 p-1">
                {errors.password_confirmation}
              </div>
            )}
          </div>

          <div className="pt-3">
            <button className="inline-flex justify-center text-white bg-red-700 rounded-lg w-full text-sm font-medium p-3 text-center">
              {loading ? <FaSpinner className="spin" /> : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
