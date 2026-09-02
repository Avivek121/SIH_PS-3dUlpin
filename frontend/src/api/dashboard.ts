import { apiClient } from './client';
import { DashboardStats, Notification, ValidationRecord, ChangeDetection, FlaggedProperty, RegistryHistory, GISLayer, Building, Parcel } from '../types';

export const dashboardApi = {
  getStatistics: async () => {
    const response = await apiClient.get<DashboardStats>('/dashboard/statistics');
    return response.data;
  },
  getStats: async () => {
    const response = await apiClient.get<DashboardStats>('/dashboard/statistics');
    return response.data;
  },
  getNotifications: async () => {
    const response = await apiClient.get<Notification[]>('/dashboard/notifications');
    return response.data;
  },
  markNotificationRead: async (id: string) => {
    const response = await apiClient.post(`/dashboard/notifications/${id}/read`);
    return response.data;
  },
  getValidations: async () => {
    const response = await apiClient.get<ValidationRecord[]>('/validation/records');
    return response.data;
  },
  getChanges: async () => {
    const response = await apiClient.get<ChangeDetection[]>('/validation/changes');
    return response.data;
  },
  getFlaggedProperties: async () => {
    const response = await apiClient.get<FlaggedProperty[]>('/validation/flagged');
    return response.data;
  },
  getRegistryHistory: async (propertyId?: string) => {
    const response = await apiClient.get<RegistryHistory[]>('/registry/history');
    return response.data;
  },
  getGISLayers: async () => {
    const response = await apiClient.get<GISLayer[]>('/gis/layers');
    return response.data;
  },
  getGISBuildings: async () => {
    const response = await apiClient.get<Building[]>('/gis/buildings');
    return response.data;
  },
  getGISParcels: async () => {
    const response = await apiClient.get<Parcel[]>('/gis/parcels');
    return response.data;
  }
};
