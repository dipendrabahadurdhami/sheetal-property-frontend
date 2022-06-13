import React, { useState } from "react";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
const ImageGallery = ({ property }) => {
  console.log(property.gallery_images)
  const [isOpen, setOpen] = useState(false);
  const [isFeatureOpen, setFeatureOpen]=useState(false)
  const [photoIndex, setPhotoIndex] = useState(0);
  return (
    <React.Fragment>
    <div className="grid lg:grid-cols-12 items-center gap-2 md:gap-5 py-5 sm:py-10">
      <img
        src={property.feature_image}
        alt={property.feature_image}
        className="lg:h-[24rem] w-full rounded-lg col-span-6 lg:col-span-7 object-cover "
        onClick={()=>{
          setPhotoIndex(0)
          setFeatureOpen(true)
        }}
      />
      <div className="lg:h-[24rem] col-span-6 lg:col-span-5 grid grid-cols-4 lg:grid-cols-2 gap-2 md:gap-5">
        {property.gallery_images && property.gallery_images.slice(0,3).map((gallery,i)=>{
          return(
            <img
              src={gallery.image}
              alt={`gallery-${i}`}
              key={i}
              className="h-full w-full rounded-lg object-cover"
              onClick={()=>{
                setPhotoIndex(i)
                setOpen(true)
              }}
            />
          )
        })}


        
        {property.gallery_images.length > 3?
        <button
          style={{ backgroundImage: `url(${property.feature_image})` }}
          className="relative rounded-lg overflow-hidden h-full w-full"
        >
          <div className="absolute bg-black flex justify-center items-center bg-opacity-50  w-full h-full text-xs md:text-base lg:text-xl sm:font-bold text-white">
            + {property.gallery_images.length > 3?property.gallery_images.length  - 3:0} more
          </div>
          <img
            src={property.feature_image}
            alt={property.feature_image}
            className="h-full w-full rounded-lg"
          />
        </button>
        : <div></div>
        }

      </div>
    </div>
    {isFeatureOpen && (
          <Lightbox
            mainSrc={property.feature_image}
            onCloseRequest={() => setFeatureOpen(false)}
          />
        )}
      {isOpen && (
          <Lightbox
            mainSrc={property.gallery_images[photoIndex].image}
            nextSrc={property.gallery_images[(photoIndex + 1) % property.gallery_images.length].image}
            prevSrc={property.gallery_images[(photoIndex + property.gallery_images.length - 1) % property.gallery_images.length].image}
            onCloseRequest={() => setOpen(false)}
            onMovePrevRequest={() =>
             setPhotoIndex((photoIndex + property.gallery_images.length - 1) % property.gallery_images.length)
            }
            onMoveNextRequest={() =>
              setPhotoIndex(( photoIndex + 1) % property.gallery_images.length)
            }
          />
        )}
    </React.Fragment>
  );
};

export default ImageGallery;
