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
      <div className="w-full max-w-4xl bg-card dark:bg-background rounded-3xl md:rounded-[2rem] p-6 md:p-12 text-center shadow-2xl shadow-black/5 border border-success/30">
        <div className="bg-success/10 text-success w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner">
          <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12" />
        </div>
        <h1 className="text-xl md:text-3xl font-extrabold mb-3 md:mb-4 text-foreground">{title}</h1>
        <p className="text-sm md:text-base text-muted-foreground font-medium mb-8 md:mb-10 leading-relaxed">{subtitle}</p>
 
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8 md:mb-10 bg-muted/50 p-2 rounded-2xl border border-border dark:border-border">
          <div className="flex-1 px-3 md:px-4 py-3 text-left dir-ltr text-xs md:text-sm font-bold text-foreground dark:text-muted-foreground overflow-x-auto whitespace-nowrap w-full">
            {publishUrl}
          </div>
          <button 
            onClick={copyLink}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl text-sm md:text-base font-bold flex items-center justify-center gap-2 transition-all shrink-0 ${copied ? 'bg-success text-success-foreground shadow-md shadow-success/20' : 'bg-card text-foreground border border-border dark:border-border hover:bg-muted shadow-sm'}`}
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'کپی شد' : 'کپی لینک'}
          </button>
        </div>

        <button onClick={onCreated} className="w-full sm:w-auto bg-card hover:bg-muted/50 dark:bg-background border border-border dark:border-border text-foreground dark:text-muted-foreground h-12 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all mx-auto">
          <ArrowRight className="w-4 h-4" />
          بازگشت به پیشخوان
        </button>
      </div>
    </div>
  );
}
