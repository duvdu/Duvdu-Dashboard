import { KEY_GET_COMPLAINTS } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionGetComplaints = createAsyncThunk(
  KEY_GET_COMPLAINTS,
  async () => {
    const response = await mainApiInstance.get('api/contracts/complaints');
    return response.data;
  }
);
