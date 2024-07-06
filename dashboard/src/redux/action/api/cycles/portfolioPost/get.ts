import { createAsyncThunk } from '@reduxjs/toolkit';
import { mainApiInstance } from '../../axiosInstances';
import { KEY_PORTFOLIO_POST } from '../../../../constants/actionTypes';

export const ActionGetPortfolio = createAsyncThunk(
  KEY_PORTFOLIO_POST, async (params: { search: string, limit: string, page: number }) => {
    const { search, limit, page } = params;
    
    // Dynamically create params object
    const queryParams = { limit, page , search };
    if (search) {
      queryParams.search = search;
    }
    const response = await mainApiInstance.get('api/portfolio-post/crm', {
      params: queryParams,
    });
    return response.data;
  }
); 