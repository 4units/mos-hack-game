import BaseHeader from '../../components/BaseHeader';
import { LinkNumber } from './kit/link-number/LinkNumber';
import type { LevelFormat } from './kit/link-number/types';
import StarsCount from '../../components/StarsCount.tsx';
import PlatformNumber from '../../components/PlatformNumber.tsx';
import { ClockIcon, GiftIcon, QuestionIcon } from '../../components/icons/index.ts';
import IconButton from '../../components/IconButton.tsx';
import type { CSSProperties, ReactNode } from 'react';

type LinkNumberScreenProps = {
  onBack: () => void;
  level: LevelFormat;
  padding?: number;
  demo?: boolean;
  onStartGame?: () => void;
};

type BubbleArrow = 'right' | 'top-right' | 'bottom-left' | 'bottom-right';

const Bubble = ({
  children,
  style,
  arrow = 'bottom-left',
}: {
  children: ReactNode;
  style?: CSSProperties;
  arrow?: BubbleArrow;
}) => (
  <div
    className={`speech-bubble px-[8px] h-[50px] flex items-center justify-center arrow-${arrow}`}
    style={style}
  >
    <span className="text-[var(--color-violet)] text-[14px] font-medium text-center leading-tight">
      {children}
    </span>
  </div>
);

const LinkNumberScreen = ({
  onBack,
  level,
  padding = 12,
  demo = false,
  onStartGame,
}: LinkNumberScreenProps) => (
  <main className="main-bg flex min-h-screen justify-center relative">
    <div className="flex w-full max-w-[25rem] flex-col gap-[58px] text-[var(--color-on-surface)]">
      <div className="flex items-center justify-between">
        <BaseHeader onBack={onBack} />
        <div className="flex items-center gap-4">
          <IconButton variant="ghost" aria-label="Справка" onClick={() => {}}>
            <QuestionIcon />
          </IconButton>
          <IconButton variant="ghost" aria-label="Подарки" onClick={() => {}}>
            <GiftIcon />
          </IconButton>
        </div>
      </div>
      <div className={'flex flex-row justify-between'}>
        <PlatformNumber number={1} />
        <StarsCount ariaLabel={'Количество звёзд'} number={2150} />
        <StarsCount ariaLabel={'Количество звёзд'} label={'03:12'} icon={<ClockIcon />} />
      </div>
      <section className="flex justify-center">
        <LinkNumber level={level} padding={padding} />
      </section>
    </div>

    {demo && (
      <div
        className="tutorial-overlay absolute inset-0 z-10 flex flex-col items-center justify-end"
        aria-label="Как играть — подсказки"
      >
        {/* Tips layout container */}
        <div
          className="absolute inset-0 mx-auto w-full max-w-[25rem]"
          style={{ position: 'absolute' }}
        >
          <Bubble style={{ top: 16, right: 110, maxWidth: 185 }} arrow="right">
            Популярные вопросы
          </Bubble>
          <Bubble style={{ top: 72, right: 0, maxWidth: 170 }} arrow="top-right">
            Ваши достижения и призы
          </Bubble>
          <Bubble style={{ top: 176, left: 60, maxWidth: 170 }} arrow="top-right">
            Получите звёзды, ответив на вопросы
          </Bubble>
          <Bubble style={{ top: 560, left: 10, maxWidth: 170 }} arrow="bottom-left">
            Обмен звёзд на блок времени или подсказку
          </Bubble>
          <Bubble style={{ top: 560, right: 10, maxWidth: 170 }} arrow="bottom-right">
            Подсказка следующих шагов
          </Bubble>
          <Bubble style={{ top: 688, left: 64, maxWidth: 170 }} arrow="top-right">
            Блокировка времени на платформе
          </Bubble>
        </div>

        <div className="w-full max-w-[25rem] px-[26px] pb-6">
          <button
            type="button"
            className="w-full rounded-[13px] border-0 bg-[var(--color-violet)] px-4 py-3"
            onClick={onStartGame}
          >
            <span className="font-medium text-white text-1">Играть</span>
          </button>
        </div>
      </div>
    )}
  </main>
);

export default LinkNumberScreen;
