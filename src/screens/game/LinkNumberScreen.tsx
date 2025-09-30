import BaseHeader from '../../components/BaseHeader';
import { LinkNumber } from './kit/link-number/LinkNumber';
import type { LevelFormat } from './kit/link-number/types';

type LinkNumberScreenProps = {
  onBack: () => void;
  level: LevelFormat;
  padding?: number;
};

const LinkNumberScreen = ({ onBack, level, padding = 12 }: LinkNumberScreenProps) => (
  <main className="main-bg flex min-h-screen items-center justify-center bg-[var(--color-surface)]">
    <div className="flex w-full max-w-[25rem] flex-col gap-6 text-[var(--color-on-surface)]">
      <BaseHeader onBack={onBack} />

      <section className="flex justify-center">
        <LinkNumber level={level} padding={padding} />
      </section>
    </div>
  </main>
);

export default LinkNumberScreen;
