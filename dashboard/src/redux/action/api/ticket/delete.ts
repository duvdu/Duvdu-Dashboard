import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_TICKET } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';

export const ActionDeleteTicket = createAsyncThunk(
  KEY_TICKET,
  async (id: string) => {
    const response = await mainApiInstance.delete(`api/users/tickets/${id}`);
    return response.data;
  }
); 
