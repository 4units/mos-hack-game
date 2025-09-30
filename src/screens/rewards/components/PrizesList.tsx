import type { Prize } from '../constants';
type PrizesListProps = {
  items: Prize[];
};

const PrizesList = ({ items }: PrizesListProps) => (
  <div className="mt-10 flex flex-col gap-8 pb-10">
    {items.map((p) => (
      <div
        key={p.id}
        className="flex flex-row rounded-[12px] p-3 bg-gradient-to-r from-[#DD41DB] to-[#FF82BE] items-center gap-2 h-[80px]"
      >
        <img src={p.img} alt={p.text} className="w-[139px] mt-[-30px]" />
        <p className="font-medium text-2">{p.text}</p>
      </div>
    ))}
  </div>
);

export default PrizesList;
