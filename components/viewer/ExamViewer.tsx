'use client';

import React from 'react';
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, Timer, Sun, Moon, LayoutGrid, X, AlertOctagon } from 'lucide-react';
import { toFarsiNumber } from '@/utils/text.util';
import { isFarsi } from '@/utils/text.util';
import { formatTime } from '@/utils/time.util';
import { RenderContent } from '@/components/ui/RenderContent';
import { useExamViewer } from '@/hooks/useExamViewer';
import { ExamViewerHeader } from './ExamViewerHeader';
import { ExamViewerStudentForm } from './ExamViewerStudentForm';
import { ExamViewerAnswerSheet } from './ExamViewerAnswerSheet';

export function ExamViewer({ exam, questions, user, adminViewAttemptId }: any) {
  const {
    hasParticipated,
    currentStep,
    activeQuestionIndex,
    setActiveQuestionIndex,
    answers,
    setAnswers,
    submitted,
    loading,
    timeLeft,
    isDarkMode,
    toggleDarkMode,
    loadingAttempt,
    studentInfo,
    setStudentInfo,
    formErrors,
    setFormErrors,
    needsInfo,
    requiredFields,
    examStatus,
    startExam,
    handleSubmit
  } = useExamViewer({ exam, questions, user, adminViewAttemptId });

  if (loadingAttempt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50 dark:bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Handle statuses
  if (!adminViewAttemptId) {
    if (examStatus === 'draft' && !hasParticipated) {
      return (
        <div className="min-h-screen bg-muted/50 dark:bg-background flex flex-col items-center justify-center p-4 font-sans text-foreground " dir="rtl">
          <div className="w-full max-w-md bg-card dark:bg-background rounded-3xl p-10 text-center shadow-xl border border-border dark:border-border animate-in fade-in zoom-in duration-500">
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
              <Timer className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-extrabold mb-4">آزمون هنوز شروع نشده است</h1>
            <p className="text-muted-foreground font-medium">لطفاً در زمان مقرر مراجعه کنید.</p>
          </div>
        </div>
      );
    }
 
    if (examStatus === 'completed' && !hasParticipated) {
      return (
        <div className="min-h-screen bg-muted/50 dark:bg-background flex flex-col items-center justify-center p-4 font-sans text-foreground " dir="rtl">
          <div className="w-full max-w-md bg-card dark:bg-background rounded-3xl p-10 text-center shadow-xl border border-border dark:border-border animate-in fade-in zoom-in duration-500">
            <div className="bg-destructive/10 text-destructive w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertOctagon className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-extrabold mb-4">آزمون به پایان رسیده است</h1>
            <p className="text-muted-foreground font-medium">زمان شرکت در این آزمون گذشته است.</p>
          </div>
        </div>
      );
    }
  }

  if (hasParticipated && !submitted) {
    return (
      <div className="min-h-screen bg-muted/50 dark:bg-background flex flex-col items-center justify-center py-20 px-4 font-sans text-foreground " dir="rtl">
        <div className="w-full max-w-md bg-card dark:bg-background rounded-3xl p-10 text-center shadow-xl border border-border dark:border-border animate-in fade-in zoom-in duration-500">
          <div className="bg-warning/10 text-warning w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-extrabold mb-4">آزمون شما ثبت شده است</h1>
          <p className="text-muted-foreground font-medium mb-8">شما در این آزمون شرکت کرده‌اید. اما به دلیل محدودیت‌های شبکه مشخصات دقیق یافت نشد.</p>
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
      <div className={`${adminViewAttemptId ? 'pb-32 pt-6' : 'min-h-screen pt-10 pb-20'} bg-muted/50 dark:bg-background flex flex-col items-center px-4 font-sans text-foreground `} dir="rtl">
        <div className={`w-full max-w-3xl ${adminViewAttemptId ? '' : 'bg-card dark:bg-background rounded-3xl p-8 md:p-10 shadow-sm border border-border dark:border-border'} animate-in fade-in zoom-in duration-500`}>
 
          {!adminViewAttemptId && (
            <div className="text-center mb-10">
              <div className="bg-success/10 text-success w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-extrabold mb-2">آزمون با موفقیت ثبت شد</h1>
              <p className="text-muted-foreground font-medium">پاسخ‌های شما در سیستم ذخیره گردید.</p>
            </div>
          )}

          {(exam.show_results !== false || adminViewAttemptId) && (
            <div className="flex flex-col items-center border-t border-border dark:border-border pt-10">
 
              {/* Circle Chart */}
              <div className="relative w-56 h-56 mb-8">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="none" className="text-muted dark:text-muted" />
                  {stats.correct > 0 && <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="none" strokeDasharray={`${(stats.correct/total)*251.2} 251.2`} className="text-success" />}
                  {stats.wrong > 0 && <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="none" strokeDashoffset={-((stats.correct/total)*251.2)} strokeDasharray={`${(stats.wrong/total)*251.2} 251.2`} className="text-destructive" />}
                  {stats.empty > 0 && <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="none" strokeDashoffset={-(((stats.correct+stats.wrong)/total)*251.2)} strokeDasharray={`${(stats.empty/total)*251.2} 251.2`} className="text-muted-foreground dark:text-muted-foreground" />}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-card dark:bg-background rounded-full m-4">
                  <div className="text-4xl font-black text-foreground dark:text-white">{toFarsiNumber(correctPct)}٪</div>
                  <div className="text-sm font-bold text-muted-foreground mt-1">درصد صحیح</div>
                </div>
              </div>

              <div className="grid grid-cols-3 w-full gap-4 mb-8 text-center bg-muted/50 p-4 md:p-6 rounded-3xl border border-border dark:border-border">
                <div>
                  <div className="text-3xl font-black text-success mb-1">{toFarsiNumber(stats.correct)}</div>
                  <div className="text-xs font-bold text-muted-foreground">گزینه صحیح</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-destructive mb-1">{toFarsiNumber(stats.wrong)}</div>
                  <div className="text-xs font-bold text-muted-foreground">گزینه غلط</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-muted-foreground mb-1">{toFarsiNumber(stats.empty)}</div>
                  <div className="text-xs font-bold text-muted-foreground">بدون پاسخ</div>
                </div>
              </div>
 
              {/* Answer Sheet Table */}
              <div className="w-full overflow-x-auto rounded-[2rem] border border-border dark:border-border shadow-sm bg-card dark:bg-background">
                <table className="w-full text-xs md:text-sm text-center table-fixed">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border dark:border-border">
                      <th className="py-3 md:py-5 px-1 md:px-4 font-bold text-muted-foreground dark:text-muted-foreground w-12 md:w-24 text-[10px] md:text-sm">سوال</th>
                      <th className="py-3 md:py-5 px-1 md:px-4 font-bold text-muted-foreground dark:text-muted-foreground w-[22%] md:w-1/4 text-[10px] md:text-sm">گزینه ۱</th>
                      <th className="py-3 md:py-5 px-1 md:px-4 font-bold text-muted-foreground dark:text-muted-foreground w-[22%] md:w-1/4 text-[10px] md:text-sm">گزینه ۲</th>
                      <th className="py-3 md:py-5 px-1 md:px-4 font-bold text-muted-foreground dark:text-muted-foreground w-[22%] md:w-1/4 text-[10px] md:text-sm">گزینه ۳</th>
                      <th className="py-3 md:py-5 px-1 md:px-4 font-bold text-muted-foreground dark:text-muted-foreground w-[22%] md:w-1/4 text-[10px] md:text-sm">گزینه ۴</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border ">
                    {questions.map((q: any, i: number) => {
                      const userAns = answers[q.id];
                      const correctAns = q.questions.correct_option_index;
                      return (
                        <tr key={q.id} className="hover:bg-muted/50/50 transition-colors">
                          <td className="py-2 md:py-4 px-1 md:px-4 font-bold text-foreground dark:text-muted-foreground bg-muted/50/50 border-l border-border dark:border-border text-sm md:text-lg">{toFarsiNumber(i + 1)}</td>
                          {[0, 1, 2, 3].map(optIdx => {
                            const isUserSel = userAns === optIdx;
                            const isCorrect = correctAns === optIdx;
 
                            let colors = "bg-muted text-muted-foreground dark:text-muted-foreground";
                            if (isCorrect && isUserSel) colors = "bg-success text-success-foreground shadow-md shadow-success/20 ring-1 md:ring-2 ring-success ring-offset-1 md:ring-offset-2 dark:ring-offset-background";
                            else if (isCorrect && !isUserSel) colors = "bg-success/10 text-success border border-success/30";
                            else if (!isCorrect && isUserSel) colors = "bg-destructive text-destructive-foreground shadow-md shadow-destructive/20 ring-1 md:ring-2 ring-destructive ring-offset-1 md:ring-offset-2 dark:ring-offset-background";

                            return (
                              <td key={optIdx} className="py-2 md:py-4 px-0.5 md:px-4">
                                <div className={`w-6 h-6 md:w-10 md:h-10 rounded-md md:rounded-xl flex items-center justify-center mx-auto transition-all ${colors}`}>
                                  {isUserSel && !isCorrect ? <X className="w-3.5 h-3.5 md:w-5 md:h-5 stroke-[2.5]" /> : (isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 md:w-5 md:h-5 stroke-[2.5]" /> : null)}
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
    <div className="min-h-screen bg-muted/50 dark:bg-background font-sans text-foreground flex flex-col items-center py-6 px-4 transition-colors duration-300 relative" dir="rtl">
 
      {/* Top Navigation / Status Bar */}
      <ExamViewerHeader 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        currentStep={currentStep}
        activeQuestionIndex={activeQuestionIndex}
        totalQuestions={questions.length}
        timeLeft={timeLeft}
        examTimeLimit={exam.time_limit_minutes}
      />

      <div className="w-full max-w-[1100px] flex flex-col min-h-0 items-start pb-10 flex-1 animate-in fade-in slide-in-from-bottom-8 duration-500">
 
        {currentStep === 'intro' ? (
          <div className="flex flex-col items-center justify-center w-full pt-10">
            <div className="bg-card dark:bg-background border border-border dark:border-border rounded-3xl p-8 md:p-12 shadow-sm mx-auto w-full max-w-[1100px]">
              <div className="text-center mb-10">
                <h1 className="text-2xl md:text-3xl font-extrabold mb-4 text-foreground dark:text-white leading-tight">{exam.title}</h1>
                {exam.description && <p className="text-muted-foreground font-medium leading-relaxed max-w-lg mx-auto text-sm">{exam.description}</p>}
              </div>
 
              {needsInfo && (
                <div className="w-full flex justify-center mb-8">
                  <div className="w-full max-w-md">
                    <h2 className="font-bold text-lg mb-6 text-foreground text-center">مشخصات فردی</h2>
                    <ExamViewerStudentForm
                      requiredFields={requiredFields}
                      studentInfo={studentInfo}
                      setStudentInfo={setStudentInfo}
                      formErrors={formErrors}
                      setFormErrors={setFormErrors}
                    />
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
            <ExamViewerAnswerSheet 
              questions={questions}
              activeQuestionIndex={activeQuestionIndex}
              setActiveQuestionIndex={setActiveQuestionIndex}
              answers={answers}
              isMobile={false}
            />

            {/* Mobile Answer Sheet (flows down) */}
            <ExamViewerAnswerSheet 
              questions={questions}
              activeQuestionIndex={activeQuestionIndex}
              setActiveQuestionIndex={setActiveQuestionIndex}
              answers={answers}
              isMobile={true}
            />

            {/* Main Question Card */}
            <div className="flex-1 w-full bg-card dark:bg-background border border-border dark:border-border rounded-[2rem] p-6 md:p-8 shadow-sm flex flex-col relative overflow-hidden min-h-[400px]">
 
              {/* Question Content */}
              <div className="flex-1 slide-in-right">
                <div className="font-bold text-base md:text-lg mb-8 leading-loose text-foreground ">
                  <RenderContent content={questions[activeQuestionIndex].questions.content} />
                </div>
 
                <div className="space-y-3">
                  {questions[activeQuestionIndex].questions.options.map((opt: string, idx: number) => {
                    const qId = questions[activeQuestionIndex].id;
                    const isSelected = answers[qId] === idx;
                    const optIsFarsi = isFarsi(opt);
 
                    return (
                      <label key={idx} className={`flex items-center gap-3 p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border dark:border-border bg-muted/50/50 hover:border-input dark:hover:border-border'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-primary' : 'border-input '}`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                        <input type="radio" className="sr-only" checked={isSelected} onChange={() => setAnswers({...answers, [qId]: idx})} />
                        <div className={`flex-1 flex font-bold text-sm md:text-base transition-colors ${isSelected ? 'text-primary' : 'text-foreground dark:text-muted-foreground'} ${optIsFarsi ? 'text-right' : 'text-left font-mono dir-ltr'}`} dir={optIsFarsi ? 'rtl' : 'ltr'}>
                          <RenderContent content={opt} />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
 
              {/* Navigation Controls */}
              <div className="mt-8 flex items-center justify-between pt-5 border-t border-border dark:border-border">
                <button 
                  onClick={() => setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1))}
                  disabled={activeQuestionIndex === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  قبلی
                </button>

                {activeQuestionIndex < questions.length - 1 ? (
                  <button 
                    onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-muted hover:bg-secondary text-foreground rounded-lg font-bold text-sm transition-colors"
                  >
                    بعدی
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    disabled={loading} 
                    onClick={() => handleSubmit()} 
                    className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    پایان آزمون
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
