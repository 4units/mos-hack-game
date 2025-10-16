import RewardCard from './RewardCard.tsx';
import type { Achievement } from '../constants.ts';

type AchievementsGridProps = {
  items: Achievement[];
};

const AchievementsGrid = ({ items }: AchievementsGridProps) => (
  <div className="mt-6 grid grid-cols-3 gap-4 pb-10">
    {items.map((a) => (
      <RewardCard key={a.id} title={a.title} reward={a.reward} unlocked={a.unlocked} />
    ))}
  </div>
);

export default AchievementsGrid;
