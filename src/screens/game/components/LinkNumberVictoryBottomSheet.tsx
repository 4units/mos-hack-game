import { useMemo } from 'react';
import { BottomSheet } from '../../../components/modal';
import IconButton from '../../../components/IconButton';
import StarsCount from '../../../components/StarsCount';
import { CloseIcon } from '../../../components/icons';

type VictoryTier = {
  maxSeconds: number;
  stars: number;
  title: string;
  description: string;
  topic: string;
  bullets: string[];
};

const VICTORY_TIERS: VictoryTier[] = [
  {
    maxSeconds: 60,
    stars: 500,
    title: 'Ура! Только вперед',
    description:
      'Вы помогли Газику пройти эту платформу, а он подскажет как заработать на страховании жизни.',
    topic: 'Инвестиционное страхование жизни (ИСЖ)',
    bullets: [
      'Вы заключаете договор со страховой компанией. Страховая компания направляет ваши деньги в стратегию инвестирования.',
      'На протяжении действия договора ваша жизнь и здоровье застрахованы: при наступлении сложных жизненных обстоятельств страховая компания осуществляет страховую выплату.',
      'Когда срок договора закончится, вы вернете ваши вложения в полном объеме с учетом гарантированной страховой суммы (ГСС) в размере 100%.',
    ],
  },
  {
    maxSeconds: 120,
    stars: 400,
    title: 'Отличный темп!',
    description:
      'Газик впечатлен скоростью - до максимальной награды совсем немного. С этими советами следующий забег будет еще быстрее.',
    topic: 'Как сохранить высокий ритм',
    bullets: [
      'Планируйте маршрут сразу на несколько шагов вперед, чтобы не возвращаться назад.',
      'Следите за блокерами заранее и думайте, где пригодится остановка времени.',
      'Не бойтесь тратить подсказки - они помогают сохранить серии быстрых побед.',
    ],
  },
];

type LinkNumberVictoryBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  elapsedSeconds: number | null;
};

const pickTier = (elapsedSeconds: number): VictoryTier => {
  for (const tier of VICTORY_TIERS) {
    if (elapsedSeconds <= tier.maxSeconds) {
      return tier;
    }
  }
  return VICTORY_TIERS[VICTORY_TIERS.length - 1];
};

const ruPlural = (n: number, one: string, few: string, many: string) => {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
  return many;
};

const buildSubtitle = (seconds: number) => {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) {
    const val = Math.max(1, s);
    return `Вы успели\nза ${val} ${ruPlural(val, 'секунду', 'секунды', 'секунд')}!`;
  }
  const minutes = Math.ceil(s / 60);
  return `Вы успели\nза ${minutes} ${ruPlural(minutes, 'минуту', 'минуты', 'минут')}!`;
};

const LinkNumberVictoryBottomSheet = ({
  isOpen,
  onClose,
  elapsedSeconds,
}: LinkNumberVictoryBottomSheetProps) => {
  const headingId = useMemo(() => 'link-number-victory-heading', []);
  const safeElapsed = useMemo(() => elapsedSeconds ?? 0, [elapsedSeconds]);
  const tier = useMemo(() => pickTier(safeElapsed), [safeElapsed]);

  const dynamicSubtitle = useMemo(() => buildSubtitle(safeElapsed), [safeElapsed]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} labelledBy={headingId}>
      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-2">
          <h2
            id={headingId}
            className="text-[var(--color-black)] text-[24px] font-bold leading-tight"
          >
            {tier.title}
          </h2>
        </div>

        <IconButton variant="ghost" aria-label="Закрыть" onClick={onClose} className="ml-auto">
          <CloseIcon />
        </IconButton>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <StarsCount ariaLabel="Награда в звездах" number={tier.stars} color="violet" disabled />
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-violet)] text-sm font-medium whitespace-pre-line">
            {dynamicSubtitle}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <p className="text-[var(--color-black)] text-1">{tier.description}</p>
        <div className="flex flex-col gap-3">
          <h3 className="text-[var(--color-violet)] text-[18px] font-semibold leading-tight">
            {tier.topic}
          </h3>
          <ol className="flex flex-col gap-3 text-[var(--color-black)] text-1">
            {tier.bullets.map((bullet, index) => (
              <li key={`${tier.topic}-${index}`} className="flex gap-3">
                <h3 className="text-[var(--color-violet)]">{index + 1}</h3>
                <span className="flex-1 leading-snug">{bullet}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          aria-label="Узнать подробнее"
          className="w-full rounded-[13px] border-0 bg-[var(--color-violet)] px-4 py-3 text-1 font-medium text-white"
          onClick={onClose}
        >
          Узнать подробнее
        </button>
      </div>
    </BottomSheet>
  );
};

export default LinkNumberVictoryBottomSheet;
