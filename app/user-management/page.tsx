import { dashboardServer } from '@/services/dashboard.server';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function UserManagementPage() {
  const { user, userRole, initialExams } = await dashboardServer.getInitialData(true);

  if (userRole !== 'admin') {
    redirect('/dashboard');
  }

  return <AdminDashboard user={user} userRole={userRole} initialExams={initialExams} initialTab="user-management" />;
}
