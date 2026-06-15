'use client';
import React from 'react';
import { Search, Shuffle, ListChecks, ArrowRight, X, Loader2, CheckCircle2, Check } from 'lucide-react';
import { toFarsiNumber } from '@/utils/text.util';

export function ExamFormStep2({
  selectionMode, setSelectionMode,
  searchQuery, setSearchQuery,
  selectedTopics, setSelectedTopics,
  randomCounts, setRandomCounts,
  allTopics, filteredQuestions,
  toggleTopicFilter, toggleSelection,
  isSelected,
  applyRandomGeneration,
  selectedQuestions,
  loading,
  setStep
}: any) {
  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <div className="flex p-1.5 md:p-2 mx-3 mt-4 md:mx-6 md:mt-6 gap-1.5 md:gap-2 bg-slate-100 dark:bg-slate-800/60 rounded-xl md:rounded-2xl">
        <button 
          onClick={() => setSelectionMode('manual')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 md:py-4 md:px-6 text-sm md:text-base font-bold rounded-xl md:rounded-2xl transition-all ${selectionMode === 'manual' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
        >
          <ListChecks className="w-4 h-4 md:w-5 md:h-5" />
          انتخاب دستی
        </button>
        <button 
          onClick={() => setSelectionMode('random')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 md:py-4 md:px-6 text-sm md:text-base font-bold rounded-xl md:rounded-2xl transition-all ${selectionMode === 'random' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
        >
          <Shuffle className="w-4 h-4 md:w-5 md:h-5" />
          تولید تصادفی
        </button>
      </div>

      <div className="p-3 md:p-8">
        {selectionMode === 'manual' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row gap-4 relative">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="جستجو در سوالات..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl py-3 md:py-3.5 pr-10 md:pr-12 pl-4 outline-none focus:ring-2 focus:ring-primary/50 text-xs md:text-sm transition-all"
                />
              </div>
            </div>

            {/* Topics filter */}
            {allTopics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                 <button onClick={() => setSelectedTopics([])} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[11px] md:text-sm font-bold border transition-colors ${selectedTopics.length === 0 ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-200 dark:text-slate-900 border-transparent' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>همه موضوعات</button>
                 {allTopics.map((topic: string) => (
                   <button key={topic} onClick={() => toggleTopicFilter(topic)} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[11px] md:text-sm font-bold border flex items-center gap-1.5 md:gap-2 transition-colors ${selectedTopics.includes(topic) ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                     {topic}
                     {selectedTopics.includes(topic) && <X className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                   </button>
                 ))}
              </div>
            )}

            {/* Question List */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto p-1 pr-2 md:-mx-1 custom-scrollbar">
              {loading ? (
                 <div className="flex items-center justify-center py-20 text-slate-400"><Loader2 className="w-8 h-8 animate-spin" /></div>
              ) : filteredQuestions.length === 0 ? (
                 <div className="text-center py-16 text-slate-500 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-sm">سوالی یافت نشد.</div>
              ) : (
                filteredQuestions.map((q: any) => {
                  const selected = isSelected(q.id);
                  return (
                    <div key={q.id} onClick={() => toggleSelection(q)} className={`p-3 md:p-4 rounded-xl border cursor-pointer transition-all ${selected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-md'}`}>
                       <div className="flex gap-2 md:gap-3 items-start">
                         <div className={`mt-0.5 w-4 h-4 md:w-5 md:h-5 rounded-[4px] md:rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${selected ? 'bg-primary border-primary text-white' : 'border-slate-300 dark:border-slate-600 bg-transparent'}`}>
                           {selected && <Check className="w-3 h-3 md:w-3.5 md:h-3.5 stroke-[3] translate-y-px" />}
                         </div>
                         <div className="flex-1 overflow-hidden">
                           <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                             <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{q.content}</span>
                             {q.topic && <span className="w-fit text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">{q.topic}</span>}
                           </div>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                             {q.options?.map((opt: string, idx: number) => (
                               <div key={idx} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${idx === q.correct_option_index ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-800'}`}>
                                 {toFarsiNumber(opt)}
                               </div>
                             ))}
                           </div>
                         </div>
                       </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {selectionMode === 'random' && (
          <div className="space-y-6 md:space-y-8 animate-in fade-in w-full">
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto shadow-sm">
               <table className="w-full text-xs md:text-sm text-right table-fixed">
                 <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                   <tr>
                     <th className="px-2 md:px-5 py-3 md:py-4 font-bold text-slate-700 dark:text-slate-300 w-[50%] md:w-auto">موضوع</th>
                     <th className="px-1 md:px-5 py-3 md:py-4 font-bold text-slate-700 dark:text-slate-300 w-[25%] text-center md:text-right md:w-auto">موجودی<span className="hidden md:inline"> کل</span></th>
                     <th className="px-2 md:px-5 py-3 md:py-4 font-bold text-slate-700 dark:text-slate-300 w-[25%] text-center md:text-right md:w-40">تعداد<span className="hidden md:inline"> انتخابی</span></th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                   {allTopics.map((topic: string) => {
                     const availableCount = filteredQuestions.filter((q: any) => q.topic === topic && !isSelected(q.id)).length;
                     return (
                       <tr key={topic} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                         <td className="px-2 md:px-5 py-3 md:py-4 font-bold text-slate-800 dark:text-slate-200 truncate" title={topic}>{topic}</td>
                         <td className="px-1 md:px-5 py-3 md:py-4 text-slate-500 font-bold text-center md:text-right">{toFarsiNumber(availableCount)} <span className="hidden md:inline text-[10px] md:text-xs font-normal opacity-70">امکان انتخاب</span></td>
                         <td className="px-2 md:px-5 py-2 md:py-3">
                           <input 
                             type="number" 
                             min="0" 
                             max={availableCount}
                             value={randomCounts[topic] || ''}
                             onChange={e => setRandomCounts({...randomCounts, [topic]: Number(e.target.value)})}
                             placeholder="0"
                             className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg md:rounded-xl px-1 md:px-4 py-1.5 md:py-2.5 text-center text-xs md:text-sm font-bold outline-none focus:ring-2 focus:ring-primary/50 dir-ltr transition-all"
                           />
                         </td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
             </div>

             <div className="pt-2">
               <button onClick={applyRandomGeneration} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 transition-transform active:scale-[0.98] text-sm md:text-[15px]">
                 <Shuffle className="w-4 h-4 md:w-5 md:h-5" />
                 تولید و افزودن به سوالات منتخب
               </button>
             </div>
             
             {/* Selected Questions List */}
             {selectedQuestions.length > 0 && (
               <div className="mt-6 md:mt-10 pt-6 md:pt-8 border-t border-slate-200 dark:border-slate-800 space-y-3 md:space-y-4 animate-in fade-in">
                  <h3 className="font-bold text-base md:text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
                     سوالات انتخاب شده ({toFarsiNumber(selectedQuestions.length)})
                  </h3>
                  <div className="grid grid-cols-1 gap-2 md:gap-3 max-h-[460px] overflow-y-auto custom-scrollbar pr-2">
                    {selectedQuestions.map((q: any, idx: number) => (
                      <div key={q.id} className="flex justify-between items-center bg-slate-50/80 dark:bg-slate-800/30 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                         <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                            <span className="text-primary font-black text-xs md:text-sm w-4 md:w-5 shrink-0 text-left dir-ltr">{toFarsiNumber(idx + 1)}.</span>
                            <span className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200 truncate pr-1">{q.content}</span>
                            {q.topic && <span className="text-[10px] hidden sm:inline-block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 px-2 md:px-2.5 py-0.5 md:py-1 rounded-md whitespace-nowrap">{q.topic}</span>}
                         </div>
                         <button onClick={() => toggleSelection(q)} className="text-slate-400 hover:text-rose-500 p-2 md:p-2.5 shrink-0 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 rounded-lg md:rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors" title="حذف سوال">
                           <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                         </button>
                      </div>
                    ))}
                  </div>
               </div>
             )}
          </div>
        )}
      </div>

      {/* Footer with Publish Button */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
        <div className="font-bold text-slate-700 dark:text-slate-300 w-full md:w-auto text-center md:text-right text-sm md:text-base">
           <span className="text-primary text-lg md:text-xl ml-2">{toFarsiNumber(selectedQuestions.length)}</span>
           سوال انتخاب شده
        </div>
        <button 
          onClick={() => setStep(1)}
          className="bg-white hover:bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 h-10 md:h-12 px-4 md:px-6 rounded-xl w-full md:w-auto text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          مرحله قبلی
        </button>
      </div>
    </div>
  );
}
