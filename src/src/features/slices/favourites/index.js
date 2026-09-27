import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../../utils/apiClient";

const initialState = {
  isLoading: false,
  data: null,
  error: null,
};

export const fetchFavoritesList = createAsyncThunk(
  "user/fetchFavoritesList",
  async () => {
    try {
      const response = await apiClient.get("/user-favourites-list");
      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
);

export const FavoritesSlice = createSlice({
  name: "Favorites",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setFavoritesList: (state, action) => {
      const data = { property_id: action.payload };
      if (!state.data) {
        state.data = [data]; // ✅ initialize if null
      } else {
        state.data.push(data); // ✅ push if already exists
      }
    },
    removeFavoriteList: (state, action) => {
      if (!state.data) return; // ✅ guard
      state.data = state.data.filter(
        (item) => item.property_id != action.payload
      );
    },

    removeAllFavorites: (state) => {
      state.data = []; // ✅ only one, duplicate removed
    },

    // decrement: (state) => {
    //   state.value -= 1
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload
    // },
  },
  extraReducers: (builder) => {
    // ✅ Fixed: removed nested duplicate addCase
    builder.addCase(fetchFavoritesList.fulfilled, (state, action) => {
      state.data = action.payload ? action.payload.data : [];
    });
  },
});

export const {
  setLoading,
  setFavoritesList,
  removeFavoriteList,
  removeAllFavorites,
} = FavoritesSlice.actions;
export default FavoritesSlice.reducer;