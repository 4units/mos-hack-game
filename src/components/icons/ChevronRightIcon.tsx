import type { IconProps } from './types';

const ChevronRightIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path
      d="M6 4.5 9.5 8 6 11.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

export default ChevronRightIcon;
