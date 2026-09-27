import React, { useCallback, useEffect, useState } from "react";
import apiClient from "../../utils/apiClient";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import MapWithASearchBox from "../MapWithSearch";

// ─── tiny reusable field components ──────────────────────────────────────────
const Field = ({ label, required, hint, error, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Input = ({ name, value, onChange, ...rest }) => (
  <input
    name={name}
    value={value}
    onChange={e => onChange(name, e.target.value)}
    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-400"
    {...rest}
  />
);

const Select = ({ name, value, onChange, options = [], placeholder }) => (
  <select
    name={name}
    value={value}
    onChange={e => onChange(name, e.target.value)}
    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-400"
  >
    <option value="">{placeholder || "-- Select --"}</option>
    {options.map(o => (
      <option key={o.id || o.value} value={o.id || o.value}>{o.name || o.label}</option>
    ))}
  </select>
);

const MultiSelect = ({ name, value = [], onChange, options = [], placeholder }) => {
  const toggle = (id) => {
    const next = value.includes(id) ? value.filter(v => v !== id) : [...value, id];
    onChange(name, next);
  };
  return (
    <div className="border border-gray-300 rounded p-2 max-h-40 overflow-y-auto text-sm">
      {options.length === 0 && <p className="text-gray-400 text-xs p-1">{placeholder || "No options"}</p>}
      {options.map(o => (
        <label key={o.id} className="flex items-center gap-2 p-1 hover:bg-gray-50 cursor-pointer rounded">
          <input
            type="checkbox"
            checked={value.includes(o.id)}
            onChange={() => toggle(o.id)}
            className="accent-red-600"
          />
          <span>{o.name}</span>
        </label>
      ))}
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <div className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-4 mt-6">
    {children}
  </div>
);

const TabBtn = ({ active, done, number, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold border-b-2 transition-all
      ${active ? "border-red-600 text-red-600 bg-red-50" : done ? "border-green-500 text-green-600 bg-green-50" : "border-transparent text-gray-400 bg-white hover:bg-gray-50"}`}
  >
    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
      ${active ? "bg-red-600 text-white" : done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>
      {done ? "✓" : number}
    </span>
    <span className="hidden sm:inline">{label}</span>
  </button>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const MainComponent = () => {
  const [attrs, setAttrs] = useState(null);
  const [tab, setTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Home"); // Home | Land | Apartment
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    // Basic
    name: "", purpose_id: "", propertytype_id: "", total_price: "",
    property_status: "", advertisement_type: "", expiry_date: "",
    availability_from: "", property_highlights: "", property_description: "",
    other_description: "", youtube_url: "",
    // House & Apartment details
    bedrooms: "", bathrooms: "", kitchens: "", living_room: "",
    floors: "", room_per_floor: "", parking: "", garage: "", shutters: "",
    no_of_pillars: "", size_of_pillars: "", completion_year: "",
    capacity_of_water_tank: "", source_of_waters: "", boundry: "",
    apartment_detail: "",
    // Land measurements
    land_area_in_anna_lal: "", land_area_in_ropani_lal: "",
    land_area_in_sqft_lal: "", land_area_in_katha_lal: "",
    land_area_in_bigha_lal: "", land_area_in_dhur_lal: "",
    land_area_in_meters_lal: "", geometry_of_land: "",
    land_facing: "", land_use: "", road_access: "",
    price_per_anna: "", price_per_sqft: "",
    // Road
    main_road_width: "", side_road_width: "", status_of_road: "",
    // Pricing extras
    advance: "", rent_per_month: "", min_deposit: "", selling_price: "",
    commission: "", urgency_id: "", broker_response: "",
    // Finance
    finance_bank_name: "", loan_amount: "",
    // Location
    property_location: "", district: "", town: "", tol: "", street: "",
    ward_no: "", vdc_np_mnp: "", zone: "", lat: "", lng: "", location: "",
    // Owner
    owner_info: "", owner_alternate_phone: "", owner_name: "",
    owner_email: "", owner_type: "", ownership_document: "",
    lal_purja_no: "", company_name: "", company_phone: "", company_address: "",
    // Multi-selects
    facilities_id: [], nearby_facilities: [], interior_look_id: [],
    exterior_look_id: [], environments: [],
    // Files
    feature_image: null, gallery_images: [], owner_documents: [],
  });

  useEffect(() => {
    apiClient.get("/property-attributes").then(r => setAttrs(r.data)).catch(() => {});
  }, []);

  const set = (name, value) => setForm(f => ({ ...f, [name]: value }));

  const mapLocation = useCallback((lat, lng, address) => {
    setForm(f => ({ ...f, lat, lng, location: address }));
  }, []);

  // Gallery helpers
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const addGallery = (files) => {
    const arr = Array.from(files);
    setForm(f => ({ ...f, gallery_images: [...f.gallery_images, ...arr] }));
    setGalleryPreviews(p => [...p, ...arr.map(f => URL.createObjectURL(f))]);
  };
  const removeGallery = (i) => {
    setForm(f => ({ ...f, gallery_images: f.gallery_images.filter((_, idx) => idx !== i) }));
    setGalleryPreviews(p => p.filter((_, idx) => idx !== i));
  };

  // Owner doc helpers
  const [ownerDocPreviews, setOwnerDocPreviews] = useState([]);
  const addOwnerDocs = (files) => {
    const arr = Array.from(files);
    setForm(f => ({ ...f, owner_documents: [...f.owner_documents, ...arr] }));
    setOwnerDocPreviews(p => [...p, ...arr.map(f => f.name)]);
  };
  const removeOwnerDoc = (i) => {
    setForm(f => ({ ...f, owner_documents: f.owner_documents.filter((_, idx) => idx !== i) }));
    setOwnerDocPreviews(p => p.filter((_, idx) => idx !== i));
  };

  const validate = (tabNum) => {
    const e = {};
    if (tabNum === 1) {
      if (!form.name.trim()) e.name = "Property title is required";
      if (!form.purpose_id) e.purpose_id = "Purpose is required";
      if (!form.propertytype_id) e.propertytype_id = "Property type is required";
    }
    if (tabNum === 2 && category === "Home") {
      if (!form.bedrooms) e.bedrooms = "Required";
      if (!form.bathrooms) e.bathrooms = "Required";
      if (!form.floors) e.floors = "Required";
    }
    if (tabNum === 3) {
      if (!form.property_location.trim()) e.property_location = "Location is required";
    }
    if (tabNum === 4) {
      if (!form.feature_image) e.feature_image = "Feature image is required";
    }
    if (tabNum === 5) {
      if (!form.owner_info.trim()) e.owner_info = "Contact number is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goTo = (n) => {
    if (n > tab && !validate(tab)) return;
    setTab(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(5)) return;
    setLoading(true);
    try {
      const fd = new FormData();
      // text fields
      const textFields = [
        "name","purpose_id","propertytype_id","total_price","property_status",
        "advertisement_type","expiry_date","availability_from","property_highlights",
        "property_description","other_description","youtube_url","bedrooms","bathrooms",
        "kitchens","living_room","floors","room_per_floor","parking","garage","shutters",
        "no_of_pillars","size_of_pillars","completion_year","capacity_of_water_tank",
        "source_of_waters","boundry","apartment_detail","land_area_in_anna_lal",
        "land_area_in_ropani_lal","land_area_in_sqft_lal","land_area_in_katha_lal",
        "land_area_in_bigha_lal","land_area_in_dhur_lal","land_area_in_meters_lal",
        "geometry_of_land","land_facing","land_use","road_access","price_per_anna",
        "price_per_sqft","main_road_width","side_road_width","status_of_road",
        "advance","rent_per_month","min_deposit","selling_price","commission",
        "urgency_id","broker_response","finance_bank_name","loan_amount",
        "property_location","district","town","tol","street","ward_no","vdc_np_mnp",
        "zone","lat","lng","location","owner_info","owner_alternate_phone","owner_name",
        "owner_email","owner_type","ownership_document","lal_purja_no","company_name",
        "company_phone","company_address",
      ];
      textFields.forEach(k => fd.append(k, form[k] || ""));
      fd.append("propertycategory", category);
      fd.append("country", "Nepal");
      // multi-selects
      form.facilities_id.forEach(id => fd.append("facilities_id[]", id));
      form.nearby_facilities.forEach(id => fd.append("nearby_facilities[]", id));
      form.interior_look_id.forEach(id => fd.append("interior_look_id[]", id));
      form.exterior_look_id.forEach(id => fd.append("exterior_look_id[]", id));
      form.environments.forEach(id => fd.append("environments[]", id));
      // files
      if (form.feature_image instanceof File) fd.append("feature_image", form.feature_image);
      form.gallery_images.forEach(f => fd.append("gallery_images[]", f));
      form.owner_documents.forEach(f => fd.append("owner_documents[]", f));

      const res = await apiClient.post("post-property/", fd);
      if (res.status === 200) {
        toast.success("Property submitted successfully!");
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.error("Failed to submit property");
      }
    } catch (err) {
      const msg = err?.response?.status === 403
        ? "Your account is inactive. Contact admin."
        : err?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { n: 1, label: "Basic Info" },
    { n: 2, label: category === "Land" ? "Land Details" : "Property Details" },
    { n: 3, label: "Location" },
    { n: 4, label: "Media" },
    { n: 5, label: "Owner" },
  ];

  const a = attrs?.data || {};

  return (
    <div className="max-w-4xl mx-auto">
      {/* Category selector */}
      <div className="flex gap-3 mb-6">
        {[
          { key: "Home", label: "🏠 House" },
          { key: "Land", label: "🌿 Land" },
          { key: "Apartment", label: "🏢 Apartment" },
        ].map(c => (
          <button
            key={c.key}
            type="button"
            onClick={() => { setCategory(c.key); setTab(1); }}
            className={`flex-1 py-3 rounded-lg border-2 font-semibold text-sm transition-all
              ${category === c.key ? "border-red-600 bg-red-50 text-red-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100 rounded mb-0 overflow-hidden">
        <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${(tab / 5) * 100}%` }} />
      </div>

      {/* Tabs */}
      <div className="flex border border-gray-200 rounded-t-lg overflow-hidden mb-6">
        {tabs.map(t => (
          <TabBtn key={t.n} number={t.n} label={t.label} active={tab === t.n} done={tab > t.n} onClick={() => goTo(t.n)} />
        ))}
      </div>

      <form onSubmit={handleSubmit}>

        {/* ── TAB 1: BASIC INFO ── */}
        {tab === 1 && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <SectionTitle>Basic Information</SectionTitle>
              <Field label="Property Title" required error={errors.name}>
                <Input name="name" value={form.name} onChange={set} placeholder="e.g. Beautiful 4BHK House at Baneshwor" />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Purpose" required error={errors.purpose_id}>
                  <Select name="purpose_id" value={form.purpose_id} onChange={set}
                    options={a.purposes || []} placeholder="-- Select Purpose --" />
                </Field>
                <Field label="Property Type" required error={errors.propertytype_id}>
                  <Select name="propertytype_id" value={form.propertytype_id} onChange={set}
                    options={a.property_types || []} placeholder="-- Select Type --" />
                </Field>
                <Field label="Total Price (Rs.)" hint="Leave blank to show 'Contact for Price'">
                  <Input name="total_price" value={form.total_price} onChange={set} type="number" placeholder="e.g. 15000000" />
                </Field>
                <Field label="Property Status">
                  <Select name="property_status" value={form.property_status} onChange={set}
                    options={a.property_status || []} placeholder="-- Select Status --" />
                </Field>
                <Field label="Advertisement Type">
                  <Select name="advertisement_type" value={form.advertisement_type} onChange={set}
                    options={(a.advertisement_types || []).map(t => ({ id: t.slug, name: t.name }))} placeholder="-- Select --" />
                </Field>
                <Field label="Expiry Date">
                  <Input name="expiry_date" value={form.expiry_date} onChange={set} type="date" />
                </Field>
                {(form.purpose_id && (a.purposes || []).find(p => p.id == form.purpose_id && p.name?.toLowerCase().includes("rent"))) && (
                  <Field label="Available From">
                    <Input name="availability_from" value={form.availability_from} onChange={set} type="date" />
                  </Field>
                )}
              </div>
              <Field label="Property Highlights">
                <textarea name="property_highlights" value={form.property_highlights}
                  onChange={e => set("property_highlights", e.target.value)} rows={3}
                  placeholder="Key selling points..."
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
              </Field>
              <Field label="Full Description">
                <textarea name="property_description" value={form.property_description}
                  onChange={e => set("property_description", e.target.value)} rows={5}
                  placeholder="Write a detailed description..."
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
              </Field>
              <Field label="Other Notes">
                <textarea name="other_description" value={form.other_description}
                  onChange={e => set("other_description", e.target.value)} rows={3}
                  placeholder="Any additional notes..."
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
              </Field>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => goTo(2)}
                className="bg-red-700 text-white px-6 py-2 rounded font-medium text-sm">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 2: PROPERTY DETAILS ── */}
        {tab === 2 && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">

              {/* HOUSE */}
              {category === "Home" && (
                <>
                  <SectionTitle>Room Information</SectionTitle>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Field label="Bedrooms" required error={errors.bedrooms}>
                      <Input name="bedrooms" value={form.bedrooms} onChange={set} type="number" placeholder="0" />
                    </Field>
                    <Field label="Bathrooms" required error={errors.bathrooms}>
                      <Input name="bathrooms" value={form.bathrooms} onChange={set} type="number" placeholder="0" />
                    </Field>
                    <Field label="Kitchens">
                      <Input name="kitchens" value={form.kitchens} onChange={set} type="number" placeholder="0" />
                    </Field>
                    <Field label="Living Rooms">
                      <Input name="living_room" value={form.living_room} onChange={set} type="number" placeholder="0" />
                    </Field>
                    <Field label="Floors" required error={errors.floors}>
                      <Input name="floors" value={form.floors} onChange={set} type="number" placeholder="0" />
                    </Field>
                    <Field label="Rooms/Floor">
                      <Input name="room_per_floor" value={form.room_per_floor} onChange={set} type="number" placeholder="0" />
                    </Field>
                    <Field label="Parking">
                      <Input name="parking" value={form.parking} onChange={set} type="number" placeholder="0" />
                    </Field>
                    <Field label="Garage">
                      <Input name="garage" value={form.garage} onChange={set} type="number" placeholder="0" />
                    </Field>
                  </div>
                  <SectionTitle>Land & Structure</SectionTitle>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Field label="Anna"><Input name="land_area_in_anna_lal" value={form.land_area_in_anna_lal} onChange={set} type="number" step="0.01" placeholder="0.00" /></Field>
                    <Field label="Ropani"><Input name="land_area_in_ropani_lal" value={form.land_area_in_ropani_lal} onChange={set} type="number" step="0.01" placeholder="0.00" /></Field>
                    <Field label="Sqft"><Input name="land_area_in_sqft_lal" value={form.land_area_in_sqft_lal} onChange={set} type="number" step="0.01" placeholder="0.00" /></Field>
                    <Field label="Katha"><Input name="land_area_in_katha_lal" value={form.land_area_in_katha_lal} onChange={set} type="number" step="0.01" placeholder="0.00" /></Field>
                    <Field label="No. of Pillars"><Input name="no_of_pillars" value={form.no_of_pillars} onChange={set} type="number" placeholder="0" /></Field>
                    <Field label="Size of Pillars"><Input name="size_of_pillars" value={form.size_of_pillars} onChange={set} type="number" step="0.01" placeholder="0.00" /></Field>
                    <Field label="Boundary"><Input name="boundry" value={form.boundry} onChange={set} placeholder="e.g. Brick wall" /></Field>
                    <Field label="Completion Year"><Input name="completion_year" value={form.completion_year} onChange={set} placeholder="e.g. 2022" /></Field>
                  </div>
                </>
              )}

              {/* APARTMENT */}
              {category === "Apartment" && (
                <>
                  <SectionTitle>Room Information</SectionTitle>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Field label="Bedrooms" required error={errors.bedrooms}>
                      <Input name="bedrooms" value={form.bedrooms} onChange={set} type="number" placeholder="0" />
                    </Field>
                    <Field label="Bathrooms" required error={errors.bathrooms}>
                      <Input name="bathrooms" value={form.bathrooms} onChange={set} type="number" placeholder="0" />
                    </Field>
                    <Field label="Kitchens">
                      <Input name="kitchens" value={form.kitchens} onChange={set} type="number" placeholder="0" />
                    </Field>
                    <Field label="Living Rooms">
                      <Input name="living_room" value={form.living_room} onChange={set} type="number" placeholder="0" />
                    </Field>
                    <Field label="Floors" required error={errors.floors}>
                      <Input name="floors" value={form.floors} onChange={set} type="number" placeholder="0" />
                    </Field>
                    <Field label="Rooms/Floor">
                      <Input name="room_per_floor" value={form.room_per_floor} onChange={set} type="number" placeholder="0" />
                    </Field>
                    <Field label="Parking">
                      <Input name="parking" value={form.parking} onChange={set} type="number" placeholder="0" />
                    </Field>
                    <Field label="Shutters">
                      <Input name="shutters" value={form.shutters} onChange={set} type="number" placeholder="0" />
                    </Field>
                  </div>
                  <SectionTitle>Apartment Area</SectionTitle>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Field label="Sqft"><Input name="land_area_in_sqft_lal" value={form.land_area_in_sqft_lal} onChange={set} type="number" step="0.01" placeholder="0.00" /></Field>
                    <Field label="Meters"><Input name="land_area_in_meters_lal" value={form.land_area_in_meters_lal} onChange={set} type="number" step="0.01" placeholder="0.00" /></Field>
                    <Field label="No. of Pillars"><Input name="no_of_pillars" value={form.no_of_pillars} onChange={set} type="number" placeholder="0" /></Field>
                    <Field label="Size of Pillars"><Input name="size_of_pillars" value={form.size_of_pillars} onChange={set} type="number" step="0.01" placeholder="0.00" /></Field>
                    <Field label="Apartment Detail"><Input name="apartment_detail" value={form.apartment_detail} onChange={set} placeholder="e.g. 3rd floor" /></Field>
                    <Field label="Completion Year"><Input name="completion_year" value={form.completion_year} onChange={set} placeholder="e.g. 2022" /></Field>
                    <Field label="Water Tank Capacity"><Input name="capacity_of_water_tank" value={form.capacity_of_water_tank} onChange={set} placeholder="e.g. 1000L" /></Field>
                    <Field label="Source of Water"><Input name="source_of_waters" value={form.source_of_waters} onChange={set} placeholder="e.g. Municipality" /></Field>
                  </div>
                </>
              )}

              {/* LAND */}
              {category === "Land" && (
                <>
                  <SectionTitle>Land Area</SectionTitle>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <Field label="Anna"><Input name="land_area_in_anna_lal" value={form.land_area_in_anna_lal} onChange={set} type="number" step="0.01" placeholder="0.00" /></Field>
                    <Field label="Ropani"><Input name="land_area_in_ropani_lal" value={form.land_area_in_ropani_lal} onChange={set} type="number" step="0.01" placeholder="0.00" /></Field>
                    <Field label="Sqft"><Input name="land_area_in_sqft_lal" value={form.land_area_in_sqft_lal} onChange={set} type="number" step="0.01" placeholder="0.00" /></Field>
                    <Field label="Katha"><Input name="land_area_in_katha_lal" value={form.land_area_in_katha_lal} onChange={set} type="number" step="0.01" placeholder="0.00" /></Field>
                    <Field label="Bigha"><Input name="land_area_in_bigha_lal" value={form.land_area_in_bigha_lal} onChange={set} type="number" step="0.01" placeholder="0.00" /></Field>
                    <Field label="Dhur"><Input name="land_area_in_dhur_lal" value={form.land_area_in_dhur_lal} onChange={set} type="number" step="0.01" placeholder="0.00" /></Field>
                  </div>
                  <SectionTitle>Land Details</SectionTitle>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <Field label="Land Facing">
                      <Select name="land_facing" value={form.land_facing} onChange={set}
                        options={[{id:"East",name:"East"},{id:"West",name:"West"},{id:"North",name:"North"},{id:"South",name:"South"},{id:"North-East",name:"North-East"},{id:"North-West",name:"North-West"},{id:"South-East",name:"South-East"},{id:"South-West",name:"South-West"}]}
                        placeholder="-- Select --" />
                    </Field>
                    <Field label="Land Use">
                      <Select name="land_use" value={form.land_use} onChange={set}
                        options={[{id:"Residential",name:"Residential"},{id:"Commercial",name:"Commercial"},{id:"Agricultural",name:"Agricultural"},{id:"Industrial",name:"Industrial"}]}
                        placeholder="-- Select --" />
                    </Field>
                    <Field label="Geometry of Land"><Input name="geometry_of_land" value={form.geometry_of_land} onChange={set} placeholder="e.g. Rectangular" /></Field>
                    <Field label="Road Access"><Input name="road_access" value={form.road_access} onChange={set} placeholder="e.g. Yes / No" /></Field>
                    <Field label="Boundary"><Input name="boundry" value={form.boundry} onChange={set} placeholder="e.g. Brick wall" /></Field>
                    <Field label="Ownership Document"><Input name="ownership_document" value={form.ownership_document} onChange={set} placeholder="e.g. Lal Purja" /></Field>
                    <Field label="Lal Purja No."><Input name="lal_purja_no" value={form.lal_purja_no} onChange={set} placeholder="e.g. 12345" /></Field>
                  </div>
                  <SectionTitle>Pricing</SectionTitle>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <Field label="Price per Anna"><Input name="price_per_anna" value={form.price_per_anna} onChange={set} type="number" placeholder="Rs." /></Field>
                    <Field label="Price per Sqft"><Input name="price_per_sqft" value={form.price_per_sqft} onChange={set} type="number" placeholder="Rs." /></Field>
                    <Field label="Commission">
                      <Select name="commission" value={form.commission} onChange={set}
                        options={a.commission_types || []} placeholder="-- Select --" />
                    </Field>
                    <Field label="Urgency">
                      <Select name="urgency_id" value={form.urgency_id} onChange={set}
                        options={a.urgency_types || []} placeholder="-- Select --" />
                    </Field>
                  </div>
                </>
              )}

              {/* Road — shared by House and Apartment */}
              {category !== "Land" && (
                <>
                  <SectionTitle>Road & Access</SectionTitle>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <Field label="Main Road Width"><Input name="main_road_width" value={form.main_road_width} onChange={set} placeholder="e.g. 20 ft" /></Field>
                    <Field label="Side Road Width"><Input name="side_road_width" value={form.side_road_width} onChange={set} placeholder="e.g. 10 ft" /></Field>
                    <Field label="Status of Road"><Input name="status_of_road" value={form.status_of_road} onChange={set} placeholder="e.g. Black top" /></Field>
                  </div>
                </>
              )}

              {/* Features — shared by all */}
              <SectionTitle>Features & Amenities</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Facilities">
                  <MultiSelect name="facilities_id" value={form.facilities_id} onChange={set} options={a.facilities || []} />
                </Field>
                <Field label="Nearby Facilities">
                  <MultiSelect name="nearby_facilities" value={form.nearby_facilities} onChange={set} options={a.nearby_facilities || []} />
                </Field>
                <Field label="Interior Look">
                  <MultiSelect name="interior_look_id" value={form.interior_look_id} onChange={set} options={a.interior_looks || []} />
                </Field>
                <Field label="Exterior Look">
                  <MultiSelect name="exterior_look_id" value={form.exterior_look_id} onChange={set} options={a.exterior_looks || []} />
                </Field>
                <Field label="Environments">
                  <MultiSelect name="environments" value={form.environments} onChange={set} options={a.environments || []} />
                </Field>
              </div>

              {/* Pricing extras — House & Apartment */}
              {category !== "Land" && (
                <>
                  <SectionTitle>Pricing Details</SectionTitle>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Field label="Advance"><Input name="advance" value={form.advance} onChange={set} placeholder="Rs." /></Field>
                    <Field label="Rent/Month"><Input name="rent_per_month" value={form.rent_per_month} onChange={set} placeholder="Rs." /></Field>
                    <Field label="Min Deposit"><Input name="min_deposit" value={form.min_deposit} onChange={set} placeholder="Rs." /></Field>
                    <Field label="Selling Price"><Input name="selling_price" value={form.selling_price} onChange={set} placeholder="Rs." /></Field>
                    <Field label="Commission">
                      <Select name="commission" value={form.commission} onChange={set} options={a.commission_types || []} placeholder="-- Select --" />
                    </Field>
                    <Field label="Urgency">
                      <Select name="urgency_id" value={form.urgency_id} onChange={set} options={a.urgency_types || []} placeholder="-- Select --" />
                    </Field>
                  </div>
                  <SectionTitle>Finance</SectionTitle>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Bank Name"><Input name="finance_bank_name" value={form.finance_bank_name} onChange={set} placeholder="e.g. NMB Bank" /></Field>
                    <Field label="Loan Amount"><Input name="loan_amount" value={form.loan_amount} onChange={set} placeholder="Rs." /></Field>
                  </div>
                </>
              )}

              <SectionTitle>Other</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="YouTube URL"><Input name="youtube_url" value={form.youtube_url} onChange={set} placeholder="https://youtube.com/watch?v=..." /></Field>
                <Field label="Broker Response">
                  <Select name="broker_response" value={form.broker_response} onChange={set}
                    options={[{id:"yes",name:"Yes"},{id:"no",name:"No"}]} placeholder="-- Select --" />
                </Field>
              </div>
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={() => goTo(1)} className="border border-gray-300 px-6 py-2 rounded text-sm">← Back</button>
              <button type="button" onClick={() => goTo(3)} className="bg-red-700 text-white px-6 py-2 rounded font-medium text-sm">Next →</button>
            </div>
          </div>
        )}

        {/* ── TAB 3: LOCATION ── */}
        {tab === 3 && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <SectionTitle>Location Details</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Property Location" required error={errors.property_location}>
                  <Input name="property_location" value={form.property_location} onChange={set} placeholder="e.g. Baneshwor, Kathmandu" />
                </Field>
                <Field label="District"><Input name="district" value={form.district} onChange={set} placeholder="e.g. Kathmandu" /></Field>
                <Field label="Town / Area"><Input name="town" value={form.town} onChange={set} placeholder="e.g. Baneshwor" /></Field>
                <Field label="Tol"><Input name="tol" value={form.tol} onChange={set} placeholder="Tol name" /></Field>
                <Field label="Street"><Input name="street" value={form.street} onChange={set} placeholder="Street name" /></Field>
                <Field label="Ward No"><Input name="ward_no" value={form.ward_no} onChange={set} placeholder="e.g. 10" /></Field>
                <Field label="VDC / NP / MNP"><Input name="vdc_np_mnp" value={form.vdc_np_mnp} onChange={set} placeholder="Municipality name" /></Field>
                <Field label="Zone"><Input name="zone" value={form.zone} onChange={set} placeholder="e.g. Bagmati" /></Field>
              </div>
              <div className="mt-4">
                <MapWithASearchBox
                  center={{ lat: 27.7014202, lng: 85.3128947 }}
                  minHeight="300px"
                  zoom={15}
                  mapLocation={mapLocation}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={() => goTo(2)} className="border border-gray-300 px-6 py-2 rounded text-sm">← Back</button>
              <button type="button" onClick={() => goTo(4)} className="bg-red-700 text-white px-6 py-2 rounded font-medium text-sm">Next →</button>
            </div>
          </div>
        )}

        {/* ── TAB 4: MEDIA ── */}
        {tab === 4 && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <SectionTitle>Feature Image *</SectionTitle>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors"
                onClick={() => document.getElementById("feature_img_input").click()}
              >
                {form.feature_image ? (
                  <img src={URL.createObjectURL(form.feature_image)} alt="feature"
                    className="max-h-48 mx-auto rounded" />
                ) : (
                  <>
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-sm text-gray-500">Click to upload feature image</p>
                    <p className="text-xs text-gray-400">JPG, PNG — Max 10MB — Recommended 940×500px</p>
                  </>
                )}
              </div>
              <input id="feature_img_input" type="file" accept="image/*" className="hidden"
                onChange={e => set("feature_image", e.target.files[0])} />
              {errors.feature_image && <p className="text-red-500 text-xs mt-1">{errors.feature_image}</p>}

              <SectionTitle>Gallery Images</SectionTitle>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
                {galleryPreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded overflow-hidden bg-gray-100">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeGallery(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      ×
                    </button>
                  </div>
                ))}
                <div
                  className="aspect-square border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors"
                  onClick={() => document.getElementById("gallery_input").click()}
                >
                  <span className="text-2xl text-gray-400">+</span>
                </div>
              </div>
              <input id="gallery_input" type="file" accept="image/*" multiple className="hidden"
                onChange={e => addGallery(e.target.files)} />
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={() => goTo(3)} className="border border-gray-300 px-6 py-2 rounded text-sm">← Back</button>
              <button type="button" onClick={() => goTo(5)} className="bg-red-700 text-white px-6 py-2 rounded font-medium text-sm">Next →</button>
            </div>
          </div>
        )}

        {/* ── TAB 5: OWNER DETAILS ── */}
        {tab === 5 && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <SectionTitle>Primary Contact</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Contact Number" required error={errors.owner_info} hint="Primary contact shown to buyers/renters">
                  <Input name="owner_info" value={form.owner_info} onChange={set} placeholder="e.g. 9841000000" />
                </Field>
                <Field label="Alternate Phone">
                  <Input name="owner_alternate_phone" value={form.owner_alternate_phone} onChange={set} placeholder="e.g. 9851000000" />
                </Field>
                <Field label="Owner Name">
                  <Input name="owner_name" value={form.owner_name} onChange={set} placeholder="Full name" />
                </Field>
                <Field label="Owner Email">
                  <Input name="owner_email" value={form.owner_email} onChange={set} type="email" placeholder="owner@example.com" />
                </Field>
                <Field label="Owner Type">
                  <Select name="owner_type" value={form.owner_type} onChange={set}
                    options={a.owner_types || []} placeholder="-- Select Owner Type --" />
                </Field>
                <Field label="Broker Response">
                  <div className="flex gap-6 pt-2">
                    {["yes", "no"].map(v => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer text-sm">
                        <input type="radio" name="broker_response" value={v}
                          checked={form.broker_response === v}
                          onChange={() => set("broker_response", v)}
                          className="accent-red-600" />
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </label>
                    ))}
                  </div>
                </Field>
              </div>

              <SectionTitle>Ownership Documents</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Document Type">
                  <Input name="ownership_document" value={form.ownership_document} onChange={set} placeholder="e.g. Lal Purja, Blue Book" />
                </Field>
                <Field label="Lal Purja No.">
                  <Input name="lal_purja_no" value={form.lal_purja_no} onChange={set} placeholder="e.g. 12345" />
                </Field>
              </div>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-red-400 transition-colors mb-2"
                onClick={() => document.getElementById("owner_doc_input").click()}
              >
                <p className="text-sm text-gray-500">Click to upload ownership documents</p>
                <p className="text-xs text-gray-400">PDF, JPG, PNG</p>
              </div>
              <input id="owner_doc_input" type="file" accept=".pdf,image/*" multiple className="hidden"
                onChange={e => addOwnerDocs(e.target.files)} />
              {ownerDocPreviews.map((name, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm mb-1">
                  <span className="flex-1 truncate">{name}</span>
                  <button type="button" onClick={() => removeOwnerDoc(i)} className="text-red-500 text-xs">Remove</button>
                </div>
              ))}

              <SectionTitle>Company / Agency</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Company Name"><Input name="company_name" value={form.company_name} onChange={set} placeholder="e.g. ABC Realty" /></Field>
                <Field label="Company Phone"><Input name="company_phone" value={form.company_phone} onChange={set} placeholder="e.g. 01-4000000" /></Field>
                <Field label="Company Address"><Input name="company_address" value={form.company_address} onChange={set} placeholder="e.g. New Baneshwor" /></Field>
              </div>
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={() => goTo(4)} className="border border-gray-300 px-6 py-2 rounded text-sm">← Back</button>
              <button type="submit" disabled={loading}
                className="bg-green-700 text-white px-8 py-2 rounded font-medium text-sm flex items-center gap-2 disabled:opacity-60">
                {loading ? <><FaSpinner className="animate-spin" /> Saving...</> : "✓ Submit Property"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MainComponent;