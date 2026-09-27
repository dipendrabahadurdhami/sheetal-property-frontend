import React from "react";

const ProductMap = ({ latitude, longitude, data }) => {
  const {
    land_according_to_measurements,
    lal_purja,
    finance_bank_name,
    loan_amount,
    class_type,
  } = data;

  const {
    land_area_in_ropani_measurements,
    land_area_in_sqft_measurements,
    land_area_in_meters_measurement,
  } = land_according_to_measurements || {};

  const {
    land_area_in_ropani_lal_purja,
    land_area_in_sqft_lal_purja,
    land_area_in_meters_lal_purja,
  } = lal_purja || {};

  return (
    <div>
      <iframe
        title="map"
        width="100%"
        height={"300px"}
        id="gamp_canvas"
        src={`https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
        frameBorder="1"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        className="relative"
      ></iframe>

      {land_according_to_measurements &&
        land_area_in_meters_measurement &&
        land_area_in_ropani_measurements &&
        land_area_in_sqft_measurements && (
          <div className="space-y-4 py-5">
            <div className="space-y-4">
              <div className="text-red-700 font-medium">Land Area</div>
              <ul className="font-light text-sm space-y-2">
                {land_area_in_ropani_measurements && (
                  <li className="flex justify-between items-center">
                    <span>Land Area in Ropani</span>
                    <span>{land_area_in_ropani_measurements}</span>
                  </li>
                )}
                {land_area_in_sqft_measurements && (
                  <li className="flex justify-between items-center">
                    <span>Land Area in Sqft</span>
                    <span>{land_area_in_sqft_measurements}</span>
                  </li>
                )}
                {land_area_in_meters_measurement && (
                  <li className="flex justify-between items-center">
                    <span>Land Area in Sq.Mt.g</span>
                    <span>{land_area_in_meters_measurement}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

      {lal_purja &&
        land_area_in_meters_lal_purja &&
        land_area_in_ropani_lal_purja &&
        land_area_in_sqft_lal_purja && (
          <div className="space-y-4 py-5">
            <div className="space-y-4">
              <div className="text-red-700 font-medium">
                Land according to Laal purja
              </div>
              <ul className="font-light text-sm space-y-2">
                {land_area_in_ropani_lal_purja && (
                  <li className="flex justify-between items-center">
                    <span>Land Area in Ropani</span>
                    <span>{land_area_in_ropani_lal_purja}</span>
                  </li>
                )}
                {land_area_in_sqft_lal_purja && (
                  <li className="flex justify-between items-center">
                    <span>Land Area in Sqft</span>
                    <span>{land_area_in_sqft_lal_purja}</span>
                  </li>
                )}
                {land_area_in_meters_lal_purja && (
                  <li className="flex justify-between items-center">
                    <span>Land Area in Sq.Mt.g</span>
                    <span>{land_area_in_meters_lal_purja}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

      {(finance_bank_name || loan_amount) && (
        <div className="space-y-4 py-5">
          <div className="space-y-4">
            <div className="text-red-700 font-medium">Current Finance</div>
            <ul className="font-light text-sm space-y-2">
              {finance_bank_name && (
                <li className="flex justify-between items-center">
                  <span>Finance/Bank Name </span>
                  <span>{finance_bank_name}</span>
                </li>
              )}
              {loan_amount && (
                <li className="flex justify-between items-center">
                  <span>Loan Amount</span>
                  <span>{loan_amount}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {class_type && (
        <div className="space-y-4 py-5">
          <div className="space-y-4">
            <div className="text-red-700 font-medium">Class Type</div>
            <ul className="font-light text-sm space-y-2">
              <li className="flex justify-between items-center">
                <span>Class Type</span>
                <span>{class_type}</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMap;
