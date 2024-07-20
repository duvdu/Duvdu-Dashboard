import { createAsyncThunk } from '@reduxjs/toolkit';
import { mainApiInstance } from '../../axiosInstances';
import { KEY_PRODUCER } from '../../../../constants/actionTypes';

export const ActionGetProducer = createAsyncThunk(
  KEY_PRODUCER, async (params: { search?: any, limit?: string|number, page?: string|number }) => {
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