/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { questionService } from '@/services/question.service';
import { examService } from '@/services/exam.service';
import { attemptService } from '@/services/attempt.service';

export function useOverview(initialExams: any[]) {
  const [stats, setStats] = useState({
    totalParticipants: 0,
    avgScore: 0,
    avgTime: 0,
  });
  const [chartData, setChartData] = useState<{name: string, value: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchStats = useCallback(async () => {
    if (!initialExams || initialExams.length === 0) {
      setLoading(false);
      return;
    }
    
    const examIds = initialExams.map(e => e.id);

    try {
      const [attemptsRes, maxScoresRes] = await Promise.all([
        attemptService.getCompletedAttemptsByExamIds(examIds),
        examService.getExamMaxScores(examIds)
      ]);
      
      const attempts = attemptsRes.data;
      const examQuestions = maxScoresRes.data;

      // Calculate max scores per exam
      const examMaxScores: Record<string, number> = {};
      if (examQuestions) {
        examQuestions.forEach(eq => {
          if (!examMaxScores[eq.exam_id]) examMaxScores[eq.exam_id] = 0;
          // Extract point_value. Fallback to 10 if null/undefined.
          const qObj = Array.isArray(eq.questions) ? eq.questions[0] : eq.questions;
          const pts = (qObj as any)?.point_value ?? 10;
          examMaxScores[eq.exam_id] += pts;
        });
      }

      if (attempts && attempts.length > 0) {
        const uniqueUsers = new Set();
        attempts.forEach(att => {
           const identifier = att.national_code || att.personnel_code;
           if (identifier) uniqueUsers.add(identifier);
        });
        const totalParticipants = uniqueUsers.size;
        
        let totalPercentage = 0;
        let totalSeconds = 0;
        let timeCount = 0;

        const last7Days = Array.from({length: 7}, (_, i) => {
           const d = new Date();
           d.setDate(d.getDate() - (6 - i));
           return { date: d.toISOString().split('T')[0], count: 0, name: new Intl.DateTimeFormat('fa-IR', { weekday: 'short' }).format(d) };
        });

        attempts.forEach(attempt => {
          const score = attempt.score || 0;
          const maxScore = examMaxScores[attempt.exam_id] || 1; // avoid division by zero
          const percentage = (score / maxScore) * 100;
          totalPercentage += percentage;
          
          if (attempt.created_at && attempt.completed_at) {
             const start = new Date(attempt.created_at).getTime();
             const end = new Date(attempt.completed_at).getTime();
             const diff = (end - start) / 1000;
             if (diff > 0 && diff < 3600 * 5) {
               totalSeconds += diff;
               timeCount++;
             }
          }

          if (attempt.completed_at) {
             const completedDate = new Date(attempt.completed_at).toISOString().split('T')[0];
             const dayObj = last7Days.find(d => d.date === completedDate);
             if (dayObj) {
               dayObj.count += 1;
             }
          }
        });

        setStats({
          totalParticipants,
          avgScore: attempts.length > 0 ? Math.round(totalPercentage / attempts.length) : 0,
          avgTime: timeCount > 0 ? Math.round((totalSeconds / timeCount) / 60) : 0
        });

        setChartData(last7Days.map(d => ({ name: d.name, value: d.count })));
      } else {
         const last7Days = Array.from({length: 7}, (_, i) => {
           const d = new Date();
           d.setDate(d.getDate() - (6 - i));
           return { name: new Intl.DateTimeFormat('fa-IR', { weekday: 'short' }).format(d), value: 0 };
         });
         setChartData(last7Days);
      }
    } catch (err) {
      console.error("Error fetching stats", err);
    } finally {
      setLoading(false);
    }
  }, [initialExams]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    chartData,
    loading
  };
}
