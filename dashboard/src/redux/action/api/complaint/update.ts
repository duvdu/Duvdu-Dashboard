import { KEY_UPDATE_COMPLAINT } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionUpdateComplaints = createAsyncThunk(
    KEY_UPDATE_COMPLAINT,
    async (params: { feedback?: string; complaintId: string }) => {
        const { complaintId, feedback } = params;
        const response = await mainApiInstance.post(`api/contracts/complaints/${complaintId}/close`, {
            feedback
        });
        return response.data;
    }
);
