import IconButton from '../components/IconButton';
import { HomeIcon, QuestionIcon } from '../components/icons';
import mainGazik from '../assets/main-gazik.png';
import PlatformNumber from '../components/PlatformNumber.tsx';
import StarsCount from '../components/StarsCount.tsx';

type GameScreenProps = {
  onShowBase: () => void;
  onShowFaq: () => void;
  onStartLinkNumber: () => void;
  score?: number;
};

// type ActiveModal = 'energy' | 'stars' | null;

export const GameScreen = ({
  onShowBase,
  onShowFaq,
  onStartLinkNumber,
  score = 2150,
}: GameScreenProps) => {
  // const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  //
  // const closeModal = () => setActiveModal(null);
  //
  // const energyModalId = 'energy-modal-heading';
  // const starsModalId = 'stars-modal-heading';

  return (
    <>
      <main className="main-bg flex min-h-screen items-center justify-center bg-[var(--color-surface)]">
        <div className="flex w-full max-w-[25rem] flex-col gap-7 text-[var(--color-on-surface)]">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center justify-center gap-4" aria-label="Статус игры">
              <PlatformNumber number={2} />
              <StarsCount number={score} />
              {/*<GameStatusButton*/}
              {/*  label="Количество энергии"*/}
              {/*  icon={<LightningIcon className="h-6 w-6" />}*/}
              {/*  value={energy}*/}
              {/*  onClick={() => setActiveModal('energy')}*/}
              {/*/>*/}
              {/*<GameStatusButton*/}
              {/*  label="Количество очков"*/}
              {/*  icon={<StarIcon className="h-6 w-6" />}*/}
              {/*  value={score}*/}
              {/*  onClick={() => setActiveModal('stars')}*/}
              {/*/>*/}
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

      {/*<Modal isOpen={activeModal === 'energy'} onClose={closeModal} labelledBy={energyModalId}>*/}
      {/*  <EnergyModalContent onClose={closeModal} headingId={energyModalId} />*/}
      {/*</Modal>*/}

      {/*<Modal isOpen={activeModal === 'stars'} onClose={closeModal} labelledBy={starsModalId}>*/}
      {/*  <StarsModalContent onClose={closeModal} headingId={starsModalId} />*/}
      {/*</Modal>*/}
    </>
  );
};

export default GameScreen;
