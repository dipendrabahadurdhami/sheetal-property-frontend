import React, { useState } from "react";
import RentOnline from "./RentOnline";
import CardForm from "./CardForm";
import ChooseRentSpace from "./ChooseRentSpace";
import ChoosePaymentMethod from "./ChoosePaymentMethod";

const RentOnilneSteps = () => {
  const [select, setSelect] = useState(1);
  console.log(select);
  const steps = [
    {
      id: 1,
      name: "Job details",
      form: <RentOnline setSelect={setSelect} />,
    },
    {
      id: 2,
      name: "Application form",
      form: <ChooseRentSpace setSelect={setSelect} />,
    },
    {
      id: 3,
      name: "Application form",
      form: <ChoosePaymentMethod setSelect={setSelect} />,
    },
    {
      id: 4,
      name: "Application form",
      form: <CardForm setSelect={setSelect} />,
    },
  ];
  return (
    <div className="px-5 py-10 md:px-10 border-t-2 border-gray-300">
      {steps.map((step, stepIdx) => (
        <div key={stepIdx}>{step.id === select && step.form}</div>
      ))}
    </div>
  );
};

export default RentOnilneSteps;
