import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    isLoading:false,
    data:null,
    error:null
};

export const AuthSlice = createSlice({
    name: 'Authentication',
    initialState,
    reducers: {
      setLoading:(state, action) => {
        state.isLoading =  action.payload
      },
      setLogin: (state, action) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
  
        state.data = action.payload
      },
      setError:(state, action)=>{
        state.error = action.payload
      }
      // decrement: (state) => {
      //   state.value -= 1
      // },
      // incrementByAmount: (state, action) => {
      //   state.value += action.payload
      // },
    },
    
  })

  export const  {setLoading,setLogin, setError} = AuthSlice.actions
  export default AuthSlice.reducer