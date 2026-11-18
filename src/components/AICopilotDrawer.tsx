import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, RefreshCw, AlertCircle, BookOpen } from 'lucide-react';
import { AgentMode, CatalogKey, ChatMessage, Language } from '../types';
import { t } from '../translations';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onOpenCatalog: (key: CatalogKey) => void;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  currentLang,
  onOpenCatalog,
}) => {
  const [mode, setMode] = useState<AgentMode>('advisor');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getGreeting = (lang: Language, m: AgentMode) => {
    if (m === 'simulator') {
      if (lang === 'fa') return 'سلام! این آزمایش زنده واتساپ و اینستاگرام است. مثل یک خریدار واقعی سوال بپرسید.';
      if (lang === 'id') return 'Halo! Ini simulasi langsung WhatsApp & Instagram. Silakan ajukan pertanyaan layaknya pembeli asli.';
      return 'Hello! Live WhatsApp & Instagram buyer simulator ready. Ask a question like a real buyer.';
    }
    if (lang === 'fa') return 'سلام! من کارشناس فروش دیجیتال روواگنت هستم. چطور می‌توانم در تنظیم فروش واتساپ، پیگیری سرنخ‌ها یا پیش‌بینی درآمد کمکتان کنم؟';
    if (lang === 'id') return 'Halo! Saya asisten penjualan digital RevAgent. Bagaimana saya dapat membantu penjualan WhatsApp, prospek, atau proyeksi Anda?';
    return 'Hello! I am your RevAgent Digital Sales Assistant. How can I help with WhatsApp workflows, lead scoring, or revenue planning?';
  };

  useEffect(() => {
    setMessages([
      {
        id: `drawer-init-${currentLang}-${mode}`,
        role: 'model',
        content: getGreeting(currentLang, mode),
        timestamp: '',
      },
    ]);
    setErrorMsg(null);
  }, [currentLang, mode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isStreaming) return;
    setErrorMsg(null);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const modelId = `m-${Date.now() + 1}`;
    const placeholder: ChatMessage = {
      id: modelId,
      role: 'model',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const historyPayload = messages
      .filter((m) => m.content.trim().length > 0)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg, placeholder]);
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
          history: historyPayload,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Streaming unavailable');

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
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.chunk) {
              accumulated += parsed.chunk;
              setMessages((prev) =>
                prev.map((m) => (m.id === modelId ? { ...m, content: accumulated } : m))
              );
            }
          } catch (e: any) {
            if (e.message && !e.message.includes('JSON')) throw e;
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error');
      setMessages((prev) => prev.filter((m) => m.id !== modelId || m.content.length > 0));
    } finally {
      setIsStreaming(false);
    }
  };

  const quickPresets =
    currentLang === 'fa'
      ? [
          'مراحل راه‌اندازی ایجنت واتساپ چیست؟',
          'چگونه اعتراض مشتری درباره قیمت را پاسخ دهم؟',
          'یک پیام پیگیری محترمانه برای اینستاگرام بنویس.',
        ]
      : currentLang === 'id'
      ? [
          'Apa langkah mengaktifkan agen WhatsApp?',
          'Bagaimana menanggapi keberatan harga pelanggan?',
          'Buatkan pesan tindak lanjut sopan di Instagram.',
        ]
      : [
          'What are the steps to activate my WhatsApp agent?',
          'How do I respond to buyer price objections?',
          'Write a polite Instagram DM follow-up message.',
        ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end" onClick={onClose}>
      <div
        className="animate-panel w-full max-w-lg bg-white dark:bg-slate-900 border-s border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 lg:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
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

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onOpenCatalog('ai-agent')}
              title={t('openCatalog', currentLang)}
              className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('closeCatalog', currentLang)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('advisor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              mode === 'advisor'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('agentModeAdvisor', currentLang)}
          </button>
          <button
            type="button"
            onClick={() => setMode('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              mode === 'simulator'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('agentModeSimulator', currentLang)}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
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
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl p-3 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Presets */}
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex gap-2 overflow-x-auto">
          {quickPresets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isStreaming}
              onClick={() => sendMessage(p)}
              className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
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
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-colors shrink-0"
          >
            {isStreaming ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};
