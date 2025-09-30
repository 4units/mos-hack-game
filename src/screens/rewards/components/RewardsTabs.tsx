export type RewardsTab = 'achievements' | 'prizes';

type RewardsTabsProps = {
  active: RewardsTab;
  onChange: (next: RewardsTab) => void;
};

const RewardsTabs = ({ active, onChange }: RewardsTabsProps) => (
  <div className="mt-6 grid grid-cols-2 gap-3">
    <button
      type="button"
      onClick={() => onChange('achievements')}
      className={`flex items-center justify-center gap-2 rounded-[14px] border px-3 py-2 ${
        active === 'achievements' ? 'bg-white/10' : 'bg-transparent'
      }`}
    >
      <span className="text-2">Достижения</span>
    </button>

    <button
      type="button"
      onClick={() => onChange('prizes')}
      className={`flex items-center justify-center gap-2 rounded-[14px] border px-3 py-2 ${
        active === 'prizes' ? 'bg-white/10' : 'bg-transparent'
      }`}
    >
      <span className="text-2">Призы</span>
    </button>
  </div>
);

export default RewardsTabs;
