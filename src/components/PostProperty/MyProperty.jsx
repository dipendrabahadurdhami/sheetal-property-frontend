import React, {  useState } from "react";
import PropTypes from 'prop-types';

const PropertyTypeItem = ({id, item, selected, action, onSelectAction}) => {
  // const [checked, setChecked] = useState(false);
  const handleSelect =() => {
      action(item)
  }

  const onInputChange= (value) => {
    onSelectAction('propertytype_id', value)
  
  }
  return(
    <label className={`flex items-center border border-gray-300 px-4 py-2 rounded cursor-pointer ${selected === item.id?'bg-red-500 border-red-500 text-white font-medium':'bg-white border-gray-300 font-light '}`} for={'my-property-'+id} onClick={(e)=>{
      handleSelect();
      onInputChange( item.id)
    }}>
        <input type={"radio"} id={'my-property-'+id} name="propertytype_id" className="border-red-500 w-4 h-4 opacity-0 absolute left-0"  checked={selected === item.id} />
    
        <span className="block">{item.name}</span>
   
      </label>
  )
}
const MyProperty = ({propertyType, categoryType,classType, errors,data, onInputChange, onFileChange}) => {
  const [selected, setSelected] = useState(null);
  const [image, setImage] = useState(null)
  const handleSelectedItem = (item) => {
    setSelected(item.id)
  }
  const onFormInputChange = (name,value) => {
    onInputChange(name, value)
  }

  // const onFeatureImageChange = (name,e)=>{
  //   e.preventDefault();

  //   var reader = new FileReader();
  //   reader.readAsDataURL(e.target.files[0]);
  //   reader.onloadend = function (e) {
  //     setImage(reader.result)
  //   }
  //   onFileChange(name,e.target.files[0])
  // }
  return (
    <div className="sm:p-5 sm:border rounded-lg mb-6">
      <div className="text-xl font-medium mb-6">My property is : </div>
        <div className="form-group mb-4">
          <div className="flex items-center flex-wrap  -mx-2">
            {propertyType &&  propertyType.map((item,i)=>{
              return(
                <div className="px-2 py-2" key={i}>
                  <PropertyTypeItem  id={i} item={item} selected={selected} action={handleSelectedItem} onSelectAction={onInputChange}/>
                </div>
              )})}
          </div>

          {errors && errors?.propertytype_id && <p className="text-red-500 text-sm">{errors?.propertytype_id}</p>}
        </div>
       {/* /.form-group */}


        <div className="w-full mb-4">
              <label className="block mb-2">Property Name</label>
              <input
      
                placeholder="Enter your property name"
                className="w-full  px-2 border border-gray-300 rounded text-md mb-2"
                name="propertyName"
                style={{height:'50px'}}
                onChange={(e)=>onFormInputChange('name', e.target.value)}
              />
              {errors && errors?.name && <p className="text-red-500 text-sm">{errors?.name}</p>}
          </div>

        <div className="flex flex-wrap justify-between -mx-2 mb-6">
          <div className="px-2  w-full lg:w-6/12  form-group">
            <label className="block mb-2">Category Type</label>
            <select
              className="border px-2  w-full rounded text-md mb-2"
              name="category_id"
              style={{height:'50px'}}
              onChange={(e)=>onFormInputChange('category_id', e.target.value)}
            >

              <option value="">Choose your Category type</option>
              {categoryType &&  categoryType.map((item,i)=>{
                return <option value={item.id} key={i}>{item.name}</option>
              })}
            </select>
            {errors && errors?.category_id && <p className="text-red-500 text-sm">{errors?.category_id}</p>}
          </div>


          <div className="px-2  w-full lg:w-6/12  form-group mb-4">
            <label className="block mb-2">Class Type</label>
            <select
              className="border px-2  w-full rounded text-md mb-2"
              name="class_id"
              style={{height:'50px'}}
              onChange={(e)=>onFormInputChange('class_id', e.target.value)}
            >

              <option value="">Choose your Class type</option>
              {classType &&  classType.map((item,i)=>{
                return <option value={item.id} key={i}>{item.name}</option>
              })}
            </select>
            {errors && errors?.class_id && <p className="text-red-500 text-sm">{errors?.class_id}</p>}
          </div>

          {/* <div className="px-2 w-full form-group c-single-image-block mb-4">
            <label className="block mb-4">Feature Image</label>
            <div>
              <input type="file" accept="image/*" id="feature_image" name="feature_image" onChange={(e)=>onFeatureImageChange('feature_image', e)}/>
              <label htmlFor="feature_image">
                  <span className="image overflow-hidden">
                    {image?<img src={image} alt={"image"} className="absolute top-0 left-0 h-full w-full object-cover object-center"/>:''}
                  </span>
                  <span className="text">Click to Upload Image</span>
              </label>
            </div>
          </div> */}
          <div className="px-2  w-full lg:w-6/12  form-group mb-4">
            <label className="block mb-2">Expiry Date</label>
            <input
                type="date"
                placeholder="dd/mm/yyyy"
                className="w-full  px-2 border border-gray-300 rounded text-md mb-2"
                name="expiry_date"
                style={{height:'50px'}}
                value={data.expiry_date}
                onChange={(e)=>onFormInputChange('expiry_date', e.target.value)}
              />
              {errors && errors?.expiry_date && <p className="text-red-500 text-sm">{errors?.expiry_date}</p>}
          </div>
          <div className="px-2  w-full lg:w-6/12  form-group mb-4">
            <label className="block mb-2">Property Location</label>
            <input
                type="text"
                placeholder="Basundhara 03, Kathmandu"
                className="w-full  px-2 border border-gray-300 rounded text-md mb-2"
                name="property_location"
                style={{height:'50px'}}
                value={data.property_location}
                onChange={(e)=>onFormInputChange('property_location', e.target.value)}
              />
              {errors && errors?.property_location && <p className="text-red-500 text-sm">{errors?.property_location}</p>}
          </div>


          
          
        </div>
    </div>
  );
};

MyProperty.propTypes = {
  propertyType: PropTypes.array,
  categoryType: PropTypes.array,
  categoryType: PropTypes.array,
  errors:  PropTypes.object,
  data: PropTypes.object
}

MyProperty.defaultProps = {
  propertyType:[],
  categoryType:[],
  classType:[],
  errors: null,
  data: null,
}



export default MyProperty;
