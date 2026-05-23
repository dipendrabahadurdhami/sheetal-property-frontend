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
      autoPlay={true}
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

const LatestProperties = () => {
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
    async function FetchData() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_LINK}/all-properties`
        );
        setAllProduct(res.data.data);
      } catch (e) {
        console.error("LatestProperties fetch error:", e);
      }
    }
    FetchData();
  }, []);

  const mobileRow1 = allProduct.slice(0, 4);
  const mobileRow2 = allProduct.slice(4);

  return (
    <>
      <style>{`
        .feat-scroll-hide::-webkit-scrollbar { display: none; }
        .latest-section { opacity: 0; animation: featIn 0.5s ease 0.1s forwards; }
        @keyframes featIn { to { opacity: 1; } }
        .latest-viewall {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 12px; padding: 10px 20px; white-space: nowrap;
          flex-shrink: 0; transition: gap 0.2s ease;
        }
        .latest-viewall:hover { gap: 12px; }
        .latest-pill {
          display: flex; align-items: center; justify-content: center;
          gap: 8px; width: 100%; padding: 15px; font-size: 13px;
          font-weight: 500; letter-spacing: 0.04em; border-radius: 4px;
          text-decoration: none; transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .latest-pill:active { opacity: 0.85; transform: scale(0.98); }
        .scroll-dots {
          display: flex; justify-content: center; gap: 5px; margin-top: 12px;
        }
        .scroll-dot {
          width: 5px; height: 5px; border-radius: 99px;
          background: var(--r); opacity: 0.2;
          transition: opacity 0.3s, width 0.3s;
        }
        .scroll-dot.active { opacity: 1; width: 16px; }
      `}</style>

      <section
        className="latest-section"
        style={{
          padding: isMobile ? "20px 0 40px" : "40px 48px 80px",
          maxWidth: "1400px",
          margin: "0 auto",
          overflowX: isMobile ? "hidden" : "visible",
          width: "100%",
        }}
      >
        {/* ── HEADER ── */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "12px",
          padding: isMobile ? "0 16px" : "0",
        }}>
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
              Latest Properties
            </h2>
          </div>

          {!isMobile && allProduct.length > 0 && (
            <Link
              to={`/productSearch?date_from=${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}&date_to=${new Date().toISOString().split('T')[0]}`}
              className="btn-g latest-viewall"
            >
              View All
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          )}
        </div>



        {/* ── EMPTY ── */}
        {allProduct.length === 0 && (
          <p style={{
            textAlign: "center", padding: "60px 16px",
            color: "var(--d)", opacity: 0.35, fontSize: "14px",
          }}>
            No latest properties at the moment.
          </p>
        )}

        {/* ── DESKTOP: single infinite carousel with ALL items ── */}
        {!isMobile && allProduct.length > 0 && (
          <DesktopCarousel items={allProduct} />
        )}

        {/* ── MOBILE: two swipeable rows ── */}
        {isMobile && (
          <>
            {mobileRow1.length > 0 && <MobileRow items={mobileRow1} />}
            {mobileRow2.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <MobileRow items={mobileRow2} />
              </div>
            )}
          </>
        )}

        {/* ── Scroll dots (mobile only) ── */}
        {isMobile && allProduct.length > 1 && (
          <div className="scroll-dots" aria-hidden>
            {Array.from({ length: Math.min(allProduct.length, 5) }).map((_, i) => (
              <div key={i} className={`scroll-dot${i === 0 ? " active" : ""}`} />
            ))}
          </div>
        )}

        {/* ── View All mobile ── */}
        {isMobile && allProduct.length > 0 && (
          <div style={{ marginTop: "20px", padding: "0 16px" }}>
            <Link
              to={`/productSearch?date_from=${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}&date_to=${new Date().toISOString().split('T')[0]}`}
              className="btn-p latest-pill"
            >
              View All Latest Properties
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

export default LatestProperties;