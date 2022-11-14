import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/outline";
import React, { useState } from "react";

const PropertyDemandTable = ({ demands }) => {
  const [seeMore, setSeeMore] = useState(2);
  const [triger, settriger] = useState(false);
  const people = [
    {
      title: "Home",
      location: "Ring Road Area",
      budget: "Rs.1,000,000",
      tenantOption: "Rent/Buy",
      vehicle: "Two wheelers",
      facilities: [
        "Parking availability",
        "Air condition",
        "24/7 Hot water",
        "Spa",
        "Gym",
        "Electricity",
      ],
    },
    {
      title: "Home",
      location: "Ring Road Area",
      budget: "Rs.1,000,000",
      tenantOption: "Rent/Buy",
      vehicle: "Two wheelers",
      facilities: [
        "Parking availability",
        "Air condition",
        "24/7 Hot water",
        "Spa",
        "Gym",
        "Electricity",
      ],
    },
  ];
  return (
    <div className="flex flex-col  sm:-mx-6 lg:-mx-8 -my-2">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="border border-gray-200">
          <div className="overflow-auto  ">
            <table
              className="w-full divide-y divide-gray-200"
              style={{ minWidth: "900px" }}
            >
              <thead className="bg-gray-50">
                <tr className=" ">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Requirement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  whitespace-nowrap">
                    Preffered Location
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  whitespace-nowrap"
                    style={{ width: "200px" }}
                  >
                    Maximum Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  whitespace-nowrap">
                    Tenant Option
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  whitespace-nowrap">
                    Vehicles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  whitespace-nowrap">
                    Facilities
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {demands.map((person, i) => (
                  <tr key={i} className="">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {person.requirement}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.prefered_location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.maximum_budget}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.tenant_option}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.vehicles}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Disclosure>
                        {({ open }) => (
                          <ul className="list-disc">
                            <li>{person?.facilities[0].name}</li>
                            {person?.facilities[1]?.name ? (
                              <li>{person?.facilities[1]?.name}</li>
                            ) : (
                              ""
                            )}

                            {person.facilities.slice(2).map((item, index) => (
                              <Disclosure.Panel
                                key={index}
                                className={`${
                                  open ? "block" : "hidden"
                                } duration-500 `}
                              >
                                <li>{item.name}</li>
                              </Disclosure.Panel>
                            ))}

                            {person.facilities.length > 2 && (
                              <Disclosure.Button className="w-full text-left text-red-700">
                                <span>{open ? "See Less" : "See More"}</span>
                              </Disclosure.Button>
                            )}
                          </ul>
                        )}
                      </Disclosure>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDemandTable;
