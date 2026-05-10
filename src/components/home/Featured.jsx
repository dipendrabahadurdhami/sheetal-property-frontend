import axios from "axios";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import { Link } from "react-router-dom";
import FearuredCard from "../card/FearuredCard";
import { CustomLeftArrow, CustomRightArrow } from "../carousel/CustomeButton";
import { responsive } from "../carousel/Responsive";

const Featured = () => {
  const [allProduct, setAllProduct] = useState([]);

  useEffect(() => {
    async function FetchData() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_LINK}/featured-property-list`
        );
        setAllProduct(res.data.data);
      } catch (e) {
        console.error("Featured fetch error:", e);
      }
    }
    FetchData();
  }, []);

  return (
    <>
      <style>{`
        /* ─── Shared "View All" button ─────────────────────────────── */
        .prop-view-all {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border: 2px solid var(--r);
          color: var(--r);
          background: transparent;
          text-decoration: none;
          transition: background 0.22s, color 0.22s, box-shadow 0.22s, transform 0.18s;
          white-space: nowrap;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }
        .prop-view-all::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--r);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.26s cubic-bezier(.4,0,.2,1);
          border-radius: inherit;
          z-index: 0;
        }
        .prop-view-all:hover::before { transform: scaleX(1); }
        .prop-view-all span,
        .prop-view-all svg {
          position: relative;
          z-index: 1;
          transition: color 0.22s;
        }
        .prop-view-all:hover span,
        .prop-view-all:hover svg { color: #fff; }
        .prop-view-all:hover {
          box-shadow: 0 4px 18px rgba(180,20,20,0.25);
          transform: translateY(-1px);
        }
        .prop-view-all svg {
          width: 14px;
          height: 14px;
          transition: transform 0.22s, color 0.22s;
          color: var(--r);
        }
        .prop-view-all:hover svg { transform: translateX(4px); }

        /* ─── Shared mobile CTA ────────────────────────────────────── */
        .prop-mobile-cta {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }
        .prop-mobile-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 28px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border: 2px solid var(--r);
          color: var(--r);
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .prop-mobile-btn:active {
          background: var(--r);
          color: #fff;
        }
        @media (min-width: 768px) { .prop-mobile-cta { display: none; } }

        /* ─── Shared carousel wrap ─────────────────────────────────── */
        .prop-carousel-wrap { margin: 0 -10px; }
        .prop-card-slot { padding: 0 10px 4px; height: 100%; }
        .prop-row-gap { margin-top: 12px; }

        /* ─── Featured section ─────────────────────────────────────── */
        .feat-section {
          position: relative;
          padding: 72px 0;
          background: #fff;
          overflow: hidden;
        }
        .feat-bg-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(0,0,0,0.045) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
          mask-image: linear-gradient(180deg, transparent, rgba(0,0,0,0.6) 20%, rgba(0,0,0,0.6) 80%, transparent);
        }
        .feat-glow {
          position: absolute;
          top: -120px;
          right: -120px;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(180,20,20,0.06) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        .feat-inner {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .feat-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 44px;
          gap: 16px;
        }
        .feat-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }
        .feat-label-pip {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--r);
          flex-shrink: 0;
        }
        .feat-label-pip svg {
          width: 11px;
          height: 11px;
          fill: #fff;
        }
        .feat-label-text {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--r);
        }
        .feat-title {
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 900;
          line-height: 1.1;
          color: #0d0d0d;
          font-family: Georgia, 'Times New Roman', serif;
          letter-spacing: -0.03em;
          margin: 0 0 14px;
        }
        .feat-title mark {
          background: none;
          color: var(--r);
          position: relative;
          font-style: italic;
        }
        .feat-title mark::after {
          content: '';
          position: absolute;
          bottom: 0px;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--r);
          border-radius: 2px;
          opacity: 0.25;
        }
        .feat-rule {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .feat-rule-bar {
          width: 36px;
          height: 3px;
          background: var(--r);
          border-radius: 3px;
        }
        .feat-rule-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--r);
          opacity: 0.35;
        }
        @media (min-width: 768px) {
          .feat-section { padding: 96px 0; }
          .prop-view-all { display: inline-flex; }
        }
        @media (max-width: 767px) {
          .prop-view-all { display: none; }
        }
        .feat-empty {
          text-align: center;
          padding: 80px 20px;
          border: 1.5px dashed #e8e8e8;
          border-radius: 14px;
          background: #fafafa;
        }
        .feat-empty-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
        }
        .feat-empty-icon svg { width: 22px; height: 22px; color: #ccc; }
        .feat-empty p { color: #aaa; font-size: 14px; font-weight: 500; margin: 0; }
      `}</style>

      <section className="feat-section">
        <div className="feat-bg-dots" />
        <div className="feat-glow" />

        <div className="feat-inner">
          {/* Header */}
          <div className="feat-header">
            <div>
              <div className="feat-label">
                <span className="feat-label-pip">
                  <svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                </span>
                <span className="feat-label-text">Handpicked for you</span>
              </div>
              <h2 className="feat-title">
                Featured <mark>Properties</mark>
              </h2>
              <div className="feat-rule">
                <div className="feat-rule-bar" />
                <div className="feat-rule-dot" />
                <div className="feat-rule-dot" />
              </div>
            </div>

            <Link to="/properties?type=featured-properties" className="prop-view-all">
              <span>View All</span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>

          {/* Row 1 */}
          {allProduct.length > 0 && (
            <div className="prop-carousel-wrap">
              <Carousel
                responsive={responsive}
                customRightArrow={<CustomRightArrow />}
                customLeftArrow={<CustomLeftArrow />}
                className="py-3 md:pb-10"
              >
                {allProduct.slice(0, 4).map((product, index) => (
                  <div key={index} className="prop-card-slot">
                    <FearuredCard product={product} />
                  </div>
                ))}
              </Carousel>
            </div>
          )}

          {/* Row 2 */}
          {allProduct.length > 4 && (
            <div className="prop-carousel-wrap prop-row-gap">
              <Carousel
                responsive={responsive}
                customRightArrow={<CustomRightArrow />}
                customLeftArrow={<CustomLeftArrow />}
                className="py-3 md:pb-10"
              >
                {allProduct.slice(4).map((product, index) => (
                  <div key={index} className="prop-card-slot">
                    <FearuredCard product={product} />
                  </div>
                ))}
              </Carousel>

              <div className="prop-mobile-cta">
                <Link to="/properties?type=featured-properties" className="prop-mobile-btn">
                  View All Properties
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* Empty state */}
          {allProduct.length === 0 && (
            <div className="feat-empty">
              <div className="feat-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p>No featured properties at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Featured;