import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_TICKET } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionGetTicket = createAsyncThunk(
    KEY_TICKET, async (params: { search: string, limit: string, page: string }) => {
      const { search, limit, page } = params;
    const response = await mainApiInstance.get('api/users/tickets', {
      params: { search, limit, page },
    });
    return response.data;
  }
); 