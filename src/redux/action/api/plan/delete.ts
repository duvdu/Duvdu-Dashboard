import { KEY_DELETE_PLAN } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionDeletePlan = createAsyncThunk(
  KEY_DELETE_PLAN,
  async (planId: string) => {
    const response = await mainApiInstance.delete(`api/users/plans/${planId}`);
    return response.data;
  }
);

