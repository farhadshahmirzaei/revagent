import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { AIAgentView } from './components/AIAgentView';
import { PipelineView } from './components/PipelineView';
import { LeadsView } from './components/LeadsView';
import { CampaignsView } from './components/CampaignsView';
import { ForecastView } from './components/ForecastView';
import { RoadmapView } from './components/RoadmapView';
import { SettingsView } from './components/SettingsView';
import { AICopilotDrawer } from './components/AICopilotDrawer';
import { CatalogModal } from './components/CatalogModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import {
  initialStats,
  localizedDeals,
  localizedLeads,
  localizedCampaigns,
  localizedOnboardingSteps,
  localizedSubscriptions,
} from './mockData';
import { localizedCatalogs } from './data/catalogs';
import {
  ActiveTab,
  Campaign,
  CatalogKey,
  Deal,
  Language,
  Lead,
  OnboardingStep,
  RevenueStats,
  ThemeMode,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentLang, setCurrentLang] = useState<Language>('fa');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCatalogKey, setActiveCatalogKey] = useState<CatalogKey | null>(null);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);

  const [dealsByLang, setDealsByLang] = useState<Record<Language, Deal[]>>(localizedDeals);
  const [leadsByLang, setLeadsByLang] = useState<Record<Language, Lead[]>>(localizedLeads);
  const [campaignsByLang, setCampaignsByLang] =
    useState<Record<Language, Campaign[]>>(localizedCampaigns);
  const [stepsByLang, setStepsByLang] =
    useState<Record<Language, OnboardingStep[]>>(localizedOnboardingSteps);
  const [stats, setStats] = useState<RevenueStats>(initialStats);

  // Sync HTML dir, lang, and Tailwind v4 dark class
  useEffect(() => {
    const root = document.documentElement;
    root.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
    root.lang = currentLang;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [currentLang, theme]);

  const deals = dealsByLang[currentLang];
  const leads = leadsByLang[currentLang];
  const campaigns = campaignsByLang[currentLang];
  const onboardingSteps = stepsByLang[currentLang];
  const subscription = localizedSubscriptions[currentLang];

  const handleUpdateDealStage = (dealId: string, newStage: Deal['stage']) => {
    setDealsByLang((prev) => ({
      ...prev,
      [currentLang]: prev[currentLang].map((deal) =>
        deal.id === dealId ? { ...deal, stage: newStage } : deal
      ),
    }));
  };

  const handleAddDeal = (newDeal: Deal) => {
    setDealsByLang((prev) => ({
      ...prev,
      [currentLang]: [newDeal, ...prev[currentLang]],
    }));
    setStats((prev) => ({
      ...prev,
      pipelineValue: prev.pipelineValue + newDeal.amount,
    }));
  };

  const handleAddLead = (newLead: Lead) => {
    setLeadsByLang((prev) => ({
      ...prev,
      [currentLang]: [newLead, ...prev[currentLang]],
    }));
  };

  const handleAddCampaign = (newCamp: Campaign) => {
    setCampaignsByLang((prev) => ({
      ...prev,
      [currentLang]: [newCamp, ...prev[currentLang]],
    }));
  };

  const handleToggleOnboardingStep = (stepId: string) => {
    setStepsByLang((prev) => {
      const updated = { ...prev };
      (['fa', 'en', 'id'] as Language[]).forEach((langKey) => {
        updated[langKey] = updated[langKey].map((step) =>
          step.id === stepId ? { ...step, completed: !step.completed } : step
        );
      });
      return updated;
    });
  };

  const handleNavigateSearchResult = (
    tab: ActiveTab,
    itemId?: string,
    catalogKey?: CatalogKey
  ) => {
    setActiveTab(tab);
    setFocusedItemId(itemId || null);
    if (catalogKey) {
      setActiveCatalogKey(catalogKey);
    }
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setFocusedItemId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        deals={deals}
        leads={leads}
        campaigns={campaigns}
        onNavigateResult={handleNavigateSearchResult}
        onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          currentLang={currentLang}
          subscription={subscription}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 pb-24 md:pb-8 lg:p-8 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                stats={stats}
                deals={deals}
                currentLang={currentLang}
                subscription={subscription}
                onboardingSteps={onboardingSteps}
                onToggleStep={handleToggleOnboardingStep}
                onNavigate={handleTabChange}
                onOpenCopilot={() => setIsCopilotOpen(true)}
                onOpenCatalog={(key) => setActiveCatalogKey(key)}
              />
            )}

            {activeTab === 'ai-agent' && (
              <AIAgentView
                currentLang={currentLang}
                onboardingSteps={onboardingSteps}
                onToggleStep={handleToggleOnboardingStep}
                onOpenCatalog={(key) => setActiveCatalogKey(key)}
              />
            )}

            {activeTab === 'pipeline' && (
              <PipelineView
                deals={deals}
                onUpdateDealStage={handleUpdateDealStage}
                onAddDeal={handleAddDeal}
                currentLang={currentLang}
                onOpenCatalog={(key) => setActiveCatalogKey(key)}
                focusedItemId={focusedItemId}
              />
            )}

            {activeTab === 'leads' && (
              <LeadsView
                leads={leads}
                onAddLead={handleAddLead}
                currentLang={currentLang}
                onOpenCatalog={(key) => setActiveCatalogKey(key)}
                focusedItemId={focusedItemId}
              />
            )}

            {activeTab === 'campaigns' && (
              <CampaignsView
                campaigns={campaigns}
                onAddCampaign={handleAddCampaign}
                currentLang={currentLang}
                onOpenCatalog={(key) => setActiveCatalogKey(key)}
                focusedItemId={focusedItemId}
              />
            )}

            {activeTab === 'forecast' && (
              <ForecastView stats={stats} currentLang={currentLang} />
            )}

            {activeTab === 'roadmap' && <RoadmapView currentLang={currentLang} />}

            {activeTab === 'settings' && (
              <SettingsView
                currentLang={currentLang}
                onLanguageChange={setCurrentLang}
                theme={theme}
                onThemeChange={setTheme}
              />
            )}
          </div>
        </main>
      </div>

      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenMore={() => setIsMobileNavOpen(true)}
        currentLang={currentLang}
      />

      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        currentLang={currentLang}
        onOpenCatalog={(key) => setActiveCatalogKey(key)}
      />

      <CatalogModal
        catalog={activeCatalogKey ? localizedCatalogs[currentLang][activeCatalogKey] : null}
        onClose={() => setActiveCatalogKey(null)}
        currentLang={currentLang}
      />
    </div>
  );
}
