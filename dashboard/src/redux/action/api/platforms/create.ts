import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CREATE_PLATFORM } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionCreatePlatform = createAsyncThunk(KEY_CREATE_PLATFORM,async (params: { formdata?: any; id?: string }) => {
  const { formdata, id } = params;
    const response = await mainApiInstance.post('api/producers/platforms', formdata);
    return response.data;
  }
);