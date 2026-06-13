import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { questionService } from '@/services/question.service';
import { examService } from '@/services/exam.service';
import { attemptService } from '@/services/attempt.service';

export function useUsersPerformanceTab(initialExams: any[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await attemptService.getAttemptsForPerformanceTab();
        
        if (data) {
          setAttempts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const usersMap = new Map<string, {
    fullName: string,
    uniqueId: string,
    attempts: Record<string, { score: number, attemptId: string }>,
    totalScore: number,
    examsCount: number,
  }>();

  attempts.forEach(attempt => {
    const identifier = attempt.national_code || attempt.personnel_code;
    if (!identifier) return;

    if (!usersMap.has(identifier)) {
      usersMap.set(identifier, {
        fullName: attempt.full_name || 'نامشخص',
        uniqueId: identifier,
        attempts: {},
        totalScore: 0,
        examsCount: 0,
      });
    }
    const userStats = usersMap.get(identifier)!;
    const currentScore = parseFloat(attempt.score) || 0;
    
    if (!userStats.attempts[attempt.exam_id] || userStats.attempts[attempt.exam_id].score < currentScore) {
      if (userStats.attempts[attempt.exam_id]) {
        userStats.totalScore -= userStats.attempts[attempt.exam_id].score;
      } else {
        userStats.examsCount += 1;
      }
      userStats.attempts[attempt.exam_id] = { score: currentScore, attemptId: attempt.id };
      userStats.totalScore += currentScore;
    }
  });

  const usersArray = Array.from(usersMap.values());
  const filteredUsers = usersArray.filter(u => 
    u.fullName.includes(searchTerm) || u.uniqueId.includes(searchTerm)
  );

  const activeExamIds = new Set<string>();
  filteredUsers.forEach(u => {
    Object.keys(u.attempts).forEach(eid => activeExamIds.add(eid));
  });

  const filteredExams = initialExams.filter(e => activeExamIds.has(e.id));

  return {
    searchTerm,
    setSearchTerm,
    loading,
    filteredUsers,
    filteredExams,
    selectedAttemptId,
    setSelectedAttemptId
  };
}

export function useAttemptDetails(attemptId: string | null) {
  const [details, setDetails] = useState<any>(null);
  const [examData, setExamData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchDetails = async () => {
      if (!attemptId) return;
      setLoading(true);
      try {
        const { data } = await attemptService.getAttemptWithExam(attemptId);
        if (data) {
          setDetails(data);
          setExamData(data.exams);
          // Fetch questions
          const { data: qData } = await examService.getExamQuestions(data.exam_id);
          if (qData) setQuestions(qData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [attemptId]);

  return { details, examData, questions, loading };
}
