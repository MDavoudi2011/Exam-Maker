import { useState, useEffect, useRef } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { authService } from '@/services/auth.service';
import { questionService } from '@/services/question.service';
import { examService } from '@/services/exam.service';
import { attemptService } from '@/services/attempt.service';

export function useUsersPerformanceTab(initialExams: any[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: 'fullName' | 'uniqueId' | 'avgScore', direction: 'asc' | 'desc' }>({ key: 'avgScore', direction: 'desc' });
  const [identifierBasis, setIdentifierBasis] = useState<'auto' | 'national_code' | 'personnel_code'>('auto');
  const [attempts, setAttempts] = useState<any[]>([]);
  const [examMaxScores, setExamMaxScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isIdentDropdownOpen, setIsIdentDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const identDropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(sortDropdownRef, () => setIsSortDropdownOpen(false));
  useClickOutside(identDropdownRef, () => setIsIdentDropdownOpen(false));
  
  const examIdsStr = initialExams.map(e => e.id).sort().join(',');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const examIds = initialExams.map(e => e.id);
        const { data, error } = await attemptService.getAttemptsForPerformanceTab(examIds);
        
        if (data && data.length > 0) {
          const examIdsArray = Array.from(new Set(data.map(a => a.exam_id)));
          const maxScoresRes = await examService.getExamMaxScores(examIdsArray as string[]);
          const maxScoresData = maxScoresRes.data;
          
          const maxScoresMap: Record<string, number> = {};
          if (maxScoresData) {
            maxScoresData.forEach(eq => {
              if (!maxScoresMap[eq.exam_id]) maxScoresMap[eq.exam_id] = 0;
              const qObj = Array.isArray(eq.questions) ? eq.questions[0] : eq.questions;
              maxScoresMap[eq.exam_id] += (qObj as any)?.point_value ?? 10;
            });
          }

          setExamMaxScores(maxScoresMap);
          setAttempts(data);
        } else {
          setAttempts([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [examIdsStr]);

  const usersMap = new Map<string, {
    fullName: string,
    uniqueId: string,
    attempts: Record<string, { score: number, attemptId: string }>,
    totalScore: number,
    examsCount: number,
  }>();

  attempts.forEach(attempt => {
    let identifier = '';
    if (identifierBasis === 'auto') identifier = attempt.national_code || attempt.personnel_code;
    else if (identifierBasis === 'national_code') identifier = attempt.national_code;
    else if (identifierBasis === 'personnel_code') identifier = attempt.personnel_code;

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
    
    // Calculate percentage
    const rawScore = parseFloat(attempt.score) || 0;
    const maxScore = examMaxScores[attempt.exam_id] || 1;
    const currentScore = (rawScore / maxScore) * 100;
    
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
  ).sort((a, b) => {
    const isAsc = sortConfig.direction === 'asc' ? 1 : -1;
    if (sortConfig.key === 'fullName') return a.fullName.localeCompare(b.fullName) * isAsc;
    if (sortConfig.key === 'uniqueId') return a.uniqueId.localeCompare(b.uniqueId) * isAsc;
    if (sortConfig.key === 'avgScore') {
       const aAvg = a.examsCount > 0 ? (a.totalScore / a.examsCount) : 0;
       const bAvg = b.examsCount > 0 ? (b.totalScore / b.examsCount) : 0;
       return (aAvg - bAvg) * isAsc;
    }
    return 0;
  });

  const activeExamIds = new Set<string>();
  filteredUsers.forEach(u => {
    Object.keys(u.attempts).forEach(eid => activeExamIds.add(eid));
  });

  const filteredExams = initialExams.filter(e => activeExamIds.has(e.id));

  const requestSort = (key: 'fullName' | 'uniqueId' | 'avgScore') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  return {
    searchTerm,
    setSearchTerm,
    sortConfig,
    requestSort,
    identifierBasis,
    setIdentifierBasis,
    loading,
    filteredUsers,
    filteredExams,
    selectedAttemptId,
    setSelectedAttemptId,
    isSortDropdownOpen,
    setIsSortDropdownOpen,
    isIdentDropdownOpen,
    setIsIdentDropdownOpen,
    sortDropdownRef,
    identDropdownRef
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
