import type { FC } from 'react';

type LinkNumberWinSectionProps = {
  onNext?: () => void;
};

const LinkNumberWinSection: FC<LinkNumberWinSectionProps> = ({ onNext }) => (
  <div className="relative z-10 mt-10 flex flex-col items-center justify-center gap-[20px]">
    <h3 className="text-[var(--color-raspberry)]">Вы прошли!</h3>
    <button
      type="button"
      onClick={onNext}
      className="button-blur w-full"
      aria-label="На следующую платформу"
    >
      <span className="text-[var(--color-raspberry)]">На следующую платформу</span>
    </button>
  </div>
);

export default LinkNumberWinSection;
