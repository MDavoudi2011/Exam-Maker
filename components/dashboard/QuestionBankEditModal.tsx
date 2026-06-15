import React from 'react';
import { Edit, X, Loader2, ChevronDown } from 'lucide-react';
import { toFarsiNumber } from '@/utils/text.util';
import { useEditModal } from '@/hooks/useQuestionBankTab';

export function EditModal({ question, topics, onClose, onSave }: { question: any, topics: string[], onClose: () => void, onSave: () => void }) {
  const {
    content,
    setContent,
    options,
    setOptions,
    correctIndex,
    setCorrectIndex,
    topic,
    setTopic,
    score,
    setScore,
    loading,
    handleSave,
  } = useEditModal(question, onSave, onClose);

  return (
    <div className="fixed top-[72px] md:top-0 inset-x-0 bottom-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl flex flex-col h-full md:h-auto md:max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 z-10">
          <h3 className="font-bold text-lg flex items-center gap-2"><Edit className="w-5 h-5 text-primary" /> {question.id ? 'ویرایش سوال' : 'افزودن سوال جدید'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">عنوان سوال</label>
            <textarea 
               className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium min-h-[100px] resize-y outline-none"
               value={content}
               onChange={e => setContent(e.target.value)}
               placeholder="متن سوال را اینجا بنویسید..."
            />
          </div>

          <div className="space-y-3">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">گزینه‌ها (گزینه صحیح را تیک بزنید)</label>
             {options.map((opt, idx) => {
                const isEnglish = /[a-zA-Z]/.test(opt) || (opt.trim().length > 0 && !/[\u0600-\u06FF]/.test(opt));
                return (
                <div key={idx} className="flex items-center gap-3">
                  <input 
                    type="radio"
                    name="edit-correct"
                    checked={correctIndex === idx}
                    onChange={() => setCorrectIndex(idx)}
                    className="w-5 h-5 text-emerald-500 border-slate-300 focus:ring-emerald-500 mt-1 cursor-pointer bg-white dark:bg-slate-800"
                  />
                  <input 
                    type="text"
                    value={opt}
                    dir={isEnglish ? "ltr" : "rtl"}
                    onChange={e => {
                       const newOpts = [...options];
                       newOpts[idx] = e.target.value;
                       setOptions(newOpts);
                    }}
                    placeholder={`گزینه ${toFarsiNumber(idx + 1)}`}
                    className={`flex-1 p-3 outline-none rounded-xl border transition-all text-sm font-medium ${correctIndex === idx ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20'} ${isEnglish ? 'text-left' : ''}`}
                  />
                </div>
             )})}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">موضوع</label>
                <div className="relative">
                  <select
                     value={topic}
                     onChange={e => setTopic(e.target.value)}
                     className="w-full outline-none p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold appearance-none pr-4 pl-10"
                  >
                     <option value="">بدون موضوع</option>
                     {topics.map(t => (
                        <option key={t} value={t}>{t}</option>
                     ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">نمره</label>
                <input 
                  type="number"
                  min={0.5}
                  step={0.5}
                  value={score}
                  onChange={e => setScore(parseFloat(e.target.value))}
                  className="w-full outline-none p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold text-left"
                  dir="ltr"
                />
             </div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 z-10 flex gap-3">
          <button 
             onClick={handleSave} 
             disabled={loading || !content.trim()}
             className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            ذخیره سوال
          </button>
          <button 
             onClick={onClose}
             className="px-6 bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}
