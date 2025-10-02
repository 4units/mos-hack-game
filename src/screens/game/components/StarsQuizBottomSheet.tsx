import { useCallback, useEffect, useMemo, useState } from 'react';
import { BottomSheet } from '../../../components/modal';
import StarsCount from '../../../components/StarsCount.tsx';
import IconButton from '../../../components/IconButton.tsx';
import { CloseIcon } from '../../../components/icons';
import { getQuizQuestion, submitQuizAnswer } from '../../../services/quizApi';

type StarsQuizBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  onScoreChange: (next: number) => void;
};

type QuizQuestion = {
  id: string;
  text: string;
  options: string[];
  answerDescription?: string;
  infoLink?: string;
};

const IDLE_MESSAGE = 'Правильно отвечайте на наши вопросы и получайте 50 звёзд. Это ещё и полезно)';

const StarsQuizBottomSheet = ({
  isOpen,
  onClose,
  score,
  onScoreChange,
}: StarsQuizBottomSheetProps) => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastReward, setLastReward] = useState<number | null>(null);

  const headingId = useMemo(() => 'stars-quiz-heading', []);

  const loadQuiz = useCallback(async () => {
    setIsFetching(true);
    setErrorMessage(null);
    setQuestion(null);
    try {
      const data = await getQuizQuestion();
      setQuestion({
        id: data.id,
        text: data.question,
        options: data.answer ?? [],
        answerDescription: data.answer_description ?? undefined,
        infoLink: data.info_link ?? undefined,
      });
    } catch (error) {
      console.error('[StarsQuizBottomSheet] failed to load quiz question', error);
      setErrorMessage('Не удалось загрузить вопрос. Попробуйте ещё раз.');
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setQuestion(null);
      setSelected(null);
      setStatus('idle');
      setErrorMessage(null);
      setLastReward(null);
      return;
    }
    loadQuiz();
  }, [isOpen, loadQuiz]);

  const handleSelect = useCallback(
    async (optionIndex: number) => {
      if (selected !== null || !question) return;
      setSelected(optionIndex);
      setErrorMessage(null);
      try {
        const { soft_currency: rawReward } = await submitQuizAnswer({
          id: question.id,
          answer: optionIndex + 1,
        });
        const reward = Math.max(rawReward ?? 0, 0);
        const isCorrect = reward > 0;
        setStatus(isCorrect ? 'correct' : 'wrong');
        setLastReward(isCorrect ? reward : null);
        if (isCorrect && reward > 0) {
          onScoreChange(score + reward);
        }
      } catch (error) {
        console.error('[StarsQuizBottomSheet] failed to submit quiz answer', error);
        setSelected(null);
        setErrorMessage('Не удалось отправить ответ. Попробуйте ещё раз.');
        return;
      }

      window.setTimeout(() => {
        setSelected(null);
        setStatus('idle');
        setLastReward(null);
        if (!isOpen) return;
        loadQuiz();
      }, 1200);
    },
    [selected, question, onScoreChange, score, isOpen, loadQuiz]
  );

  const titleText =
    status === 'correct'
      ? 'ДА! Вы знаете всё'
      : status === 'wrong'
        ? 'К сожалению, нет'
        : 'Как получить больше?';

  const messageText = (() => {
    if (errorMessage) return errorMessage;
    if (status === 'correct') {
      const rewardText = lastReward && lastReward > 0 ? `Добавили ${lastReward} звёзд.` : '';
      const description = question?.answerDescription ?? 'Попробуете ещё?';
      return [rewardText, description].filter(Boolean).join(' ');
    }
    if (status === 'wrong') {
      return question?.answerDescription ?? 'Попробуете ещё?';
    }
    if (isFetching) return 'Загружаем вопрос...';
    return IDLE_MESSAGE;
  })();

  const renderOptions = () => {
    if (question && question.options.length > 0) {
      return question.options.map((option, i) => {
        const isChosen = selected === i;
        const baseClasses = 'border-[var(--color-violet)] text-[var(--color-violet)]';
        let stateClasses = `${baseClasses} hover:bg-[var(--color-lily)]`;

        if (selected !== null) {
          if (isChosen) {
            if (status === 'correct') {
              stateClasses = 'border-green-600 text-green-600 bg-[var(--color-lily)]';
            } else if (status === 'wrong') {
              stateClasses = 'border-red-600 text-red-600 bg-[var(--color-lily)]';
            } else {
              stateClasses = `${baseClasses} bg-[var(--color-lily)]`;
            }
          } else {
            stateClasses = `${baseClasses} opacity-60`;
          }
        }

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
      });
    }

    if (isFetching) {
      return Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`quiz-skeleton-${index}`}
          className="h-[52px] w-full rounded-[13px] border border-dashed border-[var(--color-violet)] bg-[var(--color-lily)]/40 animate-pulse"
        />
      ));
    }

    return (
      <button
        type="button"
        onClick={() => loadQuiz()}
        disabled={isFetching}
        className="w-full rounded-[13px] border border-[var(--color-violet)] bg-transparent px-4 py-3 text-left text-[var(--color-violet)] transition-colors duration-150 hover:bg-[var(--color-lily)]"
      >
        <span className="text-2 font-medium">{isFetching ? 'Загружаем…' : 'Загрузить вопрос'}</span>
      </button>
    );
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} labelledBy={headingId}>
      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-[20px]">
          <h2 id={headingId} className="text-[var(--color-black)]">
            Ваши звёзды
          </h2>
          <StarsCount number={score} color={'violet'} ariaLabel="Количество звёзд" />
        </div>

        <IconButton variant="ghost" aria-label="Закрыть" onClick={onClose} className={'ml-auto'}>
          <CloseIcon />
        </IconButton>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <h3 className="text-[var(--color-violet)]">{titleText}</h3>
        <p className="text-[var(--color-black)] text-1">{messageText}</p>
        {(status === 'correct' || status === 'wrong') && question?.infoLink && (
          <a
            href={question.infoLink}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--color-violet)] text-1 underline"
          >
            Узнать больше
          </a>
        )}
      </div>

      <div className="mt-5 rounded-[20px] bg-[var(--color-viola)] p-4">
        <p className="mb-3 text-[var(--color-violet)] text-1">
          {question?.text ?? (isFetching ? 'Обновляем вопрос…' : 'Вопрос недоступен')}
        </p>
        <div className="flex flex-col gap-3">{renderOptions()}</div>
      </div>
    </BottomSheet>
  );
};

export default StarsQuizBottomSheet;
