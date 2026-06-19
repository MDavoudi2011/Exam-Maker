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

  if (slugParts.length > 0) {
    const first = slugParts[0];
    if (first === 'exams') {
      initialTab = 'exams';
      if (slugParts.length > 1) {
        initialParam = slugParts[1];
      }
    }
    if (first === 'users') initialTab = 'users';
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
    />
  );
}
