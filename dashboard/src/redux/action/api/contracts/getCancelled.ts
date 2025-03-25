import { KEY_GET_CANCELLED_CONTRACTS } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionGetCancelledContracts = createAsyncThunk(
  KEY_GET_CANCELLED_CONTRACTS,
  async (params:{limit?: string|number, page?: string|number}) => {
    const { limit, page } = params;
    const queryParams = { limit, page };
    const response = await mainApiInstance.get('api/contracts/contractCancel', {
      params: queryParams,
    });
    return response.data;
  }
); 