import { KEY_MESSAGES } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const GetAllMessages = createAsyncThunk(
  KEY_MESSAGES, async () => {
      const response = await mainApiInstance.get('api/message');
      return response.data;
    }
  );