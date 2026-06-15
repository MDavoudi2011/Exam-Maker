import React from 'react';
import { Sun, Moon, Timer } from 'lucide-react';
import { toFarsiNumber } from '@/utils/text.util';
import { formatTime } from '@/utils/time.util';

export function ExamViewerHeader({
  isDarkMode,
  toggleDarkMode,
  currentStep,
  activeQuestionIndex,
  totalQuestions,
  timeLeft,
  examTimeLimit
}: any) {
  return (
    <div className="w-full max-w-[1100px] flex items-center justify-between mb-8 z-40 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-4 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm shrink-0">
      <button onClick={toggleDarkMode} className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-colors border border-slate-200 dark:border-slate-700 shrink-0">
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {currentStep === 'question' && (
        <div className="flex-1 max-w-md mx-4 md:mx-10 pl-4 md:pl-0">
          <div className="flex justify-between items-end mb-2 px-1">
            <span className="font-bold text-primary text-xs md:text-sm">سوال {toFarsiNumber(activeQuestionIndex + 1)} از {toFarsiNumber(totalQuestions)}</span>
            <span className="text-[10px] md:text-xs font-bold text-slate-500">{toFarsiNumber(Math.round(((activeQuestionIndex + 1) / totalQuestions) * 100))}%</span>
          </div>
          <div className="h-3 md:h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${((activeQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-4 shrink-0">
        {currentStep === 'question' && timeLeft !== null && (
          <div className={`flex items-center gap-2 px-3 md:px-6 py-2.5 rounded-xl border font-bold text-sm transition-colors duration-500 ${timeLeft <= 60 ? 'bg-rose-500 text-white border-rose-500' : 'bg-white dark:bg-slate-800 text-primary border-slate-200 dark:border-slate-700'}`}>
            <Timer className={`w-4 h-4 md:w-5 md:h-5 ${timeLeft <= 60 ? 'animate-pulse' : ''}`} />
            {formatTime(timeLeft)}
          </div>
        )}
        {currentStep === 'intro' && examTimeLimit && (
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold text-sm">
            <Timer className="w-5 h-5" />
            زمان: {toFarsiNumber(examTimeLimit)} دقیقه
          </div>
        )}
      </div>
    </div>
  );
}
