'use client';
import React, { useState, useEffect } from 'react';
import { Search, Play, Edit, Trash, Plus, FileText, BarChart2 } from 'lucide-react';
import { toFarsiNumber } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export function ExamsTab({ initialExams, onNavigate, onDataChanged, initialSearchTerm = '' }: { initialExams: any[], onNavigate: (tab: string, param?: string) => void, onDataChanged: () => void, initialSearchTerm?: string }) {
  const [exams, setExams] = useState(initialExams);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const supabase = createClient();

  // Sync when initialExams changes from parent
  useEffect(() => {
    setTimeout(() => setExams(initialExams), 0);
  }, [initialExams]);

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این آزمون اطمینان دارید؟')) return;
    setLoading(true);
    const { error } = await supabase.from('exams').delete().eq('id', id);
    if (!error) {
      setExams(exams.filter(e => e.id !== id));
      onDataChanged();
    } else {
      alert('خطا در حذف آزمون: ' + error.message);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoading(true);
    const exam = exams.find(e => e.id === id);
    if (!exam) return;
    
    const currentSettings = exam.settings || {};
    const newSettings = { ...currentSettings, status: newStatus };
    const isPublished = newStatus === 'active';

    const { error } = await supabase.from('exams').update({ settings: newSettings, is_published: isPublished }).eq('id', id);
    
    if (!error) {
      onDataChanged(); // Let parent refresh
    } else {
      alert('خطا در تغییر وضعیت');
    }
    setLoading(false);
  };

  const getStatus = (exam: any) => {
    if (exam.settings?.status) return exam.settings.status;
    return exam.is_published ? 'active' : 'draft';
  };

  const filteredExams = exams.filter(e => (e.title || '').includes(searchTerm));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">لیست آزمون‌ها</h1>
        </div>
        <button onClick={() => onNavigate('create')} className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5">
          <Plus className="w-5 h-5" />
          ساخت آزمون جدید
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-800/20">
          <h3 className="text-lg font-bold">همه آزمون‌ها</h3>
          <div className="relative w-full sm:w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="جستجو..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border-none outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-primary rounded-xl px-10 py-2.5 text-sm transition-all shadow-sm" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm">
                <th className="p-4 font-semibold w-1/3">عنوان آزمون</th>
                <th className="p-4 font-semibold text-center w-40">وضعیت</th>
                <th className="p-4 font-semibold text-center w-20">سوالات</th>
                <th className="p-4 font-semibold text-center w-32">زمان (دقیقه)</th>
                <th className="p-4 font-semibold w-32 whitespace-nowrap">تاریخ ایجاد</th>
                <th className="p-4 font-semibold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredExams.map((exam) => {
                const status = getStatus(exam);
                return (
                 <tr key={exam.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                   <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{exam.title}</td>
                   <td className="p-4 text-center">
                     <select 
                       value={status}
                       onChange={(e) => handleStatusChange(exam.id, e.target.value)}
                       disabled={loading}
                       className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 outline-none transition-colors w-full cursor-pointer appearance-none text-center
                          ${status === 'active' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400' :
                             status === 'completed' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400' :
                             'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}
                       `}
                     >
                       <option value="draft">پیش‌نویس</option>
                       <option value="active">در حال اجرا</option>
                       <option value="completed">به اتمام رسیده</option>
                     </select>
                   </td>
                   <td className="p-4 font-medium text-slate-600 dark:text-slate-400 text-center">
                     {toFarsiNumber(exam.exam_questions?.[0]?.count || 0)}
                   </td>
                   <td className="p-4 text-center">
                     <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">
                       {toFarsiNumber(exam.time_limit_minutes || 0)}
                     </span>
                   </td>
                   <td className="p-4 text-sm text-slate-500 whitespace-nowrap">
                     {toFarsiNumber(new Date(exam.created_at).toLocaleDateString('fa-IR'))}
                   </td>
                   <td className="p-4 flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                     <button onClick={() => window.open(`/view/${exam.id}`, '_blank')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-colors" title="پیش‌نمایش">
                       <Play className="w-5 h-5" />
                     </button>
                     <button onClick={() => window.location.href = (`/edit/${exam.id}`)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-colors" title="ویرایش">
                       <Edit className="w-5 h-5" />
                     </button>
                     <button onClick={() => onNavigate('reports', exam.id)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-colors" title="مشاهده نتایج">
                       <BarChart2 className="w-5 h-5" />
                     </button>
                     <button onClick={() => handleDelete(exam.id)} disabled={loading} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-colors" title="حذف">
                       <Trash className="w-5 h-5" />
                     </button>
                   </td>
                 </tr>
                );
              })}
              {filteredExams.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 m-4">
                      {exams.length > 0 ? (
                        <>
                          <Search className="w-12 h-12 text-slate-300 mb-4" />
                          <p className="font-medium">آزمونی با این نام پیدا نشد.</p>
                        </>
                      ) : (
                        <>
                          <FileText className="w-12 h-12 text-slate-300 mb-4" />
                          <p className="font-medium">هنوز هیچ آزمونی ساخته نشده است.</p>
                          <button onClick={() => onNavigate('create')} className="mt-4 text-primary hover:underline text-sm font-bold">همین الان اولین آزمون را بسازید</button>
                        </>
                      )}
                    </div>
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

