import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CATEGORY_CREATE } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionCreateCategory = createAsyncThunk(KEY_CATEGORY_CREATE,async (params: { formdata?: any; id?: string }) => {
  const { formdata, id } = params;
  // console.log(formdata)
  // for (const [key, value] of formdata.entries()) {
  //   console.log(`${key}: ${value}`);
  // }
    const response = await mainApiInstance.post('api/category', formdata);
    return response.data;
  }
);