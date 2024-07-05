import { createAsyncThunk } from '@reduxjs/toolkit';
import { mainApiInstance } from '../../axiosInstances';
import { KEY_PORTFOLIO_POST, KEY_STUDIO_BOOKING } from '../../../../constants/actionTypes';

export const ActionDeleteStudio = createAsyncThunk(
  KEY_STUDIO_BOOKING, async (id) => {
    const response = await mainApiInstance.get(`api/studio-booking/${id}`);
    return response.data;
  }
); 