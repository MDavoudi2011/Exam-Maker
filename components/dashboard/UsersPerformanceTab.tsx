'use client';

import React, { useState } from 'react';
import { Users, Search, Loader2, BookOpen, UserCheck } from 'lucide-react';
import { toFarsiNumber } from '@/utils/text.util';
import { useUsersPerformanceTab, useAttemptDetails } from '@/hooks/useUsersPerformanceTab';
import { UserPerformanceModal } from './UserPerformanceModal';
import { SortDropdown } from '@/components/ui/SortDropdown';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { DashboardCard } from '@/components/ui/DashboardCard';

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
    <>
      <DashboardCard>
        <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-20 w-full">
          <div className="relative flex-1">
            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="جستجوی نام، کد ملی یا پرسنلی..." />
          </div>

          <div className="flex flex-row items-center gap-4 w-full md:w-auto shrink-0 z-10">
            <FilterDropdown
              value={identifierBasis}
              options={[
                { value: 'auto', label: 'کدملی/پرسنلی' },
                { value: 'national_code', label: 'فقط کد ملی' },
                { value: 'personnel_code', label: 'فقط کد پرسنلی' }
              ]}
              onChange={(val) => setIdentifierBasis(val as any)}
              isOpen={isIdentDropdownOpen}
              onToggle={() => setIsIdentDropdownOpen(!isIdentDropdownOpen)}
              onClose={() => setIsIdentDropdownOpen(false)}
              icon={<UserCheck className="w-4 h-4 shrink-0 text-muted-foreground" />}
            />

            <SortDropdown
              value={sortConfig.key}
              direction={sortConfig.direction}
              options={[
                { value: 'fullName', label: 'نام شرکت‌کننده' },
                { value: 'uniqueId', label: identifierBasis === 'national_code' ? 'کد ملی' : identifierBasis === 'personnel_code' ? 'کد پرسنلی' : 'کد ملی/پرسنلی' },
                { value: 'avgScore', label: 'میانگین نمرات' }
              ]}
              onChange={(key) => requestSort(key as "fullName" | "avgScore" | "uniqueId")}
              onDirectionToggle={() => requestSort(sortConfig.key)}
              isOpen={isSortDropdownOpen}
              onToggle={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              onClose={() => setIsSortDropdownOpen(false)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-8">
            <EmptyState icon={BookOpen} title="نتیجه‌ای یافت نشد" description="هیچ شرکت‌کننده‌ای با کدملی/پرسنلی پیدا نشد." />
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 md:-mx-6 pb-2 md:pb-4">
            <table className={`w-full text-right border-collapse z-10 relative ${filteredUsers.length > 0 ? 'min-w-max md:min-w-[800px]' : 'min-w-full'}`}>
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-xs md:text-sm border-y border-border">
                  <th className="p-3 md:p-4 px-4 md:px-6 font-semibold w-1/3">تکمیل کننده</th>
                  <th className="p-3 md:p-4 font-semibold text-center w-32">{identifierBasis === 'national_code' ? 'کد ملی' : identifierBasis === 'personnel_code' ? 'کد پرسنلی' : 'کد ملی/پرسنلی'}</th>
                  {filteredExams.map((exam: any) => (
                    <th key={exam.id} className="p-3 md:p-4 font-semibold text-center">{exam.title}</th>
                  ))}
                  <th className="p-3 md:p-4 px-4 md:px-6 font-semibold text-center w-24">میانگین</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs md:text-sm">
                {filteredUsers.map((user: any, idx: number) => {
                  const avgScore = user.examsCount > 0 ? (user.totalScore / user.examsCount).toFixed(1) : 0;
                  return (
                    <tr key={idx} className="hover:bg-muted/50 transition-colors group">
                      <td className="p-3 md:p-4 px-4 md:px-6 font-bold text-foreground">{user.fullName}</td>
                      <td className="p-3 md:p-4 font-medium text-muted-foreground text-center">{user.uniqueId}</td>
                      {filteredExams.map((exam: any) => {
                        const att = user.attempts[exam.id];
                        return (
                          <td key={exam.id} className="p-3 md:p-4 text-center">
                            {att ? (
                              <button 
                                onClick={() => setSelectedAttemptId(att.attemptId)}
                                className={`font-bold px-3 py-1.5 rounded-xl text-xs transition-transform hover:scale-105 active:scale-95 ${att.score >= 50 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}
                              >
                                {toFarsiNumber(Number(att.score).toFixed(1).replace(/\.0$/, ''))}٪
                              </button>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-3 md:p-4 px-4 md:px-6 text-center">
                        <span className="inline-block font-bold px-3 py-1.5 rounded-xl text-xs bg-primary/10 text-primary">
                          {toFarsiNumber(Number(avgScore).toFixed(1).replace(/\.0$/, ''))}٪
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>

      {selectedAttemptId && (
        <UserPerformanceModal attemptId={selectedAttemptId} onClose={() => setSelectedAttemptId(null)} />
      )}
    </>
  );
}
