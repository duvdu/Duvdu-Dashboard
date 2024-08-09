import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CREATE_COUPON } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionCreateCoupon = createAsyncThunk(KEY_CREATE_COUPON,async (params: { formdata?: any }) => {
  const { formdata } = params;
    const response = await mainApiInstance.post('api/contracts/coupons', formdata);
    return response.data;
  }
);