import { KEY_AUTH_LOGOUT } from '../../../../constants/actionTypes';
import { mainApiInstance } from '../../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionLogout = createAsyncThunk(KEY_AUTH_LOGOUT,async () => {
      const response = await mainApiInstance.post('api/users/auth/logout');
      return response.data;
    }
  );