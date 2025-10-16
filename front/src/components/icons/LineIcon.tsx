import type { IconProps } from './types.ts';

const LineIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="1"
    height="24"
    viewBox="0 0 1 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="0.387298"
      y1="0.387298"
      x2="0.387297"
      y2="23.6127"
      stroke="white"
      stroke-width="0.774597"
      stroke-linecap="round"
    />
  </svg>
);

export default LineIcon;
