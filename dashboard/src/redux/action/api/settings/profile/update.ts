import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_SETTINGS } from '../../../../constants/actionTypes';
import { mainApiInstance } from '../../axiosInstances';

interface UpdateProfileParams {
  profile?: File;
  cover?: File;
}

export const ActionUpdateProfile = createAsyncThunk(
  KEY_SETTINGS,
  async (params: any) => {
    const response = await mainApiInstance.put('api/users/auth/profile', params);
    return response.data;
  }
);
