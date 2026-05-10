import React, { useCallback, useEffect, useState } from "react";
import apiClient from "../../utils/apiClient";
import AboutProperty from "./AboutProperty";
import Address from "./Address";
import AdvertisementTypes from "./AdvertisementTypes";
import DocumentsTypes from "./DocumentsTypes";
import ExpectedPrice from "./ExpectedPrice";
import Finance from "./Finance";
import LalPurja from "./LalPurja";
import MyProperty from "./MyProperty";
import OtherDetails from "./OtherDetails";
import RoadAccess from "./RoadAccess";
import SalesDetails from "./SalesDetails";
import Uploads from "./Uploads";
import MapWithASearchBox from "../MapWithSearch";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import IconCheckWhite from "../../assets/images/icon-check-white.svg";

const MainComponent = (props) => {
  const [propertyAttributes, setPropertyAtributes] = useState(null);
  const [errors, setErrors] = useState(null);
  const [form, setForm] = useState({
    propertytype_id: null,
    category_id: null,
    class_id: null,
    name: "",
    feature_image: "",
    expiry_date: null,
    interior_looks: [],
    exterior_looks: [],
    property_location: "",
    total_price: "",
    youtube_url: "",
    gallery_images: [],
    property_description: "",

    advertisement_type: "",
    purpose_id: "",
    commission: "",
    owner_info: "",

    property_status: "",
    completion_year: "",
    url: "",
    availability_from: "",

    zone: "",
    district: "",
    town: "",
    tol: "",
    street: "",
    vdc_np_mnp: "",
    ward_no: "",

    anna_price: "",
    sqft_price: "",

    urgency_id: "",
    advance: "",
    selling_price: "",
    rent_per_month: "",
    min_lease: "",
    min_deposit: "",
    broker_response: "",

    property_highlights: "",
    other_description: "",

    location: "",
    lat: "",
    lng: "",

    kitchens: "",
    floors: "",
    bedrooms: "",
    bathrooms: "",
    shutters: "",
    living_room: "",
    rooms_per_floor: "",
    parking: "",
    garage: "",
    size_of_pillars: "",
    no_of_pillars: "",
    source_of_waters: "",
    capacity_of_water_tank: "",

    main_road_width: "",
    side_road_width: "",
    road_wide_facing_the_land: "",
    mohoda_facing_the_land: "",
    status_of_road: "",

    land_area_in_dhur_lal: "",
    land_area_in_anna_lal: "",
    land_area_in_katha_lal: "",
    land_area_in_bigha_lal: "",
    land_area_in_ropani_lal: "",
    land_area_in_sqft_lal: "",
    land_area_in_meters_lal: "",
    geometry_of_land: "",
    elevation: "",

    finance_bank_name: "",
    loan_amount: "",

    documents: [],
  });
  const [loading, setLoading] = useState(false);
  const [advanceOptionEnabled, setAdvanceOptionEnabled] = useState(false);

  useEffect(() => {
    fetchPropertiesAttributes();
  }, []);

  const fetchPropertiesAttributes = async () => {
    try {
      const res = await apiClient.get("/property-attributes");

      if (res.status === 200) {
        // Ensure you are setting the data correctly based on your API structure
        setPropertyAtributes(res.data);
      }
    } catch (error) {
      // Logging the error helps you see if the connection to the DB is broken
      console.error("Error fetching property attributes:", error);
    }
  };
  const handleFormInputChange = (name, value) => {
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  const handleFileInputChange = (name, file) => {
    setForm({
      ...form,
      [name]: file,
    });
  };

  const validate = () => {
    const errors = {};
    if (!form.propertytype_id)
      errors.propertytype_id = "Please select one of property type";
    if (!form.category_id)
      errors.category_id = "Please select one of category type";
    if (!form.class_id) errors.class_id = "Please select one of class type";
    if (!form.name) errors.name = "Please enter property name";
    if (!form.expiry_date) errors.expiry_date = "Please select expiry date";
    if (!form.purpose_id)
      errors.purpose_id = "Please select one of advertisement purpose";
    if (!form.property_location)
      errors.property_location = "Please enter property location";

    if (!form.total_price)
      errors.total_price = "Please enter total price of the property";
    if (form.gallery_images.length === 0)
      errors.gallery_images = "Please add gallery images";
    if (!form.feature_image) errors.feature_image = "Please add feature image";
    if (!form.property_description)
      errors.property_description = "Please enter property description";
    setErrors(errors);
    return errors;
  };

  const mapLocation = useCallback((lat, lng, address) => {
    setForm({
      ...form,
      lat: lat,
      lng: lng,
      location: address,
    });
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const _errors = validate();
    setLoading(true);

    if (_errors && Object.keys(_errors).length > 0) {
      setLoading(false);
      return false;
    }

    try {
      const formData = new FormData();

      // --- Text Fields ---
      formData.append("name", form.name || "");
      formData.append("propertytype_id", form.propertytype_id || "");
      formData.append("category_id", form.category_id || "");
      formData.append("class_id", form.class_id || "");
      formData.append("expiry_date", form.expiry_date || "");
      formData.append("property_location", form.property_location || "");
      formData.append("purpose_id", form.purpose_id || "");
      formData.append("property_description", form.property_description || "");
      formData.append("total_price", parseInt(form.total_price) || 0);

      // --- Multi-Select IDs (Using empty brackets [] for Laravel compatibility) ---
      if (form.exterior_looks) {
        form.exterior_looks.forEach(item => formData.append("exterior_look_id[]", item.id));
      }
      if (form.interior_looks) {
        form.interior_looks.forEach(item => formData.append("interior_look_id[]", item.id));
      }
      if (form.facilities_id) {
        form.facilities_id.forEach(id => formData.append("facilities_id[]", id));
      }

      // --- Other Form Fields ---
      formData.append("advertisement_type", form.advertisement_type || "");
      formData.append("commission", form.commission || "");
      formData.append("owner_info", form.owner_info || "");
      formData.append("property_status", form.property_status || "");
      formData.append("completion_year", form.completion_year || "");
      formData.append("url", form.url || "");
      formData.append("availability_from", form.availability_from || "");
      formData.append("zone", form.zone || "");
      formData.append("district", form.district || "");
      formData.append("town", form.town || "");
      formData.append("tol", form.tol || "");
      formData.append("street", form.street || "");
      formData.append("vdc_np_mnp", form.vdc_np_mnp || "");
      formData.append("ward_no", form.ward_no || "");
      formData.append("anna_price", form.anna_price || 0);
      formData.append("sqft_price", form.sqft_price || 0);
      formData.append("urgency_id", form.urgency_id || "");
      formData.append("advance", form.advance || 0);
      formData.append("selling_price", form.selling_price || 0);
      formData.append("rent_per_month", form.rent_per_month || 0);
      formData.append("min_lease", form.min_lease || "");
      formData.append("min_deposit", form.min_deposit || 0);
      formData.append("broker_response", form.broker_response || "no");
      formData.append("property_highlights", form.property_highlights || "");
      formData.append("other_description", form.other_description || "");
      formData.append("location", form.location || "");
      formData.append("lat", form.lat || "");
      formData.append("lng", form.lng || "");
      formData.append("kitchens", form.kitchens || 0);
      formData.append("floors", form.floors || 0);
      formData.append("bedrooms", form.bedrooms || 0);
      formData.append("bathrooms", form.bathrooms || 0);
      formData.append("shutters", form.shutters || 0);
      formData.append("living_room", form.living_room || 0);
      formData.append("rooms_per_floor", form.rooms_per_floor || 0);
      formData.append("parking", form.parking || 0);
      formData.append("garage", form.garage || 0);
      formData.append("size_of_pillars", form.size_of_pillars || 0);
      formData.append("no_of_pillars", form.no_of_pillars || 0);
      formData.append("capacity_of_water_tank", form.capacity_of_water_tank || "");
      formData.append("source_of_waters", form.source_of_waters || "");
      formData.append("main_road_width", form.main_road_width || "");
      formData.append("side_road_width", form.side_road_width || "");
      formData.append("road_wide_facing_the_land", form.road_wide_facing_the_land || "");
      formData.append("mohoda_facing_the_land", form.mohoda_facing_the_land || "");
      formData.append("status_of_road", form.status_of_road || "");
      formData.append("land_area_in_dhur_lal", form.land_area_in_dhur_lal || 0);
      formData.append("land_area_in_anna_lal", form.land_area_in_anna_lal || 0);
      formData.append("land_area_in_katha_lal", form.land_area_in_katha_lal || 0);
      formData.append("land_area_in_bigha_lal", form.land_area_in_bigha_lal || 0);
      formData.append("land_area_in_ropani_lal", form.land_area_in_ropani_lal || 0);
      formData.append("land_area_in_sqft_lal", form.land_area_in_sqft_lal || 0);
      formData.append("land_area_in_meters_lal", form.land_area_in_meters_lal || 0);
      formData.append("geometry_of_land", form.geometry_of_land || "");
      formData.append("elevation", form.elevation || "");
      formData.append("finance_bank_name", form.finance_bank_name || "");
      formData.append("loan_amount", form.loan_amount || 0);
      formData.append("youtube_url", form.youtube_url || "");

      // --- Images & Documents ---
      if (form.feature_image instanceof File) {
        formData.append("feature_image", form.feature_image);
      }
      if (form.gallery_images) {
        form.gallery_images.forEach((file) => {
          if (file instanceof File) formData.append("gallery_images[]", file);
        });
      }
      if (form.documents) {
        form.documents.forEach((file) => {
          if (file instanceof File) formData.append("documents[]", file);
        });
      }

      // --- API Call (Removed leading slash to prevent VPS redirect) ---
      const res = await apiClient.post("post-property/", formData);

      if (res && res.status === 200) {
        setLoading(false);
        toast.success("Property Successfully added");
        setTimeout(() => { window.location.reload(true); }, 3000);
      } else {
        setLoading(false);
        toast.error("Property Failed to Add");
      }

    } catch (error) {
      setLoading(false);
      let errorMessage = "Something went wrong. Please contact admin";
      if (error?.response?.status === 403) {
        errorMessage = "Your account has been inactivated. Please contact admin.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
      console.error("Submission Error:", error);
    }
  };

return (
  <div>
    <div className="space-y-5">
      <form onSubmit={handleFormSubmit} id="post-property-form">
        <MyProperty
          propertyType={propertyAttributes?.data?.property_types}
          categoryType={propertyAttributes?.data?.categories}
          classType={propertyAttributes?.data?.class_types}
          exteriorLooks={propertyAttributes?.data?.exterior_looks}
          interiorLooks={propertyAttributes?.data?.interior_looks}
          advertisementPurpose={propertyAttributes?.data?.purposes}
          data={form}
          errors={errors}
          onInputChange={handleFormInputChange}
          onFileChange={handleFileInputChange}
        />
        <div
          className="flex items-center mb-16 cursor-pointer"
          onClick={() => setAdvanceOptionEnabled(!advanceOptionEnabled)}
        >
          <div
            className={`border p-3 rounded-sm inline-flex relative ${advanceOptionEnabled
              ? "bg-red-500 border-red-500"
              : " border-gray-300 "
              }`}
          >
            <div className="absolute top-0 left-0 w-full h-full p-1 flex items-center justify-center ">
              <img
                src={IconCheckWhite}
                alt="check"
                className="object-center object-contain w-full"
              />
            </div>
          </div>
          <div
            className={`ml-4 ${advanceOptionEnabled ? "text-gray-600" : "text-gray-400"
              }`}
          >
            Advance Option Enable
          </div>
        </div>
        <div className={`${!advanceOptionEnabled ? "hidden" : "block"}`}>
          <AdvertisementTypes
            advertisementType={propertyAttributes?.data?.advertisement_types}
            advertisementCommission={
              propertyAttributes?.data?.commission_types
            }
            owners={propertyAttributes?.data?.owner_types}
            data={form}
            errors={errors}
            onInputChange={handleFormInputChange}
          />

          <DocumentsTypes
            propertyStatus={propertyAttributes?.data?.property_status}
            completionYear={propertyAttributes?.data?.completion_year}
            url={propertyAttributes?.data?.url}
            availabilityDate={propertyAttributes?.data?.availability_from}
            data={form}
            errors={errors}
            onInputChange={handleFormInputChange}
          />

          <Address
            data={form}
            errors={errors}
            onInputChange={handleFormInputChange}
          />
          <ExpectedPrice
            data={form}
            errors={errors}
            onInputChange={handleFormInputChange}
          />
          <SalesDetails
            urgencies={propertyAttributes?.data?.urgency_types}
            data={form}
            errors={errors}
            onInputChange={handleFormInputChange}
          />
          <AboutProperty
            data={form}
            errors={errors}
            onInputChange={handleFormInputChange}
          />

          <MapWithASearchBox
            google={props?.google}
            center={{ lat: 27.7014202, lng: 85.3128947 }}
            minHeight="300px"
            zoom={15}
            mapLocation={mapLocation}
          />

          <OtherDetails
            data={form}
            errors={errors}
            onInputChange={handleFormInputChange}
          />
          <RoadAccess
            data={form}
            errors={errors}
            onInputChange={handleFormInputChange}
          />
          <LalPurja
            data={form}
            errors={errors}
            onInputChange={handleFormInputChange}
          />
          {/*<LandMeasurements />*/}
          <Finance
            data={form}
            errors={errors}
            onInputChange={handleFormInputChange}
          />

          <Uploads
            data={form}
            errors={errors}
            onInputChange={handleFormInputChange}
          />
        </div>
        <button
          type="submit"
          className="bg-red-700 text-white px-5 py-2 font-medium rounded"
        >
          {loading ? <FaSpinner className="spin" /> : "Submit"}
        </button>
      </form>
    </div>
  </div>
);
};

export default MainComponent;
