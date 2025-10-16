import type { FC } from 'react';
import { LineIcon, StarIcon } from '../../../../components/icons';

type LinkNumberModalActionButtonProps = {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  costLabel?: string | number;
};

const LinkNumberModalActionButton: FC<LinkNumberModalActionButtonProps> = ({
  title,
  onClick,
  disabled = false,
  costLabel,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`flex w-full items-center rounded-[20px] bg-[var(--color-violet)] px-6 py-4 text-[18px] font-medium text-white ${
      costLabel ? 'justify-between gap-6' : 'justify-center'
    }`}
    style={{ opacity: disabled ? 0.6 : 1 }}
  >
    <span className="text-1">{title}</span>
    {costLabel !== undefined && <LineIcon />}

    {costLabel !== undefined && (
      <span className="flex items-center gap-2 pl-6">
        <StarIcon className="h-5 w-5" />
        <span className="text-1">{costLabel}</span>
      </span>
    )}
  </button>
);

export default LinkNumberModalActionButton;
