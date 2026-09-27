import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoHeartOutline } from "react-icons/io5";
import { fetchFavoritesList, removeFavoriteList } from "../../features/slices/favourites";
import apiClient from "../../utils/apiClient";
import PropertyCard, { PropertyCardStyles, PropertyGrid, PropertyCardSkeleton } from "../card/PropertyCard";

const Properties = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const user      = useSelector((s) => s.user);
  const favorites = useSelector((s) => s.favorites);

  useEffect(() => {
    if (user.data) dispatch(fetchFavoritesList());
  }, []);

  const removeFromFav = async (propertyId) => {
    if (!window.confirm("Remove from favourites?")) return;
    dispatch(removeFavoriteList(propertyId));
    try {
      await apiClient.post("/remove-from-favourite", { property_id: propertyId });
      toast.success("Removed from favourites.");
      dispatch(fetchFavoritesList());
    } catch { toast.error("Failed to remove."); }
  };

  const items = favorites.data || [];

  return (
    <div>
      <PropertyCardStyles />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0F172A" }}>Favourite Properties</h2>
        {!favorites.isLoading && <span style={{ fontSize: 11, color: "#9ca3af" }}>{items.length} saved</span>}
      </div>

      {favorites.isLoading && (
        <PropertyGrid>
          {Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
        </PropertyGrid>
      )}

      {!favorites.isLoading && items.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 20px", border: "0.5px dashed #E9EAEC", borderRadius: 8 }}>
          <IoHeartOutline size={36} color="#E9EAEC" style={{ display: "block", margin: "0 auto 12px" }} />
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>No saved properties</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>Browse properties and tap the heart to save them</div>
          <button onClick={() => navigate("/productSearch")}
            style={{ padding: "9px 20px", background: "#e02424", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            Browse Properties
          </button>
        </div>
      )}

      {!favorites.isLoading && items.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item) => (
            <div key={item.property_id}>
              {/* Use the shared card — pass property data */}
              <PropertyCard property={{ ...item, id: item.property_id }} />
              <div style={{ display: "flex", justifyContent: "flex-end", padding: "6px 0 2px" }}>
                <button onClick={() => removeFromFav(item.property_id)}
                  style={{ padding: "5px 14px", background: "#fee2e2", border: "0.5px solid #fca5a5", borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: "pointer", color: "#991b1b" }}>
                  Remove from Favourites
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties;