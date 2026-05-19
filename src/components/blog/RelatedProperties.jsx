import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../index.css';

const resolveImg = (src) => {
  if (!src) return null;
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  const base = (process.env.REACT_APP_API_LINK || '').replace(/\/api$/, '');
  if (src.startsWith('/')) return `${base}${src}`;
  return `${base}/storage/${src}`;
};

const RelatedProperties = ({ properties }) => {
  const [imgErrors, setImgErrors] = useState({});

  if (!properties?.length) return null;

  return (
    <>
      <style>{`
        .rp-wrap {
          margin-top: 40px;
          padding-top: 28px;
          border-top: 1px solid #f0f0f0;
        }

        .rp-header {
          display: flex; align-items: center; gap: 8px; margin-bottom: 18px;
        }
        .rp-title {
          font-size: 14px; font-weight: 700; color: var(--d);
          letter-spacing: 0.05em; text-transform: uppercase;
        }
        .rp-count { font-size: 11px; color: #bbb; }

        .rp-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background: #f0f0f0;
          border: 1px solid #f0f0f0;
        }
        @media(min-width: 480px) { .rp-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(min-width: 768px) { .rp-grid { grid-template-columns: repeat(3, 1fr); } }

        .rp-card {
          display: block; text-decoration: none;
          background: #fff;
          transition: opacity 0.18s;
        }
        .rp-card:hover { opacity: 0.85; }

        .rp-img-wrap {
          position: relative; height: 130px; overflow: hidden; background: #f5f5f5;
        }
        .rp-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .rp-card:hover .rp-img { transform: scale(1.04); }

        .rp-img-placeholder {
          width: 100%; height: 100%; background: #f5f5f5;
          display: flex; align-items: center; justify-content: center;
          font-size: 28px;
        }

        .rp-badge {
          position: absolute; top: 8px; left: 8px;
          background: var(--r); color: #fff;
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 2px 8px;
        }

        .rp-body { padding: 11px 12px; }
        .rp-prop-title {
          font-size: 12px; font-weight: 700; color: var(--d);
          margin-bottom: 5px; line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .rp-price {
          font-size: 13px; font-weight: 700; color: var(--r); margin-bottom: 4px;
        }
        .rp-location {
          font-size: 11px; color: #bbb;
          display: flex; align-items: center; gap: 3px;
        }
        .rp-view-btn {
          display: block; width: 100%;
          margin-top: 9px; padding: 6px;
          border: 1px solid #e8e8e8;
          color: #888; font-size: 11px; font-weight: 700;
          text-align: center; letter-spacing: 0.04em;
          transition: border-color 0.18s, color 0.18s;
          box-sizing: border-box;
        }
        .rp-card:hover .rp-view-btn { border-color: var(--r); color: var(--r); }
      `}</style>

      <div className="rp-wrap">
        <div className="rp-header">
          <h3 className="rp-title">Related Properties</h3>
          <span className="rp-count">{properties.length}</span>
        </div>

        <div className="rp-grid">
          {properties.map(prop => {
            const imgSrc = !imgErrors[prop.id] ? resolveImg(prop.thumbnail || prop.image || prop.photo) : null;
            return (
              <Link key={prop.id} to={`/property/${prop.id}`} className="rp-card">
                <div className="rp-img-wrap">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={prop.title || 'Property'}
                      className="rp-img"
                      onError={() => setImgErrors(p => ({ ...p, [prop.id]: true }))}
                    />
                  ) : (
                    <div className="rp-img-placeholder">🏠</div>
                  )}
                  {prop.property_type && (
                    <span className="rp-badge">{prop.property_type}</span>
                  )}
                </div>
                <div className="rp-body">
                  <p className="rp-prop-title">{prop.title || prop.name || 'Property'}</p>
                  <p className="rp-price">
                    {prop.price
                      ? `NPR ${Number(prop.price).toLocaleString()}`
                      : 'Price on request'}
                  </p>
                  {(prop.location || prop.city || prop.address) && (
                    <span className="rp-location">
                      📍 {prop.location || prop.city || prop.address}
                    </span>
                  )}
                  <span className="rp-view-btn">View Property →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default RelatedProperties;