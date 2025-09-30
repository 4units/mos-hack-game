import BaseHeader from '../../components/BaseHeader';
import { LinkNumber } from './kit/link-number/LinkNumber';
import type { LevelFormat } from './kit/link-number/types';
import StarsCount from '../../components/StarsCount.tsx';
import PlatformNumber from '../../components/PlatformNumber.tsx';
import { ClockIcon } from '../../components/icons/index.ts';

type LinkNumberScreenProps = {
  onBack: () => void;
  level: LevelFormat;
  padding?: number;
};

const LinkNumberScreen = ({ onBack, level, padding = 12 }: LinkNumberScreenProps) => (
  <main className="main-bg flex min-h-screen justify-center">
    <div className="flex w-full max-w-[25rem] flex-col gap-6 text-[var(--color-on-surface)]">
      <BaseHeader onBack={onBack} />
      <div className={'flex flex-row justify-between'}>
        <PlatformNumber number={2} />
        <StarsCount ariaLabel={'Количество звёзд'} number={10} />
        <StarsCount ariaLabel={'Количество звёзд'} label={'03:12'} icon={<ClockIcon />} />
      </div>
      <section className="flex justify-center">
        <LinkNumber level={level} padding={padding} />
      </section>
    </div>
  </main>
);

export default LinkNumberScreen;
