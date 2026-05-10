import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { ErrorMessage, Field } from "formik";
import React, { useState } from "react";

const FormikTextInput = (props) => {
  const {
    name,
    type,
    label,
    labelClassName,
    error,
    touched,
    className,
    placeholder,
    containerClassname,
    isRequired = false,

    ...restProps
  } = props;

  const [toggleEyeIcon, setToggleEyeIcon] = useState(true);
  const [texttype, setTextType] = useState(type);

  const togglePassword = () => {
    setToggleEyeIcon(!toggleEyeIcon);
    if (texttype === "password") {
      setTextType("text");
    } else {
      setTextType("password");
    }
  };

  return (
    <div className={`w-full ${containerClassname} `}>
      {label && (
        <label
          htmlFor={name}
          className={`ml-1 capitalize tracking-wider ${labelClassName}`}
        >
          {label}
          <span className="ml-2">
            {isRequired && <sup className="text-red-700 text-base">*</sup>}
          </span>
        </label>
      )}
      <div className="w-full mt-1 col-span-2">
        <div className="relative flex ">
          <Field
            id={name}
            name={name}
            placeholder={placeholder}
            className={`${
              error && touched && "ring-2 ring-red-500"
            } focus:outline-none focus:ring-2 focus:ring-black focus:rounded border rounded border-gray-400 p-2 w-full text-gray-500 ${className}`}
            {...restProps}
          />
          {type === "password" && (
            <button
              type="button"
              className="absolute right-1 inset-y-1"
              onClick={togglePassword}
            >
              {!toggleEyeIcon ? (
                <EyeIcon className="text-gray-400 h-6 w-6" />
              ) : (
                <EyeOffIcon className="text-gray-300 h-6 w-6" />
              )}
            </button>
          )}
        </div>
      </div>
      <ErrorMessage name={name} component="div" className="text-red-500" />
    </div>
  );
};

export default FormikTextInput;
