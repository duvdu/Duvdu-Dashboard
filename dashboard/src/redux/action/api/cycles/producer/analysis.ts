import { createAsyncThunk } from '@reduxjs/toolkit';
import { mainApiInstance } from '../../axiosInstances';
import { KEY_PRODUCER_ANALYSIS } from '../../../../constants/actionTypes';

export const ActionGetProducerAnalysis = createAsyncThunk(
  KEY_PRODUCER_ANALYSIS, async () => {
    const response = await mainApiInstance.get('api/producers/producer/crm/analysis');
    return response.data;
  }
); 