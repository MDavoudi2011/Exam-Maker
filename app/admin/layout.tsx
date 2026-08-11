import { redirect } from 'next/navigation';
import { dashboardServer } from '@/services/dashboard.server';
import { AdminLayout } from '@/components/layout/AdminLayout';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { user, userRole } = await dashboardServer.getInitialData(true);

  if (!user) {
    redirect('/login');
  }

  if (userRole !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <AdminLayout user={user} userRole={userRole}>
      {children}
    </AdminLayout>
  );
}
