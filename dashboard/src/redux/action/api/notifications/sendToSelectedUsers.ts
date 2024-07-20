import { SEND_NOTIFICATIONS_TO_SELECTED_USERS } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionSendNotificationToSelectedUsers = createAsyncThunk(
  SEND_NOTIFICATIONS_TO_SELECTED_USERS, 
  async (params: { title: string , message:string , users:string[] }) => {
    const { title,message ,users} = params;
    const response = await mainApiInstance.post('api/notification/users', {
        users,
        title,
        message
    });
    return response.data;
}
  );