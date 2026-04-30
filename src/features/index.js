import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './slices/auth';
import FavouritesReducer from "./slices/favourites";
import UserReducer from './slices/userInformation';
// 1. Import your new blog reducer
import BlogReducer from './slices/blog/index'; 

export const store = configureStore({
    reducer: {
        auth: AuthReducer,
        user: UserReducer,
        favorites: FavouritesReducer,
        // 2. Add the blog reducer here
        blog: BlogReducer 
    }
})