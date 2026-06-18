import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/AdminDashboard';
import { examService } from '@/services/exam.service';

export const dynamic = 'force-dynamic';

export default async function AdminCatchAllPage({ params }: { params: { slug?: string[] } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let userRole = 'user';
  
  try {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role) {
      userRole = profile.role;
    }
  } catch(err) {
    console.error("Profile fetch failed", err)
  }

  if (userRole !== 'admin') {
    redirect('/dashboard');
  }

  let initialExams: any[] = [];
  try {
    const { data } = await examService.getAllExams();
    if (data) {
      initialExams = data;
    }
  } catch (err) {
    console.error("Supabase fetch failed", err);
  }

  const slugParts = params?.slug || [];
  let initialTab = 'overview';
  let initialParam: string | null = null;

  if (slugParts.length > 0) {
    const first = slugParts[0];
    if (first === 'exams') initialTab = 'exams';
    if (first === 'users') initialTab = 'users';
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
    />
  );
}
