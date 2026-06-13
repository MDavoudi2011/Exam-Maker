import { createClient } from '@/lib/supabase/client';

export const questionService = {
  getQuestions: async () => {
    const supabase = createClient();
    return supabase.from('questions').select('*').order('topic').order('created_at', { ascending: false }).order('id');
  },
  createQuestion: async (data: any) => {
    const supabase = createClient();
    return supabase.from('questions').insert(data);
  },
  updateQuestion: async (id: string, data: any) => {
    const supabase = createClient();
    return supabase.from('questions').update(data).eq('id', id);
  },
  deleteQuestion: async (id: string) => {
    const supabase = createClient();
    return supabase.from('questions').delete().eq('id', id);
  }
};
