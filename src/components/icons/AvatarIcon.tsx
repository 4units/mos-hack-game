import type { IconProps } from './types';

const AvatarIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <circle cx="16" cy="12" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <path
      d="M7 26.5c1.4-4.1 4.7-6.5 9-6.5s7.6 2.4 9 6.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
    />
  </svg>
);

export default AvatarIcon;
