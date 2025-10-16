import { useState } from 'react';
import { ChevronRightIcon } from '../components/icons';
import BaseHeader from '../components/BaseHeader.tsx';
type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: 'Как играть?',
    answer:
      'Помогите Газику пройти все платформы! На каждой платформе вас ждёт задачка – пройти все шаги начиная с 1го номера и заканчивая последним по порядку, обходя закрытые клетки, если они есть. Чем быстрее пройдёте, тем больше получите звёзд. Вы можете обменять подсказки на звёзды, а после прохождения получить призы!',
  },
  {
    question: 'Как получить ещё больше звёзд?',
    answer: 'Отвечайте на вопросы квиза под виджетом звезды и получайте дополнительные звёзды.',
  },
  {
    question: 'Сколько всего платформ?',
    answer: 'Всего 100 платформ.',
  },
  {
    question: 'Как легко пройти платформу?',
    answer: 'Вы можете обменять звёзды на подсказку шагов или блокировку времени.',
  },
  {
    question: 'Как использовать подсказки?',
    answer: 'Нажмите на виджет с подсказкой или блокировкой времени и подтвердите применение.',
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
    <main className="main-bg flex min-h-screen justify-center">
      <div className="flex w-full max-w-[25rem] flex-col gap-6 text-[var(--color-on-surface)]">
        <BaseHeader onBack={onBack} title="Популярные вопросы" />

        <ul className="flex flex-col gap-4">
          {faqItems.map(({ question, answer }, index) => {
            const isOpen = openedIndex === index;

            return (
              <li
                key={question}
                className={`${isOpen ? 'bg-[var(--color-lily)] rounded-[12px] border-[1px] border-[var(--color-lily)]' : ''}`}
              >
                <button
                  type="button"
                  className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-lg font-medium ${isOpen ? 'border-none rounded-none' : 'rounded-[12px] border-[1px] border-white'}`}
                  onClick={() => toggleItem(index)}
                >
                  {isOpen ? (
                    <h4 className="text-[var(--color-violet)]">{question}</h4>
                  ) : (
                    <span className="text-1">{question}</span>
                  )}
                  <span
                    className={`flex h-6 w-6 items-center justify-center transition-transform duration-200 ${
                      isOpen ? 'rotate-90 text-[var(--color-violet)]' : 'text-white'
                    }`}
                  >
                    <ChevronRightIcon />
                  </span>
                </button>

                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-out px-4 ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 pb-4' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <p className="overflow-hidden text-black text-2">{answer}</p>
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
