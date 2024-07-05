import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { KEY_CHAT } from "../../../constants/actionTypes";
import { fulfilledCase, pendingCase, rejectedCase } from "../commanApi";
import DataState from "../../../moduls";
// import { ActionLogin } from "../action/api/login/login";

export const AsyncThunkRef = createAsyncThunk(KEY_CHAT, async () => { });

const initialState: DataState = {
    loading: false,
    error: null,
    req: null,
    data: null,
    loadingenable: true
  };
  
  const dataSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(AsyncThunkRef.pending, (state) => {
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
  


export const StateChat = (state: RootState) => state.chat;

export const dataReducer = dataSlice.reducer;

export default dataReducer;
