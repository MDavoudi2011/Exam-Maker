'use client';
import React, { useState, useEffect } from 'react';
import { Download, Users, AlertCircle, BarChart, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toFarsiNumber } from '@/lib/utils';

export function ReportsTab() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchResults() {
      // In a real app we'd fetch actual test results
      // Here we fetch mock-like data that matches schema or just empty for now
      try {
        const { data, error } = await supabase.from('test_attempts').select('*, exams(title), users:user_id(email)').limit(10);
        if (data) {
          setResults(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [supabase]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">گزارش‌ها و نتایج</h1>
          <p className="text-slate-500 font-medium">لیست آخرین شرکت‌کنندگان و نمرات ثبت شده در سیستم.</p>
        </div>
        <button className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold px-6 py-3.5 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all">
          <Download className="w-5 h-5" />
          خروجی اکسل (CSV)
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start gap-4 bg-slate-50/50 dark:bg-slate-800/20">
             <div className="bg-indigo-500/10 p-3 rounded-2xl text-indigo-500 mt-1">
               <BarChart className="w-6 h-6" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-800 dark:text-white">شرکت‌کنندگان اخیر</h2>
               <p className="text-sm text-slate-500 mt-1">جزئیات و نمرات دانشجویانی که اخیراً آزمون داده‌اند.</p>
             </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm">
                <th className="p-4 font-semibold">ایمیل شرکت‌کننده</th>
                <th className="p-4 font-semibold">آزمون</th>
                <th className="p-4 font-semibold">نمره</th>
                <th className="p-4 font-semibold">شروع</th>
                <th className="p-4 font-semibold">پایان (ارسال)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {results.length > 0 ? results.map((res: any, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">{res.users?.email || res.user_id}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">{res.exams?.title || 'آزمون نامشخص'}</td>
                  <td className="p-4">
                    <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-bold">
                      {res.score !== null ? toFarsiNumber(res.score) : '-'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">{res.started_at ? toFarsiNumber(new Date(res.started_at).toLocaleString('fa-IR')) : '-'}</td>
                  <td className="p-4 text-slate-500 text-sm">{res.completed_at ? toFarsiNumber(new Date(res.completed_at).toLocaleString('fa-IR')) : 'در حال انجام...'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    {loading ? (
                      <div className="flex justify-center items-center py-10">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                      </div>
                    ) : (
                       <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 m-4">
                          <Users className="w-12 h-12 text-slate-300 mb-4" />
                          <p className="font-medium">هنوز هیچ آزمونی توسط کاربران انجام نشده است.</p>
                        </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
