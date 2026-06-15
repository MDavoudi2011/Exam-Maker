import { useState, useEffect, useMemo, useRef } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { authService } from '@/services/auth.service';
import { questionService } from '@/services/question.service';
import { examService } from '@/services/exam.service';
import { attemptService } from '@/services/attempt.service';

export function useReportsTab(initialSelectedExamId?: string | null) {
  const [selectedExamId, setSelectedExamId] = useState<string>(initialSelectedExamId || '');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewingAttempt, setViewingAttempt] = useState<any>(null);
  const [examData, setExamData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({});

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const examDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(examDropdownRef, () => setIsDropdownOpen(false));
  useClickOutside(sortDropdownRef, () => setIsSortDropdownOpen(false));

  useEffect(() => {
    async function fetchCounts() {
      const { data } = await attemptService.getAttemptCountsPerExam();
      if (data) {
        const counts: Record<string, number> = {};
        data.forEach((att: any) => {
          counts[att.exam_id] = (counts[att.exam_id] || 0) + 1;
        });
        setAttemptCounts(counts);
      }
    }
    fetchCounts();
  }, []);

  useEffect(() => {
    async function fetchResults() {
      if (!selectedExamId) {
        setResults([]);
        setExamData(null);
        return;
      }
      
      setLoading(true);
      try {
        const { data: examDataObj } = await examService.getExamById(selectedExamId);
        setExamData(examDataObj);

        // Fetch questions for detailed view later
        const { data: qData } = await examService.getExamQuestions(selectedExamId);
        if (qData) setQuestions(qData);

        const { data, error } = await attemptService.getAttemptsByExamId(selectedExamId);
          
        if (data) {
          setResults(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [selectedExamId]);

  const sortedAndFilteredResults = useMemo(() => {
    let processableResults = [...results];

    if (searchTerm) {
      processableResults = processableResults.filter(item => {
        const term = searchTerm.toLowerCase();
        return (
          (item.full_name && item.full_name.toLowerCase().includes(term)) ||
          (item.national_code && item.national_code.includes(term)) ||
          (item.personnel_code && item.personnel_code.includes(term)) ||
          (item.org_title && item.org_title.toLowerCase().includes(term)) ||
          (item.class_name && item.class_name.toLowerCase().includes(term)) ||
          (item.school && item.school.toLowerCase().includes(term)) ||
          (item.district && item.district.toLowerCase().includes(term))
        );
      });
    }

    if (sortConfig !== null) {
      processableResults.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal === bVal) return 0;
        
        const isAsc = sortConfig.direction === 'asc' ? 1 : -1;
        if (aVal === null || aVal === undefined) return 1 * isAsc;
        if (bVal === null || bVal === undefined) return -1 * isAsc;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return aVal.localeCompare(bVal) * isAsc;
        }
        
        return aVal < bVal ? -1 * isAsc : 1 * isAsc;
      });
    }

    return processableResults;
  }, [results, searchTerm, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const requiredFields = examData?.settings?.studentDetails || {};
  const showFullName = requiredFields.fullName;
  const showNationalCode = requiredFields.nationalCode;
  const showPersonnelCode = requiredFields.personnelCode;
  const showOrgTitle = requiredFields.orgTitle;
  const showClassName = requiredFields.className;
  const showSchool = requiredFields.school;
  const showDistrict = requiredFields.district;

  return {
    selectedExamId,
    setSelectedExamId,
    results,
    sortedAndFilteredResults,
    loading,
    viewingAttempt,
    setViewingAttempt,
    examData,
    questions,
    searchTerm,
    setSearchTerm,
    sortConfig,
    requestSort,
    attemptCounts,
    showFullName,
    showNationalCode,
    showPersonnelCode,
    showOrgTitle,
    showClassName,
    showSchool,
    showDistrict,
    isDropdownOpen,
    setIsDropdownOpen,
    isSortDropdownOpen,
    setIsSortDropdownOpen,
    examDropdownRef,
    sortDropdownRef
  };
}
