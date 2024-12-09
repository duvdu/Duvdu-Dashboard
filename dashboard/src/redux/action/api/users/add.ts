import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CREATE_ADMIN } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionCreateAdmin = createAsyncThunk(KEY_CREATE_ADMIN,async (params: { formdata?: any }) => {
  const { formdata } = params;
    const response = await mainApiInstance.post('api/users/auth/crm', formdata);
    return response.data;
  }
);