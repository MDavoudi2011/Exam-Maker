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
import { UserExamsListModal } from './UserExamsListModal';
import { ActionButtonGroup, ActionButton } from '@/components/ui/ActionButton';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { List } from 'lucide-react';


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
    selectedUserForExams,
    setSelectedUserForExams,
    isSortDropdownOpen,
    setIsSortDropdownOpen,
    isIdentDropdownOpen,
    setIsIdentDropdownOpen,
    sortDropdownRef,
    identDropdownRef,
    showNationalCode,
    showPersonnelCode,
    showOrgTitle,
    showClassName,
    showSchool,
    showDistrict,
  } = useUsersPerformanceTab(initialExams);

  return (
    <>
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
                  <th className="p-3 md:p-4 px-4 md:px-6 font-semibold min-w-[150px]">تکمیل کننده</th>
                  {identifierBasis === 'auto' && showNationalCode && <th className="p-3 md:p-4 font-semibold text-center whitespace-nowrap">کد ملی</th>}
                  {identifierBasis === 'auto' && showPersonnelCode && <th className="p-3 md:p-4 font-semibold text-center whitespace-nowrap">کد پرسنلی</th>}
                  {identifierBasis === 'national_code' && <th className="p-3 md:p-4 font-semibold text-center whitespace-nowrap">کد ملی</th>}
                  {identifierBasis === 'personnel_code' && <th className="p-3 md:p-4 font-semibold text-center whitespace-nowrap">کد پرسنلی</th>}
                  {showOrgTitle && <th className="p-3 md:p-4 font-semibold text-center whitespace-nowrap">عنوان سازمانی</th>}
                  {showClassName && <th className="p-3 md:p-4 font-semibold text-center whitespace-nowrap">کلاس/پایه</th>}
                  {showSchool && <th className="p-3 md:p-4 font-semibold text-center whitespace-nowrap">مدرسه</th>}
                  {showDistrict && <th className="p-3 md:p-4 font-semibold text-center whitespace-nowrap">ناحیه/منطقه</th>}
                  <th className="p-3 md:p-4 font-semibold text-center whitespace-nowrap w-24 md:w-48">تعداد آزمون‌ها</th>
                  <th className="p-3 md:p-4 px-4 md:px-6 font-semibold text-center w-32">میانگین نمرات</th>
                  <th className="p-3 md:p-4 px-4 md:px-6 font-semibold text-center w-24 md:w-48">آزمون‌ها</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs md:text-sm">
                {filteredUsers.map((user: any, idx: number) => {
                  const avgScore = user.examsCount > 0 ? (user.totalScore / user.examsCount).toFixed(1) : 0;
                  return (
                    <tr key={idx} className="hover:bg-muted/50 transition-colors group">
                      <td className="p-3 md:p-4 px-4 md:px-6 font-bold text-foreground">{user.fullName || '-'}</td>
                      
                      {identifierBasis === 'auto' && showNationalCode && <td className="p-3 md:p-4 font-medium text-muted-foreground text-center whitespace-nowrap">{user.nationalCode || '-'}</td>}
                      {identifierBasis === 'auto' && showPersonnelCode && <td className="p-3 md:p-4 font-medium text-muted-foreground text-center whitespace-nowrap">{user.personnelCode || '-'}</td>}
                      {identifierBasis === 'national_code' && <td className="p-3 md:p-4 font-medium text-muted-foreground text-center whitespace-nowrap">{user.nationalCode || '-'}</td>}
                      {identifierBasis === 'personnel_code' && <td className="p-3 md:p-4 font-medium text-muted-foreground text-center whitespace-nowrap">{user.personnelCode || '-'}</td>}

                      {showOrgTitle && <td className="p-3 md:p-4 font-medium text-muted-foreground text-center whitespace-nowrap">{user.orgTitle || '-'}</td>}
                      {showClassName && <td className="p-3 md:p-4 font-medium text-muted-foreground text-center whitespace-nowrap">{user.className || '-'}</td>}
                      {showSchool && <td className="p-3 md:p-4 font-medium text-muted-foreground text-center whitespace-nowrap">{user.school || '-'}</td>}
                      {showDistrict && <td className="p-3 md:p-4 font-medium text-muted-foreground text-center whitespace-nowrap">{user.district || '-'}</td>}

                      <td className="p-3 md:p-4 text-center">
                        <span className="inline-block font-bold px-3 py-1.5 rounded-lg text-xs bg-secondary text-secondary-foreground">
                          {toFarsiNumber(user.examsCount)}
                        </span>
                      </td>
                      <td className="p-3 md:p-4 px-4 md:px-6 text-center">
                        <ScoreBadge score={avgScore} />
                      </td>
                      <td className="p-2 md:p-4 px-4 md:px-6 text-center whitespace-nowrap">
                        <ActionButtonGroup>
                          <ActionButton 
                            onClick={() => setSelectedUserForExams(user)}
                            icon={List} 
                            title="مشاهده لیست آزمون‌ها" 
                            color="indigo" 
                          />
                        </ActionButtonGroup>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      {selectedUserForExams && (
        <UserExamsListModal
          user={selectedUserForExams}
          exams={initialExams}
          onClose={() => setSelectedUserForExams(null)}
          onViewAttempt={(attemptId) => setSelectedAttemptId(attemptId)}
        />
      )}

      {selectedAttemptId && (
        <UserPerformanceModal attemptId={selectedAttemptId} onClose={() => setSelectedAttemptId(null)} />
      )}
    </>
  );
}
