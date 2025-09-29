import { useState } from 'react';
import IconButton from '../components/IconButton';
import { HomeIcon, LightningIcon, QuestionIcon, StarIcon } from '../components/icons';
import { Modal } from '../components/modal';
import EnergyModalContent from './game/components/EnergyModalContent';
import GameStatusButton from './game/components/GameStatusButton';
import StarsModalContent from './game/components/StarsModalContent';

type GameScreenProps = {
  onShowBase: () => void;
  onShowFaq: () => void;
  onStartLinkNumber: () => void;
  energy?: number;
  score?: number;
};

type ActiveModal = 'energy' | 'stars' | null;

export const GameScreen = ({
  onShowBase,
  onShowFaq,
  onStartLinkNumber,
  energy = 5,
  score = 0,
}: GameScreenProps) => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const closeModal = () => setActiveModal(null);

  const energyModalId = 'energy-modal-heading';
  const starsModalId = 'stars-modal-heading';

  return (
    <>
      <main className="main-bg flex min-h-screen items-center justify-center bg-[var(--color-surface)]">
        <div className="flex w-full max-w-[25rem] flex-col gap-7 text-[var(--color-on-surface)]">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center justify-center gap-4" aria-label="Статус игры">
              <GameStatusButton
                label="Количество энергии"
                icon={<LightningIcon className="h-6 w-6" />}
                value={energy}
                onClick={() => setActiveModal('energy')}
              />
              <GameStatusButton
                label="Количество очков"
                icon={<StarIcon className="h-6 w-6" />}
                value={score}
                onClick={() => setActiveModal('stars')}
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
            <button
              type="button"
              onClick={onStartLinkNumber}
              className="w-full max-w-[16rem] rounded-xl border-0 bg-[var(--color-iris)] px-4 py-3 text-base font-semibold text-white shadow-[0_12px_30px_rgba(59,73,223,0.35)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(59,73,223,0.45)] active:translate-y-0"
            >
              <span>Пройти платформу</span>
            </button>
          </section>
        </div>
      </main>

      <Modal isOpen={activeModal === 'energy'} onClose={closeModal} labelledBy={energyModalId}>
        <EnergyModalContent onClose={closeModal} headingId={energyModalId} />
      </Modal>

      <Modal isOpen={activeModal === 'stars'} onClose={closeModal} labelledBy={starsModalId}>
        <StarsModalContent onClose={closeModal} headingId={starsModalId} />
      </Modal>
    </>
  );
};

export default GameScreen;
