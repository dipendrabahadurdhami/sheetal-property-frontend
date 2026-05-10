import { Button } from "@material-ui/core";
import React, { useState } from "react";
import PaymentSuccessful from "./PaymentSuccessful";

const ApplyOnilne = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <form className="px-5 md:px-28 pb-16 w-full space-y-5">
        <label className="flex flex-col space-y-1">
          <span>Name</span>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full text-gray-500 border border-gray-300 rounded p-3 focus:outline-none"
          />
        </label>
        <label className="flex flex-col space-y-1">
          <span>Contact Number</span>
          <input
            type="text"
            placeholder="Enter your Contact Number"
            className="w-full text-gray-500 border border-gray-300 rounded p-3 focus:outline-none"
          />
        </label>
        <label className="flex flex-col space-y-1">
          <span>Email Address</span>
          <input
            type="email"
            placeholder="Enter your Email"
            className="w-full text-gray-500 border border-gray-300 rounded p-3 focus:outline-none"
          />
        </label>
        <label className="flex flex-col space-y-1">
          <span>Temporary Address</span>
          <input
            type="text"
            placeholder="Enter your Temporary Address"
            className="w-full text-gray-500 border border-gray-300 rounded p-3 focus:outline-none"
          />
        </label>
        <label className="flex flex-col space-y-1">
          <span>Permanent location</span>
          <input
            type="text"
            placeholder="Enter your Permanent location"
            className="w-full text-gray-500 border border-gray-300 rounded p-3 focus:outline-none"
          />
        </label>
        <label className="flex flex-col space-y-1">
          <span>Occupation</span>
          <input
            type="text"
            placeholder="Enter your Occupation"
            className="w-full text-gray-500 border border-gray-300 rounded p-3 focus:outline-none"
          />
        </label>
        <label className="flex flex-col space-y-1">
          <span>Amount</span>
          <input
            type="text"
            placeholder="Enter your amount for loan"
            className="w-full text-gray-500 border border-gray-300 rounded p-3 focus:outline-none"
          />
        </label>

        <label className="flex flex-col space-y-2 contained-button-file">
          <span>Payment option</span>
          <input
            type="file"
            style={{ display: "none" }}
            id="contained-button-file"
          />
          <Button
            variant="contained"
            component="span"
            style={{ backgroundColor: "#B91C1B", color: "white" }}
            className="bg-red-700 px-5 py-2 sm:w-56 rounded"
          >
            Select Attachment
          </Button>
          <span className="text-sm text-gray-500">
            Attach photo or pdf of your Citizenship, Passport or Driving
            Licence.
          </span>
        </label>
        <button
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
          type="submit"
          className="px-10 text-white bg-red-700 py-3 rounded"
        >
          Submit
        </button>
      </form>
      <PaymentSuccessful setOpen={setOpen} open={open} />
    </>
  );
};

export default ApplyOnilne;
