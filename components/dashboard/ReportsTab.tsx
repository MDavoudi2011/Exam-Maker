'use client';
import React, { useState } from 'react';
import { Download, Users, BarChart, Loader2, FileQuestion, ChevronDown, Eye, X, Search, Check, ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { toFarsiNumber } from '@/utils/text.util';
import { ExamViewer } from '@/components/viewer/ExamViewer';
import { useReportsTab } from '@/hooks/useReportsTab';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { SortDropdown } from '@/components/ui/SortDropdown';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { ActionButton, ActionButtonGroup } from '@/components/ui/ActionButton';

export function ReportsTab({ initialExams, initialSelectedExamId }: { initialExams?: any[], initialSelectedExamId?: string | null }) {
  const {
    selectedExamId,
    setSelectedExamId,
    results,
    sortedAndFilteredResults,
    loading,
    viewingAttempt,
    setViewingAttempt,
    examData,
    questions,
    searchTerm,
    setSearchTerm,
    sortKey,
    setSortKey,
    sortDirection,
    toggleSortDirection,
    attemptCounts,
    showFullName,
    showNationalCode,
    showPersonnelCode,
    showOrgTitle,
    showClassName,
    showSchool,
    showDistrict,
    isDropdownOpen,
    setIsDropdownOpen,
    isSortDropdownOpen,
    setIsSortDropdownOpen,
    examDropdownRef,
    sortDropdownRef
  } = useReportsTab(initialSelectedExamId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <SectionHeader icon={BarChart} title="گزارش‌ها و نتایج" description="مشاهده و تحلیل کارنامه و نتایج شرکت‌کنندگان" />
      </div>
      <DashboardCard>
        <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-20 w-full">
          <div className="relative flex-1">
            <SearchBar 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder={selectedExamId ? "جستجو در تمام فیلدها..." : "ابتدا آزمون را انتخاب کنید"} 
              disabled={!selectedExamId}
            />
          </div>
 
          <div className="flex flex-row items-center gap-4 w-full md:w-auto shrink-0 z-10">
            <FilterDropdown
              value={selectedExamId || ''}
              options={initialExams?.map(exam => ({
                value: exam.id,
                label: exam.title,
                count: attemptCounts[exam.id] || 0
              })) || []}
              onChange={setSelectedExamId}
              isOpen={isDropdownOpen}
              onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
              onClose={() => setIsDropdownOpen(false)}
              placeholder="انتخاب آزمون"
              icon={<ChevronDown className="w-4 h-4 hidden" />} /* Disable default icon */
            />
 
            <SortDropdown
              value={sortKey || ''}
              direction={sortDirection}
              onChange={setSortKey}
              onDirectionToggle={toggleSortDirection}
              isOpen={isSortDropdownOpen}
              disabled={!selectedExamId}
              onToggle={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              onClose={() => setIsSortDropdownOpen(false)}
              options={[
                { value: 'full_name', label: 'نام شرکت‌کننده' },
                { value: 'score', label: 'نمره' },
                { value: 'created_at', label: 'تاریخ شروع' },
                { value: 'completed_at', label: 'تاریخ پایان' }
              ]}
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 md:-mx-6 pb-2 md:pb-4">
          <table className={`w-full text-right border-collapse z-10 relative ${sortedAndFilteredResults.length > 0 ? 'min-w-max md:min-w-[800px]' : 'min-w-full'}`}>
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-xs md:text-sm border-y border-border dark:border-border">
                {showFullName && <th className="p-3 md:p-4 px-4 md:px-6 font-semibold">نام و نام خانوادگی</th>}
                {showNationalCode && <th className="p-3 md:p-4 font-semibold text-center">کد ملی</th>}
                {showPersonnelCode && <th className="p-3 md:p-4 font-semibold text-center">کد پرسنلی</th>}
                {showOrgTitle && <th className="p-3 md:p-4 font-semibold text-center">عنوان سازمانی</th>}
                {showClassName && <th className="p-3 md:p-4 font-semibold text-center">کلاس</th>}
                {showSchool && <th className="p-3 md:p-4 font-semibold text-center">مدرسه</th>}
                {showDistrict && <th className="p-3 md:p-4 font-semibold text-center">ناحیه/منطقه</th>}
                <th className="p-3 md:p-4 font-semibold text-center w-20 md:w-24">نمره</th>
                <th className="p-3 md:p-4 font-semibold text-center w-32 md:w-40 text-nowrap">تاریخ شروع</th>
                <th className="p-3 md:p-4 font-semibold text-center w-32 md:w-40 text-nowrap">تاریخ پایان</th>
                <th className="p-3 md:p-4 px-4 md:px-6 font-semibold text-center w-24 md:w-32">ریز نتایج</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border  text-xs md:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={11} className="p-16 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  </td>
                </tr>
              ) : selectedExamId ? (
                sortedAndFilteredResults.length > 0 ? sortedAndFilteredResults.map((res: any) => {
                  return (
                    <tr key={res.id} className="hover:bg-muted/50 transition-colors group">
                      {showFullName && <td className="p-3 md:p-4 px-4 md:px-6 font-bold text-foreground ">{res.full_name || '-'}</td>}
                      {showNationalCode && <td className="p-3 md:p-4 font-medium text-muted-foreground dark:text-muted-foreground text-center">{res.national_code || '-'}</td>}
                      {showPersonnelCode && <td className="p-3 md:p-4 font-medium text-muted-foreground dark:text-muted-foreground text-center">{res.personnel_code || '-'}</td>}
                      {showOrgTitle && <td className="p-3 md:p-4 font-medium text-muted-foreground dark:text-muted-foreground text-center">{res.org_title || '-'}</td>}
                      {showClassName && <td className="p-3 md:p-4 font-medium text-muted-foreground dark:text-muted-foreground text-center">{res.class_name || '-'}</td>}
                      {showSchool && <td className="p-3 md:p-4 font-medium text-muted-foreground dark:text-muted-foreground text-center">{res.school || '-'}</td>}
                      {showDistrict && <td className="p-3 md:p-4 font-medium text-muted-foreground dark:text-muted-foreground text-center">{res.district || '-'}</td>}
                      <td className="p-3 md:p-4 text-center">
                        {res.status === 'completed' ? (
                          <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-xs font-black inline-block min-w-[3rem]">
                            {res.score !== null ? `${toFarsiNumber(Number(res.score).toFixed(1).replace(/\.0$/, ''))}٪` : '-'}
                          </span>
                        ) : (
                          <span className="text-[10px] md:text-xs text-muted-foreground font-bold">در حال انجام</span>
                        )}
                      </td>
                      <td className="p-3 md:p-4 text-muted-foreground text-[10px] md:text-sm text-center whitespace-nowrap" dir="ltr">{res.created_at ? toFarsiNumber(new Date(res.created_at).toLocaleString('fa-IR', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' })) : '-'}</td>
                      <td className="p-3 md:p-4 text-muted-foreground text-[10px] md:text-sm text-center whitespace-nowrap" dir="ltr">{res.completed_at ? toFarsiNumber(new Date(res.completed_at).toLocaleString('fa-IR', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' })) : '-'}</td>
                      <td className="p-2 md:p-4 px-4 md:px-6 text-center whitespace-nowrap">
                        <ActionButtonGroup>
                          <ActionButton 
                            onClick={() => setViewingAttempt(res)} 
                            icon={Eye} 
                            title="مشاهده ریز نتایج" 
                            color="sky" 
                            disabled={res.status !== 'completed'}
                          />
                        </ActionButtonGroup>
                      </td>
                    </tr>
                  )}) : (
                  <tr>
                    <td colSpan={11} className="px-4 md:px-6 py-8">
                      {results.length > 0 ? (
                        <EmptyState icon={Search} title="موردی با این جستجو یافت نشد." description="" />
                      ) : (
                        <EmptyState icon={Users} title="هنوز شرکت‌کننده‌ای یافت نشد." description="" />
                      )}
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={11} className="px-4 md:px-6 py-8">
                    <EmptyState icon={FileQuestion} title="لطفاً برای مشاهده نتایج یک آزمون را انتخاب کنید." description="" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>

      {viewingAttempt && (
        <div className="fixed top-[72px] md:top-0 inset-x-0 bottom-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setViewingAttempt(null)}></div>
          <div className="relative w-full max-w-5xl h-full bg-muted/50 dark:bg-background rounded-3xl md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-border dark:border-border animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border dark:border-border bg-card/50 dark:bg-background/50 backdrop-blur-md z-10 shrink-0">
              <h3 className="font-bold">ریز نتایج: {viewingAttempt.full_name || 'کاربر بدون نام'}</h3>
              <button onClick={() => setViewingAttempt(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto w-full relative">
              <ExamViewer exam={examData} questions={questions} user={null} adminViewAttemptId={viewingAttempt.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
