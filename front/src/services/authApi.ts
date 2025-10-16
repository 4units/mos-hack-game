import apiClient from './apiClient.ts';

export type AnonymousTokenResponse = {
  token: string;
};

export const signInAnonymously = async (): Promise<AnonymousTokenResponse> => {
  const { data } = await apiClient.get<AnonymousTokenResponse>('/user/token/anonymous');
  return data;
};
