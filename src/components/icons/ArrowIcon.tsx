import type { Direction, IconProps } from './types';

const transforms: Record<Direction, string> = {
  up: 'rotate(0 12 12)',
  right: 'rotate(90 12 12)',
  down: 'rotate(180 12 12)',
  left: 'rotate(270 12 12)',
};

type ArrowIconProps = IconProps & {
  direction: Direction;
};

const ArrowIcon = ({ className, direction }: ArrowIconProps) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M12 7 7.5 11.5M12 7l4.5 4.5M12 7v9"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      transform={transforms[direction]}
    />
  </svg>
);

export default ArrowIcon;
