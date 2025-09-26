import { BackArrowIcon } from '../../../components/icons';

type BaseHeaderProps = {
  onBack: () => void;
};

const BaseHeader = ({ onBack }: BaseHeaderProps) => (
  <header className="flex flex-col gap-6">
    <button
      type="button"
      onClick={onBack}
      aria-label="Назад"
      className="flex items-center gap-4 rounded-none border-0 p-0 text-[var(--color-white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-iris)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
    >
      <BackArrowIcon />
      <h4 className="font-bold">Назад</h4>
    </button>

    <h2>База</h2>
  </header>
);

export default BaseHeader;
