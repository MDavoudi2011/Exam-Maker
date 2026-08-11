import { dashboardServer } from '@/services/dashboard.server';
import { Overview } from '@/components/overview/Overview';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const { initialExams } = await dashboardServer.getInitialData(true);

  return <Overview initialExams={initialExams} />;
}
