import React, { useEffect, useState } from "react";
import { GrLocation } from "react-icons/gr";
import { removeFavoriteList, setFavoritesList } from "../../features/slices/favourites";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../../utils/apiClient";
import { toast } from "react-toastify";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProductLocation = ({ property }) => {
  console.log("Property", property);
  let navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const favorites =  useSelector(state=>state.favorites.data);
  const user =  useSelector(state=>state.user);
  const token = localStorage.getItem('sheetal_token');
  const dispatch = useDispatch();
  
  useEffect(()=>{
    if(favorites){
      if(favorites.find(item=>item.property_id === property.id)){
        setFavorite(true)
      }
    }

  },[favorites])


  useEffect(()=>{
      if(!user.data){
          setFavorite(false)
      }
  },[user]);

  const onFavoriteClick = (e,id) => {
    e.preventDefault();
    if (!user.data && !token) {
      return  navigate(`?login=1`)
    }
    const isFavoriteAvailable = favorites.find(item=>item.property_id === id)
    if(isFavoriteAvailable){
        setFavorite(false)
        dispatch(removeFavoriteList(id))
        removeFromFavorite(id)
    }else{
      setFavorite(true)
      dispatch(setFavoritesList(id))
      addToFavorite(id)
    }
  }

  const addToFavorite = async (id) => {
    await apiClient.post('/add-to-favourite',{property_id:id}).then(res=>{
      if(res.status === 200){
          toast.success("Added to favorite list");
      }else{
        toast.error("Failed to add to favorite list");
      }
    }).catch(err => {
      console.error(err)
    })
  }


  const removeFromFavorite = async (id) => {
    await apiClient.post('/remove-from-favourite',{property_id:id}).then(res=>{
      if(res.status === 200){
          toast.success("Removed from favorite list");
      }else{
        toast.error("Failed to remove from favorite list");
      }
    }).catch(err => {
      console.error(err)
    })
  }

  return (
    <div className="flex flex-wrap lg:flex-nowrap justify-between ">
      <div className="lg:pr-8">
        <div className="text-lg sm:text-2xl font-bold">{property.name}</div>
        <div className="flex space-x-2 text-xs sm:text-sm">
          <span>{property.property_location} | </span>
          <a href={`https://www.google.com/maps/@${property.latitude},${property.longitude},15.42z`} target="_blank" className="flex items-center space-x-2 text-red-700">
            <GrLocation className="w-4 h-4 text-red-700" />
            <span className="border-b border-red-700">Show on Map</span>
          </a>
        </div>
      </div>
      <div>
          <div className="w-10 h-10 cursor-pointer relative z-10" onClick={(e)=>onFavoriteClick(e,property.id)}>
            {!favorite.isLoading  && !favorite && <AiOutlineHeart className="w-10 h-10 text-red-600" />}
            {!favorite.isLoading  && favorite && <AiFillHeart className="w-10 h-10 text-red-600" />}
            {favorite.isLoading && <FaSpinner className="spin w-10 h-10 text-red-600"/>}
          </div>
      </div>
    </div>
  );
};

export default ProductLocation;
