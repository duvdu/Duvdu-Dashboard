import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CATEGORY_CREATE } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';

export const ActionUpdateCategory = createAsyncThunk(
  KEY_CATEGORY_CREATE,  async ({ formdata, id }: { formdata: any; id: any }) => {
    const response = await mainApiInstance.put(`api/category/${id}`, formdata);
    return response.data;
  }
);
