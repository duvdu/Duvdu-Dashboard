import { KEY_AUTH } from '../../../../constants/actionTypes';
import { mainApiInstance } from '../../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionLogin = createAsyncThunk(KEY_AUTH,async ({ username, password }: { username: string, password: string }) => {
      const response = await mainApiInstance.post('api/users/auth/signin', {
        username,
        password
      });
      return response.data;
    }
  );