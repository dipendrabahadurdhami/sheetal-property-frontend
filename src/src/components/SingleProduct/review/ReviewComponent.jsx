import React, { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";
import { FaStar, FaPaperPlane, FaSpinner } from "react-icons/fa";
import { BiUserCircle } from "react-icons/bi";
import { useSelector } from "react-redux";
import apiClient from "../../../utils/apiClient";
import { toast } from "react-toastify";

const StarRating = ({ value, onChange }) => (
  <div style={{ display: "flex", gap: "4px" }}>
    {[1, 2, 3, 4, 5].map(s => (
      <button key={s} type="button" onClick={() => onChange(s)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        <FaStar style={{ fontSize: "18px", color: s <= value ? "#f59e0b" : "#e5e7eb" }} />
      </button>
    ))}
  </div>
);

const ReviewComponent = ({ propertyId }) => {
  const user = useSelector((state) => state.user);
  const isLoggedIn = !!user?.data;

  const [reviews, setReviews]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [comment, setComment]         = useState("");
  const [rating, setRating]           = useState(0);
  const [submitting, setSubmitting]   = useState(false);
  const [ratingErr, setRatingErr]     = useState(false);
  const [avgRating, setAvgRating]     = useState(0);

  useEffect(() => {
    if (propertyId) fetchReviews();
  }, [propertyId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`reviews-public?type=property&property_id=${propertyId}`);
      const data = res.data?.data || [];
      setReviews(data);
      if (data.length > 0) {
        setAvgRating(Math.round((data.reduce((s, r) => s + r.rating, 0) / data.length) * 10) / 10);
      }
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) { toast.error("Please login to leave a review."); return; }
    if (!comment.trim()) return;
    if (rating === 0) { setRatingErr(true); return; }
    setRatingErr(false);
    setSubmitting(true);
    try {
      await apiClient.post("reviews", {
        type:        "property",
        rating:      rating,
        comment:     comment.trim(),
        property_id: propertyId,
      });
      toast.success("Review submitted! It will appear after admin approval.");
      setComment("");
      setRating(0);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit review.";
      if (err.response?.status === 403) toast.warning(msg);
      else if (err.response?.status === 422) toast.info(msg);
      else toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: "2rem", marginBottom: "2rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "4px", height: "22px", background: "var(--r)", borderRadius: "2px", display: "inline-block" }} />
          <span style={{ fontSize: "clamp(18px,2.5vw,22px)", fontWeight: "700", color: "var(--d)" }}>
            Property Reviews
          </span>
          {avgRating > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, background: "#fef9e7", border: "1px solid #f39c12", borderRadius: 20, padding: "2px 10px", fontSize: 13, fontWeight: 700, color: "#d68910" }}>
              <FaStar style={{ color: "#f59e0b", fontSize: 12 }} /> {avgRating}
            </span>
          )}
        </div>
        <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: "600" }}>
          {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Write Review Box */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "18px", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {!isLoggedIn ? (
          <div style={{ textAlign: "center", padding: "20px 0", color: "#7f8c8d", fontSize: 13 }}>
            Please <strong>login</strong> to leave a review
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--r06,#fef0f0)", border: "1.5px solid var(--r14,#fecaca)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {user?.data?.photo
                  ? <img src={user.data.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                  : <BiUserCircle style={{ fontSize: "20px", color: "var(--r,#e74c3c)" }} />
                }
              </div>
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Share your experience with this property…" rows={3}
                style={{ flex: 1, resize: "none", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", outline: "none", fontFamily: "inherit", background: "#fafafa" }}
                onFocus={e => { e.target.style.borderColor = "#e74c3c"; e.target.style.background = "#fff"; }}
                onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", paddingLeft: "48px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "600", color: ratingErr ? "#e74c3c" : "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "5px" }}>
                  {ratingErr ? "Please select a rating" : "Your Rating"}
                </div>
                <StarRating value={rating} onChange={v => { setRating(v); setRatingErr(false); }} />
              </div>
              <button onClick={handleSubmit} disabled={!comment.trim() || submitting}
                style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 22px", background: !comment.trim() || submitting ? "#e5e7eb" : "#e74c3c", color: !comment.trim() || submitting ? "#9ca3af" : "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: !comment.trim() || submitting ? "not-allowed" : "pointer" }}>
                {submitting ? <FaSpinner className="animate-spin" style={{ fontSize: 12 }} /> : <FaPaperPlane style={{ fontSize: "12px" }} />}
                {submitting ? "Posting…" : "Post Review"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Reviews list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <FaSpinner className="animate-spin" style={{ fontSize: 24, color: "#e74c3c" }} />
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", border: "1px dashed #e5e7eb", borderRadius: "12px", color: "#9ca3af", fontSize: "13px" }}>
          No reviews yet. Be the first to share your experience.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {reviews.map(r => (
            <ReviewCard key={r.id} review={{
              ...r,
              author_name: r.reviewer?.first_name
                ? `${r.reviewer.first_name} ${r.reviewer.last_name || ""}`.trim()
                : r.reviewer?.user_name || "Anonymous",
              author_image: r.reviewer?.photo || null,
            }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewComponent;