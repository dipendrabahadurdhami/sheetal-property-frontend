import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../index.css";
import blogApi from "../../utils/blogApi";

/* ─── helpers ─────────────────────────────────────── */
const thumb = (path) =>
  path
    ? `${(process.env.REACT_APP_API_LINK || "").replace(/\/api$/, "")}/storage/${path}`
    : null;

/* ─── BlogStrip ───────────────────────────────────── */
const BlogStrip = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgsReady, setImgsReady] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (!blogs.length) return;
    const srcs = blogs.map(b => thumb(b.thumbnail)).filter(Boolean);
    if (!srcs.length) { setImgsReady(true); return; }
    let loaded = 0;
    srcs.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded += 1;
        if (loaded >= srcs.length) setImgsReady(true);
      };
      img.src = src;
    });
  }, [blogs]);

  const fetchBlogs = async () => {
    try {
      const res = await blogApi.getRecent();
      if (res.status === 200) {
        const data = res?.data?.data || res?.data || [];
        setBlogs(Array.isArray(data) ? data.slice(0, 4) : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && (!blogs || blogs.length === 0)) return null;

  return (
    <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: "2rem", marginBottom: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <span className="text-xl sm:text-2xl font-bold">From Our Blog</span>
      </div>

      <style>{`
        .bs-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }
        @media (max-width: 899px) {
          .bs-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 559px) {
          .bs-grid {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            gap: 12px;
            padding-bottom: 8px;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }
          .bs-grid::-webkit-scrollbar { height: 4px; }
          .bs-grid::-webkit-scrollbar-track { background: #f3f4f6; border-radius: 4px; }
          .bs-grid::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
          .bs-card {
            min-width: 230px;
            max-width: 230px;
            scroll-snap-align: start;
          }
        }
      `}</style>

      <style>{`
        @keyframes bs-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .bs-skel {
          background: linear-gradient(90deg, #F1F2F4 25%, #E8E9EC 50%, #F1F2F4 75%);
          background-size: 600px 100%;
          animation: bs-shimmer 1.4s infinite linear;
          border-radius: 4px;
        }
      `}</style>

      {loading || !imgsReady ? (
        <div className="bs-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ borderRadius: 12, overflow: "hidden", background: "#fff", border: "1px solid #e5e7eb" }}>
              <div className="bs-skel" style={{ width: "100%", aspectRatio: "16/9", borderRadius: 0 }} />
              <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="bs-skel" style={{ height: 10, width: "35%", borderRadius: 20 }} />
                <div className="bs-skel" style={{ height: 13, width: "90%" }} />
                <div className="bs-skel" style={{ height: 13, width: "65%" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <div className="bs-skel" style={{ height: 10, width: "30%" }} />
                  <div className="bs-skel" style={{ height: 10, width: "20%" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
      <div className="bs-grid">
        {blogs.map((blog, i) => (
          <Link
            key={blog.id || i}
            to={`/blog/${blog.slug || blog.id}`}
            className="bs-card"
            style={{ textDecoration: "none", display: "block" }}
          >
            <BlogCard blog={blog} />
          </Link>
        ))}
      </div>
      )}
    </div>
  );
};

/* ─── BlogCard ────────────────────────────────────── */
const BlogCard = ({ blog }) => {
  const [hovered, setHovered] = useState(false);

  const thumbnailSrc = thumb(blog.thumbnail);

  const categoryLabel =
    blog.category?.name ||
    (typeof blog.category === "string" ? blog.category : null);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: hovered ? "1.5px solid var(--r, #e53935)" : "1px solid #e5e7eb",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#fff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.18s, transform 0.18s",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: "100%", aspectRatio: "16/9",
        overflow: "hidden", background: "#f3f4f6", flexShrink: 0,
      }}>
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={blog.title}
            loading="eager"
            fetchPriority="high"
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transition: "transform 0.3s",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: "var(--r06, #fef2f2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: "28px", color: "var(--r, #e53935)", opacity: 0.3 }}>✎</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{
        padding: "12px 14px 14px",
        display: "flex", flexDirection: "column", gap: "6px", flex: 1,
      }}>
        {categoryLabel && (
          <span style={{
            display: "inline-block",
            background: "var(--r06, #fef2f2)",
            color: "var(--r, #e53935)",
            fontSize: "9px", fontWeight: "700",
            textTransform: "uppercase", letterSpacing: "0.07em",
            padding: "2px 8px", borderRadius: "20px",
            alignSelf: "flex-start",
          }}>
            {categoryLabel}
          </span>
        )}

        <div style={{
          fontSize: "13px", fontWeight: "700",
          color: "var(--d, #111827)", lineHeight: "1.45",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {blog.title}
        </div>

        {blog.excerpt && (
          <div style={{
            fontSize: "11px", color: "#6b7280", lineHeight: "1.5",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {blog.excerpt}
          </div>
        )}

        <div style={{ marginTop: "auto", paddingTop: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {blog.created_at && (
            <span style={{ fontSize: "10px", color: "#9ca3af" }}>
              {new Date(blog.created_at).toLocaleDateString("en-NP", {
                year: "numeric", month: "short", day: "numeric",
              })}
            </span>
          )}
          <span style={{
            fontSize: "11px", color: "var(--r, #e53935)",
            fontWeight: "700", marginLeft: "auto",
          }}>
            Read more →
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogStrip;