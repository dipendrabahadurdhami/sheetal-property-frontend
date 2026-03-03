import React from "react";
import { Link } from "react-router-dom";

const OurServices = () => {
  return (
    <div className="text-white">
      <h2 className="font-bold mb-4">Our services</h2>
      <ul className="space-y-3 capitalize text-sm">
      
        <li>
          <Link to={'/productSearch?advertisement_purpose=Sale'}>Sale Properties</Link>
        </li>
        <li>
          <Link to={'/productSearch?advertisement_purpose=Rent'}>Rent Properties</Link>
        </li>
        <li>
          <Link to={'/productSearch?advertisement_purpose=Invest'}>Invest in Properties</Link>
        </li>
        <li>
          <Link to={'/productSearch?advertisement_purpose=Invest'}>Invest in Properties</Link>
        </li>
        <li>
          <Link to={'/PrivacyPolicy'}>Privacy test Policy</Link>
        </li>
      </ul>
    </div>
  );
};

export default OurServices;
