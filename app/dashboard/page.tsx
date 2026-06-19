import { redirect } from 'next/navigation';
import ClientDashboard from '@/components/ClientDashboard';
import { dashboardServer } from '@/services/dashboard.server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { user, userRole, initialExams } = await dashboardServer.getInitialData(false);

  if (userRole === 'admin') {
    redirect('/admin');
  }

  return <ClientDashboard user={user} initialExams={initialExams} userRole={userRole} />;
}
