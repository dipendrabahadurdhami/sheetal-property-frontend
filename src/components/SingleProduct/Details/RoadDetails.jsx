import React from "react";

const RoadDetails = () => {
  return (
    <div>
      <div className="space-y-4 py-5">
        <div className="space-y-4">
          <div className="text-red-700 font-medium">Road Details</div>
          <ul className="font-light text-sm space-y-2">
            <li className="flex justify-between items-center">
              <span>Main road width</span>
              <span>100 m</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Side road width</span>
              <span>10000 m</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Road wide facing the building</span>
              <span>North</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Mohada</span>
              <span>NA</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Road Status</span>
              <span>Developed</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="space-y-4 py-5">
        <div className="space-y-4">
          <div className="text-red-700 font-medium">Land Details</div>
          <ul className="font-light text-sm space-y-2">
            <li className="flex justify-between items-center">
              <span>Geometry</span>
              <span>Square</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Perimeter</span>
              <span>500 m</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Elevationg</span>
              <span>North</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Status</span>
              <span>Self-using</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="space-y-4 py-5">
        <div className="space-y-4">
          <div className="text-red-700 font-medium">Price</div>
          <ul className="font-light text-sm space-y-2">
            <li className="flex justify-between items-center">
              <span>Total price</span>
              <span>10 crore</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Per Sq.ft. price</span>
              <span>5 lakhs</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Aana price</span>
              <span>10 lakhs</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Booking Price</span>
              <span>5 crore</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Urgency</span>
              <span>Immediate</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="space-y-4 py-5">
        <div className="space-y-4">
          <div className="text-red-700 font-medium">Immediate</div>
          <ul className="font-light text-sm space-y-2">
            <li className="flex justify-between items-center">
              <span>Rent Per Month</span>
              <span>NA</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Min Lease period</span>
              <span>NA</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Min deposit</span>
              <span>NA</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="space-y-4 py-5">
        <div className="space-y-4">
          <div className="text-red-700 font-medium">Negotiability</div>
          <ul className="font-light text-sm space-y-2">
            <li className="flex justify-between items-center">
              <span>Min amount</span>
              <span>NA</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Max amount</span>
              <span>NA</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RoadDetails;
