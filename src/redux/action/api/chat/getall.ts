import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CHAT_GETALL } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionGetChats = createAsyncThunk(
  KEY_CHAT_GETALL, async () => {
    const response = await mainApiInstance.get('api/message?limit=100');
    return response.data;
  }
); 