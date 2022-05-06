import React from "react";
import Parser from 'html-react-parser'
const PropertyHighlight = ({data}) => {
  return (
    <>
  
      <div className="border-b-2 border-gray-300">
        <div className="border-b-2 border-gray-200 py-3 font-bold text-xl sm:text-2xl">
          PropertyHighlight
        </div>
      <div className="py-6">
          {data &&  Parser(data)}
          {!data && <p>Coming Soon ...</p>}
      </div>
      </div>
      

     
    </>
  );
};

export default PropertyHighlight;
