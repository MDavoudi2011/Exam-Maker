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
  let userRole = 'user';
  
  try {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role) {
      userRole = profile.role;
    }
  } catch(err) {
    console.error("Profile fetch failed (migration might be missing)", err)
  }

  if (userRole === 'admin') {
    redirect('/admin');
  }

  try {
    const { data } = await supabase.from('exams').select('*, exam_questions(count)').eq('created_by', user.id).order('created_at', { ascending: false });
    if (data) {
      initialExams = data;
    }
  } catch (err) {
    console.error("Supabase fetch failed", err);
  }

  return <ClientDashboard user={user} initialExams={initialExams} userRole={userRole} />;
}
