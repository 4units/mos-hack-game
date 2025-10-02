import apiClient from './apiClient';
import type { LevelFormat } from '../screens/game/kit/link-number/types';

export type LineGameLevelResponse = {
  field_size: number;
  start_cell: { x: number; y: number };
  end_cell: { x: number; y: number };
  order: { x: number; y: number }[];
  blockers: { x: number; y: number }[];
  level_num: number; // Начинается с 0
};

export type CompleteLineLevelRequest = {
  time_since_start: number;
};

export type CompleteLineLevelResponse = {
  soft_currency: number;
};

export const TIME_STOP_BOOSTER_ENDPOINT = '/game/line/time-stop-booster';
export const HINT_BOOSTER_ENDPOINT = '/game/line/hint';

export const getLineGameLevel = async (): Promise<LevelFormat> => {
  const { data } = await apiClient.get<LineGameLevelResponse>('/game/line/level');
  return {
    field_size: data.field_size,
    start_cell: data.start_cell,
    end_cell: data.end_cell,
    order: data.order,
    blockers: data.blockers,
    level_num: data.level_num,
  };
};

export const completeLineGameLevel = async (
  payload: CompleteLineLevelRequest
): Promise<CompleteLineLevelResponse> => {
  const { data } = await apiClient.post<CompleteLineLevelResponse>('/game/line/level', payload);
  return data;
};

export const spendTimeStopBooster = async (): Promise<void> => {
  await apiClient.get(TIME_STOP_BOOSTER_ENDPOINT);
};

export const spendHintBooster = async (): Promise<void> => {
  await apiClient.get(HINT_BOOSTER_ENDPOINT);
};

export default getLineGameLevel;
