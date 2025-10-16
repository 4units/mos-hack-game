type PlatformNumberProps = {
  number: number;
};

const PlatformNumber = ({ number }: PlatformNumberProps) => (
  <div className="flex flex-col gap-0 items-center justify-center text-[var(--color-raspberry)] border-[var(--color-raspberry)] border-[1px] rounded-[10px] px-2 min-h-[45px]">
    <span className="text-1 leading-6">{number}</span>
    <span className="text-3 leading-3">платформа</span>
  </div>
);

export default PlatformNumber;
