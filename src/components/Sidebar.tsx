import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Kanban,
  Users,
  Megaphone,
  TrendingUp,
  Layers,
  Settings as SettingsIcon,
  X,
} from 'lucide-react';
import { ActiveTab, Language, SubscriptionInfo } from '../types';
import { t } from '../translations';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentLang: Language;
  subscription: SubscriptionInfo;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentLang,
  subscription,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: t('dashboard', currentLang), icon: LayoutDashboard },
    { id: 'ai-agent', label: t('aiAgentTab', currentLang), icon: Bot },
    { id: 'pipeline', label: t('pipeline', currentLang), icon: Kanban },
    { id: 'leads', label: t('leads', currentLang), icon: Users },
    { id: 'campaigns', label: t('campaigns', currentLang), icon: Megaphone },
    { id: 'forecast', label: t('forecast', currentLang), icon: TrendingUp },
    { id: 'roadmap', label: t('roadmap', currentLang), icon: Layers },
    { id: 'settings', label: t('settings', currentLang), icon: SettingsIcon },
  ];

  const handleSelect = (tab: ActiveTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between px-3 pt-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t('mainMenu', currentLang)}
          </p>
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Business Owner Subscription Summary */}
      <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {t('activeSubscription', currentLang)}
          </div>
          <div className="text-xs font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
            {subscription.planName}
          </div>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <span>{t('connectedChannels', currentLang)}</span>
            <span className="font-medium text-slate-900 dark:text-slate-200">
              {subscription.activeChannels.join(' · ')}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>{t('ownerName', currentLang)}</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
              {subscription.statusLabel}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleSelect('ai-agent')}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-3 rounded-xl text-xs transition-colors whitespace-nowrap"
        >
          {t('startActivation', currentLang)}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="w-64 bg-white dark:bg-slate-900 border-e border-slate-200 dark:border-slate-800 hidden md:flex flex-col shrink-0">
        {sidebarContent}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <aside className="relative w-72 max-w-[82vw] bg-white dark:bg-slate-900 border-e border-slate-200 dark:border-slate-800 h-full z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
