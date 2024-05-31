import { createAsyncThunk } from '@reduxjs/toolkit';
import { mainApiInstance } from '../../axiosInstances';
import { KEY_PORTFOLIO_POST } from '../../../../constants/actionTypes';

export const ActionDeleteProducer = createAsyncThunk(
  KEY_PORTFOLIO_POST, async () => {
    const response = await mainApiInstance.get('api/producer/crm');
    return response.data;
  }
); 