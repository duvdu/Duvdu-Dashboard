import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CHAT } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionGetChat = createAsyncThunk(
    KEY_CHAT, async (params: { id: string }) => {
        const { id } = params;
        const response = await mainApiInstance.get(`/api/message/${id}/chat`);
        return response.data;
    }
); 