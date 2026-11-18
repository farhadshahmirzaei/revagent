import React from 'react';
import { CheckCircle2, Globe } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface RoadmapViewProps {
  currentLang: Language;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ currentLang }) => {
  const v1Features =
    currentLang === 'fa'
      ? [
          'اتصال یکپارچه به واتساپ و اینستاگرام',
          'تشخیص قصد خرید، نیاز، اولویت و بودجه',
          'پاسخگویی به اعتراضات رایج و هدایت به خرید',
          'ثبت نهایی سفارش یا رزرو و ارجاع به انسان',
        ]
      : currentLang === 'id'
      ? [
          'Integrasi langsung WhatsApp & Instagram',
          'Deteksi niat beli, kebutuhan & anggaran',
          'Penanganan keberatan umum pelanggan',
          'Konfirmasi pesanan & alih ke tim manusia',
        ]
      : [
          'WhatsApp & Instagram channel integration',
          'Intent, need, priority & budget discovery',
          'Common objection handling & guided closing',
          'Order confirmation & human escalation rules',
        ];

  const v2Features =
    currentLang === 'fa'
      ? [
          'مذاکره هوشمند متناسب با شرایط خریدار',
          'تخفیف‌های کنترل‌شده در سقف اختیارات مصوب',
          'فروش مکمل و ارتقای سبد خرید',
          'پیگیری خودکار مشتریان مردد و نیمه‌کاره',
        ]
      : currentLang === 'id'
      ? [
          'Negosiasi cerdas sesuai kondisi pembeli',
          'Penawaran diskon dalam batas wewenang resmi',
          'Penjualan pelengkap dan peningkatan paket',
          'Tindak lanjut otomatis transaksi tertunda',
        ]
      : [
          'Context-aware smart sales negotiation',
          'Policy-bounded discounts & special offers',
          'Automated cross-selling & upselling',
          'Abandoned deal & hesitant buyer recovery',
        ];

  const v3Features =
    currentLang === 'fa'
      ? [
          'پیش‌بینی احتمال خرید مشتریان بر اساس رفتار',
          'تحلیل علل موفقیت یا شکست هر معامله',
          'شناسایی مشتریان مستعد خرید مجدد',
          'پیشنهادهای داده‌محور برای افزایش سودآوری',
        ]
      : currentLang === 'id'
      ? [
          'Prediksi peluang beli dari perilaku pelanggan',
          'Analisis penyebab keberhasilan dan kegagalan',
          'Identifikasi pelanggan siap beli ulang',
          'Rekomendasi berbasis data untuk profitabilitas',
        ]
      : [
          'Predictive buyer conversion scoring',
          'Win and loss root-cause diagnostics',
          'Repeat-purchase opportunity detection',
          'Data-driven margin optimization advice',
        ];

  return (
    <div className="space-y-6 max-w-5xl animate-panel">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:p-8 space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Globe className="w-4 h-4 shrink-0" />
          <span>{t('v1Badge', currentLang)}</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('roadmapTitle', currentLang)}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          {t('roadmapSubtitle', currentLang)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Version 1 */}
        <div className="bg-white dark:bg-slate-900 border-2 border-indigo-600 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono-num text-sm font-bold text-indigo-600 dark:text-indigo-400">
                ۰۱
              </span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {t('statusPilot', currentLang)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('v1Title', currentLang)}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('v1Goal', currentLang)}
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2">
              {v1Features.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Version 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono-num text-sm font-bold text-slate-500 dark:text-slate-400">
                ۰۲
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('statusPlanned', currentLang)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('v2Title', currentLang)}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('v2Goal', currentLang)}
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2">
              {v2Features.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Version 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono-num text-sm font-bold text-slate-500 dark:text-slate-400">
                ۰۳
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('statusFuture', currentLang)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('v3Title', currentLang)}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('v3Goal', currentLang)}
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2">
              {v3Features.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
