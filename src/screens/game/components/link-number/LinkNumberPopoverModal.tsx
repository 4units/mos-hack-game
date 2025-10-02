import type { PropsWithChildren } from 'react';
import { Modal } from '../../../../components/modal';

type LinkNumberPopoverModalProps = PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
  labelledBy?: string;
  className?: string;
}>;

const LinkNumberPopoverModal = ({
  isOpen,
  onClose,
  labelledBy,
  className,
  children,
}: LinkNumberPopoverModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    labelledBy={labelledBy}
    overlayClassName="link-number-modal-overlay"
  >
    <div
      className={`link-number-popover mx-auto flex w-[min(23rem,90vw)] flex-col gap-6 ${className ?? ''}`.trim()}
    >
      {children}
    </div>
  </Modal>
);

export default LinkNumberPopoverModal;
