import { createAsyncThunk } from '@reduxjs/toolkit';
import { KEY_CHAT_SEND } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';
import { FileInfo } from '../../../../utils/helper';


export const ActionSendMessage = createAsyncThunk(
    KEY_CHAT_SEND, async (params: { message: string, id: any, files?: FileInfo[], vocieNote?: File | any }) => {
        const { vocieNote, message, id, files } = params;
        console.log(vocieNote, message, id, files)
        const formdata = new FormData()
        if(message)
        formdata.append('content', message)
        formdata.append('receiver', id)
        if (vocieNote) {
            formdata.append('attachments', vocieNote)
            formdata.append('content', '.')

        }
        else if (files && files.length > 0) {
            files.forEach(file => {
                formdata.append('attachments', file.file);
            });
            if ((message?.length || 0) == 0)
                formdata.append('content', '.')
        }
        const response = await mainApiInstance.post(`/api/message`, formdata);
        return response.data;
    }
); 