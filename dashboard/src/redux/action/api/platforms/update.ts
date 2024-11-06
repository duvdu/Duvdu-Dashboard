import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_UPDATE_PLATFORM } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';

export const ActionUpdatePlatform = createAsyncThunk(
  KEY_UPDATE_PLATFORM,  async ({ formdata, id }: { formdata: any; id: any }) => {
    const response = await mainApiInstance.patch(`api/producers/platforms/${id}`, formdata);
    return response.data;
  }
);
