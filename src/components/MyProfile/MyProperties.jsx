import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useSelector } from "react-redux";
import apiClient from "../../utils/apiClient";
import PropertyCard from "./Card/PropertyCard";

const MyProperties = () => {
  const [loading, setLoading]     = useState(false);
  const [properties, setProperties] = useState(null);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    fetchProperties();
  }, [user]);

  const fetchProperties = async () => {
    if (!user.data) return;
    setLoading(true);
    try {
      const res = await apiClient.get("user-property");
      setProperties(res.data.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 lg:p-10 space-y-5 md:space-y-10">
      <div className="text-xl font-bold">My Properties</div>
      <div>
        {loading && <FaSpinner className="spin" />}
        {!loading && properties && properties.map((item, i) => (
          <div className="mb-32" key={i}>
            <PropertyCard data={item} />
          </div>
        ))}
        {!loading && properties && properties.length === 0 && (
          <p>You haven't posted any property</p>
        )}
      </div>
    </div>
  );
};

export default MyProperties;