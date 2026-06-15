'use client';
import React from 'react';
import { CheckCircle2, Copy, ArrowRight } from 'lucide-react';

export function ExamFormStep3({ 
  publishUrl, 
  copied, 
  copyLink, 
  onCreated,
  title = "آزمون با موفقیت منتشر شد!",
  subtitle = "لینک زیر را کپی کرده و برای شرکت‌کنندگان ارسال کنید."
}: { 
  publishUrl: string, 
  copied: boolean, 
  copyLink: () => void, 
  onCreated: () => void,
  title?: string,
  subtitle?: string
}) {
  return (
    <div className="flex flex-col items-center py-10 md:py-20 px-4 font-sans animate-in fade-in zoom-in duration-500 w-full">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl md:rounded-[2rem] p-6 md:p-12 text-center shadow-2xl shadow-slate-200/50 dark:shadow-none border border-emerald-100 dark:border-emerald-900/30">
        <div className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner">
          <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12" />
        </div>
        <h1 className="text-xl md:text-3xl font-extrabold mb-3 md:mb-4 text-emerald-950 dark:text-emerald-50">{title}</h1>
        <p className="text-sm md:text-base text-slate-500 font-medium mb-8 md:mb-10 leading-relaxed">{subtitle}</p>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8 md:mb-10 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex-1 px-3 md:px-4 py-3 text-left dir-ltr text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-nowrap w-full">
            {publishUrl}
          </div>
          <button 
            onClick={copyLink}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl text-sm md:text-base font-bold flex items-center justify-center gap-2 transition-all shrink-0 ${copied ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm'}`}
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'کپی شد' : 'کپی لینک'}
          </button>
        </div>

        <button onClick={onCreated} className="w-full sm:w-auto bg-white hover:bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 h-12 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all mx-auto">
          <ArrowRight className="w-4 h-4" />
          بازگشت به پیشخوان
        </button>
      </div>
    </div>
  );
}
