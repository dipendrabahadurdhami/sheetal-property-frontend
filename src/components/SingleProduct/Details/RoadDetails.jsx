import React from "react";

const RoadDetails = ({data}) => {

  return (
    <div>
      <div className="space-y-4 py-5">
        <div className="space-y-4">
          <div className="text-red-700 font-medium">Road Details</div>
          <ul className="font-light text-sm space-y-2">
            <li className="flex justify-between items-center">
              <span>Main road width</span>
              <span>{data?.main_road_width?data?.main_road_width:'-'}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Side road width</span>
              <span>{data?.side_road_width?data?.side_road_width:'-'}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Road wide facing the building</span>
              <span>{data?.road_wide_facing_the_land?data?.road_wide_facing_the_land:'-'}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Mohada</span>
              <span>{data?.mohoda_facing_the_land?data?.mohoda_facing_the_land:'-'}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Road Status</span>
              <span>{data?.status_of_road?data?.status_of_road:'-'}</span>
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
              <span>{data?.geometry_of_land?data?.geometry_of_land:'-'}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Perimeter</span>
              <span>{data?.land_perimeter?data?.land_perimeter:'-'}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Elevation</span>
              <span>{data?.elevation?data?.elevation:'-'}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Status</span>
              <span>{data?.status_of_road?data?.status_of_road:'-'}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="space-y-4 py-5 hidden">
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
              <span>{data?.rent_per_month?data?.rent_per_month:'-'}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Min Lease period</span>
              <span>{'-'}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Min deposit</span>
              <span>{data?.min_deposit?data?.min_deposit:'-'}</span>
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
              <span>{data?.negotiability_min_amount?data?.negotiability_min_amount:'-'}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Max amount</span>
              <span>{data?.negotiability_max_amount?data?.negotiability_max_amount:'-'}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RoadDetails;
