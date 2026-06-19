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
    <div className="w-full max-w-[1100px] flex items-center justify-between mb-6 md:mb-8 z-40 bg-card/50 dark:bg-background/50 backdrop-blur-md px-3 py-2.5 md:p-4 rounded-2xl md:rounded-3xl border border-border/50 dark:border-border/50 shadow-sm shrink-0">
      <button onClick={toggleDarkMode} className="p-2 md:p-3 bg-card rounded-xl shadow-sm text-muted-foreground dark:text-muted-foreground hover:text-primary transition-colors border border-border dark:border-border shrink-0">
        {isDarkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
      </button>

      {currentStep === 'question' && (
        <div className="flex-1 mx-2.5 md:mx-8">
          <div className="flex justify-between items-end mb-1.5 px-0.5">
            <span className="font-bold text-primary text-xs md:text-sm">سوال {toFarsiNumber(activeQuestionIndex + 1)} از {toFarsiNumber(totalQuestions)}</span>
            <span className="text-[10px] md:text-xs font-bold text-muted-foreground">{toFarsiNumber(Math.round(((activeQuestionIndex + 1) / totalQuestions) * 100))}٪</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${((activeQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      )}
 
      <div className="flex items-center gap-4 shrink-0">
        {currentStep === 'question' && timeLeft !== null && (
          <div className={`flex items-center justify-center gap-1.5 md:gap-2 w-[100px] md:w-[130px] py-1.5 md:py-2 rounded-xl border font-bold text-[13px] md:text-sm transition-colors duration-500 ${timeLeft <= 60 ? 'bg-destructive text-destructive-foreground border-destructive' : 'bg-card text-primary border-border '}`}>
            <Timer className={`w-4 h-4 md:w-5 md:h-5 ${timeLeft <= 60 ? 'animate-pulse' : ''}`} />
            <span className="dir-ltr inline-block tracking-widest min-w-[42px] md:min-w-[50px] text-center tabular-nums">{formatTime(timeLeft)}</span>
          </div>
        )}
        {currentStep === 'intro' && examTimeLimit && (
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card text-muted-foreground dark:text-muted-foreground border border-border dark:border-border font-bold text-sm">
            <Timer className="w-5 h-5" />
            زمان: {toFarsiNumber(examTimeLimit)} دقیقه
          </div>
        )}
      </div>
    </div>
  );
}
