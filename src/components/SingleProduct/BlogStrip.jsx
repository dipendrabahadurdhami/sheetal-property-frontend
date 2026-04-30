import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../index.css";
import blogApi from "../../utils/blogApi";

const BlogStrip = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await blogApi.getRecent();
      if (res.status === 200) {
        const data = res?.data?.data || res?.data || [];
        setBlogs(Array.isArray(data) ? data.slice(0, 4) : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!blogs || blogs.length === 0) return null;

  return (
    <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: "2rem", marginBottom: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <span style={{
          width: "4px", height: "22px",
          background: "var(--r, #e53935)",
          borderRadius: "2px", display: "inline-block",
        }} />
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
    </div>
  );
};

const BlogCard = ({ blog }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: hovered
          ? "1.5px solid var(--r, #e53935)"
          : "1px solid #e5e7eb",
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
        {blog.thumbnail ? (
          <img
            src={blog.thumbnail}
            alt={blog.title}
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
        {blog.category && (
          <span style={{
            display: "inline-block",
            background: "var(--r06, #fef2f2)",
            color: "var(--r, #e53935)",
            fontSize: "9px", fontWeight: "700",
            textTransform: "uppercase", letterSpacing: "0.07em",
            padding: "2px 8px", borderRadius: "20px",
            alignSelf: "flex-start",
          }}>
            {blog.category}
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