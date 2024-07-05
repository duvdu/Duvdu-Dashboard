import { KEY_AUTH } from '../../../../constants/actionTypes';
import { mainApiInstance } from '../../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionSignUp = createAsyncThunk(
  KEY_AUTH,
    async ({ username, password }: { username: string, password: string }) => {
      const response = await mainApiInstance.post('api/users/auth/signup', {
        username,
        password
      });
      return response.data;
    }
  );