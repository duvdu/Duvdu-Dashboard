import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CATEGORY } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionCreateCategory = createAsyncThunk(KEY_CATEGORY,async (formData) => {
    const response = await mainApiInstance.post('api/copyrights/crm', formData);
    return response.data;
  }
);