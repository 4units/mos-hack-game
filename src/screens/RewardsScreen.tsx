import { useState } from 'react';
import BaseHeader from '../components/BaseHeader.tsx';
import { achievements, prizes } from './rewards/constants';
import RewardsTabs, { type RewardsTab } from './rewards/components/RewardsTabs';
import AchievementsGrid from './rewards/components/AchievementsGrid';
import PrizesList from './rewards/components/PrizesList';

type RewardsScreenProps = {
  onBack: () => void;
};

const RewardsScreen = ({ onBack }: RewardsScreenProps) => {
  const [tab, setTab] = useState<RewardsTab>('achievements');

  return (
    <main className="main-bg flex min-h-screen items-start justify-center">
      <div className="relative w-full max-w-[25rem] text-white">
        <BaseHeader onBack={onBack} title={'Ваши успехи'} />

        <section className="px-[26px] py-6">
          <RewardsTabs active={tab} onChange={setTab} />

          {tab === 'achievements' ? (
            <AchievementsGrid items={achievements} />
          ) : (
            <PrizesList items={prizes} />
          )}
        </section>
      </div>
    </main>
  );
};

export default RewardsScreen;
