import type { PropsWithChildren } from 'react';

export type ModalCardProps = PropsWithChildren<{
  className?: string;
}>;

const ModalCard = ({ children, className = '' }: ModalCardProps) => (
  <div
    className={`flex w-full flex-col gap-5 rounded-[2rem] bg-[#dedede] p-6 text-[var(--color-on-surface)] shadow-[0_18px_48px_rgba(16,18,22,0.24)] ${className}`.trim()}
  >
    {children}
  </div>
);

export default ModalCard;
