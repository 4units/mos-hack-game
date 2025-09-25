import { HomeIcon } from '../../../components/icons';

type BasePrizeCardProps = {
  title: string;
  description: string;
};

const BasePrizeCard = ({ title, description }: BasePrizeCardProps) => (
  <article className="flex gap-4 rounded-[1.875rem] border border-[var(--color-black)] bg-[#dedede] px-5 py-6 shadow-[0_4px_0_rgba(0,0,0,0.08)]">
    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_rgba(16,18,22,0.12)]">
      <HomeIcon className="h-9 w-9" />
    </div>

    <div className="flex flex-col gap-2 text-left">
      <h4 className="text-base font-bold leading-tight text-[var(--color-black)]">{title}</h4>
      <p className="text-sm text-[var(--color-muted)]">{description}</p>
      <button
        type="button"
        className="self-start border-0 p-0 text-sm font-semibold text-[var(--color-black)] underline decoration-[var(--color-black)] decoration-2 underline-offset-4"
      >
        Подробнее
      </button>
    </div>
  </article>
);

export default BasePrizeCard;
