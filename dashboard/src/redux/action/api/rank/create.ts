import { KEY_CREATE_RANK } from '../../../constants/actionTypes';
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionCreateRank = createAsyncThunk(
    KEY_CREATE_RANK, 
    async (params: { rank: string; actionCount: number|string , color:string }) => {
        const { rank,actionCount,color } = params;
        const response = await mainApiInstance.post('api/analysis/rank', {
            rank,
            actionCount,
            color
        });
        return response.data;
    }
);