'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, Timer, Sun, Moon, LayoutGrid, X, AlertOctagon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toFarsiNumber } from '@/lib/utils';
import Link from 'next/link';

const isFarsi = (text: string) => /[\u0600-\u06FF]/.test(text);

const renderContent = (content: string) => {
  if (!content) return null;
  const blocks = content.split(/```([\s\S]*?)```/g);
  return blocks.map((block, i) => {
    if (i % 2 === 1) {
      return (
        <pre key={i} className="block my-4 p-4 bg-slate-800 text-slate-100 font-mono text-sm text-left rounded-xl overflow-x-auto w-full dir-ltr" dir="ltr">
          <code>{block}</code>
        </pre>
      );
    }
    const inlineParts = block.split(/`([^`]+)`/g);
    return (
      <span key={i} className="whitespace-pre-wrap leading-relaxed inline">
        {inlineParts.map((part, j) => {
          if (j % 2 === 1) {
            return <code key={j} className="inline-block px-1.5 py-0.5 mx-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-sm rounded-md dir-ltr text-left" dir="ltr">{part}</code>;
          }
          return <span key={j}>{part}</span>;
        })}
      </span>
    );
  });
};

export function ExamViewer({ exam, questions, user, adminViewAttemptId }: any) {
  const [hasParticipated, setHasParticipated] = useState(!!adminViewAttemptId);
  const [currentStep, setCurrentStep] = useState<'intro' | 'question'>('intro');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(!!adminViewAttemptId);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const [loadingAttempt, setLoadingAttempt] = useState(true);

  // Intro Form details
  const [studentInfo, setStudentInfo] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const supabase = createClient();

  useEffect(() => {
    const loadAttemptData = async (attemptId: string) => {
      try {
        const { data: attempt } = await supabase.from('test_attempts').select('*').eq('id', attemptId).single();
        if (attempt) {
          const { data: dbAnswers } = await supabase.from('test_answers').select('*').eq('attempt_id', attempt.id);
          if (dbAnswers) {
            const restoredAnswers: Record<string, number> = {};
            dbAnswers.forEach((ans: any) => {
              restoredAnswers[ans.exam_question_id] = ans.selected_option_index;
            });
            setAnswers(restoredAnswers);
          }
          setScore(attempt.score || 0);
          setHasParticipated(true);
          setSubmitted(true);
        }
      } catch(err) {}
      setLoadingAttempt(false);
    };

    if (typeof window !== 'undefined') {
      setTimeout(() => setIsDarkMode(document.documentElement.classList.contains('dark')), 0);
      
      const checkPrevious = async () => {
        if (adminViewAttemptId) {
          await loadAttemptData(adminViewAttemptId);
          return;
        }

        const attemptId = localStorage.getItem('completed_exam_attempt_' + exam.id);
        const hasLocallyCompleted = localStorage.getItem('completed_exam_' + exam.id);

        try {
          if (attemptId) {
             await loadAttemptData(attemptId);
             return;
          }
        } catch (e) {
          console.error(e);
        }
        
        if (hasLocallyCompleted) {
          setHasParticipated(true);
        }
        setLoadingAttempt(false);
      };

      checkPrevious();
    }
  }, [exam.id, user, adminViewAttemptId, supabase]);

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setIsDarkMode(isDark);
  };

  const requiredFields = exam.settings?.studentDetails || {};
  const needsInfo = Object.values(requiredFields).some(Boolean);

  const examStatus = exam.settings?.status || (exam.is_published ? 'active' : 'draft');

  const startExam = () => {
    // Validate fields
    const newErrors: Record<string, string> = {};
    let hasErr = false;
    for (const [key, isRequired] of Object.entries(requiredFields)) {
      if (isRequired && !studentInfo[key]?.trim()) {
        newErrors[key] = 'لطفاً این فیلد را پر کنید';
        hasErr = true;
      }
    }
    
    if (hasErr) {
      setFormErrors(newErrors);
      return;
    }
    setFormErrors({});
    
    setCurrentStep('question');
    if (exam.time_limit_minutes) {
      setTimeLeft(exam.time_limit_minutes * 60);
    }
  };

  const handleSubmit = async (e?: any, autoSubmit = false) => {
    if (adminViewAttemptId) return;
    if (!autoSubmit && Object.keys(answers).length !== questions.length) {
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
      // Register attempt (public allowed due to our updated policies)
      const { data: attempt, error: aErr } = await supabase.from('test_attempts').insert({
        exam_id: exam.id,
        full_name: studentInfo.fullName || null,
        class_name: studentInfo.className || null,
        school: studentInfo.school || null,
        district: studentInfo.district || null,
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
      
      localStorage.setItem('completed_exam_' + exam.id, 'true');
      localStorage.setItem('completed_exam_attempt_' + exam.id, attempt.id);
      setSubmitted(true);
      setHasParticipated(true);
    } catch (err: any) {
      if (!autoSubmit) alert(err.message || 'خطایی در ثبت آزمون رخ داد.');
    } finally {
      setLoading(false);
    }
  };

  // Handle countdown
  useEffect(() => {
    if (timeLeft === null || submitted || currentStep !== 'question' || adminViewAttemptId) return;
    
    if (timeLeft <= 0) {
      setTimeout(() => void handleSubmit(null, true), 0);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev !== null ? prev - 1 : null);
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, submitted, currentStep, adminViewAttemptId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${toFarsiNumber(m.toString().padStart(2, '0'))}:${toFarsiNumber(s.toString().padStart(2, '0'))}`;
  };

  if (loadingAttempt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Handle statuses
  if (!adminViewAttemptId) {
    if (examStatus === 'draft' && !hasParticipated) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 font-sans text-slate-800 dark:text-slate-200" dir="rtl">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-10 text-center shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-500">
            <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Timer className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-extrabold mb-4">آزمون هنوز شروع نشده است</h1>
            <p className="text-slate-500 font-medium">لطفاً در زمان مقرر مراجعه کنید.</p>
          </div>
        </div>
      );
    }
    
    if (examStatus === 'completed' && !hasParticipated) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 font-sans text-slate-800 dark:text-slate-200" dir="rtl">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-10 text-center shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-500">
            <div className="bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertOctagon className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-extrabold mb-4">آزمون به پایان رسیده است</h1>
            <p className="text-slate-500 font-medium">زمان شرکت در این آزمون گذشته است.</p>
          </div>
        </div>
      );
    }
  }

  if (hasParticipated && !submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center py-20 px-4 font-sans text-slate-800 dark:text-slate-200" dir="rtl">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-10 text-center shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-500">
          <div className="bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-extrabold mb-4">آزمون شما ثبت شده است</h1>
          <p className="text-slate-500 font-medium mb-8">شما در این آزمون شرکت کرده‌اید. اما به دلیل محدودیت‌های شبکه مشخصات دقیق یافت نشد.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    let stats = { correct: 0, wrong: 0, empty: 0 };
    questions.forEach((q: any) => {
      const ans = answers[q.id];
      if (ans === undefined) stats.empty++;
      else if (ans === q.questions.correct_option_index) stats.correct++;
      else stats.wrong++;
    });
    const total = questions.length;
    const correctPct = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
    
    return (
      <div className={`${adminViewAttemptId ? 'pb-32 pt-6' : 'min-h-screen pt-10 pb-20'} bg-slate-50 dark:bg-slate-950 flex flex-col items-center px-4 font-sans text-slate-800 dark:text-slate-200`} dir="rtl">
        <div className={`w-full max-w-3xl ${adminViewAttemptId ? '' : 'bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-800'} animate-in fade-in zoom-in duration-500`}>
          
          {!adminViewAttemptId && (
            <div className="text-center mb-10">
              <div className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-extrabold mb-2">آزمون با موفقیت ثبت شد</h1>
              <p className="text-slate-500 font-medium">پاسخ‌های شما در سیستم ذخیره گردید.</p>
            </div>
          )}

          {(exam.show_results !== false || adminViewAttemptId) && (
             <div className="flex flex-col items-center border-t border-slate-100 dark:border-slate-800 pt-10">
               
               {/* Circle Chart */}
               <div className="relative w-56 h-56 mb-8">
                 <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                   <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="none" className="text-slate-100 dark:text-slate-800" />
                   {stats.correct > 0 && <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="none" strokeDasharray={`${(stats.correct/total)*251.2} 251.2`} className="text-emerald-500" />}
                   {stats.wrong > 0 && <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="none" strokeDashoffset={-((stats.correct/total)*251.2)} strokeDasharray={`${(stats.wrong/total)*251.2} 251.2`} className="text-rose-500" />}
                   {stats.empty > 0 && <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="none" strokeDashoffset={-(((stats.correct+stats.wrong)/total)*251.2)} strokeDasharray={`${(stats.empty/total)*251.2} 251.2`} className="text-slate-300 dark:text-slate-700" />}
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-full m-4">
                   <div className="text-4xl font-black text-slate-800 dark:text-white">{toFarsiNumber(correctPct)}%</div>
                   <div className="text-sm font-bold text-slate-400 mt-1">درصد صحیح</div>
                 </div>
               </div>

               <div className="grid grid-cols-3 w-full gap-4 mb-8 text-center bg-slate-50 dark:bg-slate-800/40 p-4 md:p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                 <div>
                   <div className="text-3xl font-black text-emerald-500 mb-1">{toFarsiNumber(stats.correct)}</div>
                   <div className="text-xs font-bold text-slate-500">گزینه صحیح</div>
                 </div>
                 <div>
                   <div className="text-3xl font-black text-rose-500 mb-1">{toFarsiNumber(stats.wrong)}</div>
                   <div className="text-xs font-bold text-slate-500">گزینه غلط</div>
                 </div>
                 <div>
                   <div className="text-3xl font-black text-slate-400 mb-1">{toFarsiNumber(stats.empty)}</div>
                   <div className="text-xs font-bold text-slate-500">بدون پاسخ</div>
                 </div>
               </div>
               
               {/* Answer Sheet Table */}
               <div className="w-full overflow-x-auto rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                 <table className="w-full text-sm text-center min-w-[500px]">
                   <thead>
                     <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                       <th className="py-5 px-4 font-bold text-slate-600 dark:text-slate-400 w-24">سوال</th>
                       <th className="py-5 px-4 font-bold text-slate-600 dark:text-slate-400 w-1/4">گزینه ۱</th>
                       <th className="py-5 px-4 font-bold text-slate-600 dark:text-slate-400 w-1/4">گزینه ۲</th>
                       <th className="py-5 px-4 font-bold text-slate-600 dark:text-slate-400 w-1/4">گزینه ۳</th>
                       <th className="py-5 px-4 font-bold text-slate-600 dark:text-slate-400 w-1/4">گزینه ۴</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                     {questions.map((q: any, i: number) => {
                       const userAns = answers[q.id];
                       const correctAns = q.questions.correct_option_index;
                       return (
                         <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                           <td className="py-4 px-4 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/10 border-l border-slate-100 dark:border-slate-800 text-lg">{toFarsiNumber(i + 1)}</td>
                           {[0, 1, 2, 3].map(optIdx => {
                              const isUserSel = userAns === optIdx;
                              const isCorrect = correctAns === optIdx;
                              
                              let colors = "bg-slate-100 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600";
                              if (isCorrect && isUserSel) colors = "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900";
                              else if (isCorrect && !isUserSel) colors = "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30";
                              else if (!isCorrect && isUserSel) colors = "bg-rose-500 text-white shadow-md shadow-rose-500/20 ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-slate-900";

                              return (
                                <td key={optIdx} className="py-4 px-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition-all ${colors}`}>
                                    {isUserSel && !isCorrect ? <X className="w-6 h-6 stroke-[3]" /> : (isCorrect ? <CheckCircle2 className="w-6 h-6 stroke-[3]" /> : null)}
                                  </div>
                                </td>
                              );
                           })}
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>
               </div>
             </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col items-center py-6 px-4 transition-colors duration-300 relative" dir="rtl">
      
      {/* Top Navigation / Status Bar */}
      <div className="w-full max-w-[1100px] flex items-center justify-between mb-8 z-40 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-4 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm shrink-0">
         <button onClick={toggleDarkMode} className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-colors border border-slate-200 dark:border-slate-700 shrink-0">
           {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
         </button>

         {currentStep === 'question' && (
           <div className="flex-1 max-w-md mx-4 md:mx-10 pl-4 md:pl-0">
             <div className="flex justify-between items-end mb-2 px-1">
               <span className="font-bold text-primary text-xs md:text-sm">سوال {toFarsiNumber(activeQuestionIndex + 1)} از {toFarsiNumber(questions.length)}</span>
               <span className="text-[10px] md:text-xs font-bold text-slate-500">{toFarsiNumber(Math.round(((activeQuestionIndex + 1) / questions.length) * 100))}%</span>
             </div>
             <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
               <div 
                 className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                 style={{ width: `${((activeQuestionIndex + 1) / questions.length) * 100}%` }}
               />
             </div>
           </div>
         )}
         
         <div className="flex items-center gap-4 shrink-0">
           {currentStep === 'question' && timeLeft !== null && (
             <div className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl border font-bold text-sm transition-colors duration-500 ${timeLeft <= 60 ? 'bg-rose-500 text-white border-rose-500 w-24 md:w-32 justify-center' : 'bg-white dark:bg-slate-800 text-primary border-slate-200 dark:border-slate-700 w-24 md:w-32 justify-center'}`}>
               <Timer className={`w-5 h-5 hidden md:block ${timeLeft <= 60 ? 'animate-pulse' : ''}`} />
               {formatTime(timeLeft)}
             </div>
           )}
           {currentStep === 'intro' && exam.time_limit_minutes && (
             <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold text-sm">
               <Timer className="w-5 h-5" />
               زمان: {toFarsiNumber(exam.time_limit_minutes)} دقیقه
             </div>
           )}
         </div>
      </div>

      <div className="w-full max-w-[1100px] flex flex-col min-h-0 items-start pb-10 flex-1 animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {currentStep === 'intro' ? (
          <div className="flex flex-col items-center justify-center w-full pt-10">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm mx-auto w-full max-w-[1100px]">
               <div className="text-center mb-10">
                 <h1 className="text-2xl md:text-3xl font-extrabold mb-4 text-slate-900 dark:text-white leading-tight">{exam.title}</h1>
                 {exam.description && <p className="text-slate-500 font-medium leading-relaxed max-w-lg mx-auto text-sm">{exam.description}</p>}
               </div>
               
               {needsInfo && (
                 <div className="w-full flex justify-center mb-8">
                   <div className="w-full max-w-md">
                     <h2 className="font-bold text-lg mb-6 text-slate-800 dark:text-slate-200 text-center">مشخصات فردی</h2>
                     <div className="space-y-6 w-full">
                       {requiredFields.fullName && (
                         <div className="flex flex-col gap-1.5 relative w-full group">
                           <label className={`flex flex-row items-center border ${formErrors.fullName ? 'border-rose-400 dark:border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20'} rounded-2xl px-5 focus-within:ring-2 focus-within:ring-primary/50 transition-all focus-within:border-primary/50 cursor-text`}>
                             <span className="text-sm font-bold text-slate-600 dark:text-slate-400 w-32 shrink-0 text-right pointer-events-none">نام و نام خانوادگی:</span>
                             <input type="text" value={studentInfo.fullName || ''} onChange={e => {
                               setStudentInfo({...studentInfo, fullName: e.target.value});
                               if (formErrors.fullName) setFormErrors({...formErrors, fullName: ''});
                             }} className="flex-1 w-full bg-transparent py-4 h-14 outline-none text-sm font-bold text-slate-800 dark:text-slate-200" />
                           </label>
                           {formErrors.fullName && <div className="absolute right-0 -top-10 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg before:content-[''] before:absolute before:top-full before:right-6 before:border-4 before:border-transparent before:border-t-rose-500 animate-in fade-in zoom-in duration-200">{formErrors.fullName}</div>}
                         </div>
                       )}
                       {requiredFields.className && (
                         <div className="flex flex-col gap-1.5 relative w-full group">
                           <label className={`flex flex-row items-center border ${formErrors.className ? 'border-rose-400 dark:border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20'} rounded-2xl px-5 focus-within:ring-2 focus-within:ring-primary/50 transition-all focus-within:border-primary/50 cursor-text`}>
                             <span className="text-sm font-bold text-slate-600 dark:text-slate-400 w-32 shrink-0 text-right pointer-events-none">کلاس:</span>
                             <input type="text" value={studentInfo.className || ''} onChange={e => {
                               setStudentInfo({...studentInfo, className: e.target.value});
                               if (formErrors.className) setFormErrors({...formErrors, className: ''});
                             }} className="flex-1 w-full bg-transparent py-4 h-14 outline-none text-sm font-bold text-slate-800 dark:text-slate-200" />
                           </label>
                           {formErrors.className && <div className="absolute right-0 -top-10 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg before:content-[''] before:absolute before:top-full before:right-6 before:border-4 before:border-transparent before:border-t-rose-500 animate-in fade-in zoom-in duration-200">{formErrors.className}</div>}
                         </div>
                       )}
                       {requiredFields.school && (
                         <div className="flex flex-col gap-1.5 relative w-full group">
                           <label className={`flex flex-row items-center border ${formErrors.school ? 'border-rose-400 dark:border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20'} rounded-2xl px-5 focus-within:ring-2 focus-within:ring-primary/50 transition-all focus-within:border-primary/50 cursor-text`}>
                             <span className="text-sm font-bold text-slate-600 dark:text-slate-400 w-32 shrink-0 text-right pointer-events-none">مدرسه:</span>
                             <input type="text" value={studentInfo.school || ''} onChange={e => {
                               setStudentInfo({...studentInfo, school: e.target.value});
                               if (formErrors.school) setFormErrors({...formErrors, school: ''});
                             }} className="flex-1 w-full bg-transparent py-4 h-14 outline-none text-sm font-bold text-slate-800 dark:text-slate-200" />
                           </label>
                           {formErrors.school && <div className="absolute right-0 -top-10 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg before:content-[''] before:absolute before:top-full before:right-6 before:border-4 before:border-transparent before:border-t-rose-500 animate-in fade-in zoom-in duration-200">{formErrors.school}</div>}
                         </div>
                       )}
                       {requiredFields.district && (
                         <div className="flex flex-col gap-1.5 relative w-full group">
                           <label className={`flex flex-row items-center border ${formErrors.district ? 'border-rose-400 dark:border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20'} rounded-2xl px-5 focus-within:ring-2 focus-within:ring-primary/50 transition-all focus-within:border-primary/50 cursor-text`}>
                             <span className="text-sm font-bold text-slate-600 dark:text-slate-400 w-32 shrink-0 text-right pointer-events-none">ناحیه / منطقه:</span>
                             <input type="text" value={studentInfo.district || ''} onChange={e => {
                               setStudentInfo({...studentInfo, district: e.target.value});
                               if (formErrors.district) setFormErrors({...formErrors, district: ''});
                             }} className="flex-1 w-full bg-transparent py-4 h-14 outline-none text-sm font-bold text-slate-800 dark:text-slate-200" />
                           </label>
                           {formErrors.district && <div className="absolute right-0 -top-10 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg before:content-[''] before:absolute before:top-full before:right-6 before:border-4 before:border-transparent before:border-t-rose-500 animate-in fade-in zoom-in duration-200">{formErrors.district}</div>}
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               )}
               
               <div className="mt-8 max-w-md w-full mx-auto">
                 <button onClick={startExam} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-transform active:scale-[0.98] text-lg">
                   شروع آزمون
                   <ArrowLeft className="w-5 h-5 animate-pulse" />
                 </button>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 items-stretch w-full relative">
            
            {/* Sidebar Wrapper relative to row height */}
            <div className="hidden md:block w-72 relative shrink-0">
              <div className="absolute inset-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-5 shadow-sm flex flex-col">
                <h3 className="font-bold mb-4 text-sm text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2 shrink-0">
                  <LayoutGrid className="w-4 h-4 text-primary" />
                  پاسخ‌برگ
                </h3>
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
                  {questions.map((q: any, i: number) => {
                    return (
                      <div 
                        key={q.id}
                        onClick={() => setActiveQuestionIndex(i)}
                        className={`flex items-center p-1.5 rounded-lg cursor-pointer transition-colors ${activeQuestionIndex === i ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                      >
                        <div className="w-8 flex-shrink-0 text-center font-bold text-xs text-slate-500">
                          {toFarsiNumber(i + 1)}
                        </div>
                        <div className="flex-1 flex gap-1.5 items-center justify-between ml-1">
                          {q.questions.options.map((_: any, optIdx: number) => {
                            const isSelected = answers[q.id] === optIdx;
                            return (
                              <div 
                                key={optIdx}
                                className={`w-full aspect-square rounded-md flex items-center justify-center border transition-all text-xs font-mono
                                  ${isSelected ? 'bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/20 text-emerald-500' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700'}
                                `}
                              >
                                 {isSelected && <div className="w-1.5 h-1.5 rounded-sm bg-white" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Answer Sheet (flows down) */}
            <div className="md:hidden w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-5 shadow-sm">
              <h3 className="font-bold mb-4 text-sm text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-primary" />
                پاسخ‌برگ
              </h3>
              <div className="max-h-60 overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
                {questions.map((q: any, i: number) => {
                  return (
                    <div key={q.id} onClick={() => setActiveQuestionIndex(i)} className={`flex items-center p-1.5 rounded-lg cursor-pointer transition-colors ${activeQuestionIndex === i ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                      <div className="w-8 flex-shrink-0 text-center font-bold text-xs text-slate-500">{toFarsiNumber(i + 1)}</div>
                      <div className="flex-1 flex gap-1.5 items-center justify-between ml-1">
                        {q.questions.options.map((_: any, optIdx: number) => {
                          const isSelected = answers[q.id] === optIdx;
                          return (
                            <div key={optIdx} className={`w-full aspect-square rounded-md flex items-center justify-center border transition-all ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700'}`}>
                               {isSelected && <div className="w-1.5 h-1.5 rounded-sm bg-white" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Question Card */}
            <div className="flex-1 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-sm flex flex-col relative overflow-hidden min-h-[400px]">
                
                {/* Question Content */}
                <div className="flex-1 slide-in-right">
                  <div className="font-bold text-base md:text-lg mb-8 leading-loose text-slate-800 dark:text-slate-100">
                     {renderContent(questions[activeQuestionIndex].questions.content)}
                  </div>
                  
                  <div className="space-y-3">
                     {questions[activeQuestionIndex].questions.options.map((opt: string, idx: number) => {
                       const qId = questions[activeQuestionIndex].id;
                       const isSelected = answers[qId] === idx;
                       const optIsFarsi = isFarsi(opt);
                       
                       return (
                         <label key={idx} className={`flex items-center gap-3 p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:border-slate-300 dark:hover:border-slate-700'}`}>
                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                             {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                           </div>
                           <input type="radio" className="sr-only" checked={isSelected} onChange={() => setAnswers({...answers, [qId]: idx})} />
                           <div className={`flex-1 flex font-bold text-sm md:text-base transition-colors ${isSelected ? 'text-primary' : 'text-slate-700 dark:text-slate-300'} ${optIsFarsi ? 'text-right' : 'text-left font-mono dir-ltr'}`} dir={optIsFarsi ? 'rtl' : 'ltr'}>
                             {optIsFarsi ? toFarsiNumber(opt) : opt}
                           </div>
                         </label>
                       );
                     })}
                  </div>
                </div>
                
                {/* Navigation Controls */}
                <div className="mt-8 flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800">
                   <button 
                     onClick={() => setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1))}
                     disabled={activeQuestionIndex === 0}
                     className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                   >
                     <ArrowRight className="w-4 h-4" />
                     قبلی
                   </button>

                   {activeQuestionIndex < questions.length - 1 ? (
                     <button 
                       onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                       className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-bold text-sm transition-colors"
                     >
                       بعدی
                       <ArrowLeft className="w-4 h-4" />
                     </button>
                   ) : (
                     <button 
                       disabled={loading} 
                       onClick={() => handleSubmit()} 
                       className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 shadow-sm shadow-primary/30 transition-all disabled:opacity-70 active:scale-[0.98]"
                     >
                       {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ثبت آزمون'}
                     </button>
                   )}
                </div>

              </div>

          </div>
        )}
      </div>
    </div>
  );
}
