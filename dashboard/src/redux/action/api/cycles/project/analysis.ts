import { createAsyncThunk } from '@reduxjs/toolkit';
import { mainApiInstance } from '../../axiosInstances';
import { KEY_PROJECT_ANALYSIS } from '../../../../constants/actionTypes';

export const ActionGetProjectAnalysis = createAsyncThunk(
  KEY_PROJECT_ANALYSIS, async () => {
    const response = await mainApiInstance.get('api/projects/analysis');
    return response.data;
  }
); 