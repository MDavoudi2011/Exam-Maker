import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { examService } from '@/services/exam.service';

export const dashboardServer = {
  getInitialData: async (isAdminRoute = false) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect('/login');
    }

    let userRole = 'user';
    let username = '';
    let display_name = '';
    try {
      const { data: profile } = await supabase.from('profiles').select('role, username, display_name').eq('id', user.id).single();
      if (profile?.role) {
        userRole = profile.role;
      }
      if (profile?.username) {
        username = profile.username;
      }
      if (profile?.display_name) {
        display_name = profile.display_name;
      }
      user.user_metadata = { ...user.user_metadata, username, display_name };
    } catch(err) {
      console.error("Profile fetch failed", err);
    }

    // Role-based routing enforces
    if (isAdminRoute && userRole !== 'admin') {
      redirect('/dashboard');
    }
    
    // We do NOT redirect admin to /admin here because the page might need to redirect to a specific admin subpath. 
    // Instead, we return a flag indicating they should be redirected.

    let initialExams: any[] = [];
    try {
      if (userRole === 'admin') {
        const { data } = await examService.getAllExams(); // Admin sees all
        if (data) initialExams = data;
      } else {
        const { data } = await supabase.from('exams').select('*, exam_questions(count)').eq('created_by', user.id).order('created_at', { ascending: false });
        if (data) initialExams = data;
      }
    } catch (err) {
      console.error("Supabase fetch failed", err);
    }

    return { user, userRole, initialExams };
  }
};
