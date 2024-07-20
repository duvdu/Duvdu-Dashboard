import { SEND_NOTIFICATIONS_TO_ALL_USERS } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionSendNotificationToAllUsers = createAsyncThunk(
  SEND_NOTIFICATIONS_TO_ALL_USERS, 
  async (params: { topic?: string; title: string , message:string }) => {
    const { topic,title,message } = params;
    const response = await mainApiInstance.post('api/notification', {
        topic,
        title,
        message
    });
    return response.data;
}
  );