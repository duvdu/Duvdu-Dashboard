import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CATEGORY } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';

export const ActionUpdateCategory = createAsyncThunk(
  KEY_CATEGORY,  async ({ formdata, id }: { formdata: any; id: string }) => {
    const response = await mainApiInstance.put(`api/category/${id}`, formdata);
    return response.data;
  }
);
