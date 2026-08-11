import { dashboardServer } from '@/services/dashboard.server';
import { Overview } from '@/components/overview/Overview'; // Temporarily using the old one, will move later

export const dynamic = 'force-dynamic';

export default async function DashboardOverviewPage() {
  const { initialExams } = await dashboardServer.getInitialData(false);

  // We will need to update Overview to not use the handleNavigate callback from the old structure.
  return <Overview initialExams={initialExams} />;
}
