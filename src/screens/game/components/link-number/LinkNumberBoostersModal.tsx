import { useCallback, useEffect, useId, useRef, useState } from 'react';
import LinkNumberModalActionButton from './LinkNumberModalActionButton';
import LinkNumberPopoverModal from './LinkNumberPopoverModal';
import IconButton from '../../../../components/IconButton';
import { CloseIcon } from '../../../../components/icons';
import { getPriceConfig } from '../../../../services/configApi';

type LinkNumberBoostersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectHint: () => void;
  onSelectTimeStop: () => void;
  isHintDisabled?: boolean;
  isTimeStopDisabled?: boolean;
};

const DEFAULT_HINT_COST = 50;
const DEFAULT_TIME_COST = 200;

const LinkNumberBoostersModal = ({
  isOpen,
  onClose,
  onSelectHint,
  onSelectTimeStop,
  isHintDisabled,
  isTimeStopDisabled,
}: LinkNumberBoostersModalProps) => {
  const headingId = useId();
  const [hintCostLabel, setHintCostLabel] = useState<number | null>(null);
  const [timeCostLabel, setTimeCostLabel] = useState<number | null>(null);
  const hasLoadedPriceConfigRef = useRef(false);

  const loadPriceConfig = useCallback(async () => {
    try {
      const { line_game_hint_price, line_game_stop_time_booster_price } = await getPriceConfig();
      setHintCostLabel(Number.isFinite(line_game_hint_price) ? line_game_hint_price : null);
      setTimeCostLabel(
        Number.isFinite(line_game_stop_time_booster_price)
          ? line_game_stop_time_booster_price
          : null
      );
    } catch (error) {
      console.error('[LinkNumberBoostersModal] failed to load price config', error);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      hasLoadedPriceConfigRef.current = false;
      return;
    }

    if (hasLoadedPriceConfigRef.current) {
      return;
    }

    hasLoadedPriceConfigRef.current = true;
    loadPriceConfig();
  }, [isOpen, loadPriceConfig]);

  const hintCostText = hintCostLabel ?? DEFAULT_HINT_COST;
  const timeCostText = timeCostLabel ?? DEFAULT_TIME_COST;

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
            Вы можете взять подсказку шагов за {hintCostText} звёзд или остановить время на
            платформе за {timeCostText} звёзд.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <LinkNumberModalActionButton
          title="Подсказка"
          onClick={onSelectHint}
          costLabel={hintCostText}
          disabled={isHintDisabled}
        />
        <LinkNumberModalActionButton
          title="Блок времени"
          onClick={onSelectTimeStop}
          costLabel={timeCostText}
          disabled={isTimeStopDisabled}
        />
      </div>
    </LinkNumberPopoverModal>
  );
};

export default LinkNumberBoostersModal;
