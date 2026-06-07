import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ClientDashboard from '@/components/ClientDashboard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let initialExams: any[] = [];
  try {
    const { data } = await supabase.from('exams').select('*, exam_questions(count)').order('created_at', { ascending: false });
    if (data) {
      initialExams = data;
    }
  } catch (err) {
    console.error("Supabase fetch failed", err);
  }

  return <ClientDashboard user={user} initialExams={initialExams} />;
}
