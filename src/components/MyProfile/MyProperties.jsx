import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import apiClient from "../../utils/apiClient";
import PropertyCard, { PropertyCardStyles, PropertyGrid, PropertyCardSkeleton } from "../card/PropertyCard";

const MyProperties = () => {
  const [loading, setLoading]       = useState(false);
  const [properties, setProperties] = useState([]);
  const user                        = useSelector((s) => s.user);
  const navigate                    = useNavigate();

  useEffect(() => { fetchProperties(); }, [user]);

  const fetchProperties = async () => {
    if (!user.data) return;
    setLoading(true);
    try {
      const res = await apiClient.get("user-property");
      setProperties(res.data.data || []);
    } catch { }
    finally { setLoading(false); }
  };

  const markAsSold = async (id) => {
    if (!window.confirm("Mark this property as sold?")) return;
    try {
      await apiClient.post("/mark-as-sold", { property_id: id, sold: true });
      toast.success("Property marked as sold.");
      fetchProperties();
    } catch { toast.error("Failed to mark as sold."); }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property? This cannot be undone.")) return;
    try {
      await apiClient.delete(`/delete-property/${id}`);
      toast.success("Property deleted.");
      fetchProperties();
    } catch { toast.error("Failed to delete."); }
  };

  return (
    <div>
      <PropertyCardStyles />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0F172A" }}>My Properties</h2>
        {!loading && <span style={{ fontSize: 11, color: "#9ca3af" }}>{properties.length} listing{properties.length !== 1 ? "s" : ""}</span>}
      </div>

      {loading && (
        <PropertyGrid>
          {Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
        </PropertyGrid>
      )}

      {!loading && properties.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 20px", border: "0.5px dashed #E9EAEC", borderRadius: 8 }}>
          <IoHomeOutline size={36} color="#E9EAEC" style={{ display: "block", margin: "0 auto 12px" }} />
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>No properties yet</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>Post your first property to get started</div>
          <button onClick={() => navigate("/my-profile?section=post-property")}
            style={{ padding: "9px 20px", background: "#e02424", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            Post Property
          </button>
        </div>
      )}

      {!loading && properties.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {properties.map((p) => (
            <div key={p.id} style={{ position: "relative" }}>
              <PropertyCard property={p} />
              {/* Action bar below each card */}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", padding: "6px 0 2px" }}>
                <button onClick={() => navigate(`/property/${p.url || p.id}`)}
                  style={{ padding: "5px 14px", background: "#f3f4f6", border: "0.5px solid #E9EAEC", borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: "pointer", color: "#374151" }}>
                  View
                </button>
                {p.sold !== "1" && (
                  <button onClick={() => markAsSold(p.id)}
                    style={{ padding: "5px 14px", background: "#fef3c7", border: "0.5px solid #fcd34d", borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: "pointer", color: "#92400e" }}>
                    Mark as Sold
                  </button>
                )}
                <button onClick={() => deleteProperty(p.id)}
                  style={{ padding: "5px 14px", background: "#fee2e2", border: "0.5px solid #fca5a5", borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: "pointer", color: "#991b1b" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;