import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionSignUp = createAsyncThunk(
    'AllApi',
    async ({ username, password }: { username: string, password: string }) => {
      const response = await mainApiInstance.post('api/users/auth/signup', {
        username,
        password
      });
      return response.data;
    }
  );