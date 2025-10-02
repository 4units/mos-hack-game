import { useId } from 'react';
import LinkNumberModalActionButton from './LinkNumberModalActionButton';
import LinkNumberPopoverModal from './LinkNumberPopoverModal';
import IconButton from '../../../../components/IconButton';
import { CloseIcon } from '../../../../components/icons';

type LinkNumberBoostersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectHint: () => void;
  onSelectTimeStop: () => void;
  hintCostLabel?: string | number;
  timeCostLabel?: string | number;
  isHintDisabled?: boolean;
  isTimeStopDisabled?: boolean;
};

const LinkNumberBoostersModal = ({
  isOpen,
  onClose,
  onSelectHint,
  onSelectTimeStop,
  hintCostLabel,
  timeCostLabel,
  isHintDisabled,
  isTimeStopDisabled,
}: LinkNumberBoostersModalProps) => {
  const headingId = useId();

  return (
    <LinkNumberPopoverModal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={headingId}
      className="relative"
    >
      <IconButton
        variant="ghost"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute top-[16px] right-[16px]"
      >
        <CloseIcon />
      </IconButton>
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-2">
          <span id={headingId} className="text-center text-1 text-[var(--color-black)]">
            Как быстро пройти платформу?
          </span>
          <p className="text-center text-2 text-[var(--color-black)]">
            Вы можете взять подсказку шагов за {hintCostLabel ?? 50} звёзд или остановить время на
            платформе за {timeCostLabel ?? 200} звёзд.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <LinkNumberModalActionButton
          title="Подсказка"
          onClick={onSelectHint}
          costLabel={hintCostLabel ?? 50}
          disabled={isHintDisabled}
        />
        <LinkNumberModalActionButton
          title="Блок времени"
          onClick={onSelectTimeStop}
          costLabel={timeCostLabel ?? 200}
          disabled={isTimeStopDisabled}
        />
      </div>
    </LinkNumberPopoverModal>
  );
};

export default LinkNumberBoostersModal;
