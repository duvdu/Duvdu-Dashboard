import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_USERS } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionGetUsers = createAsyncThunk(
    KEY_USERS, async (params: { search: string }) => {
        const { search } = params;
        const response = await mainApiInstance.get(`/api/users/auth/find?search=${search}`);
        return response.data;
    }
); 