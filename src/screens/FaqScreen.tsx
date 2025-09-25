import { useState } from 'react';
import { ChevronRightIcon } from '../components/icons';
import BaseHeader from './base/components/BaseHeader';

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: 'Как проходить игру?',
    answer:
      'Начните с обучения, затем следуйте подсказкам на экране и выбирайте правильные ответы, чтобы двигаться дальше.',
  },
  {
    question: 'Как пополнить энергию?',
    answer:
      'Энергию можно восстановить, выполняя ежедневные задания или приобретая специальные наборы в магазине.',
  },
  {
    question: 'Что можно выиграть?',
    answer:
      'Участвуйте в еженедельных рейтингах и получайте доступ к эксклюзивным наградам и бонусам.',
  },
];

type FaqScreenProps = {
  onBack: () => void;
};

export const FaqScreen = ({ onBack }: FaqScreenProps) => {
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenedIndex((current) => (current === index ? null : index));
  };

  return (
    <main className="flex min-h-screen justify-center bg-[var(--color-surface)] px-6 py-8">
      <div className="flex w-full max-w-[25rem] flex-col gap-8 text-[var(--color-on-surface)]">
        <BaseHeader onBack={onBack} />

        <ul className="flex flex-col divide-y divide-[var(--color-border)]">
          {faqItems.map(({ question, answer }, index) => {
            const isOpen = openedIndex === index;

            return (
              <li key={question}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left text-lg font-medium border-none rounded-none"
                  onClick={() => toggleItem(index)}
                >
                  <span>{question}</span>
                  <span
                    className={`flex h-6 w-6 items-center justify-center transition-transform duration-200 ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </span>
                </button>

                <div
                  className={`grid overflow-hidden px-1 transition-all duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 py-2' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <p className="overflow-hidden leading-relaxed text-[var(--color-black)]">
                    {answer}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
};

export default FaqScreen;
