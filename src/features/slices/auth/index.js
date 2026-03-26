import { createSlice } from '@reduxjs/toolkit'

// Check if we have a token saved to keep the user logged in on refresh
const savedToken = localStorage.getItem("sheetal_token");

const initialState = {
    isLoading: false,
    // If a token exists, we pre-fill the data so the app stays authenticated
    data: savedToken ? { token: savedToken } : null, 
    error: null
};

export const AuthSlice = createSlice({
    name: 'Authentication',
    initialState,
    reducers: {
      setLoading: (state, action) => {
        state.isLoading = action.payload
      },
      setLogin: (state, action) => {
        // This updates the Redux state when the user logs in
        state.data = action.payload;
        state.error = null;
      },
      setError: (state, action) => {
        state.error = action.payload
      },
      // Suggestion: Add a logout reducer to clear both state and storage
      setLogout: (state) => {
        state.data = null;
        localStorage.removeItem("sheetal_token");
      }
    },
});

export const { setLoading, setLogin, setError, setLogout } = AuthSlice.actions
export default AuthSlice.reducer