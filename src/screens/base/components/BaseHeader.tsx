import { BackArrowIcon } from '../../../components/icons';

type BaseHeaderProps = {
  onBack: () => void;
  title?: string;
};

const BaseHeader = ({ onBack, title }: BaseHeaderProps) => (
  <header className="flex flex-col gap-6">
    <button
      type="button"
      onClick={onBack}
      aria-label="Назад"
      className=" w-[118px] h-[32px] relative
        inline-flex items-center overflow-hidden
        border border-white rounded-full
        bg-transparent text-white
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-iris)] focus-visible:ring-offset-2
      "
    >
      {/* Круглая область с иконкой */}
      <span
        className="
        flex items-center justify-center
        bg-white
        text-[var(--color-violet)]
        rounded-r-[133px] w-[48px] h-[32px] absolute left-0
      "
      >
        <BackArrowIcon />
      </span>

      {/* Текст */}
      <span
        className="
       
        text-white absolute right-[13px] font-normal text-1
      "
      >
        Назад
      </span>
    </button>

    {title && <h2 className="text-white">{title}</h2>}
  </header>
);

export default BaseHeader;
