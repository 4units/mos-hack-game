import { Fragment } from 'react';
import type { BaseTab, BaseTabValue } from '../types';

type BaseTabsProps = {
  tabs: BaseTab[];
  activeTab: BaseTabValue;
  onSelect: (value: BaseTabValue) => void;
};

const BaseTabs = ({ tabs, activeTab, onSelect }: BaseTabsProps) => (
  <nav aria-label="Разделы базы" className="flex">
    <div className="flex w-full items-stretch gap-1 rounded-full bg-[#d9d9d9] p-1">
      {tabs.map((tab, index) => {
        const isActive = tab.value === activeTab;

        return (
          <Fragment key={tab.value}>
            <button
              type="button"
              className={`flex-1 rounded-full border border-transparent px-5 py-2 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-iris)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] ${
                isActive
                  ? 'bg-white text-[var(--color-black)] shadow-[0_10px_25px_rgba(16,18,22,0.12)]'
                  : 'bg-transparent text-[var(--color-muted)] hover:text-[var(--color-black)]'
              }`}
              aria-pressed={isActive}
              onClick={() => onSelect(tab.value)}
            >
              {tab.label}
            </button>
            {index < tabs.length - 1 ? (
              <span
                aria-hidden="true"
                className="my-1 w-px rounded-full bg-[rgba(16,18,22,0.12)]"
              />
            ) : null}
          </Fragment>
        );
      })}
    </div>
  </nav>
);

export default BaseTabs;
