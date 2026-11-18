import React, { useState } from 'react';
import { ShieldCheck, Globe, CheckCircle2, Moon, Sun, Cpu } from 'lucide-react';
import { Language, ThemeMode } from '../types';
import { t } from '../translations';

interface SettingsViewProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentLang,
  onLanguageChange,
  theme,
  onThemeChange,
}) => {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-panel">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('settingsTitle', currentLang)}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {t('settingsSubtitle', currentLang)}
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl p-4 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{t('successSaved', currentLang)}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Theme Mode Switch */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            {theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
            <span>{t('themeMode', currentLang)}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onThemeChange('dark')}
              className={`border rounded-xl p-4 text-start transition-colors flex items-center gap-3 ${
                theme === 'dark'
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
              }`}
            >
              <Moon className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-bold text-sm">{t('darkModeTitle', currentLang)}</div>
                <div className="text-xs opacity-80 mt-0.5">{t('darkModeDesc', currentLang)}</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onThemeChange('light')}
              className={`border rounded-xl p-4 text-start transition-colors flex items-center gap-3 ${
                theme === 'light'
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
              }`}
            >
              <Sun className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-bold text-sm">{t('lightModeTitle', currentLang)}</div>
                <div className="text-xs opacity-80 mt-0.5">{t('lightModeDesc', currentLang)}</div>
              </div>
            </button>
          </div>
        </div>

        {/* Pure Language Selector */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{t('language', currentLang)}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => onLanguageChange('fa')}
              className={`border rounded-xl p-4 text-start transition-colors ${
                currentLang === 'fa'
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
              }`}
            >
              <div className="font-bold text-sm">فارسی</div>
              <div className="text-xs opacity-80 mt-1">{t('langFaDesc', currentLang)}</div>
            </button>

            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`border rounded-xl p-4 text-start transition-colors ${
                currentLang === 'en'
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
              }`}
            >
              <div className="font-bold text-sm">English</div>
              <div className="text-xs opacity-80 mt-1">{t('langEnDesc', currentLang)}</div>
            </button>

            <button
              type="button"
              onClick={() => onLanguageChange('id')}
              className={`border rounded-xl p-4 text-start transition-colors ${
                currentLang === 'id'
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
              }`}
            >
              <div className="font-bold text-sm">Bahasa Indonesia</div>
              <div className="text-xs opacity-80 mt-1">{t('langIdDesc', currentLang)}</div>
            </button>
          </div>
        </div>

        {/* AI Service Status (Read-only, no API key input UI) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{t('apiKeyStatus', currentLang)}</span>
          </h3>

          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  {t('apiServiceLabel', currentLang)}
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  {t('apiKeyConnected', currentLang)}
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
              {t('apiStatusBadge', currentLang)}
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            {t('saveChanges', currentLang)}
          </button>
        </div>
      </form>
    </div>
  );
};
