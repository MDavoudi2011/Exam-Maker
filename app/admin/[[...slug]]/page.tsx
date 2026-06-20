import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/AdminDashboard';
import { dashboardServer } from '@/services/dashboard.server';

export const dynamic = 'force-dynamic';

export default async function AdminCatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const { user, userRole, initialExams } = await dashboardServer.getInitialData(true);

  if (userRole !== 'admin') {
    redirect('/dashboard');
  }

  const slugParts = slug || [];
  let initialTab = 'overview';
  let initialParam: string | null = null;
  let initialExam: any = undefined;
  let initialQuestions: any[] = [];

  if (slugParts.length > 0) {
    const first = slugParts[0];
    if (first === 'exams') {
      initialTab = 'exams';
      if (slugParts.length > 1) {
        initialParam = slugParts[1];
      }
    }
    if (first === 'create') initialTab = 'create';
    if (first === 'edit') {
      initialTab = 'edit';
      if (slugParts.length > 1) {
        initialParam = slugParts[1];
        
        // Fetch exam to prevent flash of loading state
        const { createClient } = await import('@/lib/supabase/server');
        const supabase = await createClient();
        const { data: exam } = await supabase.from('exams').select('*').eq('id', initialParam).single();
        if (exam) {
          initialExam = exam;
          const { data: questions } = await supabase.from('exam_questions').select('*, questions(*)').eq('exam_id', initialParam).order('order_index', { ascending: true });
          initialQuestions = questions || [];
        } else {
            redirect('/admin/exams');
        }
      }
    }
    if (first === 'users') initialTab = 'users';

    // ... continue as before
    if (first === 'user-management') initialTab = 'user-management';
    if (first === 'questions') initialTab = 'question-bank';
    if (first === 'result') {
      initialTab = 'reports';
      if (slugParts.length > 1) {
        initialParam = slugParts[1];
      }
    }
  }

  return (
    <AdminDashboard 
      user={user} 
      initialExams={initialExams} 
      userRole={userRole} 
      initialTab={initialTab}
      initialParam={initialParam}
      initialExam={initialExam}
      initialQuestions={initialQuestions}
    />
  );
}
