import { useMemo } from 'react';
import { ModalCard } from '../../../components/modal';
import { energyRecoveryTime } from '../constants.ts';
import IconButton from '../../../components/IconButton.tsx';
import { CloseIcon } from '../../../components/icons';

const formatUnit = (value: number) => value.toString().padStart(2, '0');

const EnergyModalContent = ({ onClose, headingId }: { onClose: () => void; headingId: string }) => {
  const digits = useMemo(() => {
    const hours = formatUnit(energyRecoveryTime.hours);
    const minutes = formatUnit(energyRecoveryTime.minutes);
    const seconds = formatUnit(energyRecoveryTime.seconds);

    return `${hours}:${minutes}:${seconds}`.split('');
  }, []);

  return (
    <ModalCard className="gap-6">
      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-2">
          <h3 id={headingId} className="text-[var(--color-black)]">
            Сила (энергия)
          </h3>
          <p className="max-w-[18rem] text-sm leading-relaxed text-[var(--color-muted)]">
            Восстановите силы и снова в путь!
          </p>
        </div>

        <IconButton variant="ghost" aria-label="Закрыть" onClick={onClose} className="ml-auto">
          <CloseIcon />
        </IconButton>
      </div>

      <div className="flex items-center justify-center gap-2">
        {digits.map((symbol, index) => {
          const isSeparator = symbol === ':';

          if (isSeparator) {
            return (
              <span
                key={`separator-${index}`}
                className="px-1 text-lg font-semibold text-[var(--color-black)]"
              >
                {symbol}
              </span>
            );
          }

          return (
            <span
              key={`digit-${index}`}
              className="flex h-12 w-10 items-center justify-center rounded-[1rem] bg-white text-lg font-semibold text-[var(--color-black)] shadow-[0_6px_16px_rgba(16,18,22,0.12)]"
            >
              {symbol}
            </span>
          );
        })}
      </div>
    </ModalCard>
  );
};

export default EnergyModalContent;
