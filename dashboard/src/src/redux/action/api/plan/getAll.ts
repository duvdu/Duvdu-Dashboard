import { KEY_GET_PLANS } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionGetPlans = createAsyncThunk(
  KEY_GET_PLANS,
  async () => {
    const response = await mainApiInstance.get('api/users/plans/all');
    return response.data;
  }
);
