import React from 'react';

export function Footer({ className = '' }: { className?: string }) {
  return (
    <footer className={`w-full py-4 bg-[#1E293B] dark:bg-slate-900 shrink-0 text-center text-xs md:text-sm flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3 z-10 relative ${className}`}>
      <div className="flex flex-row items-center justify-center gap-1">
        <span className="text-white/60 font-medium">تمامی حقوق برای</span>
        <span className="text-white font-bold">انجمن برنامه‌نویسی هوشیار</span>
        <span className="text-white/60 font-medium">محفوظ است</span>
      </div>
      <span className="hidden md:inline text-white/30">|</span>
      <div className="flex flex-row items-center justify-center gap-1.5">
        <span className="text-white/60 font-medium">طراحی و اجرا:</span>
        <span className="text-white font-bold">محمد داودی</span>
      </div>
    </footer>
  );
}
