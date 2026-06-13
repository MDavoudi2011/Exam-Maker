import React from 'react';

export function ExamViewerStudentForm({
  requiredFields,
  studentInfo,
  setStudentInfo,
  formErrors,
  setFormErrors
}: any) {
  return (
    <div className="space-y-6 w-full">
      {requiredFields.fullName && (
        <div className="flex flex-col gap-1.5 relative w-full group">
          <label className={`flex flex-row items-center border ${formErrors.fullName ? 'border-rose-400 dark:border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20'} rounded-2xl px-5 focus-within:ring-2 focus-within:ring-primary/50 transition-all focus-within:border-primary/50 cursor-text`}>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400 w-32 shrink-0 text-right pointer-events-none">نام و نام خانوادگی:</span>
            <input type="text" value={studentInfo.fullName || ''} onChange={e => {
              setStudentInfo({...studentInfo, fullName: e.target.value});
              if (formErrors.fullName) setFormErrors({...formErrors, fullName: ''});
            }} className="flex-1 w-full bg-transparent py-4 h-14 outline-none text-sm font-bold text-slate-800 dark:text-slate-200" />
          </label>
          {formErrors.fullName && <div className="absolute right-0 -top-10 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg before:content-[''] before:absolute before:top-full before:right-6 before:border-4 before:border-transparent before:border-t-rose-500 animate-in fade-in zoom-in duration-200">{formErrors.fullName}</div>}
        </div>
      )}
      {requiredFields.nationalCode && (
        <div className="flex flex-col gap-1.5 relative w-full group">
          <label className={`flex flex-row items-center border ${formErrors.nationalCode ? 'border-rose-400 dark:border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20'} rounded-2xl px-5 focus-within:ring-2 focus-within:ring-primary/50 transition-all focus-within:border-primary/50 cursor-text`}>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400 w-32 shrink-0 text-right pointer-events-none">کد ملی:</span>
            <input type="text" value={studentInfo.nationalCode || ''} onChange={e => {
              setStudentInfo({...studentInfo, nationalCode: e.target.value});
              if (formErrors.nationalCode) setFormErrors({...formErrors, nationalCode: ''});
            }} className="flex-1 w-full bg-transparent py-4 h-14 outline-none text-sm font-bold text-slate-800 dark:text-slate-200" />
          </label>
          {formErrors.nationalCode && <div className="absolute right-0 -top-10 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg before:content-[''] before:absolute before:top-full before:right-6 before:border-4 before:border-transparent before:border-t-rose-500 animate-in fade-in zoom-in duration-200">{formErrors.nationalCode}</div>}
        </div>
      )}
      {requiredFields.personnelCode && (
        <div className="flex flex-col gap-1.5 relative w-full group">
          <label className={`flex flex-row items-center border ${formErrors.personnelCode ? 'border-rose-400 dark:border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20'} rounded-2xl px-5 focus-within:ring-2 focus-within:ring-primary/50 transition-all focus-within:border-primary/50 cursor-text`}>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400 w-32 shrink-0 text-right pointer-events-none">کد پرسنلی:</span>
            <input type="text" value={studentInfo.personnelCode || ''} onChange={e => {
              setStudentInfo({...studentInfo, personnelCode: e.target.value});
              if (formErrors.personnelCode) setFormErrors({...formErrors, personnelCode: ''});
            }} className="flex-1 w-full bg-transparent py-4 h-14 outline-none text-sm font-bold text-slate-800 dark:text-slate-200" />
          </label>
          {formErrors.personnelCode && <div className="absolute right-0 -top-10 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg before:content-[''] before:absolute before:top-full before:right-6 before:border-4 before:border-transparent before:border-t-rose-500 animate-in fade-in zoom-in duration-200">{formErrors.personnelCode}</div>}
        </div>
      )}
      {requiredFields.orgTitle && (
        <div className="flex flex-col gap-1.5 relative w-full group">
          <label className={`flex flex-row items-center border ${formErrors.orgTitle ? 'border-rose-400 dark:border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20'} rounded-2xl px-5 focus-within:ring-2 focus-within:ring-primary/50 transition-all focus-within:border-primary/50 cursor-text`}>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400 w-32 shrink-0 text-right pointer-events-none">عنوان سازمانی:</span>
            <input type="text" value={studentInfo.orgTitle || ''} onChange={e => {
              setStudentInfo({...studentInfo, orgTitle: e.target.value});
              if (formErrors.orgTitle) setFormErrors({...formErrors, orgTitle: ''});
            }} className="flex-1 w-full bg-transparent py-4 h-14 outline-none text-sm font-bold text-slate-800 dark:text-slate-200" />
          </label>
          {formErrors.orgTitle && <div className="absolute right-0 -top-10 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg before:content-[''] before:absolute before:top-full before:right-6 before:border-4 before:border-transparent before:border-t-rose-500 animate-in fade-in zoom-in duration-200">{formErrors.orgTitle}</div>}
        </div>
      )}
      {requiredFields.className && (
        <div className="flex flex-col gap-1.5 relative w-full group">
          <label className={`flex flex-row items-center border ${formErrors.className ? 'border-rose-400 dark:border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20'} rounded-2xl px-5 focus-within:ring-2 focus-within:ring-primary/50 transition-all focus-within:border-primary/50 cursor-text`}>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400 w-32 shrink-0 text-right pointer-events-none">کلاس:</span>
            <input type="text" value={studentInfo.className || ''} onChange={e => {
              setStudentInfo({...studentInfo, className: e.target.value});
              if (formErrors.className) setFormErrors({...formErrors, className: ''});
            }} className="flex-1 w-full bg-transparent py-4 h-14 outline-none text-sm font-bold text-slate-800 dark:text-slate-200" />
          </label>
          {formErrors.className && <div className="absolute right-0 -top-10 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg before:content-[''] before:absolute before:top-full before:right-6 before:border-4 before:border-transparent before:border-t-rose-500 animate-in fade-in zoom-in duration-200">{formErrors.className}</div>}
        </div>
      )}
      {requiredFields.school && (
        <div className="flex flex-col gap-1.5 relative w-full group">
          <label className={`flex flex-row items-center border ${formErrors.school ? 'border-rose-400 dark:border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20'} rounded-2xl px-5 focus-within:ring-2 focus-within:ring-primary/50 transition-all focus-within:border-primary/50 cursor-text`}>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400 w-32 shrink-0 text-right pointer-events-none">مدرسه:</span>
            <input type="text" value={studentInfo.school || ''} onChange={e => {
              setStudentInfo({...studentInfo, school: e.target.value});
              if (formErrors.school) setFormErrors({...formErrors, school: ''});
            }} className="flex-1 w-full bg-transparent py-4 h-14 outline-none text-sm font-bold text-slate-800 dark:text-slate-200" />
          </label>
          {formErrors.school && <div className="absolute right-0 -top-10 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg before:content-[''] before:absolute before:top-full before:right-6 before:border-4 before:border-transparent before:border-t-rose-500 animate-in fade-in zoom-in duration-200">{formErrors.school}</div>}
        </div>
      )}
      {requiredFields.district && (
        <div className="flex flex-col gap-1.5 relative w-full group">
          <label className={`flex flex-row items-center border ${formErrors.district ? 'border-rose-400 dark:border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20'} rounded-2xl px-5 focus-within:ring-2 focus-within:ring-primary/50 transition-all focus-within:border-primary/50 cursor-text`}>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400 w-32 shrink-0 text-right pointer-events-none">ناحیه / منطقه:</span>
            <input type="text" value={studentInfo.district || ''} onChange={e => {
              setStudentInfo({...studentInfo, district: e.target.value});
              if (formErrors.district) setFormErrors({...formErrors, district: ''});
            }} className="flex-1 w-full bg-transparent py-4 h-14 outline-none text-sm font-bold text-slate-800 dark:text-slate-200" />
          </label>
          {formErrors.district && <div className="absolute right-0 -top-10 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg before:content-[''] before:absolute before:top-full before:right-6 before:border-4 before:border-transparent before:border-t-rose-500 animate-in fade-in zoom-in duration-200">{formErrors.district}</div>}
        </div>
      )}
    </div>
  );
}
