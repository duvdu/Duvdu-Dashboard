import { createAsyncThunk } from '@reduxjs/toolkit';
import { mainApiInstance } from '../../axiosInstances';
import { KEY_RENTAL_ANALYSIS } from '../../../../constants/actionTypes';

export const ActionGetRentalAnalysis = createAsyncThunk(
  KEY_RENTAL_ANALYSIS, async () => {
    const response = await mainApiInstance.get('api/rentals/rental/analysis');
    return response.data;
  }
); 