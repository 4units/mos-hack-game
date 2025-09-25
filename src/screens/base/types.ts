export type BaseTabValue = 'map' | 'victories' | 'prizes';

export type BaseTab = {
  value: BaseTabValue;
  label: string;
};

export type Victory = {
  id: string;
  title: string;
  reward: number;
  description?: string;
};

export type Prize = {
  id: string;
  title: string;
  description: string;
};
