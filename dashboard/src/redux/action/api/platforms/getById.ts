import { KEY_GET_PLATFORM_BY_ID } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionGetPlatformById = createAsyncThunk(
  KEY_GET_PLATFORM_BY_ID,
  async (roleId: string) => {
    const response = await mainApiInstance.get(`api/producers/platforms/crm/${roleId}`);
    return response.data;
  }
);
