import iconsGroup from '../assets/icons-group.png';
import startGazik from '../assets/start-gazik.png';

type StartScreenProps = {
  onPlay: () => void;
};

export const StartScreen = ({ onPlay }: StartScreenProps) => (
  <main className="min-h-screen flex flex-col">
    {/* HERO */}
    <div className="start-bg relative flex-1 flex items-end justify-center px-[23px] pt-10">
      <div className="w-full max-w-[25rem]">
        <img
          src={startGazik}
          alt="Газик на платформе"
          className="w-[473px] h-auto select-none pointer-events-none absolute bottom-[-23px] z-3"
          draggable={false}
        />
        <img
          src={iconsGroup}
          alt="Группа иконок"
          className="w-[56px] h-[228px] select-none pointer-events-none absolute left-[23px] bottom-[46px] z-4"
          draggable={false}
        />
      </div>
    </div>

    {/* BOTTOM SHEET */}
    <section
      className="relative z-1 mt-[-23px] w-full bg-[var(--color-lily)] text-[var(--color-on-surface)] rounded-t-[20px] px-[26px] py-[20px]"
      role="region"
      aria-label="Как играть"
    >
      <div className="flex flex-col gap-[23px]">
        <h1 className="text-[var(--color-black)]">Помогите Газику пройти платформы</h1>
        <p className="text-[var(--color-black)] font-medium">
          На каждой платформе нужно пройти все шаги начиная с 1го номера и заканчивая последним по
          порядку, обходя закрытые клетки, если они есть. Вы можете обменять звёзды на подсказки, а
          после прохождения получить призы!
        </p>
      </div>

      <button
        type="button"
        onClick={onPlay}
        className="mt-8 w-full rounded-[13px] border-0 bg-[var(--color-violet)] px-4 py-3"
      >
        <span className="font-medium text-white">Как играть?</span>
      </button>
    </section>
  </main>
);

export default StartScreen;
