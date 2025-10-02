import type { AxiosError } from 'axios';
import apiClient, { type ApiErrorResponse } from './apiClient';

export type AnonymousTokenResponse = {
  token: string;
};

export const signInAnonymously = async (): Promise<AnonymousTokenResponse> => {
  // Some backends accept GET; if POST fails with 405, switch to GET.
  try {
    const { data } = await apiClient.post<AnonymousTokenResponse>('/user/token/anonymous');
    return data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    // Method not allowed — try GET as a fallback
    if (err?.response?.status === 405) {
      const { data } = await apiClient.get<AnonymousTokenResponse>('/user/token/anonymous');
      return data;
    }
    throw err;
  }
};
