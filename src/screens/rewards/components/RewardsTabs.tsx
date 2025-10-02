import { CupIcon, WinIcon } from '../../../components/icons';

export type RewardsTab = 'achievements' | 'prizes';

type RewardsTabsProps = {
  active: RewardsTab;
  onChange: (next: RewardsTab) => void;
};

const TABS: { key: RewardsTab; label: string }[] = [
  { key: 'achievements', label: 'Достижения' },
  { key: 'prizes', label: 'Призы' },
];

const RewardsTabs = ({ active, onChange }: RewardsTabsProps) => (
  <div className="mt-6 grid grid-cols-2 gap-3">
    {TABS.map(({ key, label }) => (
      <button
        key={key}
        type="button"
        onClick={() => onChange(key)}
        className={`overflow-hidden relative flex items-center rounded-[12px] border-[1px] border-white p-0 max-h-[45px] min-h-[45px] ${
          active === key ? 'bg-[#2D2DA2]' : 'bg-transparent'
        }`}
      >
        <div
          className={
            'py-2 border-r-[1px] border-t-[1px] border-b-[1px] rounded-r-[12px] flex flex-1 items-center justify-center max-h-[45px] min-h-[45px]'
          }
        >
          {key === 'achievements' ? <CupIcon /> : <WinIcon />}
        </div>
        <span className="text-2 font-medium flex-2">{label}</span>
      </button>
    ))}
  </div>
);

export default RewardsTabs;
