import { HomeIcon, StarIcon } from '../../../components/icons';

type BaseVictoryCardProps = {
  title: string;
  reward: number;
};

const BaseVictoryCard = ({ title, reward }: BaseVictoryCardProps) => (
  <article className="flex h-full flex-col items-center gap-5 rounded-[1.875rem] border border-[var(--color-black)] bg-[#dedede] px-5 py-6 text-center shadow-[0_4px_0_rgba(0,0,0,0.08)]">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_rgba(16,18,22,0.12)]">
      <HomeIcon className="h-9 w-9" />
    </div>

    <p className="font-semibold text-[var(--color-black)] leading-snug">{title}</p>

    <div className="flex items-center gap-2">
      <StarIcon className="h-5 w-5" />
      <span className="font-semibold text-[var(--color-black)]">{reward}</span>
    </div>
  </article>
);

export default BaseVictoryCard;
