import { KEY_NOTIFICATION } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionAllNotifications = createAsyncThunk(
  KEY_NOTIFICATION, async () => {
      const response = await mainApiInstance.get('api/notification/crm');
      return response.data;
    }
  );