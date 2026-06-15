'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LayoutGrid, X } from 'lucide-react';
import { toFarsiNumber } from '@/utils/text.util';

export function ExamViewerAnswerSheet({
  questions,
  activeQuestionIndex,
  setActiveQuestionIndex,
  answers,
  isMobile
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <div className={`${isMobile ? 'md:hidden w-full' : 'hidden md:flex w-72 relative shrink-0 flex-col'}`}>
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
          <button 
            onClick={() => setIsOpen(true)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-center gap-2 font-bold text-sm text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <LayoutGrid className="w-5 h-5 text-primary" />
            مشاهده پاسخ‌برگ ({toFarsiNumber(Object.keys(answers).length)} از {toFarsiNumber(questions.length)})
          </button>

          {isOpen && mounted && createPortal(
            <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:p-0" dir="rtl">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)}></div>
              <div className="relative bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-3xl p-5 shadow-2xl flex flex-col animate-in slide-in-from-bottom-full duration-300 max-h-[75vh]">
                <div className="font-bold mb-4 text-base text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-primary" />
                    پاسخ‌برگ
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                     <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="overflow-y-auto pr-2 space-y-1.5 custom-scrollbar flex-1 pb-4">
                  {questions.map((q: any, i: number) => (
                    <div 
                      key={q.id} 
                      onClick={() => { setActiveQuestionIndex(i); setIsOpen(false); }} 
                      className={`flex items-center p-2.5 rounded-xl cursor-pointer transition-colors ${activeQuestionIndex === i ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                    >
                      <div className="w-10 flex-shrink-0 text-center font-bold text-sm text-slate-500">{toFarsiNumber(i + 1)}</div>
                      <div className="flex-1 flex gap-2 items-center justify-between ml-1">
                        {q.questions.options.map((_: any, optIdx: number) => {
                          const isSelected = answers[q.id] === optIdx;
                          return (
                            <div key={optIdx} className={`w-full aspect-square rounded-lg flex items-center justify-center border transition-all ${isSelected ? 'bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/20' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700'}`}>
                                {isSelected && <div className="w-2 h-2 rounded-sm bg-white" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>,
            document.body
          )}
        </>
      )}
    </div>
  );
}
