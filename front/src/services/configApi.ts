import apiClient from './apiClient.ts';

export type PriceConfigResponse = {
  line_game_hint_price: number;
  line_game_stop_time_booster_price: number;
};

export const getPriceConfig = async (): Promise<PriceConfigResponse> => {
  const { data } = await apiClient.get<PriceConfigResponse>('/config/price');
  return data;
};

const configApi = {
  getPriceConfig,
};

export default configApi;
