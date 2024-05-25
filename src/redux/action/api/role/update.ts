import { KEY_UPDATE_ROLE } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionUpdateRole = createAsyncThunk(
    KEY_UPDATE_ROLE,
    async (params: { features: string[]; key: string, roleId: string }) => {
        const { roleId, key, features } = params;
        const response = await mainApiInstance.put(`api/users/roles/${roleId}`, {
            key,
            features,
        });
        return response.data;
    }
);

// {
//     "key":"",
//     "features":["app features"]
// }
// put
// {{url}}/api/users/roles/{roleId}
// key , list features