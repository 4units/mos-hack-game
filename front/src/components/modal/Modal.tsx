import { type CSSProperties, type PropsWithChildren, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

const MODAL_ROOT_ID = 'modal-root';

export type ModalProps = PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
  labelledBy?: string;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
}>;

const Modal = ({
  isOpen,
  onClose,
  labelledBy,
  overlayClassName,
  overlayStyle,
  children,
}: ModalProps) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) {
    return null;
  }

  const modalRoot = document.getElementById(MODAL_ROOT_ID);

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <button
        type="button"
        aria-label="Закрыть модалку"
        className={`absolute inset-0 w-full cursor-default border-none p-0 bg-[rgba(0,0,0,0.65)] ${overlayClassName ?? ''}`.trim()}
        style={overlayStyle}
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-[min(32rem,90vw)] flex-col">{children}</div>
    </div>,
    modalRoot
  );
};

export default Modal;
