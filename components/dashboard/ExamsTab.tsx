'use client';
import React from 'react';
import { Search, Play, Edit, Trash, Plus, FileText, BarChart2, List, ChevronDown } from 'lucide-react';
import { toFarsiNumber } from '@/utils/text.util';
import { useExamsTab } from '@/hooks/useExamsTab';

export function ExamsTab({ initialExams, onNavigate, onDataChanged, initialSearchTerm = '', isAdmin = false }: { initialExams: any[], onNavigate: (tab: string, param?: string) => void, onDataChanged: () => void, initialSearchTerm?: string, isAdmin?: boolean }) {
  const {
    exams,
    loading,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    showStatusDropdown,
    setShowStatusDropdown,
    dropdownRef,
    handleDelete,
    toggleStatus,
    getStatus,
    filteredExams
  } = useExamsTab(initialExams, onDataChanged, initialSearchTerm);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <List className="w-7 h-7 text-primary" />
            لیست آزمون‌ها
          </h2>
          <p className="text-slate-500 mt-2 font-medium">مدیریت و بررسی آزمون‌های ایجاد شده</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-20 w-full">
          <div className="relative w-full md:flex-[6]">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="جستجو در آزمون‌ها..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
            />
          </div>
          
          <div className="flex flex-row items-center gap-2 md:gap-3 w-full md:flex-[4]">
            <div className="relative flex-1" ref={dropdownRef}>
              <button 
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="w-full px-3 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="truncate max-w-[100px] md:max-w-none">
                    {selectedStatus === 'all' ? 'همه وضعیت‌ها' : selectedStatus === 'active' ? 'در حال اجرا' : 'غیر فعال'}
                  </span>
                  <span className="w-5 h-5 flex shrink-0 items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] rounded-full">
                    {toFarsiNumber(selectedStatus === 'all' ? exams.length : exams.filter(e => getStatus(e) === selectedStatus).length)}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 md:mr-3 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showStatusDropdown && (
                <div className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col p-2 animate-in fade-in zoom-in-95 duration-100 origin-top">
                  <div className="space-y-1 p-1">
                    <button 
                      onClick={() => { setSelectedStatus('all'); setShowStatusDropdown(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-colors ${selectedStatus === 'all' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' : 'hover:bg-slate-50 text-slate-700 dark:hover:bg-slate-700/50 dark:text-slate-300'}`}
                    >
                      <span>همه وضعیت‌ها</span>
                      <span className={`w-5 h-5 flex items-center justify-center text-[10px] rounded-full ${selectedStatus === 'all' ? 'bg-indigo-200 dark:bg-indigo-800' : 'bg-slate-200 dark:bg-slate-700'}`}>{toFarsiNumber(exams.length)}</span>
                    </button>
                    <button 
                      onClick={() => { setSelectedStatus('active'); setShowStatusDropdown(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-colors ${selectedStatus === 'active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' : 'hover:bg-slate-50 text-slate-700 dark:hover:bg-slate-700/50 dark:text-slate-300'}`}
                    >
                      <span>در حال اجرا</span>
                      <span className={`w-5 h-5 flex items-center justify-center text-[10px] rounded-full ${selectedStatus === 'active' ? 'bg-emerald-200 dark:bg-emerald-800' : 'bg-slate-200 dark:bg-slate-700'}`}>{toFarsiNumber(exams.filter(e => getStatus(e) === 'active').length)}</span>
                    </button>
                    <button 
                      onClick={() => { setSelectedStatus('inactive'); setShowStatusDropdown(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-colors ${selectedStatus === 'inactive' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300' : 'hover:bg-slate-50 text-slate-700 dark:hover:bg-slate-700/50 dark:text-slate-300'}`}
                    >
                      <span>غیر فعال</span>
                      <span className={`w-5 h-5 flex items-center justify-center text-[10px] rounded-full ${selectedStatus === 'inactive' ? 'bg-rose-200 dark:bg-rose-800' : 'bg-slate-200 dark:bg-slate-700'}`}>{toFarsiNumber(exams.filter(e => getStatus(e) === 'inactive').length)}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {!isAdmin && (
              <button 
                onClick={() => onNavigate('create')}
                className="flex whitespace-nowrap items-center justify-center gap-1.5 md:gap-2 px-3 md:px-5 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all font-bold text-xs md:text-sm shrink-0 shadow-lg shadow-primary/25"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" /> 
                <span className="hidden sm:inline">ساخت آزمون جدید</span>
                <span className="sm:hidden inline">آزمون جدید</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 md:-mx-6 pb-2 md:pb-4">
          <table className="w-full text-right border-collapse min-w-max md:min-w-[800px] z-10 relative">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs md:text-sm border-y border-slate-100 dark:border-slate-800">
                <th className="p-3 md:p-4 px-4 md:px-6 font-semibold w-32 md:w-2/5">عنوان آزمون</th>
                {isAdmin && <th className="p-3 md:p-4 font-semibold text-center w-32">سازنده</th>}
                <th className="p-3 md:p-4 font-semibold text-center w-24 md:w-32">وضعیت</th>
                <th className="p-3 md:p-4 font-semibold text-center w-20 md:w-28">سوالات</th>
                <th className="p-3 md:p-4 font-semibold text-center w-20 md:w-28">زمان</th>
                <th className="p-3 md:p-4 font-semibold w-24 md:w-32 text-center whitespace-nowrap">تاریخ ایجاد</th>
                <th className="p-3 md:p-4 px-4 md:px-6 font-semibold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
              {filteredExams.map((exam) => {
                const status = getStatus(exam);
                return (
                 <tr key={exam.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                   <td className="p-3 md:p-4 px-4 md:px-6 font-bold text-slate-800 dark:text-slate-200">{exam.title}</td>
                   {isAdmin && (
                     <td className="p-3 md:p-4 text-center text-slate-500 font-medium truncate max-w-[150px]" title={exam.profiles?.email || 'نامشخص'}>
                       {exam.profiles?.email || 'نامشخص'}
                     </td>
                   )}
                   <td className="p-2 md:p-4 text-center">
                     <button 
                       onClick={() => toggleStatus(exam)}
                       disabled={loading}
                       className={`px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-bold rounded-lg border-2 outline-none transition-colors w-full cursor-pointer text-center
                          ${status === 'active' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100' :
                             'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-100'}
                       `}
                     >
                       {status === 'active' ? 'در حال اجرا' : 'غیر فعال'}
                     </button>
                   </td>
                   <td className="p-3 md:p-4 font-medium text-slate-600 dark:text-slate-400 text-center">
                     {toFarsiNumber(exam.exam_questions?.[0]?.count || 0)}
                   </td>
                   <td className="p-3 md:p-4 text-center">
                     <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-300">
                       {toFarsiNumber(exam.time_limit_minutes || 0)}
                     </span>
                   </td>
                   <td className="p-3 md:p-4 text-[10px] md:text-sm text-slate-500 text-center whitespace-nowrap">
                     {toFarsiNumber(new Date(exam.created_at).toLocaleDateString('fa-IR'))}
                   </td>
                   <td className="p-2 md:p-4 px-3 md:px-6 text-center whitespace-nowrap">
                     <div className="inline-flex items-center justify-center gap-1.5 md:gap-2 opacity-100 md:opacity-70 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => window.open(`/view/${exam.id}`, '_blank')} className="p-1.5 md:p-2 bg-sky-50 text-sky-600 hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-400 rounded-lg md:rounded-xl transition-colors tooltip-trigger" title="پیش‌نمایش">
                         <Play className="w-3.5 h-3.5 md:w-4 md:h-4" />
                       </button>
                       <button onClick={() => onNavigate('edit', exam.id)} className="p-1.5 md:p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 rounded-lg md:rounded-xl transition-colors tooltip-trigger" title="ویرایش">
                         <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                       </button>
                       <button onClick={() => onNavigate('reports', exam.id)} className="p-1.5 md:p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-lg md:rounded-xl transition-colors tooltip-trigger" title="مشاهده نتایج">
                         <BarChart2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                       </button>
                       <button onClick={() => handleDelete(exam.id)} disabled={loading} className="p-1.5 md:p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 rounded-lg md:rounded-xl transition-colors tooltip-trigger" title="حذف">
                         <Trash className="w-3.5 h-3.5 md:w-4 md:h-4" />
                       </button>
                     </div>
                   </td>
                 </tr>
                );
              })}
              {filteredExams.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 m-4">
                      {exams.length > 0 ? (
                        <>
                          <Search className="w-12 h-12 text-slate-300 mb-4" />
                          <p className="font-medium">آزمونی پیدا نشد.</p>
                        </>
                      ) : (
                        <>
                          <FileText className="w-12 h-12 text-slate-300 mb-4" />
                          <p className="font-medium">هنوز هیچ آزمونی ساخته نشده است.</p>
                          {!isAdmin && (
                            <button onClick={() => onNavigate('create')} className="mt-4 text-primary hover:underline text-sm font-bold">همین الان اولین آزمون را بسازید</button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


