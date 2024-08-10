import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_UPDATE_COUPON } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';

export const ActionUpdateCoupon = createAsyncThunk(
  KEY_UPDATE_COUPON,  async ({ formdata, id }: { formdata: any; id: any }) => {
    const response = await mainApiInstance.patch(`api/contracts/coupons/${id}`, formdata);
    return response.data;
  }
);
