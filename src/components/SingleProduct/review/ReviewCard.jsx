import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({
  review = {},
  onDelete,
  onEdit,
  isOwn = false,
}) => {
  const [liked, setLiked]   = useState(review.liked || false);
  const [likes, setLikes]   = useState(review.likes || 0);

  const {
    author_name = "Anonymous",
    author_image,
    created_at,
    comment = "",
    rating = 0,
  } = review;

  const initials = author_name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const timeAgo = created_at
    ? new Date(created_at).toLocaleDateString("en-NP", {
        year: "numeric", month: "short", day: "numeric",
      })
    : "Recently";

  const handleLike = () => {
    setLiked(p => !p);
    setLikes(p => liked ? p - 1 : p + 1);
  };

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #f3f4f6",
      borderRadius: "12px",
      padding: "16px 18px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      transition: "border-color 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "var(--r14)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.05)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#f3f4f6";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>

        {/* Avatar + meta */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
          <div style={{
            width: "38px", height: "38px",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            background: "var(--r14)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: "700",
            color: "var(--r)",
            border: "1.5px solid var(--r14)",
          }}>
            {author_image
              ? <img src={author_image} alt={author_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : initials
            }
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--d)", lineHeight: 1.2 }}>
              {author_name}
            </div>
            <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>
              {timeAgo}
            </div>
          </div>
        </div>

        {/* Rating stars */}
        {rating > 0 && (
          <div style={{ display: "flex", gap: "2px", flexShrink: 0 }}>
            {[1,2,3,4,5].map(s => (
              <FaStar key={s} style={{
                fontSize: "11px",
                color: s <= rating ? "#f59e0b" : "#e5e7eb",
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Comment text */}
      <p style={{
        fontSize: "13px",
        color: "var(--d)",
        opacity: 0.78,
        lineHeight: "1.7",
        margin: 0,
      }}>
        {comment || "No comment provided."}
      </p>

      {/* Bottom row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "8px",
        borderTop: "1px solid #f9fafb",
      }}>
        {/* Like button */}
        <button
          onClick={handleLike}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            background: liked ? "var(--r06)" : "transparent",
            border: `1px solid ${liked ? "var(--r14)" : "#e5e7eb"}`,
            borderRadius: "20px",
            padding: "4px 12px",
            fontSize: "12px",
            fontWeight: "600",
            color: liked ? "var(--r)" : "#6b7280",
            cursor: "pointer",
            transition: "all 0.18s",
          }}
        >
          {liked
            ? <AiFillHeart style={{ fontSize: "13px" }} />
            : <AiOutlineHeart style={{ fontSize: "13px" }} />
          }
          {likes > 0 && <span>{likes}</span>}
          <span>Helpful</span>
        </button>

        {/* Owner actions */}
        {isOwn && (
          <div style={{ display: "flex", gap: "6px" }}>
            {onEdit && (
              <button
                onClick={onEdit}
                style={{
                  fontSize: "11px", fontWeight: "700",
                  color: "var(--d)", background: "#f3f4f6",
                  border: "none", borderRadius: "6px",
                  padding: "5px 12px", cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                style={{
                  fontSize: "11px", fontWeight: "700",
                  color: "var(--r)", background: "var(--r06)",
                  border: "none", borderRadius: "6px",
                  padding: "5px 12px", cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;