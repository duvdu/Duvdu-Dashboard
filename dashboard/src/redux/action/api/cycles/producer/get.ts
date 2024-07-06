import { createAsyncThunk } from '@reduxjs/toolkit';
import { mainApiInstance } from '../../axiosInstances';
import { KEY_PORTFOLIO_POST, KEY_PRODUCER } from '../../../../constants/actionTypes';

export const ActionGetPortfolio = createAsyncThunk(
  KEY_PORTFOLIO_POST, async (params: { search?: string, limit?: string|number, page?: string|number }) => {
    const { search, limit, page } = params;
    const queryParams = { limit, page , search };
    if (search) {
      queryParams.search = search;
    }
    const response = await mainApiInstance.get('api/producers/producer', {
      params: queryParams,
    });
    return response.data;
  }
); 