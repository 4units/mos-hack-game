import { useId } from 'react';
import LinkNumberModalActionButton from './LinkNumberModalActionButton.tsx';
import LinkNumberPopoverModal from './LinkNumberPopoverModal.tsx';
import IconButton from '../../../../components/IconButton.tsx';
import { CloseIcon } from '../../../../components/icons';

type LinkNumberTimeStopModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
};

const LinkNumberTimeStopModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
}: LinkNumberTimeStopModalProps) => {
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
        disabled={isSubmitting}
      >
        <CloseIcon />
      </IconButton>
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-2">
          <span id={headingId} className="text-center text-1 text-[var(--color-black)]">
            Без спешки
          </span>
          <p className="text-center text-2 text-[var(--color-black)]">
            Остановите таймер и пройдите платформу без ограничений по времени.
          </p>
        </div>
      </div>

      <LinkNumberModalActionButton
        title={isSubmitting ? 'Блокируем...' : 'Блок времени'}
        onClick={onConfirm}
        disabled={isSubmitting}
      />
    </LinkNumberPopoverModal>
  );
};

export default LinkNumberTimeStopModal;
