'use client';
import React, { useState } from 'react';
import { Save, Plus, Database, Sparkles, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function CreateTab({ onCreated, onCancel }: { onCreated: () => void, onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(45);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSave = async () => {
    if (!title) return alert('عنوان آزمون الزامی است.');
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("شما وارد نشده‌اید.");

      const { error } = await supabase.from('exams').insert({
        title,
        description,
        time_limit_minutes: timeLimit,
        is_published: isPublished,
        created_by: user.id
      });

      if (error) throw error;
      onCreated();
    } catch (err: any) {
      alert(err.message || 'خطایی رخ داد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">ساخت آزمون جدید</h1>
          <p className="text-slate-500 font-medium">جزئیات و تنظیمات آزمون خود را مشخص کنید.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        <div className="p-6 md:p-8 space-y-8">
          {/* Header section */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-6 flex items-start gap-4">
             <div className="bg-primary/10 p-3 rounded-2xl text-primary mt-1">
               <Database className="w-6 h-6" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-800 dark:text-white">اطلاعات پایه آزمون</h2>
               <p className="text-sm text-slate-500 mt-1">نام و مشخصات اولیه آزمون را اینجا وارد کنید.</p>
             </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">عنوان آزمون <span className="text-red-500">*</span></label>
              <input 
                value={title} onChange={e => setTitle(e.target.value)}
                type="text" placeholder="مثال: کوییز پایانی ریاضیات مهندسی"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 outline-none focus:ring-2 focus:ring-primary rounded-xl px-4 py-3.5 transition-all text-sm font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">توضیحات (اختیاری)</label>
              <textarea 
                value={description} onChange={e => setDescription(e.target.value)}
                placeholder="توضیحاتی کوتاه درباره محتوای آزمون، قوانین یا مباحث طرح شده..."
                className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 outline-none focus:ring-2 focus:ring-primary rounded-xl px-4 py-3.5 transition-all text-sm font-medium min-h-[120px] resize-y"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">زمان محدود (دقیقه)</label>
                <input 
                  value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))}
                  type="number" min="1"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 outline-none focus:ring-2 focus:ring-primary rounded-xl px-4 py-3.5 transition-all text-sm font-medium text-left dir-ltr"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">وضعیت انتشار</label>
                <select 
                  value={isPublished ? 'published' : 'draft'} 
                  onChange={e => setIsPublished(e.target.value === 'published')}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 outline-none focus:ring-2 focus:ring-primary rounded-xl px-4 py-3.5 transition-all text-sm font-medium"
                >
                  <option value="draft">پیشنویس (مخفی)</option>
                  <option value="published">منتشر شده (قابل دسترس)</option>
                </select>
              </div>
            </div>
          </div>
          
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={onCancel}
            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            انصراف
          </button>
          <button 
            onClick={handleSave} disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5" />}
            ذخیره آزمون
          </button>
        </div>
      </div>
    </div>
  );
}
