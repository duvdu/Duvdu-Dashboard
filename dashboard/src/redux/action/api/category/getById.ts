import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CATEGORY_ID } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionGetCategoryById = createAsyncThunk(
    KEY_CATEGORY_ID, async (params: { id: any }) => {
      const { id } = params;
    const response = await mainApiInstance.get(`api/category/crm/${id}`);
    return response.data;
  }
); 