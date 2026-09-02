import { apiClient } from './client';
import { ULPINSearchResult, ULPIN } from '../types';

export const ulpinApi = {
  searchULPIN: async (query: string) => {
    const response = await apiClient.get<ULPINSearchResult[]>('/ulpin/search', { params: { q: query } });
    return response.data;
  },
  getULPIN: async (ulpin: string) => {
    const response = await apiClient.get<ULPIN>(`/ulpin/${ulpin}`);
    return response.data;
  },
  generateULPIN: async (data: any) => {
    const response = await apiClient.post<string>('/ulpin/generate', data);
    return response.data;
  }
};
