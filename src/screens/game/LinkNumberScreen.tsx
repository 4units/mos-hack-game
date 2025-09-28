import IconButton from '../../components/IconButton';
import { BackArrowIcon } from '../../components/icons';
import { LinkNumber } from './kit/link-number/LinkNumber';
import type { LevelFormat } from './kit/link-number/types';

type LinkNumberScreenProps = {
  onBack: () => void;
  level: LevelFormat;
  cellSize?: number;
  padding?: number;
};

const LinkNumberScreen = ({
  onBack,
  level,
  cellSize = 88,
  padding = 12,
}: LinkNumberScreenProps) => (
  <main className="main-bg flex min-h-screen items-center justify-center bg-[var(--color-surface)] px-6 py-8">
    <div className="flex w-full max-w-[25rem] flex-col gap-6 text-[var(--color-on-surface)]">
      <header className="flex items-center gap-4">
        <IconButton variant="ghost" aria-label="Назад" onClick={onBack}>
          <BackArrowIcon className="h-6 w-6" />
        </IconButton>
        <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">Платформа</h2>
      </header>

      <section className="flex justify-center">
        <LinkNumber level={level} cellSize={cellSize} padding={padding} />
      </section>
    </div>
  </main>
);

export default LinkNumberScreen;
