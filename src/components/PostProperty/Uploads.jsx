import React, { useEffect, useState } from "react";
import closeIcon from '../../assets/images/icon-close.svg';
const UploadImage = ({onInputChange}) => {
  const [legalDocuments, setLegalDocuments] = useState([]);


  const onLegalDocumentsChanges = (name, e) => {
    e.preventDefault();
    const files = e.target.files;
    let i =0, documents=[];
     while(i < files.length){
       // let images = thumbnailGalleries;
       // var reader = new FileReader();
      
       documents.push(files[i])
       i++;
     }

    setLegalDocuments(documents);
    onInputChange("documents", documents)
  }

  const deleteLegalDocuments = (index) => {
    const _docs =  legalDocuments.filter((image,i)=> i!==index);
      setLegalDocuments(_docs)
      onInputChange("documents", _docs)
    // }
  }

  return (
    <div className="pt-5 sm:p-5 border-t sm:border sm:rounded-lg space-y-5 mb-6">
      {/* <div className="text-xl font-medium capitalize">Image Section</div> */}
      <div className="grid md:grid-cols-2  gap-5">

        <div className="space-y-3">
          <div>Legal Documents <span className="text-xs italic">(Please upload all at once.)</span></div>
          <div>
            <input type="file" id="legal_documents" name="legal_documents" onChange={(e)=>onLegalDocumentsChanges('legal_documents', e)} multiple/>
            <div className="text-xs py-4">
              {legalDocuments && legalDocuments.length > 0 && legalDocuments.map((docs,i)=>{
                return (
                  <div key={i} className="py-2 border-b border-dashed border-gray-300 flex items-center justify-between">
                  {docs.name} 
                    <span className="bg-red-400 inline-block rounded-full p-1 hover:bg-red-500 cursor-pointer" onClick={()=>deleteLegalDocuments(i)}>
                      <img src={closeIcon} width="6" />
                    </span>
                   
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
