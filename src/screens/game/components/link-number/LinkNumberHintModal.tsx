import { useId } from 'react';
import LinkNumberModalActionButton from './LinkNumberModalActionButton';
import LinkNumberPopoverModal from './LinkNumberPopoverModal';
import IconButton from '../../../../components/IconButton';
import { CloseIcon } from '../../../../components/icons';

type LinkNumberHintModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
};

const LinkNumberHintModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
}: LinkNumberHintModalProps) => {
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
            Кажется, вам нужна помощь?
          </span>
          <p className="text-center text-2 text-[var(--color-black)]">
            Ничего страшного! Возьмите подсказку и узнайте следующие шаги.
          </p>
        </div>
      </div>

      <LinkNumberModalActionButton
        title={isSubmitting ? 'Подсказка...' : 'Взять подсказку'}
        onClick={onConfirm}
        disabled={isSubmitting}
      />
    </LinkNumberPopoverModal>
  );
};

export default LinkNumberHintModal;
