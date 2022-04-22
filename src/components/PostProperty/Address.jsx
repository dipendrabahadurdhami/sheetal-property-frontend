import React from "react";
import FormikSelect from "./FormikSelect";

const Address = () => {
  return (
    <div className="space-y-5">
      <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5">
        <div className="text-xl font-medium capitalize">Address</div>
        <div className="grid md:grid-cols-2 gap-5">
          <FormikSelect
            containerClassname="space-y-2"
            className="col-span-2 border py-2 px-2"
            name="Property Location"
            label="Property Location"
            placeHolder="Choose your Property Location"
            options={[
              { label: "Enabled", value: "ENABLED" },
              { label: "Disabled", value: "DISABLED" },
            ]}
            isRequired={true}
          />
          <FormikSelect
            containerClassname="space-y-2"
            className="col-span-2 border py-2 px-2"
            name="Country"
            label="Country"
            placeHolder="Choose your Country"
            options={[
              { label: "Enabled", value: "ENABLED" },
              { label: "Disabled", value: "DISABLED" },
            ]}
            isRequired={true}
          />
          <FormikSelect
            containerClassname="space-y-2"
            className="col-span-2 border py-2 px-2"
            name="Zone"
            label="Zone"
            placeHolder="Choose your Zone"
            options={[
              { label: "Enabled", value: "ENABLED" },
              { label: "Disabled", value: "DISABLED" },
            ]}
            isRequired={true}
          />
          <FormikSelect
            containerClassname="space-y-2"
            className="col-span-2 border py-2 px-2"
            name="District "
            label="District "
            placeHolder="Choose your District"
            options={[
              { label: "Enabled", value: "ENABLED" },
              { label: "Disabled", value: "DISABLED" },
            ]}
            isRequired={true}
          />
          <FormikSelect
            containerClassname="space-y-2"
            className="col-span-2 border py-2 px-2"
            name="Town"
            label="Town"
            placeHolder="Choose your Town"
            options={[
              { label: "Enabled", value: "ENABLED" },
              { label: "Disabled", value: "DISABLED" },
            ]}
            isRequired={true}
          />
          <FormikSelect
            containerClassname="space-y-2"
            className="col-span-2 border py-2 px-2"
            name="Place "
            label="Place "
            placeHolder="Choose your Place"
            options={[
              { label: "Enabled", value: "ENABLED" },
              { label: "Disabled", value: "DISABLED" },
            ]}
            isRequired={true}
          />
          <FormikSelect
            containerClassname="space-y-2"
            className="col-span-2 border py-2 px-2"
            name="Street"
            label="Street"
            placeHolder="Choose your Street"
            options={[
              { label: "Enabled", value: "ENABLED" },
              { label: "Disabled", value: "DISABLED" },
            ]}
            isRequired={true}
          />
          <FormikSelect
            containerClassname="space-y-2"
            className="col-span-2 border py-2 px-2"
            name="VDC"
            label="VDC"
            placeHolder="Choose your VDC"
            options={[
              { label: "Enabled", value: "ENABLED" },
              { label: "Disabled", value: "DISABLED" },
            ]}
            isRequired={true}
          />
          <FormikSelect
            containerClassname="space-y-2"
            className="col-span-2 border py-2 px-2"
            name="Ward no"
            label="Ward no"
            placeHolder="Choose your Ward no"
            options={[
              { label: "Enabled", value: "ENABLED" },
              { label: "Disabled", value: "DISABLED" },
            ]}
            isRequired={true}
          />
        </div>
      </div>
      <div className="relative ">
        <iframe
          width="100%"
          height="400"
          id="gmap_canvas"
          src="https://maps.google.com/maps?q=2880%20Broadway,%20New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          className="relative"
        ></iframe>
        <div className="absolute space-x-5 top-3 left-3 bg-transparent rounded shadow z-10 flex items-center">
          <div className="rounded-lg bg-white p-3 text-sm border">
            <button className="pr-5">sjhbdjh</button>
            <button>sjhbdjh</button>
          </div>
          <input
            type={"text"}
            className="bg-white border p-2 rounded shadow"
            placeholder="Enter a location"
          />
        </div>
      </div>
    </div>
  );
};

export default Address;
