import type { ButtonHTMLAttributes } from 'react';
import { CloseIcon } from '../icons';

type ModalCloseButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const ModalCloseButton = ({ className = '', ...props }: ModalCloseButtonProps) => (
  <button
    type="button"
    aria-label="Закрыть"
    {...props}
    className={`ml-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-black)] bg-transparent p-0 text-[var(--color-black)] transition-colors duration-150 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-iris)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#dedede] ${className}`.trim()}
  >
    <CloseIcon className="h-6 w-6" />
  </button>
);

export default ModalCloseButton;
