import axios from "axios";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import { Link } from "react-router-dom";
import FearuredCard from "../card/FearuredCard";
import { CustomLeftArrow, CustomRightArrow } from "../carousel/CustomeButton";
import { responsive } from "../carousel/Responsive";

const LatestProperties = () => {
  const [allProduct, setAllProduct] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_LINK}/all-properties`
        );
        setAllProduct(res.data.data || []);
      } catch (err) {}
    })();
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
        .prop-mobile-btn:active { background: var(--r); color: #fff; }
        @media (min-width: 768px) { .prop-mobile-cta { display: none; } }

        /* ─── Shared carousel wrap ─────────────────────────────────── */
        .prop-carousel-wrap { margin: 0 -10px; }
        .prop-card-slot { padding: 0 10px 4px; height: 100%; }
        .prop-row-gap { margin-top: 12px; }

        /* ─── Latest section ───────────────────────────────────────── */
        .latest-section {
          position: relative;
          padding: 72px 0;
          overflow: hidden;
          background: linear-gradient(180deg, #f9f8f6 0%, #fff 60%);
        }
        .latest-stripe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, var(--r) 0%, transparent 60%);
        }
        .latest-deco-ring {
          position: absolute;
          right: -100px;
          bottom: -100px;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          border: 56px solid rgba(180,20,20,0.035);
          pointer-events: none;
          z-index: 0;
        }
        .latest-deco-ring-sm {
          position: absolute;
          right: 60px;
          bottom: 60px;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          border: 24px solid rgba(180,20,20,0.03);
          pointer-events: none;
          z-index: 0;
        }
        .latest-inner {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .latest-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 44px;
          gap: 16px;
        }
        .latest-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .latest-eyebrow-line {
          width: 28px;
          height: 2px;
          background: var(--r);
          border-radius: 2px;
          flex-shrink: 0;
        }
        .latest-eyebrow-text {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--r);
        }
        .latest-eyebrow-badge {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: var(--r);
          color: #fff;
          padding: 2px 7px;
          border-radius: 4px;
          line-height: 1.5;
          flex-shrink: 0;
        }
        .latest-title {
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin: 0 0 14px;
          font-family: Georgia, 'Times New Roman', serif;
        }
        .latest-title-main { color: #0d0d0d; }
        .latest-title-accent { color: var(--r); font-style: italic; }
        .latest-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .latest-meta-bar {
          width: 36px;
          height: 3px;
          background: var(--r);
          border-radius: 3px;
          flex-shrink: 0;
        }
        .latest-count {
          font-size: 12px;
          font-weight: 600;
          color: #999;
        }
        .latest-count strong { color: #333; font-weight: 800; }
        @media (min-width: 768px) {
          .latest-section { padding: 96px 0; }
          .prop-view-all { display: inline-flex; }
        }
        @media (max-width: 767px) {
          .prop-view-all { display: none; }
        }
        .latest-empty {
          text-align: center;
          padding: 80px 20px;
          border: 1.5px dashed #e0e0e0;
          border-radius: 14px;
          background: #fafafa;
        }
        .latest-empty svg {
          width: 40px;
          height: 40px;
          color: #ccc;
          margin: 0 auto 12px;
          display: block;
        }
        .latest-empty p { color: #bbb; font-size: 14px; font-weight: 500; margin: 0; }
      `}</style>

      <section className="latest-section">
        <div className="latest-stripe" />
        <div className="latest-deco-ring" />
        <div className="latest-deco-ring-sm" />

        <div className="latest-inner">
          {/* Header */}
          <div className="latest-header">
            <div>
              <div className="latest-eyebrow">
                <div className="latest-eyebrow-line" />
                <span className="latest-eyebrow-text">Fresh on market</span>
                <span className="latest-eyebrow-badge">New</span>
              </div>
              <h2 className="latest-title">
                <span className="latest-title-main">Latest </span>
                <span className="latest-title-accent">Properties</span>
              </h2>
              <div className="latest-meta">
                <div className="latest-meta-bar" />
                {allProduct.length > 0 && (
                  <span className="latest-count">
                    <strong>{allProduct.length}</strong>{" "}
                    {allProduct.length === 1 ? "listing" : "listings"} available
                  </span>
                )}
              </div>
            </div>

            <Link
              to="/properties?type=latest-properties"
              className="prop-view-all"
            >
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
                {allProduct.slice(0, 4).map((product, i) => (
                  <div key={i} className="prop-card-slot">
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
                {allProduct.slice(4).map((product, i) => (
                  <div key={i} className="prop-card-slot">
                    <FearuredCard product={product} />
                  </div>
                ))}
              </Carousel>

              <div className="prop-mobile-cta">
                <Link
                  to="/properties?type=latest-properties"
                  className="prop-mobile-btn"
                >
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
            <div className="latest-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p>No latest properties at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default LatestProperties;