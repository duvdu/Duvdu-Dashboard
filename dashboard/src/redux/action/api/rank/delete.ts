import { KEY_DELETE_RANK } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionDeleteRank = createAsyncThunk(
  KEY_DELETE_RANK,
  async (rankId: string) => {
    const response = await mainApiInstance.delete(`api/analysis/rank/${rankId}`);
    return response.data;
  }
);

