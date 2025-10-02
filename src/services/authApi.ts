import apiClient from './apiClient';

export type AnonymousTokenResponse = {
  token: string;
};

export const signInAnonymously = async (): Promise<AnonymousTokenResponse> => {
  const { data } = await apiClient.get<AnonymousTokenResponse>('/user/token/anonymous');
  return data;
};
