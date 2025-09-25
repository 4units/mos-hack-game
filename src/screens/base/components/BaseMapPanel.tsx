import { HomeIcon } from '../../../components/icons';

const BaseMapPanel = () => (
  <section aria-label="Карта базы" className="flex flex-1 items-center justify-center">
    <div className="flex h-[24rem] w-full items-center justify-center rounded-3xl bg-[#dedede]">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_8px_18px_rgba(16,18,22,0.12)]">
        <HomeIcon className="h-9 w-9" />
      </div>
    </div>
  </section>
);

export default BaseMapPanel;
