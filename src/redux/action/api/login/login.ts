import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionLogin = createAsyncThunk(
    'AllApi',
    async ({ username, password }: { username: string, password: string }) => {
      const response = await mainApiInstance.post('api/users/auth/signin', {
        username,
        password
      });
      return response.data;
    }
  );