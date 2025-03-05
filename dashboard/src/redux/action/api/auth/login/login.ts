import { KEY_AUTH } from '../../../../constants/actionTypes';
import { mainApiInstance } from '../../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';
// import { getMessaging, getToken } from "firebase/messaging";

// const messaging = getMessaging();
// Add the public key generated from the console here.

export const ActionLogin = createAsyncThunk(KEY_AUTH,async ({ username, password  }: { username: string, password: string }) => {
  console.log({username})
      const response = await mainApiInstance.post('api/users/auth/signin', {
        login:username,
        password,
      });
      return response.data;
    }
  );