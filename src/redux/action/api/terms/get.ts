import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CATEGORY, KEY_TERMS } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionGetTerms = createAsyncThunk(
    KEY_TERMS, async (params: { search: string, limit: string, page: string }) => {
      const { search, limit, page } = params;
    const response = await mainApiInstance.get('api/users/terms', {
      params: { search, limit, page },
    });
    return response.data;
  }
); 