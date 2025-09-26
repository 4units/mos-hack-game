type StartScreenProps = {
  onPlay: () => void;
};

export const StartScreen = ({ onPlay }: StartScreenProps) => (
  <main className="main-bg flex min-h-screen flex-col items-center justify-center gap-10 bg-[var(--color-surface)] px-6 pb-14 pt-10">
    <div className="flex w-full max-w-[25rem] flex-col gap-10">
      <div className="flex aspect-square w-full items-center justify-center bg-[#dedede]"></div>

      <div className="flex flex-col gap-4 text-[var(--color-muted)]">
        <h1 className="text-[var(--color-black)]">Игра</h1>
        <p>Прыгайте на платформы, отвечайте на вопросы, собирайте баллы и будьте лучшим!</p>
      </div>
    </div>

    <button
      type="button"
      onClick={onPlay}
      className="w-full max-w-[25rem] rounded-xl border-0 bg-[#cdcdcd] px-4 py-3 text-[var(--color-on-surface)]"
    >
      <span>Играть!</span>
    </button>
  </main>
);

export default StartScreen;
