import { KEY_GET_ROLES } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionGetRoles = createAsyncThunk(
  KEY_GET_ROLES,
  async () => {
    const response = await mainApiInstance.get('api/users/roles');
    return response.data;
  }
);

// {{url}}/api/users/roles
// get