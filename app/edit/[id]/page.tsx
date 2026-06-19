import { redirect } from 'next/navigation';
import ClientDashboard from '@/components/ClientDashboard';
import { dashboardServer } from '@/services/dashboard.server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, userRole, initialExams } = await dashboardServer.getInitialData(false);

  if (userRole === 'admin') {
    // maybe redirect to /admin/exams/edit/:id or something? Actually admin can just use old link or standard one?
    // Wait, we don't have a distinct edit page for admin, it's just /dashboard for user. Let's redirect to /admin if they are admin.
    // Wait, admins might want to edit. If so, they can stay on this page?
    // Or we should redirect to /admin? Edit isn't in admin dashboard...
    // Actually we'll just let them use this page but with ClientDashboard, this component itself doesn't have an admin version.
    // wait AdminDashboard doesn't have an edit tab!
    // So edit remains a separate page for everyone?
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
