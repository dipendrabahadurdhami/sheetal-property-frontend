import React, { useState, useEffect, useRef } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { BsGrid, BsPlayCircle } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ImageGallery = ({ property }) => {
  const [view, setView] = useState("grid"); // "grid" | "slideshow"
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const timerRef = useRef(null);

  const featureImage = property?.feature_image;
  const galleryImages = property?.gallery_images || [];

  // All images combined: feature first, then gallery
  const allImages = [
    ...(featureImage ? [featureImage] : []),
    ...galleryImages.map((g) => g.image),
  ];

  // Slideshow auto-advance every 5s
  useEffect(() => {
    if (view === "slideshow") {
      timerRef.current = setInterval(() => {
        setSlideIndex((prev) => (prev + 1) % allImages.length);
      }, 5000);
    }
    return () => clearInterval(timerRef.current);
  }, [view, allImages.length]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const prevSlide = () => {
    clearInterval(timerRef.current);
    setSlideIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const nextSlide = () => {
    clearInterval(timerRef.current);
    setSlideIndex((prev) => (prev + 1) % allImages.length);
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* View toggle buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginBottom: "10px" }}>
        <button
          onClick={() => setView("grid")}
          title="Grid View"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "6px 14px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "13px",
            background: view === "grid" ? "var(--rd)" : "#f3f4f6",
            color: view === "grid" ? "var(--l)" : "#374151",
            transition: "all 0.2s",
          }}
        >
          <BsGrid size={15} /> Grid
        </button>
        <button
          onClick={() => { setView("slideshow"); setSlideIndex(0); }}
          title="Slideshow View"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "6px 14px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "13px",
            background: view === "slideshow" ? "var(--rd)" : "#f3f4f6",
            color: view === "slideshow" ? "var(--l)" : "#374151",
            transition: "all 0.2s",
          }}
        >
          <BsPlayCircle size={15} /> Slideshow
        </button>
      </div>

      {/* GRID VIEW */}
      {view === "grid" && (
        <div className="grid lg:grid-cols-12 items-center gap-2 md:gap-5 py-2">
          {/* Main large image */}
          <img
            src={featureImage}
            alt={property.name}
            className="lg:h-[24rem] w-full rounded-lg col-span-6 lg:col-span-7 object-cover cursor-pointer"
            onClick={() => openLightbox(0)}
          />
          {/* Side images */}
          <div className="lg:h-[24rem] col-span-6 lg:col-span-5 grid grid-cols-4 lg:grid-cols-2 gap-2 md:gap-5">
            {galleryImages.slice(0, 3).map((gallery, i) => (
              <img
                key={i}
                src={gallery.image}
                alt={`gallery-${i}`}
                className="h-full w-full rounded-lg object-cover cursor-pointer"
                onClick={() => openLightbox(i + 1)}
              />
            ))}
            {galleryImages.length > 3 ? (
              <button
                onClick={() => openLightbox(3)}
                style={{ backgroundImage: `url(${featureImage})` }}
                className="relative rounded-lg overflow-hidden h-full w-full cursor-pointer"
              >
                <div className="absolute bg-black flex justify-center items-center bg-opacity-50 w-full h-full text-xs md:text-base lg:text-xl sm:font-bold text-white">
                  + {galleryImages.length - 3} more
                </div>
                <img
                  src={featureImage}
                  alt="more"
                  className="h-full w-full rounded-lg object-cover"
                />
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      )}

      {/* SLIDESHOW VIEW */}
      {view === "slideshow" && allImages.length > 0 && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "420px",
            borderRadius: "12px",
            overflow: "hidden",
            background: "#111",
            cursor: "pointer",
          }}
          onClick={() => openLightbox(slideIndex)}
        >
          <img
            src={allImages[slideIndex]}
            alt={`slide-${slideIndex}`}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.4s" }}
          />
          {/* Slide counter */}
          <div
            style={{
              position: "absolute",
              top: "14px",
              right: "16px",
              background: "rgba(0,0,0,0.55)",
              color: "#fff",
              borderRadius: "20px",
              padding: "3px 12px",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            {slideIndex + 1} / {allImages.length}
          </div>
          {/* Prev button */}
          <button
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <FaChevronLeft />
          </button>
          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            style={{
              position: "absolute",
              right: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <FaChevronRight />
          </button>
          {/* Dot indicators */}
          <div
            style={{
              position: "absolute",
              bottom: "14px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "6px",
            }}
          >
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setSlideIndex(i); }}
                style={{
                  width: i === slideIndex ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: i === slideIndex ? "var(--r)" : "rgba(255,255,255,0.6)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          mainSrc={allImages[lightboxIndex]}
          nextSrc={allImages[(lightboxIndex + 1) % allImages.length]}
          prevSrc={allImages[(lightboxIndex + allImages.length - 1) % allImages.length]}
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() =>
            setLightboxIndex((lightboxIndex + allImages.length - 1) % allImages.length)
          }
          onMoveNextRequest={() =>
            setLightboxIndex((lightboxIndex + 1) % allImages.length)
          }
        />
      )}
    </div>
  );
};

export default ImageGallery;