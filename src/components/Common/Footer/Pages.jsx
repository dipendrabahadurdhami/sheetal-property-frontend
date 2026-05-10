import React from "react";
import { Link } from "react-router-dom";

const Pages = () => {
  return (
    <>
      <div className="text-white">
        <h2 className="font-bold mb-4">Quick Links</h2>
        <ul className="space-y-3 capitalize text-sm">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/requirementForm">Requirement Form</Link>
          </li>
          <li>
            <Link to="/propertyDemand">Property Demands</Link>
          </li>
          <li>
            <Link to={'/privacy-policy'}>Privacy Policy</Link>
          </li>
          <li>
            <Link to="/terms-and-conditions">Terms and Conditions</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Pages;
