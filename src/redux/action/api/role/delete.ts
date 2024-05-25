import { KEY_DELETE_ROLE } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionDeleteRole = createAsyncThunk(
  KEY_DELETE_ROLE,
  async (roleId: string) => {
    const response = await mainApiInstance.delete(`api/users/roles/${roleId}`);
    return response.data;
  }
);


// {{url}}/api/users/roles/{roleId}
// delete
// role id