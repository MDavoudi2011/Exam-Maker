'use client';
import React, { useState, useEffect } from 'react';
import { Search, Loader2, Edit, Trash, Eye, Plus, ChevronDown, Check, X, ChevronRight, ChevronLeft, Database } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toFarsiNumber } from '@/lib/utils';

const topicColors = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
  'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
];

const getTopicColor = (topic: string) => {
  if (!topic) return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = topic.charCodeAt(i) + ((hash << 5) - hash);
  }
  return topicColors[Math.abs(hash) % topicColors.length];
};

const renderContent = (text: any) => {
  if (!text || typeof text !== 'string') return text;
  
  const parts: { text: string; isCode: boolean }[] = [];
  let currentStr = '';
  let inCode = false;
  
  const isFarsi = (char: string) => /[\u0600-\u06FF\u200C]/.test(char);
  const isCodeStart = (char: string) => /[a-zA-Z0-9]/.test(char);

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inCode) {
      if (isFarsi(char)) {
        const match = currentStr.match(/(\s+)$/);
        if (match) {
          const spaces = match[1];
          const code = currentStr.slice(0, currentStr.length - spaces.length);
          if (code) parts.push({ text: code, isCode: true });
          currentStr = spaces + char;
        } else {
          parts.push({ text: currentStr, isCode: true });
          currentStr = char;
        }
        inCode = false;
      } else {
        currentStr += char;
      }
    } else {
      if (isCodeStart(char)) {
        if (currentStr) {
          parts.push({ text: currentStr, isCode: false });
        }
        currentStr = char;
        inCode = true;
      } else {
        currentStr += char;
      }
    }
  }
  
  if (currentStr) {
    if (inCode) {
      const match = currentStr.match(/(\s+)$/);
      if (match) {
        const spaces = match[1];
        const code = currentStr.slice(0, currentStr.length - spaces.length);
        if (code) parts.push({ text: code, isCode: true });
        if (spaces) parts.push({ text: spaces, isCode: false });
      } else {
        parts.push({ text: currentStr, isCode: true });
      }
    } else {
      parts.push({ text: currentStr, isCode: false });
    }
  }

  return parts.map((part, i) => {
    if (part.isCode) {
      return (
        <span key={i} dir="ltr" className="inline-block font-mono bg-slate-200/70 dark:bg-slate-700/70 px-1.5 py-0.5 rounded-md text-[0.9em] mx-1 align-middle whitespace-pre">
          {part.text}
        </span>
      );
    }
    return <span key={i}>{part.text}</span>;
  });
};

