import { KEY_GET_COUPONS } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionGetCoupons = createAsyncThunk(
  KEY_GET_COUPONS,
  async () => {
    const response = await mainApiInstance.get('api/contracts/coupons/crm');
    return response.data;
  }
);
