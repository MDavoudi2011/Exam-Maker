'use client';

import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Loader2, BrainCircuit } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toFarsiNumber } from '@/lib/utils';
import Link from 'next/link';

export function ExamViewer({ exam, questions, user }: any) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async () => {
    if (!user) return alert('برای ثبت باید وارد حساب شوید.');
    if (Object.keys(answers).length !== questions.length) {
      if (!confirm('شما به همه سوالات پاسخ نداده‌اید، مطمئنید می‌خواهید ثبت کنید؟')) return;
    }
    
    setLoading(true);
    let calculatedScore = 0;
    
    for (const q of questions) {
       if (answers[q.id] === q.questions.correct_option_index) {
         calculatedScore += q.questions.point_value || 10;
       }
    }
    setScore(calculatedScore);

    try {
      // Register attempt
      const { data: attempt, error: aErr } = await supabase.from('test_attempts').insert({
        exam_id: exam.id,
        user_id: user.id,
        score: calculatedScore,
        status: 'completed',
        completed_at: new Date().toISOString()
      }).select().single();

      if (aErr) throw aErr;

      // Register answers
      const answersToInsert = Object.entries(answers).map(([eq_id, selected]) => ({
        attempt_id: attempt.id,
        exam_question_id: eq_id,
        selected_option_index: selected
      }));

      if (answersToInsert.length > 0) {
        await supabase.from('test_answers').insert(answersToInsert);
      }

      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || 'خطایی در ثبت آزمون رخ داد.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-20 px-4 font-sans text-slate-800 dark:text-slate-200" dir="rtl">
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-10 text-center shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-500">
          <div className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold mb-2">آزمون با موفقیت ثبت شد</h1>
          <p className="text-slate-500 font-medium mb-8">شما به صفحه نتایج منتقل می‌شوید</p>
          <div className="text-5xl font-black text-primary mb-8">{toFarsiNumber(score)} <span className="text-lg text-slate-400 font-bold ml-1">امتیاز</span></div>
          {user ? (
            <Link href="/dashboard" className="px-8 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors font-bold w-full inline-block">بازگشت به پیشخوان</Link>
          ) : (
            <button onClick={() => window.close()} className="px-8 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 rounded-xl font-bold w-full">بستن صفحه</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col items-center py-10 px-4" dir="rtl">
      <div className="w-full max-w-3xl space-y-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
           <h1 className="text-3xl font-extrabold mb-4">{exam.title}</h1>
           <p className="text-slate-500">{exam.description || 'بدون توضیحات'}</p>
        </div>

        <div className="space-y-6">
          {questions.map((q: any, i: number) => (
            <div key={q.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
              <div className="font-bold flex gap-3 text-lg mb-6 leading-relaxed">
                 <span className="text-primary">{toFarsiNumber(i+1)}.</span>
                 <p>{q.questions.content}</p>
              </div>
              <div className="space-y-3">
                 {q.questions.options.map((opt: string, idx: number) => (
                   <label key={idx} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${answers[q.id] === idx ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                     <input type="radio" name={`question_${q.id}`} value={idx} checked={answers[q.id] === idx} onChange={() => setAnswers({...answers, [q.id]: idx})} className="w-5 h-5 text-primary focus:ring-primary outline-none" />
                     <span className="font-medium text-slate-700 dark:text-slate-200">{toFarsiNumber(opt)}</span>
                   </label>
                 ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <button disabled={loading} onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-4 rounded-2xl flex items-center gap-3 shadow-lg shadow-primary/30 transition-all disabled:opacity-70 hover:-translate-y-1">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'پایان آزمون و ثبت پاسخ‌ها'}
          </button>
        </div>
      </div>
    </div>
  );
}
