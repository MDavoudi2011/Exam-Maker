'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Loader2, Eye, X, BookOpen } from 'lucide-react';
// removed import
import { ExamViewer } from '@/components/viewer/ExamViewer';
import { useUsersPerformanceTab, useAttemptDetails } from '@/hooks/useUsersPerformanceTab';
import { UserPerformanceModal } from './UserPerformanceModal';

export function UsersPerformanceTab({ initialExams }: { initialExams: any[] }) {
  const {
    searchTerm,
    setSearchTerm,
    loading,
    filteredUsers,
    filteredExams,
    selectedAttemptId,
    setSelectedAttemptId
  } = useUsersPerformanceTab(initialExams);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <Users className="w-7 h-7 text-primary" />
            تحلیل عملکرد کاربران
          </h2>
          <p className="text-slate-500 mt-2 font-medium">مشاهده کارنامه کلی و میانگین نمرات کاربران</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="جستجوی نام یا کد پرسنلی..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pr-12 pl-4 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="font-bold text-sm">در حال دریافت اطلاعات...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-4 transition-transform hover:scale-105 hover:-rotate-3">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">نتیجه‌ای یافت نشد</h3>
            <p className="text-sm font-medium">هیچ شرکت‌کننده‌ای با کدملی/پرسنلی پیدا نشد.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm border-b border-slate-100 dark:border-slate-800">
                  <th className="p-5 font-semibold">تکمیل کننده</th>
                  <th className="p-5 font-semibold">کد ملی/پرسنلی</th>
                  {filteredExams.map(exam => (
                    <th key={exam.id} className="p-5 font-semibold">{exam.title}</th>
                  ))}
                  <th className="p-5 font-semibold text-center">میانگین</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => {
                  const avgScore = user.examsCount > 0 ? (user.totalScore / user.examsCount).toFixed(1) : 0;
                  return (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 pl-4">
                      <td className="p-5 font-bold text-slate-800 dark:text-slate-200">{user.fullName}</td>
                      <td className="p-5 font-medium text-slate-600 dark:text-slate-400">{user.uniqueId}</td>
                      {filteredExams.map(exam => {
                        const att = user.attempts[exam.id];
                        return (
                          <td key={exam.id} className="p-5">
                            {att ? (
                              <button 
                                onClick={() => setSelectedAttemptId(att.attemptId)}
                                className={`font-bold px-3 py-1.5 rounded-lg text-sm transition-colors hover:scale-105 active:scale-95 ${att.score >= 50 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'}`}
                              >
                                {att.score.toFixed(1)}%
                              </button>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-5 text-center font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10">
                        {avgScore}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedAttemptId && (
        <UserPerformanceModal attemptId={selectedAttemptId} onClose={() => setSelectedAttemptId(null)} />
      )}
    </div>
  );
}
