import React, { useEffect } from 'react';
import { X, BookOpen, CheckCircle2 } from 'lucide-react';
import { CatalogGuide, Language } from '../types';
import { t } from '../translations';

interface CatalogModalProps {
  catalog: CatalogGuide | null;
  onClose: () => void;
  currentLang: Language;
}

export const CatalogModal: React.FC<CatalogModalProps> = ({
  catalog,
  onClose,
  currentLang,
}) => {
  useEffect(() => {
    if (!catalog) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [catalog, onClose]);

  if (!catalog) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="catalog-modal-title"
    >
      <div
        className="animate-panel bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 id="catalog-modal-title" className="text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug">
                {catalog.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {catalog.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('closeCatalog', currentLang)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-8">
          {/* Why It Matters */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {t('catalogWhyTitle', currentLang)}
            </h4>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {catalog.whyItMatters}
            </p>
          </section>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Step-by-Step Workflow */}
          <section className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t('catalogStepsTitle', currentLang)}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {catalog.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2"
                >
                  <div className="font-mono-num text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {step.stepNumber}
                  </div>
                  <h5 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {step.title}
                  </h5>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Key Definitions */}
          <section className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t('catalogTermsTitle', currentLang)}
            </h4>
            <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              {catalog.definitions.map((def) => (
                <div key={def.term} className="p-3.5 bg-white dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                  <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 sm:w-48 shrink-0">
                    {def.term}
                  </span>
                  <span className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {def.meaning}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Real-World Example */}
          <section className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{catalog.realExampleTitle}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {catalog.realExampleText}
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors whitespace-nowrap shrink-0"
          >
            {t('catalogGotIt', currentLang)}
          </button>
        </div>
      </div>
    </div>
  );
};
