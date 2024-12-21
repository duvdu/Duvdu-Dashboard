import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CATEGORY } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionGetCategory = createAsyncThunk(
  KEY_CATEGORY, async (params: { search?: string|null, limit?: string|number, page?: string|number , isRelated?: boolean }) => {
    const { search, limit, page , isRelated } = params;
    
    // Dynamically create params object
    const queryParams = { limit, page, search , isRelated};
    if (search) {
      queryParams.search = search;
    }
    if (isRelated===true || isRelated===false) {
      queryParams.isRelated = isRelated;
    }
    const response = await mainApiInstance.get('api/category/crm', {
      params: queryParams,
    });
    return response.data;
  }
); 