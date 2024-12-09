import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_USERS } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionGetUsers = createAsyncThunk(
    KEY_USERS, async (params: { search?: string, limit?: string|number, page?: string|number ,isAdmin?: boolean  }) => {
        const { search, limit, page , isAdmin } = params;
        const response = await mainApiInstance.get(`/api/users/auth/find`, {
            params: { search, limit, page , isAdmin },
          });
        return response.data;
    }
); 