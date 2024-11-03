import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_BLOCK_ADMIN } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionBlockAdmin = createAsyncThunk(KEY_BLOCK_ADMIN,async (params: { id?: any , reason?:any }) => {
  const { id , reason } = params;
    const response = await mainApiInstance.post(`api/users/auth/crm/${id}/block`, {reason});
    return response.data;
  }
);