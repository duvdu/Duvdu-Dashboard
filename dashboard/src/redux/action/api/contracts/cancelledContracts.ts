import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionDeleteCancelledContract = createAsyncThunk(
  'DELETE_CANCELLED_CONTRACT',
  async (id: string) => {
    const response = await mainApiInstance.delete(`api/contracts/contractCancel/${id}`);
    return response.data;
  }
);

export const ActionAcceptCancelledContract = createAsyncThunk(
  'ACCEPT_CANCELLED_CONTRACT',
  async (id: string) => {
    const response = await mainApiInstance.patch(`api/contracts/contractCancel/${id}`);
    return response.data;
  }
); 