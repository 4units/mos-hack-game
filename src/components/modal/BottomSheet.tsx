import { type PropsWithChildren, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

const MODAL_ROOT_ID = 'modal-root';

export type BottomSheetProps = PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
  labelledBy?: string;
}>;

const BottomSheet = ({ isOpen, onClose, labelledBy, children }: BottomSheetProps) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById(MODAL_ROOT_ID);
  if (!modalRoot) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      {/* Gradient overlay */}
      <button
        type="button"
        aria-label="Закрыть модалку"
        className="absolute inset-0 w-full cursor-default bg-gradient-to-b from-[#060698] to-[#000000] opacity-70 border-none p-0"
        onClick={onClose}
      />

      {/* Sheet container */}
      <div className="relative z-10 w-full">
        <div className="mx-auto w-full rounded-t-[20px] bg-[var(--color-lily)] py-[20px] px-[26px]  text-[var(--color-on-surface)]">
          {children}
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default BottomSheet;
