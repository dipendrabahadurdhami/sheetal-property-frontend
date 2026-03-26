import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../../utils/apiClient";

const initialState = {
  isLoading: false,
  data: null,
  error: null,
};

export const fetchUserInformation = createAsyncThunk(
  "user/fetchUserInformation",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("sheetal_token");

      if (!token) {
        return rejectWithValue("No token found");
      }

      const response = await apiClient.get("user-info", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Auth Error Details:", error);

      if (error.response?.status === 401) {
        return rejectWithValue("Session invalid or expired.");
      }

      return rejectWithValue(error.response?.data || "Network Error");
    }
  }
);

export const UserSlice = createSlice({
  name: "UserInformation",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setUserInfo: (state, action) => {
      state.data = action.payload;
    },
    removeUserInfo: (state) => {
      state.data = null;
      localStorage.removeItem("sheetal_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInformation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserInformation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload?.data || action.payload;
      })
      .addCase(fetchUserInformation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setLoading, setUserInfo, removeUserInfo } = UserSlice.actions;
export default UserSlice.reducer;