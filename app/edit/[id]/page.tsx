import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ExamEditor } from '@/components/dashboard/ExamEditor';

export const dynamic = 'force-dynamic';

export default async function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  // fetch exam and questions
  const { data: exam, error } = await supabase.from('exams').select('*').eq('id', id).single();
  
  if (error || !exam) {
    redirect('/dashboard');
  }

  const { data: questions } = await supabase.from('exam_questions').select('*, questions(*)').eq('exam_id', id).order('order_index', { ascending: true });

  return <ExamEditor exam={exam} initialQuestions={questions || []} user={user} />;
}
