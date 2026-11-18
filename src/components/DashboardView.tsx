import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Award,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Power,
  AlertTriangle,
} from 'lucide-react';
import {
  RevenueStats,
  Deal,
  Language,
  OnboardingStep,
  SubscriptionInfo,
  ActiveTab,
  CatalogKey,
} from '../types';
import { t } from '../translations';

interface DashboardViewProps {
  stats: RevenueStats;
  deals: Deal[];
  currentLang: Language;
  subscription: SubscriptionInfo;
  onboardingSteps: OnboardingStep[];
  onToggleStep: (stepId: string) => void;
  onNavigate: (tab: ActiveTab) => void;
  onOpenCopilot: () => void;
  onOpenCatalog: (key: CatalogKey) => void;
}

type Timeframe = 'today' | '7d' | '30d';
type DealFilter = 'all' | 'active' | 'won';
type FeedFilter = 'all' | 'handoff';

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  deals,
  currentLang,
  subscription,
  onboardingSteps,
  onToggleStep,
  onNavigate,
  onOpenCopilot,
  onOpenCatalog,
}) => {
  const [agentOnline, setAgentOnline] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [instagramEnabled, setInstagramEnabled] = useState(true);
  const [timeframe, setTimeframe] = useState<Timeframe>('30d');
  const [dealFilter, setDealFilter] = useState<DealFilter>('all');
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('all');

  const locale = currentLang === 'fa' ? 'fa-IR' : currentLang === 'id' ? 'id-ID' : 'en-US';

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  const formatNumber = (val: number) => new Intl.NumberFormat(locale).format(val);

  const completedSteps = onboardingSteps.filter((s) => s.completed).length;
  const stepProgressPct = Math.round((completedSteps / onboardingSteps.length) * 100);
  const DirectionalArrow = currentLang === 'fa' ? ChevronLeft : ChevronRight;

  // Quota circular progress math
  const quotaMax = 5000;
  const quotaPct = Math.min(100, Math.round((subscription.conversationsUsed / quotaMax) * 100));
  const ringRadius = 24;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = ringCircumference - (quotaPct / 100) * ringCircumference;

  // Timeframe dynamic metrics
  const timeframeData: Record<
    Timeframe,
    {
      revenue: number;
      growth: number;
      winRate: number;
      inquiries: number;
      qualified: number;
      orders: number;
      waShare: number;
      igShare: number;
      activeChats: number;
    }
  > = {
    today: {
      revenue: Math.round(stats.mrr * 0.08),
      growth: 6.4,
      winRate: 41.2,
      inquiries: 64,
      qualified: 29,
      orders: 12,
      waShare: 64,
      igShare: 36,
      activeChats: 14,
    },
    '7d': {
      revenue: Math.round(stats.mrr * 0.34),
      growth: 11.8,
      winRate: 39.5,
      inquiries: 412,
      qualified: 186,
      orders: 74,
      waShare: 61,
      igShare: 39,
      activeChats: 27,
    },
    '30d': {
      revenue: stats.mrr,
      growth: stats.mrrGrowth,
      winRate: stats.winRate,
      inquiries: 1840,
      qualified: 845,
      orders: 326,
      waShare: 58,
      igShare: 42,
      activeChats: 38,
    },
  };

  const currentMetrics = timeframeData[timeframe];

  // Filtered Deals
  const filteredDeals = deals.filter((deal) => {
    if (dealFilter === 'won') return deal.stage === 'closed_won';
    if (dealFilter === 'active') return deal.stage !== 'closed_won' && deal.stage !== 'closed_lost';
    return true;
  });

  // Live Agent Activity Feed (purely localized)
  const activityFeed =
    currentLang === 'fa'
      ? [
          {
            id: 'act-1',
            channel: 'واتساپ',
            buyer: 'فروشگاه زنجیره‌ای نوسانتارا',
            summary: 'سؤال درباره موجودی و قیمت عمده پاسخ داده شد و نیاز خرید ثبت گردید.',
            time: '۴ دقیقه پیش',
            isHandoff: false,
          },
          {
            id: 'act-2',
            channel: 'اینستاگرام',
            buyer: 'بوتیک آنلاین کیانا',
            summary: 'درخواست تخفیف بالای ۲۰٪ مطرح شد؛ گفتگو به مدیر انسانی ارجاع گردید.',
            time: '۱۸ دقیقه پیش',
            isHandoff: true,
          },
          {
            id: 'act-3',
            channel: 'واتساپ',
            buyer: 'کلینیک زیبایی پاندان',
            summary: 'اعتراض مشتری درباره زمان ارسال برطرف شد و به مرحله پیش‌فاکتور رفت.',
            time: '۴۲ دقیقه پیش',
            isHandoff: false,
          },
        ]
      : currentLang === 'id'
      ? [
          {
            id: 'act-1',
            channel: 'WhatsApp',
            buyer: 'Nusantara Retail Group',
            summary: 'Pertanyaan stok dan harga grosir dijawab; kebutuhan pembelian telah tercatat.',
            time: '4 mnt lalu',
            isHandoff: false,
          },
          {
            id: 'act-2',
            channel: 'Instagram',
            buyer: 'Butik Online Kiana',
            summary: 'Pembeli meminta diskon di atas 20%; percakapan dialihkan ke manajer manusia.',
            time: '18 mnt lalu',
            isHandoff: true,
          },
          {
            id: 'act-3',
            channel: 'WhatsApp',
            buyer: 'Klinik Kecantikan Pandan',
            summary: 'Keberatan jadwal pengiriman diselesaikan dan lanjut ke tahap penawaran.',
            time: '42 mnt lalu',
            isHandoff: false,
          },
        ]
      : [
          {
            id: 'act-1',
            channel: 'WhatsApp',
            buyer: 'Nusantara Retail Group',
            summary: 'Answered bulk pricing inquiry and logged verified budget & timeline.',
            time: '4m ago',
            isHandoff: false,
          },
          {
            id: 'act-2',
            channel: 'Instagram',
            buyer: 'Kiana Fashion Studio',
            summary: 'Buyer requested a 20%+ custom discount; conversation escalated to human lead.',
            time: '18m ago',
            isHandoff: true,
          },
          {
            id: 'act-3',
            channel: 'WhatsApp',
            buyer: 'Pandan Aesthetic Clinics',
            summary: 'Resolved delivery timeline concern and advanced deal to proposal stage.',
            time: '42m ago',
            isHandoff: false,
          },
        ];

  const visibleFeed =
    feedFilter === 'handoff' ? activityFeed.filter((item) => item.isHandoff) : activityFeed;

  return (
    <div className="space-y-6 animate-panel">
      {/* 1. Interactive Digital Sales Agent Status & Business Owner Control Card */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 lg:p-7 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {t('subscriptionBadge', currentLang)}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
              {t('heroTitle', currentLang)}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('heroSubtitle', currentLang)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onOpenCatalog('ai-agent')}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>{t('openCatalog', currentLang)}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('ai-agent')}
              className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors whitespace-nowrap shrink-0"
            >
              <Bot className="w-4 h-4 shrink-0" />
              <span>{t('startActivation', currentLang)}</span>
            </button>
          </div>
        </div>

        {/* Interactive Agent Status Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-5 border-t border-slate-200 dark:border-slate-800">
          {/* Interactive Agent On/Off Control */}
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                {t('agentStatusCardTitle', currentLang)}
              </div>
              <div
                className={`text-sm font-bold truncate ${
                  agentOnline
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {agentOnline ? t('agentStatusOnline', currentLang) : t('agentStatusPaused', currentLang)}
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={agentOnline}
              aria-label={t('agentStatusCardTitle', currentLang)}
              onClick={() => setAgentOnline((prev) => !prev)}
              className={`min-h-[44px] min-w-[44px] px-3 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                agentOnline
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Power className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Channel Toggles */}
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-2">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {t('connectedChannels', currentLang)}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWhatsappEnabled((p) => !p)}
                className={`flex-1 min-h-[36px] px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap ${
                  whatsappEnabled
                    ? 'bg-white dark:bg-slate-900 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                    : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setInstagramEnabled((p) => !p)}
                className={`flex-1 min-h-[36px] px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap ${
                  instagramEnabled
                    ? 'bg-white dark:bg-slate-900 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                Instagram
              </button>
            </div>
          </div>

          {/* Live Response Speed & Active Chats */}
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                {t('agentAvgReply', currentLang)}
              </div>
              <div className="font-mono-num text-lg font-bold text-slate-900 dark:text-white">
                {t('agentAvgReplyVal', currentLang)}
              </div>
            </div>
            <div className="text-end">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                {t('agentActiveChats', currentLang)}
              </div>
              <div className="font-mono-num text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {formatNumber(agentOnline ? currentMetrics.activeChats : 0)}
              </div>
            </div>
          </div>

          {/* Quota Ring Widget */}
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                {t('agentQuotaUsed', currentLang)}
              </div>
              <div className="font-mono-num text-sm font-bold text-slate-900 dark:text-white">
                {formatNumber(subscription.conversationsUsed)} / {formatNumber(quotaMax)}
              </div>
              <div className="font-mono-num text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {subscription.renewalDate}
              </div>
            </div>
            <svg width="58" height="58" viewBox="0 0 60 60" className="shrink-0">
              <circle
                cx="30"
                cy="30"
                r={ringRadius}
                fill="none"
                strokeWidth="5"
                className="stroke-slate-200 dark:stroke-slate-800"
              />
              <circle
                cx="30"
                cy="30"
                r={ringRadius}
                fill="none"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringDashOffset}
                transform="rotate(-90 30 30)"
                className="stroke-indigo-600 dark:stroke-indigo-400 transition-all duration-300"
              />
              <text
                x="30"
                y="34"
                textAnchor="middle"
                className="fill-slate-900 dark:fill-slate-100 text-[11px] font-bold font-mono-num"
              >
                {quotaPct}%
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* 2. Interactive Sales Performance Summary & Channel Funnel */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 lg:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              {t('salesSummaryTitle', currentLang)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('channelSplitTitle', currentLang)}
            </p>
          </div>

          {/* Interactive Timeframe Filter */}
          <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl self-start sm:self-auto">
            {(
              [
                { id: 'today', label: t('timeframeToday', currentLang) },
                { id: '7d', label: t('timeframeWeek', currentLang) },
                { id: '30d', label: t('timeframeMonth', currentLang) },
              ] as { id: Timeframe; label: string }[]
            ).map((tf) => (
              <button
                key={tf.id}
                type="button"
                onClick={() => setTimeframe(tf.id)}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  timeframe === tf.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {t('totalMRR', currentLang)}
              </span>
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-1">
              <span className="font-mono-num text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(currentMetrics.revenue)}
              </span>
              <span className="font-mono-num text-xs font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />+{currentMetrics.growth}%
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {t('annualARR', currentLang)}
              </span>
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-1">
              <span className="font-mono-num text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(stats.arr)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t('runRateLabel', currentLang)}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {t('winRate', currentLang)}
              </span>
              <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-1">
              <span className="font-mono-num text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                {currentMetrics.winRate}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t('optimalLabel', currentLang)}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {t('pipelineValue', currentLang)}
              </span>
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-1">
              <span className="font-mono-num text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(stats.pipelineValue)}
              </span>
              <span className="font-mono-num text-xs text-slate-500 dark:text-slate-400">
                {formatNumber(deals.length)} {t('activeDealsCount', currentLang)}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Funnel & Channel Breakdown Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3 text-center sm:text-start">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t('funnelInquiries', currentLang)}
                </div>
                <div className="font-mono-num text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {formatNumber(currentMetrics.inquiries)}
                </div>
                <div className="h-2 bg-indigo-600 rounded-full mt-2 w-full" />
              </div>

              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t('funnelQualified', currentLang)}
                </div>
                <div className="font-mono-num text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {formatNumber(currentMetrics.qualified)}
                </div>
                <div
                  className="h-2 bg-indigo-500 rounded-full mt-2 transition-all duration-300"
                  style={{ width: `${Math.round((currentMetrics.qualified / currentMetrics.inquiries) * 100)}%` }}
                />
              </div>

              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t('funnelOrders', currentLang)}
                </div>
                <div className="font-mono-num text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {formatNumber(currentMetrics.orders)}
                </div>
                <div
                  className="h-2 bg-emerald-600 rounded-full mt-2 transition-all duration-300"
                  style={{ width: `${Math.round((currentMetrics.orders / currentMetrics.inquiries) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-center space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-emerald-700 dark:text-emerald-400">
                {t('whatsappLabel', currentLang)} · <span className="font-mono-num">{currentMetrics.waShare}%</span>
              </span>
              <span className="text-indigo-600 dark:text-indigo-400">
                {t('instagramLabel', currentLang)} · <span className="font-mono-num">{currentMetrics.igShare}%</span>
              </span>
            </div>
            <div className="h-3 w-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 flex">
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${currentMetrics.waShare}%` }}
              />
              <div
                className="bg-indigo-600 h-full transition-all duration-300"
                style={{ width: `${currentMetrics.igShare}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Compact 4-Step Activation Checklist */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 lg:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              {t('onboardingTitle', currentLang)}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {t('onboardingSubtitle', currentLang)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono-num text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {formatNumber(completedSteps)} / {formatNumber(onboardingSteps.length)}
            </span>
            <button
              type="button"
              onClick={onOpenCopilot}
              className="min-h-[36px] text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap shrink-0"
            >
              {t('testAgentLive', currentLang)}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${stepProgressPct}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {onboardingSteps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => onToggleStep(step.id)}
              className={`min-h-[44px] border rounded-xl p-4 text-start flex flex-col justify-between gap-2.5 transition-colors ${
                step.completed
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                  : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-num text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {formatNumber(step.stepNumber)} · {step.channelHint}
                  </span>
                  {step.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {step.description}
                </p>
              </div>
              <div
                className={`text-xs font-semibold ${
                  step.completed ? 'text-emerald-700 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'
                }`}
              >
                {step.completed ? t('stepCompleted', currentLang) : t('stepPending', currentLang)}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Framed Bottom Grid: Recent Orders (with filter + mobile touch cards) & Live Agent Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders & Deals Frame */}
        <section className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 lg:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              {t('recentDeals', currentLang)}
            </h3>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
                {(
                  [
                    { id: 'all', label: t('filterAll', currentLang) },
                    { id: 'active', label: t('filterActive', currentLang) },
                    { id: 'won', label: t('filterWon', currentLang) },
                  ] as { id: DealFilter; label: string }[]
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setDealFilter(f.id)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
                      dealFilter === f.id
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onNavigate('pipeline')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <span>{t('viewPipeline', currentLang)}</span>
                <DirectionalArrow className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Dense Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <th className="pb-3 px-2 text-start">{t('client', currentLang)}</th>
                  <th className="pb-3 px-2 text-start">{t('amount', currentLang)}</th>
                  <th className="pb-3 px-2 text-start">{t('probability', currentLang)}</th>
                  <th className="pb-3 px-2 text-end">{t('actions', currentLang)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {filteredDeals.slice(0, 4).map((deal) => (
                  <tr
                    key={deal.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {deal.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{deal.client}</div>
                    </td>
                    <td className="py-3 px-2 font-mono-num font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(deal.amount)}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-14 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                        <span className="font-mono-num text-xs text-slate-700 dark:text-slate-300">
                          {deal.probability}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-end">
                      <button
                        type="button"
                        onClick={() => onNavigate('pipeline')}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap"
                      >
                        {t('details', currentLang)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Touch List Rows */}
          <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-800">
            {filteredDeals.slice(0, 4).map((deal) => (
              <button
                key={deal.id}
                type="button"
                onClick={() => onNavigate('pipeline')}
                className="w-full py-3.5 flex items-center justify-between gap-3 text-start min-h-[56px]"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {deal.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {deal.client} · <span className="font-mono-num">{deal.probability}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono-num text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(deal.amount)}
                  </span>
                  <DirectionalArrow className="w-4 h-4 text-slate-400" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Live Agent Activity & Handoff Feed Frame */}
        <section className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 lg:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {t('agentFeedTitle', currentLang)}
              </h3>
              <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setFeedFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
                    feedFilter === 'all'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {t('agentFeedAll', currentLang)}
                </button>
                <button
                  type="button"
                  onClick={() => setFeedFilter('handoff')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
                    feedFilter === 'handoff'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {t('agentFeedHandoff', currentLang)}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {visibleFeed.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      {item.isHandoff ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      ) : (
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      )}
                      <span>{item.buyer}</span>
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {item.channel} · {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('ai-agent')}
            className="min-h-[44px] w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
          >
            {t('agentFeedOpenSim', currentLang)}
          </button>
        </section>
      </div>
    </div>
  );
};
