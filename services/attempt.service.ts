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
  getAttemptsForPerformanceTab: async (examIds?: string[]) => {
    const supabase = createClient();
    let query = supabase.from('test_attempts')
      .select('id, full_name, national_code, personnel_code, org_title, class_name, school, district, score, exam_id, status, created_at, completed_at')
      .order('created_at', { ascending: false });
      
    if (examIds && examIds.length > 0) {
      query = query.in('exam_id', examIds);
    } else if (examIds && examIds.length === 0) {
      // If array is empty, return empty result instead of all
      return { data: [], error: null };
    }
      
    return query;
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
