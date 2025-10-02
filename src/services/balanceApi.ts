import apiClient from './apiClient';

export type BalanceResponse = {
  soft_currency: number;
};

export const getBalance = async (): Promise<BalanceResponse> => {
  const { data } = await apiClient.get<BalanceResponse>('/game/balance');
  return data;
};
