import { useState } from 'react';
import BaseHeader from './base/components/BaseHeader';
import BaseMapPanel from './base/components/BaseMapPanel';
import BasePrizesPanel from './base/components/BasePrizesPanel';
import BaseTabs from './base/components/BaseTabs';
import BaseVictoriesPanel from './base/components/BaseVictoriesPanel';
import { baseTabs } from './base/constants';
import type { BaseTabValue } from './base/types';

type BaseScreenProps = {
  onBack: () => void;
};

export const BaseScreen = ({ onBack }: BaseScreenProps) => {
  const [activeTab, setActiveTab] = useState<BaseTabValue>('map');

  const renderPanel = () => {
    switch (activeTab) {
      case 'victories':
        return <BaseVictoriesPanel />;
      case 'prizes':
        return <BasePrizesPanel />;
      case 'map':
      default:
        return <BaseMapPanel />;
    }
  };

  return (
    <main className="main-bg flex min-h-screen justify-center bg-[var(--color-surface)] px-6 py-8">
      <div className="flex w-full max-w-[25rem] flex-col gap-8 text-[var(--color-on-surface)]">
        <BaseHeader onBack={onBack} />

        <BaseTabs tabs={baseTabs} activeTab={activeTab} onSelect={setActiveTab} />

        <div className="flex flex-col gap-6">{renderPanel()}</div>
      </div>
    </main>
  );
};

export default BaseScreen;
