import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { KEY_AUTH_LOGOUT } from '../../../constants/actionTypes';
import { fulfilledCase, pendingCase, rejectedCase } from "../commanApi";
import DataState from '../../../moduls';


export const AsyncThunkRef = createAsyncThunk(KEY_AUTH_LOGOUT, async () => { });
const initialState: DataState = {
    loading: false,
    error: null,
    req: null,
    data: null,
    loadingenable: true
  };
  
  const dataSlice = createSlice({
    name: 'logout',
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

export const selectLogoutState = (state: RootState) => state.logout;
export const dataReducer = dataSlice.reducer;
export default dataReducer;
