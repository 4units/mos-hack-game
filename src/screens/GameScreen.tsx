import { type ReactNode } from 'react';
import IconButton from '../components/IconButton';
import {
  ArrowIcon,
  AvatarIcon,
  HomeIcon,
  LightningIcon,
  QuestionIcon,
  StarIcon,
} from '../components/icons';

type GameScreenProps = {
  onExit: () => void;
  onShowFaq: () => void;
  energy?: number;
  score?: number;
};

const StatusItem = ({ icon, value, label }: { icon: ReactNode; value: number; label: string }) => (
  <div className="flex items-center gap-1.5 text-base font-semibold" aria-label={label}>
    {icon}
    <span className="min-w-4 text-center">{value}</span>
  </div>
);

export const GameScreen = ({ onExit, onShowFaq, energy = 5, score = 0 }: GameScreenProps) => (
  <main className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] px-6 py-8">
    <div className="flex w-full max-w-[25rem] flex-col gap-7 text-[var(--color-on-surface)]">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center justify-center gap-4" aria-label="Статус игры">
          <StatusItem
            label="Количество энергии"
            icon={<LightningIcon className="h-5 w-5" />}
            value={energy}
          />
          <StatusItem
            label="Количество очков"
            icon={<StarIcon className="h-5 w-5" />}
            value={score}
          />
        </div>

        <div className="flex items-center gap-2">
          <IconButton variant="ghost" aria-label="Справка" onClick={onShowFaq}>
            <QuestionIcon className="h-5 w-5" />
          </IconButton>
          <IconButton variant="ghost" aria-label="Домой" onClick={onExit}>
            <HomeIcon className="h-5 w-5" />
          </IconButton>
        </div>
      </header>

      <section
        className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-[#dedede]"
        aria-label="Игровое поле"
      >
        <div className="flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full bg-[#f1f1f1] shadow-[0_12px_26px_rgba(16,18,22,0.12)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[var(--color-on-surface)]">
            <AvatarIcon className="h-9 w-9" />
          </div>
        </div>
      </section>

      <section className="flex justify-center" aria-label="Панель управления">
        <div className="relative flex aspect-square w-[min(12rem,70vw)] items-center justify-center rounded-full bg-[#f1f1f1] shadow-[0_18px_36px_rgba(16,18,22,0.1)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-[5.25rem] w-[5.25rem] items-center justify-center rounded-full bg-[#d9d9d9] shadow-[inset_0_6px_12px_rgba(16,18,22,0.08)]" />
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
