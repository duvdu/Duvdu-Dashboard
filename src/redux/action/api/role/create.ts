import { KEY_CREATE_ROLE } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionCreateRole = createAsyncThunk(
    KEY_CREATE_ROLE, async (params: { features: string[]; key: string }) => {
        const { features, key } = params;
        const response = await mainApiInstance.post('api/users/roles', {
            key,
            features,
        });
        return response.data;
    }
);

// {{url}}/api/users/roles
// {
//     "key":"",
//     "features":["app features"],
// }
//
// path parameter key , list features
// KEY_CREATE_ROLE
