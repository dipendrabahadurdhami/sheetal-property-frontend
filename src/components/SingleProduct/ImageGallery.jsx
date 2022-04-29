import React from "react";

const ImageGallery = ({ property }) => {
  return (
    <div className="grid lg:grid-cols-12 items-center gap-2 md:gap-5 py-5 sm:py-10">
      <img
        src={property.feature_image}
        alt="unsplash"
        className="lg:h-[24rem] w-full rounded-lg col-span-6 lg:col-span-7"
      />
      <div className="lg:h-[24rem] col-span-6 lg:col-span-5 grid grid-cols-4 lg:grid-cols-2 gap-2 md:gap-5">
        <img
          src={property.feature_image}
          alt="unsplash"
          className="h-full w-full rounded-lg"
        />
        <img
          src={property.feature_image}
          alt="unsplash"
          className="h-full w-full rounded-lg"
        />
        <img
          src={property.feature_image}
          alt="unsplash"
          className="h-full w-full rounded-lg"
        />
        <button
          style={{ backgroundImage: "url(/unsplash.png)" }}
          className="relative rounded-lg overflow-hidden h-full w-full"
        >
          <div className="absolute bg-black flex justify-center items-center bg-opacity-50  w-full h-full text-xs md:text-base lg:text-xl sm:font-bold text-white">
            + 99 more
          </div>
          <img
            src={property.feature_image}
            alt="unsplash"
            className="h-full w-full rounded-lg"
          />
        </button>
      </div>
    </div>
  );
};

export default ImageGallery;
