import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CATEGORY } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionGetCategory = createAsyncThunk(
    KEY_CATEGORY, async () => {
    const response = await mainApiInstance.get('api/category/crm');
    return response.data;
  }
); 