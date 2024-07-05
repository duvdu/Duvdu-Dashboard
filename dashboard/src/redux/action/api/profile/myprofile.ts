import { KEY_AUTH, KEY_MYPROFILE } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionMyProfile = createAsyncThunk(
  KEY_MYPROFILE, async () => {
      const response = await mainApiInstance.get('api/users/auth/profile');
      return response.data;
    }
  ); 