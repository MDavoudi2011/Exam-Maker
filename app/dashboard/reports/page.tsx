import { dashboardServer } from '@/services/dashboard.server';
import { Reports } from '@/components/reports/Reports';

export const dynamic = 'force-dynamic';

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { initialExams } = await dashboardServer.getInitialData(false);
  const resolvedSearchParams = await searchParams;
  const examId = typeof resolvedSearchParams?.examId === 'string' ? resolvedSearchParams.examId : null;

  return <Reports initialExams={initialExams} initialSelectedExamId={examId} initialSubTab="reports" />;
}
