import React from "react";
import { Link } from "react-router-dom";

const Pages = () => {
  return (
    <>
      <div className="text-white">
        <ul className="space-y-3">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/findAgent">Find Agent</Link>
          </li>
          <li>
            <Link to="/requirementForm">Requirement Form</Link>
          </li>
          <li>
            <Link to="/propertyDemand">Property Demands</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Pages;
