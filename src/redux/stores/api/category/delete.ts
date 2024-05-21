import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { KEY_CATEGORY_DELETE } from "../../../constants/actionTypes";
import { fulfilledCase, pendingCase, rejectedCase } from "../commanApi";
import DataState from "../../../moduls";

export const AsyncThunkRef = createAsyncThunk(KEY_CATEGORY_DELETE, async () => { });

const initialState: DataState = {
  loading: false,
  error: null,
  req: null,
  data: null,
  loadingenable: true
};

const dataSlice = createSlice({
  name: 'category',
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

export const StateDeleteCategory = (state: RootState) => state.deleteCategory;

export const dataReducer = dataSlice.reducer;

export default dataReducer;
