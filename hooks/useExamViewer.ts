import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { questionService } from '@/services/question.service';
import { examService } from '@/services/exam.service';
import { attemptService } from '@/services/attempt.service';
import { Exam, ExamQuestion, StudentInfo } from '@/types/exam.type';
import { UseExamViewerProps } from '@/types/runner.type';

export function useExamViewer({ exam, questions, user, adminViewAttemptId }: UseExamViewerProps) {
  const [hasParticipated, setHasParticipated] = useState(!!adminViewAttemptId);
  const [currentStep, setCurrentStep] = useState<'intro' | 'question'>('intro');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(!!adminViewAttemptId);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [loadingAttempt, setLoadingAttempt] = useState(true);

  const [studentInfo, setStudentInfo] = useState<StudentInfo>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const requiredFields = exam.settings?.studentDetails || {};
  const needsInfo = Object.values(requiredFields).some(Boolean);
  const examStatus = exam.settings?.status || (exam.is_published ? 'active' : 'draft');

  useEffect(() => {
    const loadAttemptData = async (attemptId: string) => {
      try {
        const { data: attempt } = await attemptService.getAttemptById(attemptId);
        if (attempt) {
          const { data: dbAnswers } = await attemptService.getAnswersByAttemptId(attempt.id);
          if (dbAnswers) {
            const restoredAnswers: Record<string, number> = {};
            dbAnswers.forEach((ans: any) => {
              restoredAnswers[ans.exam_question_id] = ans.selected_option_index;
            });
            setAnswers(restoredAnswers);
          }
          setScore(attempt.score || 0);
          setHasParticipated(true);
          setSubmitted(true);
        }
      } catch(err) {}
      setLoadingAttempt(false);
    };

    if (typeof window !== 'undefined') {
      setTimeout(() => setIsDarkMode(document.documentElement.classList.contains('dark')), 0);
      
      const checkPrevious = async () => {
        if (adminViewAttemptId) {
          await loadAttemptData(adminViewAttemptId);
          return;
        }

        const attemptId = localStorage.getItem('completed_exam_attempt_' + exam.id);
        const hasLocallyCompleted = localStorage.getItem('completed_exam_' + exam.id);

        try {
          if (attemptId) {
             await loadAttemptData(attemptId);
             return;
          }
        } catch (e) {
          console.error(e);
        }
        
        if (hasLocallyCompleted) {
          setHasParticipated(true);
        }
        setLoadingAttempt(false);
      };

      checkPrevious();
    }
  }, [exam.id, user, adminViewAttemptId]);

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setIsDarkMode(isDark);
  };

  const startExam = () => {
    const newErrors: Record<string, string> = {};
    let hasErr = false;
    for (const [key, isRequired] of Object.entries(requiredFields)) {
      if (isRequired && !studentInfo[key as keyof StudentInfo]?.trim()) {
        newErrors[key] = 'لطفاً این فیلد را پر کنید';
        hasErr = true;
      }
    }
    
    if (hasErr) {
      setFormErrors(newErrors);
      return;
    }
    setFormErrors({});
    
    setCurrentStep('question');
    if (exam.time_limit_minutes) {
      setTimeLeft(exam.time_limit_minutes * 60);
    }
  };

  const handleSubmit = async (e?: any, autoSubmit = false) => {
    if (adminViewAttemptId) return;
    if (!autoSubmit && Object.keys(answers).length !== questions.length) {
      if (!confirm('شما به همه سوالات پاسخ نداده‌اید، مطمئنید می‌خواهید ثبت کنید؟')) return;
    }
    
    setLoading(true);
    let calculatedScore = 0;
    
    for (const q of questions) {
       if (answers[q.id] === q.questions.correct_option_index) {
         calculatedScore += q.questions.point_value || 10;
       }
    }
    setScore(calculatedScore);

    try {
      const { data: attempt, error: aErr } = await attemptService.createAttempt({
        exam_id: exam.id,
        full_name: studentInfo.fullName || null,
        national_code: studentInfo.nationalCode || null,
        personnel_code: studentInfo.personnelCode || null,
        org_title: studentInfo.orgTitle || null,
        class_name: studentInfo.className || null,
        school: studentInfo.school || null,
        district: studentInfo.district || null,
        score: calculatedScore,
        status: 'completed',
        completed_at: new Date().toISOString()
      });

      if (aErr) throw aErr;

      const answersToInsert = Object.entries(answers).map(([eq_id, selected]) => ({
        attempt_id: attempt.id,
        exam_question_id: eq_id,
        selected_option_index: selected
      }));

      if (answersToInsert.length > 0) {
        await attemptService.createAnswers(answersToInsert);
      }
      
      localStorage.setItem('completed_exam_' + exam.id, 'true');
      localStorage.setItem('completed_exam_attempt_' + exam.id, attempt.id);
      setSubmitted(true);
      setHasParticipated(true);
    } catch (err: any) {
      if (!autoSubmit) alert(err.message || 'خطایی در ثبت آزمون رخ داد.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft === null || submitted || currentStep !== 'question' || adminViewAttemptId) return;
    
    if (timeLeft <= 0) {
      setTimeout(() => void handleSubmit(null, true), 0);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev !== null ? prev - 1 : null);
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, submitted, currentStep, adminViewAttemptId]);

  return {
    hasParticipated,
    currentStep,
    setCurrentStep,
    activeQuestionIndex,
    setActiveQuestionIndex,
    answers,
    setAnswers,
    submitted,
    score,
    loading,
    timeLeft,
    isDarkMode,
    toggleDarkMode,
    loadingAttempt,
    studentInfo,
    setStudentInfo,
    formErrors,
    setFormErrors,
    needsInfo,
    requiredFields,
    examStatus,
    startExam,
    handleSubmit
  };
}
