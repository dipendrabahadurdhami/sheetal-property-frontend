import React from "react";

const RoadDetails = ({ data }) => {
  const {
    main_road_width,
    side_road_width,
    road_wide_facing_the_land,
    mohoda_facing_the_land,
    geometry_of_land,
    land_perimeter,
    elevation,
    status_of_road,
  } = data || {};

  if (
    main_road_width ||
    side_road_width ||
    road_wide_facing_the_land ||
    mohoda_facing_the_land ||
    geometry_of_land ||
    land_perimeter ||
    elevation ||
    status_of_road
  ) {
    return (
      <div>
        {(main_road_width ||
          side_road_width ||
          road_wide_facing_the_land ||
          mohoda_facing_the_land ||
          status_of_road) && (
          <div className="space-y-4 py-5">
            <div className="space-y-4">
              <div className="text-red-700 font-medium">Road Details</div>
              <ul className="font-light text-sm space-y-2">
                {main_road_width && (
                  <li className="flex justify-between items-center">
                    <span>Main road width</span>
                    <span>{main_road_width}</span>
                  </li>
                )}
                {side_road_width && (
                  <li className="flex justify-between items-center">
                    <span>Side road width</span>
                    <span>{side_road_width}</span>
                  </li>
                )}
                {road_wide_facing_the_land && (
                  <li className="flex justify-between items-center">
                    <span>Road wide facing the building</span>
                    <span>{road_wide_facing_the_land}</span>
                  </li>
                )}
                {mohoda_facing_the_land && (
                  <li className="flex justify-between items-center">
                    <span>Mohada</span>
                    <span>{mohoda_facing_the_land}</span>
                  </li>
                )}
                {status_of_road && (
                  <li className="flex justify-between items-center">
                    <span>Road Status</span>
                    <span>{status_of_road}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
        {(geometry_of_land ||
          land_perimeter ||
          elevation ||
          status_of_road) && (
          <div className="space-y-4 py-5">
            <div className="space-y-4">
              <div className="text-red-700 font-medium">Land Details</div>
              <ul className="font-light text-sm space-y-2">
                {geometry_of_land && (
                  <li className="flex justify-between items-center">
                    <span>Geometry</span>
                    <span>{geometry_of_land}</span>
                  </li>
                )}
                {land_perimeter && (
                  <li className="flex justify-between items-center">
                    <span>Perimeter</span>
                    <span>{land_perimeter}</span>
                  </li>
                )}
                {elevation && (
                  <li className="flex justify-between items-center">
                    <span>Elevation</span>
                    <span>{elevation}</span>
                  </li>
                )}
                {status_of_road && (
                  <li className="flex justify-between items-center">
                    <span>Status</span>
                    <span>{status_of_road}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default RoadDetails;
