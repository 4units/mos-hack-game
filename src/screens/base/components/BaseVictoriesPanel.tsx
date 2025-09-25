import { victories } from '../constants';
import BaseVictoryCard from './BaseVictoryCard';

const BaseVictoriesPanel = () => (
  <section aria-label="Победы" className="grid grid-cols-3 gap-4">
    {victories.map(({ id, title, reward }) => (
      <BaseVictoryCard key={id} title={title} reward={reward} />
    ))}
  </section>
);

export default BaseVictoriesPanel;
