import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CATEGORY_DELETE } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';

export const ActionDeleteCategory = createAsyncThunk(
  KEY_CATEGORY_DELETE, async (params: { formdata: any; id: string }) => {
    const { formdata, id } = params;
    const response = await mainApiInstance.delete(`api/category/${id}`);
    return response.data;
  }
); 
