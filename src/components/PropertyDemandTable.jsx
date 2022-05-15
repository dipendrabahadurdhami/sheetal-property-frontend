import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/outline";
import React, { useState } from "react";

const PropertyDemandTable = ({demands}) => {

console.log("ASdasd",demands);
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
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden border border-gray-200 ">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="grid grid-cols-6 items-start justify-between">
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Requirement
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Preffered Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Maximum Budget
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tenant Option
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Vehicles
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Facilities
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {demands.map((person,i) => (
                  <tr
                    key={i}
                    className="grid grid-cols-6 justify-between items-start"
                  >
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
                            { person?.facilities[1]?.name ? 
                                 <li>{person?.facilities[1]?.name}</li>
                                 : ""
                            }
                           
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

                            <Disclosure.Button className="w-full text-left text-red-700">
                              <span>{open ? "See Less" : "See More"}</span>
                            </Disclosure.Button>
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
