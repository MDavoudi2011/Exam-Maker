import { dashboardServer } from '@/services/dashboard.server';
import { Reports } from '@/components/reports/Reports';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // Pass true to get admin initial data (all exams instead of user's)
  const { initialExams } = await dashboardServer.getInitialData(true);
  const resolvedSearchParams = await searchParams;
  const examId = typeof resolvedSearchParams?.examId === 'string' ? resolvedSearchParams.examId : null;

  return <Reports initialExams={initialExams} initialSelectedExamId={examId} initialSubTab="reports" />;
}
