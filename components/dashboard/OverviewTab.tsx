'use client';
import React from 'react';
import { FileQuestion, Users, GraduationCap, Clock, Loader2, LayoutDashboard } from 'lucide-react';
import { toFarsiNumber } from '@/utils/text.util';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOverviewTab } from '@/hooks/useOverviewTab';

export function OverviewTab({ initialExams, onNavigate }: { initialExams: any[], onNavigate: (tab: string, param?: string) => void }) {
  const { stats, chartData, loading } = useOverviewTab(initialExams);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
          <LayoutDashboard className="w-7 h-7 text-primary" />
          نمای کلی سیستم
        </h2>
        <p className="text-slate-500 font-medium mt-1">خلاصه وضعیت و مشارکت کاربران در آزمون‌ها</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="کل آزمون‌ها" value={toFarsiNumber(initialExams?.length || 0)} subtitle="آزمون‌های ساخته شده" icon={<FileQuestion />} />
        <StatCard title="شرکت‌کنندگان" value={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : toFarsiNumber(stats.totalParticipants)} subtitle="تا این لحظه" icon={<Users />} />
        <StatCard title="میانگین نمرات" value={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${toFarsiNumber(stats.avgScore)}٪`} subtitle="از ۱۰۰" icon={<GraduationCap />} />
        <StatCard title="زمان میانگین" value={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : toFarsiNumber(stats.avgTime) + ' دقیقه'} subtitle="برای هر آزمون" icon={<Clock />} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
           <h3 className="text-xl font-bold mb-1">مشارکت اخیر</h3>
           <p className="text-slate-500 text-sm mb-6">نمودار شرکت‌کنندگان در طول هفته گذشته.</p>
           <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-4" dir="ltr">
             {loading ? (
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
             ) : chartData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                   <defs>
                     <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} allowDecimals={false} />
                   <Tooltip 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                     labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px', textAlign: 'right' }}
                   />
                   <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                 </AreaChart>
               </ResponsiveContainer>
             ) : (
                <p className="text-slate-400 text-sm font-medium">داده‌ای یافت نشد</p>
             )}
           </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
           <h3 className="text-xl font-bold mb-1">آخرین آزمون‌ها</h3>
           <p className="text-slate-500 text-sm mb-6">آزمون‌های تازه ساخته شده</p>
           <div className="space-y-4">
             {initialExams?.slice(0, 4).map((exam, i) => (
                <div key={i} onClick={() => onNavigate('exams', exam.title)} className="flex items-center group cursor-pointer p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-xl ml-4 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <FileQuestion className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{exam.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{exam.is_published ? 'منتشر شده' : 'پیشنویس'}</p>
                  </div>
                </div>
             ))}
             {(!initialExams || initialExams.length === 0) && <p className="text-center text-sm text-slate-500 mt-10">آزمونی یافت نشد.</p>}
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
      <div className="text-3xl font-black text-slate-800 dark:text-white mb-1 flex items-center">{value}</div>
      <div className="text-emerald-500 text-sm font-semibold">{subtitle}</div>
    </div>
  );
}
