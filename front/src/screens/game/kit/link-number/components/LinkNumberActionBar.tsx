import type { FC, ReactNode } from 'react';
import { BagIcon, LampIcon, LockIcon } from '../../../../../components/icons';

type LinkNumberActionBarProps = {
  onBagClick: () => void;
  onStopTime?: () => void;
  onShowHint?: () => void;
  stopTimeLabel?: ReactNode;
  hintLabel?: ReactNode;
  stopTimeDisabled?: boolean;
  hintDisabled?: boolean;
  bagDisabled?: boolean;
};

const LinkNumberActionBar: FC<LinkNumberActionBarProps> = ({
  onBagClick,
  onStopTime,
  onShowHint,
  stopTimeDisabled,
  hintDisabled,
  bagDisabled,
}) => {
  const className =
    'flex h-[45px] w-[56px] items-center justify-center rounded-[12px] border-[1px] border-white p-0';
  return (
    <div className="mt-[40px] flex w-full flex-row items-center gap-4">
      <button
        className={className}
        aria-label="Подсказки"
        type="button"
        disabled={bagDisabled}
        onClick={onBagClick}
      >
        <BagIcon />
      </button>
      <button
        className={className}
        aria-label="Остановить время"
        type="button"
        disabled={stopTimeDisabled}
        onClick={onStopTime}
      >
        <LockIcon />
      </button>
      {/* <StarsCount
        icon={<LockIcon />}
        label={stopTimeLabel ?? 'Стоп'}
        ariaLabel="Остановить время"
        disabled={stopTimeDisabled}
        onClick={onStopTime}
      /> */}
      {/* <StarsCount
        icon={<LampIcon />}
        label={hintLabel ?? 'Подсказка'}
        ariaLabel="Показать решение"
        disabled={hintDisabled}
        onClick={onShowHint}
      /> */}
      <button
        className={className}
        aria-label="Показать решение"
        type="button"
        disabled={hintDisabled}
        onClick={onShowHint}
      >
        <LampIcon />
      </button>
    </div>
  );
};

export default LinkNumberActionBar;
