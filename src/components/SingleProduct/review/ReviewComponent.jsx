import React, { useState } from "react";
import ReviewCard from "./ReviewCard";
import { FaStar, FaPaperPlane } from "react-icons/fa";
import { BiUserCircle } from "react-icons/bi";

/* ─── Static sample reviews (replace with API data) ─── */
const SAMPLE_REVIEWS = [
  {
    id: 1,
    author_name: "Ram Sharma",
    created_at: "2026-04-15",
    comment: "Beautiful property near the ring road. Friendly neighbourhood and well-maintained surroundings. Highly recommend visiting in person.",
    rating: 5,
    likes: 12,
  },
  {
    id: 2,
    author_name: "Sita Thapa",
    created_at: "2026-03-28",
    comment: "Good location and fair pricing. The road access is convenient. Visited twice — very satisfied with the details provided.",
    rating: 4,
    likes: 5,
  },
];

/* ─── Star Rating Input ─── */
const StarRating = ({ value, onChange }) => (
  <div style={{ display: "flex", gap: "4px" }}>
    {[1, 2, 3, 4, 5].map(s => (
      <button
        key={s}
        type="button"
        onClick={() => onChange(s)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "2px",
          transition: "transform 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        <FaStar style={{
          fontSize: "18px",
          color: s <= value ? "#f59e0b" : "#e5e7eb",
          transition: "color 0.15s",
        }} />
      </button>
    ))}
  </div>
);

/* ─── Main ─── */
const ReviewComponent = ({ propertyId }) => {
  const [reviews, setReviews]     = useState(SAMPLE_REVIEWS);
  const [comment, setComment]     = useState("");
  const [rating, setRating]       = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [ratingErr, setRatingErr]  = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    if (rating === 0) { setRatingErr(true); return; }
    setRatingErr(false);
    setSubmitting(true);

    // TODO: replace with real API call
    await new Promise(r => setTimeout(r, 800));

    const newReview = {
      id: Date.now(),
      author_name: "You",
      created_at: new Date().toISOString(),
      comment: comment.trim(),
      rating,
      likes: 0,
    };
    setReviews(prev => [newReview, ...prev]);
    setComment("");
    setRating(0);
    setSubmitting(false);
  };

  return (
    <div style={{
      borderTop: "2px solid #e5e7eb",
      paddingTop: "2rem",
      marginBottom: "2rem",
    }}>
      {/* Section Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            width: "4px", height: "22px",
            background: "var(--r)",
            borderRadius: "2px",
            display: "inline-block",
          }} />
          <span style={{
            fontSize: "clamp(18px,2.5vw,22px)",
            fontWeight: "700",
            color: "var(--d)",
          }}>
            Reviews
          </span>
        </div>
        <span style={{
          fontSize: "12px",
          color: "#9ca3af",
          fontWeight: "600",
        }}>
          {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Comment Input Box ── */}
      <div style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "18px",
        marginBottom: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}>
        {/* Avatar + textarea row */}
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <div style={{
            width: "36px", height: "36px",
            borderRadius: "50%",
            background: "var(--r06)",
            border: "1.5px solid var(--r14)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <BiUserCircle style={{ fontSize: "20px", color: "var(--r)" }} />
          </div>

          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your experience with this property…"
            rows={3}
            style={{
              flex: 1,
              resize: "none",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "13px",
              color: "var(--d)",
              lineHeight: "1.65",
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
              fontFamily: "inherit",
              background: "#fafafa",
            }}
            onFocus={e => {
              e.target.style.borderColor = "var(--r)";
              e.target.style.boxShadow = "0 0 0 3px var(--r06)";
              e.target.style.background = "#fff";
            }}
            onBlur={e => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.boxShadow = "none";
              e.target.style.background = "#fafafa";
            }}
          />
        </div>

        {/* Rating + Submit row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          paddingLeft: "48px",
        }}>
          <div>
            <div style={{
              fontSize: "11px",
              fontWeight: "600",
              color: ratingErr ? "var(--r)" : "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "5px",
            }}>
              {ratingErr ? "Please select a rating" : "Your Rating"}
            </div>
            <StarRating value={rating} onChange={v => { setRating(v); setRatingErr(false); }} />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!comment.trim() || submitting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 22px",
              background: !comment.trim() || submitting ? "#e5e7eb" : "var(--r)",
              color: !comment.trim() || submitting ? "#9ca3af" : "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: !comment.trim() || submitting ? "not-allowed" : "pointer",
              transition: "background 0.2s, transform 0.15s",
            }}
            onMouseEnter={e => { if (comment.trim() && !submitting) e.currentTarget.style.background = "var(--rd)"; }}
            onMouseLeave={e => { if (comment.trim() && !submitting) e.currentTarget.style.background = "var(--r)"; }}
          >
            <FaPaperPlane style={{ fontSize: "12px" }} />
            {submitting ? "Posting…" : "Post Review"}
          </button>
        </div>
      </div>

      {/* ── Reviews list ── */}
      {reviews.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "48px 20px",
          border: "1px dashed #e5e7eb",
          borderRadius: "12px",
          color: "#9ca3af",
          fontSize: "13px",
        }}>
          No reviews yet. Be the first to share your experience.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {reviews.map(r => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewComponent;