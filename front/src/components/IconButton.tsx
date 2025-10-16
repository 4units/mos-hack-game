import { type ButtonHTMLAttributes } from 'react';

type Variant = 'default' | 'secondary' | 'ghost';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const baseStyles =
  'inline-flex cursor-pointer items-center justify-center rounded-full text-[var(--color-on-surface)] transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-iris)] focus-visible:ring-offset-[var(--color-surface)]';

const variantClasses: Record<Variant, string> = {
  default:
    'h-11 w-11 bg-white shadow-[0_8px_18px_rgba(16,18,22,0.08)] hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(16,18,22,0.12)] active:translate-y-0 active:shadow-[0_4px_12px_rgba(16,18,22,0.12)]',
  secondary:
    'h-11 w-11 border border-[var(--color-border)] bg-[var(--color-surface)] shadow-none hover:-translate-y-0.5 hover:border-[var(--color-iris)] active:translate-y-0',
  ghost:
    'h-auto w-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0',
};

export const IconButton = ({ variant = 'default', className = '', ...props }: IconButtonProps) => (
  <button
    type="button"
    className={`${baseStyles} ${variantClasses[variant]} ${className}`.trim()}
    {...props}
  />
);

export default IconButton;
