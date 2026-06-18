import { createClient } from '@/lib/supabase/client';

export const examService = {
  getExams: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };
    return supabase.from('exams').select('*, exam_questions(count)').eq('created_by', user.id).order('created_at', { ascending: false }).order('id');
  },
  getAllExams: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    // Admin only method
    return supabase.from('exams').select('*, exam_questions(count), profiles(email)').order('created_at', { ascending: false }).order('id');
  },
  getExamById: async (id: string) => {
    const supabase = createClient();
    return supabase.from('exams').select('*').eq('id', id).single();
  },
  createExam: async (data: any) => {
    const supabase = createClient();
    return supabase.from('exams').insert(data).select().single();
  },
  updateExam: async (id: string, data: any) => {
    const supabase = createClient();
    return supabase.from('exams').update(data).eq('id', id);
  },
  deleteExam: async (id: string) => {
    const supabase = createClient();
    return supabase.from('exams').delete().eq('id', id);
  },
  getExamQuestions: async (examId: string) => {
    const supabase = createClient();
    return supabase.from('exam_questions').select('*, questions(*)').eq('exam_id', examId).order('order_index', { ascending: true });
  },
  getExamQuestionsBasic: async (examId: string) => {
    const supabase = createClient();
    return supabase.from('exam_questions').select('*').eq('exam_id', examId);
  },
  createExamQuestions: async (data: any[]) => {
    const supabase = createClient();
    return supabase.from('exam_questions').insert(data);
  },
  deleteExamQuestions: async (ids: string[]) => {
    const supabase = createClient();
    return supabase.from('exam_questions').delete().in('id', ids);
  },
  updateExamQuestionOrder: async (id: string, orderIndex: number) => {
    const supabase = createClient();
    return supabase.from('exam_questions').update({ order_index: orderIndex }).eq('id', id);
  },
  getExamMaxScores: async (examIds: string[]) => {
    const supabase = createClient();
    return supabase.from('exam_questions').select('exam_id, questions(point_value)').in('exam_id', examIds);
  }
};
