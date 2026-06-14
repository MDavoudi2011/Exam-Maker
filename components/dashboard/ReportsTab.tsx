'use client';
import React, { useState } from 'react';
import { Download, Users, BarChart, Loader2, FileQuestion, ChevronDown, Eye, X, Search, Check, ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { toFarsiNumber } from '@/utils/text.util';
import { ExamViewer } from '@/components/viewer/ExamViewer';
import { useReportsTab } from '@/hooks/useReportsTab';

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
    sortConfig,
    requestSort,
    attemptCounts,
    showFullName,
    showNationalCode,
    showPersonnelCode,
    showOrgTitle,
    showClassName,
    showSchool,
    showDistrict
  } = useReportsTab(initialSelectedExamId);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const examDropdownRef = React.useRef<HTMLDivElement>(null);
  const sortDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (examDropdownRef.current && !examDropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <BarChart className="w-7 h-7 text-primary" />
            گزارش‌ها و نتایج
          </h2>
          <p className="text-slate-500 font-medium mt-2">مشاهده و تحلیل کارنامه و نتایج شرکت‌کنندگان</p>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-20 w-full">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder={selectedExamId ? "جستجو در تمام فیلدها..." : "ابتدا آزمون را انتخاب کنید"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={!selectedExamId}
              className={`w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium ${!selectedExamId ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>
          
          <div className="relative w-full md:w-64 shrink-0" ref={examDropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-3 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="truncate max-w-[150px] md:max-w-none">
                  {selectedExamId && initialExams ? initialExams.find(e => e.id === selectedExamId)?.title || 'آزمون نامشخص' : 'انتخاب آزمون...'}
                </span>
                <span className="w-5 h-5 flex shrink-0 items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] rounded-full">
                  {toFarsiNumber(selectedExamId ? attemptCounts[selectedExamId] || 0 : Object.values(attemptCounts).reduce((a,b)=>a+b,0))}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 md:mr-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
              
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col p-2 animate-in fade-in zoom-in-95 duration-100 origin-top z-50 max-h-80 overflow-y-auto">
                <div className="space-y-1 p-1">
                  {initialExams?.map(exam => {
                    const count = attemptCounts[exam.id] || 0;
                    const isSelected = selectedExamId === exam.id;
                    return (
                      <button
                        key={exam.id}
                        onClick={() => {
                          setSelectedExamId(exam.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex justify-between items-center px-3 py-2 rounded-xl text-sm font-bold transition-colors text-right ${isSelected ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-slate-50 text-slate-700 dark:hover:bg-slate-700/50 dark:text-slate-300'}`}
                      >
                         <div className="flex items-center gap-2">
                           <span className="truncate max-w-[180px]">{exam.title}</span>
                         </div>
                         <span className={`w-5 h-5 flex shrink-0 items-center justify-center text-[10px] rounded-full ${isSelected ? 'bg-primary/20 text-primary dark:bg-primary/30' : 'bg-slate-200 dark:bg-slate-700'}`}>{count > 0 ? toFarsiNumber(count) : '-'}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
            
          <div className="relative w-full md:w-56 shrink-0" ref={sortDropdownRef}>
            <button 
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              disabled={!selectedExamId}
              className={`w-full px-3 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between ${!selectedExamId ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-2">
                <span className="truncate">
                  {sortConfig?.key === 'full_name' ? 'نام و نام خانوادگی' : sortConfig?.key === 'score' ? 'نمره' : sortConfig?.key === 'created_at' ? 'تاریخ شروع' : sortConfig?.key === 'completed_at' ? 'تاریخ پایان' : 'مرتب‌سازی'}
                </span>
                {sortConfig && (sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 shrink-0 text-primary" /> : <ArrowDown className="w-4 h-4 shrink-0 text-primary" />)}
              </div>
              <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 md:mr-3 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isSortDropdownOpen && (
               <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col p-2 animate-in fade-in zoom-in-95 duration-100 origin-top z-50">
                 <div className="space-y-1 p-1">
                   {[
                     { k: 'full_name', l: 'نام و نام خانوادگی' },
                     { k: 'score', l: 'نمره' },
                     { k: 'created_at', l: 'تاریخ شروع' },
                     { k: 'completed_at', l: 'تاریخ پایان' }
                   ].map(opt => (
                       <button 
                         key={opt.k}
                         onClick={() => { requestSort(opt.k); setIsSortDropdownOpen(false); }}
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

        <div className="overflow-x-auto -mx-4 md:-mx-6 pb-2 md:pb-4">
          <table className="w-full text-right border-collapse min-w-max md:min-w-[800px] z-10 relative">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs md:text-sm border-y border-slate-100 dark:border-slate-800">
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
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
              {loading ? (
                <tr>
                   <td colSpan={11} className="p-16 text-center">
                     <div className="flex justify-center items-center">
                       <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                     </div>
                   </td>
                </tr>
              ) : selectedExamId ? (
                sortedAndFilteredResults.length > 0 ? sortedAndFilteredResults.map((res: any) => {
                  return (
                  <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    {showFullName && <td className="p-3 md:p-4 px-4 md:px-6 font-bold text-slate-800 dark:text-slate-200">{res.full_name || '-'}</td>}
                    {showNationalCode && <td className="p-3 md:p-4 font-medium text-slate-600 dark:text-slate-400 text-center">{res.national_code || '-'}</td>}
                    {showPersonnelCode && <td className="p-3 md:p-4 font-medium text-slate-600 dark:text-slate-400 text-center">{res.personnel_code || '-'}</td>}
                    {showOrgTitle && <td className="p-3 md:p-4 font-medium text-slate-600 dark:text-slate-400 text-center">{res.org_title || '-'}</td>}
                    {showClassName && <td className="p-3 md:p-4 font-medium text-slate-600 dark:text-slate-400 text-center">{res.class_name || '-'}</td>}
                    {showSchool && <td className="p-3 md:p-4 font-medium text-slate-600 dark:text-slate-400 text-center">{res.school || '-'}</td>}
                    {showDistrict && <td className="p-3 md:p-4 font-medium text-slate-600 dark:text-slate-400 text-center">{res.district || '-'}</td>}
                    <td className="p-3 md:p-4 text-center">
                      {res.status === 'completed' ? (
                      <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-black inline-block min-w-[3rem]">
                        {res.score !== null ? toFarsiNumber(res.score) : '-'}
                      </span>
                      ) : (
                        <span className="text-[10px] md:text-xs text-slate-400 font-bold">در حال انجام</span>
                      )}
                    </td>
                    <td className="p-3 md:p-4 text-slate-500 text-[10px] md:text-sm text-center whitespace-nowrap" dir="ltr">{res.created_at ? toFarsiNumber(new Date(res.created_at).toLocaleString('fa-IR', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' })) : '-'}</td>
                    <td className="p-3 md:p-4 text-slate-500 text-[10px] md:text-sm text-center whitespace-nowrap" dir="ltr">{res.completed_at ? toFarsiNumber(new Date(res.completed_at).toLocaleString('fa-IR', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' })) : '-'}</td>
                    <td className="p-2 md:p-4 px-4 md:px-6 text-center whitespace-nowrap">
                      <div className="inline-flex items-center justify-center opacity-100 md:opacity-70 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setViewingAttempt(res)} className="p-1.5 md:p-2 bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-sky-500/10 dark:hover:text-sky-400 rounded-lg md:rounded-xl transition-all shadow-sm tooltip-trigger" disabled={res.status !== 'completed'} title="مشاهده ریز نتایج">
                          <Eye className={`w-4 h-4 md:w-5 md:h-5 ${res.status !== 'completed' ? 'opacity-30' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}) : (
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 m-4">
                        {results.length > 0 ? (
                           <>
                             <Search className="w-12 h-12 text-slate-300 mb-4" />
                             <h3 className="font-bold text-lg text-slate-400 dark:text-slate-500">موردی با این جستجو یافت نشد.</h3>
                           </>
                        ) : (
                           <>
                             <Users className="w-12 h-12 text-slate-300 mb-4" />
                             <h3 className="font-bold text-lg text-slate-400 dark:text-slate-500">هنوز شرکت‌کننده‌ای یافت نشد.</h3>
                           </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500">
                     <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 m-4">
                        <FileQuestion className="w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="font-bold text-lg text-slate-400 dark:text-slate-500">لطفاً برای مشاهده نتایج یک آزمون را انتخاب کنید.</h3>
                      </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewingAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingAttempt(null)}></div>
          <div className="relative w-full max-w-5xl h-full max-h-screen bg-slate-50 dark:bg-slate-950 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md z-10">
              <h3 className="font-bold">ریز نتایج: {viewingAttempt.full_name || 'کاربر بدون نام'}</h3>
              <button onClick={() => setViewingAttempt(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
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
