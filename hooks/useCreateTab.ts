import { useState, useEffect, useMemo } from 'react';
import { authService } from '@/services/auth.service';
import { questionService } from '@/services/question.service';
import { examService } from '@/services/exam.service';
import { attemptService } from '@/services/attempt.service';
import { toFarsiNumber } from '@/utils/text.util';
import { Question } from '@/types/exam.type';

export function useCreateTab(onCreated: () => void) {
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
    district: false,
    nationalCode: false,
    personnelCode: false,
    orgTitle: false
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

  useEffect(() => {
    async function fetchQ() {
      setLoading(true);
      const { data } = await questionService.getQuestions();
      if (data) setAllQuestions(data);
      setLoading(false);
    }
    fetchQ();
  }, []);

  const allTopics: string[] = useMemo(() => {
    return Array.from(new Set(allQuestions.map(q => q.topic).filter((t): t is string => Boolean(t))));
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      const { data: { user } } = await authService.getUser();
      if (!user) throw new Error("احراز هویت ناموفق بود.");

      const { data: exam, error: examErr } = await examService.createExam({
        title,
        description,
        time_limit_minutes: isTimeLimited ? timeLimit : null,
        show_results: showResults,
        is_published: true,
        created_by: user.id,
        settings: {
          studentDetails
        }
      });

      if (examErr) throw examErr;

      const examQuestions = selectedQuestions.map((q, idx) => ({
        exam_id: exam.id,
        question_id: q.id,
        order_index: idx
      }));

      const { error: eqErr } = await examService.createExamQuestions(examQuestions);
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

  return {
    step,
    setStep,
    title,
    setTitle,
    description,
    setDescription,
    isTimeLimited,
    setIsTimeLimited,
    timeLimit,
    setTimeLimit,
    showResults,
    setShowResults,
    studentDetails,
    setStudentDetails,
    loading,
    saving,
    selectedQuestions,
    publishUrl,
    copied,
    selectionMode,
    setSelectionMode,
    searchQuery,
    setSearchQuery,
    selectedTopics,
    setSelectedTopics,
    randomCounts,
    setRandomCounts,
    allTopics,
    filteredQuestions,
    toggleTopicFilter,
    toggleSelection,
    isSelected,
    handleNextStep,
    applyRandomGeneration,
    handlePublish,
    copyLink
  };
}
