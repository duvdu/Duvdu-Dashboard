import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_UN_BLOCK_ADMIN } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionUnBlockAdmin = createAsyncThunk(KEY_UN_BLOCK_ADMIN,async (params: { formdata?: any }) => {
  const { formdata } = params;
    const response = await mainApiInstance.patch(`api/users/auth/crm/${formdata.id}/block`, formdata);
    return response.data;
  }
);