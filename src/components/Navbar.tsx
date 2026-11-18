import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Sparkles, Globe, Search, X, ArrowUpRight, Menu } from 'lucide-react';
import { Language, Deal, Lead, Campaign, CatalogKey, ActiveTab } from '../types';
import { t } from '../translations';
import { localizedCatalogs } from '../data/catalogs';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenCopilot: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  deals: Deal[];
  leads: Lead[];
  campaigns: Campaign[];
  onNavigateResult: (tab: ActiveTab, itemId?: string, catalogKey?: CatalogKey) => void;
  onToggleMobileNav: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  onOpenCopilot,
  searchQuery,
  onSearchChange,
  deals,
  leads,
  campaigns,
  onNavigateResult,
  onToggleMobileNav,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsSearchFocused(true);
      } else if (e.key === 'Escape' && isSearchFocused) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleShortcut);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleShortcut);
    };
  }, [isSearchFocused]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!normalizedQuery) {
      return { deals: [], leads: [], campaigns: [], catalogs: [] };
    }
    const dealMatches = deals.filter(
      (d) =>
        d.title.toLowerCase().includes(normalizedQuery) ||
        d.client.toLowerCase().includes(normalizedQuery) ||
        d.aiNotes.toLowerCase().includes(normalizedQuery)
    );
    const leadMatches = leads.filter(
      (l) =>
        l.name.toLowerCase().includes(normalizedQuery) ||
        l.company.toLowerCase().includes(normalizedQuery) ||
        l.source.toLowerCase().includes(normalizedQuery) ||
        l.notes.toLowerCase().includes(normalizedQuery)
    );
    const campaignMatches = campaigns.filter(
      (c) =>
        c.name.toLowerCase().includes(normalizedQuery) ||
        c.channel.toLowerCase().includes(normalizedQuery)
    );
    const catalogList = Object.values(localizedCatalogs[currentLang]);
    const catalogMatches = catalogList.filter(
      (cat) =>
        cat.title.toLowerCase().includes(normalizedQuery) ||
        cat.subtitle.toLowerCase().includes(normalizedQuery) ||
        cat.whyItMatters.toLowerCase().includes(normalizedQuery)
    );
    return {
      deals: dealMatches,
      leads: leadMatches,
      campaigns: campaignMatches,
      catalogs: catalogMatches,
    };
  }, [normalizedQuery, deals, leads, campaigns, currentLang]);

  const totalMatches =
    matches.deals.length +
    matches.leads.length +
    matches.campaigns.length +
    matches.catalogs.length;

  const showPopover = isSearchFocused && normalizedQuery.length > 0;

  return (
    <header className="sticky top-0 z-40 h-14 sm:h-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
      {/* Zone 1: Brand Wordmark + Mobile Menu Trigger */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleMobileNav}
          aria-label={t('mainMenu', currentLang)}
          className="md:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-base sm:text-lg shrink-0">
            R
          </div>
          <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white whitespace-nowrap shrink-0 hidden sm:inline">
            {t('appName', currentLang)}
          </span>
        </div>
      </div>

      {/* Zone 2: Global Instant Search */}
      <div ref={searchContainerRef} className="relative flex-1 min-w-0 max-w-xl">
        <div className="relative flex items-center">
          <Search
            className={`w-4 h-4 text-slate-400 pointer-events-none absolute ${
              currentLang === 'fa' ? 'right-3.5' : 'left-3.5'
            }`}
          />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsSearchFocused(true);
            }}
            placeholder={t('searchPlaceholder', currentLang)}
            aria-label={t('searchPlaceholder', currentLang)}
            className={`w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors ${
              currentLang === 'fa' ? 'pr-10 pl-10' : 'pl-10 pr-10'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                inputRef.current?.focus();
              }}
              aria-label={t('searchClear', currentLang)}
              className={`p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 absolute ${
                currentLang === 'fa' ? 'left-2.5' : 'right-2.5'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live accessible result announcement */}
        <div className="sr-only" aria-live="polite">
          {normalizedQuery ? `${totalMatches} ${t('searchFoundCount', currentLang)}` : ''}
        </div>

        {/* Categorized Global Search Popover */}
        {showPopover && (
          <div className="animate-panel absolute top-full mt-2 inset-x-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[70vh] flex flex-col">
            <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {t('searchResultsTitle', currentLang)}
              </span>
              <span className="font-mono-num font-semibold text-indigo-600 dark:text-indigo-400">
                {totalMatches} {t('searchFoundCount', currentLang)}
              </span>
            </div>

            <div className="overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/70">
              {totalMatches === 0 ? (
                <div className="p-6 text-center space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t('searchNoResults', currentLang)}
                  </p>
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {t('searchClear', currentLang)}
                  </button>
                </div>
              ) : (
                <>
                  {matches.deals.length > 0 && (
                    <div className="p-2">
                      <div className="px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {t('searchCatDeals', currentLang)}
                      </div>
                      {matches.deals.map((deal) => (
                        <button
                          key={deal.id}
                          type="button"
                          onClick={() => {
                            onNavigateResult('pipeline', deal.id);
                            setIsSearchFocused(false);
                          }}
                          className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center justify-between gap-3 text-start transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                              {deal.title}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {deal.client}
                            </div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  {matches.leads.length > 0 && (
                    <div className="p-2">
                      <div className="px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {t('searchCatLeads', currentLang)}
                      </div>
                      {matches.leads.map((lead) => (
                        <button
                          key={lead.id}
                          type="button"
                          onClick={() => {
                            onNavigateResult('leads', lead.id);
                            setIsSearchFocused(false);
                          }}
                          className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center justify-between gap-3 text-start transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                              {lead.name} · {lead.company}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {lead.source}
                            </div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  {matches.campaigns.length > 0 && (
                    <div className="p-2">
                      <div className="px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {t('searchCatCampaigns', currentLang)}
                      </div>
                      {matches.campaigns.map((camp) => (
                        <button
                          key={camp.id}
                          type="button"
                          onClick={() => {
                            onNavigateResult('campaigns', camp.id);
                            setIsSearchFocused(false);
                          }}
                          className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center justify-between gap-3 text-start transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                              {camp.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {camp.channel}
                            </div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  {matches.catalogs.length > 0 && (
                    <div className="p-2">
                      <div className="px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {t('searchCatCatalogs', currentLang)}
                      </div>
                      {matches.catalogs.map((cat) => {
                        const targetTab: ActiveTab =
                          cat.key === 'ai-agent'
                            ? 'ai-agent'
                            : cat.key === 'pipeline'
                            ? 'pipeline'
                            : cat.key === 'leads'
                            ? 'leads'
                            : 'campaigns';
                        return (
                          <button
                            key={cat.key}
                            type="button"
                            onClick={() => {
                              onNavigateResult(targetTab, undefined, cat.key);
                              setIsSearchFocused(false);
                            }}
                            className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center justify-between gap-3 text-start transition-colors"
                          >
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                                {cat.title}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {cat.subtitle}
                              </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-indigo-500 shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            {totalMatches > 0 && (
              <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs text-slate-500 dark:text-slate-400">
                {t('searchHint', currentLang)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Zone 3: Language Switcher + Primary Action */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Compact mobile language cycler (< sm) */}
        <button
          type="button"
          onClick={() =>
            onLanguageChange(currentLang === 'fa' ? 'en' : currentLang === 'en' ? 'id' : 'fa')
          }
          aria-label={t('language', currentLang)}
          className="sm:hidden min-h-[40px] px-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>{currentLang === 'fa' ? 'فا' : currentLang.toUpperCase()}</span>
        </button>

        {/* Full desktop/tablet language switcher */}
        <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1 text-xs">
          <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 mx-1.5 shrink-0" />
          <button
            type="button"
            onClick={() => onLanguageChange('fa')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
              currentLang === 'fa'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            فارسی
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
              currentLang === 'en'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('id')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
              currentLang === 'id'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            ID
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenCopilot}
          aria-label={t('aiCopilot', currentLang)}
          className="min-h-[40px] flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">{t('aiCopilot', currentLang)}</span>
        </button>
      </div>
    </header>
  );
};
