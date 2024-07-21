import { KEY_GET_REVIEWS } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionGetReviews = createAsyncThunk(
  KEY_GET_REVIEWS,
  async () => {
    const response = await mainApiInstance.get('api/analysis/contract-review');
    return response.data;
  }
);
