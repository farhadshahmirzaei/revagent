import React from 'react';
import { LayoutDashboard, Bot, Kanban, Users, Grid } from 'lucide-react';
import { ActiveTab, Language } from '../types';
import { t } from '../translations';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenMore: () => void;
  currentLang: Language;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenMore,
  currentLang,
}) => {
  const tabs: {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'dashboard', label: t('mobileNavHome', currentLang), icon: LayoutDashboard },
    { id: 'ai-agent', label: t('mobileNavAgent', currentLang), icon: Bot },
    { id: 'pipeline', label: t('mobileNavPipeline', currentLang), icon: Kanban },
    { id: 'leads', label: t('mobileNavLeads', currentLang), icon: Users },
  ];

  const isMoreActive =
    activeTab === 'campaigns' ||
    activeTab === 'forecast' ||
    activeTab === 'roadmap' ||
    activeTab === 'settings';

  return (
    <nav
      aria-label={t('mainMenu', currentLang)}
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 h-16 px-2"
    >
      <div className="grid grid-cols-5 h-full items-center">
        {tabs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-[11px] font-semibold truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onOpenMore}
          className={`min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
            isMoreActive
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Grid className="w-5 h-5 shrink-0" />
          <span className="text-[11px] font-semibold truncate max-w-[64px]">
            {t('mobileMore', currentLang)}
          </span>
        </button>
      </div>
    </nav>
  );
};
