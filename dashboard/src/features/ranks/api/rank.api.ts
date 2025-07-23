import axios from '@/lib/axios';
import type { RankSchema } from '../schemas/rank.schema';
import type { Rank } from '../types/rank.types';

// List ranks
export const getRanks = async (filters?: { page?: number; limit?: number }) => {
  const { data } = await axios.get('/api/analysis/rank', { params: filters });
  return data;
};

// Get rank by ID
export const getRankById = async (id: string) => {
  const { data } = await axios.get(`/api/analysis/rank/${id}`);
  return data?.data as Rank;
};

// Create rank
export const createRank = async (values: RankSchema) => {
  const { data } = await axios.post('/api/analysis/rank', values);
  return data;
};

// Update rank
export const updateRank = async (id: string, values: RankSchema) => {
  const { data } = await axios.patch(`/api/analysis/rank/${id}`, values);
  return data;
};

// Delete rank
export const deleteRank = async (id: string) => {
  const { data } = await axios.delete(`/api/analysis/rank/${id}`);
  return data;
};
