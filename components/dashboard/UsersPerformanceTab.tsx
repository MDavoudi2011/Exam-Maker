'use client';

import React, { useState } from 'react';
import { Users, Search, Loader2, BookOpen, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, UserCheck } from 'lucide-react';
import { toFarsiNumber } from '@/utils/text.util';
import { ExamViewer } from '@/components/viewer/ExamViewer';
import { useUsersPerformanceTab, useAttemptDetails } from '@/hooks/useUsersPerformanceTab';
import { UserPerformanceModal } from './UserPerformanceModal';

export function UsersPerformanceTab({ initialExams }: { initialExams: any[] }) {
  const {
    searchTerm,
    setSearchTerm,
    sortConfig,
    requestSort,
    identifierBasis,
    setIdentifierBasis,
    loading,
    filteredUsers,
    filteredExams,
    selectedAttemptId,
    setSelectedAttemptId,
    isSortDropdownOpen,
    setIsSortDropdownOpen,
    isIdentDropdownOpen,
    setIsIdentDropdownOpen,
    sortDropdownRef,
    identDropdownRef
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

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-20 w-full">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="جستجوی نام، کد ملی یا پرسنلی..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
            />
          </div>

          <div className="flex flex-row items-center gap-4 w-full md:w-auto shrink-0 z-10">
            <div className="relative flex-1 md:w-56 shrink-0" ref={identDropdownRef}>
              <button 
                onClick={() => setIsIdentDropdownOpen(!isIdentDropdownOpen)}
                className="w-full px-3 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 truncate">
                  <UserCheck className="w-4 h-4 shrink-0 text-slate-400" />
                  <span className="truncate">{identifierBasis === 'auto' ? 'کدملی/پرسنلی' : identifierBasis === 'national_code' ? 'کد ملی' : 'کد پرسنلی'}</span>
                </div>
                <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 mr-1 transition-transform ${isIdentDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isIdentDropdownOpen && (
                 <div className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col p-2 animate-in fade-in zoom-in-95 duration-100 origin-top z-50">
                   <div className="space-y-1 p-1">
                     {[
                       { k: 'auto', l: 'کدملی/پرسنلی' },
                       { k: 'national_code', l: 'فقط کد ملی' },
                       { k: 'personnel_code', l: 'فقط کد پرسنلی' }
                     ].map(opt => (
                       <button 
                         key={opt.k}
                         onClick={() => { setIdentifierBasis(opt.k as any); setIsIdentDropdownOpen(false); }}
                         className={`w-full flex px-3 py-2.5 rounded-xl text-sm font-bold transition-colors text-right ${identifierBasis === opt.k ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-slate-50 text-slate-700 dark:hover:bg-slate-700/50 dark:text-slate-300'}`}
                       >
                         {opt.l}
                       </button>
                     ))}
                   </div>
                 </div>
              )}
            </div>

            <div className="relative flex-1 md:w-56 shrink-0" ref={sortDropdownRef}>
              <button 
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="w-full px-3 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 truncate">
                  <ArrowUpDown className="w-4 h-4 shrink-0 text-slate-400" />
                  <span className="truncate">
                    {sortConfig.key === 'fullName' ? 'نام شرکت‌کننده' : sortConfig.key === 'uniqueId' ? (identifierBasis === 'national_code' ? 'کد ملی' : identifierBasis === 'personnel_code' ? 'کد پرسنلی' : 'کدملی/پرسنلی') : 'میانگین نمرات'}
                  </span>
                </div>
                {sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 shrink-0 text-primary mr-1" /> : <ArrowDown className="w-4 h-4 shrink-0 text-primary mr-1" />}
              </button>
              {isSortDropdownOpen && (
                 <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col p-2 animate-in fade-in zoom-in-95 duration-100 origin-top z-50">
                   <div className="space-y-1 p-1">
                     {[
                       { k: 'fullName', l: 'نام شرکت‌کننده' },
                       { k: 'uniqueId', l: identifierBasis === 'national_code' ? 'کد ملی' : identifierBasis === 'personnel_code' ? 'کد پرسنلی' : 'کد ملی/پرسنلی' },
                       { k: 'avgScore', l: 'میانگین نمرات' }
                     ].map(opt => (
                       <button 
                         key={opt.k}
                         onClick={() => { requestSort(opt.k as any); setIsSortDropdownOpen(false); }}
                         className={`w-full flex flex-col px-3 py-2.5 rounded-xl text-sm font-bold transition-colors text-right ${sortConfig?.key === opt.k ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-slate-50 text-slate-700 dark:hover:bg-slate-700/50 dark:text-slate-300'}`}
                       >
                          <div className="flex justify-between items-center w-full">
                            <span>{opt.l}</span>
                            {sortConfig?.key === opt.k && (
                              <span className="text-primary">{sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}</span>
                            )}
                          </div>
                       </button>
                     ))}
                   </div>
                 </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 m-4 text-slate-500">
            <BookOpen className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">نتیجه‌ای یافت نشد</h3>
            <p className="text-sm font-medium">هیچ شرکت‌کننده‌ای با کدملی/پرسنلی پیدا نشد.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 md:-mx-6 pb-2 md:pb-4">
            <table className="w-full text-right border-collapse min-w-max md:min-w-[800px] z-10 relative">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs md:text-sm border-y border-slate-100 dark:border-slate-800">
                  <th className="p-3 md:p-4 px-4 md:px-6 font-semibold w-1/3">تکمیل کننده</th>
                  <th className="p-3 md:p-4 font-semibold text-center w-32">{identifierBasis === 'national_code' ? 'کد ملی' : identifierBasis === 'personnel_code' ? 'کد پرسنلی' : 'کد ملی/پرسنلی'}</th>
                  {filteredExams.map(exam => (
                    <th key={exam.id} className="p-3 md:p-4 font-semibold text-center">{exam.title}</th>
                  ))}
                  <th className="p-3 md:p-4 px-4 md:px-6 font-semibold text-center w-24">میانگین</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
                {filteredUsers.map((user, idx) => {
                  const avgScore = user.examsCount > 0 ? (user.totalScore / user.examsCount).toFixed(1) : 0;
                  return (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="p-3 md:p-4 px-4 md:px-6 font-bold text-slate-800 dark:text-slate-200">{user.fullName}</td>
                      <td className="p-3 md:p-4 font-medium text-slate-600 dark:text-slate-400 text-center">{user.uniqueId}</td>
                      {filteredExams.map(exam => {
                        const att = user.attempts[exam.id];
                        return (
                          <td key={exam.id} className="p-3 md:p-4 text-center">
                            {att ? (
                              <button 
                                onClick={() => setSelectedAttemptId(att.attemptId)}
                                className={`font-bold px-3 py-1.5 rounded-xl text-xs transition-transform hover:scale-105 active:scale-95 ${att.score >= 50 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'}`}
                              >
                                {toFarsiNumber(att.score.toFixed(1))}%
                              </button>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-3 md:p-4 px-4 md:px-6 text-center">
                        <span className="inline-block font-bold px-3 py-1.5 rounded-xl text-xs bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                          {toFarsiNumber(avgScore)}%
                        </span>
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
