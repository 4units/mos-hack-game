import BaseHeader from '../../components/BaseHeader';
import { LinkNumber, type LinkNumberHandle } from './kit/link-number/LinkNumber';
import type { LevelFormat } from './kit/link-number/types';
import StarsCount from '../../components/StarsCount.tsx';
import PlatformNumber from '../../components/PlatformNumber.tsx';
import {
  ClockIcon,
  GiftIcon,
  LampIcon,
  PauseIcon,
  QuestionIcon,
} from '../../components/icons/index.ts';
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
import useCompleteLineLevel from '../../hooks/useCompleteLineLevel.ts';
import { formatDuration } from '../../utils/format';
import useStarsBalance from '../../hooks/useStarsBalance.ts';
import { solveLinkNumberLevel } from './kit/link-number/solver';
import useLinkNumberLevel from '../../hooks/useLinkNumberLevel.ts';
import { useLevelStore } from '../../stores/levelStore.ts';

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
  const [isStopTimeActive, setIsStopTimeActive] = useState(false);
  const [isHintProcessing, setIsHintProcessing] = useState(false);
  const [hintCountdown, setHintCountdown] = useState(0);
  const timerIntervalRef = useRef<number | null>(null);
  const resumeAfterHintRef = useRef(false);
  const hintCountdownIntervalRef = useRef<number | null>(null);
  const { mutate: completeLevel, isPending: isCompleting } = useCompleteLineLevel();
  const solutionPath = useMemo(() => solveLinkNumberLevel(level), [level]);
  const currentLevel = useLevelStore((state) => state.currentLevel);
  useStarsBalance();
  useLinkNumberLevel();

  useEffect(() => {
    setElapsedSeconds(0);
    setIsStopTimeActive(false);
    setIsHintProcessing(false);
    setHintCountdown(0);
    if (hintCountdownIntervalRef.current) {
      clearInterval(hintCountdownIntervalRef.current);
      hintCountdownIntervalRef.current = null;
    }
    resumeAfterHintRef.current = false;
  }, [level]);

  useEffect(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const shouldRun = !isStopTimeActive && !isHintProcessing && !isCompleting;
    if (!shouldRun) {
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
  }, [isStopTimeActive, isHintProcessing, isCompleting]);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (hintCountdownIntervalRef.current) {
        clearInterval(hintCountdownIntervalRef.current);
      }
      setIsHintProcessing(false);
      resumeAfterHintRef.current = false;
      setHintCountdown(0);
    };
  }, []);

  const handleToggleTimer = useCallback(() => {
    if (isHintProcessing) return;
    resumeAfterHintRef.current = false;
    setIsStopTimeActive((prev) => !prev);
  }, [isHintProcessing]);

  const finishHint = useCallback(() => {
    if (hintCountdownIntervalRef.current) {
      clearInterval(hintCountdownIntervalRef.current);
      hintCountdownIntervalRef.current = null;
    }
    setIsHintProcessing(false);

    if (resumeAfterHintRef.current) {
      resumeAfterHintRef.current = false;
      setIsStopTimeActive(false);
    }
  }, []);

  const handleShowHint = useCallback(() => {
    if (!solutionPath || !solutionPath.length || isHintProcessing) return;

    const durationSeconds = 5;
    resumeAfterHintRef.current = !isStopTimeActive;
    setIsHintProcessing(true);
    setHintCountdown(durationSeconds);
    linkNumberRef.current?.showHint(solutionPath, { durationMs: durationSeconds * 1000 });

    if (hintCountdownIntervalRef.current) {
      clearInterval(hintCountdownIntervalRef.current);
    }

    hintCountdownIntervalRef.current = window.setInterval(() => {
      setHintCountdown((prev) => {
        if (prev <= 1) {
          finishHint();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [solutionPath, isHintProcessing, isStopTimeActive, finishHint]);

  const handleComplete = useCallback(() => {
    if (isHintProcessing) {
      finishHint();
      setHintCountdown(0);
    }

    const timeSinceStart = elapsedSeconds;

    completeLevel({ time_since_start: timeSinceStart });
  }, [completeLevel, elapsedSeconds, finishHint, isHintProcessing]);

  const formattedTime = useMemo(() => formatDuration(elapsedSeconds), [elapsedSeconds]);
  const hintCountdownLabel = useMemo(
    () => formatDuration(Math.max(0, hintCountdown)),
    [hintCountdown]
  );
  const timerLabel = isHintProcessing ? hintCountdownLabel : formattedTime;
  const timerIcon = useMemo(() => {
    if (isHintProcessing) return <LampIcon />;
    if (isStopTimeActive) return <PauseIcon />;
    return <ClockIcon />;
  }, [isHintProcessing, isStopTimeActive]);

  const stopDisabled = isCompleting || isHintProcessing;
  const hintDisabled = isCompleting || isHintProcessing || !solutionPath?.length;

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
          <PlatformNumber number={demo ? 5 : currentLevel} />
          <StarsCount ariaLabel={'Количество звёзд'} number={demo ? 2150 : balance} />
          <StarsCount
            ariaLabel={'Время'}
            label={demo ? '00:50' : timerLabel}
            icon={demo ? <ClockIcon /> : timerIcon}
          />
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
            disabled={isCompleting || isHintProcessing}
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
