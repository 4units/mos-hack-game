type StartScreenProps = {
  onPlay: () => void;
};

export const StartScreen = ({ onPlay }: StartScreenProps) => (
  <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-[var(--color-surface)] px-6 pb-14 pt-10">
    <div className="flex w-full max-w-[25rem] flex-col gap-10">
      <div className="flex aspect-square w-full items-center justify-center rounded-[1.25rem] bg-[#dedede]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_8px_20px_rgba(16,18,22,0.08)]">
          <span className="text-sm font-semibold text-[var(--color-muted)]">Bank</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 text-[var(--color-muted)]">
        <h1 className="text-[clamp(2.25rem,6vw,2.75rem)] leading-[1.1] text-[var(--color-black)]">
          Игра
        </h1>
        <p className="text-base leading-relaxed">
          Прыгайте на платформы, отвечайте на вопросы, собирайте баллы и будьте лучшим!
        </p>
      </div>
    </div>

    <button
      type="button"
      onClick={onPlay}
      className="w-full max-w-[25rem] rounded-[1.875rem] border-0 bg-[#d9d9d9] px-4 py-3 text-base font-semibold text-[var(--color-on-surface)] shadow-[0_6px_14px_rgba(16,18,22,0.08)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:bg-[#cfcfcf] hover:shadow-[0_10px_24px_rgba(16,18,22,0.12)] active:translate-y-0 active:shadow-[0_4px_12px_rgba(16,18,22,0.12)]"
    >
      Играть!
    </button>
  </main>
);

export default StartScreen;
