import { createClient } from '@/lib/supabase/client';

export const attemptService = {
  getAllAttempts: async () => {
    const supabase = createClient();
    return supabase.from('test_attempts').select('*, exams(*)').order('created_at', { ascending: false });
  },
  getCompletedAttemptsByExamIds: async (examIds: string[]) => {
    const supabase = createClient();
    return supabase.from('test_attempts')
      .select('exam_id, score, completed_at, created_at, national_code, personnel_code')
      .in('exam_id', examIds)
      .eq('status', 'completed');
  },
  getAttemptsForPerformanceTab: async () => {
    const supabase = createClient();
    return supabase.from('test_attempts')
      .select('id, full_name, national_code, personnel_code, score, exam_id')
      .order('created_at', { ascending: false });
  },
  getAttemptsByExamId: async (examId: string) => {
    const supabase = createClient();
    return supabase.from('test_attempts')
      .select('id, full_name, national_code, personnel_code, org_title, class_name, school, district, score, created_at, completed_at, status')
      .eq('exam_id', examId)
      .order('completed_at', { ascending: false });
  },
  getAttemptCountsPerExam: async () => {
    const supabase = createClient();
    return supabase.from('test_attempts').select('exam_id');
  },
  getAttemptById: async (id: string) => {
    const supabase = createClient();
    return supabase.from('test_attempts').select('*').eq('id', id).single();
  },
  getAttemptWithExam: async (id: string) => {
    const supabase = createClient();
    return supabase.from('test_attempts').select('*, exams(*)').eq('id', id).single();
  },
  createAttempt: async (data: any) => {
    const supabase = createClient();
    return supabase.from('test_attempts').insert(data).select().single();
  },
  getAnswersByAttemptId: async (attemptId: string) => {
    const supabase = createClient();
    return supabase.from('test_answers').select('*').eq('attempt_id', attemptId);
  },
  createAnswers: async (data: any[]) => {
    const supabase = createClient();
    return supabase.from('test_answers').insert(data);
  }
};
