import BaseHeader from '../../components/BaseHeader';
import { LinkNumber, type LinkNumberHandle } from './kit/link-number/LinkNumber';
import type { LevelFormat } from './kit/link-number/types';
import StarsCount from '../../components/StarsCount.tsx';
import PlatformNumber from '../../components/PlatformNumber.tsx';
import { ClockIcon, GiftIcon, QuestionIcon } from '../../components/icons/index.ts';
import IconButton from '../../components/IconButton.tsx';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useStarsStore } from '../../stores/starsStore.ts';
import useLineGameHint from '../../hooks/useLineGameHint.ts';
import useCompleteLineLevel from '../../hooks/useCompleteLineLevel.ts';
import { formatDuration } from '../../utils/format';
import useStarsBalance from '../../hooks/useStarsBalance.ts';

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
}: LinkNumberScreenProps) => {
  const balance = useStarsStore((state) => state.balance);
  const linkNumberRef = useRef<LinkNumberHandle>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);
  const resumeAfterHintRef = useRef(false);
  const hintResumeTimeoutRef = useRef<number | null>(null);
  const { mutate: requestHint, isPending: isHintPending } = useLineGameHint();
  const { mutate: completeLevel, isPending: isCompleting } = useCompleteLineLevel();

  useStarsBalance();

  useEffect(() => {
    setElapsedSeconds(0);
    setIsTimerPaused(false);
  }, [level]);

  useEffect(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (isTimerPaused) {
      return;
    }

    timerIntervalRef.current = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isTimerPaused]);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (hintResumeTimeoutRef.current) {
        clearTimeout(hintResumeTimeoutRef.current);
      }
    };
  }, []);

  const handleToggleTimer = useCallback(() => {
    setIsTimerPaused((prev) => !prev);
    resumeAfterHintRef.current = false;
  }, []);

  const handleShowHint = useCallback(() => {
    if (isHintPending) return;

    const durationMs = 5000;
    const wasPaused = isTimerPaused;

    requestHint(undefined, {
      onSuccess: (answer) => {
        resumeAfterHintRef.current = !wasPaused;
        setIsTimerPaused(true);
        linkNumberRef.current?.showHint(answer, { durationMs });

        if (hintResumeTimeoutRef.current) {
          clearTimeout(hintResumeTimeoutRef.current);
        }

        hintResumeTimeoutRef.current = window.setTimeout(() => {
          hintResumeTimeoutRef.current = null;
          if (resumeAfterHintRef.current) {
            resumeAfterHintRef.current = false;
            setIsTimerPaused(false);
          }
        }, durationMs);
      },
      onError: () => {
        resumeAfterHintRef.current = false;
      },
    });
  }, [isHintPending, isTimerPaused, requestHint]);

  const handleComplete = useCallback(
    (answerMatrix: number[][]) => {
      const timeSinceStart = elapsedSeconds;
      setIsTimerPaused(true);

      completeLevel(
        { answer: answerMatrix, time_since_start: timeSinceStart },
        {
          onError: () => {
            setIsTimerPaused(false);
          },
        }
      );
    },
    [completeLevel, elapsedSeconds]
  );

  const formattedTime = useMemo(() => formatDuration(elapsedSeconds), [elapsedSeconds]);
  const timeLabel = useMemo(
    () => (isTimerPaused ? `${formattedTime} ⏸` : formattedTime),
    [formattedTime, isTimerPaused]
  );
  const stopDisabled = isCompleting || isHintPending;
  const hintDisabled = isCompleting || isHintPending;

  return (
    <main className="main-bg flex min-h-screen justify-center relative">
      <div className="flex w-full max-w-[25rem] flex-col gap-[40px] text-[var(--color-on-surface)]">
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
          <PlatformNumber number={demo ? 10 : 1} />
          <StarsCount ariaLabel={'Количество звёзд'} number={demo ? 2150 : balance} />
          <StarsCount ariaLabel={'Время'} label={demo ? '00:50' : timeLabel} icon={<ClockIcon />} />
        </div>
        <section className="flex justify-center">
          <LinkNumber
            ref={linkNumberRef}
            level={level}
            padding={padding}
            onComplete={handleComplete}
            onStopTime={handleToggleTimer}
            onShowHint={handleShowHint}
            stopTimeLabel={demo ? '3' : '3'}
            hintLabel={demo ? '1' : '3'}
            stopTimeDisabled={stopDisabled}
            hintDisabled={hintDisabled}
            disabled={isCompleting}
          />
        </section>
      </div>

      {demo && (
        <div
          className="tutorial-overlay absolute inset-0 z-10 flex flex-col items-center justify-end"
          aria-label="Как играть — подсказки"
        >
          {/* Tips layout container */}
          <div
            className="absolute inset-0 mx-auto w-full max-w-[25rem] pointer-events-none"
            style={{ position: 'absolute' }}
          >
            <Bubble style={{ top: 16, right: 120, maxWidth: 185 }} arrow="right">
              Популярные вопросы
            </Bubble>
            <Bubble style={{ top: 72, right: 10, maxWidth: 170 }} arrow="top-right">
              Ваши достижения и призы
            </Bubble>
            <Bubble style={{ top: 160, left: 60, maxWidth: 170 }} arrow="top-right">
              Получите звёзды, ответив на вопросы
            </Bubble>
            <Bubble style={{ top: 525, left: 10, maxWidth: 170 }} arrow="bottom-left">
              Обмен звёзд на блок времени или подсказку
            </Bubble>
            <Bubble style={{ top: 525, right: 10, maxWidth: 170 }} arrow="bottom-right">
              Подсказка следующих шагов
            </Bubble>
            <Bubble style={{ top: 655, left: 64, maxWidth: 170 }} arrow="top-right">
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
};
export default LinkNumberScreen;
