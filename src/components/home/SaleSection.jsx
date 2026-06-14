import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Carousel from "react-multi-carousel";
import { Link } from "react-router-dom";
import FearuredCard from "../card/FearuredCard";
import { CustomLeftArrow, CustomRightArrow } from "../carousel/CustomeButton";
import { responsive } from "../carousel/Responsive";
import "react-multi-carousel/lib/styles.css";

const MobileRow = ({ items }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || items.length <= 1) return;
    let current = 0;
    const interval = setInterval(() => {
      current = (current + 1) % items.length;
      const cardWidth = el.scrollWidth / items.length;
      el.scrollTo({ left: current * cardWidth, behavior: "smooth" });
    }, 3000);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div
      ref={scrollRef}
      style={{
        display: "flex",
        gap: "10px",
        overflowX: "auto",
        overflowY: "visible",
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingBottom: "4px",
        margin: "0",
      }}
      className="feat-scroll-hide"
    >
      {items.map((product, index) => (
        <div
          key={index}
          style={{
            flex: "0 0 calc(100vw - 32px)",
            maxWidth: "calc(100vw - 32px)",
            scrollSnapAlign: "center",
          }}
        >
          <FearuredCard product={product} />
        </div>
      ))}
      <div style={{ flex: "0 0 1px", minWidth: "1px" }} aria-hidden />
    </div>
  );
};

const DesktopCarousel = ({ items }) => (
  <div style={{ margin: "0 -6px" }}>
    <Carousel
      responsive={responsive}
      customRightArrow={<CustomRightArrow />}
      customLeftArrow={<CustomLeftArrow />}
      className="py-2 pb-8"
      autoPlay={false}
      autoPlaySpeed={2500}
      infinite={true}
      pauseOnHover={true}
      transitionDuration={600}
    >
      {items.map((product, index) => (
        <div key={index} style={{ padding: "0 6px", height: "100%" }}>
          <FearuredCard product={product} />
        </div>
      ))}
    </Carousel>
  </div>
);

const SaleSection = () => {
  const [allProduct, setAllProduct] = useState([]);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_LINK}/sale?page=1&per_page=12`
        );
        setAllProduct(res.data?.data || []);
      } catch (e) {
        console.error("SaleSection fetch error:", e);
      }
    }
    fetchData();
  }, []);

  const mobileRow1 = allProduct.slice(0, 4);
  const mobileRow2 = allProduct.slice(4, 8);

  return (
    <>
      <style>{`
        .sale-section-home { opacity: 0; animation: featIn 0.5s ease 0.2s forwards; }
      `}</style>

      <section
        className="sale-section-home"
        style={{
          padding: isMobile ? "0px 0 40px" : "0px 48px 0px",
          maxWidth: "1400px",
          margin: "0 auto",
          overflowX: isMobile ? "hidden" : "visible",
          width: "100%",
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "12px",
            padding: isMobile ? "0 16px" : "0",
            marginBottom: isMobile ? "14px" : "0",
          }}
        >
          <div>
           

            <h2
              className="serif"
              style={{
                fontSize: isMobile ? "22px" : "clamp(26px, 3vw, 44px)",
                fontWeight: 600,
                letterSpacing: isMobile ? "-0.3px" : "-0.8px",
                lineHeight: 1.06,
                color: "var(--d)",
              }}
            >
              Properties for Sale
            </h2>
          </div>

          {!isMobile && allProduct.length > 0 && (
            <Link to="/sale" className="btn-g latest-viewall">
              View All
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          )}
        </div>

        {/* ── EMPTY ── */}
        {allProduct.length === 0 && (
          <p
            style={{
              textAlign: "center",
              padding: "60px 16px",
              color: "var(--d)",
              opacity: 0.35,
              fontSize: "14px",
            }}
          >
            No sale properties at the moment.
          </p>
        )}

        {/* ── DESKTOP carousel ── */}
        {!isMobile && allProduct.length > 0 && (
          <DesktopCarousel items={allProduct} />
        )}

        {/* ── MOBILE: vertical grid ── */}
        {isMobile && allProduct.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              
            }}>
              {allProduct.slice(0, 10).map((product, index) => (
                <FearuredCard key={index} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* ── Mobile View All ── */}
        {isMobile && allProduct.length > 0 && (
          <div style={{ marginTop: "20px", padding: "0 16px" }}>
            <Link to="/sale" className="btn-p latest-pill">
              View All Properties for Sale
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default SaleSection;