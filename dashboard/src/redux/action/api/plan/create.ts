import { KEY_CREATE_PLAN } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionCreatePlan = createAsyncThunk(
    KEY_CREATE_PLAN, 
    async (params: { key: string; title: string; role: string }) => {
        const { key, title, role } = params;
        const response = await mainApiInstance.post('api/users/plans', {
            key,
            title,
            role,
        });
        return response.data;
    }
);