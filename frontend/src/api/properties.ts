import { apiClient } from './client';
import { Parcel, Building, Floor, PropertyUnit } from '../types';

export const propertiesApi = {
  getProperties: async (params?: any) => {
    const response = await apiClient.get<Parcel[]>('/properties', { params });
    return response.data;
  },
  getProperty: async (id: string) => {
    const response = await apiClient.get<Parcel>(`/properties/${id}`);
    return response.data;
  },
  getBuilding: async (id: string) => {
    const response = await apiClient.get<Building>(`/buildings/${id}`);
    return response.data;
  },
  getBuildingFloors: async (buildingId: string) => {
    const response = await apiClient.get<Floor[]>(`/buildings/${buildingId}/floors`);
    return response.data;
  }
};
