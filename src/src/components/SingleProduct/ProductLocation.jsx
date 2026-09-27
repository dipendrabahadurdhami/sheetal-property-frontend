import React, { useEffect, useState } from "react";
import { GrLocation } from "react-icons/gr";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaTag, FaHome, FaShareAlt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import {
  removeFavoriteList,
  setFavoritesList,
} from "../../features/slices/favourites";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../../utils/apiClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProductLocation = ({ property }) => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const [favorite, setFavorite] = useState(false);
  const [sharing,  setSharing]  = useState(false);
  const favorites = useSelector((s) => s.favorites.data);
  const user      = useSelector((s) => s.user);
  const token     = localStorage.getItem("sheetal_token");

  useEffect(() => {
    if (favorites?.find((item) => item.property_id === property.id)) {
      setFavorite(true);
    }
  }, [favorites]);

  useEffect(() => {
    if (!user.data) setFavorite(false);
  }, [user]);

  const onFavoriteClick = (e) => {
    e.preventDefault();
    if (!user.data && !token) return navigate("?login=1");
    const exists = favorites.find((item) => item.property_id === property.id);
    if (exists) {
      setFavorite(false);
      dispatch(removeFavoriteList(property.id));
      apiClient.post("/remove-from-favourite", { property_id: property.id })
        .then(() => toast.success("Removed from favourites"))
        .catch(console.error);
    } else {
      setFavorite(true);
      dispatch(setFavoritesList(property.id));
      apiClient.post("/add-to-favourite", { property_id: property.id })
        .then(() => toast.success("Added to favourites"))
        .catch(console.error);
    }
  };

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: property.name, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setSharing(true);
        setTimeout(() => setSharing(false), 2000);
        toast.success("Link copied!");
      }
    } catch {}
  };

  return (
    <div style={{ marginBottom: "20px" }}>

      {/* ── Badge row ── */}
      <div style={{
        display: "flex", alignItems: "center",
        flexWrap: "wrap", gap: "8px",
        marginBottom: "10px",
      }}>
        {property.purpose && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "var(--r)", color: "#fff",
            fontSize: "10px", fontWeight: "700",
            textTransform: "uppercase", letterSpacing: "0.1em",
            padding: "3px 10px", borderRadius: "20px",
          }}>
            <FaTag style={{ fontSize: "8px" }} />
            For {property.purpose?.name || property.purpose}
          </span>
        )}
        {property.propertycategory && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "var(--r06)",
            border: "1px solid var(--r14)",
            color: "var(--r)",
            fontSize: "10px", fontWeight: "700",
            textTransform: "uppercase", letterSpacing: "0.08em",
            padding: "3px 10px", borderRadius: "20px",
          }}>
            <FaHome style={{ fontSize: "8px" }} />
            {property.propertycategory}
          </span>
        )}
        {property.property_code && (
          <span style={{
            fontSize: "10px", fontWeight: "600",
            color: "#9ca3af",
            background: "#f3f4f6",
            padding: "3px 10px", borderRadius: "20px",
            letterSpacing: "0.05em",
          }}>
            #{property.property_code}
          </span>
        )}
      </div>

      {/* ── Title row ── */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap",
      }}>

        {/* Title + location */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{
            fontSize: "clamp(20px, 2.8vw, 30px)",
            fontWeight: "800",
            color: "var(--d)",
            lineHeight: 1.15,
            letterSpacing: "-0.4px",
            marginBottom: "8px",
          }}>
            {property.name}
          </h1>

          <div style={{
            display: "flex", alignItems: "center",
            flexWrap: "wrap", gap: "6px",
            fontSize: "13px", color: "#6b7280",
          }}>
            <GrLocation style={{ color: "var(--r)", fontSize: "13px", flexShrink: 0 }} />
            <span>{property.property_location}</span>
            {property.property_type && (
              <>
                <span style={{ color: "#d1d5db" }}>·</span>
                <span>{property.property_type}</span>
              </>
            )}
            {property.latitude && property.longitude && (
              <>
                <span style={{ color: "#d1d5db" }}>·</span>
                <a
                  href={`https://www.google.com/maps/@${property.latitude},${property.longitude},15.42z`}
                  target="_blank" rel="noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "3px",
                    color: "var(--r)", fontWeight: "600", fontSize: "12px",
                    textDecoration: "none", borderBottom: "1px solid var(--r14)",
                    paddingBottom: "1px",
                  }}
                >
                  View on Map
                </a>
              </>
            )}
          </div>
        </div>

        {/* Price + actions */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "flex-end", gap: "10px",
          flexShrink: 0,
        }}>
          {/* Price */}
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontSize: "10px", fontWeight: "700",
              color: "#9ca3af", textTransform: "uppercase",
              letterSpacing: "0.08em", marginBottom: "2px",
            }}>
              Asking Price
            </div>
            <div style={{
              fontSize: "clamp(20px,2.5vw,28px)",
              fontWeight: "800",
              color: "var(--r)",
              letterSpacing: "-0.5px",
              lineHeight: 1,
            }}>
              Rs. {property.total_price
                ? Number(property.total_price).toLocaleString()
                : property.total_price}
            </div>
            {property.rent_per_month && (
              <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>
                or Rs. {Number(property.rent_per_month).toLocaleString()}/mo
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "8px" }}>
            {/* Share */}
            <button
              onClick={onShare}
              title="Share"
              style={{
                width: "36px", height: "36px",
                borderRadius: "50%",
                border: "1.5px solid #e5e7eb",
                background: sharing ? "var(--r06)" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: sharing ? "var(--r)" : "#6b7280",
                cursor: "pointer",
                transition: "all 0.18s",
              }}
            >
              <FaShareAlt style={{ fontSize: "13px" }} />
            </button>

            {/* Favourite */}
            <button
              onClick={onFavoriteClick}
              title={favorite ? "Remove from favourites" : "Save to favourites"}
              style={{
                width: "36px", height: "36px",
                borderRadius: "50%",
                border: `1.5px solid ${favorite ? "var(--r)" : "#e5e7eb"}`,
                background: favorite ? "var(--r06)" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--r)",
                cursor: "pointer",
                transition: "all 0.18s",
              }}
            >
              {favorite
                ? <AiFillHeart style={{ fontSize: "18px" }} />
                : <AiOutlineHeart style={{ fontSize: "18px" }} />
              }
            </button>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{
        height: "1px",
        background: "linear-gradient(to right, var(--r14), transparent)",
        marginTop: "16px",
      }} />
    </div>
  );
};

export default ProductLocation;