import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavoritesList } from "../../features/slices/favourites";
import apiClient from "../../utils/apiClient";
import PropertyCard from "./Card/PropertyCard";

const Properties = () => {
  const [loading,setLoading] = useState(false);
  const user = useSelector(state=>state.user);
  const favorites = useSelector(state=>state.favorites);
  const dispatch = useDispatch();
  const fetchFavorites = () => {
    if(user.data){
      dispatch(fetchFavoritesList())
   }
  }

  useEffect(()=>{
    fetchFavorites();
  },[])
  
  return (
    <div className="p-5 lg:p-10 space-y-5 md:space-y-10">
      <div className="text-xl font-bold">Your Favourite Properties</div>
      <div className="">
        {favorites.isLoading && <FaSpinner className="spin" />}
        {!favorites.isLoading && favorites.data && favorites.data.map((item,i) => <PropertyCard key={i} data={item} action={fetchFavorites} />)}
        {!favorites.isLoading && favorites.data && favorites.data.length === 0 ? <p>You haven't added on your favorite list</p>: ''}
      </div>
    </div>
  );
};

export default Properties;
