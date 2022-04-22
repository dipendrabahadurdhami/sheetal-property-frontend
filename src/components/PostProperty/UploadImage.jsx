import { Button } from "@material-ui/core";
import React from "react";

const UploadImage = () => {
  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5">
      <div className="text-xl font-medium capitalize">Image Section</div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="space-y-3">
          <div>Featured Image</div>
          <div className="w-full border flex space-x-2 pl-2 justify-between items-center rounded">
            <span className="text-gray-400 text-sm">Choose file</span>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="contained-button-file"
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                style={{ backgroundColor: "#B91C1B", color: "white" }}
                component="span"
                className="w-full text-white py-2 flex space-x-2 justify-center"
              >
                Browse
              </Button>
            </label>
          </div>
        </div>
        <div className="space-y-3">
          <div>Gallery Images </div>
          <div className="w-full border flex space-x-2 pl-2 justify-between items-center rounded">
            <span className="text-gray-400 text-sm">Choose file</span>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="contained-button-file"
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                style={{ backgroundColor: "#B91C1B", color: "white" }}
                component="span"
                className="w-full text-white py-2 flex space-x-2 justify-center"
              >
                Browse
              </Button>
            </label>
          </div>
        </div>
        <div className="space-y-3">
          <div>Legal Documents</div>
          <div className="w-full border flex space-x-2 pl-2 justify-between items-center rounded">
            <span className="text-gray-400 text-sm">Choose file</span>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="contained-button-file"
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                style={{ backgroundColor: "#B91C1B", color: "white" }}
                component="span"
                className="w-full text-white py-2 flex space-x-2 justify-center"
              >
                Browse
              </Button>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
