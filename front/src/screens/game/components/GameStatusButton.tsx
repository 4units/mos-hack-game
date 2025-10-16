import type { ReactNode } from 'react';

export type GameStatusButtonProps = {
  icon: ReactNode;
  value: number;
  label: string;
  onClick: () => void;
};

const GameStatusButton = ({ icon, value, label, onClick }: GameStatusButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="flex items-center gap-1.5 rounded-full border border-transparent bg-transparent px-2 py-1 font-semibold text-[var(--color-black)] transition-colors duration-150 hover:text-[var(--color-iris)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-iris)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
  >
    {icon}
    <span className="min-w-4 text-center">{value}</span>
  </button>
);

export default GameStatusButton;
