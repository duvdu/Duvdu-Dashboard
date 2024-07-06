import { KEY_GET_PLAN_BY_ID } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionGetPlanById = createAsyncThunk(
  KEY_GET_PLAN_BY_ID,
  async (roleId: string) => {
    const response = await mainApiInstance.get(`api/users/plans/${roleId}`);
    return response.data;
  }
);
