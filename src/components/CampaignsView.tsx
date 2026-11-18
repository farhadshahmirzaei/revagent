import React, { useState } from 'react';
import { Megaphone, Plus, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import { Campaign, CatalogKey, Language } from '../types';
import { t } from '../translations';

interface CampaignsViewProps {
  campaigns: Campaign[];
  onAddCampaign: (campaign: Campaign) => void;
  currentLang: Language;
  onOpenCatalog: (key: CatalogKey) => void;
  focusedItemId: string | null;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  onAddCampaign,
  currentLang,
  onOpenCatalog,
  focusedItemId,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<Campaign['channel']>('WhatsApp');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name: name.trim(),
      channel,
      status: 'Active',
      audienceCount: 1250,
      openRate: 64.5,
      replyRate: 21.2,
      conversionRate: 8.4,
    };

    onAddCampaign(newCamp);
    setShowModal(false);
    setName('');
  };

  const handleOptimize = (campName: string) => {
    setToastMsg(`${campName} · ${t('campaignOptimizedMsg', currentLang)}`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const formatNum = (num: number) => {
    const locale = currentLang === 'fa' ? 'fa-IR' : currentLang === 'id' ? 'id-ID' : 'en-US';
    return new Intl.NumberFormat(locale).format(num);
  };

  return (
    <div className="space-y-6 animate-panel">
      {/* Header + Guide Catalog Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('campaigns', currentLang)}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t('campaignsSubtitle', currentLang)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onOpenCatalog('campaigns')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:border-indigo-500 transition-colors whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>{t('openCatalog', currentLang)}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>{t('createCampaign', currentLang)}</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl px-4 py-3 text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((camp) => {
          const isFocused = focusedItemId === camp.id;
          return (
            <div
              key={camp.id}
              className={`border rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-colors ${
                isFocused
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-500'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {t('statusActive', currentLang)}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                    {camp.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    {t('channelLabel', currentLang)}: {camp.channel} · {t('audienceLabel', currentLang)}: <span className="font-mono-num">{formatNum(camp.audienceCount)}</span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {t('openRate', currentLang)}
                    </div>
                    <div className="font-mono-num text-sm font-bold text-slate-900 dark:text-white">
                      {camp.openRate}%
                    </div>
                  </div>
                  <div className="border-x border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {t('replyRate', currentLang)}
                    </div>
                    <div className="font-mono-num text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {camp.replyRate}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {t('conversion', currentLang)}
                    </div>
                    <div className="font-mono-num text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {camp.conversionRate}%
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOptimize(camp.name)}
                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors inline-flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{t('optimizeCampaign', currentLang)}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Campaign Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="animate-panel bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('createCampaign', currentLang)}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  onOpenCatalog('campaigns');
                }}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t('openCatalog', currentLang)}</span>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t('campaignNameLabel', currentLang)}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t('channelLabel', currentLang)}
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as Campaign['channel'])}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Email">Email</option>
                  <option value="Multi-Channel">Multi-Channel</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
