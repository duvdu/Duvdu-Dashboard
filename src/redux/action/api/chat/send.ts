import { createAsyncThunk } from '@reduxjs/toolkit';
import {  KEY_CHAT_SEND } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';


export const ActionSendMessage = createAsyncThunk(
    KEY_CHAT_SEND, async (params: { message: string,id: string }) => {
        const { message , id} = params;
        const formdata = new FormData()
        formdata.append('content',message)
        formdata.append('receiver',id)
        const response = await mainApiInstance.post(`/api/message`,formdata);
        return response.data;
    }
); 