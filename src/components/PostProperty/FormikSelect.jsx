import { ErrorMessage, Field } from "formik";
import React from "react";

const FormikSelect = (props) => {
  const {
    label,
    name,
    error,
    placeHolder,
    touched,
    options,
    containerClassname,
    labelClassName,
    className,
    isRequired = false,
    ...restProps
  } = props;
  return (
    <div className={`w-full ${containerClassname}`}>
      <label
        htmlFor={name}
        className={`ml-1 capitalize tracking-wider ${labelClassName} `}
      >
        {label}
        {isRequired && <sup className="text-red-700 ml-2 text-base">*</sup>}
      </label>
      <Field
        as="select"
        name={name}
        id={name}
        className={`${
          error && touched && "ring-2 ring-red-500"
        }  ${className} focus:outline-none border border-gray-400 rounded  p-2 w-full text-gray-500 mt-1`}
        {...restProps}
      >
        {true && (
          <option
            className="capitalize text-gray-500 hidden"
            value={placeHolder}
          >
            {placeHolder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="capitalize text-gray-500"
          >
            {option.label}
          </option>
        ))}
      </Field>
      <ErrorMessage name={name} component="div" className="text-red-500" />
    </div>
  );
};

export default FormikSelect;
