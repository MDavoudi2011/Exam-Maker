'use client';
import React, { useState, useEffect } from 'react';
import { Download, Users, BarChart, Loader2, FileQuestion, ChevronDown, Eye, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toFarsiNumber } from '@/lib/utils';
import { ExamViewer } from './ExamViewer';

export function ReportsTab({ initialExams, initialSelectedExamId }: { initialExams?: any[], initialSelectedExamId?: string | null }) {
  const [selectedExamId, setSelectedExamId] = useState<string>(initialSelectedExamId || '');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewingAttempt, setViewingAttempt] = useState<any>(null);
  const [examData, setExamData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchResults() {
      if (!selectedExamId) {
        setResults([]);
        setExamData(null);
        return;
      }
      
      setLoading(true);
      try {
        const { data: examDataObj } = await supabase.from('exams').select('*').eq('id', selectedExamId).single();
        setExamData(examDataObj);

        // Fetch questions for detailed view later
        const { data: qData } = await supabase.from('exam_questions').select('id, order_index, questions(*)').eq('exam_id', selectedExamId).order('order_index');
        if (qData) setQuestions(qData);

        const { data, error } = await supabase.from('test_attempts')
          .select('id, full_name, class_name, school, district, score, created_at, completed_at, status')
          .eq('exam_id', selectedExamId)
          .order('completed_at', { ascending: false });
          
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
  }, [selectedExamId, supabase]);

  const requiredFields = examData?.settings?.studentDetails || {};
  const showFullName = requiredFields.fullName;
  const showClassName = requiredFields.className;
  const showSchool = requiredFields.school;
  const showDistrict = requiredFields.district;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">گزارش‌ها و نتایج</h1>
        </div>
        <div className="w-full md:w-96">
          <div className="relative">
            <select 
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl px-5 py-3.5 font-bold text-sm outline-none transition-all cursor-pointer shadow-sm"
            >
              <option value="" disabled>یک آزمون را انتخاب کنید...</option>
              {initialExams?.map(exam => (
                <option key={exam.id} value={exam.id}>{exam.title}</option>
              ))}
            </select>
            <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm border-b border-slate-100 dark:border-slate-800">
                {showFullName && <th className="p-5 font-semibold">نام و نام خانوادگی</th>}
                {showClassName && <th className="p-5 font-semibold">کلاس</th>}
                {showSchool && <th className="p-5 font-semibold">مدرسه</th>}
                {showDistrict && <th className="p-5 font-semibold">ناحیه/منطقه</th>}
                <th className="p-5 font-semibold text-center w-24">نمره</th>
                <th className="p-5 font-semibold text-center w-40">شروع</th>
                <th className="p-5 font-semibold text-center w-40">پایان (ارسال)</th>
                <th className="p-5 font-semibold text-center w-32">ریز نتایج</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                   <td colSpan={10} className="p-16 text-center">
                     <div className="flex justify-center items-center">
                       <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                     </div>
                   </td>
                </tr>
              ) : selectedExamId ? (
                results.length > 0 ? results.map((res: any) => {
                  return (
                  <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    {showFullName && <td className="p-5 font-bold text-slate-800 dark:text-slate-200">{res.full_name || '-'}</td>}
                    {showClassName && <td className="p-5 font-medium text-slate-600 dark:text-slate-400">{res.class_name || '-'}</td>}
                    {showSchool && <td className="p-5 font-medium text-slate-600 dark:text-slate-400">{res.school || '-'}</td>}
                    {showDistrict && <td className="p-5 font-medium text-slate-600 dark:text-slate-400">{res.district || '-'}</td>}
                    <td className="p-5 text-center">
                      {res.status === 'completed' ? (
                      <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 px-3 py-1.5 rounded-xl text-sm font-black border border-indigo-200 dark:border-indigo-500/30 w-16 inline-block">
                        {res.score !== null ? toFarsiNumber(res.score) : '-'}
                      </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-bold">در حال انجام</span>
                      )}
                    </td>
                    <td className="p-5 text-slate-500 text-xs text-center" dir="ltr">{res.created_at ? toFarsiNumber(new Date(res.created_at).toLocaleString('fa-IR', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' })) : '-'}</td>
                    <td className="p-5 text-slate-500 text-xs text-center" dir="ltr">{res.completed_at ? toFarsiNumber(new Date(res.completed_at).toLocaleString('fa-IR', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' })) : '-'}</td>
                    <td className="p-5">
                      <div className="flex items-center justify-center">
                        <button onClick={() => setViewingAttempt(res)} className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-600 dark:text-slate-300 rounded-xl transition-all shadow-sm" disabled={res.status !== 'completed'}>
                          <Eye className={`w-5 h-5 ${res.status !== 'completed' ? 'opacity-30' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}) : (
                  <tr>
                    <td colSpan={10} className="p-16 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center p-8 m-4">
                        <Users className="w-16 h-16 text-slate-200 dark:text-slate-700 mb-4" />
                        <p className="font-bold text-lg text-slate-400 dark:text-slate-500">هنوز شرکت‌کننده‌ای یافت نشد.</p>
                      </div>
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={10} className="p-16 text-center text-slate-500">
                     <div className="flex flex-col items-center justify-center p-8 m-4">
                        <FileQuestion className="w-16 h-16 text-slate-200 dark:text-slate-700 mb-4" />
                        <p className="font-bold text-lg text-slate-400 dark:text-slate-500">لطفاً برای مشاهده نتایج یک آزمون را انتخاب کنید.</p>
                      </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewingAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingAttempt(null)}></div>
          <div className="relative w-full max-w-5xl h-full max-h-screen bg-slate-50 dark:bg-slate-950 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md z-10">
              <h3 className="font-bold">ریز نتایج: {viewingAttempt.full_name || 'کاربر بدون نام'}</h3>
              <button onClick={() => setViewingAttempt(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto w-full relative">
               <ExamViewer exam={examData} questions={questions} user={null} adminViewAttemptId={viewingAttempt.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
