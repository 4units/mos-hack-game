import apiClient from './apiClient';
import type { LevelFormat } from '../screens/game/kit/link-number/types';

export type LineGameLevelResponse = {
  field_size: number;
  start_cell: { x: number; y: number };
  end_cell: { x: number; y: number };
  order: { x: number; y: number }[];
  blockers: { x: number; y: number }[];
};

export type LineGameHintResponse = {
  answer: number[][];
};

export type CompleteLineLevelRequest = {
  answer: number[][];
  time_since_start: number;
};

export type CompleteLineLevelResponse = {
  soft_currency: number;
};

export const getLineGameLevel = async (): Promise<LevelFormat> => {
  const { data } = await apiClient.get<LineGameLevelResponse>('/game/line/level');
  return {
    field_size: data.field_size,
    start_cell: data.start_cell,
    end_cell: data.end_cell,
    order: data.order,
    blockers: data.blockers,
  };
};

export const getLineGameHint = async (): Promise<number[][]> => {
  const { data } = await apiClient.get<LineGameHintResponse>('/game/line/hint');
  return data.answer;
};

export const completeLineGameLevel = async (
  payload: CompleteLineLevelRequest
): Promise<CompleteLineLevelResponse> => {
  const { data } = await apiClient.post<CompleteLineLevelResponse>('/game/line/level', payload);
  return data;
};

export default getLineGameLevel;
