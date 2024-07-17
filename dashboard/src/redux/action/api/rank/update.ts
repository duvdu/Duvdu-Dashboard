import { KEY_UPDATE_RANK } from '../../../constants/actionTypes'; // Assuming you have the appropriate action type defined
import { mainApiInstance } from '../axiosInstances';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const ActionUpdateRank = createAsyncThunk(
    KEY_UPDATE_RANK,
    async (params: { rank?: string; actionCount: number|string; rankId: string }) => {
        const { rankId, rank, actionCount } = params;
        const response = await mainApiInstance.patch(`api/analysis/rank/${rankId}`, {
            rank:rank ?? null,
            actionCount,
        });
        return response.data;
    }
);
