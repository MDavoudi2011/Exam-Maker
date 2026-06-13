import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { toFarsiNumber } from '@/utils/text.util';

export function ExamViewerAnswerSheet({
  questions,
  activeQuestionIndex,
  setActiveQuestionIndex,
  answers,
  isMobile
}: any) {
  return (
    <div className={`${isMobile ? 'md:hidden w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-5 shadow-sm' : 'hidden md:flex w-72 relative shrink-0 flex-col'}`}>
      {!isMobile && (
        <div className="absolute inset-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-5 shadow-sm flex flex-col">
          <h3 className="font-bold mb-4 text-sm text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2 shrink-0">
            <LayoutGrid className="w-4 h-4 text-primary" />
            پاسخ‌برگ
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
            {questions.map((q: any, i: number) => (
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
            ))}
          </div>
        </div>
      )}

      {isMobile && (
        <>
          <h3 className="font-bold mb-4 text-sm text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-primary" />
            پاسخ‌برگ
          </h3>
          <div className="max-h-60 overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
            {questions.map((q: any, i: number) => (
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
            ))}
          </div>
        </>
      )}
    </div>
  );
}
