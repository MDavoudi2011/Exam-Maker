import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { questionService } from '@/services/question.service';
import { examService } from '@/services/exam.service';
import { attemptService } from '@/services/attempt.service';
import { Exam, ExamQuestion } from '@/types/exam.type';

export function useExamEditor(examId: string, initialExam?: Exam, initialQuestions?: ExamQuestion[]) {
  const [exam, setExam] = useState<Exam | null>(initialExam || null);
  const [questions, setQuestions] = useState<ExamQuestion[]>(initialQuestions || []);
  const [loading, setLoading] = useState(!initialExam);

  useEffect(() => {
    if (!initialExam) {
      async function fetchExam() {
        setLoading(true);
        const { data: fe } = await examService.getExamById(examId);
        const { data: fq } = await examService.getExamQuestions(examId);
        if (fe) setExam(fe);
        if (fq) setQuestions(fq);
        setLoading(false);
      }
      fetchExam();
    }
  }, [examId, initialExam]);

  return {
    exam,
    questions,
    loading
  };
}
