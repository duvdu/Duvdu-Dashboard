import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_TICKET } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionUpdateTicket = createAsyncThunk(
    KEY_TICKET, async (params: { formdata: any; id: string }) => {
        const { formdata, id } = params;
    const response = await mainApiInstance.put('api/cusers/tickets', formdata);
    return response.data;
  }
);
