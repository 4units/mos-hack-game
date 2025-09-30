import type { Prize } from '../constants';

type PrizesListProps = {
  items: Prize[];
};

const PrizesList = ({ items }: PrizesListProps) => (
  <div className="mt-6 flex flex-col gap-4 pb-10">
    {items.map((p) => (
      <div
        key={p.id}
        className="rounded-[20px] p-4 bg-gradient-to-r from-pink-500/80 to-violet-500/80"
      >
        <p className="font-semibold leading-snug">{p.text}</p>
      </div>
    ))}
  </div>
);

export default PrizesList;
