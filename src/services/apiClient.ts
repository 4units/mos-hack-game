import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL, TOKEN_COOKIE } from '../config';
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
  const token = Cookies.get(TOKEN_COOKIE);
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401) {
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
