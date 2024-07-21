import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { KEY_GET_REVIEWS } from "../../../constants/actionTypes";
import { fulfilledCase, pendingCase, rejectedCase } from "../commanApi";
import DataState from "../../../moduls";

export const AsyncThunkRef = createAsyncThunk(KEY_GET_REVIEWS, async () => { });

const initialState: DataState = {
  loading: false,
  error: null,
  req: null,
  data: null,
  loadingenable: true
};

const dataSlice = createSlice({
  name: 'reviews',
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

export const StateReviews = (state: RootState) => state.reviews;

export const dataReducer = dataSlice.reducer;

export default dataReducer;
