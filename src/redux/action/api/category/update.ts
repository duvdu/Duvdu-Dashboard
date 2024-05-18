import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CATEGORY } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';

export const ActionUpdateCategory = createAsyncThunk(
  KEY_CATEGORY,
  async (formdata) => {
    const response = await mainApiInstance.put('api/copyrights/crm', formdata);
    return response.data;
  }
);
