import { useQueryClient } from '@tanstack/react-query';
import BaseHeader from '../../components/BaseHeader';
import { LinkNumber, type LinkNumberHandle } from './kit/link-number/LinkNumber';
import type { LevelFormat } from './kit/link-number/types';
import StarsCount from '../../components/StarsCount.tsx';
import { ClockIcon, LampIcon, PauseIcon } from '../../components/icons/index.ts';
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
import useLinkNumberLevel, { LINK_NUMBER_LEVEL_QUERY_KEY } from '../../hooks/useLinkNumberLevel.ts';
import LinkNumberVictoryBottomSheet from './components/LinkNumberVictoryBottomSheet';
import {
  LinkNumberBoostersModal,
  LinkNumberHintModal,
  LinkNumberTimeStopModal,
} from './components/link-number';
import { useSpendHintBooster, useSpendTimeStopBooster } from '../../hooks/useLinkNumberBoosters';
import PlatformNumber from '../../components/PlatformNumber.tsx';
import { useLevelStore } from '../../stores/levelStore.ts';

type LinkNumberScreenProps = {
  onBack: () => void;
  level: LevelFormat;
  padding?: number;
  demo?: boolean;
  onStartGame?: () => void;
};

type BubbleArrow = 'right' | 'top-right' | 'bottom-left' | 'bottom-right';

