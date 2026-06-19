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
        <div className="absolute inset-0 bg-card dark:bg-background border border-border dark:border-border rounded-[2rem] p-5 shadow-sm flex flex-col">
          <h3 className="font-bold mb-4 text-sm text-foreground border-b border-border dark:border-border pb-3 flex items-center gap-2 shrink-0">
            <LayoutGrid className="w-4 h-4 text-primary" />
            پاسخ‌برگ
          </h3>
 
          <div className="flex-1 overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
            {questions.map((q: any, i: number) => (
              <div 
                key={q.id}
                onClick={() => setActiveQuestionIndex(i)}
                className={`flex items-center p-1.5 rounded-lg cursor-pointer transition-colors ${activeQuestionIndex === i ? 'bg-muted ' : 'hover:bg-muted/50 '}`}
              >
                <div className="w-8 flex-shrink-0 text-center font-bold text-xs text-muted-foreground">
                  {toFarsiNumber(i + 1)}
                </div>
                <div className="flex-1 flex gap-1.5 items-center justify-between ml-1">
                  {q.questions.options.map((_: any, optIdx: number) => {
                    const isSelected = answers[q.id] === optIdx;
                    return (
                      <div 
                        key={optIdx}
                        className={`w-full aspect-square rounded-md flex items-center justify-center border transition-all text-xs font-mono
 ${isSelected ? 'bg-success border-success shadow-sm text-success' : 'bg-card border-border'}
 `}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-sm bg-success-foreground" />}
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
            className="w-full bg-card dark:bg-background border border-border dark:border-border rounded-2xl p-4 shadow-sm flex items-center justify-center gap-2 font-bold text-sm text-foreground dark:text-muted-foreground transition-colors hover:bg-muted/50 "
          >
            <LayoutGrid className="w-5 h-5 text-primary" />
            مشاهده پاسخ‌برگ ({toFarsiNumber(Object.keys(answers).length)} از {toFarsiNumber(questions.length)})
          </button>

          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0" dir="rtl">
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)}></div>
              <div className="relative bg-card dark:bg-background w-full max-w-sm sm:max-w-md rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] z-10 border border-border dark:border-border">
                <div className="font-bold mb-4 text-base text-foreground border-b border-border dark:border-border pb-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-primary" />
                    پاسخ‌برگ
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-1.5 bg-muted text-muted-foreground rounded-full hover:bg-secondary transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="overflow-y-auto pr-2 space-y-2 custom-scrollbar flex-1 pb-2">
                  {questions.map((q: any, i: number) => (
                    <div 
                      key={q.id} 
                      onClick={() => { setActiveQuestionIndex(i); setIsOpen(false); }} 
                      className={`flex items-center p-2.5 rounded-xl cursor-pointer transition-colors ${activeQuestionIndex === i ? 'bg-muted ' : 'hover:bg-muted/50 '}`}
                    >
                      <div className="w-10 flex-shrink-0 text-center font-bold text-sm text-muted-foreground">{toFarsiNumber(i + 1)}</div>
                      <div className="flex-1 flex gap-2 items-center justify-between ml-1">
                        {q.questions.options.map((_: any, optIdx: number) => {
                          const isSelected = answers[q.id] === optIdx;
                          return (
                            <div key={optIdx} className={`w-full aspect-square max-w-[2.5rem] rounded-lg flex items-center justify-center border transition-all ${isSelected ? 'bg-success border-success shadow-sm' : 'bg-card border-border'}`}>
                              {isSelected && <div className="w-2.5 h-2.5 rounded-sm bg-success-foreground" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
