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
const MyProperty = ({propertyType, categoryType,errors,data, onInputChange}) => {
  const [selected, setSelected] = useState(null);
  const handleSelectedItem = (item) => {
    setSelected(item.id)
  }
  const onFormInputChange = (name,value) => {
    onInputChange(name, value)
  }
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
          <div className="px-2 w-full lg:w-6/12">
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
          
        </div>
    </div>
  );
};

MyProperty.propTypes = {
  propertyType: PropTypes.array,
  categoryType: PropTypes.array,
  errors:  PropTypes.object,
  data: PropTypes.object
}

MyProperty.defaultProps = {
  propertyType:[],
  categoryType:[],
  errors: null,
  data: null,
}



export default MyProperty;
