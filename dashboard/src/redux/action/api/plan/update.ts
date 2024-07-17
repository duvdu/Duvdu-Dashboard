import { KEY_UPDATE_PLAN } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionUpdatePlan = createAsyncThunk(
    KEY_UPDATE_PLAN,
    async (params: { title?: string; status: boolean; roleId: string }) => {
        const { roleId, title, status } = params;
        const response = await mainApiInstance.patch(`api/users/plans/${roleId}`, {
            title:title ?? null,
            status,
        });
        return response.data;
    }
);
