import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  removeFavoriteList,
  setFavoritesList,
} from "../../features/slices/favourites";
import apiClient from "../../utils/apiClient";

const FearuredCard = ({ product }) => {
  let navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const favorites = useSelector((state) => state.favorites.data);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("sheetal_token");

  useEffect(() => {
    if (favorites) {
      if (favorites.find((item) => item.property_id === product.id)) {
        setFavorite(true);
      }
    }
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

  return (
    <div className=" h-full">
      <div className="block w-full h-full xs:w-64 sm:w-80 lg:w-full relative bg-white rounded-xl shadow-lg border-2 border-gray-200">
        <div className="-mt-3 rounded px-3 py-0.5 font-semibold absolute top-0 bg-red-700 text-sm text-white uppercase">
          For {product.purpose}
        </div>
        <div className="rounded-md overflow-hidden cursor-pointer">
          <img
            src={product.feature_image}
            alt="unsplash"
            className="w-full bg-center h-44 sm:h-48 lg:h-72 object-center object-cover"
            onClick={() => {
              navigate(`/property/${product.id}`);
            }}
          />
          <div className="p-3 space-y-2 pb-7 text-xl font-light">
            <div className="flex justify-between">
              <h1
                title={product.name}
                className="font-medium text-md text-gray-600 cursor-pointer pr-10"
                style={{ fontSize: "18px" }}
                onClick={() => {
                  navigate(`/property/${product.id}`);
                }}
              >
                {product.name.length > 80
                  ? product.name.slice(0, 80) + "..."
                  : product.name}
              </h1>
              <div
                className="w-6 h-6 cursor-pointer relative z-10"
                onClick={(e) => onFavoriteClick(e, product.id)}
              >
                {!favorite && (
                  <AiOutlineHeart className="w-6 h-6 text-red-600" />
                )}
                {favorite && <AiFillHeart className="w-6 h-6 text-red-600" />}
              </div>
            </div>
            <div className="flex  items-center">
              <span className="font-medium">
                Rs. {product?.total_price ? product?.total_price : "N/A"}{" "}
              </span>
              {/* <span className="font-medium">
                {product?.land_according_to_measurements
                  ?.land_area_in_sqft_measurements
                  ? product?.land_according_to_measurements
                      ?.land_area_in_sqft_measurements
                  : " -"}{" "}
                sq.ft.
              </span> */}
            </div>
            {product?.property_location && (
              <div className="text-gray-600 text-sm flex flex-wrap">
                {" "}
                <FaMapMarkerAlt
                  className="text-normal text-red-500 mr-2"
                  style={{ marginTop: "2px" }}
                />{" "}
                {product?.property_location}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FearuredCard;
