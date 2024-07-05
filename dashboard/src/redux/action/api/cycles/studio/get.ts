import { createAsyncThunk } from '@reduxjs/toolkit';
import { mainApiInstance } from '../../axiosInstances';
import { KEY_PORTFOLIO_POST, KEY_STUDIO_BOOKING } from '../../../../constants/actionTypes';

export const ActionGetStudio = createAsyncThunk(
  KEY_STUDIO_BOOKING, async (params: { search: string, limit: string, page: number }) => {
    const { search, limit, page } = params;
    const response = await mainApiInstance.get('api/studio-booking/crm', {
      params: { search, limit, page },
    });
    return response.data;
  }
); 