import { KEY_GET_COUPON_BY_ID } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionGetCouponById = createAsyncThunk(
  KEY_GET_COUPON_BY_ID,
  async (couponId: string) => {
    const response = await mainApiInstance.get(`api/contracts/coupons/crm/${couponId}`);
    return response.data;
  }
);
