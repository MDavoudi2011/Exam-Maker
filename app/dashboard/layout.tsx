import { redirect } from 'next/navigation';
import { dashboardServer } from '@/services/dashboard.server';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { user, userRole } = await dashboardServer.getInitialData(false);

  if (!user) {
    redirect('/login');
  }

  if (userRole === 'admin') {
    redirect('/admin');
  }

  return (
    <DashboardLayout user={user} userRole={userRole}>
      {children}
    </DashboardLayout>
  );
}
