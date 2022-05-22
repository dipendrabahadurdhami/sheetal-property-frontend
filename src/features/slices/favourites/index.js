import { createAsyncThunk, createSlice,  } from '@reduxjs/toolkit'
import { toast } from 'react-toastify';
import apiClient from '../../../utils/apiClient';

const initialState = {
    isLoading:false,
    data:null,
    error:null
};

export const fetchFavoritesList = createAsyncThunk('user/fetchFavoritesList', async () => {
    try{
        const response = await apiClient.get('/user-favourites-list');
        if(response.status === 200){
            console.log(response.data);
           return response.data

        }
        return null
    }catch(error){
        console.error(error);
        return null
    }

})





export const FavoritesSlice = createSlice({
    name: 'Favorites',
    initialState,
    reducers: {
      setLoading:(state, action) => {
        state.isLoading =  action.payload
      },
      setFavoritesList: (state, action) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        const data = {property_id: action.payload}
        state.data.push(data)
      },
      removeFavoriteList:(state,action)=>{
     
          const ids = state.data.filter(item=> item.property_id != action.payload);
          state.data = ids
          
      },

      removeAllFavorites : (state,action) => {
        state.data = []
      }
     
      // decrement: (state) => {
      //   state.value -= 1
      // },
      // incrementByAmount: (state, action) => {
      //   state.value += action.payload
      // },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchFavoritesList.fulfilled, (state, action) => {
        // Add user to the state array
            state.data = action.payload?action.payload.data:null
        })

    },
    
  })

  export const  {setLoading,setFavoritesList, removeFavoriteList, removeAllFavorites} = FavoritesSlice.actions
  export default FavoritesSlice.reducer