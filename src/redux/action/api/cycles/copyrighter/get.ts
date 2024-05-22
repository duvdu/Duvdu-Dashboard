import { createAsyncThunk } from '@reduxjs/toolkit';
import { mainApiInstance } from '../../axiosInstances';
import { KEY_COPY_RIGHTS } from '../../../../constants/actionTypes';

export const ActionGetCopyRight = createAsyncThunk(
  KEY_COPY_RIGHTS, async (params: { search: string, limit: string, page: string }) => {
    
    const { search, limit, page } = params;
    
    // Dynamically create params object
    const queryParams = { limit, page };
    if (search) {
      queryParams.search = search;
    }

    const response = await mainApiInstance.get('api/copyrights/crm', {
      params: queryParams,
    });
    return response.data;
  }
); 