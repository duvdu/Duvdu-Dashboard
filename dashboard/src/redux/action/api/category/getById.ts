import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CATEGORY } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionGetCategoryById = createAsyncThunk(
    KEY_CATEGORY, async (params: { formdata: any; id: string }) => {
      const { formdata, id } = params;
    const response = await mainApiInstance.get(`api/category/${id}`);
    return response.data;
  }
); 