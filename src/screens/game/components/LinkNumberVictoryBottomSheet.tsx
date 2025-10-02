import { useMemo } from 'react';
import { BottomSheet } from '../../../components/modal';
import IconButton from '../../../components/IconButton';
import StarsCount from '../../../components/StarsCount';
import { ClockIcon, CloseIcon } from '../../../components/icons';
import { formatDuration } from '../../../utils/format';

type VictoryTier = {
  maxSeconds: number;
  stars: number;
  title: string;
  subtitle: string;
  description: string;
  topic: string;
  bullets: string[];
};

const VICTORY_TIERS: VictoryTier[] = [
  {
    maxSeconds: 60,
    stars: 500,
    title: 'Ура! Только вперед',
    subtitle: 'Вы успели за минуту!',
    description:
      'Вы помогли Газику пройти эту платформу, а он подскажет как заработать на страховании жизни.',
    topic: 'Инвестиционное страхование жизни (ИСЖ)',
    bullets: [
      'Вы заключаете договор со страховой компанией. Страховая компания направляет ваши деньги в стратегию инвестирования.',
      'На протяжении действия договора ваша жизнь и здоровье застрахованы: при наступлении сложных жизненных обстоятельств страховая компания осуществляет страховую выплату.',
      'Когда срок договора закончится, вы вернете свои вложения в полном объеме с учетом гарантированной страховой суммы (ГСС) в размере 100%.',
    ],
  },
  {
    maxSeconds: 120,
    stars: 400,
    title: 'Отличный темп!',
    subtitle: 'Вы уложились быстрее двух минут!',
    description:
      'Газик впечатлен скоростью - до максимальной награды совсем немного. С этими советами следующий забег будет еще быстрее.',
    topic: 'Как сохранить высокий ритм',
    bullets: [
      'Планируйте маршрут сразу на несколько шагов вперед, чтобы не возвращаться назад.',
      'Следите за блокерами заранее и думайте, где пригодится остановка времени.',
      'Не бойтесь тратить подсказки - они помогают сохранить серии быстрых побед.',
    ],
  },
  {
    maxSeconds: 180,
    stars: 300,
    title: 'Поздравляем!',
    subtitle: 'Вы успели за 3 минуты!',
    description:
      'Вы помогли Газику пройти эту платформу, а он подскажет как экономить на мобильной связи. Для вас специальное предложение!',
    topic: 'Скидка 50% новым абонентам на все годовые тарифы Газпромбанк Мобайл',
    bullets: [
      'Безопасная связь - Антиспам, антифрод и защита от подмены номера.',
      '+0,5% к накопительному счету - Надбавка для активных абонентов.',
      'Остатки не сгорают - Минуты, СМС и ГБ переносятся на следующий месяц.',
    ],
  },
  {
    maxSeconds: 300,
    stars: 200,
    title: 'Вы молодец!',
    subtitle: 'Вы успели за 5 минут!',
    description:
      'Вы помогли Газику пройти эту платформу, а он подскажет вам как защититься от мошенничества.',
    topic: 'Как защититься от мошенничества',
    bullets: [
      'Никогда не называйте "операторам" никаких кодов, не вводите на непроверенных ресурсах данные своих банковских карт и учетных записей и тем более не соглашайтесь скачивать приложения по неизвестным ссылкам.',
      'Не переходите по ссылкам из сообщений в мессенджерах или электронных письмах от незнакомых отправителей и не вводите личные данные на неизвестных сайтах.',
      'Установите запрет на оформление кредитов и микрозаймов через портал Госуслуги - это поможет предотвратить несанкционированное оформление займов от вашего имени.',
    ],
  },
  {
    maxSeconds: 900,
    stars: 50,
    title: 'Платформа пройдена!',
    subtitle: 'Вы уложились в 15 минут.',
    description:
      'Газик доволен результатом: каждая платформа дает вам опыт и уверенность. Смотрите советы, чтобы ускориться на следующем заходе.',
    topic: 'Советы для следующего старта',
    bullets: [
      'Перед началом маршрута найдите взглядом все контрольные точки - так проще построить путь.',
      'Используйте остановку времени, чтобы перевести дух и не торопиться с выбором.',
      'Подсказки можно обменять на звезды - они помогают, если вы застряли.',
    ],
  },
  {
    maxSeconds: Number.POSITIVE_INFINITY,
    stars: 50,
    title: 'Платформа пройдена!',
    subtitle: 'Газик ждет вас на следующем испытании.',
    description:
      'Вы справились с задачей. Немного практики - и звезд станет еще больше. Берите советы и попробуйте пройти быстрее.',
    topic: 'Что поможет улучшить время',
    bullets: [
      'Держите под рукой остановку времени - так легче собраться и не ошибиться.',
      'Запоминайте удачные маршруты: они пригодятся на похожих платформах.',
      'Переходите на следующую платформу, как только будете готовы - темп помогает держать концентрацию.',
    ],
  },
];

type LinkNumberVictoryBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onNextLevel: () => void;
  elapsedSeconds: number | null;
  currentLevel: number;
};

const pickTier = (elapsedSeconds: number): VictoryTier => {
  for (const tier of VICTORY_TIERS) {
    if (elapsedSeconds <= tier.maxSeconds) {
      return tier;
    }
  }
  return VICTORY_TIERS[VICTORY_TIERS.length - 1];
};

const LinkNumberVictoryBottomSheet = ({
  isOpen,
  onClose,
  onNextLevel,
  elapsedSeconds,
  currentLevel,
}: LinkNumberVictoryBottomSheetProps) => {
  const headingId = useMemo(() => 'link-number-victory-heading', []);
  const safeElapsed = useMemo(() => elapsedSeconds ?? 0, [elapsedSeconds]);
  const tier = useMemo(() => pickTier(safeElapsed), [safeElapsed]);
  const timeValue = useMemo(() => formatDuration(safeElapsed), [safeElapsed]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} labelledBy={headingId}>
      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-[var(--color-violet)] text-xs uppercase font-semibold">
            Платформа {currentLevel} пройдена
          </span>
          <h2
            id={headingId}
            className="text-[var(--color-black)] text-[24px] font-bold leading-tight"
          >
            {tier.title}
          </h2>
          <span className="text-[var(--color-violet)] text-sm font-medium">{tier.subtitle}</span>
        </div>

        <IconButton variant="ghost" aria-label="Закрыть" onClick={onClose} className="ml-auto">
          <CloseIcon />
        </IconButton>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <StarsCount ariaLabel="Награда в звездах" number={tier.stars} color="violet" disabled />
        <div className="flex items-center gap-2 rounded-[12px] border border-[var(--color-violet)] px-4 py-3 text-[var(--color-violet)]">
          <ClockIcon />
          <span className="text-2 font-medium">{timeValue}</span>
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
                <span className="text-[var(--color-violet)] font-medium">{index + 1}</span>
                <span className="flex-1 leading-snug">{bullet}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          className="w-full rounded-[13px] border-0 bg-[var(--color-violet)] px-4 py-3 text-1 font-medium text-white"
          onClick={onNextLevel}
        >
          На следующую платформу
        </button>
      </div>
    </BottomSheet>
  );
};

export default LinkNumberVictoryBottomSheet;
