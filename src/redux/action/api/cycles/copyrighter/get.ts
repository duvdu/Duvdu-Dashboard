import { createAsyncThunk } from '@reduxjs/toolkit';
import { mainApiInstance } from '../../axiosInstances';
import { KEY_COPY_RIGHTS } from '../../../../constants/actionTypes';

export const ActionGetCopyRight = createAsyncThunk(
  KEY_COPY_RIGHTS, async () => {
    const response = await mainApiInstance.get('api/copyrights/crm');
    return response.data;
  }
); 