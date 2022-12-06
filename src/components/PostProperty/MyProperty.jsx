import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TagsInput from "../TagsInput";
import closeIcon from "../../assets/images/icon-close.svg";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const PropertyTypeItem = ({ id, item, selected, action, onSelectAction }) => {
  const handleSelect = () => {
    action(item);
  };

  const onInputChange = (value) => {
    onSelectAction("propertytype_id", value);
  };
  return (
    <label
      className={`flex items-center border border-gray-300 px-4 py-2 rounded cursor-pointer ${
        selected === item.id
          ? "bg-red-500 border-red-500 text-white font-medium"
          : "bg-white border-gray-300 font-light "
      }`}
      htmlFor={"my-property-" + id}
      onClick={(e) => {
        handleSelect();
        onInputChange(item.id);
      }}
    >
      <input
        type={"radio"}
        id={"my-property-" + id}
        name="propertytype_id"
        className="border-red-500 w-4 h-4 opacity-0 absolute left-0"
        checked={selected === item.id}
        onChange={() => {}}
      />

      <span className="block">{item.name}</span>
    </label>
  );
};
const MyProperty = ({
  propertyType,
  advertisementPurpose,
  categoryType,
  classType,
  errors,
  data,
  onInputChange,
  exteriorLooks,
  interiorLooks,
}) => {
  const [selected, setSelected] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [thumbnailGalleries, setThumbnailGalleries] = useState([]);
  const [feature, setFeature] = useState(0);

  const [propertyDescription, setPropertyDescription] = useState(() =>
    EditorState.createEmpty()
  );

  const onGalleryImageChanges = (name, e) => {
    e.preventDefault();
    let thumbnails = [];
    let mainImages = [];
    const files = e.target.files;
    let i = 0;
    while (i < files.length) {
      // let images = thumbnailGalleries;
      // var reader = new FileReader();
      thumbnails.push(URL.createObjectURL(files[i]));
      mainImages.push(files[i]);
      i++;
    }
    onInputChange("feature_image", e.target.files[0]);

    setThumbnailGalleries(thumbnails);
    setGalleries(mainImages);
    onInputChange("gallery_images", mainImages);
  };
  const deleteGalleryImage = (index) => {
    const thumbs = thumbnailGalleries.filter((thumb, i) => i !== index);
    const _galleries = galleries.filter((image, i) => i !== index);
    setThumbnailGalleries(thumbs);
    setGalleries(_galleries);
    onInputChange("gallery_images", _galleries);
    // }
  };

  const onSetFeaturedImage = (index) => {
    setFeature(index);
  };

  const handleSelectedItem = (item) => {
    setSelected(item.id);
  };
  const onFormInputChange = (name, value) => {
    onInputChange(name, value);
  };

  // const onFeatureImageChange = (name,e)=>{
  //   e.preventDefault();

  //   var reader = new FileReader();
  //   reader.readAsDataURL(e.target.files[0]);
  //   reader.onloadend = function (e) {
  //     setImage(reader.result)
  //   }
  //   onFileChange(name,e.target.files[0])
  // }

  const onExteriorChange = (value) => {
    onInputChange("exterior_looks", value);
  };

  const onInteriorChange = (value) => {
    onInputChange("interior_looks", value);
  };

  const onPropertyDescription = (html) => {
    const htmls = convertToHTML(html?.getCurrentContent());
    onInputChange("property_description", htmls);
    setPropertyDescription(html);
  };

  useEffect(() => {
    if (galleries.length > 0) {
      onInputChange("feature_image", galleries[feature]);
    } else {
      onInputChange("feature_image", "");
    }

    // eslint-disable-next-line
  }, [feature, galleries]);

  return (
    <div className="sm:p-5 sm:border rounded-lg mb-6">
      <div className="text-xl font-medium mb-6">My property is : </div>
      <div className="form-group mb-4">
        <div className="flex items-center flex-wrap  -mx-2">
          {propertyType &&
            propertyType.map((item, i) => {
              return (
                <div className="px-2 py-2" key={i}>
                  <PropertyTypeItem
                    id={i}
                    item={item}
                    selected={selected}
                    action={handleSelectedItem}
                    onSelectAction={onInputChange}
                  />
                </div>
              );
            })}
        </div>

        {errors && errors?.propertytype_id && (
          <p className="text-red-500 text-sm">{errors?.propertytype_id}</p>
        )}
      </div>
      {/* /.form-group */}

      <div className="w-full mb-4">
        <label className="block mb-2">Property Name</label>
        <input
          placeholder="Enter your property name"
          className="w-full  px-2 border border-gray-300 rounded text-md mb-2"
          name="propertyName"
          style={{ height: "50px" }}
          onChange={(e) => onFormInputChange("name", e.target.value)}
        />
        {errors && errors?.name && (
          <p className="text-red-500 text-sm">{errors?.name}</p>
        )}
      </div>

      <div className="flex flex-wrap justify-between -mx-2 mb-6">
        <div className="px-2  w-full lg:w-6/12  form-group">
          <label className="block mb-2">Category Type</label>
          <select
            className="border px-2  w-full rounded text-md mb-2"
            name="category_id"
            style={{ height: "50px" }}
            onChange={(e) => onFormInputChange("category_id", e.target.value)}
          >
            <option value="">Choose your Category type</option>
            {categoryType &&
              categoryType.map((item, i) => {
                return (
                  <option value={item.id} key={i}>
                    {item.name}
                  </option>
                );
              })}
          </select>
          {errors && errors?.category_id && (
            <p className="text-red-500 text-sm">{errors?.category_id}</p>
          )}
        </div>

        <div className="px-2  w-full lg:w-6/12  form-group mb-4">
          <label className="block mb-2">Class Type</label>
          <select
            className="border px-2  w-full rounded text-md mb-2"
            name="class_id"
            style={{ height: "50px" }}
            onChange={(e) => onFormInputChange("class_id", e.target.value)}
          >
            <option value="">Choose your Class type</option>
            {classType &&
              classType.map((item, i) => {
                return (
                  <option value={item.id} key={i}>
                    {item.name}
                  </option>
                );
              })}
          </select>
          {errors && errors?.class_id && (
            <p className="text-red-500 text-sm">{errors?.class_id}</p>
          )}
        </div>

        <div className="px-2  w-full lg:w-6/12  form-group mb-4">
          <label className="block mb-2">Expiry Date</label>
          <input
            type="date"
            placeholder="dd/mm/yyyy"
            className="w-full  px-2 border border-gray-300 rounded text-md mb-2"
            name="expiry_date"
            style={{ height: "50px" }}
            value={data.expiry_date}
            onChange={(e) => onFormInputChange("expiry_date", e.target.value)}
          />
          {errors && errors?.expiry_date && (
            <p className="text-red-500 text-sm">{errors?.expiry_date}</p>
          )}
        </div>
        <div className="px-2  w-full lg:w-6/12  form-group mb-4">
          <label className="block mb-2">Property Location</label>
          <input
            type="text"
            placeholder="Basundhara 03, Kathmandu"
            className="w-full  px-2 border border-gray-300 rounded text-md mb-2"
            name="property_location"
            style={{ height: "50px" }}
            value={data.property_location}
            onChange={(e) =>
              onFormInputChange("property_location", e.target.value)
            }
          />
          {errors && errors?.property_location && (
            <p className="text-red-500 text-sm">{errors?.property_location}</p>
          )}
        </div>

        <div className="px-2  w-full lg:w-6/12  form-group mb-4">
          <label className="block mb-2">Total Price (NRS)</label>
          <input
            type="text"
            placeholder=""
            className="w-full  px-2 border border-gray-300 rounded text-md mb-2"
            name="total_price"
            style={{ height: "50px" }}
            value={data.total_price}
            onChange={(e) => onFormInputChange("total_price", e.target.value)}
          />
          {errors && errors?.total_price && (
            <p className="text-red-500 text-sm">{errors?.total_price}</p>
          )}
        </div>

        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Exterior Looks</label>
          <TagsInput tags={exteriorLooks} onTagSelected={onExteriorChange} />
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Interior Looks</label>
          <TagsInput tags={interiorLooks} onTagSelected={onInteriorChange} />
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-6/12  form-group  mb-6">
          <label className="block mb-2">Advertisement Purpose</label>
          <select
            className="border px-2  w-full rounded text-md mb-2"
            name="purpose_id"
            style={{ height: "50px" }}
            onChange={(e) => onFormInputChange("purpose_id", e.target.value)}
          >
            <option value="">Choose your advertisement purpose</option>
            {advertisementPurpose &&
              advertisementPurpose.map((item, i) => {
                return (
                  <option
                    value={item.id}
                    key={i}
                    selected={data.purpose_id === item.id ? "selected" : ""}
                  >
                    {item.name}
                  </option>
                );
              })}
          </select>
          {errors && errors?.purpose_id && (
            <p className="text-red-500 text-sm">{errors?.purpose_id}</p>
          )}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-6/12  form-group  mb-6">
          <div>
            Gallery Images{" "}
            <span className="text-xs italic">(Please upload all at once.)</span>
          </div>
          <div className="flex items-center flex-wrap -mx-2">
            {thumbnailGalleries &&
              thumbnailGalleries.map((item, i) => {
                return (
                  <div className="px-2 mb-4 relative" key={i}>
                    <span
                      className="p-1 bg-red-500 rounded-full inline-block absolute cursor-pointer hover:opacity-90 right-0 -top-2 z-10"
                      onClick={() => deleteGalleryImage(i)}
                    >
                      <img src={closeIcon} alt="Close" width="10" />
                    </span>
                    <div
                      className={`bg-gray-300 relative border border-gray-300 overflow-hidden ${
                        feature === i ? "border-4 border-blue-300" : ""
                      }`}
                      style={{
                        borderRadius: "4px",
                        height: "100px",
                        width: "100px",
                      }}
                      onClick={() => onSetFeaturedImage(i)}
                    >
                      <img
                        src={item}
                        alt=""
                        width="100"
                        className="absolute top-0 left-0 h-full w-full object-cover object-center"
                      />
                    </div>
                  </div>
                );
              })}

            <div className={`c-single-image-block small px-2 mb-4`}>
              <input
                type="file"
                accept="image/*"
                id="gallery_images"
                name="gallery_images"
                onChange={(e) => onGalleryImageChanges("gallery_images", e)}
                multiple
              />
              <label htmlFor="gallery_images">
                <span className="image overflow-hidden">
                  {/* {image?<img src={image} alt={"image"} className="absolute top-0 left-0 h-full w-full object-cover object-center"/>:''} */}
                </span>
                <span className="text">Click to Upload Image</span>
              </label>
            </div>
          </div>
          {thumbnailGalleries &&
            thumbnailGalleries.length > 0 &&
            feature !== null && (
              <React.Fragment>
                <hr />
                <h2 className="font-medium mt-2">Featured Image </h2>
                <p className="text-xs italic mb-4">
                  (Select an Image above to set it as featured image)
                </p>
                <div className="-mx-2">
                  <div className="px-2 mb-4 relative inline-block">
                    <span
                      className="p-1 bg-red-500 rounded-full inline-block absolute cursor-pointer hover:opacity-90 right-0 -top-2 z-10"
                      onClick={() => deleteGalleryImage(feature)}
                    >
                      <img src={closeIcon} alt="Close" width="10" />
                    </span>
                    <div
                      className={`p-14 inline-block bg-gray-300 relative border border-gray-300 overflow-hidden`}
                      style={{ borderRadius: "4px" }}
                    >
                      <img
                        src={thumbnailGalleries[feature]}
                        alt=""
                        className="absolute top-0 left-0 h-full w-full object-cover object-center"
                      />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}

          {errors && errors?.gallery_images && (
            <p className="text-red-500 text-sm">{errors?.gallery_images}</p>
          )}
          {errors && errors?.feature_image && (
            <p className="text-red-500 text-sm">{errors?.feature_image}</p>
          )}
        </div>

        {/* /.form-group */}

        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Youtube Video Url</label>
          <input
            type="url"
            className="border px-2  w-full rounded text-md mb-2"
            name="youtube_url"
            style={{ height: "50px" }}
            value={data.youtube_url}
            placeholder="https://www.youtube.com/watch?v=DfuJi3hOlhE"
            onChange={(e) => onFormInputChange("youtube_url", e.target.value)}
          />
          {errors && errors?.youtube_url && (
            <p className="text-red-500 text-sm">{errors?.youtube_url}</p>
          )}
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full  form-group mb-6">
          <label className="block mb-2">Property Detail Description</label>
          <div className="border border-gray-300 p-4">
            <Editor
              editorState={propertyDescription}
              onEditorStateChange={onPropertyDescription}
              toolbar={{
                options: [
                  "inline",
                  "blockType",
                  "fontSize",
                  "list",
                  "textAlign",
                  "colorPicker",
                  "link",
                  "embedded",
                  "emoji",
                ],
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
              }}
            />
          </div>
          {errors && errors?.property_description && (
            <p className="text-red-500 text-sm">
              {errors?.property_description}
            </p>
          )}
        </div>
        {/* /.form-group */}
      </div>
    </div>
  );
};

MyProperty.propTypes = {
  propertyType: PropTypes.array,
  categoryType: PropTypes.array,
  advertisementPurpose: PropTypes.array,
  errors: PropTypes.object,
  data: PropTypes.object,
  exteriorLooks: PropTypes.array,
  interiorLooks: PropTypes.string,
};

MyProperty.defaultProps = {
  propertyType: [],
  categoryType: [],
  exteriorLooks: [],
  interiorLooks: [],
  classType: [],
  advertisementPurpose: [],
  errors: null,
  data: null,
};

export default MyProperty;
