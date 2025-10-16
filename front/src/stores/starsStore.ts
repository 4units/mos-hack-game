import { create } from 'zustand';

export type StarsState = {
  balance: number;
  setBalance: (value: number) => void;
};

export const starsStore = create<StarsState>((set) => ({
  balance: 0,
  setBalance: (value) => set({ balance: value }),
}));

export const useStarsStore = starsStore;
