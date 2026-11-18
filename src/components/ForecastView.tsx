import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { RevenueStats, Language } from '../types';
import { t } from '../translations';

interface ForecastViewProps {
  stats: RevenueStats;
  currentLang: Language;
}

export const ForecastView: React.FC<ForecastViewProps> = ({ stats, currentLang }) => {
  const [scenario, setScenario] = useState<'conservative' | 'expected' | 'aggressive'>('expected');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [forecastInsights, setForecastInsights] = useState(t('forecastDefaultText', currentLang));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setForecastInsights(t('forecastDefaultText', currentLang));
    setErrorMsg(null);
  }, [currentLang]);

  const formatCurrency = (val: number) => {
    const locale = currentLang === 'fa' ? 'fa-IR' : currentLang === 'id' ? 'id-ID' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleRunAiForecast = async () => {
    setAiAnalyzing(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'deal_forecast',
          data: { scenario, currentStats: stats },
          language: currentLang,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      if (data.result) {
        setForecastInsights(data.result);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error running forecast');
    } finally {
      setAiAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-panel">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('forecast', currentLang)}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t('forecastSubtitle', currentLang)}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunAiForecast}
          disabled={aiAnalyzing}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap shrink-0"
        >
          {aiAnalyzing ? (
            <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 shrink-0" />
          )}
          <span>{aiAnalyzing ? t('analyzingLabel', currentLang) : t('runAiForecast', currentLang)}</span>
        </button>
      </div>

      {/* Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setScenario('conservative')}
          className={`border rounded-2xl p-5 text-start transition-colors ${
            scenario === 'conservative'
              ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-500'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
          }`}
        >
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            {t('scenarioConservative', currentLang)}
          </div>
          <div className="font-mono-num text-2xl font-bold text-slate-900 dark:text-white mb-1.5">
            {formatCurrency(Math.round(stats.arr * 1.05))}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {t('scenarioConservativeDesc', currentLang)}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setScenario('expected')}
          className={`border rounded-2xl p-5 text-start transition-colors ${
            scenario === 'expected'
              ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-500'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
          }`}
        >
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            {t('scenarioExpected', currentLang)}
          </div>
          <div className="font-mono-num text-2xl font-bold text-slate-900 dark:text-white mb-1.5">
            {formatCurrency(Math.round(stats.arr * 1.18))}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {t('scenarioExpectedDesc', currentLang)}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setScenario('aggressive')}
          className={`border rounded-2xl p-5 text-start transition-colors ${
            scenario === 'aggressive'
              ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-500'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
          }`}
        >
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            {t('scenarioAggressive', currentLang)}
          </div>
          <div className="font-mono-num text-2xl font-bold text-slate-900 dark:text-white mb-1.5">
            {formatCurrency(Math.round(stats.arr * 1.35))}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {t('scenarioAggressiveDesc', currentLang)}
          </div>
        </button>
      </div>

      {/* Analysis Output */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            {t('forecastBoxTitle', currentLang)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('forecastBoxSubtitle', currentLang)}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
          {aiAnalyzing ? (
            <div className="flex items-center justify-center py-10 gap-2.5 text-slate-500">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
              <span>{t('analyzingLabel', currentLang)}</span>
            </div>
          ) : errorMsg ? (
            <span className="text-rose-600 dark:text-rose-400">{errorMsg}</span>
          ) : (
            forecastInsights
          )}
        </div>
      </div>
    </div>
  );
};
