import React from "react";

const ImageGallery = ({ property }) => {
  return (
    <div className="grid lg:grid-cols-12 items-center gap-2 md:gap-5 py-5 sm:py-10">
      <img
        src={property.feature_image}
        alt={property.feature_image}
        className="lg:h-[24rem] w-full rounded-lg col-span-6 lg:col-span-7 object-cover "
      />
      <div className="lg:h-[24rem] col-span-6 lg:col-span-5 grid grid-cols-4 lg:grid-cols-2 gap-2 md:gap-5">
        {property.gallery_images && property.gallery_images.slice(0,3).map((gallery,i)=>{
          return(
            <img
              src={gallery.image}
              alt={`gallery-${i}`}
              key={i}
              className="h-full w-full rounded-lg object-cover"
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
        : <p className="bg-red-500 rounded-lg flex items-center justify-center text-center text-white font-bold">
            Coming Soon...
        </p>
        }

      </div>
    </div>
  );
};

export default ImageGallery;
