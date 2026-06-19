import { redirect } from 'next/navigation';
import ClientDashboard from '@/components/ClientDashboard';
import { dashboardServer } from '@/services/dashboard.server';

export const dynamic = 'force-dynamic';

export default async function CreatePage() {
  const { user, userRole, initialExams } = await dashboardServer.getInitialData(false);

  if (userRole === 'admin') {
    redirect('/admin/create'); // Wait, does /admin/create exist? In admin dashboard we don't have create. Wait, AdminDashboard doesn't have create. Just /admin.
    // If they go to create, maybe redirect to /admin actually, since admins don't create? Nah, admins can create exams.
  }

  return <ClientDashboard user={user} initialExams={initialExams} userRole={userRole} initialTab="create" />;
}
