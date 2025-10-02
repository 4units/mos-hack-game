import { type PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const MODAL_ROOT_ID = 'modal-root';
const ANIMATION_DURATION = 300;

export type BottomSheetProps = PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
  labelledBy?: string;
}>;

const BottomSheet = ({ isOpen, onClose, labelledBy, children }: BottomSheetProps) => {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);
  const closeTimeoutRef = useRef<number | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isMounted) return undefined;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMounted, handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      setIsMounted(true);
      requestAnimationFrame(() => setIsVisible(true));
      return;
    }

    setIsVisible(false);
    if (!isMounted) return;

    closeTimeoutRef.current = window.setTimeout(() => {
      setIsMounted(false);
      closeTimeoutRef.current = null;
    }, ANIMATION_DURATION);
  }, [isOpen, isMounted]);

  useEffect(
    () => () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    },
    []
  );

  if (!isMounted) return null;

  const modalRoot = document.getElementById(MODAL_ROOT_ID);
  if (!modalRoot) return null;

  const overlayClassName = `absolute inset-0 w-full cursor-default bg-gradient-to-b from-[#060698] to-[#000000] border-none p-0 transition-opacity duration-300 ${
    isVisible ? 'opacity-70 pointer-events-auto' : 'opacity-0 pointer-events-none'
  }`;

  const sheetWrapperClassName = `relative z-10 w-full transition-transform duration-300 ease-out ${
    isVisible ? 'translate-y-0 pointer-events-auto' : 'translate-y-full pointer-events-none'
  }`;

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
        className={overlayClassName}
        onClick={onClose}
      />

      {/* Sheet container */}
      <div className={sheetWrapperClassName}>
        <div className="mx-auto w-full rounded-t-[20px] bg-[var(--color-lily)] py-[20px] px-[26px]  text-[var(--color-on-surface)]">
          {children}
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default BottomSheet;
