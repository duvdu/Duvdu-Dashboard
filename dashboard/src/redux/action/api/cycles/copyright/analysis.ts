import { createAsyncThunk } from '@reduxjs/toolkit';
import { mainApiInstance } from '../../axiosInstances';
import { KEY_COPY_RIGHTS_ANALYSIS } from '../../../../constants/actionTypes';

export const ActionGetCopyRightAnalysis = createAsyncThunk(
  KEY_COPY_RIGHTS_ANALYSIS, async () => {
    const response = await mainApiInstance.get('api/copyrights/analysis');
    return response.data;
  }
); 