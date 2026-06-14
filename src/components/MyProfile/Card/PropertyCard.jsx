import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaSpinner, FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  removeFavoriteList,
  setFavoritesList,
} from "../../../features/slices/favourites";
import apiClient from "../../../utils/apiClient";

const PropertyCard = ({ data, action }) => {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const favorites = useSelector((state) => state.favorites.data);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [propertySold, setPropertySold] = useState(false);
  const token = localStorage.getItem("sheetal_token");
  let navigate = useNavigate();

  useEffect(() => {
    if (favorites) {
      if (favorites.find((item) => item.property_id === data.id)) {
        setFavorite(true);
      }
    }

    // eslint-disable-next-line
  }, [favorites]);

  useEffect(() => {
    if (!user.data) {
      setFavorite(false);
    }
  }, [user]);

  const onFavoriteClick = (e, id) => {
    e.preventDefault();
    if (!user.data && !token) {
      return navigate(`/?login=1`);
    }
    const isFavoriteAvailable = favorites.find(
      (item) => item.property_id === id
    );
    if (isFavoriteAvailable) {
      setFavorite(false);
      dispatch(removeFavoriteList(id));
      removeFromFavorite(id);
    } else {
      setFavorite(true);
      dispatch(setFavoritesList(id));
      addToFavorite(id);
    }
  };

  const addToFavorite = async (id) => {
    await apiClient
      .post("/add-to-favourite", { property_id: id })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Added to favorite list");
        } else {
          toast.error("Failed to add to favorite list");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const removeFromFavorite = async (id) => {
    await apiClient
      .post("/remove-from-favourite", { property_id: id })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Removed from favorite list");
        } else {
          toast.error("Failed to remove from favorite list");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const markAsSold = async (id) => {
    await apiClient
      .post("/mark-as-sold", { property_id: id, sold: true })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Property marked as sold");
          setPropertySold(true);
        } else {
          toast.error("Failed to mark as sold");
        }
      })
      .catch(() => {
        toast.error("Failed to mark as sold");
      });
  };

  const { sold } = data;

  return (
    <div className="grid sm:grid-cols-5 items-center border border-gray-200 shadow-xl rounded overflow-hidden mb-6 relative">
      <img
        src={data?.feature_image}
        alt="/fetured/unsplash_178j8tJrNlc"
        className="w-full h-full sm:col-span-2"
      />
      <div className="p-5 sm:col-span-3  space-y-4 text-sm lg:text-base">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <FaUserCircle className="text-red-700 w-10 h-10" />
            <div className="flex flex-col">
              <span className="text-xs">Posted By</span>
              <div>
                <span className="capitalize  text-sm">{data?.posted_by}</span>{" "}
                <span className="text-gray-400 italic text-xs">
                  - Posted on <strong>{data?.posted_date}</strong>
                </span>
              </div>
            </div>
          </div>
          {sold === "1" || propertySold ? (
            <span className="text-red-700 px-2 text-sm font-bold">Sold</span>
          ) : (
            <button
              className="text-red-700 px-2 text-sm font-bold underline"
              onClick={() => markAsSold(data?.id)}
            >
              Mark As Sold
            </button>
          )}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="font-bold text-lg relative pr-24">
              {data?.name}
            </span>
            <div
              className="w-8 h-8 cursor-pointer"
              onClick={(e) => onFavoriteClick(e, data.id)}
            >
              {favorite ? (
                <FaHeart className="w-8 h-8 text-red-700" />
              ) : (
                <FaRegHeart className="w-8 h-8 text-red-700" />
              )}
            </div>
          </div>
          <div className="flex justify-between font-bold">
            <span>Rs. {data?.total_price ? data?.total_price : "N/A"}</span>
            {data?.land_area_in_sqft_according_to_lal_purja && (
              <span>
                {data?.land_area_in_sqft_according_to_lal_purja} sq.ft.
              </span>
            )}
          </div>
        </div>

        {data?.property_location && (
          <div className="font-light">{data?.property_location}</div>
        )}
        <div className="flex justify-end gap-2">
          <Link
            to={`/property/${data?.id}`}
            className="text-white px-3 py-2 rounded bg-red-700"
          >
            View Property
          </Link>
          <button
            className="text-white px-3 py-2 rounded bg-gray-600"
            onClick={async () => {
              if (!window.confirm("Delete this property?")) return;
              try {
                await apiClient.delete(`/delete-property/${data?.id}`);
                toast.success("Property deleted");
                if (action) action();
              } catch {
                toast.error("Failed to delete");
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
      {loading && id === data?.id && (
        <div className="absolute top-0 left-0 h-full w-full z-10">
          <div className="bg-white opacity-90 h-full w-full"></div>
          <div className="flex items-center justify-center h-full w-full absolute left-0 top-0">
            <FaSpinner className="spin text-red-500 h-8 w-8" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyCard;
