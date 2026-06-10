import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ClientDashboard from '@/components/ClientDashboard';

export const dynamic = 'force-dynamic';

export default async function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  let initialExams: any[] = [];
  try {
    const { data } = await supabase.from('exams').select('*, exam_questions(count)').order('created_at', { ascending: false });
    if (data) {
      initialExams = data;
    }
  } catch (err) {}

  // Fetch exam and questions
  const { data: exam, error } = await supabase.from('exams').select('*').eq('id', id).single();
  
  if (error || !exam) {
    redirect('/dashboard');
  }

  const { data: questions } = await supabase.from('exam_questions').select('*, questions(*)').eq('exam_id', id).order('order_index', { ascending: true });

  return <ClientDashboard user={user} initialExams={initialExams} initialTab="edit" initialParam={id} initialExam={exam} initialQuestions={questions || []} />;
}
