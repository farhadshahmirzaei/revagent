import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  BookOpen,
  CheckCircle2,
  Circle,
  Send,
  RefreshCw,
  User,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { AgentMode, CatalogKey, ChatMessage, Language, OnboardingStep } from '../types';
import { t } from '../translations';

interface AIAgentViewProps {
  currentLang: Language;
  onboardingSteps: OnboardingStep[];
  onToggleStep: (stepId: string) => void;
  onOpenCatalog: (key: CatalogKey) => void;
}

export const AIAgentView: React.FC<AIAgentViewProps> = ({
  currentLang,
  onboardingSteps,
  onToggleStep,
  onOpenCatalog,
}) => {
  const [mode, setMode] = useState<AgentMode>('simulator');
  const [businessName, setBusinessName] = useState(
    currentLang === 'fa' ? 'فروشگاه زنجیره‌ای نوسانتارا' : 'Nusantara Retail Group'
  );
  const [channels, setChannels] = useState('WhatsApp · Instagram');
  const [handoffPolicy, setHandoffPolicy] = useState(
    currentLang === 'fa'
      ? 'تخفیف بالای ۱۵ درصد یا درخواست مرجوعی به مدیر انسانی ارجاع شود'
      : currentLang === 'id'
      ? 'Diskon di atas 15% atau keluhan pengembalian dana dialihkan ke manajer manusia'
      : 'Escalate custom discounts above 15% or refund disputes to a human manager'
  );
  const [profileSaved, setProfileSaved] = useState(false);

  const getInitialGreeting = (lang: Language, activeMode: AgentMode): string => {
    if (activeMode === 'simulator') {
      if (lang === 'fa') {
        return 'سلام! من کارشناس فروش دیجیتال شما در واتساپ و اینستاگرام هستم. می‌توانید نقش یک مشتری واقعی را بازی کنید و درباره قیمت، موجودی یا شرایط ارسال بپرسید تا عملکرد من را ببینید.';
      }
      if (lang === 'id') {
        return 'Halo! Saya agen penjualan digital Anda untuk WhatsApp dan Instagram. Silakan ajukan pertanyaan layaknya pembeli asli tentang harga, stok, atau pengiriman untuk menguji respons saya.';
      }
      return 'Hello! I am your digital sales representative for WhatsApp and Instagram. Message me as a prospective buyer asking about pricing, delivery, or objections to test my live responses.';
    }
    if (lang === 'fa') {
      return 'سلام! در حالت مشاور کسب‌وکار آماده هستم تا متن معرفی محصول، سوالات کشف نیاز و قوانین پاسخگویی واتساپ و اینستاگرام شما را دقیق‌تر تنظیم کنیم.';
    }
    if (lang === 'id') {
      return 'Halo! Dalam mode konsultan bisnis, saya siap membantu menyusun skrip penjualan, pertanyaan kualifikasi, dan aturan eskalasi WhatsApp serta Instagram Anda.';
    }
    return 'Hello! In Owner Advisor mode, I can help you refine qualification questions, objection-handling scripts, and human handoff rules for WhatsApp and Instagram.';
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      content: getInitialGreeting(currentLang, mode),
      timestamp: '',
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: `init-${currentLang}-${mode}`,
        role: 'model',
        content: getInitialGreeting(currentLang, mode),
        timestamp: '',
      },
    ]);
    setErrorMsg(null);
  }, [currentLang, mode]);

  useEffect(() => {
    setBusinessName(
      currentLang === 'fa' ? 'فروشگاه زنجیره‌ای نوسانتارا' : 'Nusantara Retail Group'
    );
    setHandoffPolicy(
      currentLang === 'fa'
        ? 'تخفیف بالای ۱۵ درصد یا درخواست مرجوعی به مدیر انسانی ارجاع شود'
        : currentLang === 'id'
        ? 'Diskon di atas 15% atau keluhan pengembalian dana dialihkan ke manajer manusia'
        : 'Escalate custom discounts above 15% or refund disputes to a human manager'
    );
  }, [currentLang]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isStreaming) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantId = `model-${Date.now() + 1}`;
    const placeholderMsg: ChatMessage = {
      id: assistantId,
      role: 'model',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const historyPayload = messages
      .filter((m) => m.content.trim().length > 0)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg, placeholderMsg]);
    setInput('');
    setIsStreaming(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          language: currentLang,
          mode,
          businessProfile: {
            businessName,
            channels,
            handoffPolicy,
          },
          history: historyPayload,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Streaming is not supported in this browser.');
      }

      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payloadStr = line.slice(6).trim();
          if (!payloadStr) continue;
          try {
            const parsed = JSON.parse(payloadStr);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.chunk) {
              accumulated += parsed.chunk;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m))
              );
            }
          } catch (e: any) {
            if (e.message && !e.message.includes('JSON')) {
              throw e;
            }
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Connection failed');
      setMessages((prev) => prev.filter((m) => m.id !== assistantId || m.content.length > 0));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const quickPrompts =
    mode === 'simulator'
      ? currentLang === 'fa'
        ? [
            'سلام، قیمت این بسته چقدر است و چطور سفارش بدهم؟',
            'قیمت کمی بالاست، امکان تخفیف دارید؟',
            'می‌خواهم ۲۰ درصد تخفیف ویژه برای خرید شرکتی بگیرم.',
          ]
        : currentLang === 'id'
        ? [
            'Halo, berapa harga paket ini dan bagaimana cara pesannya?',
            'Harganya terasa agak tinggi, apakah ada promo?',
            'Saya butuh diskon khusus 20% untuk pembelian korporat.',
          ]
        : [
            'Hi, how much is this package and how do I place an order?',
            'The price seems a bit high, can you offer a discount?',
            'I need a custom 20% corporate discount and invoice.',
          ]
      : currentLang === 'fa'
      ? [
          'یک سناریوی خوشامدگویی و کشف نیاز در واتساپ بنویس.',
          'چگونه به اعتراض گران بودن قیمت محترمانه پاسخ دهیم؟',
          'چطور موارد حساس را به مدیر انسانی ارجاع دهیم؟',
        ]
      : currentLang === 'id'
      ? [
          'Buatkan skrip sapaan dan gali kebutuhan di WhatsApp.',
          'Bagaimana cara menangani keberatan harga dengan sopan?',
          'Kapan agen sebaiknya mengalihkan chat ke staf manusia?',
        ]
      : [
          'Write a WhatsApp greeting and need-discovery script.',
          'How should the agent handle price objections politely?',
          'When should the agent escalate a buyer to a human?',
        ];

  const completedCount = onboardingSteps.filter((s) => s.completed).length;

  return (
    <div className="space-y-6 animate-panel">
      {/* Header + Contextual Guide Catalog Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('agentWorkspaceTitle', currentLang)}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t('agentWorkspaceSubtitle', currentLang)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenCatalog('ai-agent')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:border-indigo-500 transition-colors whitespace-nowrap shrink-0"
        >
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>{t('openCatalog', currentLang)}</span>
        </button>
      </div>

      {/* Main Split: Setup & Guardrails vs Live Streaming Agent */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: 4-Step Activation + Business Rules */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {t('onboardingTitle', currentLang)}
              </h3>
              <span className="font-mono-num text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {completedCount}/{onboardingSteps.length}
              </span>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {onboardingSteps.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => onToggleStep(step.id)}
                  className="w-full py-3 first:pt-1 last:pb-1 flex items-start gap-3 text-start hover:opacity-90 transition-opacity"
                >
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {step.title}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.description}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500 pt-0.5">
                      {step.channelHint} · {step.completed ? t('stepCompleted', currentLang) : t('stepPending', currentLang)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setProfileSaved(true);
              setTimeout(() => setProfileSaved(false), 3000);
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {t('agentBizNameLabel', currentLang)}
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {t('agentChannelsLabel', currentLang)}
              </label>
              <input
                type="text"
                value={channels}
                onChange={(e) => setChannels(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {t('agentHandoffLabel', currentLang)}
              </label>
              <textarea
                rows={2}
                value={handoffPolicy}
                onChange={(e) => setHandoffPolicy(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {profileSaved && (
              <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                {t('agentProfileSaved', currentLang)}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white transition-colors"
            >
              {t('agentSaveProfile', currentLang)}
            </button>
          </form>
        </div>

        {/* Right Column: Smooth Streaming Sales Agent Console */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col min-h-[460px] sm:min-h-[580px] max-h-[75vh] sm:max-h-[720px] overflow-hidden">
          {/* Console Toolbar */}
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {t('chatHeaderTitle', currentLang)}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('chatHeaderSubtitle', currentLang)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setMessages([
                  {
                    id: `reset-${Date.now()}`,
                    role: 'model',
                    content: getInitialGreeting(currentLang, mode),
                    timestamp: '',
                  },
                ]);
                setErrorMsg(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('chatClear', currentLang)}</span>
            </button>
          </div>

          {/* Mode Selector Tabs */}
          <div className="px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setMode('simulator')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                mode === 'simulator'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {t('agentModeSimulator', currentLang)}
            </button>
            <button
              type="button"
              onClick={() => setMode('advisor')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                mode === 'advisor'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {t('agentModeAdvisor', currentLang)}
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isUser
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {msg.content || (isStreaming ? t('chatThinking', currentLang) : '')}
                    </div>
                  </div>
                </div>
              );
            })}

            {errorMsg && (
              <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl p-3 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMsg(null)}
                  className="font-semibold underline shrink-0"
                >
                  {t('chatErrorRetry', currentLang)}
                </button>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick Scenario Buttons */}
          <div className="px-5 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
            {quickPrompts.map((promptText, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isStreaming}
                onClick={() => sendMessage(promptText)}
                className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('askAnything', currentLang)}
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              aria-label={t('send', currentLang)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-colors flex items-center gap-2 text-sm font-semibold whitespace-nowrap shrink-0"
            >
              {isStreaming ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{t('send', currentLang)}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
