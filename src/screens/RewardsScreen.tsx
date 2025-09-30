import { useState } from 'react';
import { StarIcon } from '../components/icons';
import BaseHeader from '../components/BaseHeader.tsx';

type RewardsScreenProps = {
  onBack: () => void;
};

type Achievement = {
  id: string;
  title: string;
  reward: number;
  imageSrc?: string;
  unlocked?: boolean;
};

const achievements: Achievement[] = [
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

const RewardCard = ({
  title,
  reward,
  unlocked = false,
}: Pick<Achievement, 'title' | 'reward' | 'unlocked'>) => (
  <div className="flex flex-col justify-end rounded-[20px] p-4 h-[180px] bg-gradient-to-br from-[#6ea3ff] via-[#5b79e6] to-[#2a3687] text-white shadow-[0_10px_30px_rgba(0,0,0,.35)]">
    {/* image placeholder */}
    <div className="absolute -mt-24 self-center h-24 w-24 rounded-full bg-white/10" />
    <div className={`mt-auto ${unlocked ? '' : 'opacity-70'}`}>
      <p className="font-semibold leading-tight">{title}</p>
      <div className="mt-2 inline-flex items-center gap-2 text-white/90">
        <StarIcon className="h-3 w-3" />
        <span className="font-bold">{reward}</span>
      </div>
    </div>
  </div>
);

const RewardsScreen = ({ onBack }: RewardsScreenProps) => {
  const [tab, setTab] = useState<'achievements' | 'prizes'>('achievements');

  return (
    <main className="main-bg flex min-h-screen items-start justify-center">
      <div className="relative w-full max-w-[25rem] text-white">
        <BaseHeader onBack={onBack} title={'Ваши успехи'} />

        <section className="px-[26px] py-6">
          {/* Tabs */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTab('achievements')}
              className={`flex items-center justify-center gap-2 rounded-[14px] border px-3 py-2 ${tab === 'achievements' ? 'bg-white/10' : 'bg-transparent'}`}
            >
              <span className="text-2">Достижения</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('prizes')}
              className={`flex items-center justify-center gap-2 rounded-[14px] border px-3 py-2 ${tab === 'prizes' ? 'bg-white/10' : 'bg-transparent'}`}
            >
              <span className="text-2">Призы</span>
            </button>
          </div>

          {/* Content */}
          {tab === 'achievements' ? (
            <div className="mt-6 grid grid-cols-2 gap-4 pb-10">
              {achievements.map((a) => (
                <RewardCard key={a.id} title={a.title} reward={a.reward} unlocked={a.unlocked} />
              ))}
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-4 pb-10">
              <div className="rounded-[20px] p-4 bg-gradient-to-r from-pink-500/80 to-violet-500/80">
                <p className="font-semibold leading-snug">
                  Скидка 50% новым абонентам на все годовые тарифы Газпромбанк Мобайл
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default RewardsScreen;
