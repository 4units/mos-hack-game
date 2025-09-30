import { StarIcon } from '../../../components/icons';

export type RewardCardProps = {
  title: string;
  reward: number;
  unlocked?: boolean;
};

const RewardCard = ({ title, reward, unlocked = false }: RewardCardProps) => (
  <div className="relative flex flex-col justify-end rounded-[20px] p-4 h-[180px] bg-gradient-to-br from-[#6ea3ff] via-[#5b79e6] to-[#2a3687] text-white shadow-[0_10px_30px_rgba(0,0,0,.35)]">
    {/* image placeholder - replace later */}
    <div className="absolute left-1/2 top-4 -translate-x-1/2 h-24 w-24 rounded-full bg-white/10" />
    <div className={`mt-auto ${unlocked ? '' : 'opacity-70'}`}>
      <p className="font-semibold leading-tight">{title}</p>
      <div className="mt-2 inline-flex items-center gap-2 text-white/90">
        <StarIcon className="h-4 w-4" />
        <span className="font-bold">{reward}</span>
      </div>
    </div>
  </div>
);

export default RewardCard;
