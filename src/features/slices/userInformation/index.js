import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiClient from "../../../utils/apiClient";

const initialState = {
  isLoading: false,
  data: null,
  error: null,
};

export const fetchUserInformation = createAsyncThunk(
  "user/fetchUserInformation",
  async () => {
    try {
      const response = await apiClient.get("/user-info");
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

export const UserSlice = createSlice({
  name: "UserInformation",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setUserInfo: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.data.push(action.payload);
    },
    removeUserInfo: (state) => {
      state.data = null;
    },

    // decrement: (state) => {
    //   state.value -= 1
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload
    // },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchUserInformation.fulfilled, (state, action) => {
      // Add user to the state array
      state.data = action.payload ? action.payload.data : null;
    });
  },
});

export const { setLoading, setUserInfo, removeUserInfo } = UserSlice.actions;
export default UserSlice.reducer;
