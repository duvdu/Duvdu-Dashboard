import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { KEY_AUTH } from '../../../constants/actionTypes';
import { fulfilledCase, pendingCase, rejectedCase } from "../commanApi";
import DataState from '../../../moduls';


export const AsyncThunkRef = createAsyncThunk(KEY_AUTH, async () => { });
const initialState: DataState = {
    loading: false,
    error: null,
    req: null,
    data: null,
    loadingenable: true
  };
  
  const dataSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(AsyncThunkRef.pending, (state:any) => {
        pendingCase(state);
      });
      builder.addCase(AsyncThunkRef.fulfilled, (state, action) => {
        fulfilledCase(state, action);
      });
      builder.addCase(AsyncThunkRef.rejected, (state, action) => {
        rejectedCase(state, action);
      });
    },
  });

export const selectAuthState = (state: RootState) => state.auth;
export const dataReducer = dataSlice.reducer;
export default dataReducer;
