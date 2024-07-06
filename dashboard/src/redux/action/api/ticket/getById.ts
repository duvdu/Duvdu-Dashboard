import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_TICKET } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionGetTicketById = createAsyncThunk(
    KEY_TICKET, async (params: { formdata?: any; id?: string|number }) => {
        const { formdata, id } = params;
    const response = await mainApiInstance.get(`api/users/tickets/${id}`);
    return response.data;
  }
);