const HINT_COST = 50;
const TIME_STOP_COST = 200;

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
  const queryClient = useQueryClient();
  const balance = useStarsStore((state) => state.balance);
  const currentLevel = useLevelStore((state) => state.currentLevel);
  const linkNumberRef = useRef<LinkNumberHandle>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isStopTimeActive, setIsStopTimeActive] = useState(false);
  const [isHintProcessing, setIsHintProcessing] = useState(false);
  const [hintCountdown, setHintCountdown] = useState(0);
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);
  const [completedSeconds, setCompletedSeconds] = useState<number | null>(null);
  const [earnedStars, setEarnedStars] = useState<number | null>(null);
  const [isBoostersModalOpen, setIsBoostersModalOpen] = useState(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isTimeStopModalOpen, setIsTimeStopModalOpen] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);
  const resumeAfterHintRef = useRef(false);
  const hintCountdownIntervalRef = useRef<number | null>(null);
  const completionGuardRef = useRef(false);
  const {
    mutateAsync: completeLevelAsync,
    isPending: isCompleting,
    reset: resetCompleteMutation,
  } = useCompleteLineLevel();
  const {
    mutateAsync: spendTimeStopBoosterAsync,
    isPending: isTimeStopSpending,
    reset: resetTimeStopMutation,
  } = useSpendTimeStopBooster();
  const {
    mutateAsync: spendHintBoosterAsync,
    isPending: isHintSpending,
    reset: resetHintMutation,
  } = useSpendHintBooster();
  const solutionPath = useMemo(() => solveLinkNumberLevel(level), [level]);
  useStarsBalance();
  useLinkNumberLevel();

  useEffect(() => {
    setElapsedSeconds(0);
    setIsStopTimeActive(false);
    setIsHintProcessing(false);
    setHintCountdown(0);
    setIsVictoryOpen(false);
    setCompletedSeconds(null);
    setEarnedStars(null);
    setIsBoostersModalOpen(false);
    setIsHintModalOpen(false);
    setIsTimeStopModalOpen(false);
    completionGuardRef.current = false;
    resetCompleteMutation();
    resetTimeStopMutation();
    resetHintMutation();
    if (hintCountdownIntervalRef.current) {
      clearInterval(hintCountdownIntervalRef.current);
      hintCountdownIntervalRef.current = null;
    }
    resumeAfterHintRef.current = false;
  }, [level, resetCompleteMutation, resetHintMutation, resetTimeStopMutation]);

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

  const activateTimeStop = useCallback(() => {
    if (isHintProcessing) return;
    resumeAfterHintRef.current = false;
    setIsStopTimeActive(true);
  }, [isHintProcessing]);

  const handleOpenBoosters = useCallback(() => {
    setIsHintModalOpen(false);
    setIsTimeStopModalOpen(false);
    setIsBoostersModalOpen(true);
  }, []);

  const handleCloseBoosters = useCallback(() => {
    setIsBoostersModalOpen(false);
  }, []);

  const handleRequestTimeStop = useCallback(() => {
    if (isStopTimeActive || isTimeStopSpending) return;
    setIsBoostersModalOpen(false);
    setIsHintModalOpen(false);
    setIsTimeStopModalOpen(true);
  }, [isStopTimeActive, isTimeStopSpending]);

  const handleRequestHint = useCallback(() => {
    if (isHintProcessing || isHintSpending) return;
    setIsBoostersModalOpen(false);
    setIsTimeStopModalOpen(false);
    setIsHintModalOpen(true);
  }, [isHintProcessing, isHintSpending]);

  const handleCloseHintModal = useCallback(() => {
    setIsHintModalOpen(false);
  }, []);

  const handleCloseTimeModal = useCallback(() => {
    setIsTimeStopModalOpen(false);
  }, []);

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

  const startHintSequence = useCallback(() => {
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

  const handleConfirmTimeStop = useCallback(() => {
    if (isStopTimeActive || isHintProcessing || isTimeStopSpending) return;

    handleCloseBoosters();
    handleCloseTimeModal();
    activateTimeStop();

    void spendTimeStopBoosterAsync().catch((error) => {
      console.error(error);
    });
  }, [
    handleCloseBoosters,
    handleCloseTimeModal,
    activateTimeStop,
    isHintProcessing,
    isStopTimeActive,
    isTimeStopSpending,
    spendTimeStopBoosterAsync,
  ]);

  const handleConfirmHint = useCallback(() => {
    if (isHintProcessing || isHintSpending) return;

    handleCloseBoosters();
    handleCloseHintModal();
    startHintSequence();

    void spendHintBoosterAsync().catch((error) => {
      console.error(error);
    });
  }, [
    handleCloseBoosters,
    handleCloseHintModal,
    isHintProcessing,
    isHintSpending,
    spendHintBoosterAsync,
    startHintSequence,
  ]);

  const handleComplete = useCallback(() => {
    if (demo) return;
    if (completionGuardRef.current) return;

    completionGuardRef.current = true;

    if (isHintProcessing) {
      finishHint();
      setHintCountdown(0);
    }

    if (hintCountdownIntervalRef.current) {
      clearInterval(hintCountdownIntervalRef.current);
      hintCountdownIntervalRef.current = null;
    }

    const timeSinceStart = elapsedSeconds;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    resumeAfterHintRef.current = false;
    setIsStopTimeActive(true);
    setCompletedSeconds(timeSinceStart);

    void completeLevelAsync({ time_since_start: timeSinceStart })
      .then(({ soft_currency }) => {
        setEarnedStars(soft_currency ?? null);
        setIsVictoryOpen(true);
      })
      .catch(() => {
        completionGuardRef.current = false;
        setCompletedSeconds(null);
        setIsStopTimeActive(false);
        setEarnedStars(null);
      });
  }, [completeLevelAsync, demo, elapsedSeconds, finishHint, isHintProcessing]);

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

  const handleVictoryDismiss = useCallback(() => {
    setIsVictoryOpen(false);
    setCompletedSeconds(null);
    setEarnedStars(null);
    completionGuardRef.current = false;
    resetCompleteMutation();
    void queryClient.invalidateQueries({
      queryKey: LINK_NUMBER_LEVEL_QUERY_KEY,
      refetchType: 'inactive',
    });
  }, [queryClient, resetCompleteMutation]);

  const isInteractionLocked = isCompleting || isHintProcessing || isVictoryOpen;
  const isBoardDisabled = isInteractionLocked;
  const stopDisabled = isInteractionLocked || isStopTimeActive || isTimeStopSpending;
  const hintDisabled = isInteractionLocked || !solutionPath?.length || isHintSpending;

  return (
    <>
      <main className="main-bg flex min-h-screen justify-center relative">
        <div className="flex w-full max-w-[25rem] flex-col gap-[40px] text-[var(--color-on-surface)]">
          <div className="flex items-center justify-between">
            <BaseHeader onBack={onBack} />
            <PlatformNumber number={currentLevel} />
          </div>

          <div className={'flex flex-row items-center gap-4'}>
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
              onStopTime={handleRequestTimeStop}
              onShowHint={handleRequestHint}
              stopTimeLabel={demo ? '3' : '3'}
              hintLabel={demo ? '1' : '3'}
              stopTimeDisabled={stopDisabled}
              hintDisabled={hintDisabled}
              disabled={isBoardDisabled}
              onBack={onBack}
              onOpenBoosters={handleOpenBoosters}
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

      <LinkNumberBoostersModal
        isOpen={isBoostersModalOpen}
        onClose={handleCloseBoosters}
        onSelectHint={handleRequestHint}
        onSelectTimeStop={handleRequestTimeStop}
        hintCostLabel={HINT_COST}
        timeCostLabel={TIME_STOP_COST}
        isHintDisabled={hintDisabled}
        isTimeStopDisabled={stopDisabled}
      />

      <LinkNumberHintModal
        isOpen={isHintModalOpen}
        onClose={handleCloseHintModal}
        onConfirm={handleConfirmHint}
        isSubmitting={isHintSpending || isHintProcessing}
      />

      <LinkNumberTimeStopModal
        isOpen={isTimeStopModalOpen}
        onClose={handleCloseTimeModal}
        onConfirm={handleConfirmTimeStop}
        isSubmitting={isTimeStopSpending || isHintProcessing}
      />

      <LinkNumberVictoryBottomSheet
        isOpen={isVictoryOpen}
        onClose={handleVictoryDismiss}
        elapsedSeconds={completedSeconds}
        rewardStars={earnedStars}
      />
    </>
  );
};
export default LinkNumberScreen;
