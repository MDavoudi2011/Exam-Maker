import { redirect } from 'next/navigation';
import ClientDashboard from '@/components/ClientDashboard';
import { dashboardServer } from '@/services/dashboard.server';

export const dynamic = 'force-dynamic';

export default async function ResultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, userRole, initialExams } = await dashboardServer.getInitialData(false);

  if (userRole === 'admin') {
    redirect(`/admin/result/${id}`);
  }

  return <ClientDashboard user={user} initialExams={initialExams} userRole={userRole} initialTab="reports" initialParam={id} />;
}
