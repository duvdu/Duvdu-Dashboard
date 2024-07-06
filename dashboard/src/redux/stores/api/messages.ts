import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { KEY_MESSAGES } from "../../constants/actionTypes";
import { fulfilledCase, pendingCase, rejectedCase } from "./commanApi";
import DataState from "../../moduls";
// import { ActionLogin } from "../action/api/login/login";

export const AsyncThunkRef = createAsyncThunk(KEY_MESSAGES, async () => { });

const initialState: DataState = {
  loading: false,
  error: null,
  req: null,
  data: null,
  loadingenable: true
};

const dataSlice = createSlice({
  name: 'messages',
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

export const getAllmessages = (state: RootState) => state.messages;


export const dataReducer = dataSlice.reducer;

export default dataReducer;
