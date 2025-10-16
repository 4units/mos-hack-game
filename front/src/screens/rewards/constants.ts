import gift from '../../assets/gift.png';

export type Achievement = {
  id: string;
  title: string;
  reward: number;
  imageSrc?: string;
  unlocked?: boolean;
};

export const achievements: Achievement[] = [
  { id: 'start', title: 'Старт игры!', reward: 100, unlocked: true },
  { id: '5-chain', title: 'Пройти 5 платформ подряд', reward: 200, unlocked: true },
  { id: '10-chain', title: 'Пройти 10 платформ подряд', reward: 500 },
  { id: '10-day', title: 'Пройти 10 платформ в день', reward: 200 },
  { id: '20-day', title: 'Пройти 20 платформ в день', reward: 500 },
  { id: '30-day', title: 'Пройти 30 платформ в день', reward: 800 },
  { id: 'quiz-5-chain', title: 'Ответить на 5 вопросов квиза подряд', reward: 100 },
  { id: 'quiz-10-chain', title: 'Ответить на 10 вопросов квиза подряд', reward: 200 },
  { id: 'quiz-5-day', title: 'Ответить на 5 вопросов квиза в день', reward: 100 },
  { id: 'quiz-10-day', title: 'Ответить на 10 вопросов квиза в день', reward: 200 },
];

export type Prize = {
  id: string;
  text: string;
  img: string;
};

export const prizes: Prize[] = [
  {
    id: 'gpb-mobile-discount',
    text: 'Скидка 50% новым абонентам на все годовые тарифы Газпромбанк Мобайл',
    img: gift,
  },
];
