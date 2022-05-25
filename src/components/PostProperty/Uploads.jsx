import React, { useState } from "react";
import closeIcon from '../../assets/images/icon-close.svg';
const UploadImage = ({onInputChange}) => {
  const [galleries, setGalleries] = useState([]);
  const [thumbnailGalleries, setThumbnailGalleries] = useState([]);
  const [legalDocuments, setLegalDocuments] = useState([]);

  const onGalleryImageChanges = (name,e)=>{
    e.preventDefault();
    let thumbnails = [];
    let mainImages = [];
    const files = e.target.files;
    let i =0;
    while(i < files.length){
      // let images = thumbnailGalleries;
      // var reader = new FileReader();
      thumbnails.push(URL.createObjectURL(files[i]))
      mainImages.push(files[i])
      i++;
    }

    setThumbnailGalleries(thumbnails);
    setGalleries(mainImages);
    onInputChange("gallery_images", mainImages)
  }
  const deleteGalleryImage = (index) => {
    const thumbs = thumbnailGalleries.filter((thumb,i)=> i !== index);
    const _galleries =  galleries.filter((image,i)=> i!==index);
      setThumbnailGalleries(thumbs)
      setGalleries(_galleries)
      onInputChange("gallery_images", _galleries)
    // }
  }


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
      <div className="text-xl font-medium capitalize">Image Section</div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="space-y-3">
          <div>Gallery Images <span className="text-xs italic">(Please upload all at once.)</span></div>
          <div className="flex items-center flex-wrap -mx-2">
            {thumbnailGalleries && thumbnailGalleries.map((item,i)=>{
              return(
              <div className="px-2 mb-4 relative" key={i}>
                <span className="p-1 bg-red-500 rounded-full inline-block absolute cursor-pointer hover:opacity-90 right-0 -top-2 z-10"  onClick={()=>deleteGalleryImage(i)}>
                  <img src={closeIcon} alt="Close" width="10"/>
                </span>
                <div className="p-10 bg-gray-300 relative border border-gray-300 overflow-hidden" style={{borderRadius:'4px'}}><img src={item} alt="image" width="100" className="absolute top-0 left-0 h-full w-full object-cover object-center"/></div>
              </div>)
            })}

            <div className={`c-single-image-block small px-2 mb-4`} >
              <input type="file" accept="image/*" id="gallery_images" name="gallery_images" onChange={(e)=>onGalleryImageChanges('gallery_images', e)} multiple/>
              <label htmlFor="gallery_images" >
                  <span className="image overflow-hidden">
                    {/* {image?<img src={image} alt={"image"} className="absolute top-0 left-0 h-full w-full object-cover object-center"/>:''} */}
                  </span>
                  <span className="text">Click to Upload Image</span>
              </label>
            </div>
            
          </div>
          
        </div>
        <div className="space-y-3">
          <div>Legal Documents <span className="text-xs italic">(Please upload all at once.)</span></div>
          <div>
            <input type="file" id="legal_documents" name="legal_documents" onChange={(e)=>onLegalDocumentsChanges('legal_documents', e)} multiple/>
            <div className="text-xs py-4">
              {legalDocuments && legalDocuments.length > 0 && legalDocuments.map((docs,i)=>{
                return <div key={i} className="py-2 border-b border-dashed border-gray-300 flex items-center justify-between">{docs.name} <span className="bg-red-400 inline-block rounded-full p-1 hover:bg-red-500 cursor-pointer" onClick={()=>deleteLegalDocuments(i)}><img src={closeIcon} width="6" /></span></div>
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
