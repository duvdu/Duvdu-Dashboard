import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { KEY_CATEGORY_CREATE } from "../../../constants/actionTypes";
import { fulfilledCase, pendingCase, rejectedCase } from "../commanApi";
import DataState from "../../../moduls";

export const AsyncThunkRef = createAsyncThunk(KEY_CATEGORY_CREATE, async () => {
  // Your async logic here
});

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
  reducers: {
    resetDataState: (state:any) => {
      // Resetting state to initialState
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(AsyncThunkRef.pending, (state:any) => {
      pendingCase(state);
    });
    builder.addCase(AsyncThunkRef.fulfilled, (state, action) => {
      fulfilledCase(state, action);
      // Optionally, reset state here as well if required
    });
    builder.addCase(AsyncThunkRef.rejected, (state, action) => {
      rejectedCase(state, action);
      // Optionally, reset state here as well if required
    });
  },
});

export const { resetDataState } = dataSlice.actions;

export const StateCreateCategory = (state: RootState) => state.createcategory;

export const dataReducer = dataSlice.reducer;

export default dataReducer;
