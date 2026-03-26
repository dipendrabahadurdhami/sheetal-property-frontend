import { FaSpinner, FaUserAlt } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const initialValues = {
  email: "",
};

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().trim().required("This field is required"),
});

const ForgotPassword = ({ setR }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_LINK}/forgot-password`,
        data
      );

      if (res?.data?.status === 200) {
        toast.success(
          res?.data?.message ||
            "Password reset link has been sent to your email"
        );

        setLoading(false);
        setR(false);
      } else {
        toast.error(
          res?.data?.message ||
            "Something went wrong while sending password reset link. Please try again later."
        );

        setLoading(false);
      }
    } catch (e) {
      toast.error(
        "email id not  found"
      );

      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: forgotPasswordSchema,
  });

  const email = formik?.values?.email || "";
  const error = formik?.errors?.email || "";
  const touched = formik?.touched?.email || "";

  return (
    <div className="text-sm">
      <form onSubmit={formik.handleSubmit}>
        <div className="flex space-x-3 border-2 rounded-lg border-gray-400 p-3 items-center">
          <FaUserAlt className="w-5 h-5 text-gray-400" />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) =>
              formik.setFieldValue("email", event.target.value)
            }
            className="w-full focus:outline-none"
            placeholder="Username or Email"
            required
          />
        </div>

        {error && touched && <div className="text-red-700 p-1">{error}</div>}

        <div className="pt-3">
          <button className="inline-flex justify-center text-white bg-red-700 rounded-lg w-full text-sm font-medium p-3 text-center">
            {loading ? (
              <FaSpinner className="spin" />
            ) : (
              "Send Verification Code"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
