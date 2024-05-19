import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CATEGORY } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionCreateCategory = createAsyncThunk(KEY_CATEGORY,async (params: { formdata: any; id: string }) => {
  const { formdata, id } = params;
    const response = await mainApiInstance.post('api/category', formdata);
    return response.data;
  }
);