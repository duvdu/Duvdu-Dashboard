import { createAsyncThunk } from '@reduxjs/toolkit';
import { mainApiInstance } from '../../axiosInstances';
import { KEY_PORTFOLIO_POST } from '../../../../constants/actionTypes';

export const ActionGetPortfolio = createAsyncThunk(
  KEY_PORTFOLIO_POST, async () => {
    const response = await mainApiInstance.get('api/portfolio-post/crm');
    return response.data;
  }
); 