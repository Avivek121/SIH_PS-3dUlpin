import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(async (credentials: any) => {
    setLoading(true);
    setError(null);
    try {
      const { access_token } = await authApi.login(credentials);
      const profile = await authApi.getProfile();
      login(profile, access_token);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, [login]);

  const handleRegister = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      await authApi.register(data);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout
  };
};
