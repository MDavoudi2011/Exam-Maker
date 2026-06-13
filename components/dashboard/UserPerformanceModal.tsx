'use client';

import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { ExamViewer } from '@/components/viewer/ExamViewer';
import { useAttemptDetails } from '@/hooks/useUsersPerformanceTab';

export function UserPerformanceModal({ attemptId, onClose }: { attemptId: string, onClose: () => void }) {
  const { details, examData, questions, loading } = useAttemptDetails(attemptId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl h-full max-h-screen bg-slate-50 dark:bg-slate-950 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md z-10">
          <h3 className="font-bold">ریز نتایج: {details?.full_name || 'در حال بارگذاری...'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto w-full relative">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : details && examData ? (
             <ExamViewer exam={examData} questions={questions} user={null} adminViewAttemptId={attemptId} />
          ) : (
            <p className="text-center text-slate-500">اطلاعاتی یافت نشد</p>
          )}
        </div>
      </div>
    </div>
  );
}
