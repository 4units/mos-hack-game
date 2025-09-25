import type { BaseTab, Prize, Victory } from './types';

export const baseTabs: BaseTab[] = [
  { value: 'map', label: 'Карта' },
  { value: 'victories', label: 'Победы' },
  { value: 'prizes', label: 'Призы' },
];

export const victories: Victory[] = [
  {
    id: 'start',
    title: 'Старт игры!',
    reward: 50,
  },
  {
    id: 'ten-quests',
    title: 'Победа в 10 квестах',
    reward: 100,
  },
  {
    id: 'daily-quests',
    title: '10 квестов в день',
    reward: 150,
  },
];

export const prizes: Prize[] = [
  {
    id: 'mobile-plan',
    title: 'Скидка 50% на тарифы Газпромбанк Мобайл',
    description: 'Скидка 50% на тарифы Газпромбанк Мобайл',
  },
  {
    id: 'life-insurance',
    title: 'Кешбэк 50% на страхование жизни',
    description: 'Кешбэк 50% на страхование жизни',
  },
];
