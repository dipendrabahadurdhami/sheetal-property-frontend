import React, { useEffect, useState } from "react";
import apiClient from "../../utils/apiClient";
import PropertyCard, { PropertyCardStyles, PropertyGrid, PropertyCardSkeleton } from "../card/PropertyCard";

const RelatedProperties = ({ property }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!property?.id) return;
    fetchRelated();
  }, [property?.id]);

  const fetchRelated = async () => {
    setLoading(true);
    try {
      const purpose = (property?.purpose || "").toLowerCase().trim();

      // pick the right endpoint based on purpose — same as your landing pages
      let endpoint = "/sale";
      if (purpose === "rent" || purpose === "lease") endpoint = "/rent";
      else if (purpose.includes("invest"))           endpoint = "/invest";

      const res = await apiClient.get(`${endpoint}?page=1&per_page=9`);
      const all = (res?.data?.data || []).filter((p) => p.id !== property.id);

      setRelated(all.slice(0, 8));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const purposeLabel = (() => {
    const p = (property?.purpose || "").toLowerCase();
    if (p === "rent" || p === "lease") return "For Rent";
    if (p.includes("invest"))          return "Investment";
    return "For Sale";
  })();

  if (!loading && !related.length) return null;

  return (
    <div style={{ marginBottom: "2rem" }}>
      <PropertyCardStyles />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e02424", marginBottom: 4 }}>
            {purposeLabel}
          </div>
          <h2 style={{ margin: 0, fontSize: "clamp(16px,2vw,20px)", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.3px" }}>
            Similar Properties
          </h2>
        </div>
        {!loading && related.length > 0 && (
          <span style={{ fontSize: 11, color: "#9ca3af" }}>{related.length} listings</span>
        )}
      </div>
      {loading ? (
        <PropertyGrid>
          {Array.from({ length: 8 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
        </PropertyGrid>
      ) : (
        <PropertyGrid>
          {related.map((p) => <PropertyCard key={p.id} property={p} />)}
        </PropertyGrid>
      )}
    </div>
  );
};

export default RelatedProperties;