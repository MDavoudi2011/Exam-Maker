'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Save, Plus, Database, Copy, CheckCircle2, Search, Shuffle, ListChecks, ArrowRight, X, Loader2, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toFarsiNumber } from '@/lib/utils';
import Link from 'next/link';

interface Question {
  id: string;
  content: string;
  options: any; 
  correct_option_index: number;
  point_value: number;
  topic: string;
}

export function CreateTab({ onCreated, onCancel }: { onCreated: () => void, onCancel: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Step 1 State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isTimeLimited, setIsTimeLimited] = useState(true);
  const [timeLimit, setTimeLimit] = useState(20);
  const [showResults, setShowResults] = useState(true);
  const [studentDetails, setStudentDetails] = useState({
    fullName: true,
    className: false,
    school: false,
    district: false
  });

  // Step 2 State
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [publishUrl, setPublishUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Manual Tab
  const [selectionMode, setSelectionMode] = useState<'manual' | 'random'>('manual');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Random Tab
  const [randomCounts, setRandomCounts] = useState<Record<string, number>>({});

  const supabase = createClient();

  useEffect(() => {
    async function fetchQ() {
      setLoading(true);
      const { data } = await supabase.from('questions').select('*');
      if (data) setAllQuestions(data);
      setLoading(false);
    }
    fetchQ();
  }, [supabase]);

  const allTopics = useMemo(() => {
    return Array.from(new Set(allQuestions.map(q => q.topic).filter(Boolean)));
  }, [allQuestions]);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      const matchSearch = q.content.includes(searchQuery) || (q.topic && q.topic.includes(searchQuery));
      const matchTopic = selectedTopics.length === 0 || (q.topic && selectedTopics.includes(q.topic));
      return matchSearch && matchTopic;
    });
  }, [allQuestions, searchQuery, selectedTopics]);

  const toggleTopicFilter = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const toggleSelection = (q: Question) => {
    if (selectedQuestions.some(sq => sq.id === q.id)) {
      setSelectedQuestions(selectedQuestions.filter(sq => sq.id !== q.id));
    } else {
      setSelectedQuestions([...selectedQuestions, q]);
    }
  };

  const isSelected = (id: string) => selectedQuestions.some(sq => sq.id === id);

  useEffect(() => {
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleNextStep = () => {
    if (!title.trim()) {
      alert('لطفاً عنوان آزمون را وارد کنید.');
      return;
    }
    setStep(2);
  };

  const applyRandomGeneration = () => {
    let newSelection = [...selectedQuestions];
    for (const [topic, count] of Object.entries(randomCounts)) {
      if (!count || count <= 0) continue;
      // Get all available questions for this topic that are NOT already selected
      const pool = allQuestions.filter(q => q.topic === topic && !newSelection.find(sq => sq.id === q.id));
      if (pool.length < count) {
        alert(`تعداد سوالات کافی برای موضوع "${topic}" وجود ندارد. (موجود قابل انتخاب: ${toFarsiNumber(pool.length)})`);
        return;
      }
      const picked = [...pool].sort(() => 0.5 - Math.random()).slice(0, count);
      newSelection = [...newSelection, ...picked];
    }
    if (newSelection.length === selectedQuestions.length) {
      alert('لطفاً تعداد سوالات مورد نیاز را در جدول مشخص کنید.');
      return;
    }
    setSelectedQuestions(newSelection);
    setRandomCounts({});
  };

  const handlePublish = async () => {
    if (selectedQuestions.length === 0) {
      alert('لطفاً حداقل یک سوال برای آزمون انتخاب کنید.');
      return;
    }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("احراز هویت ناموفق بود.");

      const { data: exam, error: examErr } = await supabase.from('exams').insert({
        title,
        description,
        time_limit_minutes: isTimeLimited ? timeLimit : null,
        show_results: showResults,
        is_published: true,
        created_by: user.id,
        settings: {
          studentDetails
        }
      }).select().single();

      if (examErr) throw examErr;

      const examQuestions = selectedQuestions.map((q, idx) => ({
        exam_id: exam.id,
        question_id: q.id,
        order_index: idx
      }));

      const { error: eqErr } = await supabase.from('exam_questions').insert(examQuestions);
      if (eqErr) throw eqErr;

      setPublishUrl(`${window.location.origin}/view/${exam.id}`);
      setStep(3);
    } catch (err: any) {
      alert(err.message || 'خطایی در ثبت آزمون رخ داد.');
    } finally {
      setSaving(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(publishUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === 3) {
    return (
      <div className="flex flex-col items-center py-20 px-4 font-sans animate-in fade-in zoom-in duration-500">
        <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 text-center shadow-2xl shadow-slate-200/50 dark:shadow-none border border-emerald-100 dark:border-emerald-900/30">
          <div className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-extrabold mb-4 text-emerald-950 dark:text-emerald-50">آزمون با موفقیت منتشر شد!</h1>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">لینک زیر را کپی کرده و برای شرکت‌کنندگان ارسال کنید.</p>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-10 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex-1 px-4 py-3 text-left dir-ltr text-sm font-bold text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-nowrap w-full">
              {publishUrl}
            </div>
            <button 
              onClick={copyLink}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shrink-0 ${copied ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm'}`}
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'کپی شد' : 'کپی لینک'}
            </button>
          </div>

          <button onClick={onCreated} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold transition-colors">
            بازگشت به پیشخوان
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            {step === 1 ? 'اطلاعات اولیه آزمون' : 'انتخاب سوالات'}
          </h1>
        </div>
        {step === 2 && (
          <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <ArrowRight className="w-4 h-4" />
            بازگشت
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        {step === 1 && (
          <div className="p-6 md:p-8 space-y-8">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-lg font-black text-slate-800 dark:text-slate-200 block">عنوان آزمون <span className="text-rose-500">*</span></label>
                <input 
                  value={title} onChange={e => setTitle(e.target.value)}
                  type="text" placeholder="مثال: کوییز پایانی برنامه‌نویسی ری‌اکت"
                  className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary rounded-2xl px-5 py-4 transition-all text-sm font-medium"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-lg font-black text-slate-800 dark:text-slate-200 block">توضیحات (اختیاری)</label>
                <textarea 
                  value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="توضیحاتی کوتاه درباره محتوای آزمون، قوانین یا مباحث..."
                  className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary rounded-2xl px-5 py-4 transition-all text-sm font-medium min-h-[120px] resize-y"
                ></textarea>
              </div>

              <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/30 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl">
                     <div>
                       <div className="text-sm font-bold text-slate-800 dark:text-slate-200">الزام زمان‌بندی</div>
                       <div className="text-xs text-slate-500 mt-0.5">آزمون محدودیت زمانی داشته باشد</div>
                     </div>
                     <div className="flex items-center gap-3">
                       {isTimeLimited && (
                         <div className="flex items-center gap-2 animate-in zoom-in duration-200">
                           <input 
                             value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))}
                             type="number" min="1"
                             className="w-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary/50 rounded-lg px-2 py-1.5 transition-all font-bold text-center dir-ltr text-sm"
                           />
                           <span className="text-xs font-bold text-slate-500">دقیقه</span>
                         </div>
                       )}
                       <label className="relative inline-flex items-center cursor-pointer shrink-0" dir="ltr">
                         <input type="checkbox" className="sr-only peer" checked={isTimeLimited} onChange={e => setIsTimeLimited(e.target.checked)} />
                         <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                       </label>
                     </div>
                   </div>

                   <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/30 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl">
                     <div>
                       <div className="text-sm font-bold text-slate-800 dark:text-slate-200">نمایش نتایج</div>
                       <div className="text-xs text-slate-500 mt-0.5">کارنامه پس از پایان نمایش داده شود</div>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer shrink-0" dir="ltr">
                       <input type="checkbox" className="sr-only peer" checked={showResults} onChange={e => setShowResults(e.target.checked)} />
                       <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                     </label>
                   </div>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">دریافت مشخصات فردی</div>
                    <div className="text-xs text-slate-500 -mt-2">مشخص کنید شرکت‌کننده چه اطلاعاتی را باید وارد کند:</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: 'fullName', label: 'نام و نام خانوادگی' },
                        { id: 'className', label: 'کلاس' },
                        { id: 'school', label: 'مدرسه' },
                        { id: 'district', label: 'ناحیه / منطقه' }
                      ].map(field => (
                        <div 
                          key={field.id}
                          onClick={() => setStudentDetails({...studentDetails, [field.id]: !studentDetails[field.id as keyof typeof studentDetails]})}
                          className={`cursor-pointer p-3 rounded-xl border flex items-center justify-center gap-2 transition-all text-sm font-bold ${studentDetails[field.id as keyof typeof studentDetails] ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${studentDetails[field.id as keyof typeof studentDetails] ? 'bg-primary border-primary text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                            {studentDetails[field.id as keyof typeof studentDetails] && <CheckCircle2 className="w-3 h-3" />}
                          </div>
                          {field.label}
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={handleNextStep} className="bg-primary hover:bg-primary/90 text-white h-12 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]">
                مرحله بعد
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 p-2 gap-2 bg-slate-50/50 dark:bg-slate-900/50">
              <button 
                onClick={() => setSelectionMode('manual')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-bold rounded-2xl transition-all ${selectionMode === 'manual' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
              >
                <ListChecks className="w-5 h-5" />
                انتخاب دستی
              </button>
              <button 
                onClick={() => setSelectionMode('random')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-bold rounded-2xl transition-all ${selectionMode === 'random' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
              >
                <Shuffle className="w-5 h-5" />
                تولید تصادفی
              </button>
            </div>

            <div className="p-6 md:p-8">
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
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pr-12 pl-4 outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  {/* Topics filter */}
                  {allTopics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                       <button onClick={() => setSelectedTopics([])} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${selectedTopics.length === 0 ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-200 dark:text-slate-900 border-transparent' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>همه موضوعات</button>
                       {allTopics.map(topic => (
                         <button key={topic} onClick={() => toggleTopicFilter(topic)} className={`px-4 py-2 rounded-xl text-sm font-bold border flex items-center gap-2 transition-colors ${selectedTopics.includes(topic) ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                           {topic}
                           {selectedTopics.includes(topic) && <X className="w-3.5 h-3.5" />}
                         </button>
                       ))}
                    </div>
                  )}

                  {/* Question List */}
                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? (
                       <div className="flex items-center justify-center py-20 text-slate-400"><Loader2 className="w-8 h-8 animate-spin" /></div>
                    ) : filteredQuestions.length === 0 ? (
                       <div className="text-center py-16 text-slate-500 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-sm">سوالی یافت نشد.</div>
                    ) : (
                      filteredQuestions.map(q => {
                        const selected = isSelected(q.id);
                        return (
                          <div key={q.id} onClick={() => toggleSelection(q)} className={`p-4 rounded-xl border cursor-pointer transition-all ${selected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                             <div className="flex gap-3 items-start">
                               <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${selected ? 'bg-primary border-primary text-white' : 'border-slate-300 dark:border-slate-600 bg-transparent'}`}>
                                 {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                               </div>
                               <div className="flex-1">
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
                <div className="space-y-8 animate-in fade-in mx-auto">
                   
                   <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                     <table className="w-full text-sm text-right">
                       <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                         <tr>
                           <th className="px-5 py-4 font-bold text-slate-700 dark:text-slate-300">موضوع</th>
                           <th className="px-5 py-4 font-bold text-slate-700 dark:text-slate-300">موجودی کل</th>
                           <th className="px-5 py-4 font-bold text-slate-700 dark:text-slate-300 w-40">تعداد انتخابی</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                         {allTopics.map(topic => {
                           const availableCount = allQuestions.filter(q => q.topic === topic && !isSelected(q.id)).length;
                           return (
                             <tr key={topic} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                               <td className="px-5 py-4 font-bold text-slate-800 dark:text-slate-200">{topic}</td>
                               <td className="px-5 py-4 text-slate-500 font-bold">{toFarsiNumber(availableCount)} <span className="text-xs font-normal opacity-70">امکان انتخاب</span></td>
                               <td className="px-5 py-3">
                                 <input 
                                   type="number" 
                                   min="0" 
                                   max={availableCount}
                                   value={randomCounts[topic] || ''}
                                   onChange={e => setRandomCounts({...randomCounts, [topic]: Number(e.target.value)})}
                                   placeholder="0"
                                   className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-center text-sm font-bold outline-none focus:ring-2 focus:ring-primary/50 dir-ltr transition-all"
                                 />
                               </td>
                             </tr>
                           );
                         })}
                       </tbody>
                     </table>
                   </div>

                   <div className="pt-2">
                     <button onClick={applyRandomGeneration} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 transition-transform active:scale-[0.98] text-[15px]">
                       <Shuffle className="w-5 h-5" />
                       تولید و افزودن به سوالات منتخب
                     </button>
                   </div>
                   
                   {/* Selected Questions List */}
                   {selectedQuestions.length > 0 && (
                     <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
                           <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                           سوالات انتخاب شده ({toFarsiNumber(selectedQuestions.length)})
                        </h3>
                        <div className="grid grid-cols-1 gap-3 max-h-[460px] overflow-y-auto custom-scrollbar pr-2">
                          {selectedQuestions.map((q, idx) => (
                            <div key={q.id} className="flex justify-between items-center bg-slate-50/80 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                               <div className="flex items-center gap-4 overflow-hidden">
                                  <span className="text-primary font-black text-sm w-5 shrink-0 text-left dir-ltr">{toFarsiNumber(idx + 1)}.</span>
                                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate pr-1">{q.content}</span>
                                  {q.topic && <span className="text-[10px] hidden sm:inline-block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 px-2.5 py-1 rounded-md whitespace-nowrap">{q.topic}</span>}
                               </div>
                               <button onClick={() => toggleSelection(q)} className="text-slate-400 hover:text-rose-500 p-2.5 shrink-0 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors" title="حذف سوال">
                                 <X className="w-4 h-4" />
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
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <div className="font-bold text-slate-700 dark:text-slate-300">
                 <span className="text-primary text-xl ml-2">{toFarsiNumber(selectedQuestions.length)}</span>
                 سوال انتخاب شده
              </div>
              <button 
                onClick={handlePublish} disabled={saving || selectedQuestions.length === 0}
                className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin"/> : <CheckCircle2 className="w-6 h-6" />}
                انتشار نهایی آزمون
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
