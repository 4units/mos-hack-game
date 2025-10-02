import { create } from 'zustand';

export type LevelState = {
  currentLevel: number;
  setCurrentLevel: (value: number) => void;
};

export const levelStore = create<LevelState>((set) => ({
  currentLevel: 0,
  setCurrentLevel: (value) => set({ currentLevel: value + 1 }),
}));

export const useLevelStore = levelStore;
