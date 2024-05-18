import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CATEGORY } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';

export const ActionDeleteCategory = createAsyncThunk(
  KEY_CATEGORY,
  async (id) => {
    const response = await mainApiInstance.delete(`api/category/crm/${id}`);
    return response.data;
  }
); 
