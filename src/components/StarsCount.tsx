import { StarIcon } from './icons';

type StarsCountProps = {
  number: number;
  disabled?: boolean;
};

const StarsCount = ({ number, disabled }: StarsCountProps) => (
  <button
    type="button"
    disabled={disabled}
    className="relative overflow-hidden flex flex-row gap-0 items-center justify-center text-white border-white border-[1px] rounded-[12px] min-h-[45px] w-[131px]"
  >
    <div className="border-r-[1px] border-t-[1px] border-b-[1px] border-white flex items-center justify-center rounded-[12px] absolute left-0 min-h-[45px] w-[56px]">
      <StarIcon />
    </div>
    <span className="text-2 absolute right-[18px]">{number}</span>
  </button>
);

export default StarsCount;
