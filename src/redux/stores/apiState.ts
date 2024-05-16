import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
// import { ActionLogin } from "../action/api/login/login";

export const AsyncThunkRef = createAsyncThunk('AllApi',async () => {});

interface DataState {
    loading: boolean;
    error: any;
    req: any;
    respond_data: any;
    loadingenable: boolean;
}

const initialState: DataState = {
    loading: false,
    error: null,
    req: null,
    respond_data: null,
    loadingenable: true
};

const dataSlice = createSlice({
    name: "apiState",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(AsyncThunkRef.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(AsyncThunkRef.fulfilled, (state, action) => {
            state.respond_data = action.payload;
            state.loading = false;
        });
        builder.addCase(AsyncThunkRef.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});

// export const { fetchDataRequest, fetchDataSuccess, fetchDataFailure, enableLoading, disableLoading } = dataSlice.actions;

export const selectAuthState = (state: RootState) => {

    return state.login;
};

export const dataReducer = dataSlice.reducer;

export default dataReducer;
