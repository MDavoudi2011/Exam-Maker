'use client';
import React, { useState } from 'react';
import { Search, Loader2, Edit, Trash, Eye, Plus, ChevronDown, Check, X, ChevronRight, ChevronLeft, Database } from 'lucide-react';
import { toFarsiNumber } from '@/utils/text.util';
import { ITEMS_PER_PAGE_OPTIONS } from '@/constants/exam.constant';
import { getTopicColor } from '@/utils/styles.util';
import { useQuestionBankTab, useEditModal } from '@/hooks/useQuestionBankTab';
import { useResponsivePagination } from '@/hooks/useResponsivePagination';
import { RenderContent } from '@/components/ui/RenderContent';
import { EditModal } from '@/components/dashboard/QuestionBankEditModal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { ActionButton, ActionButtonGroup } from '@/components/ui/ActionButton';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { EmptyState } from '@/components/ui/EmptyState';

export function QuestionBankTab({ userRole = 'user' }: { userRole?: string }) {
  const {
    questions,
    topics,
    selectedTopic,
    setSelectedTopic,
    searchTerm,
    setSearchTerm,
    loading,
    editingQuestion,
    setEditingQuestion,
    previewQuestion,
    setPreviewQuestion,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    showItemsPerPageDropdown,
    setShowItemsPerPageDropdown,
    showTopicDropdown,
    setShowTopicDropdown,
    newTopic,
    setNewTopic,
    showAddTopic,
    setShowAddTopic,
    dropdownRef,
    itemsPerPageRef,
    fetchQuestions,
    handleDelete,
    handleAddTopic,
    filteredQuestions,
    totalPages,
    paginatedQuestions
  } = useQuestionBankTab();

  const { getVisiblePages } = useResponsivePagination(currentPage, totalPages);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <SectionHeader icon={Database} title="بانک سوالات" description="مدیریت و دسته‌بندی تمامی سوالات سیستم" />
      </div>

      <DashboardCard>
        <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-20 w-full">
          <div className="relative flex-1">
            <SearchBar 
              value={searchTerm}
              onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
              placeholder="جستجو در متن سوالات..."
            />
          </div>
          
          <div className="flex flex-row items-center gap-4 w-full md:w-auto shrink-0 z-10">
            <FilterDropdown
              value={selectedTopic}
              options={[
                { value: 'all', label: 'همه موضوعات', count: questions.length },
                ...topics.map(t => ({ value: t, label: t, count: questions.filter(q => q.topic === t).length }))
              ]}
              onChange={(val) => { setSelectedTopic(val); setCurrentPage(1); }}
              isOpen={showTopicDropdown}
              onToggle={() => setShowTopicDropdown(!showTopicDropdown)}
              onClose={() => setShowTopicDropdown(false)}
              className="md:w-64"
              footer={
                !showAddTopic ? (
                  <button 
                    onClick={() => setShowAddTopic(true)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-colors"
                  >
                    <Plus className="w-4 h-4" /> افزودن موضوع جدید
                  </button>
                ) : (
                  <div className="flex flex-col gap-2 p-1">
                    <input 
                      type="text" 
                      placeholder="نام موضوع..." 
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTopic();
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex gap-2">
                       <button onClick={handleAddTopic} className="flex-1 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors">ثبت</button>
                       <button onClick={() => {setShowAddTopic(false); setNewTopic('');}} className="flex-1 py-2 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors">انصراف</button>
                    </div>
                  </div>
                )
              }
            />
            
              <PrimaryButton 
                onClick={() => setEditingQuestion({ content: '', options: ['', '', '', ''], correct_option_index: 0, topic: '', point_value: 10 })}
                icon={<Plus className="w-4 h-4 md:w-5 md:h-5" />}
              >
                <span className="hidden sm:inline">افزودن سوال</span>
                <span className="sm:hidden inline">سوال جدید</span>
              </PrimaryButton>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 md:-mx-6 pb-2 md:pb-4">
          {loading ? (
             <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <>
            <table className="w-full text-right z-10 relative table-auto">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs md:text-sm border-y border-slate-100 dark:border-slate-800">
                  <th className="hidden md:table-cell p-3 md:p-4 pr-4 md:pr-6 font-semibold w-px whitespace-nowrap text-center">موضوع</th>
                  <th className="p-3 md:p-4 pr-4 md:pr-0 font-semibold text-right">عنوان سوال</th>
                  <th className="p-3 md:p-4 pl-4 md:pl-6 font-semibold w-px whitespace-nowrap text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm">
                {paginatedQuestions.length > 0 ? paginatedQuestions.map((q, idx) => {
                  const bgClass = getTopicColor(q.topic).split(' ').filter(c => c.startsWith('bg-') || c.startsWith('dark:bg-')).join(' ');

                  return (
                  <tr key={q.id || idx} className={`transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 group ${bgClass} !bg-opacity-40 dark:!bg-opacity-20 hover:!bg-opacity-60 dark:hover:!bg-opacity-40 md:!bg-transparent md:dark:!bg-transparent md:hover:!bg-slate-50 md:dark:hover:!bg-slate-800/50`}>
                    <td className="hidden md:table-cell p-3 md:p-4 pr-4 md:pr-6 text-center w-px whitespace-nowrap font-bold">
                      <span className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg inline-block align-middle text-[10px] md:text-xs ${getTopicColor(q.topic)}`}>{q.topic || 'بدون دسته‌بندی'}</span>
                    </td>
                    <td className="p-3 md:p-4 pr-4 md:pr-0 font-medium text-slate-800 dark:text-slate-200 text-right">
                       <p className="line-clamp-2 md:line-clamp-1">{q.content}</p>
                    </td>
                    <td className="p-2 md:p-4 pl-4 md:pl-6 text-center w-px whitespace-nowrap">
                      <ActionButtonGroup>
                        <ActionButton onClick={() => setPreviewQuestion(q)} icon={Eye} title="پیش‌نمایش" color="sky" />
                        {userRole === 'admin' && (
                          <>
                            <ActionButton onClick={() => setEditingQuestion(q)} icon={Edit} title="ویرایش" color="emerald" />
                            <ActionButton onClick={() => handleDelete(q.id)} icon={Trash} title="حذف" color="rose" />
                          </>
                        )}
                      </ActionButtonGroup>
                    </td>
                  </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={3} className="px-4 md:px-6 py-8">
                       <EmptyState icon={Database} title="سوالاتی یافت نشد" description="" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {filteredQuestions.length > 0 && (
              <div className="flex flex-row items-center justify-between gap-2 mt-6 px-2 w-full pb-2">
                <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-slate-500 font-medium whitespace-nowrap">
                  <span className="hidden sm:inline">تعداد در صفحه:</span>
                  <div className="relative" ref={itemsPerPageRef}>
                    <button 
                      onClick={() => setShowItemsPerPageDropdown(!showItemsPerPageDropdown)}
                      className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2 md:px-3 py-1.5 font-bold text-slate-700 dark:text-slate-300 min-w-[48px] md:min-w-[80px] flex items-center justify-between gap-1 md:gap-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <span className="text-xs md:text-sm">{itemsPerPage === 'all' ? 'همه' : toFarsiNumber(itemsPerPage)}</span>
                      <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 shrink-0 text-slate-400 transition-transform ${showItemsPerPageDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showItemsPerPageDropdown && (
                      <div className="absolute bottom-full mb-2 right-0 w-full min-w-full md:min-w-[100px] bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col p-1 animate-in fade-in zoom-in-95 origin-bottom z-50">
                        {ITEMS_PER_PAGE_OPTIONS.map(val => (
                          <button 
                            key={val}
                            onClick={() => { setItemsPerPage(val as number | 'all'); setCurrentPage(1); setShowItemsPerPageDropdown(false); }}
                            className={`px-2 md:px-3 py-1.5 md:py-2 text-right text-xs md:text-sm font-bold rounded-lg transition-colors ${itemsPerPage === val ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                          >
                             {val === 'all' ? 'همه' : toFarsiNumber(val)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {totalPages > 1 && itemsPerPage !== 'all' && (
                  <div className="flex items-center gap-1 md:gap-2 shrink-0" dir="ltr">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    
                    <div className="flex items-center gap-0.5 md:gap-1">
                      {getVisiblePages().map((page, i) => {
                        if (page === '...') {
                            return <span key={`ellipsis-${i}`} className="px-1 text-slate-400 font-bold">...</span>;
                        }
                        return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page as number)}
                          className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-colors ${currentPage === page ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                        >
                          {toFarsiNumber(page)}
                        </button>
                        );
                      })}
                    </div>

                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
          )}
        </div>
      </DashboardCard>

      {previewQuestion && (
        <div className="fixed top-[72px] md:top-0 inset-x-0 bottom-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setPreviewQuestion(null)}></div>
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="font-bold text-lg flex items-center gap-2"><Eye className="w-5 h-5 text-primary" /> پیش‌نمایش سوال</h3>
              <button onClick={() => setPreviewQuestion(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="mb-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl mb-6 text-slate-800 dark:text-slate-200 font-medium text-lg leading-relaxed border border-slate-100 dark:border-slate-800 whitespace-pre-wrap">
                <RenderContent content={previewQuestion.content} />
              </div>
              <div className="space-y-3">
                {previewQuestion.options && Array.isArray(previewQuestion.options) && previewQuestion.options.map((opt: string, i: number) => {
                  const isEnglish = /[a-zA-Z]/.test(opt) || (opt.trim().length > 0 && !/[\u0600-\u06FF]/.test(opt));
                  return (
                  <div key={i} className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${previewQuestion.correct_option_index === i ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700'}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${previewQuestion.correct_option_index === i ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                      {previewQuestion.correct_option_index === i && <Check className="w-3 h-3" />}
                    </div>
                    <span dir={isEnglish ? "ltr" : "rtl"} className={`block flex-1 font-medium ${isEnglish ? 'text-left' : ''} ${previewQuestion.correct_option_index === i ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'}`}><RenderContent content={opt} /></span>
                  </div>
                )})}
              </div>
            </div>
            <div className="flex gap-4 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
               <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${getTopicColor(previewQuestion.topic)}`}>{previewQuestion.topic || 'بدون دسته‌بندی'}</span>
               <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1.5 rounded-lg">نمره: {toFarsiNumber(previewQuestion.point_value || 1)}</span>
            </div>
          </div>
        </div>
      )}

      {editingQuestion && (
        <EditModal 
          question={editingQuestion} 
          topics={topics}
          onClose={() => setEditingQuestion(null)} 
          onSave={fetchQuestions}
        />
      )}
    </div>
  );
}
