'use client';
import React, { useState, useEffect } from 'react';
import { FileQuestion, Users, GraduationCap, Clock, Play, Edit, Trash, Plus, CheckCircle2, ChevronLeft, Loader2, Search } from 'lucide-react';
import { toFarsiNumber } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function OverviewTab({ initialExams, onNavigate }: { initialExams: any[], onNavigate: (tab: string, param?: string) => void }) {
  const [stats, setStats] = useState({
    totalParticipants: 0,
    avgScore: 0,
    avgTime: 0,
  });
  const [chartData, setChartData] = useState<{name: string, value: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      if (!initialExams || initialExams.length === 0) {
        setLoading(false);
        return;
      }
      
      const examIds = initialExams.map(e => e.id);

      try {
        const { data: attempts, error } = await supabase
          .from('test_attempts')
          .select('exam_id, score, completed_at, created_at, national_code, personnel_code')
          .in('exam_id', examIds)
          .eq('status', 'completed');

        if (attempts && attempts.length > 0) {
          const uniqueUsers = new Set();
          attempts.forEach(att => {
             const identifier = att.national_code || att.personnel_code;
             if (identifier) uniqueUsers.add(identifier);
          });
          const totalParticipants = uniqueUsers.size;
          
          let totalPercentage = 0;
          let totalSeconds = 0;
          let timeCount = 0;

          const last7Days = Array.from({length: 7}, (_, i) => {
             const d = new Date();
             d.setDate(d.getDate() - (6 - i));
             return { date: d.toISOString().split('T')[0], count: 0, name: new Intl.DateTimeFormat('fa-IR', { weekday: 'short' }).format(d) };
          });

          attempts.forEach(attempt => {
            const examInfo = initialExams.find(e => e.id === attempt.exam_id);
            const maxScore = examInfo?.exam_questions?.[0]?.count || 1;
            const percentage = ((attempt.score || 0) / maxScore) * 100;
            totalPercentage += percentage;
            
            if (attempt.created_at && attempt.completed_at) {
               const start = new Date(attempt.created_at).getTime();
               const end = new Date(attempt.completed_at).getTime();
               const diff = (end - start) / 1000;
               if (diff > 0 && diff < 3600 * 5) { // Sanity check max 5 hours
                 totalSeconds += diff;
                 timeCount++;
               }
            }

            if (attempt.completed_at) {
               const completedDate = new Date(attempt.completed_at).toISOString().split('T')[0];
               const dayObj = last7Days.find(d => d.date === completedDate);
               if (dayObj) {
                 dayObj.count += 1;
               }
            }
          });

          setStats({
            totalParticipants,
            avgScore: attempts.length > 0 ? Math.round(totalPercentage / attempts.length) : 0,
            avgTime: timeCount > 0 ? Math.round((totalSeconds / timeCount) / 60) : 0
          });

          setChartData(last7Days.map(d => ({ name: d.name, value: d.count })));
        } else {
           const last7Days = Array.from({length: 7}, (_, i) => {
             const d = new Date();
             d.setDate(d.getDate() - (6 - i));
             return { name: new Intl.DateTimeFormat('fa-IR', { weekday: 'short' }).format(d), value: 0 };
           });
           setChartData(last7Days);
        }
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [initialExams, supabase]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">نمای کلی سیستم</h1>
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
