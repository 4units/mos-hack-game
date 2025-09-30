import { StarIcon } from './icons';
import { type ButtonHTMLAttributes, useMemo } from 'react';
import { formatStars } from '../utils/format';

type StarsCountProps = {
  number: number;
  disabled?: boolean;
  color?: 'violet' | 'white';
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;

const StarsCount = ({ number, disabled, onClick, color = 'white' }: StarsCountProps) => {
  const currentColor = useMemo(
    () => (color === 'white' ? 'var(--color-white)' : 'var(--color-violet)'),
    [color]
  );
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
    relative overflow-hidden flex flex-row w-fit items-center justify-center border-[1px] rounded-[12px] min-h-[45px] max-h-[45px] p-0 gap-[15px]
  `}
      style={{
        color: currentColor,
        borderColor: currentColor,
      }}
    >
      <div
        className="p-2 flex-1 border-r-[1px] border-t-[1px] border-b-[1px] flex items-center justify-center rounded-[12px] min-h-[45px] max-h-[45px] w-[56px]"
        style={{ borderColor: currentColor }}
      >
        <StarIcon />
      </div>
      <span className="text-2 font-medium flex-2 pr-[18px]">{formatStars(number)}</span>
    </button>
  );
};

export default StarsCount;
