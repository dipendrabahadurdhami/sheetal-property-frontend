import React from "react";
import FormikTextInput from "./FormikTextInput";
import { EditorState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


const AboutProperty = () => {
  const [editorState, setEditorState] = React.useState(
    () => EditorState.createEmpty(),
  );
 

  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5 mb-6">
      <div className="text-xl font-medium capitalize">About Property</div>
      <div className="flex flex-wrap justify-between -mx-2 mb-6">
        <div className="px-2  w-full  form-group mb-6">
          <label className="block mb-2">Property Description</label>
          <div className="border border-gray-300 p-4">
            <Editor editorState={editorState} onEditorStateChange={setEditorState} 
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
            <Editor editorState={editorState} onEditorStateChange={setEditorState}
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
            <Editor editorState={editorState} onEditorStateChange={setEditorState}
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

export default AboutProperty;
