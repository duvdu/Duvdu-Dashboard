import { KEY_GET_ROLE_BY_ID } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionGetRoleById = createAsyncThunk(
  KEY_GET_ROLE_BY_ID,
  async (roleId: string) => {
    const response = await mainApiInstance.get(`api/users/roles/${roleId}`);
    return response.data;
  }
);

// {{url}}/api/users/roles/662b930f4566c8d2f8ed6ae4
// get
// ID