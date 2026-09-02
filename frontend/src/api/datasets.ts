import { apiClient } from './client';
import { Dataset, ProcessingJob } from '../types';

export const datasetsApi = {
  getDatasets: async () => {
    const response = await apiClient.get<Dataset[]>('/datasets');
    return response.data;
  },
  uploadDataset: async (file: File, type: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const response = await apiClient.post<Dataset>('/datasets/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  getProcessingStatus: async (jobId: string) => {
    const response = await apiClient.get<ProcessingJob>(`/processing/${jobId}`);
    return response.data;
  },
  startProcessing: async (datasetId: string, options?: any) => {
    const response = await apiClient.post<ProcessingJob>(`/processing/start`, { datasetId, ...options });
    return response.data;
  }
};
