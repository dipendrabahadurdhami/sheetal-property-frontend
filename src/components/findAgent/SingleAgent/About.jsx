import React from "react";
// const arrayvals = [
//   { BrokerAddress: "Golfutar, Kathmandu" },
//   { CellPhone: "+977 9836473628" },
//   { BrokerPhone: "+977 9836473628" },
//   { Website: "abcd.com" },
//   { ScreenName: "John Gomez" },
//   { MemberSince: "20/12/2022" },
//   { RealEstateLicenses: "12345abc" },
//   { OtherLicenses: "abcd, efgh, ijkl" },
// ];

const arrayvals = [
  "Golfutar, Kathmandu",
  "+977 9836473628",
  "+977 9836473628",
  "abcd.com",
  "John Gomez",
  "20/12/2022",
  "12345abc",
  "abcd, efgh, ijkl",
];

const About = ({data}) => {
  return (
    <div className="space-y-10">
      <div className="text-sm flex flex-col space-y-5">
        <h1 className="text-xl font-medium">About us</h1>
        <div className="space-y-3">
          {/* <p>Realtor-Broker (22 years experience)</p>
          <p>
            Specialties: Buyer's agent, Listing agent, Relocation, Consulting,
            Property Management
          </p> */}
          {/* <p className="text-gray-600">
            For most families, their home is their largest financial asset, and
            deciding to sell it is a big decision that involves a lot of
            preparation and work. When you're ready to sell it's important to
            have an experienced real estate professional handle the details
            involved in the successful sale of a home for top dollar.
          </p> */}
        </div>
      </div>
      <div className="lg:w-2/3 border-t xs:border border-gray-300 xs:rounded py-5 xs:p-5">
        <div className="font-medium text-xl py-5 text-center">
          Professional Information
        </div>
        <ul className="">
            {data.address_1 &&
            <li className="flex flex-wrap text-gray-600 mb-2">
              <div className="w-full md:w-6/12">Broker Address Line 1:</div>
              <div className="w-full md:w-6/12">{data.address_1}</div>
            </li>
            }
            {data.address_2 &&
            <li className="flex flex-wrap text-gray-600 mb-2">
              <div className="w-full md:w-6/12">Broker Address Line 2:</div>
              <div className="w-full md:w-6/12">{data.address_2}</div>
            </li>
            }
            {data.email &&
            <li className="flex flex-wrap text-gray-600 mb-2">
              <div className="w-full md:w-6/12">Email Address:</div>
              <div className="w-full md:w-6/12">{data.email}</div>
            </li>
            }
            {data.mobile &&
            <li className="flex flex-wrap text-gray-600 mb-2">
              <div className="w-full md:w-6/12">Mobile Number:</div>
              <div className="w-full md:w-6/12">{data.mobile}</div>
            </li>
            }
            {data.phone &&
            <li className="flex flex-wrap text-gray-600 mb-2">
              <div className="w-full md:w-6/12">Phone Number:</div>
              <div className="w-full md:w-6/12">{data.phone}</div>
            </li>
            }
            {data.created_at &&
            <li className="flex flex-wrap text-gray-600">
              <div className="w-full md:w-6/12">Member Since:</div>
              <div className="w-full md:w-6/12">{data.created_at}</div>
            </li>
            }      
        </ul>
      </div>
    </div>
  );
};

export default About;
