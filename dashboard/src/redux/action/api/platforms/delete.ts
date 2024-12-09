import { KEY_DELETE_PLATFORM } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionDeletePlatform = createAsyncThunk(
  KEY_DELETE_PLATFORM,
  async (rankId: string) => {
    const response = await mainApiInstance.delete(`api/producers/platforms/${rankId}`);
    return response.data;
  }
);

