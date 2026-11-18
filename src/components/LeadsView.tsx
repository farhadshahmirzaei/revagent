import React, { useState, useEffect } from 'react';
import { Users, Sparkles, Mail, Phone, BookOpen, RefreshCw } from 'lucide-react';
import { CatalogKey, Lead, Language } from '../types';
import { t } from '../translations';

interface LeadsViewProps {
  leads: Lead[];
  onAddLead: (lead: Lead) => void;
  currentLang: Language;
  onOpenCatalog: (key: CatalogKey) => void;
  focusedItemId: string | null;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  onAddLead,
  currentLang,
  onOpenCatalog,
  focusedItemId,
}) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] || null);
  const [generatingOutreach, setGeneratingOutreach] = useState(false);
  const [outreachDraft, setOutreachDraft] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newValue, setNewValue] = useState('25000');

  useEffect(() => {
    if (focusedItemId) {
      const match = leads.find((l) => l.id === focusedItemId);
      if (match) {
        setSelectedLead(match);
        setOutreachDraft('');
      }
    } else if (leads.length > 0 && (!selectedLead || !leads.some((l) => l.id === selectedLead.id))) {
      setSelectedLead(leads[0]);
      setOutreachDraft('');
    }
  }, [focusedItemId, leads]);

  const formatCurrency = (val: number) => {
    const locale = currentLang === 'fa' ? 'fa-IR' : currentLang === 'id' ? 'id-ID' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleGenerateAIOutreach = async (lead: Lead) => {
    setSelectedLead(lead);
    setGeneratingOutreach(true);
    setOutreachDraft('');
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'outreach',
          data: { lead, channel: lead.source },
          language: currentLang,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      setOutreachDraft(data.result || '');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error generating outreach');
    } finally {
      setGeneratingOutreach(false);
    }
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCompany.trim()) return;

    const lead: Lead = {
      id: `lead-${Date.now()}`,
      name: newName.trim(),
      company: newCompany.trim(),
      email: newEmail.trim() || 'buyer@business.co.id',
      phone: newPhone.trim() || '+62 811 0000 000',
      value: parseFloat(newValue) || 20000,
      status: 'New',
      fitScore: 86,
      intent: 'High',
      source: 'WhatsApp',
      lastContact: t('statusActive', currentLang),
      notes: t('leadsSubtitle', currentLang),
    };

    onAddLead(lead);
    setSelectedLead(lead);
    setShowAddModal(false);
    setNewName('');
    setNewCompany('');
    setNewEmail('');
    setNewPhone('');
  };

  return (
    <div className="space-y-6 animate-panel">
      {/* Header + Guide Catalog Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('leads', currentLang)}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t('leadsSubtitle', currentLang)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onOpenCatalog('leads')}
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
            <Users className="w-4 h-4 shrink-0" />
            <span>{t('qualifyNewLead', currentLang)}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Queue */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {t('inboundQueueTitle', currentLang)}
          </h3>

          <div className="space-y-3">
            {leads.map((lead) => {
              const isSelected = selectedLead?.id === lead.id;
              return (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => handleGenerateAIOutreach(lead)}
                  className={`w-full text-start border rounded-xl p-4 transition-colors space-y-3 ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-500'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {lead.name} · <span className="font-medium text-slate-600 dark:text-slate-400">{lead.company}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {lead.notes}
                      </p>
                    </div>

                    <div className="text-end shrink-0">
                      <div className="font-mono-num text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(lead.value)}
                      </div>
                      <div className="font-mono-num text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                        {lead.fitScore}% {t('fitScoreLabel', currentLang)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2.5 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> {lead.email}
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono-num">
                        <Phone className="w-3.5 h-3.5" /> {lead.phone}
                      </span>
                    </div>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      {t('clickForOutreach', currentLang)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Outreach Composer */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>{t('outreachPanelTitle', currentLang)}</span>
              </h3>
            </div>

            {selectedLead ? (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs space-y-1.5">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {t('leadSummaryTitle', currentLang)}: {selectedLead.name}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    {t('sourceLabel', currentLang)}: {selectedLead.source}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    {t('intentLabel', currentLang)}: {selectedLead.intent}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed min-h-[210px] max-h-[300px] overflow-y-auto">
                  {generatingOutreach ? (
                    <div className="flex items-center justify-center h-40 gap-2 text-slate-500">
                      <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                      <span>{t('outreachLoading', currentLang)}</span>
                    </div>
                  ) : errorMsg ? (
                    <span className="text-rose-600 dark:text-rose-400">{errorMsg}</span>
                  ) : (
                    outreachDraft || t('outreachEmpty', currentLang)
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-sm">
                {t('outreachEmpty', currentLang)}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => selectedLead && handleGenerateAIOutreach(selectedLead)}
            disabled={!selectedLead || generatingOutreach}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors"
          >
            {t('regenerateOutreach', currentLang)}
          </button>
        </div>
      </div>

      {/* Add Lead Modal */}
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
              {t('qualifyNewLead', currentLang)}
            </h3>
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t('leadNameLabel', currentLang)}
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t('leadCompanyLabel', currentLang)}
                </label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t('leadEmailLabel', currentLang)}
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t('leadPhoneLabel', currentLang)}
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-mono-num"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t('leadValueLabel', currentLang)}
                </label>
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-mono-num"
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
