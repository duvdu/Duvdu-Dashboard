import { KEY_GET_COMPLAINT_BY_ID } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionGetComplaintById = createAsyncThunk(
  KEY_GET_COMPLAINT_BY_ID,
  async (roleId: string) => {
    const response = await mainApiInstance.get(`api/contracts/complaints/${roleId}`);
    return response.data;
  }
);
  