import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CATEGORY, KEY_TERMS } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionGetTerms = createAsyncThunk(
    KEY_TERMS, async () => {
    const response = await mainApiInstance.get('api/users/terms/crm');
    return response.data;
  }
); 