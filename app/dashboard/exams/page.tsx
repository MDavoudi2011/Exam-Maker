import { dashboardServer } from '@/services/dashboard.server';
import { ExamsList } from '@/components/exams/ExamsList';

export const dynamic = 'force-dynamic';

export default async function ExamsPage() {
  const { initialExams } = await dashboardServer.getInitialData(false);

  return <ExamsList initialExams={initialExams} onDataChanged={() => {}} initialSearchTerm={''} />;
}
