'use client';
import React, { useState } from 'react';
import { Search, Loader2, Edit, Trash, Eye, Plus, ChevronDown, Check, X, ChevronRight, ChevronLeft, Database } from 'lucide-react';
// removed import
import { toFarsiNumber } from '@/utils/text.util';
import { ITEMS_PER_PAGE_OPTIONS } from '@/constants/exam.constant';
import { getTopicColor } from '@/utils/styles.util';
import { useQuestionBankTab, useEditModal } from '@/hooks/useQuestionBankTab';
import { useResponsivePagination } from '@/hooks/useResponsivePagination';
import { RenderContent } from '@/components/ui/RenderContent';
import { EditModal } from '@/components/dashboard/QuestionBankEditModal';

export function QuestionBankTab() {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <Database className="w-7 h-7 text-primary" />
            بانک سوالات
          </h2>
          <p className="text-slate-500 font-medium mt-2">مدیریت و دسته‌بندی تمامی سوالات سیستم</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-20 w-full">
          <div className="relative w-full md:flex-[6]">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="جستجو در متن سوالات..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
            />
          </div>
          
          <div className="flex flex-row items-center gap-2 md:gap-3 w-full md:flex-[4]">
            <div className="relative flex-1" ref={dropdownRef}>
              <button 
                onClick={() => setShowTopicDropdown(!showTopicDropdown)}
                className="w-full px-3 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="truncate max-w-[100px] md:max-w-none">{selectedTopic === 'all' ? 'همه موضوعات' : selectedTopic}</span>
                  <span className="w-5 h-5 flex shrink-0 items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] rounded-full">{toFarsiNumber(selectedTopic === 'all' ? questions.length : questions.filter(q => q.topic === selectedTopic).length)}</span>
                </div>
                <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 md:mr-3 transition-transform ${showTopicDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showTopicDropdown && (
                <div className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col p-2 animate-in fade-in zoom-in-95 duration-100 origin-top">
                  <div className="max-h-[200px] overflow-y-auto space-y-1 p-1 custom-scrollbar">
                    <button 
                      onClick={() => { setSelectedTopic('all'); setShowTopicDropdown(false); setCurrentPage(1); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-colors ${selectedTopic === 'all' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' : 'hover:bg-slate-50 text-slate-700 dark:hover:bg-slate-700/50 dark:text-slate-300'}`}
                    >
                      <span>همه موضوعات</span>
                      <span className={`w-5 h-5 flex items-center justify-center text-[10px] rounded-full ${selectedTopic === 'all' ? 'bg-indigo-200 dark:bg-indigo-800' : 'bg-slate-200 dark:bg-slate-700'}`}>{toFarsiNumber(questions.length)}</span>
                    </button>
                    {topics.map(t => (
                      <button 
                        key={t}
                        onClick={() => { setSelectedTopic(t); setShowTopicDropdown(false); setCurrentPage(1); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-colors ${selectedTopic === t ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' : 'hover:bg-slate-50 text-slate-700 dark:hover:bg-slate-700/50 dark:text-slate-300'}`}
                      >
                        <span>{t}</span>
                        <span className={`w-5 h-5 flex items-center justify-center text-[10px] rounded-full ${selectedTopic === t ? 'bg-indigo-200 dark:bg-indigo-800' : 'bg-slate-200 dark:bg-slate-700'}`}>{toFarsiNumber(questions.filter(q => q.topic === t).length)}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                    {!showAddTopic ? (
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
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setEditingQuestion({ content: '', options: ['', '', '', ''], correct_option_index: 0, topic: '', point_value: 10 })}
              className="flex whitespace-nowrap items-center justify-center gap-1.5 md:gap-2 px-3 md:px-5 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all font-bold text-xs md:text-sm shrink-0 shadow-lg shadow-primary/25"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" /> 
              <span className="hidden sm:inline">افزودن سوال</span>
              <span className="sm:hidden inline">سوال جدید</span>
            </button>
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
                      <div className="inline-flex flex-row items-center justify-center gap-1.5 md:gap-2 opacity-100 md:opacity-70 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setPreviewQuestion(q)} className="p-1.5 md:p-2 bg-sky-50 text-sky-600 hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-400 rounded-lg md:rounded-xl transition-colors tooltip-trigger" title="پیش‌نمایش">
                          <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                        <button onClick={() => setEditingQuestion(q)} className="p-1.5 md:p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-lg md:rounded-xl transition-colors tooltip-trigger" title="ویرایش">
                          <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                        <button onClick={() => handleDelete(q.id)} className="p-1.5 md:p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 rounded-lg md:rounded-xl transition-colors tooltip-trigger" title="حذف">
                          <Trash className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={3} className="p-10 text-center text-slate-500 font-medium">سوالاتی یافت نشد</td>
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
      </div>

      {previewQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
