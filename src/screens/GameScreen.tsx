import IconButton from '../components/IconButton';
import { GiftIcon, QuestionIcon } from '../components/icons';
import mainGazik from '../assets/main-gazik.png';
import PlatformNumber from '../components/PlatformNumber.tsx';
import StarsCount from '../components/StarsCount.tsx';
import { useState } from 'react';
import StarsQuizBottomSheet from './game/components/StarsQuizBottomSheet';
import useStarsBalance from '../hooks/useStarsBalance';
import { useStarsStore } from '../stores/starsStore';

type GameScreenProps = {
  onShowGifts: () => void;
  onShowFaq: () => void;
  onStartLinkNumber: () => void;
  score?: number;
};

export const GameScreen = ({ onShowGifts, onShowFaq, onStartLinkNumber }: GameScreenProps) => {
  const [isStarsOpen, setIsStarsOpen] = useState(false);
  const balance = useStarsStore((state) => state.balance);
  const setBalance = useStarsStore((state) => state.setBalance);
  useStarsBalance();

  return (
    <>
      <main className="main-bg flex min-h-screen bg-[var(--color-surface)] justify-center">
        <div className="flex w-full max-w-[25rem] flex-col gap-7 justify-between text-[var(--color-on-surface)]">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center justify-center gap-4" aria-label="Статус игры">
              <PlatformNumber number={2} />
              <StarsCount
                number={balance}
                onClick={() => setIsStarsOpen(true)}
                ariaLabel="Количество звёзд"
              />
            </div>

            <div className="flex items-center gap-4">
              <IconButton variant="ghost" aria-label="Справка" onClick={onShowFaq}>
                <QuestionIcon />
              </IconButton>
              <IconButton variant="ghost" aria-label="Подарки" onClick={onShowGifts}>
                <GiftIcon />
              </IconButton>
            </div>
          </header>

          <img
            src={mainGazik}
            alt="Газик на платформе"
            className="w-[473px] h-auto select-none pointer-events-none"
            draggable={false}
          />

          <section className="flex justify-center" aria-label="Панель управления">
            <button
              onClick={onStartLinkNumber}
              type="button"
              className="button-blur w-full"
              aria-label={'Пройти платформу!'}
            >
              <span className="text-[var(--color-raspberry)]">Пройти платформу!</span>
            </button>
          </section>
        </div>
      </main>

      <StarsQuizBottomSheet
        isOpen={isStarsOpen}
        onClose={() => setIsStarsOpen(false)}
        score={balance}
        onScoreChange={setBalance}
      />
    </>
  );
};

export default GameScreen;
