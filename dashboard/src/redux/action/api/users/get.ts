import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_USERS } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionGetUsers = createAsyncThunk(
    KEY_USERS, async (params: { search?: string, limit?: string|number, page?: string|number }) => {
        const { search, limit, page } = params;
        const response = await mainApiInstance.get(`/api/users/auth/find`, {
            params: { search, limit, page },
          });
        return response.data;
    }
); 