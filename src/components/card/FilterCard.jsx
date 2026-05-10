import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { removeFavoriteList, setFavoritesList } from "../../features/slices/favourites";
import apiClient from "../../utils/apiClient";
import { FaMapMarkerAlt, FaTag, FaBuilding } from "react-icons/fa";

const FilterCard = ({ property, viewMode = "list" }) => {
  const navigate        = useNavigate();
  const [, setParams]   = useSearchParams();
  const [favorite, setFavorite] = useState(false);
  const favorites       = useSelector((state) => state.favorites.data);
  const user            = useSelector((state) => state.user);
  const token           = localStorage.getItem("sheetal_token");
  const dispatch        = useDispatch();

  useEffect(() => {
    if (favorites?.find((item) => item.property_id === property.id)) setFavorite(true);
  }, [favorites, property]);

  useEffect(() => {
    if (!user.data) setFavorite(false);
  }, [user]);

  const onFavoriteClick = (e, id) => {
    e.preventDefault();
    if (!user.data && !token) return setParams("?login=1");
    if (favorites.find((item) => item.property_id === id)) {
      setFavorite(false);
      dispatch(removeFavoriteList(id));
      apiClient.post("/remove-from-favourite", { property_id: id })
        .then((res) => res.status === 200 && toast.success("Removed from favorites"))
        .catch(console.error);
    } else {
      setFavorite(true);
      dispatch(setFavoritesList(id));
      apiClient.post("/add-to-favourite", { property_id: id })
        .then((res) => res.status === 200 && toast.success("Added to favorites"))
        .catch(console.error);
    }
  };

  const purposeColor = {
    rent:   "bg-blue-600",
    sale:   "bg-emerald-600",
    invest: "bg-amber-600",
  }[property?.purpose?.toLowerCase()] || "bg-gray-700";

  const stats = [
    { label: "Price",    value: property?.total_price ? `Rs. ${property.total_price}` : "N/A", icon: <FaTag className="w-3 h-3" /> },
    { label: "Category", value: property?.property_category || "N/A", icon: <FaBuilding className="w-3 h-3" /> },
    { label: "Type",     value: property?.property_type || "N/A", icon: null },
    { label: "Purpose",  value: property?.purpose || "N/A", icon: null },
  ];

  /* ── Shared image block ── */
  const ImageBlock = ({ wrapClass, imgMinHeight = "200px" }) => (
    <div className={`relative overflow-hidden flex-shrink-0 ${wrapClass}`} style={{ minHeight: imgMinHeight }}>
      <img
        src={property?.feature_image}
        alt={property?.title || "Property"}
        className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500 cursor-pointer"
        onClick={() => navigate("/property/" + property.id)}
      />
      <span className={`absolute top-3 left-3 ${purposeColor} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide`}>
        For {property.purpose}
      </span>
      <button
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition-transform"
        onClick={(e) => onFavoriteClick(e, property.id)}
      >
        {favorite
          ? <AiFillHeart className="text-red-600 w-4 h-4" />
          : <AiOutlineHeart className="text-red-600 w-4 h-4" />}
      </button>
    </div>
  );

  /* ════════════════════════════════
     LIST VIEW  (original layout)
  ════════════════════════════════ */
  if (viewMode === "list") {
    return (
      <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
        <div className="flex flex-col sm:flex-row">

          <ImageBlock wrapClass="sm:w-64 lg:w-72" />

          <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
            <div>
              <h2
                className="text-lg md:text-xl font-bold text-gray-900 mb-1 leading-snug cursor-pointer hover:text-red-700 transition-colors line-clamp-2"
                onClick={() => navigate("/property/" + property.id)}
              >
                {property?.title || property?.name}
              </h2>
              {property?.property_location && (
                <p className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                  <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                  {property.property_location}
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.map((s, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5 flex items-center gap-1">
                      {s.icon}{s.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: "var(--r)" }}
                onClick={() => navigate("/property/" + property.id)}
              >
                View Details →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════
     GRID VIEW  (vertical card)
  ════════════════════════════════ */
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col h-full">

      <ImageBlock wrapClass="w-full" imgMinHeight="200px" />

      <div className="flex-1 p-4 flex flex-col justify-between gap-3">
        <div>
          <h2
            className="text-base font-bold text-gray-900 mb-1 leading-snug cursor-pointer hover:text-red-700 transition-colors line-clamp-2"
            onClick={() => navigate("/property/" + property.id)}
          >
            {property?.title || property?.name}
          </h2>
          {property?.property_location && (
            <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
              <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
              {property.property_location}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            {stats.map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-2.5">
                <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wide mb-0.5 flex items-center gap-1">
                  {s.icon}{s.label}
                </p>
                <p className="text-xs font-semibold text-gray-800 truncate">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
          <p className="text-sm font-bold text-gray-900 truncate">
            {property?.total_price ? `Rs. ${property.total_price}` : "N/A"}
          </p>
          <button
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--r)" }}
            onClick={() => navigate("/property/" + property.id)}
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterCard;