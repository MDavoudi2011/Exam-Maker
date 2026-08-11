import { dashboardServer } from '@/services/dashboard.server';
import { ExamsList } from '@/components/exams/ExamsList';

export const dynamic = 'force-dynamic';

export default async function AdminExamsPage() {
  const { initialExams } = await dashboardServer.getInitialData(true);

  return <ExamsList initialExams={initialExams} onDataChanged={() => {}} initialSearchTerm={''} isAdmin={true} />;
}
