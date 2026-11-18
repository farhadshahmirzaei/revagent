export type Language = 'fa' | 'en' | 'id';
export type ThemeMode = 'dark' | 'light';
export type AgentMode = 'advisor' | 'simulator';
export type ActiveTab = 'dashboard' | 'ai-agent' | 'pipeline' | 'leads' | 'campaigns' | 'forecast' | 'roadmap' | 'settings';
export type CatalogKey = 'ai-agent' | 'pipeline' | 'leads' | 'campaigns';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';
  fitScore: number;
  intent: 'High' | 'Medium' | 'Low';
  source: string;
  lastContact: string;
  notes: string;
}

export interface Deal {
  id: string;
  title: string;
  client: string;
  amount: number;
  stage: 'lead' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number;
  expectedClose: string;
  owner: string;
  healthScore: number;
  aiNotes: string;
}

export interface Campaign {
  id: string;
  name: string;
  channel: 'WhatsApp' | 'Instagram' | 'Email' | 'Multi-Channel';
  status: 'Active' | 'Draft' | 'Paused' | 'Completed';
  audienceCount: number;
  openRate: number;
  replyRate: number;
  conversionRate: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface RevenueStats {
  mrr: number;
  mrrGrowth: number;
  arr: number;
  winRate: number;
  avgDealSize: number;
  pipelineValue: number;
}

export interface OnboardingStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  channelHint: string;
  completed: boolean;
}

export interface SubscriptionInfo {
  planName: string;
  statusLabel: string;
  renewalDate: string;
  activeChannels: string[];
  monthlyConversationQuota: string;
  conversationsUsed: number;
}

export interface CatalogGuide {
  key: CatalogKey;
  title: string;
  subtitle: string;
  whyItMatters: string;
  steps: {
    stepNumber: string;
    title: string;
    detail: string;
  }[];
  definitions: {
    term: string;
    meaning: string;
  }[];
  realExampleTitle: string;
  realExampleText: string;
}
