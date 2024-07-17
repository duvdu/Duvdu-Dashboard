import { KEY_GET_RANK_BY_ID } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionGetRankById = createAsyncThunk(
  KEY_GET_RANK_BY_ID,
  async (roleId: string) => {
    const response = await mainApiInstance.get(`api/analysis/rank/${roleId}`);
    return response.data;
  }
);
