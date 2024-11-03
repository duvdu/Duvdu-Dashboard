import { KEY_UPDATE_ADMIN } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionUpdateUser = createAsyncThunk(
    KEY_UPDATE_ADMIN,
    async (params: { formData?:any; userId?: string | null }) => {
        const { userId, formData } = params;
        const response = await mainApiInstance.patch(`api/users/auth/crm/${userId}`,formData
        );
        return response.data;
    }
);
