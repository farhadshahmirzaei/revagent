import React, { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { CatalogKey, Deal, Language } from '../types';
import { t } from '../translations';

interface PipelineViewProps {
  deals: Deal[];
  onUpdateDealStage: (dealId: string, newStage: Deal['stage']) => void;
  onAddDeal: (newDeal: Deal) => void;
  currentLang: Language;
  onOpenCatalog: (key: CatalogKey) => void;
  focusedItemId: string | null;
}

export const PipelineView: React.FC<PipelineViewProps> = ({
  deals,
  onUpdateDealStage,
  onAddDeal,
  currentLang,
  onOpenCatalog,
  focusedItemId,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newAmount, setNewAmount] = useState('25000');
  const [newOwner, setNewOwner] = useState(t('ownerName', currentLang));

  const stages: { id: Deal['stage']; labelKey: string }[] = [
    { id: 'lead', labelKey: 'stageLead' },
    { id: 'qualification', labelKey: 'stageQual' },
    { id: 'proposal', labelKey: 'stageProp' },
    { id: 'negotiation', labelKey: 'stageNegot' },
    { id: 'closed_won', labelKey: 'stageWon' },
    { id: 'closed_lost', labelKey: 'stageLost' },
  ];

  const formatCurrency = (val: number) => {
    const locale = currentLang === 'fa' ? 'fa-IR' : currentLang === 'id' ? 'id-ID' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newClient.trim()) return;

    const deal: Deal = {
      id: `deal-${Date.now()}`,
      title: newTitle.trim(),
      client: newClient.trim(),
      amount: parseFloat(newAmount) || 10000,
      stage: 'lead',
      probability: 40,
      expectedClose: currentLang === 'fa' ? '۱۴۰۵/۱۰/۳۰' : '2027-01-20',
      owner: newOwner.trim() || t('ownerName', currentLang),
      healthScore: 80,
      aiNotes: t('pipelineSubtitle', currentLang),
    };

    onAddDeal(deal);
    setNewTitle('');
    setNewClient('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-panel">
      {/* Header + Contextual Guide Catalog Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('pipeline', currentLang)}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t('pipelineSubtitle', currentLang)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onOpenCatalog('pipeline')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:border-indigo-500 transition-colors whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>{t('openCatalog', currentLang)}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>{t('addNewDeal', currentLang)}</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.id);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.amount, 0);

          return (
            <div
              key={stage.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col min-w-[240px]"
            >
              <div className="flex items-center justify-between gap-2 pb-2.5 mb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  {t(stage.labelKey, currentLang)}
                </span>
                <span className="font-mono-num text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {stageDeals.length}
                </span>
              </div>

              <div className="font-mono-num text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
                {formatCurrency(stageTotal)}
              </div>

              <div className="space-y-3 flex-1">
                {stageDeals.map((deal) => {
                  const isFocused = focusedItemId === deal.id;
                  return (
                    <div
                      key={deal.id}
                      className={`border rounded-xl p-3.5 transition-colors space-y-2.5 ${
                        isFocused
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500'
                          : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white leading-snug">
                          {deal.title}
                        </h4>
                        <span className="font-mono-num text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                          {deal.healthScore}%
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {deal.client}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-mono-num font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(deal.amount)}
                        </span>
                        <span className="font-mono-num text-slate-500 dark:text-slate-400">
                          {deal.probability}% {t('winChanceSuffix', currentLang)}
                        </span>
                      </div>

                      <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                        <select
                          value={deal.stage}
                          aria-label={deal.title}
                          onChange={(e) => onUpdateDealStage(deal.id, e.target.value as Deal['stage'])}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 py-1 px-2 focus:outline-none focus:border-indigo-500 max-w-[130px]"
                        >
                          {stages.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {t(opt.labelKey, currentLang)}
                            </option>
                          ))}
                        </select>
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {deal.owner}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {stageDeals.length === 0 && (
                  <div className="h-28 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400 px-3 text-center">
                    {t('emptyStage', currentLang)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Deal Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="animate-panel bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {t('addNewDeal', currentLang)}
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t('dealTitleLabel', currentLang)}
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t('dealClientLabel', currentLang)}
                </label>
                <input
                  type="text"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t('dealAmountLabel', currentLang)}
                </label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-mono-num"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t('dealOwnerLabel', currentLang)}
                </label>
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {t('cancel', currentLang)}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  {t('save', currentLang)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
