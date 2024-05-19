import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CATEGORY, KEY_TERMS } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';

export const ActionUpdateTerms = createAsyncThunk(KEY_TERMS, async (params: { formdata: any; id: string }) => {
    const { formdata, id } = params;
    const response = await mainApiInstance.put(`api/users/terms/${id}`, formdata);
    return response.data;
})
