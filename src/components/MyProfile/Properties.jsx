import React, { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavoritesList } from "../../features/slices/favourites";
import FavoritePropertyCard from "./Card/FavoritePropertyCard";

const Properties = () => {
  const user = useSelector((state) => state.user);
  const favorites = useSelector((state) => state.favorites);
  const dispatch = useDispatch();
  const fetchFavorites = () => {
    if (user.data) {
      dispatch(fetchFavoritesList());
    }
  };

  useEffect(() => {
    fetchFavorites();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="p-5 lg:p-10 space-y-5 md:space-y-10">
      <div className="text-xl font-bold">Your Favourite Properties</div>
      <div className="">
        {favorites.isLoading && <FaSpinner className="spin" />}
        {!favorites.isLoading &&
          favorites.data &&
          favorites.data.map((item, i) => (
            <div className="mb-32" key={i}>
              <FavoritePropertyCard data={item} action={fetchFavorites} />
            </div>
          ))}
        {!favorites.isLoading &&
        favorites.data &&
        favorites.data.length === 0 ? (
          <p>You haven't added on your favorite list</p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Properties;
