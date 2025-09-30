import { useMemo, useState } from 'react';
import { BottomSheet } from '../../../components/modal';
import StarsCount from '../../../components/StarsCount.tsx';
import IconButton from '../../../components/IconButton.tsx';
import { CloseIcon } from '../../../components/icons';

type StarsQuizBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  onScoreChange: (next: number) => void;
};

type Question = {
  text: string;
  options: string[];
  correctIndex: number;
  hint?: string;
};

const QUESTIONS: Question[] = [
  {
    text: 'Выберите что предлагает Газпромбанк Мобайл для новых пользователей?',
    options: [
      'Защиту от мошенников',
      'Повышенный накопительный процент',
      'Не сгораемые ГБ и минуты',
      'Всё сразу',
    ],
    correctIndex: 3,
    hint: 'Правильно отвечайте на наши вопросы и получайте 50 звёзд. Это ещё и полезно)',
  },
  {
    text: 'Что даёт инвестиционное страхование жизни от Газпромбанка?',
    options: [
      'Позволяет зарабатывать и страховать жизнь',
      'Позволяет страховать инвестиции',
      'Позволяет оплачивать медицинские услуги из инвестиций',
      'Всё сразу',
    ],
    correctIndex: 3,
    hint: 'Газпромбанк Мобайл предлагает всё из перечисленного. Попробуете ещё?',
  },
];

const StarsQuizBottomSheet = ({
  isOpen,
  onClose,
  score,
  onScoreChange,
}: StarsQuizBottomSheetProps) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const headingId = useMemo(() => 'stars-quiz-heading', []);

  const question = QUESTIONS[index % QUESTIONS.length];

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    const isCorrect = optionIndex === question.correctIndex;
    setStatus(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      onScoreChange(score + 50);
    }

    // Advance to the next question after short delay
    window.setTimeout(() => {
      setIndex((i) => i + 1);
      setSelected(null);
      setStatus('idle');
    }, 1200);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} labelledBy={headingId}>
      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-[20px]">
          <h2 id={headingId} className="text-[var(--color-black)]">
            Ваши звёзды
          </h2>
          <StarsCount number={score} color={'violet'} />
        </div>

        <IconButton variant="ghost" aria-label="Закрыть" onClick={onClose} className={'ml-auto'}>
          <CloseIcon />
        </IconButton>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <h3 className="text-[var(--color-violet)]">
          {status === 'correct' && 'ДА! Вы знаете всё'}
          {status === 'wrong' && 'К сожалению, нет'}
          {status === 'idle' && 'Как получить больше?'}
        </h3>
        <p className="text-[var(--color-black)] text-1">
          {status === 'idle' &&
            'Правильно отвечайте на наши вопросы и получайте 50 звёзд. Это ещё и полезно)'}
          {status === 'correct' && 'Добавили 50 звезд. Попробуете ещё?'}
          {status === 'wrong' &&
            'Газпромбанк Мобайл предлагает всё из перечисленного. Попробуете ещё?'}
        </p>
      </div>

      <div className="mt-5 rounded-[20px] bg-[var(--color-viola)] p-4">
        <p className="mb-3 text-[var(--color-violet)] text-1">{question.text}</p>
        <div className="flex flex-col gap-3">
          {question.options.map((option, i) => {
            const isChosen = selected === i;
            const isCorrect = i === question.correctIndex;
            const stateClasses =
              selected === null
                ? 'border-[var(--color-violet)] text-[var(--color-violet)] hover:bg-[var(--color-lily)]'
                : isChosen && isCorrect
                  ? 'border-green-600 text-green-600 bg-[var(--color-lily)]'
                  : isChosen && !isCorrect
                    ? 'border-red-600 text-red-600 bg-[var(--color-lily)]'
                    : 'border-[var(--color-violet)] text-[var(--color-violet)]';

            return (
              <button
                type="button"
                key={`${option}-${i}`}
                disabled={selected !== null}
                onClick={() => handleSelect(i)}
                className={`w-full rounded-[13px] border bg-transparent px-4 py-3 text-left transition-colors duration-150 ${stateClasses}`.trim()}
              >
                <span className={'text-2 font-medium'}>{option}</span>
              </button>
            );
          })}
        </div>
      </div>
    </BottomSheet>
  );
};

export default StarsQuizBottomSheet;
