import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './slices/auth';
import FavouritesReducer from "./slices/favourites";
import UserReducer from './slices/userInformation';
export const store = configureStore({
    reducer:{
        auth: AuthReducer,
        user: UserReducer,
        favorites: FavouritesReducer
    }
})