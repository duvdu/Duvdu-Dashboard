import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { SEND_NOTIFICATIONS_TO_SELECTED_USERS } from "../../../constants/actionTypes";
import { fulfilledCase, pendingCase, rejectedCase } from "../commanApi";
import DataState from "../../../moduls";

export const AsyncThunkRef = createAsyncThunk(SEND_NOTIFICATIONS_TO_SELECTED_USERS, async () => { });

const initialState: DataState = {
  loading: false,
  error: null,
  req: null,
  data: null,
  loadingenable: true
};

const dataSlice = createSlice({
  name: 'notifications',
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

export const StateSendNotificationsToSelectedUsers = (state:any) => state.sendNotificationsToSelectedUsers;

export const dataReducer = dataSlice.reducer;

export default dataReducer;
