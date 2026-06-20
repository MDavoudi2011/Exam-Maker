import { redirect } from 'next/navigation';
import ClientDashboard from '@/components/ClientDashboard';
import { dashboardServer } from '@/services/dashboard.server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, userRole, initialExams } = await dashboardServer.getInitialData(false);

  if (userRole === 'admin') {
    redirect(`/admin/edit/${id}`);
  }

  const supabase = await createClient();
  
  // Fetch exam and questions
  const { data: exam, error } = await supabase.from('exams').select('*').eq('id', id).single();
  
  if (error || !exam) {
    redirect('/dashboard');
  }

  const { data: questions } = await supabase.from('exam_questions').select('*, questions(*)').eq('exam_id', id).order('order_index', { ascending: true });

  return <ClientDashboard user={user} initialExams={initialExams} userRole={userRole} initialTab="edit" initialParam={id} initialExam={exam} initialQuestions={questions || []} />;
}
