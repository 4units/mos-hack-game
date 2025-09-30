import { StarIcon } from './icons';

type StarsCountProps = {
  number: number;
};

const StarsCount = ({ number }: StarsCountProps) => (
  <div className="flex flex-row gap-0 items-center justify-center text-white border-white border-[1px] rounded-[12px] px-2 min-h-[45px]">
    <div>
      <StarIcon />
    </div>
    <span className="text-2">{number}</span>
  </div>
);

export default StarsCount;
