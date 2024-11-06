import { KEY_GET_PLATFORMS } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionGetPlatforms = createAsyncThunk(
  KEY_GET_PLATFORMS,
  async () => {
    const response = await mainApiInstance.get('api/producers/platforms/crm');
    return response.data;
  }
);
