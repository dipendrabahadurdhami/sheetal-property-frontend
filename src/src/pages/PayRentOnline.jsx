import React from "react";
import PayYourRentOnline from "../components/Service/Payment/PayYourRentOnline";
import RentOnilneSteps from "../components/Service/Payment/RentOnilneSteps";
import SEO from "../components/SEO/SEO";

const PayRentOnline = () => {
  return (
    <div>
      <PayYourRentOnline />
      <SEO
        title="Pay Rent Online in Nepal - Secure Online Rent Payment"
        description="Pay your rent online securely through Sheetal Property Nepal. Fast, convenient rent payment for tenants across Nepal."
        keywords="pay rent online Nepal, online rent payment Nepal, tenant rent payment, Sheetal Property rent"
        path="/payRentOnline"
      />
      <RentOnilneSteps />
    </div>
  );
};

export default PayRentOnline;
