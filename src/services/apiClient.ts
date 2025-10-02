import axios from 'axios';
import { API_BASE_URL, AUTH_TOKEN_KEY } from '../config';
import { authStore } from '../stores/authStore';

export type ApiErrorResponse = {
  message: string;
  code: string;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  try {
    const token =
      typeof window !== 'undefined' ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null;
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      console.log('[apiClient] attached token');
    }
  } catch {
    /* Empty */
  }
  return config;
});

apiClient.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn('[apiClient] 401 received, clearing auth');
      try {
        authStore.getState().clear();
      } catch (error) {
        console.error(error);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
