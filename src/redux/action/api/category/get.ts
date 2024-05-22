import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CATEGORY } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionGetCategory = createAsyncThunk(
  KEY_CATEGORY, async (params: { search: string, limit: string, page: string }) => {
    const { search, limit, page } = params;
    
    // Dynamically create params object
    const queryParams = { limit, page };
    if (search) {
      queryParams.search = search;
    }
    const response = await mainApiInstance.get('api/category/crm', {
      params: queryParams,
    });
    return response.data;
  }
); 