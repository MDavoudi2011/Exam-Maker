'use client';
import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { STUDENT_DETAILS_FIELDS } from '@/constants/exam.constant';

export function ExamFormStep1({
  title, setTitle,
  description, setDescription,
  isTimeLimited, setIsTimeLimited,
  timeLimit, setTimeLimit,
  showResults, setShowResults,
  studentDetails, setStudentDetails,
  handleNextStep,
  secondaryButton
}: any) {
  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="w-full md:w-[65%] space-y-6 md:space-y-8">
          <div className="space-y-3">
            <label className="text-base md:text-lg font-black text-slate-800 dark:text-slate-200 block">عنوان آزمون <span className="text-rose-500">*</span></label>
            <input 
              value={title} onChange={e => setTitle(e.target.value)}
              type="text" placeholder="مثال: کوییز پایانی برنامه‌نویسی ری‌اکت"
              className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 transition-all text-sm md:text-base font-medium"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-base md:text-lg font-black text-slate-800 dark:text-slate-200 block">توضیحات (اختیاری)</label>
            <textarea 
              value={description} onChange={e => setDescription(e.target.value)}
              placeholder="توضیحاتی کوتاه درباره محتوای آزمون، قوانین یا مباحث..."
              className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 transition-all text-sm md:text-base font-medium min-h-[120px] md:min-h-[168px] resize-y"
            ></textarea>
          </div>

          <div className="space-y-4">
             <div className="grid grid-cols-1 gap-3 md:gap-4">
               <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/30 p-3 md:p-4 border border-slate-100 dark:border-slate-800 rounded-xl md:rounded-2xl">
                 <div>
                   <div className="text-[13px] md:text-sm font-bold text-slate-800 dark:text-slate-200">الزام زمان‌بندی</div>
                   <div className="text-[11px] md:text-xs text-slate-500 mt-0.5">آزمون محدودیت زمانی داشته باشد</div>
                 </div>
                 <div className="flex items-center gap-2 md:gap-3 flex-row-reverse md:flex-row">
                   <label className="relative inline-flex items-center cursor-pointer shrink-0" dir="ltr">
                     <input type="checkbox" className="sr-only peer" checked={isTimeLimited} onChange={e => setIsTimeLimited(e.target.checked)} />
                     <div className="w-9 h-5 md:w-11 md:h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                   </label>
                   {isTimeLimited && (
                     <div className="flex items-center gap-1.5 md:gap-2 animate-in zoom-in duration-200">
                       <input 
                         value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))}
                         type="number" min="1"
                         className="w-12 md:w-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary/50 rounded-lg px-1 md:px-2 py-1 md:py-1.5 transition-all font-bold text-center dir-ltr text-xs md:text-sm"
                       />
                       <span className="text-[10px] md:text-xs font-bold text-slate-500">دقیقه</span>
                     </div>
                   )}
                 </div>
               </div>

               <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/30 p-3 md:p-4 border border-slate-100 dark:border-slate-800 rounded-xl md:rounded-2xl">
                 <div>
                   <div className="text-[13px] md:text-sm font-bold text-slate-800 dark:text-slate-200">نمایش نتایج</div>
                   <div className="text-[11px] md:text-xs text-slate-500 mt-0.5">کارنامه پس از پایان نمایش داده شود</div>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer shrink-0" dir="ltr">
                   <input type="checkbox" className="sr-only peer" checked={showResults} onChange={e => setShowResults(e.target.checked)} />
                   <div className="w-9 h-5 md:w-11 md:h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                 </label>
               </div>
             </div>
          </div>
        </div>

        <div className="w-full md:w-[35%]">
           <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 dark:border-slate-800 h-full flex flex-col">
             <label className="text-base md:text-lg font-black text-slate-800 dark:text-slate-200 block mb-4 md:mb-6">دریافت مشخصات فردی</label>
             <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3 flex-1">
               {STUDENT_DETAILS_FIELDS.map((field: any) => (
                 <div 
                   key={field.id}
                   onClick={() => setStudentDetails({...studentDetails, [field.id]: !studentDetails[field.id as keyof typeof studentDetails]})}
                   className={`cursor-pointer px-3 py-2.5 md:px-4 md:py-3.5 rounded-xl border flex items-center gap-2 md:gap-3 transition-all text-[11px] md:text-sm font-bold ${studentDetails[field.id as keyof typeof studentDetails] ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                 >
                   <div className={`w-4 h-4 md:w-5 md:h-5 rounded-[4px] md:rounded-md border flex items-center justify-center shrink-0 transition-colors ${studentDetails[field.id as keyof typeof studentDetails] ? 'bg-primary border-primary text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600'}`}>
                     {studentDetails[field.id as keyof typeof studentDetails] && <Check className="w-3 h-3 md:w-4 md:h-4 stroke-[3]" />}
                   </div>
                   <span className="truncate">{field.label}</span>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>

      <div className={`flex flex-col-reverse md:flex-row gap-3 md:gap-4 ${secondaryButton ? 'items-center md:justify-between' : 'justify-end'} pt-2 md:pt-4`}>
        {secondaryButton && (                 
           <div className="w-full md:w-auto [&>button]:w-full [&>button]:md:w-auto">
             {secondaryButton}
           </div>
        )}
        <button onClick={handleNextStep} className="bg-primary hover:bg-primary/90 text-white h-12 px-6 rounded-xl text-sm font-bold flex items-center justify-center w-full md:w-auto gap-2 shadow-sm transition-all active:scale-[0.98]">
          مرحله بعد
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
