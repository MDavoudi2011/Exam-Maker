import { useState, useEffect } from 'react';
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
    loading,
    viewingAttempt,
    setViewingAttempt,
    examData,
    questions,
    showFullName,
    showNationalCode,
    showPersonnelCode,
    showOrgTitle,
    showClassName,
    showSchool,
    showDistrict
  };
}
