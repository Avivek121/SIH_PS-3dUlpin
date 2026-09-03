import { apiClient } from './client';
import { User, TokenResponse } from '../types';

export const authApi = {
  register: async (data: any) => {
    const response = await apiClient.post<TokenResponse>('/auth/register', data);
    return response.data;
  },
  login: async (email: string, password?: string) => {
    const payload = typeof email === 'object' ? email : { email, password };
    const response = await apiClient.post<TokenResponse>('/auth/login', payload);
    return response.data;
  },
  googleAuth: async (token?: string) => {
    const response = await apiClient.post<TokenResponse>('/auth/google', { code: token });
    return response.data;
  },
  appleAuth: async (data?: any) => {
    const payload = typeof data === 'string' ? { id_token: data } : (data || { id_token: 'demo' });
    const response = await apiClient.post<TokenResponse>('/auth/apple', payload);
    return response.data;
  },
  sendOTP: async (phone: string) => {
    const response = await apiClient.post('/auth/phone/send-otp', { phone });
    return response.data;
  },
  verifyOTP: async (phone: string, otp: string) => {
    const response = await apiClient.post<TokenResponse>('/auth/phone/verify', { phone, otp });
    return response.data;
  },
  refreshToken: async (refresh_token: string) => {
    const response = await apiClient.post<TokenResponse>('/auth/refresh', { refresh_token });
    return response.data;
  },
  getProfile: async () => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
  updateProfile: async (data: { id?: string; email?: string; full_name?: string; phone?: string }) => {
    const response = await apiClient.post<{ status: string; user: User }>('/auth/update-profile', data);
    return response.data;
  }
};
