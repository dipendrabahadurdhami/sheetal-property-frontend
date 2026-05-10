import axios from "axios";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import { Link } from "react-router-dom";
import FearuredCard from "../card/FearuredCard";
import { CustomLeftArrow, CustomRightArrow } from "../carousel/CustomeButton";
import { responsive } from "../carousel/Responsive";

const API_BASE = process.env.REACT_APP_API_LINK;

const Investment = () => {
  const [allProduct, setAllProduct] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/invest`);
        setAllProduct(res.data?.data || []);
      } catch (err) {
        console.error("API Error:", err);
      }
    })();
  }, []);

  if (allProduct.length === 0) return null;

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

        /* ─── Investment section ───────────────────────────────────── */
        .inv-section {
          position: relative;
          padding: 72px 0;
          overflow: hidden;
          background: #f7f6f4;
        }
        .inv-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }
        .inv-corner-word {
          position: absolute;
          right: -10px;
          top: 50%;
          transform: translateY(-50%) rotate(90deg);
          font-size: clamp(70px, 9vw, 120px);
          font-weight: 900;
          letter-spacing: 0.05em;
          color: rgba(0,0,0,0.028);
          pointer-events: none;
          font-family: Georgia, serif;
          white-space: nowrap;
          z-index: 0;
          user-select: none;
        }
        .inv-inner {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .inv-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 44px;
          gap: 16px;
        }
        .inv-tag {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 14px;
        }
        .inv-tag-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--r);
          animation: inv-pulse 2.4s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes inv-pulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(180,20,20,0.4); }
          50% { opacity: 0.7; transform: scale(0.8); box-shadow: 0 0 0 4px rgba(180,20,20,0); }
        }
        .inv-tag-text {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--r);
        }
        .inv-title {
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 900;
          line-height: 1.1;
          color: #111;
          font-family: Georgia, 'Times New Roman', serif;
          letter-spacing: -0.025em;
          margin: 0 0 14px;
        }
        .inv-title em {
          font-style: italic;
          color: var(--r);
        }
        .inv-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .inv-rule {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .inv-rule-bar {
          width: 36px;
          height: 3px;
          background: linear-gradient(90deg, var(--r), transparent);
          border-radius: 3px;
        }
        .inv-count {
          font-size: 12px;
          font-weight: 600;
          color: #888;
        }
        .inv-count strong { color: var(--r); font-weight: 800; }
        @media (min-width: 768px) {
          .inv-section { padding: 96px 0; }
          .prop-view-all { display: inline-flex; }
        }
        @media (max-width: 767px) {
          .prop-view-all { display: none; }
        }
      `}</style>

      <section className="inv-section">
        <div className="inv-noise" />
        <div className="inv-corner-word">INVEST</div>

        <div className="inv-inner">
          {/* Header */}
          <div className="inv-header">
            <div>
              <div className="inv-tag">
                <span className="inv-tag-dot" />
                <span className="inv-tag-text">Grow your wealth</span>
              </div>
              <h2 className="inv-title">
                Investment <em>Properties</em>
              </h2>
              <div className="inv-meta">
                <div className="inv-rule">
                  <div className="inv-rule-bar" />
                </div>
                <span className="inv-count">
                  <strong>{allProduct.length}</strong>{" "}
                  {allProduct.length === 1 ? "property listed" : "properties listed"}
                </span>
              </div>
            </div>

            <Link
              to="/productSearch?advertisement_purpose=Invest"
              className="prop-view-all"
            >
              <span>View All</span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>

          {/* Row 1 */}
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
                  to="/productSearch?advertisement_purpose=Invest"
                  className="prop-mobile-btn"
                >
                  View All Properties
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Investment;