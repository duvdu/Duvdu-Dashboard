import { KEY_GET_RANKS } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionGetRanks = createAsyncThunk(
  KEY_GET_RANKS,
  async () => {
    const response = await mainApiInstance.get('api/analysis/rank');
    return response.data;
  }
);
