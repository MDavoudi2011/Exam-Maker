'use client';
import React, { useState, useEffect } from 'react';
import { FileQuestion, Users, GraduationCap, Clock, Play, Edit, Trash, Plus, CheckCircle2, ChevronLeft, Loader2, Search } from 'lucide-react';
import { toFarsiNumber } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export function OverviewTab({ initialExams }: { initialExams: any[] }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">نمای کلی سیستم</h1>
        <p className="text-slate-500 font-medium">خلاصه‌ای از وضعیت سیستم و آزمون‌های شما.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="کل آزمون‌ها" value={toFarsiNumber(initialExams.length || 0)} subtitle="آزمون‌های ساخته شده" icon={<FileQuestion />} />
        <StatCard title="شرکت‌کنندگان" value={toFarsiNumber(124)} subtitle="تا این لحظه" icon={<Users />} />
        <StatCard title="میانگین نمرات" value={toFarsiNumber(76) + '%'} subtitle="رشد ۲ درصدی" icon={<GraduationCap />} />
        <StatCard title="زمان میانگین" value={toFarsiNumber(14) + ' دقیقه'} subtitle="برای هر آزمون" icon={<Clock />} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
           <h3 className="text-xl font-bold mb-1">مشارکت اخیر</h3>
           <p className="text-slate-500 text-sm mb-6">نمودار شرکت‌کنندگان در طول هفته گذشته.</p>
           <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
             <p className="text-slate-400 text-sm font-medium">داده‌های نمودار به زودی</p>
           </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
           <h3 className="text-xl font-bold mb-1">آخرین آزمون‌ها</h3>
           <p className="text-slate-500 text-sm mb-6">آزمون‌های تازه ساخته شده</p>
           <div className="space-y-4">
             {initialExams.slice(0, 4).map((exam, i) => (
                <div key={i} className="flex items-center group cursor-pointer p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-xl ml-4 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <FileQuestion className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{exam.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{exam.is_published ? 'منتشر شده' : 'پیشنویس'}</p>
                  </div>
                </div>
             ))}
             {initialExams.length === 0 && <p className="text-center text-sm text-slate-500 mt-10">آزمونی یافت نشد.</p>}
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-500 font-medium">{title}</h3>
        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
          {React.cloneElement(icon, { className: 'w-5 h-5' })}
        </div>
      </div>
      <div className="text-3xl font-black text-slate-800 dark:text-white mb-1">{value}</div>
      <div className="text-emerald-500 text-sm font-semibold">{subtitle}</div>
    </div>
  );
}
