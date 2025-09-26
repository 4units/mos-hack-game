import type { IconProps } from './types';

const CloseIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2.5" stroke="white" strokeWidth="2" />
    <path d="M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M15 9L9 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default CloseIcon;
