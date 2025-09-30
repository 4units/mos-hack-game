import { BackArrowIcon } from './icons';

type BaseHeaderProps = {
  onBack: () => void;
  title?: string;
};

const BaseHeader = ({ onBack, title }: BaseHeaderProps) => (
  <header className="flex flex-col gap-10">
    <button
      type="button"
      onClick={onBack}
      aria-label="Назад"
      className="p-0 relative w-fit gap-[12px]
        flex flex-row items-center overflow-hidden
        border border-white rounded-full
        bg-transparent text-white min-h-[32px]
      "
    >
      {/* Круглая область с иконкой */}
      <span
        className="
        flex items-center justify-center
        bg-white
        text-[var(--color-violet)]
        rounded-r-[133px] flex-1 min-h-[32px] min-w-[48px]
      "
      >
        <BackArrowIcon />
      </span>

      {/* Текст */}
      <span
        className="
        text-white right-[13px] font-normal text-1 flex-2 pr-[13px]
      "
      >
        Назад
      </span>
    </button>

    {title && <h2 className="text-white">{title}</h2>}
  </header>
);

export default BaseHeader;
