import { createAsyncThunk } from '@reduxjs/toolkit';
import { mainApiInstance } from '../../axiosInstances';
import { KEY_CONTRACT_ANALYSIS } from '../../../../constants/actionTypes';

export const ActionGetContractAnalysis = createAsyncThunk(
  KEY_CONTRACT_ANALYSIS, async () => {
    const response = await mainApiInstance.get('api/contracts/analysis');
    return response.data;
  }
); 