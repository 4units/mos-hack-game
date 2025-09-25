import { prizes } from '../constants';
import BasePrizeCard from './BasePrizeCard';

const BasePrizesPanel = () => (
  <section aria-label="Призы" className="flex flex-col gap-4">
    {prizes.map(({ id, title, description }) => (
      <BasePrizeCard key={id} title={title} description={description} />
    ))}
  </section>
);

export default BasePrizesPanel;
