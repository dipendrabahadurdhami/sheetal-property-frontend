import React from "react";

const ProductMap = () => {
  return (
    <div>
      <iframe
        title="map"
        width="100%"
        height={"300px"}
        id="gamp_canvas"
        src="https://maps.google.com/maps?q=2880%20Broadway,%20New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed"
        frameBorder="1"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        className="relative"
      ></iframe>
      <div className="space-y-4 py-5">
        <div className="space-y-4">
          <div className="text-red-700 font-medium">Land Area in Ropani</div>
          <ul className="font-light text-sm space-y-2">
            <li className="flex justify-between items-center">
              <span>Land Area in Ropani</span>
              <span>10 Ropani</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Land Area in Sqft</span>
              <span>200 sq.ft</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Land Area in Sq.Mt.g</span>
              <span>100 m²</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="space-y-4 py-5">
        <div className="space-y-4">
          <div className="text-red-700 font-medium">
            Land according to Laal purja
          </div>
          <ul className="font-light text-sm space-y-2">
            <li className="flex justify-between items-center">
              <span>Land Area in Ropani</span>
              <span>10 Ropani</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Land Area in Sqft</span>
              <span>200 sq.ft</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Land Area in Sq.Mt.g</span>
              <span>100 m²</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="space-y-4 py-5">
        <div className="space-y-4">
          <div className="text-red-700 font-medium">Current Finance</div>
          <ul className="font-light text-sm space-y-2">
            <li className="flex justify-between items-center">
              <span>Finance/Bank Name </span>
              <span>Nabil Bank</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Loan Amount</span>
              <span>Rs. 0</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="space-y-4 py-5">
        <div className="space-y-4">
          <div className="text-red-700 font-medium">Class Type</div>
          <ul className="font-light text-sm space-y-2">
            <li className="flex justify-between items-center">
              <span>Full Developed Area</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="space-y-4 py-5">
        <div className="space-y-4">
          <div className="text-red-700 font-medium">Construction date</div>
          <ul className="font-light text-sm space-y-2">
            <li className="flex justify-between items-center">
              <span>2000/12/20</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductMap;
