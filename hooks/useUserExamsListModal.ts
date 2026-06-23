import { useMemo } from 'react';
import { toFarsiNumber } from '@/utils/text.util';

export function useUserExamsListModal(user: any, exams: any[]) {
  const attemptsWithDetails = useMemo(() => {
    if (!user || !user.allAttempts) return [];
    
    return user.allAttempts.map((attempt: any) => {
      const exam = exams.find((e: any) => e.id === attempt.exam_id);
      const creatorName = exam?.profiles?.display_name || exam?.profiles?.username || (exam?.profiles?.email ? exam.profiles.email.split('@')[0] : null);
      
      const startedAt = attempt.created_at 
        ? toFarsiNumber(new Date(attempt.created_at).toLocaleString('fa-IR', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' })) 
        : '-';

      const completedAt = attempt.completed_at 
        ? toFarsiNumber(new Date(attempt.completed_at).toLocaleString('fa-IR', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' })) 
        : '-';

      return {
        ...attempt,
        examTitle: exam?.title || 'آزمون نامشخص',
        creatorName: creatorName || '-',
        isCompleted: attempt.status === 'completed',
        startedAt,
        completedAt,
      };
    });
  }, [user, exams]);

  return {
    attemptsWithDetails
  };
}
