import React, { useState } from "react";
import FormikTextInput from "./FormikTextInput";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import TagsInput from "../TagsInput";
import PropTypes from 'prop-types';


import { convertToHTML } from "draft-convert"

const AboutProperty = ({data,errors, exteriorLooks, interiorLooks,onInputChange}) => {
  const [editorState, setEditorState] = React.useState(
    () => EditorState.createEmpty(),
  );

  const [propertyDescription, setPropertyDescription] = useState(()=> EditorState.createEmpty())
  const [propertyHighlights, setPropertyHighlights] = useState(()=> EditorState.createEmpty())
  const [otherDescription, setOtherDescription] = useState(()=> EditorState.createEmpty())

  const onFormInputChange = (name,value) => {
    onInputChange(name, value)
  }

  const onExteriorChange=(value)=>{
    onFormInputChange('exterior_looks', value )
  }

  const onInteriorChange=(value)=>{
    onFormInputChange('interior_looks', value )
  }

  const onPropertyDescription = (html) => {
    const htmls= convertToHTML(html?.getCurrentContent());
    onInputChange('property_description',htmls)
    setPropertyDescription(html)
  }

  const onPropertyHighlights = (html) => {
    const htmls= convertToHTML(html?.getCurrentContent());
    onInputChange('property_highlights',htmls)
    setPropertyHighlights(html)
  }


  const onOtherDescription = (html) => {
    const htmls= convertToHTML(html?.getCurrentContent());
    onInputChange('other_description',htmls)
    setOtherDescription(html)
  }
 
 

  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5 mb-6">
      <div className="text-xl font-medium capitalize">About Property</div>
      <div className="flex flex-wrap justify-between -mx-2 mb-6">
        <div className="px-2  w-full  form-group mb-6">
          <label className="block mb-2">Property Description</label>
          <div className="border border-gray-300 p-4">
            <Editor editorState={propertyDescription} onEditorStateChange={onPropertyDescription} 
            toolbar={{
              options:['inline','blockType', 'fontSize',  'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji'],
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true },

            }}/>
          </div>
        </div>
        {/* /.form-group */}
        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Property Hightlights</label>
          <div className="border border-gray-300 p-4">
            <Editor editorState={propertyHighlights} onEditorStateChange={onPropertyHighlights}
            toolbar={{
              options:['inline','blockType', 'fontSize',  'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji'],
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true },

            }}/>
          </div>
        </div>
        {/* /.form-group */}
        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Other Description</label>
          <div className="border border-gray-300 p-4">
            <Editor editorState={otherDescription} onEditorStateChange={onOtherDescription} 
            toolbar={{
              options:['inline','blockType', 'fontSize',  'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji'],
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true },

            }}/>
          </div>
        </div>
        {/* /.form-group */}
        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Exterior Looks</label>
          <TagsInput tags={exteriorLooks} onTagSelected={onExteriorChange}/>
        </div>
        {/* /.form-group */}

        <div className="px-2  w-full lg:w-6/12  form-group mb-6">
          <label className="block mb-2">Interior Looks</label>
          <TagsInput tags={interiorLooks} onTagSelected={onInteriorChange}/>
        </div>
        {/* /.form-group */}
      </div>
    </div>
  );
};

AboutProperty.propTypes = {
  exteriorLooks: PropTypes.array,
  interiorLooks: PropTypes.string,
  errors:  PropTypes.object,
  data: PropTypes.object
}

AboutProperty.defaultProps = {
  exteriorLooks:[],
  interiorLooks:[],
  errors: null,
  data: null,
}


export default AboutProperty;
