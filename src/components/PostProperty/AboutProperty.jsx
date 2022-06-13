import React, { useState } from "react";
import FormikTextInput from "./FormikTextInput";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import PropTypes from 'prop-types';


import { convertToHTML } from "draft-convert"

const AboutProperty = ({data,errors,onInputChange}) => {
  const [editorState, setEditorState] = React.useState(
    () => EditorState.createEmpty(),
  );


  const [propertyHighlights, setPropertyHighlights] = useState(()=> EditorState.createEmpty())
  const [otherDescription, setOtherDescription] = useState(()=> EditorState.createEmpty())


 


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
     
      </div>
    </div>
  );
};

AboutProperty.propTypes = {

  errors:  PropTypes.object,
  data: PropTypes.object
}

AboutProperty.defaultProps = {

  errors: null,
  data: null,
}


export default AboutProperty;
