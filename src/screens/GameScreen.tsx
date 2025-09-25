import { type ReactNode } from 'react';
import IconButton from '../components/IconButton';
import { ArrowIcon, HomeIcon, LightningIcon, QuestionIcon, StarIcon } from '../components/icons';

type GameScreenProps = {
  onShowBase: () => void;
  onShowFaq: () => void;
  energy?: number;
  score?: number;
};

const StatusItem = ({ icon, value, label }: { icon: ReactNode; value: number; label: string }) => (
  <div className="flex items-center gap-1.5 font-semibold" aria-label={label}>
    {icon}
    <span className="min-w-4 text-center">{value}</span>
  </div>
);

export const GameScreen = ({ onShowBase, onShowFaq, energy = 5, score = 0 }: GameScreenProps) => (
  <main className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] px-6 py-8">
    <div className="flex w-full max-w-[25rem] flex-col gap-7 text-[var(--color-on-surface)]">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center justify-center gap-4" aria-label="Статус игры">
          <StatusItem
            label="Количество энергии"
            icon={<LightningIcon className="h-6 w-6" />}
            value={energy}
          />
          <StatusItem
            label="Количество очков"
            icon={<StarIcon className="h-6 w-6" />}
            value={score}
          />
        </div>

        <div className="flex items-center gap-4">
          <IconButton variant="ghost" aria-label="Справка" onClick={onShowFaq}>
            <QuestionIcon className="h-6 w-6" />
          </IconButton>
          <IconButton variant="ghost" aria-label="Домой" onClick={onShowBase}>
            <HomeIcon className="h-6 w-6" />
          </IconButton>
        </div>
      </header>

      <section
        className="flex aspect-square items-center justify-center bg-[#dedede]"
        aria-label="Игровое поле"
      ></section>

      <section className="flex justify-center" aria-label="Панель управления">
        <div className="relative flex aspect-square w-[min(12rem,70vw)] items-center justify-center rounded-full bg-white">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-[5.25rem] w-[5.25rem] items-center justify-center rounded-full bg-[#D9D9D9]" />
          </div>

          <IconButton
            aria-label="Вверх"
            variant="ghost"
            className="absolute left-1/2 top-[0.8rem] -translate-x-1/2"
          >
            <ArrowIcon direction="up" className="h-5 w-5" />
          </IconButton>
          <IconButton
            aria-label="Вправо"
            variant="ghost"
            className="absolute right-[0.8rem] top-1/2 -translate-y-1/2"
          >
            <ArrowIcon direction="right" className="h-5 w-5" />
          </IconButton>
          <IconButton
            aria-label="Вниз"
            variant="ghost"
            className="absolute bottom-[0.8rem] left-1/2 -translate-x-1/2"
          >
            <ArrowIcon direction="down" className="h-5 w-5" />
          </IconButton>
          <IconButton
            aria-label="Влево"
            variant="ghost"
            className="absolute left-[0.8rem] top-1/2 -translate-y-1/2"
          >
            <ArrowIcon direction="left" className="h-5 w-5" />
          </IconButton>
        </div>
      </section>
    </div>
  </main>
);

export default GameScreen;
