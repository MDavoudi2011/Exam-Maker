'use client';

import React, { useState } from 'react';
import { Save, Plus, ArrowRight, Trash, BrainCircuit, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export function ExamEditor({ exam, initialQuestions, user }: any) {
  const [questions, setQuestions] = useState<any[]>(initialQuestions);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // For adding a new question inline
  const [newQ, setNewQ] = useState({ content: '', option1: '', option2: '', option3: '', option4: '', correctIndex: 0 });

  const handleAddQuestion = async () => {
    if (!newQ.content || !newQ.option1 || !newQ.option2) return alert('صورت سوال و حداقل دو گزینه الزامی است');
    setLoading(true);

    try {
      const options = [newQ.option1, newQ.option2, newQ.option3, newQ.option4].filter(Boolean);
      const { data: qData, error: qErr } = await supabase.from('questions').insert({
        content: newQ.content,
        options: options,
        correct_option_index: newQ.correctIndex,
        point_value: 10
      }).select().single();

      if (qErr) throw qErr;

      const newOrder = questions.length;
      const { data: eqData, error: eqErr } = await supabase.from('exam_questions').insert({
        exam_id: exam.id,
        question_id: qData.id,
        order_index: newOrder
      }).select().single();

      if (eqErr) throw eqErr;

      setQuestions([...questions, { ...eqData, questions: qData }]);
      setNewQ({ content: '', option1: '', option2: '', option3: '', option4: '', correctIndex: 0 });

    } catch (err: any) {
      alert(err.message || 'خطایی رخ داد.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQ = async (eq_id: string, q_id: string) => {
    if (!confirm('سوال حذف شود؟')) return;
    setLoading(true);
    try {
      // Deleting question might cascade if setup, otherwise delete eq then q
      await supabase.from('exam_questions').delete().eq('id', eq_id);
      await supabase.from('questions').delete().eq('id', q_id);
      setQuestions(questions.filter(q => q.id !== eq_id));
    } catch (err) {}
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col items-center py-10 px-4">
       <div className="w-full max-w-4xl space-y-8">
         <div className="flex items-center justify-between">
           <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
             <ArrowRight className="w-5 h-5" />
             بازگشت به پیشخوان
           </Link>
           <h1 className="text-2xl font-extrabold">{exam.title}</h1>
         </div>

         {/* Questions List */}
         <div className="space-y-4">
           {questions.map((q, i) => (
             <div key={q.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-start justify-between">
                <div>
                   <div className="font-bold flex gap-3 text-lg mb-4">
                     <span className="text-primary">{i+1}.</span>
                     <p>{q.questions?.content}</p>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                     {q.questions?.options?.map((opt: string, idx: number) => (
                       <div key={idx} className={`px-4 py-2 border rounded-xl text-sm font-medium ${idx === q.questions.correct_option_index ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                         {opt}
                       </div>
                     ))}
                   </div>
                </div>
                <button disabled={loading} onClick={() => handleDeleteQ(q.id, q.question_id)} className="text-slate-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                  <Trash className="w-5 h-5" />
                </button>
             </div>
           ))}
           {questions.length === 0 && <p className="text-center text-slate-500 py-10">هنوز سوالی ثبت نشده است.</p>}
         </div>

         {/* Add new */}
         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 shadow-xl shadow-slate-200/50 dark:shadow-none">
           <h3 className="font-bold text-lg mb-4">افزودن سوال جدید</h3>
           <div>
             <input type="text" placeholder="صورت سوال را بنویسید..." value={newQ.content} onChange={e => setNewQ({...newQ, content: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {['option1', 'option2', 'option3', 'option4'].map((opt, idx) => (
               <div key={idx} className="flex items-center gap-3">
                 <input type="radio" name="correctOpt" checked={newQ.correctIndex === idx} onChange={() => setNewQ({...newQ, correctIndex: idx})} className="w-5 h-5 text-primary" />
                 <input type="text" placeholder={`گزینه ${idx+1}`} value={(newQ as any)[opt]} onChange={e => setNewQ({...newQ, [opt]: e.target.value})} className={`w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ${newQ.correctIndex === idx ? 'ring-primary' : 'ring-slate-200 dark:ring-slate-700'} rounded-xl px-4 py-2.5 text-sm outline-none`} />
               </div>
             ))}
           </div>
           
           <div className="flex justify-end pt-4">
             <button disabled={loading} onClick={handleAddQuestion} className="bg-primary hover:bg-primary/90 disabled:opacity-70 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2">
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
               ثبت سوال
             </button>
           </div>
         </div>
       </div>
    </div>
  );
}