export function QuestionBankTab() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [previewQuestion, setPreviewQuestion] = useState<any>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(10);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);
  
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [showAddTopic, setShowAddTopic] = useState(false);
  
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const itemsPerPageRef = React.useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTopicDropdown(false);
        setShowAddTopic(false);
      }
      if (itemsPerPageRef.current && !itemsPerPageRef.current.contains(event.target as Node)) {
        setShowItemsPerPageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchQuestions = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('questions').select('*').order('created_at', { ascending: false });
      if (data) {
        setQuestions(data);
        const uniqueTopics = Array.from(new Set(data.map(q => q.topic).filter(Boolean)));
        setTopics(uniqueTopics as string[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchQuestions();
  }, [fetchQuestions]);

  const handleDelete = async (id: string) => {
    if (confirm('آیا از حذف این سوال اطمینان دارید؟')) {
      await supabase.from('questions').delete().eq('id', id);
      fetchQuestions();
    }
  };

  const handleAddTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setSelectedTopic(newTopic.trim());
      setNewTopic('');
      setShowAddTopic(false);
      setShowTopicDropdown(false);
    }
  };

  let filteredQuestions = questions.filter(q => {
    const matchesTopic = selectedTopic === 'all' || q.topic === selectedTopic;
    const matchesSearch = q.content?.includes(searchTerm);
    return matchesTopic && matchesSearch;
  });

  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(filteredQuestions.length / (itemsPerPage as number));
  const paginatedQuestions = itemsPerPage === 'all' ? filteredQuestions : filteredQuestions.slice((currentPage - 1) * (itemsPerPage as number), currentPage * (itemsPerPage as number));

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

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
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
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:flex-[4]">
            <div className="relative flex-1" ref={dropdownRef}>
              <button 
                onClick={() => setShowTopicDropdown(!showTopicDropdown)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span>{selectedTopic === 'all' ? 'همه موضوعات' : selectedTopic}</span>
                  <span className="w-5 h-5 flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] rounded-full">{toFarsiNumber(selectedTopic === 'all' ? questions.length : questions.filter(q => q.topic === selectedTopic).length)}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 mr-3 transition-transform ${showTopicDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showTopicDropdown && (
                <div className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col p-2 animate-in fade-in zoom-in-95 duration-100 origin-top">
                  <div className="max-h-[200px] overflow-y-auto space-y-1 p-1">
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
              className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all font-bold text-sm shrink-0 shadow-lg shadow-primary/25"
            >
              <Plus className="w-5 h-5" /> افزودن سوال
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <>
            <table className="w-full text-right z-10 relative table-auto">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm border-b border-slate-100 dark:border-slate-800">
                  <th className="p-4 font-semibold w-px whitespace-nowrap text-center">موضوع</th>
                  <th className="p-4 font-semibold text-right">عنوان سوال</th>
                  <th className="p-4 font-semibold w-px whitespace-nowrap text-center">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {paginatedQuestions.length > 0 ? paginatedQuestions.map((q, idx) => (
                  <tr key={q.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="p-4 text-sm font-bold text-center w-px whitespace-nowrap">
                      <span className={`px-3 py-1.5 rounded-lg inline-block align-middle ${getTopicColor(q.topic)}`}>{q.topic || 'بدون دسته‌بندی'}</span>
                    </td>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200 text-right">
                       <p className="line-clamp-2 md:line-clamp-1">{q.content}</p>
                    </td>
                    <td className="p-4 text-center w-px whitespace-nowrap">
                      <div className="inline-flex items-center justify-center gap-2">
                        <button onClick={() => setPreviewQuestion(q)} className="p-2 bg-sky-50 text-sky-600 hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-400 rounded-xl transition-colors tooltip-trigger" title="پیش‌نمایش">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingQuestion(q)} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-xl transition-colors tooltip-trigger" title="ویرایش">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(q.id)} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 rounded-xl transition-colors tooltip-trigger" title="حذف">
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="p-10 text-center text-slate-500 font-medium">سوالاتی یافت نشد</td>
                  </tr>
                )}
              </tbody>
            </table>

            {filteredQuestions.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <span>تعداد در هر صفحه:</span>
                  <div className="relative" ref={itemsPerPageRef}>
                    <button 
                      onClick={() => setShowItemsPerPageDropdown(!showItemsPerPageDropdown)}
                      className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 font-bold text-slate-700 dark:text-slate-300 min-w-[80px] flex items-center justify-between gap-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <span>{itemsPerPage === 'all' ? 'همه' : toFarsiNumber(itemsPerPage)}</span>
                      <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showItemsPerPageDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showItemsPerPageDropdown && (
                      <div className="absolute bottom-full mb-2 right-0 w-full min-w-[100px] bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col p-1 animate-in fade-in zoom-in-95 origin-bottom z-50">
                        {[10, 20, 50, 'all'].map(val => (
                          <button 
                            key={val}
                            onClick={() => { setItemsPerPage(val as number | 'all'); setCurrentPage(1); setShowItemsPerPageDropdown(false); }}
                            className={`px-3 py-2 text-right text-sm font-bold rounded-lg transition-colors ${itemsPerPage === val ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                          >
                             {val === 'all' ? 'همه' : toFarsiNumber(val)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {totalPages > 1 && itemsPerPage !== 'all' && (
                  <div className="flex items-center gap-2" dir="ltr">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${currentPage === page ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                        >
                          {toFarsiNumber(page)}
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      <ChevronRight className="w-5 h-5" />
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
                {renderContent(previewQuestion.content)}
              </div>
              <div className="space-y-3">
                {previewQuestion.options && Array.isArray(previewQuestion.options) && previewQuestion.options.map((opt: string, i: number) => {
                  const isEnglish = /[a-zA-Z]/.test(opt) || (opt.trim().length > 0 && !/[\u0600-\u06FF]/.test(opt));
                  return (
                  <div key={i} className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${previewQuestion.correct_option_index === i ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700'}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${previewQuestion.correct_option_index === i ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                      {previewQuestion.correct_option_index === i && <Check className="w-3 h-3" />}
                    </div>
                    <span dir={isEnglish ? "ltr" : "rtl"} className={`block flex-1 font-medium ${isEnglish ? 'text-left' : ''} ${previewQuestion.correct_option_index === i ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'}`}>{renderContent(opt)}</span>
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

function EditModal({ question, topics, onClose, onSave }: { question: any, topics: string[], onClose: () => void, onSave: () => void }) {
  const [content, setContent] = useState(question.content || '');
  const [options, setOptions] = useState<string[]>(Array.isArray(question.options) ? question.options : ['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(question.correct_option_index || 0);
  const [topic, setTopic] = useState(question.topic || '');
  const [score, setScore] = useState(question.point_value || 10);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSave = async () => {
    setLoading(true);
    try {
      if (question.id) {
        await supabase.from('questions').update({
          content,
          options,
          correct_option_index: correctIndex,
          topic,
          point_value: score
        }).eq('id', question.id);
      } else {
        await supabase.from('questions').insert({
          content,
          options,
          correct_option_index: correctIndex,
          topic,
          point_value: score
        });
      }
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 z-10">
          <h3 className="font-bold text-lg flex items-center gap-2"><Edit className="w-5 h-5 text-primary" /> {question.id ? 'ویرایش سوال' : 'افزودن سوال جدید'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">عنوان سوال</label>
            <textarea 
               className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium min-h-[100px] resize-y"
               value={content}
               onChange={e => setContent(e.target.value)}
               placeholder="متن سوال را اینجا بنویسید..."
            />
          </div>

          <div className="space-y-3">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">گزینهها (گزینه صحیح را تیک بزنید)</label>
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
                    className={`flex-1 p-3 rounded-xl border transition-all text-sm font-medium ${correctIndex === idx ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-slate-300 dark:focus:border-slate-600 focus:ring-2 focus:ring-slate-500/10'} ${isEnglish ? 'text-left' : ''}`}
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
                     className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold appearance-none pr-4 pl-10"
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
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold text-left"
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
