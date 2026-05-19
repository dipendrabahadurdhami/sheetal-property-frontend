import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../index.css';

const storageUrl = (path) => {
  if (!path) return null;
  const base = (process.env.REACT_APP_API_LINK || '').replace(/\/api$/, '');
  return `${base}/storage/${path}`;
};

const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Draft';

const BlogCard = ({ blog, isLast = false }) => {
  const [imgErr, setImgErr] = useState(false);
  const thumb = !imgErr && blog.thumbnail ? storageUrl(blog.thumbnail) : null;
  const authorInitial = blog.author?.first_name?.[0]?.toUpperCase() || 'A';

  return (
    <>
      <style>{`
        .bc {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 14px;
          padding: 18px 0;
          border-bottom: ${isLast ? 'none' : '1px solid #f2f2f2'};
          text-decoration: none;
          color: inherit;
          transition: background 0.18s;
        }
        @media(min-width: 480px) {
          .bc { grid-template-columns: 140px 1fr; gap: 18px; padding: 22px 0; }
        }
        @media(min-width: 640px) {
          .bc { grid-template-columns: 200px 1fr; gap: 24px; padding: 24px 0; }
        }

        .bc-thumb {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          height: 90px;
          flex-shrink: 0;
          background: #f5f5f5;
        }
        @media(min-width: 480px) { .bc-thumb { height: 110px; } }
        @media(min-width: 640px) { .bc-thumb { height: 138px; } }

        .bc-thumb img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .bc:hover .bc-thumb img { transform: scale(1.06); }

        .bc-no-img {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #ffeaea 0%, #ffe0e0 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
        }

        .bc-cat-badge {
          position: absolute; top: 8px; left: 8px;
          background: var(--r); color: #fff;
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 3px 9px; border-radius: 4px;
          text-decoration: none; white-space: nowrap;
        }

        .bc-body {
          display: flex; flex-direction: column;
          justify-content: space-between;
          min-width: 0;
          padding: 2px 0;
        }

        .bc-meta-row {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
          margin-bottom: 7px;
        }
        .bc-meta-date { font-size: 11px; color: #bbb; }
        .bc-meta-views { font-size: 11px; color: #bbb; }
        .bc-meta-dot {
          width: 3px; height: 3px; border-radius: 50%; background: #ddd;
        }

        .bc-title {
          font-size: 14px; font-weight: 700;
          color: var(--d); line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.2s;
          margin-bottom: 8px;
          letter-spacing: -0.1px;
        }
        @media(min-width: 480px) { .bc-title { font-size: 15px; } }
        @media(min-width: 640px) { .bc-title { font-size: 17px; -webkit-line-clamp: 3; } }
        .bc:hover .bc-title { color: var(--r); }

        .bc-excerpt {
          font-size: 13px; color: #888; line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 12px;
        }
        @media(max-width: 479px) { .bc-excerpt { display: none; } }

        .bc-footer {
          display: flex; align-items: center;
          justify-content: space-between;
          gap: 8px; flex-wrap: wrap;
        }

        .bc-author {
          display: flex; align-items: center; gap: 7px;
        }
        .bc-author-avatar {
          width: 26px; height: 26px; border-radius: 50%;
          background: linear-gradient(135deg, var(--r), #ff6b6b);
          color: #fff; font-size: 11px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .bc-author-name {
          font-size: 12px; color: #666; font-weight: 600;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 100px;
        }
        @media(min-width: 480px) { .bc-author-name { max-width: 140px; } }

        .bc-read-btn {
          display: inline-flex; align-items: center; gap: 5px;
          color: var(--r); font-size: 12px; font-weight: 700;
          text-decoration: none; white-space: nowrap;
          padding: 5px 14px;
          border: 1.5px solid var(--r);
          border-radius: 4px;
          transition: all 0.22s;
          flex-shrink: 0;
          /* Prevent the outer Link from double-navigating on this button */
          pointer-events: none;
        }
        .bc:hover .bc-read-btn { background: var(--r); color: #fff; }
        .bc-read-arrow { transition: transform 0.22s; }
        .bc:hover .bc-read-arrow { transform: translateX(3px); }
      `}</style>

      {/* ✅ The whole card is now a Link — clicking anywhere navigates */}
      <Link to={`/blog/${blog.slug}`} className="bc">

        {/* Thumbnail */}
        <div className="bc-thumb">
          {thumb
            ? <img src={thumb} alt={blog.title} onError={() => setImgErr(true)} />
            : <div className="bc-no-img">🏠</div>
          }
          {/* ✅ Category badge needs stopPropagation so it navigates to category, not post */}
          {blog.category && (
            <Link
              to={`/blog/category/${blog.category.slug}`}
              className="bc-cat-badge"
              onClick={(e) => e.stopPropagation()}
            >
              {blog.category.name}
            </Link>
          )}
        </div>

        {/* Body */}
        <div className="bc-body">
          <div>
            <div className="bc-meta-row">
              <span className="bc-meta-date">{fmt(blog.published_at)}</span>
              <span className="bc-meta-dot" />
              <span className="bc-meta-views">{(blog.views || 0).toLocaleString()} views</span>
            </div>
            {/* ✅ Title is now a <span> — can't nest <a> inside <a> */}
            <span className="bc-title">{blog.title}</span>
            {blog.excerpt && (
              <p className="bc-excerpt">{blog.excerpt}</p>
            )}
          </div>
          <div className="bc-footer">
            {blog.author && (
              <div className="bc-author">
                <div className="bc-author-avatar">{authorInitial}</div>
                <span className="bc-author-name">
                  {blog.author.first_name} {blog.author.last_name}
                </span>
              </div>
            )}
            {/* ✅ Read button is now a visual-only element (pointer-events: none) */}
            <span className="bc-read-btn">
              Read <span className="bc-read-arrow">→</span>
            </span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default BlogCard;